const { ForbiddenError } = require("gusty-custom-errors")
const prisma = require('../prisma/client');

async function checkIfDemo(req, res, next) {
    try {
        const user = await prisma.user.findUnique({where: {id: req.user.id}})

        if (user && user.demo) {
            return next(new ForbiddenError('Demo accounts cannot perform this action. Create a free account to do it!'))
        }
    
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = { checkIfDemo }