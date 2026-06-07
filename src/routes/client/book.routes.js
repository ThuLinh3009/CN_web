const express = require('express');
const router = express.Router();
const bookController = require('../../controllers/client/book.controller');
const { requireAuth, optionalAuth } = require('../../middlewares/auth.middleware');

router.get('/', optionalAuth, bookController.list);
router.get('/search', optionalAuth, bookController.search);
router.get('/:id', optionalAuth, bookController.detail);

module.exports = router;
