const { query } = require('../config/db');

async function getNews(limit = 10) {
  const n = Math.max(1, parseInt(limit, 10) || 10);
  return query(`SELECT * FROM news WHERE is_published = 1 ORDER BY created_at DESC LIMIT ${n}`);
}

async function getNewsById(id) {
  const rows = await query('SELECT * FROM news WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

module.exports = { getNews, getNewsById };
