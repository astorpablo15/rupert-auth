const router = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');

router.get('/signin', (req, res) => {
    if(req.isAuthenticated()){
       return res.redirect('/home')
    }
    res.render('signin');
});

router.get('/signup', (req, res) => {
    if(req.isAuthenticated()){
        return res.redirect('/home')
    }
    res.render('signup');
});

router.get('/error', (_req, res) => {
    res.render('error');
});

router.get('/home', authMiddleware, (req, res) => {
    const userData = req.user;
    res.render('home', {fullName: userData.fullName});
});

module.exports = router;