const profileService = require('../../services/profile.service');

module.exports = {
  async index(req, res, next) {
    try {
      const customerId = req.session?.user?.id;
      if (!customerId) return res.redirect('/login');
      const profile = await profileService.getProfile(customerId);
      return res.render('client/profile/index', { title: 'Thông tin cá nhân', profile });
    } catch (error) { return next(error); }
  },

  async update(req, res, next) {
    try {
      const customerId = req.session?.user?.id;
      if (!customerId) return res.redirect('/login');
      await profileService.updateProfile(customerId, req.body);
      req.session.user.full_name = req.body.full_name;
      req.flash('success', 'Cập nhật thông tin thành công');
      return res.redirect('/profile');
    } catch (error) { return next(error); }
  },

  async orders(req, res, next) {
    try {
      const customerId = req.session?.user?.id;
      if (!customerId) return res.redirect('/login');
      const orders = await profileService.getOrderHistory(customerId);
      return res.render('client/profile/orders', { title: 'Lịch sử đơn hàng', orders });
    } catch (error) { return next(error); }
  },
};
