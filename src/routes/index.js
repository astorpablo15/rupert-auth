const express = require('express');
const router = express.Router();
const pagesRouter = require('./pages/pages.routes');
const sessionRouter = require('./session/session.routes');
const passport = require('passport');

router.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        environment: process.env.ENVIRONMENT || 'undefined',
        health: 'Up!'
    })
})
.use(pagesRouter)
.use('/api', sessionRouter);

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {successRedirect: '/', failureRedirect: '/signin'}));

module.exports = router;