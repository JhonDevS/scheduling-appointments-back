const express = require('express');
const authMiddleware = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const adminUserController = require('../controllers/adminUserController');

const router = express.Router();

router.use(authMiddleware, authorize(['admin']));

router.get('/admin/users', adminUserController.list);
router.post('/admin/users', adminUserController.create);
router.put('/admin/users/:id', adminUserController.update);
router.delete('/admin/users/:id', adminUserController.remove);

module.exports = router;
