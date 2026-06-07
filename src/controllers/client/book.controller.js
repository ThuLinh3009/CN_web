const bookService = require('../../services/book.service');
const categoryService = require('../../services/category.service');

module.exports = {
  async list(req, res, next) {
    try {
      const { keyword, category_id } = req.query;
      let books;
      if (keyword) {
        books = await bookService.searchBooks(keyword);
      } else if (category_id) {
        books = await bookService.filterByCategory(category_id);
      } else {
        books = await bookService.getAllBooks();
      }
      const categories = await categoryService.getAllCategories();
      return res.render('client/books/list', { title: 'Danh sách sách', books, categories, keyword, category_id });
    } catch (error) { return next(error); }
  },

  async detail(req, res, next) {
    try {
      const book = await bookService.getBookById(req.params.id);
      if (!book) return res.redirect('/books');
      const related = await bookService.filterByCategory(book.category_id);
      return res.render('client/books/detail', { title: book.title, book, related: related.slice(0, 4) });
    } catch (error) { return next(error); }
  },

  async search(req, res, next) {
    try {
      const keyword = req.query.keyword || '';
      const books = await bookService.searchBooks(keyword);
      const categories = await categoryService.getAllCategories();
      return res.render('client/books/list', { title: `Tìm kiếm: ${keyword}`, books, categories, keyword, category_id: null });
    } catch (error) { return next(error); }
  },
};
