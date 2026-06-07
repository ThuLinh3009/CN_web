-- ============================================================
-- Migration v2 — Áp dụng lên DB đang chạy (không DROP database)
-- Chạy: mysql -u root -p bookstore_web < database/migrate_v2.sql
-- ============================================================

-- 1. Thêm payment_status vào sales_invoices
ALTER TABLE sales_invoices
  ADD COLUMN IF NOT EXISTS payment_status ENUM('unpaid','paid') DEFAULT 'unpaid'
  AFTER discount;

-- 2. Thêm status vào import_receipts (pending chờ xác nhận, confirmed đã cộng kho)
ALTER TABLE import_receipts
  ADD COLUMN IF NOT EXISTS status ENUM('pending','confirmed') DEFAULT 'pending'
  AFTER supplier_id;

-- 3. Đánh dấu các phiếu nhập cũ (đã tạo trước migration) là 'confirmed'
--    vì tồn kho đã được cộng khi tạo theo logic cũ
UPDATE import_receipts SET status = 'confirmed' WHERE status = 'pending';

-- 4. Thêm CHECK constraints (MySQL 8.0+)
ALTER TABLE books
  MODIFY COLUMN quantity INT DEFAULT 0,
  ADD CONSTRAINT chk_books_qty CHECK (quantity >= 0);

ALTER TABLE import_lots
  MODIFY COLUMN quantity INT DEFAULT 0,
  ADD CONSTRAINT chk_lots_qty CHECK (quantity >= 0);

ALTER TABLE import_receipt_items
  DROP CONSTRAINT IF EXISTS import_receipt_items_chk_1,
  MODIFY COLUMN unit_price DECIMAL(15,2) NOT NULL,
  ADD CONSTRAINT chk_iri_price CHECK (unit_price > 0),
  ADD CONSTRAINT uq_receipt_lot UNIQUE (receipt_id, lot_id);

ALTER TABLE sales_invoice_items
  MODIFY COLUMN unit_price DECIMAL(15,2) NOT NULL,
  ADD CONSTRAINT chk_sii_price CHECK (unit_price > 0);

ALTER TABLE order_items
  MODIFY COLUMN unit_price DECIMAL(15,2) NOT NULL,
  ADD CONSTRAINT chk_oi_price CHECK (unit_price > 0);

ALTER TABLE sales_invoices
  ADD CONSTRAINT chk_si_discount CHECK (discount >= 0);

ALTER TABLE orders
  ADD CONSTRAINT chk_orders_total CHECK (total_amount >= 0),
  ADD CONSTRAINT chk_orders_discount CHECK (discount >= 0);

-- 5. Sửa cascade cart_items → import_lots (cần drop + recreate FK)
ALTER TABLE cart_items DROP FOREIGN KEY cart_items_ibfk_2;
ALTER TABLE cart_items
  ADD CONSTRAINT cart_items_ibfk_2
  FOREIGN KEY (lot_id) REFERENCES import_lots(id) ON DELETE RESTRICT;

-- 6. Mở rộng payment_status của orders
ALTER TABLE orders
  MODIFY COLUMN payment_status ENUM('unpaid','paid','refunded','failed') DEFAULT 'unpaid';

-- 7. Thêm created_at cho suppliers và categories (nếu chưa có)
ALTER TABLE suppliers
  ADD COLUMN IF NOT EXISTS created_at DATETIME DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS created_at DATETIME DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE import_lots
  ADD COLUMN IF NOT EXISTS created_at DATETIME DEFAULT CURRENT_TIMESTAMP;
