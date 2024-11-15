const search = require('express').Router()
const { validateToken } = require('gusty-middlewares');
const controller = require('../controllers/searchController');

search.get('/', validateToken, controller.search);

module.exports = search;