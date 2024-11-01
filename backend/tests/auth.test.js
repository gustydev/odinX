const { app, request } = require('./setup');
const { userRegister } = require('./requests');

const prisma = require('../src/prisma/client');

afterAll(async() => {
    await prisma.user.deleteMany();
})

describe('user register', () => {
    it('creates new valid user', async() => {
        const res = await userRegister({
            username: 'test',
            password: 'test1234',
            confirmPassword: 'test1234'
        }, 200);

        console.log(res.body)
        expect(res.body.user.displayName).toEqual('test')
        expect(res.body.user).toHaveProperty('id');
    })
})