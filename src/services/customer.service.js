const { query } = require('../config/db');

async function getAllCustomers() {
  return query('SELECT * FROM customers ORDER BY id DESC');
}

async function getCustomerById(id) {
  const rows = await query('SELECT * FROM customers WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function findCustomerByPhone(phone) {
  const rows = await query('SELECT * FROM customers WHERE phone = ? AND is_active = 1 LIMIT 1', [phone]);
  return rows[0] || null;
}

async function createCustomer(data) {
  const { full_name, username, password = '123456', email = null, phone = null, address = null, gender = 1 } = data;
  const bcrypt = require('bcryptjs');
  const hashed = await bcrypt.hash(password, 10);
  const result = await query(
    `INSERT INTO customers (full_name, username, password, email, phone, address, gender, is_active) VALUES (?,?,?,?,?,?,?,1)`,
    [full_name, username, hashed, email, phone, address, gender]
  );
  return { insertId: result.insertId };
}

async function updateCustomer(id, data) {
  const { full_name, email, phone, address, gender, is_active = 1 } = data;
  const result = await query(
    `UPDATE customers SET full_name=?, email=?, phone=?, address=?, gender=?, is_active=? WHERE id=?`,
    [full_name, email, phone, address, gender, is_active, id]
  );
  return { affectedRows: result.affectedRows };
}

async function deleteCustomer(id) {
  const result = await query('UPDATE customers SET is_active=0 WHERE id=?', [id]);
  return { affectedRows: result.affectedRows };
}

module.exports = { getAllCustomers, getCustomerById, findCustomerByPhone, createCustomer, updateCustomer, deleteCustomer };
