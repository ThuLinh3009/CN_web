const ImportLot = {
  tableName: 'LoNhapSach',
  modelName: 'ImportLot',
  primaryKey: 'MaLo',
  columns: [
{ name: 'MaLo' },
{ name: 'MaSach' },
{ name: 'SoLuong' },
{ name: 'ViTri' },
{ name: 'GhiChu' }
  ],
  fillable: [
'MaSach',
'SoLuong',
'ViTri',
'GhiChu'
  ],
  searchable: [
'MaSach',
'SoLuong',
'ViTri'
  ]
};
module.exports = ImportLot;
