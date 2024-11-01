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