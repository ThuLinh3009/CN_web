const Customer = {
  tableName: 'KhachHang',
  modelName: 'Customer',
  primaryKey: 'MaKH',
  columns: [
{ name: 'MaKH' },
{ name: 'TenKH' },
{ name: 'SDT' },
{ name: 'DiaChi' },
{ name: 'GioiTinh' }
  ],
  fillable: [
'TenKH',
'SDT',
'DiaChi',
'GioiTinh'
  ],
  searchable: [
'TenKH',
'SDT',
'DiaChi'
  ]
};
module.exports = Customer;
