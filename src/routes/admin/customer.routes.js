const express = require('express');
const router = express.Router();
const customerController = require('../../controllers/admin/customer.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin, requireAdminOrStaff } = require('../../middlewares/role.middleware');

router.get('/', requireAuth, requireAdmin, customerController.list);
router.get('/create', requireAuth, requireAdmin, customerController.showCreate);
router.post('/create', requireAuth, requireAdmin, customerController.create);
router.get('/edit/:id', requireAuth, requireAdmin, customerController.showEdit);
router.post('/edit/:id', requireAuth, requireAdmin, customerController.update);
router.post('/delete/:id', requireAuth, requireAdmin, customerController.delete);

module.exports = router;
