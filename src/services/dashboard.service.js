const { query } = require('../config/db');

async function getSummary() {
  const today = new Date().toISOString().slice(0, 10);
  const thisMonth = new Date().toISOString().slice(0, 7);

  const [bookRow] = await query('SELECT COUNT(*) AS total FROM books WHERE is_deleted = 0 AND is_active = 1');

  // Đơn hàng online đặt hôm nay (tất cả trạng thái)
  const [orderTodayRow] = await query(
    "SELECT COUNT(*) AS total FROM orders WHERE DATE(created_at) = ?", [today]
  );

  // Doanh thu tháng này = đơn đã giao (delivered) — nhất quán với statistics
  const [revenueMonthRow] = await query(`
    SELECT IFNULL(SUM(oi.quantity * oi.unit_price), 0) AS revenue
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    WHERE DATE_FORMAT(o.created_at, '%Y-%m') = ?
      AND o.status = 'delivered'
  `, [thisMonth]);

  const [newCustRow] = await query(
    "SELECT COUNT(*) AS total FROM customers WHERE DATE_FORMAT(created_at, '%Y-%m') = ?", [thisMonth]
  );
  const [customerRow] = await query('SELECT COUNT(*) AS total FROM customers WHERE is_active = 1');
  const [employeeRow] = await query('SELECT COUNT(*) AS total FROM employees WHERE is_active = 1');

  const [totalOrderRow] = await query('SELECT COUNT(*) AS total FROM orders');
  const [pendingOrderRow] = await query("SELECT COUNT(*) AS total FROM orders WHERE status = 'pending'");
  const [deliveringOrderRow] = await query(
    "SELECT COUNT(*) AS total FROM orders WHERE status IN ('confirmed','shipping')"
  );

  return {
    totalBooks: Number(bookRow?.total || 0),
    ordersToday: Number(orderTodayRow?.total || 0),           // đơn đặt hôm nay
    revenueThisMonth: Number(revenueMonthRow?.revenue || 0),  // doanh thu tháng (đã hoàn thành)
    newCustomersThisMonth: Number(newCustRow?.total || 0),
    totalCustomers: Number(customerRow?.total || 0),
    totalEmployees: Number(employeeRow?.total || 0),
    totalOrders: Number(totalOrderRow?.total || 0),
    pendingOrders: Number(pendingOrderRow?.total || 0),        // đơn chờ xác nhận
    deliveringOrders: Number(deliveringOrderRow?.total || 0),  // đơn đang xử lý/giao
  };
}

module.exports = { getSummary };
