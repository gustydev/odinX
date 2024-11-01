require('dotenv').config();
const prisma = require('../prisma/client');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler');
const { validateRegister } = require('../utils/validationChains');
const { checkIfValid } = require('gusty-middlewares')

exports.register = [
    validateRegister,
    checkIfValid,

    asyncHandler(async (req, res, next) => {
        const hashedPass = await bcrypt.hash(req.body.password, 10)

        const user = await prisma.user.create({
            data: {
                username: req.body.username,
                password: hashedPass,
                displayName: req.body.displayName || req.body.username,
                demo: req.body.demo
            }
        })

        return res.status(200).json({msg: 'User created successfully', user: {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
        }})
    })
]