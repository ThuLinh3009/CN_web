const { query } = require('../config/db');
const bcrypt = require('bcryptjs');

async function getAllEmployees() {
  return query(`
    SELECT e.*, r.name AS role_name
    FROM employees e
    LEFT JOIN roles r ON r.id = e.role_id
    ORDER BY e.id DESC
  `);
}

async function getEmployeeById(id) {
  const rows = await query(`
    SELECT e.*, r.name AS role_name
    FROM employees e
    LEFT JOIN roles r ON r.id = e.role_id
    WHERE e.id = ? LIMIT 1
  `, [id]);
  return rows[0] || null;
}

async function createEmployee(data) {
  const { role_id = 2, full_name, username, password, email = null, phone = null, address = null, gender = 1, birth_date = null } = data;
  if (!full_name || !String(full_name).trim()) throw new Error('Vui lòng nhập họ tên nhân viên');
  if (!username || !/^[a-zA-Z0-9_.]{3,50}$/.test(String(username).trim())) throw new Error('Tên đăng nhập 3-50 ký tự, chỉ gồm chữ cái, số, dấu chấm và gạch dưới');
  if (!password || password.trim().length < 6) throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) throw new Error('Email không hợp lệ');

  const existing = await query('SELECT id FROM employees WHERE username = ? LIMIT 1', [username]);
  if (existing.length) throw new Error('Tên đăng nhập đã tồn tại');

  const hashed = await bcrypt.hash(password, 10);
  const result = await query(
    `INSERT INTO employees (role_id, full_name, username, password, email, phone, address, gender, birth_date, is_active) VALUES (?,?,?,?,?,?,?,?,?,1)`,
    [role_id, full_name.trim(), username.trim(), hashed, email || null, phone || null, address || null, gender, birth_date || null]
  );
  return { insertId: result.insertId };
}

async function updateEmployee(id, data) {
  const { role_id, full_name, username, email, phone, address, gender, birth_date, is_active = 1, password } = data;
  if (!full_name || !String(full_name).trim()) throw new Error('Vui lòng nhập họ tên nhân viên');
  if (!username || !/^[a-zA-Z0-9_.]{3,50}$/.test(String(username).trim())) throw new Error('Tên đăng nhập không hợp lệ');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) throw new Error('Email không hợp lệ');

  // Kiểm tra username trùng với nhân viên khác
  const existing = await query('SELECT id FROM employees WHERE username = ? AND id != ? LIMIT 1', [username, id]);
  if (existing.length) throw new Error('Tên đăng nhập đã tồn tại');

  if (password) {
    if (password.trim().length < 6) throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
    const hashed = await bcrypt.hash(password, 10);
    const result = await query(
      `UPDATE employees SET role_id=?, full_name=?, username=?, password=?, email=?, phone=?, address=?, gender=?, birth_date=?, is_active=? WHERE id=?`,
      [role_id, full_name, username, hashed, email, phone, address, gender, birth_date, is_active, id]
    );
    return { affectedRows: result.affectedRows };
  }
  const result = await query(
    `UPDATE employees SET role_id=?, full_name=?, username=?, email=?, phone=?, address=?, gender=?, birth_date=?, is_active=? WHERE id=?`,
    [role_id, full_name, username, email, phone, address, gender, birth_date, is_active, id]
  );
  return { affectedRows: result.affectedRows };
}

async function deleteEmployee(id) {
  const result = await query('UPDATE employees SET is_active=0 WHERE id=?', [id]);
  return { affectedRows: result.affectedRows };
}

async function getAllRoles() {
  return query('SELECT * FROM roles ORDER BY id ASC');
}

module.exports = { getAllEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee, getAllRoles };
