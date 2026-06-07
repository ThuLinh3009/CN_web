const express = require('express');
const router = express.Router();
const importReceiptController = require('../../controllers/staff/importReceipt.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdminOrStaff } = require('../../middlewares/role.middleware');

router.get('/', requireAuth, requireAdminOrStaff, importReceiptController.list);
router.get('/create', requireAuth, requireAdminOrStaff, importReceiptController.showCreate);
router.post('/create', requireAuth, requireAdminOrStaff, importReceiptController.create);
router.post('/confirm/:id', requireAuth, requireAdminOrStaff, importReceiptController.confirm); // phải trước /:id
router.get('/:id', requireAuth, requireAdminOrStaff, importReceiptController.detail);

module.exports = router;
