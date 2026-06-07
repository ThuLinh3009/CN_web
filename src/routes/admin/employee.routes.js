const express = require('express');
const router = express.Router();
const employeeController = require('../../controllers/admin/employee.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin, requireAdminOrStaff } = require('../../middlewares/role.middleware');

router.get('/', requireAuth, requireAdmin, employeeController.list);
router.get('/create', requireAuth, requireAdmin, employeeController.showCreate);
router.post('/create', requireAuth, requireAdmin, employeeController.create);
router.get('/edit/:id', requireAuth, requireAdmin, employeeController.showEdit);
router.post('/edit/:id', requireAuth, requireAdmin, employeeController.update);
router.post('/delete/:id', requireAuth, requireAdmin, employeeController.delete);

module.exports = router;
