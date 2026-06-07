const importLotService = require('../../services/importLot.service');
const bookService = require('../../services/book.service');

module.exports = {
  async list(req, res, next) {
    try {
      const lots = await importLotService.getAllLots();
      return res.render('admin/importLots/list', { title: 'Lô nhập sách', lots });
    } catch (error) { return next(error); }
  },

  async showCreate(req, res, next) {
    try {
      const books = await bookService.getAllBooks();
      return res.render('admin/importLots/create', { title: 'Thêm lô nhập', books });
    } catch (error) { return next(error); }
  },

  async create(req, res, next) {
    try {
      const result = await importLotService.createLot(req.body);
      if (req.body.sale_price) {
        await importLotService.setSalePrice(result.insertId, req.body.sale_price);
      }
      req.flash('success', 'Thêm lô nhập thành công');
      return res.redirect('/admin/import-lots');
    } catch (error) { return next(error); }
  },

  async showEdit(req, res, next) {
    try {
      const lot = await importLotService.getLotById(req.params.id);
      if (!lot) return res.redirect('/admin/import-lots');
      const books = await bookService.getAllBooks();
      return res.render('admin/importLots/edit', { title: 'Sửa lô nhập', lot, books });
    } catch (error) { return next(error); }
  },

  async update(req, res, next) {
    try {
      await importLotService.updateLot(req.params.id, req.body);
      if (req.body.sale_price) {
        await importLotService.setSalePrice(req.params.id, req.body.sale_price);
      }
      req.flash('success', 'Cập nhật lô nhập thành công');
      return res.redirect('/admin/import-lots');
    } catch (error) { return next(error); }
  },

  async adjustQuantity(req, res, next) {
    try {
      req.flash('success', 'Đã điều chỉnh số lượng');
      return res.redirect('/admin/import-lots');
    } catch (error) { return next(error); }
  },
};
