const supplierService = require('../../services/supplier.service');

module.exports = {
  async list(req, res, next) {
    try {
      const suppliers = await supplierService.getAllSuppliers();
      return res.render('admin/suppliers/list', { title: 'Quản lý nhà cung cấp', suppliers });
    } catch (error) { return next(error); }
  },

  async showCreate(req, res, next) {
    try {
      return res.render('admin/suppliers/create', { title: 'Thêm nhà cung cấp' });
    } catch (error) { return next(error); }
  },

  async create(req, res, next) {
    try {
      await supplierService.createSupplier(req.body);
      req.flash('success', 'Thêm nhà cung cấp thành công');
      return res.redirect('/admin/suppliers');
    } catch (error) { return next(error); }
  },

  async showEdit(req, res, next) {
    try {
      const supplier = await supplierService.getSupplierById(req.params.id);
      if (!supplier) return res.redirect('/admin/suppliers');
      return res.render('admin/suppliers/edit', { title: 'Chỉnh sửa nhà cung cấp', supplier });
    } catch (error) { return next(error); }
  },

  async update(req, res, next) {
    try {
      await supplierService.updateSupplier(req.params.id, req.body);
      req.flash('success', 'Cập nhật nhà cung cấp thành công');
      return res.redirect('/admin/suppliers');
    } catch (error) { return next(error); }
  },

  async delete(req, res, next) {
    try {
      await supplierService.deleteSupplier(req.params.id);
      req.flash('success', 'Đã xóa nhà cung cấp');
      return res.redirect('/admin/suppliers');
    } catch (error) { return next(error); }
  },
};
