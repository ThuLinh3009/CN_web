const express = require('express');
const router = express.Router();
const salesInvoiceController = require('../../controllers/admin/salesInvoice.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin, requireAdminOrStaff } = require('../../middlewares/role.middleware');

router.get('/', requireAuth, requireAdminOrStaff, salesInvoiceController.list);
router.get('/create', requireAuth, requireAdminOrStaff, salesInvoiceController.showCreate);
router.post('/create', requireAuth, requireAdminOrStaff, salesInvoiceController.create);
router.get('/print/:id', requireAuth, requireAdminOrStaff, salesInvoiceController.print); // phải trước /:id
router.get('/:id', requireAuth, requireAdminOrStaff, salesInvoiceController.detail);
router.post('/edit/:id', requireAuth, requireAdminOrStaff, salesInvoiceController.update);
router.post('/mark-paid/:id', requireAuth, requireAdminOrStaff, salesInvoiceController.markPaid);

module.exports = router;
