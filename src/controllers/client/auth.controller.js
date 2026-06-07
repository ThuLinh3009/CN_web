const authService = require('../../services/auth.service');
const { validateLogin, validateRegister, validateChangePassword } = require('../../validators');

module.exports = {
  async showLogin(req, res, next) {
    try {
      if (req.session?.user) return res.redirect('/');
      return res.render('client/auth/login', { title: 'Đăng nhập' });
    } catch (error) { return next(error); }
  },

  async login(req, res, next) {
    try {
      try { validateLogin(req.body); } catch (e) {
        req.flash('error', e.message); return res.redirect('/login');
      }
      const { username, password, type } = req.body;
      let result;
      if (type === 'employee') {
        result = await authService.loginEmployee(username, password);
      } else {
        // Try customer first, then employee
        result = await authService.loginCustomer(username, password);
        if (!result.ok) {
          result = await authService.loginEmployee(username, password);
        }
      }
      if (!result.ok) {
        req.flash('error', result.message);
        return res.redirect('/login');
      }
      req.session.user = result.user;
      if (result.user.role === 'admin') return res.redirect('/admin');
      if (result.user.role === 'staff') return res.redirect('/staff');
      return res.redirect('/');
    } catch (error) { return next(error); }
  },

  async showRegister(req, res, next) {
    try {
      if (req.session?.user) return res.redirect('/');
      return res.render('client/auth/register', { title: 'Đăng ký tài khoản' });
    } catch (error) { return next(error); }
  },

  async register(req, res, next) {
    try {
      try { validateRegister(req.body); } catch (e) {
        req.flash('error', e.message); return res.redirect('/register');
      }
      const result = await authService.registerCustomer(req.body);
      if (!result.ok) {
        req.flash('error', result.message);
        return res.redirect('/register');
      }
      req.flash('success', 'Đăng ký thành công! Vui lòng đăng nhập.');
      return res.redirect('/login');
    } catch (error) { return next(error); }
  },

  async logout(req, res, next) {
    try {
      req.session.destroy(() => res.redirect('/login'));
    } catch (error) { return next(error); }
  },

  async showChangePassword(req, res, next) {
    try {
      return res.render('client/auth/login', { title: 'Đổi mật khẩu' });
    } catch (error) { return next(error); }
  },

  async changePassword(req, res, next) {
    try {
      try { validateChangePassword(req.body); } catch (e) {
        req.flash('error', e.message); return res.redirect('/change-password');
      }
      const { old_password, new_password } = req.body;
      const userId = req.session.user?.id;
      const result = await authService.changePassword(userId, old_password, new_password);
      if (!result.ok) { req.flash('error', result.message); return res.redirect('/change-password'); }
      req.flash('success', 'Đổi mật khẩu thành công');
      return res.redirect('/profile');
    } catch (error) { return next(error); }
  },
};
