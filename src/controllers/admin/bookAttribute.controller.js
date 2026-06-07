const bookAttributeService = require('../../services/bookAttribute.service');

module.exports = {
  async list(req, res, next) {
    try {
      const attributes = await bookAttributeService.getAllAttributes();
      return res.render('admin/bookAttributes/list', { title: 'Thuộc tính sách', attributes });
    } catch (error) { return next(error); }
  },

  async showCreate(req, res, next) {
    try {
      return res.render('admin/bookAttributes/create', { title: 'Thêm thuộc tính' });
    } catch (error) { return next(error); }
  },

  async create(req, res, next) {
    try {
      await bookAttributeService.createAttribute(req.body);
      req.flash('success', 'Thêm thuộc tính thành công');
      return res.redirect('/admin/book-attributes');
    } catch (error) { return next(error); }
  },

  async showEdit(req, res, next) {
    try {
      const attr = await bookAttributeService.getAttributeById(req.params.id);
      if (!attr) return res.redirect('/admin/book-attributes');
      return res.render('admin/bookAttributes/edit', { title: 'Sửa thuộc tính', attr });
    } catch (error) { return next(error); }
  },

  async update(req, res, next) {
    try {
      await bookAttributeService.updateAttribute(req.params.id, req.body);
      req.flash('success', 'Cập nhật thuộc tính thành công');
      return res.redirect('/admin/book-attributes');
    } catch (error) { return next(error); }
  },

  async delete(req, res, next) {
    try {
      await bookAttributeService.deleteAttribute(req.params.id);
      req.flash('success', 'Đã xóa thuộc tính');
      return res.redirect('/admin/book-attributes');
    } catch (error) { return next(error); }
  },
};
