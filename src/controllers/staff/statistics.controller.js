const statisticsService = require('../../services/statistics.service');
const { query } = require('../../config/db');

module.exports = {
  async index(req, res, next) {
    try {
      const year = Number(req.query.year) || new Date().getFullYear();
      const thisMonth = new Date().toISOString().slice(0, 7);

      const [monthlyRevenue, topBooks] = await Promise.all([
        statisticsService.getMonthlyRevenue(year),
        statisticsService.getTopBooks(10),
      ]);

      // Tổng doanh thu (đơn đã giao)
      const [totalRevenueRow] = await query(`
        SELECT IFNULL(SUM(oi.quantity * oi.unit_price), 0) AS revenue
        FROM orders o
        JOIN order_items oi ON oi.order_id = o.id
        WHERE o.status = 'delivered'
      `);

      // Doanh thu tháng này
      const [monthRevenueRow] = await query(`
        SELECT IFNULL(SUM(oi.quantity * oi.unit_price), 0) AS revenue
        FROM orders o
        JOIN order_items oi ON oi.order_id = o.id
        WHERE DATE_FORMAT(o.created_at, '%Y-%m') = ?
          AND o.status = 'delivered'
      `, [thisMonth]);

      // Tổng đơn hàng đã giao
      const [totalOrderRow] = await query(
        "SELECT COUNT(*) AS total FROM orders WHERE status = 'delivered'"
      );

      const stats = {
        totalRevenue:     Number(totalRevenueRow?.revenue || 0),
        revenueThisMonth: Number(monthRevenueRow?.revenue || 0),
        totalOrders:      Number(totalOrderRow?.total || 0),
      };

      return res.render('staff/statistics/index', {
        title: 'Thống kê', monthlyRevenue, topBooks, stats, year,
      });
    } catch (error) { return next(error); }
  },
};
