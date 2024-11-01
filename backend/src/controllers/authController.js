require('dotenv').config();
const prisma = require('../prisma/client');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const { validateRegister } = require('../utils/validationChains');
const { ValidationError } = require('gusty-custom-errors')

exports.register = [
    validateRegister,

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            throw new ValidationError(errors.array());
        }

        const hashedPass = await bcrypt.hash(req.body.password, 10)

        const user = await prisma.user.create({
            data: {
                username: req.body.username,
                password: hashedPass,
                displayName: req.body.displayName || undefined,
                demo: req.body.demo
            }
        })

        return res.status(200).json({msg: 'User created successfully', user: {
            id: user._id,
            username: user.username,
            displayName: user.displayName,
        }})
    })
]