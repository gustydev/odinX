const asyncHandler = require("express-async-handler");
const { checkIfValid } = require("gusty-middlewares");
const { validateNewPost } = require("../utils/validationChains");
const prisma = require('../prisma/client');
const { postInclude } = require('../utils/queryFilters');
const { ForbiddenError } = require('gusty-custom-errors')
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage(), limits: {fileSize: 3 * 1024 * 1024}}) // 3MB Limit
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    secure: true
});

exports.getPosts = asyncHandler(async (req, res, next) => {
    let { page, limit, filter, sort = 'desc', replies = false, follows = false } = req.query;

    // convert string 'false' to boolean
    if (replies === 'false') replies = false;
    if (follows === 'false') follows = false;

    let user;

    if (follows) {
        user = await prisma.user.findUnique({where: {id: req.user.id}, include: {following: true}})
    }

    const posts = await prisma.post.findMany({
        skip: (page - 1) * limit || undefined,
        take: Number(limit) || undefined,
        orderBy: {
            postDate: sort
        },
        where: {
            content: { contains: filter },
            parentPostId: !replies ? null : {not: null}, // if replies = false, parentPostId = null; otherwise, parentPostId is non-null.
            author: follows ? { id: { in: user.following.map(f => f.id) } } : undefined,
            postType: 'userPost' // Do not return the "deleted by user" posts
        },
        include: postInclude
    })

    res.status(200).json(posts);
})

exports.getPostById = asyncHandler(async (req, res, next) => {
    const post = await prisma.post.findUnique({
        where: { id: req.params.postId },
        include: postInclude
    });

    res.status(200).json(post)
})

exports.getPostReplies = asyncHandler(async (req, res, next) => {
    const post = await prisma.post.findUnique({
        where: { id: Number(req.params.postId )},
        select: { replies: { include: postInclude, orderBy: { likes: { _count: 'desc' } } } },
    })

    res.status(200).json(post.replies)  
})

exports.getPostLikes = asyncHandler(async (req, res, next) => {
    const likes = await prisma.post.findUnique({
        where: { id: req.params.postId },
        select: { likes: { select: { likedBy: { select: { id: true, username: true, displayName: true } } } } }
        // return the id, username and display name of users who liked the post
    })

    res.status(200).json(likes)
})

exports.newPost = [
    upload.single('attachment'),

    validateNewPost,
    checkIfValid,

    asyncHandler(async (req, res, next) => {
        let fileUrl, fileType, fileId;

        if (req.file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];

            if (!validTypes.includes(req.file.mimetype) || req.file.size === 0) {
                const error = new Error('Invalid file: must be an image or video, and must have more than 0 bytes')
                error.statusCode = 400;
                throw error;
            }

            if (req.user.demo) {
                throw new ForbiddenError('Demo accounts cannot perform this action. Create a free account to do it!')
            }

            await new Promise((resolve) => {
                cloudinary.uploader.upload_stream({resource_type: 'auto'}, (error, result) => {
                    return resolve(result)
                }).end(req.file.buffer)
            }).then(result => {
                console.log('Buffer uplodaded: ', result.public_id)
                fileUrl = result.secure_url;
                fileType = result.resource_type;
                fileId = result.public_id;
            })
        }

        const post = await prisma.post.create({
            data: {
                content: req.body.content,
                authorId: req.user.id,
                attachmentUrl: fileUrl,
                attachmentType: fileType,
                attachmentId: fileId
            }
        })

        return res.status(200).json({message: 'Post created!', post})
    })
]

exports.likePost = asyncHandler(async (req, res, next) => {
    const postAndLikedByIds = {
        postId: req.params.postId, 
        likedById: req.user.id
    }

    const findLike = await prisma.like.findFirst({ where: postAndLikedByIds })

    let like;
    
    if (!findLike) {
        like = await prisma.like.create({ data: postAndLikedByIds });
    } else {
        await prisma.like.deleteMany({
            where: {
                AND: [
                    { postId: req.params.postId, likedById: req.user.id }]
            }
        })
    }  

    const post = await prisma.post.findUnique({where: {id: req.params.postId}, include: postInclude})

    return res.status(200).json({post, like});
})

exports.replyToPost = [
    validateNewPost,
    checkIfValid,

    asyncHandler(async (req, res, next) => {
        const reply = await prisma.post.create({
            data: {
                content: req.body.content,
                authorId: req.user.id,
                parentPostId: req.params.postId
            },
            include: postInclude
        });

        return res.status(200).json({message: 'Reply posted!', reply})
    })
]

exports.editPost = [
    validateNewPost,
    checkIfValid,

    asyncHandler(async (req, res, next) => {
        const postToBeEdited = await prisma.post.findFirst({where: {id: req.params.postId}})

        if (postToBeEdited.authorId !== req.user.id) {
            throw new ForbiddenError("Cannot edit someone else's post")
        }

        const post = await prisma.post.update({where: {id: req.params.postId}, data: {
            content: req.body.content,
            editDate: new Date()
        }})

        return res.status(200).json({message: 'Post updated', post})
    })
]

exports.deletePost = asyncHandler(async (req, res, next) => {
    const post = await prisma.post.findFirst({where: {id: req.params.postId}})

    if (post.authorId !== req.user.id) {
        throw new ForbiddenError("Cannot delete someone else's post")
    }

    if (post.attachmentId) {
        await cloudinary.uploader.destroy(post.attachmentId).then(() => console.log('File deleted from cloud: ', post.attachmentId))
        // Delete attachment from cloud
    }

    const placeholder = {
        authorId: null,
        content: 'Post deleted by user',
        postType: 'systemPost'
    }

    await prisma.post.update({where: { id: req.params.postId }, data: placeholder});

    return res.status(200).json({message: `Post #${post.id} deleted`})
});