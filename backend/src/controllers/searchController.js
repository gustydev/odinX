const expressAsyncHandler = require('express-async-handler');
const { query } = require('express-validator');
const { checkIfValid } = require('gusty-middlewares');
const prisma = require('../prisma/client');
const { postInclude } = require('../utils/queryFilters');

exports.search = [
    query('q')
    .isString()
    .withMessage('Search query must be a string')
    .trim()
    .isLength({min: 1})
    .withMessage('Search query must be at least one character long')
    .isLength({max: 50})
    .withMessage('Search query must be at most 50 characters long'),

    checkIfValid,

    expressAsyncHandler(async (req, res, next) => {
        const containsQuery = { contains: req.query.q, mode: 'insensitive' };

        const posts = await prisma.post.findMany({
            where: { content: containsQuery }, 
            include: postInclude,
            orderBy: { postDate: 'desc' }
        })
        
        const users = await prisma.user.findMany({
            where: { OR: [
                { username: containsQuery },
                { displayName: containsQuery }
            ]},
            omit: { password: true }
        });

        return res.status(200).json({posts, users});
    })
]