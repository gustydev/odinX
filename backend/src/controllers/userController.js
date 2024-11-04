const asyncHandler = require('express-async-handler');
const { validateToken } = require('gusty-middlewares');
const prisma = require('../prisma/client');

exports.getUserById = [
    validateToken,

    asyncHandler(async (req, res, next) => {
        const user = await prisma.user.findUnique({where: {id: req.params.id}, omit: {password: true}})

        return res.status(200).json(user);
    })
]