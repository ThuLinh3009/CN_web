const SalePrice = {
  tableName: 'GiaBan',
  modelName: 'SalePrice',
  primaryKey: 'MaGia',
  columns: [
{ name: 'MaGia' },
{ name: 'MaLo' },
{ name: 'GiaCu' },
{ name: 'GiaMoi' },
{ name: 'NgayCapNhat' }
  ],
  fillable: [
'MaLo',
'GiaCu',
'GiaMoi',
'NgayCapNhat'
  ],
  searchable: [
'MaLo',
'GiaCu',
'GiaMoi'
  ]
};
module.exports = SalePrice;
