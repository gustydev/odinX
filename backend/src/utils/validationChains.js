const prisma = require('../prisma/client');
const { body } = require('express-validator');
const bcrypt = require('bcryptjs')

exports.validateRegister = [
    body('username')
    .isString()
    .withMessage('Username must be a string')
    .trim()
    .isLength({min: 4, max: 30})
    .withMessage('Username must be between 4 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must have only alphanumeric characters (letters and numbers) and underscores')
    .custom(async (value) => {
        const user = await prisma.user.findFirst({where: {username: {equals: value, mode: 'insensitive'}}})
        if (user) {
            throw new Error('Username already taken')
        } 
    }),

    body('password')
    .isString()
    .withMessage('Password must be a string')
    .trim()
    .isLength({min: 8})
    .withMessage('Password must be at least 8 characters long')
    .isLength({max: 100})
    .withMessage('Password must be at most 100 characters long'),

    body('confirmPassword')
    .trim()
    .custom((value, {req}) => {
        if (value === req.body.password) {
            return true;
        }
        throw new Error('Passwords do not match')
    }),

    body('displayName')
    .optional({values: 'falsy'}) // considers falsy values optional (includes empty strings like "")
    .isString()
    .withMessage('Display name must be a string')
    .trim()
    .isLength({min: 1, max: 30})
    .withMessage('Display name must have at most 30 characters'),

    body('demo')
    .optional()
    .isBoolean()
    .withMessage('Demo must be set as true or false if provided')
];

exports.validateLogin = [
    body('username')
    .isString()
    .withMessage('Username must be a string')
    .trim()
    .custom(async (value) => {
        const user = await prisma.user.findFirst({where: {username: {equals: value, mode: 'insensitive'}}})
        if (!user) {
            throw new Error("User not found")
        }
    }),

    body('password')
    .isString()
    .withMessage('Password must be a string')
    .isLength({min: 8})
    .withMessage('Password must be at least 8 characters long')
    .isLength({max: 100})
    .withMessage('Password must at most 100 characters long')
    .custom(async (value, {req}) => {
        const user = await prisma.user.findFirst({where: {username: {equals: req.body.username, mode: 'insensitive'}}})
        if (!user) {
            return false;
        }

        const match = await bcrypt.compare(value, user.password);

        if (!match) { throw new Error('Incorrect password, please try again.')}
    })
]

exports.validateNewPost = [
    body('content')
    .isString()
    .withMessage('Post content must be a string')
    .trim()
    .isLength({max: 500})
    .withMessage('Post has a maximum length of 500 characters')
    .custom((content, {req}) => {
        if (!req.file && content.length < 1) {
            throw new Error('Post must have text content or an attachment')
        }

        return true
    }),
];

exports.validateProfileEdit = [
    body('displayName')
    .optional({values: 'falsy'}) // considers falsy values optional (includes empty strings like "")
    .isString()
    .withMessage('Display name must be a string')
    .trim()
    .isLength({min: 1, max: 30})
    .withMessage('Display name must have at most 30 characters'),

    body('bio')
    .optional({values: 'falsy'})
    .isString()
    .withMessage("Bio must be a string")
    .trim()
    .isLength({max: 250})
    .withMessage('Bio must have at most 250 characters'),

    body("deletePic")
    .optional({values: 'falsy'})
    .isBoolean()
    .withMessage('Delete pic must be true or false if provided'),
]