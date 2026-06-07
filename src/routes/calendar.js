const express = require('express');
const authMiddleware = require('../middlewares/auth');
const appointmentController = require('../controllers/appointmentController');

const router = express.Router();

router.use(authMiddleware);

router.get('/calendar/events', appointmentController.list);
router.get('/calendar/events/:id', appointmentController.getById);
router.post('/calendar/events', appointmentController.create);
router.put('/calendar/events/:id', appointmentController.update);
router.delete('/calendar/events/:id', appointmentController.remove);

module.exports = router;
