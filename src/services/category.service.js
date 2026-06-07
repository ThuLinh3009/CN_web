const { query } = require('../config/db');

async function getAllCategories() {
  return query(`
    SELECT c.*, COUNT(b.id) AS book_count
    FROM categories c
    LEFT JOIN books b ON b.category_id = c.id AND b.is_deleted = 0
    WHERE c.is_active = 1
    GROUP BY c.id
    ORDER BY c.id ASC
  `);
}

async function getCategoryById(id) {
  const rows = await query('SELECT * FROM categories WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function createCategory(data) {
  const { name, description = null } = data;
  const result = await query('INSERT INTO categories (name, description, is_active) VALUES (?,?,1)', [name, description]);
  return { insertId: result.insertId };
}

async function updateCategory(id, data) {
  const { name, description = null, is_active = 1 } = data;
  const result = await query('UPDATE categories SET name=?, description=?, is_active=? WHERE id=?', [name, description, is_active, id]);
  return { affectedRows: result.affectedRows };
}

async function deleteCategory(id) {
  const result = await query('UPDATE categories SET is_active=0 WHERE id=?', [id]);
  return { affectedRows: result.affectedRows };
}

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
