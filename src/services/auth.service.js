const { query } = require('../config/db');
const bcrypt = require('bcryptjs');

async function loginEmployee(username, password) {
  const rows = await query(
    `SELECT e.*, r.name AS role_name FROM employees e
     LEFT JOIN roles r ON r.id = e.role_id
     WHERE e.username = ? AND e.is_active = 1 LIMIT 1`,
    [username]
  );
  const emp = rows[0];
  if (!emp) return { ok: false, message: 'Sai tài khoản hoặc mật khẩu' };
  const matched = await bcrypt.compare(password || '', emp.password || '');
  if (!matched) return { ok: false, message: 'Sai tài khoản hoặc mật khẩu' };
  return {
    ok: true,
    user: { id: emp.id, full_name: emp.full_name, username: emp.username, role: emp.role_name, role_id: emp.role_id }
  };
}

async function loginCustomer(username, password) {
  const rows = await query(
    `SELECT * FROM customers WHERE username = ? AND is_active = 1 LIMIT 1`,
    [username]
  );
  const cust = rows[0];
  if (!cust) return { ok: false, message: 'Sai tài khoản hoặc mật khẩu' };
  const matched = await bcrypt.compare(password || '', cust.password || '');
  if (!matched) return { ok: false, message: 'Sai tài khoản hoặc mật khẩu' };
  return {
    ok: true,
    user: { id: cust.id, full_name: cust.full_name, username: cust.username, role: 'customer' }
  };
}

async function registerCustomer(data) {
  const { full_name, username, password, email, phone, address, gender = 1 } = data;
  if (!full_name || !String(full_name).trim()) return { ok: false, message: 'Vui lòng nhập họ tên' };
  if (!username || !password) return { ok: false, message: 'Vui lòng nhập đầy đủ thông tin' };
  if (String(password).length < 6) return { ok: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' };
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return { ok: false, message: 'Mật khẩu phải gồm cả chữ cái và chữ số' };
  }
  if (email && String(email).trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
    return { ok: false, message: 'Email không hợp lệ' };
  }
  const existing = await query('SELECT id FROM customers WHERE username = ? LIMIT 1', [username]);
  if (existing.length) return { ok: false, message: 'Tên đăng nhập đã tồn tại' };
  const hashed = await bcrypt.hash(password, 10);
  const result = await query(
    `INSERT INTO customers (full_name, username, password, email, phone, address, gender, is_active) VALUES (?,?,?,?,?,?,?,1)`,
    [full_name, username, hashed, email || null, phone || null, address || null, gender]
  );
  return { ok: true, insertId: result.insertId };
}

async function changePassword(customerId, oldPassword, newPassword) {
  if (!newPassword || String(newPassword).length < 6) {
    return { ok: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự' };
  }
  if (!/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
    return { ok: false, message: 'Mật khẩu mới phải gồm cả chữ cái và chữ số' };
  }
  if (oldPassword === newPassword) {
    return { ok: false, message: 'Mật khẩu mới phải khác mật khẩu cũ' };
  }
  const rows = await query('SELECT * FROM customers WHERE id = ? LIMIT 1', [customerId]);
  const cust = rows[0];
  if (!cust) return { ok: false, message: 'Không tìm thấy tài khoản' };
  const matched = await bcrypt.compare(oldPassword || '', cust.password || '');
  if (!matched) return { ok: false, message: 'Mật khẩu cũ không đúng' };
  const hashed = await bcrypt.hash(newPassword, 10);
  await query('UPDATE customers SET password = ? WHERE id = ?', [hashed, customerId]);
  return { ok: true };
}

module.exports = { loginEmployee, loginCustomer, registerCustomer, changePassword };
