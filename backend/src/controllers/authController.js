require('dotenv').config();
const prisma = require('../prisma/client');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler');
const { validateRegister, validateLogin } = require('../utils/validationChains');
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

exports.login = [
    validateLogin,
    checkIfValid,

    asyncHandler(async (req,res,next) => {
        const user = await prisma.user.findUnique({where: {username: req.body.username}, omit: {password: true}})
        const expiry = user.demo ? '3h' : '3d';
        const token = jwt.sign({id: user.id}, process.env.SECRET, {expiresIn: expiry});

        return res.status(200).json({msg: `Logged in successfully! Token expires in ${expiry}`, token, user})
    })
]