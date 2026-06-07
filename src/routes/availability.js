const express = require('express');
const authMiddleware = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const availabilityController = require('../controllers/availabilityController');

const router = express.Router();

const adminOnly = [authMiddleware, authorize(['admin'])];

// GET /api/v1/doctors/:doctorId/availability/base
router.get(
  '/doctors/:doctorId/availability/base',
  ...adminOnly,
  availabilityController.getDoctorBaseSchedule
);

// POST /api/v1/doctors/:doctorId/availability/base
router.post(
  '/doctors/:doctorId/availability/base',
  ...adminOnly,
  availabilityController.addDoctorBaseSlot
);

module.exports = router;
