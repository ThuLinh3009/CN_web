const Supplier = {
  tableName: 'NhaCungCap',
  modelName: 'Supplier',
  primaryKey: 'MaNCC',
  columns: [
{ name: 'MaNCC' },
{ name: 'TenNCC' },
{ name: 'SDT' },
{ name: 'DiaChi' },
{ name: 'Email' },
{ name: 'SoftDelete' }
  ],
  fillable: [
'TenNCC',
'SDT',
'DiaChi',
'Email',
'SoftDelete'
  ],
  searchable: [
'TenNCC',
'SDT',
'DiaChi'
  ]
};
module.exports = Supplier;
