const Category = {
  tableName: 'TheLoaiSach',
  modelName: 'Category',
  primaryKey: 'MaLoaiSach',
  columns: [
{ name: 'MaLoaiSach' },
{ name: 'TenTheLoai' },
{ name: 'MoTa' },
{ name: 'SoftDelete' }
  ],
  fillable: [
'TenTheLoai',
'MoTa',
'SoftDelete'
  ],
  searchable: [
'TenTheLoai',
'MoTa',
'SoftDelete'
  ]
};
module.exports = Category;
