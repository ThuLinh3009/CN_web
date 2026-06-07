const { query } = require('../config/db');

async function getAllLots() {
  return query(`
    SELECT il.*, b.title AS book_title,
      (SELECT sp.new_price FROM sale_prices sp WHERE sp.lot_id = il.id ORDER BY sp.updated_at DESC LIMIT 1) AS sale_price
    FROM import_lots il
    JOIN books b ON b.id = il.book_id
    ORDER BY il.id DESC
  `);
}

async function getLotById(id) {
  const rows = await query(`
    SELECT il.*, b.title AS book_title,
      (SELECT sp.new_price FROM sale_prices sp WHERE sp.lot_id = il.id ORDER BY sp.updated_at DESC LIMIT 1) AS sale_price
    FROM import_lots il
    JOIN books b ON b.id = il.book_id
    WHERE il.id = ? LIMIT 1
  `, [id]);
  return rows[0] || null;
}

async function getLotsByBook(bookId) {
  return query(`
    SELECT il.*,
      (SELECT sp.new_price FROM sale_prices sp WHERE sp.lot_id = il.id ORDER BY sp.updated_at DESC LIMIT 1) AS sale_price
    FROM import_lots il WHERE il.book_id = ? ORDER BY il.id DESC
  `, [bookId]);
}

async function createLot(data) {
  const { book_id, location = null, note = null } = data;
  if (!book_id) throw Object.assign(new Error('Vui lòng chọn sách'), { isValidation: true });
  // quantity luôn = 0 khi tạo lô — chỉ tăng qua xác nhận phiếu nhập
  const result = await query(
    'INSERT INTO import_lots (book_id, quantity, location, note) VALUES (?,0,?,?)',
    [book_id, location, note]
  );
  return { insertId: result.insertId };
}

async function updateLot(id, data) {
  const { book_id, location, note } = data;
  // Không cho phép ghi đè quantity trực tiếp — chỉ qua import receipt
  const result = await query(
    'UPDATE import_lots SET book_id=?, location=?, note=? WHERE id=?',
    [book_id, location, note, id]
  );
  return { affectedRows: result.affectedRows };
}

async function getLotLatestSalePrice(lotId) {
  const rows = await query('SELECT * FROM sale_prices WHERE lot_id = ? ORDER BY updated_at DESC LIMIT 1', [lotId]);
  return rows[0] || null;
}

async function setSalePrice(lotId, newPrice, oldPrice = null) {
  const price = Number(newPrice);
  if (!price || price <= 0) throw new Error('Giá bán phải lớn hơn 0');

  // Lấy giá hiện tại để lưu làm old_price
  if (oldPrice === null) {
    const current = await getLotLatestSalePrice(lotId);
    oldPrice = current ? Number(current.new_price) : 0;
  }

  const result = await query(
    'INSERT INTO sale_prices (lot_id, old_price, new_price) VALUES (?,?,?)',
    [lotId, oldPrice, price]
  );
  return { insertId: result.insertId };
}

module.exports = { getAllLots, getLotById, getLotsByBook, createLot, updateLot, getLotLatestSalePrice, setSalePrice };
