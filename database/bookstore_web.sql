-- ============================================================
-- Database: bookstore_web
-- ============================================================

DROP DATABASE IF EXISTS bookstore_web;
CREATE DATABASE bookstore_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bookstore_web;

-- ------------------------------------------------------------
-- roles
-- ------------------------------------------------------------
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255)
);

-- ------------------------------------------------------------
-- employees
-- ------------------------------------------------------------
CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_id INT NOT NULL DEFAULT 2,
  full_name VARCHAR(150) NOT NULL,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(150),
  phone VARCHAR(20),
  address VARCHAR(255),
  gender TINYINT DEFAULT 1 COMMENT '1=Nam, 0=Nu',
  birth_date DATE,
  is_active TINYINT DEFAULT 1,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- ------------------------------------------------------------
-- customers
-- ------------------------------------------------------------
CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(150),
  phone VARCHAR(20),
  address VARCHAR(255),
  gender TINYINT DEFAULT 1,
  is_active TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- categories
-- ------------------------------------------------------------
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description VARCHAR(255),
  is_active TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- suppliers
-- ------------------------------------------------------------
CREATE TABLE suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(20),
  address VARCHAR(255),
  email VARCHAR(150),
  is_active TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- books
-- ------------------------------------------------------------
CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(150),
  quantity INT DEFAULT 0 CHECK (quantity >= 0),
  thumbnail VARCHAR(255),
  description TEXT,
  is_active TINYINT DEFAULT 1,
  is_deleted TINYINT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- ------------------------------------------------------------
-- book_attributes
-- ------------------------------------------------------------
CREATE TABLE book_attributes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  is_deleted TINYINT DEFAULT 0
);

-- ------------------------------------------------------------
-- book_details
-- ------------------------------------------------------------
CREATE TABLE book_details (
  book_id INT NOT NULL,
  attribute_id INT NOT NULL,
  value VARCHAR(255),
  note VARCHAR(255),
  PRIMARY KEY (book_id, attribute_id),
  FOREIGN KEY (book_id) REFERENCES books(id),
  FOREIGN KEY (attribute_id) REFERENCES book_attributes(id)
);

-- ------------------------------------------------------------
-- import_lots
-- ------------------------------------------------------------
CREATE TABLE import_lots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  quantity INT DEFAULT 0 CHECK (quantity >= 0),
  location VARCHAR(100),
  note VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(id)
);

-- ------------------------------------------------------------
-- import_receipts
-- ------------------------------------------------------------
CREATE TABLE import_receipts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  supplier_id INT NOT NULL,
  status ENUM('pending','confirmed') DEFAULT 'pending',
  import_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE RESTRICT,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE RESTRICT
);

-- ------------------------------------------------------------
-- import_receipt_items
-- ------------------------------------------------------------
CREATE TABLE import_receipt_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  receipt_id INT NOT NULL,
  lot_id INT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(15,2) NOT NULL CHECK (unit_price > 0),
  UNIQUE KEY uq_receipt_lot (receipt_id, lot_id),
  FOREIGN KEY (receipt_id) REFERENCES import_receipts(id) ON DELETE CASCADE,
  FOREIGN KEY (lot_id) REFERENCES import_lots(id) ON DELETE RESTRICT
);

-- ------------------------------------------------------------
-- sale_prices
-- ------------------------------------------------------------
CREATE TABLE sale_prices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lot_id INT NOT NULL,
  old_price DECIMAL(15,2) DEFAULT 0,
  new_price DECIMAL(15,2) DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lot_id) REFERENCES import_lots(id)
);

-- ------------------------------------------------------------
-- sales_invoices
-- ------------------------------------------------------------
CREATE TABLE sales_invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  customer_id INT DEFAULT NULL,
  discount DECIMAL(15,2) DEFAULT 0 CHECK (discount >= 0),
  payment_status ENUM('unpaid','paid') DEFAULT 'unpaid',
  sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE RESTRICT,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

-- ------------------------------------------------------------
-- sales_invoice_items
-- ------------------------------------------------------------
CREATE TABLE sales_invoice_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_id INT NOT NULL,
  lot_id INT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(15,2) NOT NULL CHECK (unit_price > 0),
  FOREIGN KEY (invoice_id) REFERENCES sales_invoices(id) ON DELETE CASCADE,
  FOREIGN KEY (lot_id) REFERENCES import_lots(id) ON DELETE RESTRICT
);

-- ------------------------------------------------------------
-- carts
-- ------------------------------------------------------------
CREATE TABLE carts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- ------------------------------------------------------------
-- cart_items
-- ------------------------------------------------------------
CREATE TABLE cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cart_id INT NOT NULL,
  lot_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  UNIQUE KEY uq_cart_lot (cart_id, lot_id),
  FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  FOREIGN KEY (lot_id) REFERENCES import_lots(id) ON DELETE RESTRICT
);

-- ------------------------------------------------------------
-- orders
-- ------------------------------------------------------------
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  code VARCHAR(50) UNIQUE,
  recipient_name VARCHAR(150),
  recipient_phone VARCHAR(20),
  shipping_address VARCHAR(255),
  note TEXT,
  total_amount DECIMAL(15,2) DEFAULT 0 CHECK (total_amount >= 0),
  discount DECIMAL(15,2) DEFAULT 0 CHECK (discount >= 0),
  payment_method ENUM('COD','BANK') DEFAULT 'COD',
  payment_status ENUM('unpaid','paid','refunded','failed') DEFAULT 'unpaid',
  status ENUM('pending','confirmed','shipping','delivered','cancelled') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- ------------------------------------------------------------
-- order_items
-- ------------------------------------------------------------
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  lot_id INT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(15,2) NOT NULL CHECK (unit_price > 0),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (lot_id) REFERENCES import_lots(id) ON DELETE RESTRICT
);

-- ------------------------------------------------------------
-- contacts
-- ------------------------------------------------------------
CREATE TABLE contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150),
  email VARCHAR(150),
  phone VARCHAR(20),
  message TEXT,
  is_read TINYINT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- news
-- ------------------------------------------------------------
CREATE TABLE news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  summary VARCHAR(500),
  content TEXT,
  image VARCHAR(255),
  author VARCHAR(150),
  is_published TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- DATA
-- ============================================================

-- roles
INSERT INTO roles (name, description) VALUES
  ('admin', 'Quản trị viên hệ thống'),
  ('staff', 'Nhân viên cửa hàng'),
  ('customer', 'Khách hàng');

-- employees (password: 123456 -> bcrypt)
INSERT INTO employees (role_id, full_name, username, password, email, phone, address, gender, birth_date, is_active) VALUES
  (1, 'Quản Trị Viên', 'admin', '$2a$10$8HAIHnXGiKK6ZeDiFLGCOOzmUo7boOIIvLTKoNG2nzKZLlcc.f2fa', 'admin@tbook.vn', '0399975455', 'Dân Tiến, Khoái Châu, Hưng Yên', 1, '1990-01-01', 1),
  (2, 'Đoàn Thị Thu Linh', 'linhnv', '$2a$10$8HAIHnXGiKK6ZeDiFLGCOOzmUo7boOIIvLTKoNG2nzKZLlcc.f2fa', 'linh@tbook.vn', '0987654321', 'Hưng Yên', 0, '1999-03-09', 1),
  (2, 'Nguyễn Văn Hùng', 'hungnv', '$2a$10$8HAIHnXGiKK6ZeDiFLGCOOzmUo7boOIIvLTKoNG2nzKZLlcc.f2fa', 'hung@tbook.vn', '0912345678', 'Hà Nội', 1, '1998-05-15', 1);

-- customers (password: 123456 -> bcrypt)
INSERT INTO customers (full_name, username, password, email, phone, address, gender, is_active) VALUES
  ('Trần Thị Mai', 'mai.tran', '$2a$10$8HAIHnXGiKK6ZeDiFLGCOOzmUo7boOIIvLTKoNG2nzKZLlcc.f2fa', 'mai@gmail.com', '0912222333', 'Hà Nội', 0, 1),
  ('Lê Văn An', 'le.an', '$2a$10$8HAIHnXGiKK6ZeDiFLGCOOzmUo7boOIIvLTKoNG2nzKZLlcc.f2fa', 'an@gmail.com', '0933444555', 'TP HCM', 1, 1),
  ('Nguyễn Thị Hoa', 'hoa.nguyen', '$2a$10$8HAIHnXGiKK6ZeDiFLGCOOzmUo7boOIIvLTKoNG2nzKZLlcc.f2fa', 'hoa@gmail.com', '0944555666', 'Đà Nẵng', 0, 1);

-- categories
INSERT INTO categories (name, description, is_active) VALUES
  ('Văn học trong nước', 'Tác phẩm văn học của các tác giả Việt Nam', 1),
  ('Văn học nước ngoài', 'Tác phẩm văn học dịch từ nước ngoài', 1),
  ('Kinh tế', 'Sách về kinh tế, tài chính, kinh doanh', 1),
  ('Phát triển bản thân', 'Sách kỹ năng sống và phát triển bản thân', 1),
  ('Thiếu nhi', 'Sách dành cho trẻ em và thiếu niên', 1),
  ('Tin học', 'Sách lập trình, công nghệ thông tin', 1),
  ('Giáo khoa - Giáo trình', 'Sách giáo khoa và giáo trình đại học', 1),
  ('Đời sống', 'Sách về lối sống, sức khỏe, tâm lý', 1),
  ('Sách Mới 2025', 'Sách mới xuất bản năm 2025', 1);

-- suppliers
INSERT INTO suppliers (name, phone, address, email, is_active) VALUES
  ('NXB Kim Đồng', '024-38253985', '55 Quang Trung, Hà Nội', 'nxbkimdong@kimdong.com.vn', 1),
  ('NXB Trẻ', '028-38231544', '161B Lý Chính Thắng, TP HCM', 'nxbtre@nxbtre.com.vn', 1),
  ('NXB Tổng Hợp TP.HCM', '028-38225340', '62 Nguyễn Thị Minh Khai, TP HCM', 'info@nxbhcm.com.vn', 1),
  ('Alpha Books', '024-37835381', '13 Trần Quốc Toản, Hà Nội', 'info@alphabooks.vn', 1),
  ('Fahasa', '028-38222558', '60-62 Lê Lợi, TP HCM', 'info@fahasa.com', 1);

-- books
INSERT INTO books (category_id, title, author, quantity, thumbnail, description, is_active, is_deleted) VALUES
  (1, 'Dế Mèn Phiêu Lưu Ký', 'Tô Hoài', 50, 'ma1.jpg', 'Câu chuyện phiêu lưu của chú Dế Mèn dũng cảm qua nhiều vùng đất xa lạ.', 1, 0),
  (1, 'Truyện Kiều', 'Nguyễn Du', 40, 'ma2.jpg', 'Tác phẩm thơ chữ Nôm nổi tiếng nhất của văn học Việt Nam cổ điển.', 1, 0),
  (1, 'Số Đỏ', 'Vũ Trọng Phụng', 35, 'vh-tn2.jfif', 'Tiểu thuyết châm biếm xã hội thượng lưu Hà Nội thời Pháp thuộc.', 1, 0),
  (1, 'Tắt Đèn', 'Ngô Tất Tố', 30, 'vh-tn3.jfif', 'Tác phẩm hiện thực phê phán về cuộc sống người nông dân.', 1, 0),
  (1, 'Lão Hạc', 'Nam Cao', 45, 'vh-tn4.jfif', 'Truyện ngắn xúc động về người nông dân nghèo khổ và tình yêu với con chó.', 1, 0),
  (1, 'Tuổi Thơ Dữ Dội', 'Phùng Quán', 25, 'vh-tn5.jfif', 'Tiểu thuyết về những thiếu niên anh hùng trong kháng chiến chống Pháp.', 1, 0),
  (1, 'Đất Rừng Phương Nam', 'Đoàn Giỏi', 30, 'vh-tn6.jfif', 'Câu chuyện phiêu lưu của cậu bé An trên vùng đất phương Nam.', 1, 0),
  (1, 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh', 'Nguyễn Nhật Ánh', 60, 'vh-tn7.jfif', 'Câu chuyện tuổi thơ đầy cảm xúc của hai anh em ở miền quê.', 1, 0),
  (2, 'Những Người Khốn Khổ', 'Victor Hugo', 40, 'vh-nn1.jfif', 'Tác phẩm vĩ đại của Victor Hugo về lòng nhân ái và bất công xã hội.', 1, 0),
  (2, 'Nhà Giả Kim', 'Paulo Coelho', 55, 'vh-nn2.jfif', 'Câu chuyện về hành trình tìm kiếm kho báu và ý nghĩa cuộc sống.', 1, 0),
  (2, '1984', 'George Orwell', 30, 'vh-nn3.jfif', 'Tiểu thuyết dystopia kinh điển về chế độ toàn trị tương lai.', 1, 0),
  (2, 'Harry Potter và Hòn Đá Phù Thủy', 'J.K. Rowling', 70, 'vh-nn4.jfif', 'Cuốn sách đầu tiên trong series Harry Potter huyền thoại.', 1, 0),
  (2, 'Bố Già', 'Mario Puzo', 25, 'vh-nn5.jfif', 'Tiểu thuyết nổi tiếng về gia tộc mafia Corleone ở Mỹ.', 1, 0),
  (2, 'Cuốn Theo Chiều Gió', 'Margaret Mitchell', 20, 'ma11.jpg', 'Tiểu thuyết lãng mạn sử thi về cuộc Nội chiến Mỹ.', 1, 0),
  (3, 'Cha Giàu Cha Nghèo', 'Robert Kiyosaki', 80, 'ma3.jpg', 'Sách về tư duy tài chính và đầu tư từ góc nhìn thực tiễn.', 1, 0),
  (3, 'Nhà Đầu Tư Thông Minh', 'Benjamin Graham', 30, 'kinh-te1.png', 'Kinh thánh về đầu tư giá trị của huyền thoại Benjamin Graham.', 1, 0),
  (3, 'Tư Duy Nhanh Và Chậm', 'Daniel Kahneman', 25, 'kinh-te2.jfif', 'Khám phá hai hệ thống tư duy ảnh hưởng đến quyết định của con người.', 1, 0),
  (3, 'Kinh Tế Học', 'Paul Samuelson', 15, 'kinh-te3.jpg', 'Giáo trình kinh tế học cơ bản của nhà kinh tế học đoạt Nobel.', 1, 0),
  (4, 'Đắc Nhân Tâm', 'Dale Carnegie', 100, 'ma4.jpg', 'Sách kỹ năng giao tiếp và xây dựng mối quan hệ nổi tiếng nhất mọi thời đại.', 1, 0),
  (4, '7 Thói Quen Hiệu Quả', 'Stephen Covey', 45, 'ptbt2.jfif', 'Bảy thói quen giúp bạn trở thành người thành công và hạnh phúc.', 1, 0),
  (4, 'Dám Bị Ghét', 'Ichiro Kishimi & Fumitake Koga', 55, 'ptbt3.png', 'Triết học Adler về cách sống tự do và hạnh phúc.', 1, 0),
  (4, 'Sức Mạnh Của Thói Quen', 'Charles Duhigg', 40, 'ptbt5.png', 'Khoa học về việc hình thành và thay đổi thói quen trong cuộc sống.', 1, 0),
  (5, 'Kính Vạn Hoa', 'Nguyễn Nhật Ánh', 60, 'thieu-nhi2.jfif', 'Bộ truyện dài về tình bạn tuổi học trò đầy sắc màu.', 1, 0),
  (5, 'Alice Ở Xứ Sở Thần Tiên', 'Lewis Carroll', 35, 'thieu-nhi3.jfif', 'Câu chuyện phiêu lưu kỳ diệu của cô bé Alice.', 1, 0),
  (5, 'Hoàng Tử Bé', 'Antoine de Saint-Exupéry', 50, 'thieu-nhi4.jfif', 'Tác phẩm bất hủ về tình bạn, tình yêu và ý nghĩa cuộc sống.', 1, 0),
  (6, 'Python Cơ Bản', 'Nguyễn Văn Hiệp', 40, 'ma5.jpg', 'Hướng dẫn lập trình Python từ cơ bản đến nâng cao.', 1, 0),
  (6, 'Code Dạo Ký Sự', 'Phạm Huy Hoàng', 30, 'tinhoc2.jfif', 'Những câu chuyện thú vị từ công việc lập trình hàng ngày.', 1, 0),
  (6, 'Clean Code', 'Robert C. Martin', 25, 'tinhoc3.jfif', 'Hướng dẫn viết code sạch và dễ bảo trì.', 1, 0),
  (6, 'Học SQL Qua Ví Dụ', 'Nguyễn Anh Tú', 35, 'tinhoc4.jfif', 'Hướng dẫn thực hành SQL từ cơ bản đến nâng cao.', 1, 0),
  (6, 'JavaScript: The Good Parts', 'Douglas Crockford', 20, 'tinhoc8.jfif', 'Tinh hoa của ngôn ngữ JavaScript.', 1, 0),
  (7, 'Ngữ Văn 12', 'Bộ GD&ĐT', 200, 'giaotrinh1.jfif', 'Sách giáo khoa Ngữ Văn lớp 12.', 1, 0),
  (7, 'Toán Đại Số & Hình Học 12', 'Bộ GD&ĐT', 200, 'giaotrinh2.jfif', 'Sách giáo khoa Toán lớp 12.', 1, 0),
  (7, 'Kinh Tế Vi Mô', 'N. Gregory Mankiw', 50, 'giaotrinh6.jfif', 'Giáo trình kinh tế vi mô cho sinh viên đại học.', 1, 0),
  (8, 'Bước Chậm Lại Giữa Thế Gian Vội Vã', 'Haemin Sunim', 65, 'doi-song1.jfif', 'Những triết lý sống nhẹ nhàng và sâu sắc từ thiền sư Hàn Quốc.', 1, 0),
  (8, 'Đời Ngắn Đừng Ngủ Dài', 'Robin Sharma', 45, 'doi-song2.jfif', 'Hướng dẫn sống trọn vẹn từng ngày và đạt được tiềm năng tối đa.', 1, 0),
  (8, 'Muôn Kiếp Nhân Sinh', 'Brian Weiss', 50, 'doi-song6.jfif', 'Hành trình khám phá tiền kiếp và ý nghĩa của linh hồn.', 1, 0),
  (8, 'Tâm Lý Học Đám Đông', 'Gustave Le Bon', 30, 'ma8.jpg', 'Phân tích tâm lý tập thể và hành vi của đám đông.', 1, 0),
  (9, 'ChatGPT & Trí Tuệ Nhân Tạo', 'Nguyễn Thanh Bình', 40, 'moi20251.jfif', 'Hướng dẫn sử dụng AI và ChatGPT trong công việc và học tập.', 1, 0),
  (9, 'Xây Dựng Thương Hiệu Cá Nhân 2025', 'Phạm Tiến Đạt', 35, 'moi20252.jfif', 'Chiến lược xây dựng thương hiệu cá nhân trong thời đại số.', 1, 0),
  (6, '5000 Từ Vựng English', 'Nguyễn Thị Loan', 60, 'ma6.jpg', 'Bộ sách từ vựng tiếng Anh cho người học mọi cấp độ.', 1, 0);

-- book_attributes
INSERT INTO book_attributes (name, is_deleted) VALUES
  ('Nhà xuất bản', 0),
  ('Năm xuất bản', 0),
  ('Số trang', 0),
  ('Kích thước', 0),
  ('ISBN', 0);

-- book_details (sample cho vài cuốn)
INSERT INTO book_details (book_id, attribute_id, value) VALUES
  (1, 1, 'NXB Kim Đồng'), (1, 2, '2020'), (1, 3, '250'),
  (2, 1, 'NXB Trẻ'), (2, 2, '2019'), (2, 3, '312'),
  (10, 1, 'NXB Tổng Hợp TP.HCM'), (10, 2, '2021'), (10, 3, '228'),
  (15, 1, 'Alpha Books'), (15, 2, '2018'), (15, 3, '336'),
  (19, 1, 'NXB Tổng Hợp TP.HCM'), (19, 2, '2017'), (19, 3, '320');

-- import_lots
INSERT INTO import_lots (book_id, quantity, location, note) VALUES
  (1, 50, 'A1', 'Lô nhập đầu tiên'), (2, 40, 'A2', NULL), (3, 35, 'A3', NULL),
  (4, 30, 'A4', NULL), (5, 45, 'A5', NULL), (6, 25, 'B1', NULL),
  (7, 30, 'B2', NULL), (8, 60, 'B3', NULL), (9, 40, 'B4', NULL),
  (10, 55, 'B5', NULL), (11, 30, 'C1', NULL), (12, 70, 'C2', NULL),
  (13, 25, 'C3', NULL), (14, 20, 'C4', NULL), (15, 80, 'D1', NULL),
  (16, 30, 'D2', NULL), (17, 25, 'D3', NULL), (18, 15, 'D4', NULL),
  (19, 100, 'E1', NULL), (20, 45, 'E2', NULL), (21, 55, 'E3', NULL),
  (22, 40, 'E4', NULL), (23, 60, 'F1', NULL), (24, 35, 'F2', NULL),
  (25, 50, 'F3', NULL), (26, 40, 'G1', NULL), (27, 30, 'G2', NULL),
  (28, 25, 'G3', NULL), (29, 35, 'G4', NULL), (30, 20, 'G5', NULL),
  (31, 200, 'H1', NULL), (32, 200, 'H2', NULL), (33, 50, 'H3', NULL),
  (34, 65, 'I1', NULL), (35, 45, 'I2', NULL), (36, 50, 'I3', NULL),
  (37, 30, 'I4', NULL), (38, 40, 'J1', NULL), (39, 35, 'J2', NULL),
  (40, 60, 'J3', NULL);

-- import_receipts
INSERT INTO import_receipts (employee_id, supplier_id, status, import_date) VALUES
  (2, 1, 'confirmed', '2025-01-10 09:00:00'),
  (2, 2, 'confirmed', '2025-02-15 10:00:00'),
  (3, 3, 'confirmed', '2025-03-20 11:00:00');

-- import_receipt_items
INSERT INTO import_receipt_items (receipt_id, lot_id, quantity, unit_price) VALUES
  (1, 1, 50, 60000), (1, 2, 40, 30000), (1, 3, 35, 40000),
  (2, 4, 30, 35000), (2, 5, 45, 25000), (2, 10, 55, 75000),
  (3, 15, 80, 60000), (3, 19, 100, 55000), (3, 25, 50, 35000);

-- sale_prices
INSERT INTO sale_prices (lot_id, old_price, new_price) VALUES
  (1, 124000, 124000), (2, 90000, 45000), (3, 50000, 50000),
  (4, 55000, 55000), (5, 35000, 35000), (6, 95000, 95000),
  (7, 70000, 70000), (8, 85000, 85000), (9, 110000, 110000),
  (10, 99000, 99000), (11, 105000, 105000), (12, 130000, 130000),
  (13, 100000, 100000), (14, 217000, 217000), (15, 89000, 89000),
  (16, 150000, 150000), (17, 135000, 135000), (18, 119000, 119000),
  (19, 80000, 80000), (20, 110000, 110000), (21, 99000, 99000),
  (22, 105000, 105000), (23, 95000, 95000), (24, 55000, 55000),
  (25, 50000, 50000), (26, 98000, 98000), (27, 85000, 85000),
  (28, 120000, 120000), (29, 72000, 72000), (30, 79000, 79000),
  (31, 25000, 25000), (32, 32000, 32000), (33, 95000, 95000),
  (34, 72000, 72000), (35, 68000, 68000), (36, 120000, 120000),
  (37, 128000, 89600), (38, 129000, 129000), (39, 112000, 112000),
  (40, 124000, 124000);

-- sales_invoices
INSERT INTO sales_invoices (employee_id, customer_id, discount, payment_status, sale_date) VALUES
  (2, 1, 0, 'paid', '2025-04-01 10:30:00'),
  (2, 2, 10000, 'paid', '2025-04-05 14:00:00'),
  (3, 1, 0, 'unpaid', '2025-05-01 09:00:00'),
  (2, NULL, 0, 'paid', '2025-05-10 11:00:00');

-- sales_invoice_items
INSERT INTO sales_invoice_items (invoice_id, lot_id, quantity, unit_price) VALUES
  (1, 10, 2, 99000), (1, 19, 1, 80000),
  (2, 15, 1, 89000), (2, 21, 1, 99000),
  (3, 1, 3, 124000), (3, 25, 2, 50000),
  (4, 12, 1, 130000);

-- carts (1 cart mẫu)
INSERT INTO carts (customer_id) VALUES (3);

-- cart_items
INSERT INTO cart_items (cart_id, lot_id, quantity) VALUES
  (1, 10, 1), (1, 19, 2);

-- orders
INSERT INTO orders (customer_id, code, recipient_name, recipient_phone, shipping_address, note, total_amount, discount, payment_method, payment_status, status, created_at) VALUES
  (1, 'ORD-20250401-001', 'Trần Thị Mai', '0912222333', 'Hà Nội', NULL, 278000, 0, 'COD', 'paid', 'delivered', '2025-04-01 10:30:00'),
  (2, 'ORD-20250405-001', 'Lê Văn An', '0933444555', 'TP HCM', 'Giao giờ hành chính', 177000, 10000, 'BANK', 'paid', 'delivered', '2025-04-05 14:00:00'),
  (1, 'ORD-20250501-001', 'Trần Thị Mai', '0912222333', 'Hà Nội', NULL, 472000, 0, 'COD', 'unpaid', 'pending', '2025-05-01 09:00:00');

-- order_items
INSERT INTO order_items (order_id, lot_id, quantity, unit_price) VALUES
  (1, 10, 2, 99000), (1, 19, 1, 80000),
  (2, 15, 1, 89000), (2, 21, 1, 99000),
  (3, 1, 3, 124000), (3, 25, 2, 50000);

-- contacts
INSERT INTO contacts (full_name, email, phone, message, is_read) VALUES
  ('Nguyễn Văn Bình', 'binh@gmail.com', '0901234567', 'Tôi muốn hỏi về chính sách đổi trả sách?', 0),
  ('Phạm Thị Lan', 'lan@gmail.com', '0912345678', 'Shop có giao hàng đến Cần Thơ không?', 1),
  ('Hoàng Minh Tuấn', 'tuan@gmail.com', '0923456789', 'Sách Harry Potter còn hàng không ạ?', 0);

-- news
INSERT INTO news (title, summary, content, image, author, is_published) VALUES
  ('Top 10 Sách Hay Nhất 2025', 'Những cuốn sách được độc giả yêu thích nhất năm 2025', '<p>Năm 2025 có nhiều cuốn sách xuất sắc ra đời...</p>', 'moi20251.jfif', 'Ban Biên Tập TBook', 1),
  ('Lợi Ích Của Việc Đọc Sách Mỗi Ngày', 'Đọc sách 30 phút mỗi ngày mang lại những lợi ích tuyệt vời', '<p>Nghiên cứu chứng minh rằng đọc sách thường xuyên...</p>', 'doi-song3.png', 'Linh Đoàn', 1),
  ('Ra Mắt Bộ Sưu Tập Sách Cổ Điển', 'TBook giới thiệu bộ sưu tập sách văn học cổ điển thế giới', '<p>Chúng tôi vui mừng giới thiệu...</p>', 'vh-nn1.jfif', 'Ban Biên Tập TBook', 1);
