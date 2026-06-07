const express = require('express');
const router = express.Router();
const bookController = require('../../controllers/admin/book.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin, requireAdminOrStaff } = require('../../middlewares/role.middleware');

router.get('/', requireAuth, requireAdmin, bookController.list);
router.get('/create', requireAuth, requireAdmin, bookController.showCreate);
router.post('/create', requireAuth, requireAdmin, bookController.create);
router.get('/edit/:id', requireAuth, requireAdmin, bookController.showEdit);
router.post('/edit/:id', requireAuth, requireAdmin, bookController.update);
router.post('/delete/:id', requireAuth, requireAdmin, bookController.delete);
router.post('/toggle-status/:id', requireAuth, requireAdmin, bookController.toggleStatus);

module.exports = router;
