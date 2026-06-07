const express = require('express');
const authMiddleware = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const availabilityController = require('../controllers/availabilityController');

const router = express.Router();

const adminOnly = [authMiddleware, authorize(['admin'])];
const adminOrDoctor = [authMiddleware, authorize(['admin', 'doctor'])];

// GET /api/v1/doctors/:doctorId/availability/base
// Admin puede ver la disponibilidad de cualquier médico.
// Un doctor solo puede ver su propia disponibilidad (doctorId === req.user.id).
router.get(
  '/doctors/:doctorId/availability/base',
  ...adminOrDoctor,
  availabilityController.getDoctorBaseSchedule
);

// POST /api/v1/doctors/:doctorId/availability/base
router.post(
  '/doctors/:doctorId/availability/base',
  ...adminOnly,
  availabilityController.addDoctorBaseSlot
);

module.exports = router;
