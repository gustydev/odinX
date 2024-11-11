require('dotenv').config();
const express = require('express');
const app = express();
const { createServer } = require('node:http');
const createError = require('http-errors');
const cors = require('cors');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const prisma = require('./prisma/client');
const passport = require('passport')
const { Server } = require('socket.io');

const server = createServer(app);

const authRoute = require('./routes/auth');
const postRoute = require("./routes/post")
const userRoute = require('./routes/user');
const { convertParamsToNumber } = require('./middlewares/convertParams');

const corsOptions = {
  // In production, use the front-end URL; in development, accept any
  origin: (process.env.NODE_ENV === 'production') ? process.env.FRONTEND_URL : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

const io = new Server(server);

app.use(cors(corsOptions));
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

io.on('connection', async(socket) => {
  socket.on('likePost', (postData) => {
    io.emit('likePost', postData)
  })
})

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

    if (process.env.NODE_ENV === 'development') {
        console.error(error)
    }

    res.status(statusCode).json(error)
});

const port = process.env.PORT || 3000;
server.listen(port, () => {console.log(`Server running on port ${port}`)})