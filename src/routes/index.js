const express = require('express');
const healthRoutes = require('./health');

const router = express.Router();

router.use('/v1', healthRoutes);

module.exports = router;
