const express = require('express');
const router = express.Router();
const importLotController = require('../../controllers/admin/importLot.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin, requireAdminOrStaff } = require('../../middlewares/role.middleware');

router.get('/', requireAuth, requireAdminOrStaff, importLotController.list);
router.get('/create', requireAuth, requireAdminOrStaff, importLotController.showCreate);
router.post('/create', requireAuth, requireAdminOrStaff, importLotController.create);
router.get('/edit/:id', requireAuth, requireAdminOrStaff, importLotController.showEdit);
router.post('/edit/:id', requireAuth, requireAdminOrStaff, importLotController.update);
router.post('/adjust/:id', requireAuth, requireAdminOrStaff, importLotController.adjustQuantity);

module.exports = router;
