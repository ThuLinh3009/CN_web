const express = require('express');
const router = express.Router();
const statisticsController = require('../../controllers/admin/statistics.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin, requireAdminOrStaff } = require('../../middlewares/role.middleware');

router.get('/', requireAuth, requireAdmin, statisticsController.index);

module.exports = router;
