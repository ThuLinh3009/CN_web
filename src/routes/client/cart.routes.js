const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/client/cart.controller');
const { requireAuth, optionalAuth } = require('../../middlewares/auth.middleware');

router.get('/', requireAuth, cartController.index);
router.post('/add', requireAuth, cartController.add);
router.post('/update', requireAuth, cartController.update);
router.post('/remove', requireAuth, cartController.remove);
router.post('/clear', requireAuth, cartController.clear);

module.exports = router;
