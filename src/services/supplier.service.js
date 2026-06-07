const { query } = require('../config/db');

async function getAllSuppliers() {
  return query('SELECT * FROM suppliers WHERE is_active = 1 ORDER BY id DESC');
}

async function getSupplierById(id) {
  const rows = await query('SELECT * FROM suppliers WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function createSupplier(data) {
  const { name, phone = null, address = null, email = null } = data;
  const result = await query('INSERT INTO suppliers (name, phone, address, email, is_active) VALUES (?,?,?,?,1)', [name, phone, address, email]);
  return { insertId: result.insertId };
}

async function updateSupplier(id, data) {
  const { name, phone = null, address = null, email = null, is_active = 1 } = data;
  const result = await query('UPDATE suppliers SET name=?, phone=?, address=?, email=?, is_active=? WHERE id=?', [name, phone, address, email, is_active, id]);
  return { affectedRows: result.affectedRows };
}

async function deleteSupplier(id) {
  const result = await query('UPDATE suppliers SET is_active=0 WHERE id=?', [id]);
  return { affectedRows: result.affectedRows };
}

module.exports = { getAllSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier };
