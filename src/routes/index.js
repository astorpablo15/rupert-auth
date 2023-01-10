const express = require('express');
const router = express.Router();
const pagesRouter = require('./pages/pages.routes');
const authRoutes = require('./auth/auth.routes');

router.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        environment: process.env.ENVIRONMENT || 'undefined',
        health: 'Up!'
    })
})
.use(pagesRouter)
.use('/api/auth', authRoutes);

module.exports = router;