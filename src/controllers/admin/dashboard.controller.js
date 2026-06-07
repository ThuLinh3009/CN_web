const dashboardService = require('../../services/dashboard.service');

module.exports = {
  async index(req, res, next) {
    try {
      const summary = await dashboardService.getSummary();
      return res.render('admin/dashboard', { title: 'Trang quản trị', summary });
    } catch (error) { return next(error); }
  },
};
