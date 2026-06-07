const { query, withTransaction, queryConn } = require('../config/db');

const VALID_STATUSES = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];

async function getAllOrders({ status, page = 1, limit = 20 } = {}) {
  let sql = `
    SELECT o.id, o.code, o.recipient_name, o.recipient_phone, o.shipping_address,
           o.total_amount, o.discount, o.payment_method, o.payment_status,
           o.status, o.note, o.created_at,
           c.full_name AS customer_name, c.email AS customer_email
    FROM orders o
    LEFT JOIN customers c ON c.id = o.customer_id
  `;
  const params = [];
  if (status && VALID_STATUSES.includes(status)) {
    sql += ' WHERE o.status = ?';
    params.push(status);
  }
  sql += ' ORDER BY o.created_at DESC';

  const safeLimit = Math.max(1, Math.min(200, parseInt(limit) || 20));
  const safePage  = Math.max(1, parseInt(page) || 1);
  const offset    = (safePage - 1) * safeLimit;
  sql += ` LIMIT ${safeLimit} OFFSET ${offset}`;

  return query(sql, params);
}

async function countOrders({ status } = {}) {
  let sql = 'SELECT COUNT(*) AS total FROM orders';
  const params = [];
  if (status && VALID_STATUSES.includes(status)) {
    sql += ' WHERE status = ?';
    params.push(status);
  }
  const rows = await query(sql, params);
  return Number(rows[0]?.total || 0);
}

async function getOrderById(id) {
  const rows = await query(`
    SELECT o.*, c.full_name AS customer_name, c.email AS customer_email, c.phone AS customer_phone
    FROM orders o
    LEFT JOIN customers c ON c.id = o.customer_id
    WHERE o.id = ?
    LIMIT 1
  `, [id]);
  const order = rows[0] || null;
  if (!order) return null;

  const items = await query(`
    SELECT oi.*, b.title AS book_title, b.thumbnail
    FROM order_items oi
    JOIN import_lots il ON il.id = oi.lot_id
    JOIN books b ON b.id = il.book_id
    WHERE oi.order_id = ?
  `, [id]);
  order.items = items;
  return order;
}

async function updateOrderStatus(id, newStatus) {
  if (!VALID_STATUSES.includes(newStatus)) {
    throw Object.assign(new Error('Trạng thái đơn hàng không hợp lệ'), { isValidation: true });
  }

  return withTransaction(async (conn) => {
    const q = queryConn(conn);

    const rows = await q('SELECT id, status FROM orders WHERE id = ? LIMIT 1', [id]);
    const order = rows[0];
    if (!order) throw Object.assign(new Error('Đơn hàng không tồn tại'), { isValidation: true });

    // Luật chuyển trạng thái
    const current = order.status;
    const allowed = {
      pending:   ['confirmed', 'cancelled'],
      confirmed: ['shipping', 'cancelled'],
      shipping:  ['delivered'],
      delivered: [],
      cancelled: [],
    };
    if (!(allowed[current] || []).includes(newStatus)) {
      throw Object.assign(
        new Error(`Không thể chuyển từ "${current}" sang "${newStatus}"`),
        { isValidation: true }
      );
    }

    // Nếu hủy đơn → hoàn tồn kho
    if (newStatus === 'cancelled') {
      const items = await q(`
        SELECT oi.lot_id, oi.quantity, il.book_id
        FROM order_items oi
        JOIN import_lots il ON il.id = oi.lot_id
        WHERE oi.order_id = ?
      `, [id]);

      for (const item of items) {
        await q('UPDATE books SET quantity = quantity + ? WHERE id = ?', [item.quantity, item.book_id]);
        await q('UPDATE import_lots SET quantity = quantity + ? WHERE id = ?', [item.quantity, item.lot_id]);
      }
    }

    await q('UPDATE orders SET status = ? WHERE id = ?', [newStatus, id]);
    return { ok: true };
  });
}

async function markOrderPaid(id) {
  const rows = await query(
    'SELECT id, status, payment_status FROM orders WHERE id = ? LIMIT 1', [id]
  );
  const order = rows[0];
  if (!order) throw Object.assign(new Error('Đơn hàng không tồn tại'), { isValidation: true });

  // Không cho thu tiền đơn đã hủy
  if (order.status === 'cancelled') {
    throw Object.assign(new Error('Đơn hàng đã bị hủy, không thể xác nhận thanh toán'), { isValidation: true });
  }
  // Không cho thu tiền đơn pending (chưa xác nhận)
  if (order.status === 'pending') {
    throw Object.assign(new Error('Vui lòng xác nhận đơn hàng trước khi đánh dấu thanh toán'), { isValidation: true });
  }
  if (order.payment_status === 'paid') {
    throw Object.assign(new Error('Đơn hàng này đã được thanh toán'), { isValidation: true });
  }

  await query('UPDATE orders SET payment_status = ? WHERE id = ?', ['paid', id]);
  return { ok: true };
}

module.exports = { getAllOrders, countOrders, getOrderById, updateOrderStatus, markOrderPaid, VALID_STATUSES };
