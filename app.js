//set DEBUG=development:mongoose; npx nodemon
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const db = require('./config/database');
const flash = require('connect-flash');
const expressSession = require('express-session');

require('dotenv').config();

const ownersRouter = require('./routes/ownersRouter')
const userRouter = require('./routes/userRouter')
const productsRouter = require('./routes/productsRouter')
const indexRouter = require('./routes/index')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs')

app.use('/', indexRouter);
app.use('/owners', ownersRouter);
app.use('/users', userRouter);
app.use('/products', productsRouter);

app.listen(3000)