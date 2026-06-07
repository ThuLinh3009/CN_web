const ImportReceiptItem = {
  tableName: 'ChiTietHDN',
  modelName: 'ImportReceiptItem',
  primaryKey: 'MaCTHDN',
  columns: [
{ name: 'MaCTHDN' },
{ name: 'MaHDN' },
{ name: 'MaLo' },
{ name: 'SoLuong' },
{ name: 'DonGia' }
  ],
  fillable: [
'MaHDN',
'MaLo',
'SoLuong',
'DonGia'
  ],
  searchable: [
'MaHDN',
'MaLo',
'SoLuong',
'DonGia'
  ]
};
module.exports = ImportReceiptItem;
