const categoryService = require('../../services/category.service');

module.exports = {
  async list(req, res, next) {
    try {
      const categories = await categoryService.getAllCategories();
      return res.render('staff/categories/list', { title: 'Danh mục sách', categories });
    } catch (error) { return next(error); }
  },
};
