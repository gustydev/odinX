require('dotenv').config();
const express = require('express');
const app = express();
const createError = require('http-errors');
const request = require('supertest');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const prisma = require('../src/prisma/client');
const passport = require('passport')

const authRoute = require('../src/routes/auth')
const postRoute = require("../src/routes/post")
const userRoute = require('../src/routes/user');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

app.use('/api/auth', authRoute);
app.use('/api/post', postRoute)
app.use('/api/user', userRoute);

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET,
};

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      const user = await prisma.user.findUnique({where: {id: payload.id}})
      if (user) {
        return done(null, true)
      }
    } catch (error) {
      return done(error);
    }
  })
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Global error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    const error = {
        statusCode,
        message,
        ...err
    };

    console.error(error)

    res.status(statusCode).json(error)
});

async function clearDB() {
  await prisma.like.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
}

module.exports = {
    app, request, clearDB
}