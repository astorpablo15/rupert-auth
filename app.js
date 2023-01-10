const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();

const mongooseConnect = require('./src/services/mongo/connect');

const md5 = require('md5');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

const UserModel = require('./src/services/mongo/models/user.model');

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

passport.use('twitter', new TwitterStrategy({
    consumerKey:"DH98IJEVZjecdPig5BRdiEG5U",
    consumerSecret: "g2CsuAfcOKRB8gx5JFg55GmwT6sbqBZjB6vtgUu0QgsuSfKNI0",
    callbackURL: "http://localhost:3005/auth/twitter/callback"
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    done(null, profile);
}));

passport.use('login', new LocalStrategy(async (username, password, done) => {
    const userData = await UserModel.findOne({username, password: md5(password)});
    if(!userData){
        return done(null, false);
    }
    done(null, userData);
}));

passport.use('signup', new LocalStrategy({
    passReqToCallback: true
}, async (req, username, password, done) => {
    const userData = await UserModel.findOne({username, password: md5(password)});
    if(userData){
        return done(null, false);
    }
    const stageUser = new UserModel({
        username,
        password: md5(password),
        fullName: req.body.fullName
    });
    const newUser = await stageUser.save();
    done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    const userData = await UserModel.findById(id);
    done(null, userData);
});

app.use(passport.initialize());
app.use(passport.session());

app.use(indexRouter);

module.exports = app;