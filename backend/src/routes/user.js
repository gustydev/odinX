const user = require('express').Router()

// Note: all of these should require authentication

user.get('/list') // List of users (add limit/pagination)

user.get('/:userId') // user's details
user.get('/:userId/follows') // shows both following and followers
user.get('/:userId/posts')
user.get('/:userId/likes') // posts liked by user
user.get('/:userId/replies') // posts that have a parent post

user.post('/:userId/follow') // follow an user by id

user.put('/:userId') // update profile of user (display name, pfp, bio etc)

user.delete('/:userId')