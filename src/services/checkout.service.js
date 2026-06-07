const { query, withTransaction, queryConn } = require('../config/db');
const cartService = require('./cart.service');

function buildShippingAddress(shippingInfo) {
  const street = String(shippingInfo.street_address || '').trim();
  const ward = String(shippingInfo.ward_name || '').trim();
  const province = String(shippingInfo.province_name || '').trim();

  if (street && ward && province) {
    return [street, ward, province].join(', ');
  }

  return String(shippingInfo.shipping_address || '').trim();
}

async function placeOrder(customerId, shippingInfo) {
  // shippingInfo mới: { recipient_name, recipient_phone, street_address, province_code, province_name, ward_code, ward_name, note, payment_method, discount }
  // shipping_address vẫn được giữ để tương thích với cột orders.shipping_address hiện tại.
  const { items, total } = await cartService.getCart(customerId);
  if (!items || items.length === 0) return { ok: false, message: 'Giỏ hàng trống' };

  const recipientName = String(shippingInfo.recipient_name || '').trim();
  const recipientPhone = String(shippingInfo.recipient_phone || '').trim();
  const shippingAddress = buildShippingAddress(shippingInfo);

  if (!recipientName) return { ok: false, message: 'Vui lòng nhập người nhận' };
  if (!recipientPhone) return { ok: false, message: 'Vui lòng nhập số điện thoại' };
  if (!shippingAddress) return { ok: false, message: 'Vui lòng nhập đầy đủ địa chỉ giao hàng' };
  if (!shippingInfo.province_code || !shippingInfo.ward_code) {
    return { ok: false, message: 'Vui lòng chọn Tỉnh/Thành phố và Xã/Phường theo địa chỉ 2 cấp mới' };
  }

  const code = 'ORD-' + Date.now();
  const discount = Math.max(0, Math.min(Number(shippingInfo.discount || 0), total));
  const totalAmount = total - discount;

  return withTransaction(async (conn) => {
    const q = queryConn(conn);

    const result = await q(
      `INSERT INTO orders (customer_id, code, recipient_name, recipient_phone, shipping_address, note, total_amount, discount, payment_method, payment_status, status)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [customerId, code, recipientName, recipientPhone,
       shippingAddress, shippingInfo.note || null,
       totalAmount, discount, shippingInfo.payment_method || 'COD', 'unpaid', 'pending']
    );
    const orderId = result.insertId;

    for (const item of items) {
      // Lấy giá từ DB, không tin giá từ client
      const priceRows = await q(
        'SELECT new_price AS sale_price FROM sale_prices WHERE lot_id = ? ORDER BY updated_at DESC LIMIT 1',
        [item.lot_id]
      );
      const unitPrice = priceRows[0] ? Number(priceRows[0].sale_price) : Number(item.unit_price);

      await q(
        'INSERT INTO order_items (order_id, lot_id, quantity, unit_price) VALUES (?,?,?,?)',
        [orderId, item.lot_id, item.quantity, unitPrice]
      );

      // Trừ tồn kho — kiểm tra affected rows để phát hiện thiếu hàng
      const deductBook = await q(
        'UPDATE books SET quantity = quantity - ? WHERE id = ? AND quantity >= ?',
        [item.quantity, item.book_id, item.quantity]
      );
      if (deductBook.affectedRows === 0) {
        throw new Error(`Sách "${item.title || item.book_id}" không đủ tồn kho`);
      }

      const deductLot = await q(
        'UPDATE import_lots SET quantity = quantity - ? WHERE id = ? AND quantity >= ?',
        [item.quantity, item.lot_id, item.quantity]
      );
      if (deductLot.affectedRows === 0) {
        throw new Error(`Lô hàng #${item.lot_id} không đủ số lượng`);
      }
    }

    await cartService.clearCart(customerId);
    return { ok: true, orderId, code };
  });
}

async function getOrderById(id, customerId = null) {
  let sql = 'SELECT o.*, c.full_name AS customer_name FROM orders o LEFT JOIN customers c ON c.id = o.customer_id WHERE o.id = ?';
  const params = [id];
  if (customerId) {
    sql += ' AND o.customer_id = ?';
    params.push(customerId);
  }
  sql += ' LIMIT 1';
  const rows = await query(sql, params);
  const order = rows[0] || null;
  if (!order) return null;
  const items = await query(`
    SELECT oi.*, b.title, b.thumbnail
    FROM order_items oi
    JOIN import_lots il ON il.id = oi.lot_id
    JOIN books b ON b.id = il.book_id
    WHERE oi.order_id = ?
  `, [id]);
  order.items = items;
  return order;
}

module.exports = { placeOrder, getOrderById, buildShippingAddress };
