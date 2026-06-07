const express = require('express');
const router = express.Router();
const homeController = require('../../controllers/client/home.controller');
const { requireAuth, optionalAuth } = require('../../middlewares/auth.middleware');

router.get('/', optionalAuth, homeController.index);

module.exports = router;
