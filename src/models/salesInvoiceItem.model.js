const SalesInvoiceItem = {
  tableName: 'ChiTietHDB',
  modelName: 'SalesInvoiceItem',
  primaryKey: 'MaCTHDB',
  columns: [
{ name: 'MaCTHDB' },
{ name: 'MaHDB' },
{ name: 'MaLo' },
{ name: 'SoLuong' },
{ name: 'DonGiaBan' }
  ],
  fillable: [
'MaHDB',
'MaLo',
'SoLuong',
'DonGiaBan'
  ],
  searchable: [
'MaHDB',
'MaLo',
'SoLuong'
  ]
};
module.exports = SalesInvoiceItem;
