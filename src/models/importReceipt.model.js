const ImportReceipt = {
  tableName: 'HoaDonNhap',
  modelName: 'ImportReceipt',
  primaryKey: 'MaHDN',
  columns: [
{ name: 'MaHDN' },
{ name: 'MaNV' },
{ name: 'MaNCC' },
{ name: 'NgayNhap' }
  ],
  fillable: [
'MaNV',
'MaNCC',
'NgayNhap'
  ],
  searchable: [
'MaNV',
'MaNCC',
'NgayNhap'
  ]
};
module.exports = ImportReceipt;
