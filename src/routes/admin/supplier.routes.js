const express = require('express');
const router = express.Router();
const supplierController = require('../../controllers/admin/supplier.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin, requireAdminOrStaff } = require('../../middlewares/role.middleware');

router.get('/', requireAuth, requireAdmin, supplierController.list);
router.get('/create', requireAuth, requireAdmin, supplierController.showCreate);
router.post('/create', requireAuth, requireAdmin, supplierController.create);
router.get('/edit/:id', requireAuth, requireAdmin, supplierController.showEdit);
router.post('/edit/:id', requireAuth, requireAdmin, supplierController.update);
router.post('/delete/:id', requireAuth, requireAdmin, supplierController.delete);

module.exports = router;
