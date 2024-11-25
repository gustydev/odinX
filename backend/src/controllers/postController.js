const asyncHandler = require("express-async-handler");
const { checkIfValid } = require("gusty-middlewares");
const { validateNewPost } = require("../utils/validationChains");
const prisma = require('../prisma/client');
const { postInclude } = require('../utils/queryFilters');
const { ForbiddenError } = require('gusty-custom-errors')

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
    validateNewPost,
    checkIfValid,

    asyncHandler(async (req, res, next) => {
        const post = await prisma.post.create({
            data: {
                content: req.body.content,
                authorId: req.user.id
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

    const placeholder = {
        authorId: null,
        content: 'Post deleted by user',
        postType: 'systemPost'
    }

    await prisma.post.update({where: { id: req.params.postId }, data: placeholder});

    return res.status(200).json({message: `Post #${post.id} deleted`})
});