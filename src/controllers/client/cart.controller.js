const cartService = require('../../services/cart.service');
const { validateAddToCart, validateUpdateCart } = require('../../validators');

function getCustomerId(req) {
  return req.session?.user?.id;
}

module.exports = {
  async index(req, res, next) {
    try {
      const customerId = getCustomerId(req);
      if (!customerId) return res.redirect('/login');
      const { items, total } = await cartService.getCart(customerId);
      return res.render('client/cart/index', { title: 'Giỏ hàng', items, total });
    } catch (error) { return next(error); }
  },

  async add(req, res, next) {
    try {
      const customerId = getCustomerId(req);
      if (!customerId) return res.redirect('/login');
      try { validateAddToCart(req.body); } catch (e) {
        req.flash('error', e.message); return res.redirect(req.get('Referer') || '/cart');
      }
      const { lot_id, quantity = 1 } = req.body;
      await cartService.addToCart(customerId, lot_id, quantity);
      req.flash('success', 'Đã thêm vào giỏ hàng');
      return res.redirect(req.get('Referer') || '/cart');
    } catch (error) { return next(error); }
  },

  async update(req, res, next) {
    try {
      const customerId = getCustomerId(req);
      if (!customerId) return res.redirect('/login');
      try { validateUpdateCart(req.body); } catch (e) {
        req.flash('error', e.message); return res.redirect('/cart');
      }
      const { lot_id, quantity } = req.body;
      await cartService.updateCartItem(customerId, lot_id, quantity);
      return res.redirect('/cart');
    } catch (error) { return next(error); }
  },

  async remove(req, res, next) {
    try {
      const customerId = getCustomerId(req);
      if (!customerId) return res.redirect('/login');
      const { lot_id } = req.body;
      await cartService.removeFromCart(customerId, lot_id);
      return res.redirect('/cart');
    } catch (error) { return next(error); }
  },

  async clear(req, res, next) {
    try {
      const customerId = getCustomerId(req);
      if (!customerId) return res.redirect('/login');
      await cartService.clearCart(customerId);
      return res.redirect('/cart');
    } catch (error) { return next(error); }
  },
};
