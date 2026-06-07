const { query } = require("../config/db");

async function getAllBooks() {
  return query(`
    SELECT b.*, c.name AS category_name
    FROM books b
    LEFT JOIN categories c ON c.id = b.category_id
    WHERE b.is_deleted = 0
    ORDER BY b.id DESC
  `);
}

async function getBookById(id) {
  const books = await query(
    `
    SELECT 
      b.*, 
      c.name AS category_name,
      (
        SELECT il.id
        FROM import_lots il
        WHERE il.book_id = b.id
        ORDER BY il.id DESC
        LIMIT 1
      ) AS lot_id,
      (
        SELECT sp.new_price
        FROM import_lots il
        JOIN sale_prices sp ON sp.lot_id = il.id
        WHERE il.book_id = b.id
        ORDER BY sp.updated_at DESC
        LIMIT 1
      ) AS price
    FROM books b
    LEFT JOIN categories c ON c.id = b.category_id
    WHERE b.id = ? AND b.is_deleted = 0 
    LIMIT 1
  `,
    [id],
  );

  const book = books[0] || null;
  if (!book) return null;

  const details = await query(
    `
    SELECT bd.value, bd.note, ba.name AS attribute_name, ba.id AS attribute_id
    FROM book_details bd
    JOIN book_attributes ba ON ba.id = bd.attribute_id
    WHERE bd.book_id = ?
  `,
    [id],
  );

  book.details = details;
  return book;
}

async function getFeaturedBooks(limit = 8) {
  // mysql2 execute() không hỗ trợ LIMIT ? — nhúng trực tiếp sau khi sanitize
  const n = Math.max(1, parseInt(limit, 10) || 8);
  return query(`
    SELECT b.*, c.name AS category_name,
      (SELECT sp.new_price FROM import_lots il JOIN sale_prices sp ON sp.lot_id = il.id WHERE il.book_id = b.id ORDER BY sp.updated_at DESC LIMIT 1) AS price
    FROM books b
    LEFT JOIN categories c ON c.id = b.category_id
    WHERE b.is_active = 1 AND b.is_deleted = 0
    ORDER BY b.id DESC LIMIT ${n}
  `);
}

async function getNewestBooks(limit = 8) {
  const n = Math.max(1, parseInt(limit, 10) || 8);
  return query(`
    SELECT b.*, c.name AS category_name,
      (SELECT sp.new_price FROM import_lots il JOIN sale_prices sp ON sp.lot_id = il.id WHERE il.book_id = b.id ORDER BY sp.updated_at DESC LIMIT 1) AS price
    FROM books b
    LEFT JOIN categories c ON c.id = b.category_id
    WHERE b.is_active = 1 AND b.is_deleted = 0
    ORDER BY b.created_at DESC LIMIT ${n}
  `);
}

async function searchBooks(keyword = "") {
  const q = `%${keyword}%`;
  return query(
    `
    SELECT b.*, c.name AS category_name,
      (SELECT sp.new_price FROM import_lots il JOIN sale_prices sp ON sp.lot_id = il.id WHERE il.book_id = b.id ORDER BY sp.updated_at DESC LIMIT 1) AS price
    FROM books b
    LEFT JOIN categories c ON c.id = b.category_id
    WHERE b.is_deleted = 0 AND (b.title LIKE ? OR b.author LIKE ? OR CAST(b.id AS CHAR) LIKE ?)
    ORDER BY b.id DESC
  `,
    [q, q, q],
  );
}

async function filterByCategory(categoryId) {
  return query(
    `
    SELECT b.*, c.name AS category_name,
      (SELECT sp.new_price FROM import_lots il JOIN sale_prices sp ON sp.lot_id = il.id WHERE il.book_id = b.id ORDER BY sp.updated_at DESC LIMIT 1) AS price
    FROM books b
    LEFT JOIN categories c ON c.id = b.category_id
    WHERE b.is_deleted = 0 AND b.category_id = ?
    ORDER BY b.id DESC
  `,
    [categoryId],
  );
}

async function createBook(data) {
  const { category_id, title, author, thumbnail = null, description = null, is_active = 1 } = data;
  if (!title || !String(title).trim()) throw new Error('Vui lòng nhập tên sách');
  // quantity luôn bắt đầu từ 0, chỉ tăng qua import receipt
  const result = await query(
    `INSERT INTO books (category_id, title, author, quantity, thumbnail, description, is_active, is_deleted)
     VALUES (?, ?, ?, 0, ?, ?, ?, 0)`,
    [category_id, title, author, thumbnail, description, is_active],
  );
  return { insertId: result.insertId };
}

async function updateBook(id, data) {
  const { category_id, title, author, thumbnail, description, is_active } = data;
  // quantity bị loại khỏi đây — chỉ thay đổi qua import receipt / sales invoice
  const result = await query(
    `UPDATE books SET category_id=?, title=?, author=?, thumbnail=?, description=?, is_active=? WHERE id=?`,
    [category_id, title, author, thumbnail, description, is_active, id],
  );
  return { affectedRows: result.affectedRows };
}

async function softDeleteBook(id) {
  const result = await query("UPDATE books SET is_deleted=1 WHERE id=?", [id]);
  return { affectedRows: result.affectedRows };
}

async function toggleStatus(id) {
  const result = await query(
    "UPDATE books SET is_active = CASE WHEN is_active=1 THEN 0 ELSE 1 END WHERE id=?",
    [id],
  );
  return { affectedRows: result.affectedRows };
}

async function getInventorySummary() {
  return query(`
    SELECT b.id, b.title, b.author, c.name AS category_name,
      IFNULL(SUM(il.quantity), 0) AS total_lot_qty,
      (SELECT sp2.new_price FROM sale_prices sp2 WHERE sp2.lot_id = il.id ORDER BY sp2.updated_at DESC LIMIT 1) AS latest_price
    FROM books b
    LEFT JOIN categories c ON c.id = b.category_id
    LEFT JOIN import_lots il ON il.book_id = b.id
    LEFT JOIN sale_prices sp ON sp.lot_id = il.id
    WHERE b.is_deleted = 0
    GROUP BY b.id, b.title, b.author, c.name
    ORDER BY b.id DESC
  `);
}

module.exports = {
  getAllBooks,
  getBookById,
  getFeaturedBooks,
  getNewestBooks,
  searchBooks,
  filterByCategory,
  createBook,
  updateBook,
  softDeleteBook,
  toggleStatus,
  getInventorySummary,
};
