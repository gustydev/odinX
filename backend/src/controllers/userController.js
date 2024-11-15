const asyncHandler = require('express-async-handler');
const prisma = require('../prisma/client');
const { validateProfileEdit } = require("../utils/validationChains");
const { postInclude, userQuery } = require('../utils/queryFilters');

exports.getUserById = [
    asyncHandler(async (req, res, next) => {
        const user = await prisma.user.findUnique({...userQuery, where: { id: req.params.userId }})

        return res.status(200).json(user);
    })
]

exports.getUsersList = asyncHandler(async (req, res, next) => {
    const { page, limit, filter } = req.query;

    const users = await prisma.user.findMany({
        skip: (page - 1) * limit || undefined,
        take: Number(limit) || undefined,
        // where: {
        //     OR: [
        //         { displayName: { contains: filter } },
        //         { username: { contains: filter } }
        //     ]
        // },
        omit: {password: true}
    });

    return res.status(200).json(users);
})

exports.getUserPosts = asyncHandler(async (req, res, next) => {
    let { page, limit, filter, sort = 'desc', replies = false } = req.query;

    if (replies === 'false') replies = false;

    const posts = await prisma.post.findMany({
        skip: (page - 1) * limit || undefined,
        take: Number(limit) || undefined,
        orderBy: {
            postDate: sort
        },
        where: {
            authorId: req.params.userId,
            content: { contains: filter },
            parentPostId: !replies ? null : {not: null}
            // if replies = false, parentPostId = null; otherwise, parentPostId is non-null.
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
        
        const user = await prisma.user.update({...userQuery, where: { id: req.params.userId },
            data: {
                displayName: req.body.displayName || current.username,
                bio: req.body.bio
            }
        });

        return res.status(200).json(user);
    })
];