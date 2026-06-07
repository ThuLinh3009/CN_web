const { query } = require('../config/db');

async function getAllAttributes() {
  return query('SELECT * FROM book_attributes WHERE is_deleted = 0 ORDER BY id ASC');
}

async function getAttributeById(id) {
  const rows = await query('SELECT * FROM book_attributes WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function createAttribute(data) {
  const result = await query('INSERT INTO book_attributes (name, is_deleted) VALUES (?,0)', [data.name]);
  return { insertId: result.insertId };
}

async function updateAttribute(id, data) {
  const result = await query('UPDATE book_attributes SET name=? WHERE id=?', [data.name, id]);
  return { affectedRows: result.affectedRows };
}

async function deleteAttribute(id) {
  const result = await query('UPDATE book_attributes SET is_deleted=1 WHERE id=?', [id]);
  return { affectedRows: result.affectedRows };
}

async function getBookDetails(bookId) {
  return query(`
    SELECT bd.*, ba.name AS attribute_name
    FROM book_details bd
    JOIN book_attributes ba ON ba.id = bd.attribute_id
    WHERE bd.book_id = ?
  `, [bookId]);
}

async function syncBookDetails(bookId, details) {
  // details = [{attribute_id, value, note}]
  await query('DELETE FROM book_details WHERE book_id = ?', [bookId]);
  for (const d of details) {
    await query('INSERT INTO book_details (book_id, attribute_id, value, note) VALUES (?,?,?,?)',
      [bookId, d.attribute_id, d.value, d.note || null]);
  }
  return { ok: true };
}

module.exports = { getAllAttributes, getAttributeById, createAttribute, updateAttribute, deleteAttribute, getBookDetails, syncBookDetails };
