const SalesInvoice = {
  tableName: 'HoaDonBan',
  modelName: 'SalesInvoice',
  primaryKey: 'MaHDB',
  columns: [
{ name: 'MaHDB' },
{ name: 'MaNV' },
{ name: 'MaKH' },
{ name: 'GiamGia' },
{ name: 'NgayBan' }
  ],
  fillable: [
'MaNV',
'MaKH',
'GiamGia',
'NgayBan'
  ],
  searchable: [
'MaNV',
'MaKH',
'GiamGia'
  ]
};
module.exports = SalesInvoice;
