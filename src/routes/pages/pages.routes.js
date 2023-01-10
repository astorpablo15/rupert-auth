const router = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');

router.get('/signin', (req, res) => {
    res.render('signin');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/error', (_req, res) => {
    res.render('error');
});

router.get('/home', authMiddleware, (req, res) => {
    res.render('home');
});

module.exports = router;