const { query } = require('../config/db');

/**
 * ĐỊNH NGHĨA:
 *  - Doanh thu (revenue)  = đơn hàng đã giao (status = 'delivered')
 *    → phản ánh giá trị hàng hóa đã xuất đi thực tế
 *  - Tiền thu về (collected) = đơn hàng đã thanh toán (payment_status = 'paid')
 *    → phản ánh tiền mặt/chuyển khoản đã nhận được
 *  Hai số này có thể khác nhau vì: COD giao rồi nhưng chưa thu tiền,
 *  hoặc khách thanh toán online trước khi đơn được giao.
 */

// Doanh thu theo tháng — đơn đã giao (delivered)
async function getMonthlyRevenue(year) {
  year = year || new Date().getFullYear();
  return query(`
    SELECT MONTH(o.created_at) AS month,
      IFNULL(SUM(oi.quantity * oi.unit_price), 0) AS revenue,
      IFNULL(SUM(CASE WHEN o.payment_status = 'paid' THEN oi.quantity * oi.unit_price ELSE 0 END), 0) AS collected,
      COUNT(DISTINCT o.id) AS order_count
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    WHERE YEAR(o.created_at) = ?
      AND o.status = 'delivered'
    GROUP BY MONTH(o.created_at)
    ORDER BY month ASC
  `, [year]);
}

// Doanh thu theo danh mục — đơn đã giao
async function getRevenueByCategoryByMonth(year) {
  year = year || new Date().getFullYear();
  return query(`
    SELECT c.name AS category_name, MONTH(o.created_at) AS month,
      IFNULL(SUM(oi.quantity * oi.unit_price), 0) AS revenue
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    JOIN import_lots il ON il.id = oi.lot_id
    JOIN books b ON b.id = il.book_id
    JOIN categories c ON c.id = b.category_id
    WHERE YEAR(o.created_at) = ?
      AND o.status = 'delivered'
    GROUP BY c.name, MONTH(o.created_at)
    ORDER BY category_name, month
  `, [year]);
}

// Top sách bán chạy — từ đơn đã giao
async function getTopBooks(limit = 10) {
  const n = Math.max(1, parseInt(limit, 10) || 10);
  return query(`
    SELECT b.id, b.title, b.thumbnail, c.name AS category_name,
      SUM(oi.quantity) AS sold_qty,
      SUM(oi.quantity * oi.unit_price) AS revenue
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    JOIN import_lots il ON il.id = oi.lot_id
    JOIN books b ON b.id = il.book_id
    LEFT JOIN categories c ON c.id = b.category_id
    WHERE o.status = 'delivered'
    GROUP BY b.id, b.title, b.thumbnail, c.name
    ORDER BY sold_qty DESC LIMIT ${n}
  `);
}

async function getRevenueStatistics(year) {
  return getMonthlyRevenue(year);
}

// Tồn kho hiện tại
async function getInventoryStatistics() {
  return query(`
    SELECT b.id, b.title, b.quantity, c.name AS category_name
    FROM books b
    LEFT JOIN categories c ON c.id = b.category_id
    WHERE b.is_deleted = 0
    ORDER BY b.quantity ASC
  `);
}

module.exports = { getMonthlyRevenue, getRevenueByCategoryByMonth, getTopBooks, getRevenueStatistics, getInventoryStatistics };
