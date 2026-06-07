// Tập trung toàn bộ validation logic — không phụ thuộc thư viện ngoài

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(0|\+84)[0-9]{8,10}$/;
const USERNAME_RE = /^[a-zA-Z0-9_.]{3,50}$/;

function assert(cond, msg) {
  if (!cond) throw Object.assign(new Error(msg), { isValidation: true });
}

// ── Auth ────────────────────────────────────────────────────────────────────

function validateLogin(body) {
  const { username, password } = body;
  assert(username && String(username).trim(), 'Vui lòng nhập tên đăng nhập');
  assert(password && String(password).trim(), 'Vui lòng nhập mật khẩu');
}

function validateRegister(body) {
  const { full_name, username, password, email, phone } = body;
  assert(full_name && String(full_name).trim().length >= 2, 'Họ tên phải có ít nhất 2 ký tự');
  assert(username && USERNAME_RE.test(String(username).trim()),
    'Tên đăng nhập 3-50 ký tự, chỉ gồm chữ cái, số, dấu chấm và gạch dưới');
  assert(password && String(password).length >= 6, 'Mật khẩu phải có ít nhất 6 ký tự');
  assert(/[A-Za-z]/.test(password) && /[0-9]/.test(password),
    'Mật khẩu phải gồm cả chữ cái và chữ số');
  if (email && String(email).trim()) {
    assert(EMAIL_RE.test(String(email).trim()), 'Email không hợp lệ');
  }
  if (phone && String(phone).trim()) {
    assert(PHONE_RE.test(String(phone).trim()), 'Số điện thoại không hợp lệ (bắt đầu 0 hoặc +84, 9-11 chữ số)');
  }
}

function validateChangePassword(body) {
  const { old_password, new_password } = body;
  assert(old_password && String(old_password).trim(), 'Vui lòng nhập mật khẩu cũ');
  assert(new_password && String(new_password).length >= 6, 'Mật khẩu mới phải có ít nhất 6 ký tự');
  assert(/[A-Za-z]/.test(new_password) && /[0-9]/.test(new_password),
    'Mật khẩu mới phải gồm cả chữ cái và chữ số');
  assert(old_password !== new_password, 'Mật khẩu mới phải khác mật khẩu cũ');
}

// ── Cart ────────────────────────────────────────────────────────────────────

function validateAddToCart(body) {
  const lotId = Number(body.lot_id);
  const qty = Number(body.quantity ?? 1);
  assert(Number.isInteger(lotId) && lotId > 0, 'Sản phẩm không hợp lệ');
  assert(Number.isInteger(qty) && qty >= 1 && qty <= 999, 'Số lượng phải từ 1 đến 999');
}

function validateUpdateCart(body) {
  const lotId = Number(body.lot_id);
  const qty = Number(body.quantity);
  assert(Number.isInteger(lotId) && lotId > 0, 'Sản phẩm không hợp lệ');
  assert(!isNaN(qty) && qty >= 0 && qty <= 999, 'Số lượng phải từ 0 đến 999');
}

// ── Checkout ────────────────────────────────────────────────────────────────

function validateCheckout(body) {
  const { recipient_name, recipient_phone, province_code, ward_code, street_address, payment_method } = body;
  assert(recipient_name && String(recipient_name).trim().length >= 2, 'Vui lòng nhập tên người nhận (ít nhất 2 ký tự)');
  assert(recipient_phone && PHONE_RE.test(String(recipient_phone).trim()), 'Số điện thoại người nhận không hợp lệ');
  assert(province_code && String(province_code).trim(), 'Vui lòng chọn Tỉnh/Thành phố');
  assert(ward_code && String(ward_code).trim(), 'Vui lòng chọn Xã/Phường');
  assert(street_address && String(street_address).trim().length >= 5, 'Vui lòng nhập địa chỉ chi tiết (ít nhất 5 ký tự)');
  assert(!payment_method || ['COD', 'BANK', 'QR'].includes(payment_method), 'Phương thức thanh toán không hợp lệ');
  const discount = Number(body.discount ?? 0);
  assert(!isNaN(discount) && discount >= 0, 'Giảm giá không hợp lệ');
}

// ── Sales Invoice ───────────────────────────────────────────────────────────

function validateCreateSalesInvoice(body) {
  const { employee_id, items, discount = 0 } = body;
  assert(employee_id && Number(employee_id) > 0, 'Không xác định được nhân viên');
  assert(Array.isArray(items) && items.length > 0, 'Hóa đơn phải có ít nhất 1 sản phẩm');
  const disc = Number(discount);
  assert(!isNaN(disc) && disc >= 0, 'Giảm giá không hợp lệ');
  for (const [i, item] of items.entries()) {
    const qty = Number(item.quantity);
    const price = Number(item.unit_price);
    assert(Number.isInteger(qty) && qty >= 1, `Sản phẩm #${i + 1}: số lượng phải lớn hơn 0`);
    assert(!isNaN(price) && price > 0, `Sản phẩm #${i + 1}: đơn giá phải lớn hơn 0`);
    assert(item.lot_id && Number(item.lot_id) > 0, `Sản phẩm #${i + 1}: lô hàng không hợp lệ`);
  }
}

// ── Import Receipt ──────────────────────────────────────────────────────────

function validateCreateImportReceipt(body) {
  const { employee_id, supplier_id, items } = body;
  assert(employee_id && Number(employee_id) > 0, 'Không xác định được nhân viên');
  assert(supplier_id && Number(supplier_id) > 0, 'Vui lòng chọn nhà cung cấp');
  assert(Array.isArray(items) && items.length > 0, 'Phiếu nhập phải có ít nhất 1 sản phẩm');
  for (const [i, item] of items.entries()) {
    const qty = Number(item.quantity);
    const price = Number(item.unit_price);
    assert(Number.isInteger(qty) && qty >= 1, `Sản phẩm #${i + 1}: số lượng phải lớn hơn 0`);
    assert(!isNaN(price) && price > 0, `Sản phẩm #${i + 1}: đơn giá nhập phải lớn hơn 0`);
    assert(item.lot_id && Number(item.lot_id) > 0, `Sản phẩm #${i + 1}: lô hàng không hợp lệ`);
  }
}

// ── Employee / Customer management ─────────────────────────────────────────

function validateEmployee(body) {
  const { full_name, username, email, phone } = body;
  assert(full_name && String(full_name).trim().length >= 2, 'Họ tên phải có ít nhất 2 ký tự');
  assert(username && USERNAME_RE.test(String(username).trim()),
    'Tên đăng nhập 3-50 ký tự, chỉ gồm chữ cái, số, dấu chấm và gạch dưới');
  if (email && String(email).trim()) {
    assert(EMAIL_RE.test(String(email).trim()), 'Email không hợp lệ');
  }
  if (phone && String(phone).trim()) {
    assert(PHONE_RE.test(String(phone).trim()), 'Số điện thoại không hợp lệ');
  }
}

module.exports = {
  validateLogin,
  validateRegister,
  validateChangePassword,
  validateAddToCart,
  validateUpdateCart,
  validateCheckout,
  validateCreateSalesInvoice,
  validateCreateImportReceipt,
  validateEmployee,
};
