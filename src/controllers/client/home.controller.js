const bookService = require('../../services/book.service');
const categoryService = require('../../services/category.service');

module.exports = {
  async index(req, res, next) {
    try {
      const [featuredBooks, newestBooks, categories] = await Promise.all([
        bookService.getFeaturedBooks(8),
        bookService.getNewestBooks(8),
        categoryService.getAllCategories(),
      ]);
      return res.render('client/home', {
        title: 'TBook Store - Trang chủ',
        featuredBooks,
        newestBooks,
        categories,
      });
    } catch (error) { return next(error); }
  },
};
