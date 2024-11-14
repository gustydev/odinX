const { userRegister, userLogin, createPost, likePost, replyToPost, editPost } = require('./requests');
const { clearDB } = require('./setup');
const prisma = require("../src/prisma/client");

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

describe('creating posts and replies', () => {
    it('creates valid post', async() => {
        const res = await createPost({
            content: 'hello world'
        }, tester.token, 200);

        expect(res.body.post).toHaveProperty('id');
        expect(res.body.post.content).toEqual("hello world");
        expect(res.body.post.authorId).toEqual(tester.user.id)
    })

    it('create replies to posts', async() => {
        const res = await createPost({content: 'test'}, tester.token, 200);
        const ogPostId = res.body.post.id;

        const res2 = await replyToPost(ogPostId, {content: 'this is a reply'}, tester.token, 200);
        expect(res2.body.reply.parentPostId).toEqual(ogPostId)
    })

    it('rejects invalid inputs in post/reply creation', async() => {
        // content is non string
        await createPost({content: 420}, tester.token, 400);

        // content is too long
        await createPost({content: 'A'.repeat(5001)}, tester.token, 400);

        const res = await createPost({content: 'this post is valid'}, tester.token, 200);

        // no content
        await replyToPost(res.body.post.id, {content: ''}, tester.token, 400);
    })
})

describe('interactions with posts', () => {
    it('likes and unlikes posts', async() => {
        const res = await createPost({
            content: 'hello world!'
        }, tester.token, 200);

        const postId = res.body.post.id;

        const res2 = await likePost(postId, tester.token, 200);
        const like = res2.body.like;

        expect(like.postId).toEqual(postId);
        expect(like.likedById).toEqual(tester.user.id);
        
        expect(res2.body.post._count.likes).toBe(1);

        const res3 = await likePost(postId, tester.token, 200);

        expect(res3.body.post._count.likes).toBe(0);
    })

    it('edit posts', async() => {
        const res1 = await createPost({
            content: 'hello world'
        }, tester.token, 200);

        const res2 = await editPost(res1.body.post.id, {
            content: 'world hello'
        }, tester.token, 200);

        expect(res2.body.post.content).toEqual('world hello');
        expect(res2.body.post.id).toEqual(res1.body.post.id);
        expect(res2.body.post.editDate).toBeTruthy();

        // editing a reply as well
        const rep = await replyToPost(res2.body.post.id, {content: 'hey hey'}, tester.token, 200);

        const rep2 = await editPost(rep.body.reply.id, {content: 'hi hi hi'}, tester.token, 200);

        expect(rep2.body.post.parentPostId).toEqual(rep.body.reply.parentPostId);
        expect(rep2.body.post.parentPostId).toEqual(res2.body.post.id);
    })
})