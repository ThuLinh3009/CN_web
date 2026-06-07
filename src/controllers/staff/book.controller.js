const bookService = require('../../services/book.service');
const categoryService = require('../../services/category.service');

module.exports = {
  async list(req, res, next) {
    try {
      const books = await bookService.getAllBooks();
      return res.render('staff/books/list', { title: 'Danh sách sách', books });
    } catch (error) { return next(error); }
  },

  async showEdit(req, res, next) {
    try {
      const book = await bookService.getBookById(req.params.id);
      if (!book) {
        req.flash('error', 'Không tìm thấy sách');
        return res.redirect('/staff/books');
      }
      const categories = await categoryService.getAllCategories();
      return res.render('staff/books/edit', { title: 'Sửa thông tin sách', book, categories });
    } catch (error) { return next(error); }
  },

  async update(req, res, next) {
    try {
      // Staff chỉ được sửa: title, author, category_id, description, thumbnail
      // Không được sửa: is_active, quantity
      const { title, author, category_id, description, thumbnail } = req.body;
      const book = await bookService.getBookById(req.params.id);
      if (!book) {
        req.flash('error', 'Không tìm thấy sách');
        return res.redirect('/staff/books');
      }
      await bookService.updateBook(req.params.id, {
        title,
        author,
        category_id,
        description,
        thumbnail: thumbnail || book.thumbnail,
        is_active: book.is_active, // giữ nguyên trạng thái hiện tại
      });
      req.flash('success', 'Cập nhật sách thành công');
      return res.redirect('/staff/books');
    } catch (error) { return next(error); }
  },
};
