const express = require('express');
const router  = express.Router();
const orderController = require('../../controllers/admin/order.controller');
const { requireAuth }  = require('../../middlewares/auth.middleware');
const { requireAdmin } = require('../../middlewares/role.middleware');

router.get('/',              requireAuth, requireAdmin, orderController.list);
router.get('/print/:id',     requireAuth, requireAdmin, orderController.print);
router.get('/:id',           requireAuth, requireAdmin, orderController.detail);
router.post('/:id/status',   requireAuth, requireAdmin, orderController.updateStatus);
router.post('/:id/mark-paid',requireAuth, requireAdmin, orderController.markPaid);

module.exports = router;
