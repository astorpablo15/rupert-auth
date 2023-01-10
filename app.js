const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();

const mongooseConnect = require('./src/services/mongo/connect');

const { getStoreConfig } = require('./src/services/session/session.config');
const indexRouter = require('./src/routes/index');

const app = express();

const COOKIE_SECRET = process.env.COOKIE_SECRET || 'default';

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(logger('tiny'));

mongooseConnect();

app.use(cookieParser(COOKIE_SECRET));

app.use(session({
    store: MongoStore.create(getStoreConfig()),
    secret: COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: false,
        secure: false
    }
}));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(indexRouter);

module.exports = app;