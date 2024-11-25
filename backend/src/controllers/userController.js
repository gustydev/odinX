const asyncHandler = require('express-async-handler');
const prisma = require('../prisma/client');
const { validateProfileEdit } = require("../utils/validationChains");
const { postInclude, userQuery } = require('../utils/queryFilters');
const { ForbiddenError } = require('gusty-custom-errors');

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
            likes: likes ? { some: { likedById: req.params.userId } } : undefined
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
    validateProfileEdit,

    asyncHandler(async (req, res, next) => {
        const current = await prisma.user.findUnique({where: {id: req.params.userId}});

        if (!current.id === user.id) {
            throw new ForbiddenError("Cannot edit someone else's profile")
        }
        
        const user = await prisma.user.update({...userQuery, where: { id: req.params.userId },
            data: {
                displayName: req.body.displayName || current.username,
                bio: req.body.bio
            }
        });

        return res.status(200).json(user);
    })
];