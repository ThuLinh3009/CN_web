const BookDetail = {
  tableName: 'ChiTietSach',
  modelName: 'BookDetail',
  primaryKey: 'MaSach',
  columns: [
{ name: 'MaSach' },
{ name: 'MaDT' },
{ name: 'GiaTriDacTrung' },
{ name: 'MoTa' }
  ],
  fillable: [
'MaDT',
'GiaTriDacTrung',
'MoTa'
  ],
  searchable: [
'MaDT',
'GiaTriDacTrung',
'MoTa'
  ]
};
module.exports = BookDetail;
