const post = require('express').Router()
const { validateToken } = require('gusty-middlewares');
const controller = require('../controllers/postController');

post.get('/list', validateToken, controller.getPosts)

post.get('/:postId', validateToken, controller.getPostById)
post.get('/:postId/replies', validateToken, controller.getPostReplies)
post.get('/:postId/likes', validateToken, controller.getPostLikes)

post.post('/', validateToken, controller.newPost) // post a new post

post.post('/:postId/reply', validateToken, controller.replyToPost) // post a reply (which is itself a post) to a post
post.post('/:postId/like', validateToken, controller.likePost) // like or unlike a post 

post.put('/:postId') // edit a post

post.delete('/:postId')

module.exports = post;