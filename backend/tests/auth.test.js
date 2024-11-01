const { userRegister, userLogin } = require('./requests');

const prisma = require('../src/prisma/client');

beforeAll(async() => {
    await prisma.user.create({
        data: {
            username: 'taken',
            password: 'random1234',
            displayName: 'im taken'
        }
    })
})

afterAll(async() => {
    await prisma.user.deleteMany();
})

describe('user register', () => {
    it('creates new valid users', async() => {
        const res = await userRegister({
            username: 'test',
            password: 'test1234',
            confirmPassword: 'test1234'
        }, 200);

        expect(res.body.user.displayName).toEqual('test');
        expect(res.body.user).toHaveProperty('id');

        const res2 = await userRegister({
            username: 'test2',
            password: 'test1234',
            confirmPassword: 'test1234',
            displayName: 'custom username'
        }, 200);

        expect(res2.body.user.displayName).toEqual('custom username');
    })

    it('rejects taken username', async() => {
        await userRegister({
            username: 'taken',
            password: 'test1234',
            confirmPassword: 'test1234'
        }, 400);
    })

    it('rejects invalid inputs', async() => {
        await userRegister({
            username: 'e', // username too short
            password: 'valid123',
            confirmPassword: 'valid123'
        }, 400)

        await userRegister({
            username: 'poggy',
            password: 'a', // password too short
            confirmPassword: 'a'
        }, 400)

        await userRegister({
            username: 'poggy',
            password: '12345678',
            confirmPassword: '1231234124124' // passwords don't match
        }, 400)    
    })
})

describe('user login', () => {
    it('logs in user with valid credentials', async() => {
        await userRegister({
            username: 'new_user',
            password: 'testpass',
            confirmPassword: 'testpass'
        }, 200);

        const res = await userLogin({
            username: 'new_user',
            password: 'testpass'
        }, 200);

        expect(res.body.user).not.toHaveProperty('password');
        expect(res.body).toHaveProperty('token');
    })
})