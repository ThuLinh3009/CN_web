const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/client/profile.controller');
const { requireAuth, optionalAuth } = require('../../middlewares/auth.middleware');

router.get('/', requireAuth, profileController.index);
router.post('/', requireAuth, profileController.update);
router.get('/orders', requireAuth, profileController.orders);

module.exports = router;
