# Bookstore Management Express - MySQL

Project scaffold ExpressJS MVC cho bài toán quản lý sách, đã chỉnh theo CSDL MySQL `s_test_7`.

## 1. Cài dependencies

```bash
npm install
```

## 2. Tạo file môi trường

```bash
cp .env.example .env
```

Trên Windows PowerShell có thể tạo thủ công file `.env` với nội dung giống `.env.example`.

## 3. Tạo database

Import file `database_web_1.sql` hoặc `database_s_test_7.sql` vào MySQL 8+.

```bash
mysql -u root -p < database_web_1.sql
```

## 4. Chạy project

```bash
npm start
```

## 5. Ghi chú

- Driver DB dùng `mysql2/promise`
- Schema chính bám theo các bảng: `ChucVu`, `NhanVien`, `KhachHang`, `NhaCungCap`, `TheLoaiSach`, `Sach`, `DacTrungSach`, `ChiTietSach`, `LoNhapSach`, `HoaDonNhap`, `ChiTietHDN`, `GiaBan`, `HoaDonBan`, `ChiTietHDB`
- Đây vẫn là scaffold, nhưng đã đổi cấu hình kết nối và bổ sung các service nền tảng khớp MySQL
