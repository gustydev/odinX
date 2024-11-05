const post = require('express').Router()
const { validateToken } = require('gusty-middlewares');
const controller = require('../controllers/postController');
const { convertParams } = require('../middlewares/convertParams');

post.get('/list', validateToken, controller.getPosts)

post.get('/:postId', convertParams, validateToken, controller.getPostById)
post.get('/:postId/replies', convertParams,validateToken, controller.getPostReplies)
post.get('/:postId/likes', convertParams, validateToken, controller.getPostLikes)

post.post('/', validateToken, controller.newPost) // post a new post

post.post('/:postId/reply', convertParams, validateToken, controller.replyToPost) // post a reply (which is itself a post) to a post
post.post('/:postId/like', convertParams, validateToken, controller.likePost) // like or unlike a post 

post.put('/:postId', convertParams) // edit a post

post.delete('/:postId', convertParams)

module.exports = post;