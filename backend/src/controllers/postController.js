const asyncHandler = require("express-async-handler");
const { checkIfValid, validateToken } = require("gusty-middlewares");
const { validateNewPost } = require("../utils/validationChains");
const prisma = require('../prisma/client');

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