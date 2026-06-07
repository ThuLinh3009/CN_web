const { query, withTransaction, queryConn } = require('../config/db');

async function getAllImportReceipts() {
  return query(`
    SELECT ir.*, e.full_name AS employee_name, s.name AS supplier_name
    FROM import_receipts ir
    LEFT JOIN employees e ON e.id = ir.employee_id
    LEFT JOIN suppliers s ON s.id = ir.supplier_id
    ORDER BY ir.id DESC
  `);
}

async function getImportReceiptById(id) {
  const rows = await query(`
    SELECT ir.*, e.full_name AS employee_name, s.name AS supplier_name
    FROM import_receipts ir
    LEFT JOIN employees e ON e.id = ir.employee_id
    LEFT JOIN suppliers s ON s.id = ir.supplier_id
    WHERE ir.id = ? LIMIT 1
  `, [id]);
  const receipt = rows[0] || null;
  if (!receipt) return null;
  const items = await query(`
    SELECT iri.*, il.book_id, b.title AS book_title, il.location
    FROM import_receipt_items iri
    JOIN import_lots il ON il.id = iri.lot_id
    JOIN books b ON b.id = il.book_id
    WHERE iri.receipt_id = ?
  `, [id]);
  receipt.items = items;
  return receipt;
}

async function createImportReceipt(data) {
  // Tạo phiếu nhập ở trạng thái 'pending' — chưa cộng tồn kho
  const { employee_id, supplier_id, items = [] } = data;
  if (!employee_id) throw new Error('Không xác định được nhân viên');
  if (!supplier_id) throw new Error('Vui lòng chọn nhà cung cấp');
  if (items.length === 0) throw new Error('Phiếu nhập phải có ít nhất 1 sản phẩm');

  return withTransaction(async (conn) => {
    const q = queryConn(conn);

    const receiptResult = await q(
      "INSERT INTO import_receipts (employee_id, supplier_id, status) VALUES (?,?,'pending')",
      [employee_id, supplier_id]
    );
    const receiptId = receiptResult.insertId;

    for (const item of items) {
      const qty = Number(item.quantity);
      const price = Number(item.unit_price);
      if (!qty || qty <= 0) throw new Error('Số lượng nhập phải lớn hơn 0');
      if (price <= 0) throw new Error('Đơn giá phải lớn hơn 0');

      const lots = await q('SELECT book_id FROM import_lots WHERE id = ? LIMIT 1', [item.lot_id]);
      if (!lots[0]) throw new Error(`Lô hàng #${item.lot_id} không tồn tại`);

      await q(
        'INSERT INTO import_receipt_items (receipt_id, lot_id, quantity, unit_price) VALUES (?,?,?,?)',
        [receiptId, item.lot_id, qty, price]
      );
      // Chưa cộng kho — chờ confirmImportReceipt
    }

    return { insertId: receiptId };
  });
}

async function updateImportReceipt(id, data) {
  return withTransaction(async (conn) => {
    const q = queryConn(conn);

    const receipts = await q('SELECT * FROM import_receipts WHERE id = ? LIMIT 1', [id]);
    const receipt = receipts[0];
    if (!receipt) throw new Error('Phiếu nhập không tồn tại');
    if (receipt.status === 'confirmed') throw new Error('Không thể sửa phiếu nhập đã xác nhận');

    const { supplier_id, note = null, items = [] } = data;
    if (!supplier_id) throw new Error('Vui lòng chọn nhà cung cấp');
    if (items.length === 0) throw new Error('Phiếu nhập phải có ít nhất 1 sản phẩm');

    await q('UPDATE import_receipts SET supplier_id=?, note=? WHERE id=?', [supplier_id, note, id]);

    // Xóa items cũ rồi insert lại
    await q('DELETE FROM import_receipt_items WHERE receipt_id=?', [id]);
    for (const item of items) {
      const qty = Number(item.quantity);
      const price = Number(item.unit_price);
      if (!qty || qty <= 0) throw new Error('Số lượng nhập phải lớn hơn 0');
      if (price <= 0) throw new Error('Đơn giá phải lớn hơn 0');
      const lots = await q('SELECT book_id FROM import_lots WHERE id = ? LIMIT 1', [item.lot_id]);
      if (!lots[0]) throw new Error(`Lô hàng #${item.lot_id} không tồn tại`);
      await q('INSERT INTO import_receipt_items (receipt_id, lot_id, quantity, unit_price) VALUES (?,?,?,?)',
        [id, item.lot_id, qty, price]);
    }
    return { ok: true };
  });
}

async function confirmImportReceipt(id) {
  // Xác nhận phiếu nhập: cộng tồn kho và chuyển status → 'confirmed'
  return withTransaction(async (conn) => {
    const q = queryConn(conn);

    const receipts = await q(
      "SELECT * FROM import_receipts WHERE id = ? LIMIT 1", [id]
    );
    const receipt = receipts[0];
    if (!receipt) throw new Error('Phiếu nhập không tồn tại');
    if (receipt.status === 'confirmed') throw new Error('Phiếu nhập này đã được xác nhận');

    const items = await q(
      'SELECT iri.*, il.book_id FROM import_receipt_items iri JOIN import_lots il ON il.id = iri.lot_id WHERE iri.receipt_id = ?',
      [id]
    );
    if (items.length === 0) throw new Error('Phiếu nhập không có sản phẩm nào');

    for (const item of items) {
      await q('UPDATE books SET quantity = quantity + ? WHERE id = ?', [item.quantity, item.book_id]);
      await q('UPDATE import_lots SET quantity = quantity + ? WHERE id = ?', [item.quantity, item.lot_id]);
    }

    await q("UPDATE import_receipts SET status = 'confirmed' WHERE id = ?", [id]);
    return { ok: true, id };
  });
}

module.exports = { getAllImportReceipts, getImportReceiptById, createImportReceipt, updateImportReceipt, confirmImportReceipt };
