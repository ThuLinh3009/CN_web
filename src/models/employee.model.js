const Employee = {
  tableName: 'NhanVien',
  modelName: 'Employee',
  primaryKey: 'MaNV',
  columns: [
{ name: 'MaNV' },
{ name: 'MaChucVu' },
{ name: 'TenNV' },
{ name: 'NgaySinh' },
{ name: 'GioiTinh' },
{ name: 'SDT' },
{ name: 'DiaChi' },
{ name: 'Email' },
{ name: 'TenTK' },
{ name: 'MK' },
{ name: 'SoftDelete' }
  ],
  fillable: [
'MaChucVu',
'TenNV',
'NgaySinh',
'GioiTinh',
'SDT',
'DiaChi',
'Email',
'TenTK',
'MK',
'SoftDelete'
  ],
  searchable: [
'MaChucVu',
'TenNV',
'NgaySinh'
  ]
};
module.exports = Employee;
