const express = require('express');
const healthRoutes = require('./health');
const authRoutes = require('./auth');
const appointmentRoutes = require('./appointments');
const availabilityRoutes = require('./availability');
const adminUserRoutes = require('./adminUsers');
const calendarRoutes = require('./calendar');

const router = express.Router();

router.use('/v1', healthRoutes);
router.use('/v1/auth', authRoutes);
router.use('/v1/appointments', appointmentRoutes);
router.use('/v1', availabilityRoutes);
router.use('/v1', adminUserRoutes);
router.use('/v1', calendarRoutes);

module.exports = router;
