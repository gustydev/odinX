const asyncHandler = require("express-async-handler");
const { checkIfValid } = require("gusty-middlewares");
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

exports.likePost = asyncHandler(async (req, res, next) => {
    const like = await prisma.like.create({
        data: {
            postId: Number(req.params.postId),
            likedById: req.user.id
        }
    });

    const post = await prisma.post.findUnique({where: {id: Number(req.params.postId)}})

    return res.status(200).json({post, like});
})