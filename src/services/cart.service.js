const { query } = require("../config/db");

async function getOrCreateCart(customerId) {
  const rows = await query(
    "SELECT * FROM carts WHERE customer_id = ? LIMIT 1",
    [customerId],
  );
  if (rows[0]) return rows[0];
  const result = await query("INSERT INTO carts (customer_id) VALUES (?)", [
    customerId,
  ]);
  return { id: result.insertId, customer_id: customerId };
}

async function getCart(customerId) {
  const cart = await getOrCreateCart(customerId);

  const items = await query(
    `
    SELECT 
      ci.id,
      ci.cart_id,
      ci.lot_id,
      ci.quantity,
      il.book_id,
      b.title,
      b.thumbnail,
      IFNULL((
        SELECT sp.new_price
        FROM sale_prices sp
        WHERE sp.lot_id = ci.lot_id
        ORDER BY sp.updated_at DESC, sp.id DESC
        LIMIT 1
      ), 0) AS unit_price
    FROM cart_items ci
    JOIN import_lots il ON il.id = ci.lot_id
    JOIN books b ON b.id = il.book_id
    WHERE ci.cart_id = ?
    ORDER BY ci.id DESC
  `,
    [cart.id],
  );

  const total = items.reduce(
    (s, i) => s + Number(i.unit_price) * Number(i.quantity),
    0,
  );

  return { cart, items, total };
}

async function addToCart(customerId, lotId, quantity = 1) {
  const cart = await getOrCreateCart(customerId);
  lotId = Number(lotId);
  quantity = Number(quantity);

  if (!Number.isInteger(lotId) || lotId <= 0) throw new Error("lot_id không hợp lệ");
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 999) throw new Error("Số lượng phải từ 1 đến 999");

  // Kiểm tra lô tồn tại và còn đủ hàng
  const lots = await query("SELECT quantity FROM import_lots WHERE id = ? LIMIT 1", [lotId]);
  if (!lots[0]) throw new Error("Sản phẩm không tồn tại");

  const existing = await query(
    "SELECT * FROM cart_items WHERE cart_id = ? AND lot_id = ? LIMIT 1",
    [cart.id, lotId],
  );
  const currentQty = existing[0] ? Number(existing[0].quantity) : 0;
  if (currentQty + quantity > lots[0].quantity) {
    throw new Error(`Chỉ còn ${lots[0].quantity} sản phẩm trong kho`);
  }

  if (existing[0]) {
    await query("UPDATE cart_items SET quantity = quantity + ? WHERE id = ?", [quantity, existing[0].id]);
  } else {
    await query("INSERT INTO cart_items (cart_id, lot_id, quantity) VALUES (?,?,?)", [cart.id, lotId, quantity]);
  }

  return { ok: true };
}
async function updateCartItem(customerId, lotId, quantity) {
  const cart = await getOrCreateCart(customerId);
  if (Number(quantity) <= 0) {
    await query("DELETE FROM cart_items WHERE cart_id = ? AND lot_id = ?", [
      cart.id,
      lotId,
    ]);
  } else {
    await query(
      "UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND lot_id = ?",
      [Number(quantity), cart.id, lotId],
    );
  }
  return { ok: true };
}

async function removeFromCart(customerId, lotId) {
  const cart = await getOrCreateCart(customerId);
  await query("DELETE FROM cart_items WHERE cart_id = ? AND lot_id = ?", [
    cart.id,
    lotId,
  ]);
  return { ok: true };
}

async function clearCart(customerId) {
  const cart = await getOrCreateCart(customerId);
  await query("DELETE FROM cart_items WHERE cart_id = ?", [cart.id]);
  return { ok: true };
}

async function countCartItems(customerId) {
  const cart = await getOrCreateCart(customerId);
  const rows = await query(
    "SELECT COUNT(*) AS total FROM cart_items WHERE cart_id = ?",
    [cart.id],
  );
  return rows[0]?.total || 0;
}

module.exports = {
  getOrCreateCart,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  countCartItems,
};
