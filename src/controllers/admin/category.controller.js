const categoryService = require('../../services/category.service');

module.exports = {
  async list(req, res, next) {
    try {
      const categories = await categoryService.getAllCategories();
      return res.render('admin/categories/list', { title: 'Quản lý thể loại', categories });
    } catch (error) { return next(error); }
  },

  async showCreate(req, res, next) {
    try {
      return res.render('admin/categories/create', { title: 'Thêm thể loại' });
    } catch (error) { return next(error); }
  },

  async create(req, res, next) {
    try {
      await categoryService.createCategory(req.body);
      req.flash('success', 'Thêm thể loại thành công');
      return res.redirect('/admin/categories');
    } catch (error) { return next(error); }
  },

  async showEdit(req, res, next) {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      if (!category) return res.redirect('/admin/categories');
      return res.render('admin/categories/edit', { title: 'Chỉnh sửa thể loại', category });
    } catch (error) { return next(error); }
  },

  async update(req, res, next) {
    try {
      await categoryService.updateCategory(req.params.id, req.body);
      req.flash('success', 'Cập nhật thể loại thành công');
      return res.redirect('/admin/categories');
    } catch (error) { return next(error); }
  },

  async delete(req, res, next) {
    try {
      await categoryService.deleteCategory(req.params.id);
      req.flash('success', 'Đã ẩn thể loại');
      return res.redirect('/admin/categories');
    } catch (error) { return next(error); }
  },

  async toggleStatus(req, res, next) {
    try {
      const cat = await categoryService.getCategoryById(req.params.id);
      if (cat) await categoryService.updateCategory(req.params.id, { ...cat, is_active: cat.is_active ? 0 : 1 });
      return res.redirect('/admin/categories');
    } catch (error) { return next(error); }
  },
};
