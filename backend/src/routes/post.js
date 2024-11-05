const post = require('express').Router()
const { validateToken } = require('gusty-middlewares');
const controller = require('../controllers/postController');

// require authentication for all

post.get('/list', controller.getPosts) // list of all posts (limit and pagination!) (don't include replies unless specified, aka filter them out by default)

post.get('/:postId', controller.getPostById)
post.get('/:postId/replies')
post.get('/:postId/likes')

post.post('/', validateToken, controller.newPost) // post a new post

post.post('/:postId/reply', validateToken, controller.replyToPost) // post a reply (which is itself a post) to a post
post.post('/:postId/like', validateToken, controller.likePost) // like a post (or unlike!)

post.put('/:postId') // edit a post

post.delete('/:postId')

module.exports = post;