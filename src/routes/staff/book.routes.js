const express = require('express');
const router  = express.Router();
const bookController = require('../../controllers/staff/book.controller');
const { requireAuth }         = require('../../middlewares/auth.middleware');
const { requireAdminOrStaff } = require('../../middlewares/role.middleware');

router.get('/',           requireAuth, requireAdminOrStaff, bookController.list);
router.get('/edit/:id',   requireAuth, requireAdminOrStaff, bookController.showEdit);
router.post('/edit/:id',  requireAuth, requireAdminOrStaff, bookController.update);

module.exports = router;
