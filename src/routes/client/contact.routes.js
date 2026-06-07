const express = require('express');
const router = express.Router();
const contactController = require('../../controllers/client/contact.controller');
const { requireAuth, optionalAuth } = require('../../middlewares/auth.middleware');

router.get('/', optionalAuth, contactController.index);
router.post('/', optionalAuth, contactController.submit);

module.exports = router;
