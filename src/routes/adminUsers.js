const express = require('express');
const authMiddleware = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const adminUserController = require('../controllers/adminUserController');

const router = express.Router();

router.use(authMiddleware);

router.get('/admin/users', authorize(['admin', 'doctor', 'patient']), adminUserController.list);
router.post('/admin/users', authorize(['admin']), adminUserController.create);
router.put('/admin/users/:id', authorize(['admin']), adminUserController.update);
router.delete('/admin/users/:id', authorize(['admin']), adminUserController.remove);

module.exports = router;
