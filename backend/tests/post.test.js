const { userRegister, userLogin, createPost, likePost } = require('./requests');
const { clearDB } = require('./setup');

let tester;

beforeAll(async() => {
    await clearDB();

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
    await clearDB();
})

describe('creating posts', () => {
    it('creates valid post', async() => {
        const res = await createPost({
            content: 'hello world'
        }, tester.token, 200);

        expect(res.body.post).toHaveProperty('id');
        expect(res.body.post.content).toEqual("hello world");
        expect(res.body.post.authorId).toEqual(tester.user.id)
    })

    it.only('likes and unlikes posts', async() => {
        const res = await createPost({
            content: 'hello world!'
        }, tester.token, 200);

        const postId = res.body.post.id;

        const res2 = await likePost(postId, tester.token, 200);
        console.log('AYYY: ', res2.body)
    })
})