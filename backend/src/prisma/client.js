const { PrismaClient } = require('@prisma/client');

const dbUrl = process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;

module.exports = new PrismaClient({
    datasources: {
        db: {
            url: dbUrl
        }
    }
})