const { query, withTransaction, queryConn } = require('../config/db');

async function getAllSalesInvoices() {
  return query(`
    SELECT si.*, e.full_name AS employee_name, c.full_name AS customer_name
    FROM sales_invoices si
    LEFT JOIN employees e ON e.id = si.employee_id
    LEFT JOIN customers c ON c.id = si.customer_id
    ORDER BY si.id DESC
  `);
}

async function getSalesInvoiceById(id) {
  const rows = await query(`
    SELECT si.*, e.full_name AS employee_name, c.full_name AS customer_name
    FROM sales_invoices si
    LEFT JOIN employees e ON e.id = si.employee_id
    LEFT JOIN customers c ON c.id = si.customer_id
    WHERE si.id = ? LIMIT 1
  `, [id]);
  const invoice = rows[0] || null;
  if (!invoice) return null;
  const items = await query(`
    SELECT sii.*, b.title AS book_title, il.book_id
    FROM sales_invoice_items sii
    JOIN import_lots il ON il.id = sii.lot_id
    JOIN books b ON b.id = il.book_id
    WHERE sii.invoice_id = ?
  `, [id]);
  invoice.items = items;
  return invoice;
}

async function createSalesInvoice(data) {
  // data: { employee_id, customer_id, discount, items:[{lot_id, quantity, unit_price}] }
  const { employee_id, customer_id = null, discount = 0, items = [] } = data;
  if (!employee_id) throw new Error('Không xác định được nhân viên');
  if (items.length === 0) throw new Error('Hóa đơn phải có ít nhất 1 sản phẩm');
  if (Number(discount) < 0) throw new Error('Giảm giá không hợp lệ');

  return withTransaction(async (conn) => {
    const q = queryConn(conn);

    const result = await q(
      'INSERT INTO sales_invoices (employee_id, customer_id, discount) VALUES (?,?,?)',
      [employee_id, customer_id, Number(discount)]
    );
    const invoiceId = result.insertId;

    for (const item of items) {
      const qty = Number(item.quantity);
      const price = Number(item.unit_price);
      if (!qty || qty <= 0) throw new Error('Số lượng bán phải lớn hơn 0');
      if (price <= 0) throw new Error('Đơn giá phải lớn hơn 0');

      const lots = await q('SELECT book_id FROM import_lots WHERE id = ? LIMIT 1', [item.lot_id]);
      if (!lots[0]) throw new Error(`Lô hàng #${item.lot_id} không tồn tại`);
      const bookId = lots[0].book_id;

      await q(
        'INSERT INTO sales_invoice_items (invoice_id, lot_id, quantity, unit_price) VALUES (?,?,?,?)',
        [invoiceId, item.lot_id, qty, price]
      );

      const deductBook = await q(
        'UPDATE books SET quantity = quantity - ? WHERE id = ? AND quantity >= ?',
        [qty, bookId, qty]
      );
      if (deductBook.affectedRows === 0) {
        throw new Error(`Sách #${bookId} không đủ tồn kho`);
      }

      const deductLot = await q(
        'UPDATE import_lots SET quantity = quantity - ? WHERE id = ? AND quantity >= ?',
        [qty, item.lot_id, qty]
      );
      if (deductLot.affectedRows === 0) {
        throw new Error(`Lô hàng #${item.lot_id} không đủ số lượng`);
      }
    }

    return { insertId: invoiceId };
  });
}

async function markPaid(id) {
  const rows = await query(
    'SELECT id, payment_status FROM sales_invoices WHERE id = ? LIMIT 1', [id]
  );
  const invoice = rows[0];
  if (!invoice) throw new Error('Hóa đơn không tồn tại');
  if (invoice.payment_status === 'paid') throw new Error('Hóa đơn này đã được thanh toán');
  await query('UPDATE sales_invoices SET payment_status = ? WHERE id = ?', ['paid', id]);
  return { ok: true };
}

async function printInvoice(id) {
  return getSalesInvoiceById(id);
}

module.exports = { getAllSalesInvoices, getSalesInvoiceById, createSalesInvoice, markPaid, printInvoice };
