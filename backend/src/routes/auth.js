const auth = require('express').Router()
const controller = require('../controllers/authController');

auth.post('/register', controller.register);
auth.post('/login')

module.exports = auth;
