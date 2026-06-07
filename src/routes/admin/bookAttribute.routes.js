const express = require('express');
const router = express.Router();
const bookAttributeController = require('../../controllers/admin/bookAttribute.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin, requireAdminOrStaff } = require('../../middlewares/role.middleware');

router.get('/', requireAuth, requireAdmin, bookAttributeController.list);
router.get('/create', requireAuth, requireAdmin, bookAttributeController.showCreate);
router.post('/create', requireAuth, requireAdmin, bookAttributeController.create);
router.get('/edit/:id', requireAuth, requireAdmin, bookAttributeController.showEdit);
router.post('/edit/:id', requireAuth, requireAdmin, bookAttributeController.update);
router.post('/delete/:id', requireAuth, requireAdmin, bookAttributeController.delete);

module.exports = router;
