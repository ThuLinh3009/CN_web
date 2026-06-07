const express = require('express');
const router = express.Router();
const importReceiptController = require('../../controllers/admin/importReceipt.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin, requireAdminOrStaff } = require('../../middlewares/role.middleware');

router.get('/', requireAuth, requireAdminOrStaff, importReceiptController.list);
router.get('/create', requireAuth, requireAdminOrStaff, importReceiptController.showCreate);
router.post('/create', requireAuth, requireAdminOrStaff, importReceiptController.create);
router.get('/print/:id', requireAuth, requireAdminOrStaff, importReceiptController.print);
router.get('/edit/:id', requireAuth, requireAdmin, importReceiptController.showEdit);
router.post('/edit/:id', requireAuth, requireAdmin, importReceiptController.update);
router.post('/confirm/:id', requireAuth, requireAdminOrStaff, importReceiptController.confirm);
router.get('/:id', requireAuth, requireAdminOrStaff, importReceiptController.detail);

module.exports = router;
