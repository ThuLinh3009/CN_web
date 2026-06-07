const checkoutService = require('../../services/checkout.service');
const cartService = require('../../services/cart.service');
const { validateCheckout } = require('../../validators');

module.exports = {
  async index(req, res, next) {
    try {
      const customerId = req.session?.user?.id;
      if (!customerId) return res.redirect('/login');
      const { items, total } = await cartService.getCart(customerId);
      return res.render('client/checkout/index', { title: 'Thanh toán', items, total });
    } catch (error) { return next(error); }
  },

  async submit(req, res, next) {
    try {
      const customerId = req.session?.user?.id;
      if (!customerId) return res.redirect('/login');
      try { validateCheckout(req.body); } catch (e) {
        req.flash('error', e.message); return res.redirect('/checkout');
      }
      const result = await checkoutService.placeOrder(customerId, req.body);
      if (!result.ok) {
        req.flash('error', result.message);
        return res.redirect('/checkout');
      }
      return res.redirect('/checkout/success?orderId=' + result.orderId);
    } catch (error) { return next(error); }
  },

  async success(req, res, next) {
    try {
      const customerId = req.session?.user?.id;
      if (!customerId) return res.redirect('/login');
      const orderId = parseInt(req.query.orderId, 10) || null;
      const order = orderId ? await checkoutService.getOrderById(orderId, customerId) : null;
      return res.render('client/checkout/success', { title: 'Đặt hàng thành công', order });
    } catch (error) { return next(error); }
  },
};
