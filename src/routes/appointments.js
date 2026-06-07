const express = require('express');
const authMiddleware = require('../middlewares/auth');
const appointmentController = require('../controllers/appointmentController');

const router = express.Router();

router.use(authMiddleware);

// GET /api/v1/appointments?start=&end=
router.get('/', appointmentController.list);

// GET /api/v1/appointments/:id
router.get('/:id', appointmentController.getById);

// POST /api/v1/appointments
router.post('/', appointmentController.create);

// PUT /api/v1/appointments/:id
router.put('/:id', appointmentController.update);

// DELETE /api/v1/appointments/:id
router.delete('/:id', appointmentController.remove);

module.exports = router;
