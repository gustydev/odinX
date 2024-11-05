const user = require('express').Router()
const { validateToken } = require('gusty-middlewares');
const controller = require('../controllers/userController');

// Note: all of these should require authentication

user.get('/list') // List of users (add limit/pagination)

user.get('/:userId', validateToken, controller.getUserById) // user's details
user.get('/:userId/follows') // shows both following and followers
user.get('/:userId/posts')
user.get('/:userId/likes') // posts liked by user

user.post('/:userId/follow', validateToken, controller.followUser) // follow an user by id

user.put('/:userId') // update profile of user (display name, pfp, bio etc)

user.delete('/:userId')

module.exports = user;