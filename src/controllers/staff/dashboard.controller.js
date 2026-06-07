const dashboardService = require('../../services/dashboard.service');

module.exports = {
  async index(req, res, next) {
    try {
      const summary = await dashboardService.getSummary();
      return res.render('staff/dashboard', { title: 'Trang nhân viên', summary });
    } catch (error) { return next(error); }
  },
};
