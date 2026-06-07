const express = require('express');
const router  = express.Router();
const orderController = require('../../controllers/staff/order.controller');
const { requireAuth }        = require('../../middlewares/auth.middleware');
const { requireAdminOrStaff } = require('../../middlewares/role.middleware');

router.get('/',            requireAuth, requireAdminOrStaff, orderController.list);
router.get('/print/:id',   requireAuth, requireAdminOrStaff, orderController.print);
router.get('/:id',         requireAuth, requireAdminOrStaff, orderController.detail);
router.post('/:id/status', requireAuth, requireAdminOrStaff, orderController.updateStatus);

module.exports = router;
