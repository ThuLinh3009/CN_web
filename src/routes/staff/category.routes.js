const express = require('express');
const router  = express.Router();
const categoryController = require('../../controllers/staff/category.controller');
const { requireAuth }         = require('../../middlewares/auth.middleware');
const { requireAdminOrStaff } = require('../../middlewares/role.middleware');

router.get('/', requireAuth, requireAdminOrStaff, categoryController.list);

module.exports = router;
