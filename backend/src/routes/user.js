const user = require('express').Router()
const { validateToken } = require('gusty-middlewares');
const controller = require('../controllers/userController');
const { convertParams } = require("../middlewares/convertParams");

user.get('/list', validateToken, controller.getUsersList) // List of users (add limit/pagination)

user.get('/:userId', convertParams, validateToken, controller.getUserById) // user's details
user.get('/:userId/posts', convertParams, validateToken, controller.getUserPosts) // user's original posts, replies and liked posts

user.get('/:userId/follows', convertParams) // shows both following and followers

user.post('/:userId/follow', convertParams, validateToken, controller.followUser) // follow an user by id

user.put('/:userId', convertParams, validateToken, controller.editProfile) // update profile of user (display name, pfp, bio etc)

user.delete('/:userId', convertParams, validateToken, controller.deleteUser) // first deletes posts, then likes, then finally the user

module.exports = user;