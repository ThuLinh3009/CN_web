const Role = {
  tableName: 'ChucVu',
  modelName: 'Role',
  primaryKey: 'MaChucVu',
  columns: [
{ name: 'MaChucVu' },
{ name: 'TenChucVu' },
{ name: 'MoTa' }
  ],
  fillable: [
'TenChucVu',
'MoTa'
  ],
  searchable: [
'TenChucVu',
'MoTa'
  ]
};
module.exports = Role;
