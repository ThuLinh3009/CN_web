const Book = {
  tableName: 'Sach',
  modelName: 'Book',
  primaryKey: 'MaSach',
  columns: [
{ name: 'MaSach' },
{ name: 'MaLoaiSach' },
{ name: 'TenSach' },
{ name: 'TacGia' },
{ name: 'SoLuong' },
{ name: 'HinhAnh' },
{ name: 'MoTa' },
{ name: 'TrangThai' },
{ name: 'SoftDelete' }
  ],
  fillable: [
'MaLoaiSach',
'TenSach',
'TacGia',
'SoLuong',
'HinhAnh',
'MoTa',
'TrangThai',
'SoftDelete'
  ],
  searchable: [
'MaLoaiSach',
'TenSach',
'TacGia'
  ]
};
module.exports = Book;
