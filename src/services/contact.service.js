const { query } = require('../config/db');

async function getAllContacts() {
  return query('SELECT * FROM contacts ORDER BY created_at DESC');
}

async function createContact(data) {
  const { full_name, email, phone, message } = data;
  const result = await query(
    'INSERT INTO contacts (full_name, email, phone, message, is_read) VALUES (?,?,?,?,0)',
    [full_name, email || null, phone || null, message]
  );
  return { insertId: result.insertId };
}

async function markRead(id) {
  const result = await query('UPDATE contacts SET is_read=1 WHERE id=?', [id]);
  return { affectedRows: result.affectedRows };
}

async function getContactById(id) {
  const rows = await query('SELECT * FROM contacts WHERE id=? LIMIT 1', [id]);
  return rows[0] || null;
}

module.exports = { getAllContacts, createContact, markRead, getContactById };
