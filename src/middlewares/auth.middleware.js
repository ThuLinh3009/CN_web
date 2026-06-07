function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    req.flash('error', 'Vui lòng đăng nhập để tiếp tục.');
    return res.redirect('/login');
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session || !req.session.user) {
    req.flash('error', 'Vui lòng đăng nhập.');
    return res.redirect('/login');
  }
  if (req.session.user.role !== 'admin') {
    return res.status(403).render('client/errors/404', { title: 'Không có quyền truy cập' });
  }
  next();
}

function requireStaff(req, res, next) {
  if (!req.session || !req.session.user) {
    req.flash('error', 'Vui lòng đăng nhập.');
    return res.redirect('/login');
  }
  if (req.session.user.role !== 'staff' && req.session.user.role !== 'admin') {
    return res.status(403).render('client/errors/404', { title: 'Không có quyền truy cập' });
  }
  next();
}

function optionalAuth(req, res, next) {
  next();
}

module.exports = { requireAuth, requireAdmin, requireStaff, optionalAuth };
