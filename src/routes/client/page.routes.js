const express = require('express');
const router = express.Router();
const pageController = require('../../controllers/client/page.controller');
const { requireAuth, optionalAuth } = require('../../middlewares/auth.middleware');

router.get('/about', optionalAuth, pageController.about);
router.get('/news', optionalAuth, pageController.news);

module.exports = router;
