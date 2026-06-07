const BookAttribute = {
  tableName: 'DacTrungSach',
  modelName: 'BookAttribute',
  primaryKey: 'MaDT',
  columns: [
{ name: 'MaDT' },
{ name: 'TenDacTrung' },
{ name: 'SoftDelete' }
  ],
  fillable: [
'TenDacTrung',
'SoftDelete'
  ],
  searchable: [
'TenDacTrung',
'SoftDelete'
  ]
};
module.exports = BookAttribute;
