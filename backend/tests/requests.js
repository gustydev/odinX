const { app, request } = require('./setup');

exports.userRegister = async function (data, status) {
    return await request(app)
        .post('/api/auth/register')
        .expect('Content-Type', /json/)
        .send(data)
        .expect(status);
}

exports.userLogin = async function(data, status) {
    return await request(app)
        .post('/api/auth/login')
        .expect('Content-Type', /json/)
        .send(data)
        .expect(status);
}

exports.createPost = async function(data, token, status) {
    return await request(app)
        .post('/api/post')
        .expect('Content-Type', /json/)
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(status)
}