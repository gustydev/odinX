const user = require('express').Router()
const { validateToken } = require('gusty-middlewares');
const controller = require('../controllers/userController');
const { convertParams } = require("../middlewares/convertParams");

user.get('/list', validateToken, controller.getUsersList) // List of users (add limit/pagination)

user.get('/:userId', convertParams, validateToken, controller.getUserById) // user's details
user.get('/:userId/follows', convertParams) // shows both following and followers
user.get('/:userId/posts', convertParams, validateToken, controller.getUserPosts)
user.get('/:userId/replies', convertParams);
user.get('/:userId/likes', convertParams) // posts liked by user

user.post('/:userId/follow', convertParams, validateToken, controller.followUser) // follow an user by id

user.put('/:userId', convertParams) // update profile of user (display name, pfp, bio etc)

user.delete('/:userId', convertParams)

module.exports = user;