const { query } = require("../config/db");

async function getProfile(customerId) {
  const rows = await query(
    "SELECT id, full_name, username, email, phone, address, gender, created_at FROM customers WHERE id = ? LIMIT 1",
    [customerId],
  );
  return rows[0] || null;
}

async function updateProfile(customerId, data) {
  const { full_name, email, phone, address, gender } = data;
  const result = await query(
    "UPDATE customers SET full_name=?, email=?, phone=?, address=?, gender=? WHERE id=?",
    [full_name, email, phone, address, gender, customerId],
  );
  return { affectedRows: result.affectedRows };
}

async function getOrderHistory(customerId) {
  const orders = await query(
    `
    SELECT 
      o.*,
      COALESCE(item_stats.item_count, 0) AS item_count
    FROM orders o
    LEFT JOIN (
      SELECT order_id, COUNT(*) AS item_count
      FROM order_items
      GROUP BY order_id
    ) item_stats ON item_stats.order_id = o.id
    WHERE o.customer_id = ?
    ORDER BY o.created_at DESC
  `,
    [customerId],
  );

  return orders;
}

async function getOrderDetail(orderId, customerId) {
  const rows = await query(
    "SELECT * FROM orders WHERE id = ? AND customer_id = ? LIMIT 1",
    [orderId, customerId],
  );
  const order = rows[0] || null;
  if (!order) return null;
  const items = await query(
    `
    SELECT oi.*, b.title, b.thumbnail
    FROM order_items oi
    JOIN import_lots il ON il.id = oi.lot_id
    JOIN books b ON b.id = il.book_id
    WHERE oi.order_id = ?
  `,
    [orderId],
  );
  order.items = items;
  return order;
}

module.exports = { getProfile, updateProfile, getOrderHistory, getOrderDetail };
