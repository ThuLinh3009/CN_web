const express = require('express');
const router = express.Router();
const authController = require('../../controllers/client/auth.controller');
const { requireAuth, optionalAuth } = require('../../middlewares/auth.middleware');
const { rateLimit } = require('../../middlewares/rateLimit.middleware');

// Giới hạn 10 lần POST login/register mỗi phút mỗi IP
const authLimiter = rateLimit({ windowMs: 60_000, max: 10, message: 'Quá nhiều lần thử đăng nhập, vui lòng đợi 1 phút.' });

router.get('/login', optionalAuth, authController.showLogin);
router.post('/login', authLimiter, optionalAuth, authController.login);
router.get('/register', optionalAuth, authController.showRegister);
router.post('/register', authLimiter, optionalAuth, authController.register);
router.post('/logout', optionalAuth, authController.logout);
router.get('/change-password', requireAuth, authController.showChangePassword);
router.post('/change-password', requireAuth, authController.changePassword);

module.exports = router;
