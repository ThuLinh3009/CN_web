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

function requireAdminOrStaff(req, res, next) {
  if (!req.session || !req.session.user) {
    req.flash('error', 'Vui lòng đăng nhập.');
    return res.redirect('/login');
  }
  const role = req.session.user.role;
  if (role !== 'admin' && role !== 'staff') {
    return res.status(403).render('client/errors/404', { title: 'Không có quyền truy cập' });
  }
  next();
}

module.exports = { requireAdmin, requireAdminOrStaff };
