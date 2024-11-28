const asyncHandler = require('express-async-handler');
const prisma = require('../prisma/client');
const { validateProfileEdit } = require("../utils/validationChains");
const { postInclude, userQuery } = require('../utils/queryFilters');
const { ForbiddenError } = require('gusty-custom-errors');
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage(), limits: {fileSize: 3 * 1024 * 1024}}) // 3MB Limit
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    secure: true
});

exports.getUserById = [
    asyncHandler(async (req, res, next) => {
        const user = await prisma.user.findUnique({...userQuery, where: { id: req.params.userId }})

        return res.status(200).json(user);
    })
]

exports.getUsersList = asyncHandler(async (req, res, next) => {
    const { page, limit } = req.query;

    const users = await prisma.user.findMany({...userQuery,
        skip: (page - 1) * limit || undefined,
        take: Number(limit) || undefined
    });

    return res.status(200).json(users);
})

exports.getUserPosts = asyncHandler(async (req, res, next) => {
    let { page, limit, filter, sort = 'desc', replies = false, likes = false } = req.query;

    // convert string 'false' to boolean
    if (replies === 'false') replies = false;
    if (likes === 'false') likes = false;

    const posts = await prisma.post.findMany({
        skip: (page - 1) * limit || undefined,
        take: Number(limit) || undefined,
        orderBy: {
            postDate: sort
        },
        where: {
            authorId: likes ? undefined : req.params.userId,
            // Likes=true query returns posts of any authors
            content: { contains: filter },
            parentPostId: replies ? { not: null } : likes ? undefined : null,
            // replies=true returns only replies (combined with likes=true, only liked replies)
            // replies=false and likes=true returns any posts liked
            // likes=false and replies=false returns only original posts
            likes: likes ? { some: { likedById: req.params.userId } } : undefined,
            postType: 'userPost' // Do not return "deleted" posts
        },
        include: postInclude
    })

    return res.status(200).json(posts);
})

exports.followUser = asyncHandler(async (req, res, next) => {
    if (req.params.userId === req.user.id) {
        const error = new Error('Cannot follow oneself');
        error.statusCode = 400;
        return next(error);
    }

    const checkFollow = await prisma.user.findFirst({
        where: {
            AND: [
                { id: req.params.userId },
                { followers: { some: { id: req.user.id } } }
            ]
        }
    }) 

    const user = await prisma.user.update({...userQuery, 
        where: { id: req.params.userId },
        data: {
            followers: {
                [checkFollow ? 'disconnect' : 'connect']: { id: req.user.id }
            }
    }});

    res.status(200).json(user)
})

exports.editProfile = [
    upload.single('pic'),

    validateProfileEdit,

    asyncHandler(async (req, res, next) => {
        const current = await prisma.user.findUnique({where: {id: req.params.userId}});

        if (current.id !== req.user.id) {
            throw new ForbiddenError("Cannot edit someone else's profile")
        }

        let imgUrl, fileId;
        
        if (req.file && !req.body.deletePic) {
            if (!req.file.mimetype.startsWith('image/') || req.file.size === 0) {
                const error = new Error('Invalid file: must be an image, and must have more than 0 bytes')
                error.statusCode = 400;
                throw error;
            }

            await new Promise((resolve) => {
                cloudinary.uploader.upload_stream({resource_type: 'image'}, (error, result) => {
                    return resolve(result)
                }).end(req.file.buffer)
            }).then(result => {
                console.log('Buffer uplodaded: ', result.public_id)
                imgUrl = result.secure_url
                fileId = result.public_id;
            })
        }

        if (req.body.deletePic) {
            imgUrl = null;
            fileId = null;

            await cloudinary.uploader.destroy(current.attachmentId).then(() => console.log('image deleted from cloud: ', current.attachmentId))
            // Delete image from cloud
        }
        
        const user = await prisma.user.update({...userQuery, where: { id: req.params.userId },
            data: {
                displayName: req.body.displayName || current.username,
                bio: req.body.bio,
                profilePicUrl: imgUrl,
                attachmentId: fileId
            }
        });

        return res.status(200).json(user);
    })
];

exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await prisma.user.findUnique({where: { id: req.params.userId }})

    if (user.id !== req.user.id) {
        throw new ForbiddenError('Cannot delete another user')
    }

    // Delete posts and replace them with placeholder
    const placeholder = {
        authorId: null,
        content: 'Post deleted by user',
        postType: 'systemPost'
    }

    await prisma.post.updateMany({ where: { authorId: user.id }, data: placeholder })

    // Delete any likes of the user
    await prisma.like.deleteMany({ where: { likedById: user.id } })

    // Finally, remove the user
    await prisma.user.delete({ where: { id: user.id } });

    return res.status(200).json({message: `User ${user.username} deleted.`})
})