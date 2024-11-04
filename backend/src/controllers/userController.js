const asyncHandler = require('express-async-handler');
const prisma = require('../prisma/client');

exports.getUserById = [
    asyncHandler(async (req, res, next) => {
        const user = await prisma.user.findUnique({where: {id: req.params.id}, omit: {password: true}})

        return res.status(200).json(user);
    })
]