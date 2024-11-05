const asyncHandler = require('express-async-handler');
const prisma = require('../prisma/client');

exports.getUserById = [
    asyncHandler(async (req, res, next) => {
        const user = await prisma.user.findUnique({where: {id: Number(req.params.userId)}, omit: {password: true}})

        return res.status(200).json(user);
    })
]

exports.followUser = asyncHandler(async (req, res, next) => {
    if (Number(req.params.userId) === req.user.id) {
        const error = new Error('Cannot follow oneself');
        error.statusCode = 400;
        return next(error);
    }

    const checkFollow = await prisma.user.findFirst({
        where: {
            AND: [
                { id: Number(req.params.userId) },
                { followers: { some: { id: req.user.id } } }
            ]
        }
    }) 

    const user = await prisma.user.update({
        where: { id: Number(req.params.userId) },
        data: {
            followers: {
                [checkFollow ? 'disconnect' : 'connect']: { id: req.user.id }
            }
        },
        include: {
            followers: { omit: { password: true } }
        },
        omit: { password: true }
    });

    res.status(200).json(user)
})