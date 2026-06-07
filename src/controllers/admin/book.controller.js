const bookService = require('../../services/book.service');
const categoryService = require('../../services/category.service');

module.exports = {
  async list(req, res, next) {
    try {
      const books = await bookService.getAllBooks();
      return res.render('admin/books/list', { title: 'Quản lý sách', books });
    } catch (error) { return next(error); }
  },

  async showCreate(req, res, next) {
    try {
      const categories = await categoryService.getAllCategories();
      return res.render('admin/books/create', { title: 'Thêm sách mới', categories });
    } catch (error) { return next(error); }
  },

  async create(req, res, next) {
    try {
      const thumbnail = req.file ? req.file.filename : (req.body.thumbnail || null);
      await bookService.createBook({ ...req.body, thumbnail });
      req.flash('success', 'Thêm sách thành công');
      return res.redirect('/admin/books');
    } catch (error) { return next(error); }
  },

  async showEdit(req, res, next) {
    try {
      const book = await bookService.getBookById(req.params.id);
      if (!book) return res.redirect('/admin/books');
      const categories = await categoryService.getAllCategories();
      return res.render('admin/books/edit', { title: 'Chỉnh sửa sách', book, categories });
    } catch (error) { return next(error); }
  },

  async update(req, res, next) {
    try {
      const thumbnail = req.file ? req.file.filename : (req.body.thumbnail || null);
      await bookService.updateBook(req.params.id, { ...req.body, thumbnail });
      req.flash('success', 'Cập nhật sách thành công');
      return res.redirect('/admin/books');
    } catch (error) { return next(error); }
  },

  async delete(req, res, next) {
    try {
      await bookService.softDeleteBook(req.params.id);
      req.flash('success', 'Đã ẩn sách');
      return res.redirect('/admin/books');
    } catch (error) { return next(error); }
  },

  async toggleStatus(req, res, next) {
    try {
      await bookService.toggleStatus(req.params.id);
      return res.redirect('/admin/books');
    } catch (error) { return next(error); }
  },
};
