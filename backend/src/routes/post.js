const post = require('express').Router()
const { validateToken } = require('gusty-middlewares');
const controller = require('../controllers/postController');

// require authentication for all

post.get('/list') // list of all posts (limit and pagination!) (don't include replies unless specified, aka filter them out by default)

post.get('/:postId')
post.get('/:postId/replies')
post.get('/:postId/likes')

post.post('/', validateToken, controller.newPost) // post a new post

post.post('/:postId/reply') // post a reply (which is itself a post) to a post
post.post('/:postId/like') // like a post (or unlike!)

post.put('/:postId') // edit a post

post.delete('/:postId')

module.exports = post;