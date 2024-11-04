const { userRegister, userLogin, createPost } = require('./requests');
const prisma = require('../src/prisma/client');

let tester;

beforeAll(async() => {
    await userRegister({
        username: 'tester',
        password: 'password',
        confirmPassword: 'password'
    }, 200);

    const res = await userLogin({
        username: 'tester',
        password: 'password'
    }, 200);

    tester = res.body;
})

afterAll(async() => {
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();
})

describe('creating posts', () => {
    it.only('creates valid post', async() => {
        const res = await createPost({
            content: 'hello world'
        }, tester.token, 200);

        expect(res.body.post).toHaveProperty('id');
        expect(res.body.post.content).toEqual("hello world");
        expect(res.body.post.authorId).toEqual(tester.user.id)
    })
})