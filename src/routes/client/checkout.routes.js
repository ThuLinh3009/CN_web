const express = require("express");
const router = express.Router();
const checkoutController = require("../../controllers/client/checkout.controller");
const {
  requireAuth,
  optionalAuth,
} = require("../../middlewares/auth.middleware");

router.get("/", requireAuth, checkoutController.index);
router.post("/", requireAuth, checkoutController.submit);

// Thêm dòng này để tránh lỗi 404 khi form đang submit tới /checkout/submit
router.post("/submit", requireAuth, checkoutController.submit);

router.get("/success", requireAuth, checkoutController.success);

module.exports = router;
