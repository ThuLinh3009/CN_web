const statisticsService = require('../../services/statistics.service');
const { query } = require('../../config/db');

module.exports = {
  async index(req, res, next) {
    try {
      const year = Number(req.query.year) || new Date().getFullYear();
      const thisMonth = new Date().toISOString().slice(0, 7);

      const [monthlyRevenue, topBooks, inventory] = await Promise.all([
        statisticsService.getMonthlyRevenue(year),
        statisticsService.getTopBooks(10),
        statisticsService.getInventoryStatistics(),
      ]);

      // Tổng doanh thu (đơn đã giao)
      const [totalRevenueRow] = await query(`
        SELECT IFNULL(SUM(oi.quantity * oi.unit_price), 0) AS revenue
        FROM orders o
        JOIN order_items oi ON oi.order_id = o.id
        WHERE o.status = 'delivered'
      `);

      // Tiền thu về thực tế (đã paid)
      const [collectedRow] = await query(`
        SELECT IFNULL(SUM(oi.quantity * oi.unit_price), 0) AS collected
        FROM orders o
        JOIN order_items oi ON oi.order_id = o.id
        WHERE o.payment_status = 'paid'
          AND o.status = 'delivered'
      `);

      // Doanh thu tháng này
      const [monthRevenueRow] = await query(`
        SELECT IFNULL(SUM(oi.quantity * oi.unit_price), 0) AS revenue
        FROM orders o
        JOIN order_items oi ON oi.order_id = o.id
        WHERE DATE_FORMAT(o.created_at, '%Y-%m') = ?
          AND o.status = 'delivered'
      `, [thisMonth]);

      // Tổng đơn đã giao
      const [totalOrderRow] = await query(
        "SELECT COUNT(*) AS total FROM orders WHERE status = 'delivered'"
      );

      // Đơn chưa thu tiền (giao rồi nhưng chưa paid — COD nợ)
      const [unpaidDeliveredRow] = await query(
        "SELECT COUNT(*) AS total FROM orders WHERE status = 'delivered' AND payment_status = 'unpaid'"
      );

      const stats = {
        totalRevenue:       Number(totalRevenueRow?.revenue || 0),
        totalCollected:     Number(collectedRow?.collected || 0),
        revenueThisMonth:   Number(monthRevenueRow?.revenue || 0),
        totalOrders:        Number(totalOrderRow?.total || 0),
        unpaidDelivered:    Number(unpaidDeliveredRow?.total || 0),
      };

      return res.render('admin/statistics/index', {
        title: 'Thống kê & Báo cáo',
        monthlyRevenue, topBooks, inventory, stats, year,
      });
    } catch (error) { return next(error); }
  },
};
