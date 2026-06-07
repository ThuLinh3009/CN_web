const express = require('express');
const router = express.Router();
const statisticsController = require('../../controllers/staff/statistics.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdminOrStaff } = require('../../middlewares/role.middleware');

router.get('/', requireAuth, requireAdminOrStaff, statisticsController.index);

module.exports = router;
