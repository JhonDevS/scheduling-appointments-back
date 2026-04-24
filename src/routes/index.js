const express = require('express');
const healthRoutes = require('./health');
const authRoutes = require('./auth');

const router = express.Router();

router.use('/v1', healthRoutes);
router.use('/v1/auth', authRoutes);

module.exports = router;
