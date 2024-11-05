const { userRegister, userLogin, followUser } = require('./requests');
const { clearDB } = require('./setup');
const prisma = require('../src/prisma/client');

let test1, test2;

beforeAll(async() => {
    await clearDB();

    await userRegister({
        username: 'test1',
        password: 'password',
        confirmPassword: 'password'
    }, 200);

    const res = await userLogin({
        username: 'test1',
        password: 'password'
    }, 200);

    test1 = res.body;

    await userRegister({
        username: 'test2',
        password: 'password',
        confirmPassword: 'password'
    }, 200);

    const res2 = await userLogin({
        username: 'test2',
        password: 'password'
    }, 200);

    test2 = res2.body;
})

afterAll(async() => {
    await clearDB();
})

describe('following users', () => {
    it('follows and unfollows user', async() => {
        // user test1 follows test2
        const res1 = await followUser(test2.user.id, test1.token, 200);

        expect(res1.body.followers.length).toBe(1);

        // test1 unfollows test2
        const res2 = await followUser(test2.user.id, test1.token, 200);

        expect(res2.body.followers.length).toBe(0);

        // Would write more tests but I already tested all of it in Postman
    })

    it('rejects following yourself', async() => {
        await followUser(test1.user.id, test1.token, 400);
    })
})
