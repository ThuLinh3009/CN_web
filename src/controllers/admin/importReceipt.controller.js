const importReceiptService = require('../../services/importReceipt.service');
const supplierService = require('../../services/supplier.service');
const bookService = require('../../services/book.service');
const importLotService = require('../../services/importLot.service');

module.exports = {
  async list(req, res, next) {
    try {
      const receipts = await importReceiptService.getAllImportReceipts();
      return res.render('admin/importReceipts/list', { title: 'Phiếu nhập hàng', receipts });
    } catch (error) { return next(error); }
  },

  async showCreate(req, res, next) {
    try {
      const [suppliers, books, lots] = await Promise.all([
        supplierService.getAllSuppliers(),
        bookService.getAllBooks(),
        importLotService.getAllLots(),
      ]);
      return res.render('admin/importReceipts/create', { title: 'Tạo phiếu nhập', suppliers, books, lots });
    } catch (error) { return next(error); }
  },

  async create(req, res, next) {
    try {
      const { supplier_id, items } = req.body;
      const employee_id = req.session.user?.id;
      // items is array or single object from form
      let itemArr = Array.isArray(items) ? items : (items ? [items] : []);
      await importReceiptService.createImportReceipt({ employee_id, supplier_id, items: itemArr });
      req.flash('success', 'Tạo phiếu nhập thành công');
      return res.redirect('/admin/import-receipts');
    } catch (error) { return next(error); }
  },

  async detail(req, res, next) {
    try {
      const receipt = await importReceiptService.getImportReceiptById(req.params.id);
      if (!receipt) return res.redirect('/admin/import-receipts');
      return res.render('admin/importReceipts/detail', { title: 'Chi tiết phiếu nhập', receipt });
    } catch (error) { return next(error); }
  },

  async update(req, res, next) {
    try {
      // Phiếu nhập đã tạo không cho phép chỉnh sửa — toàn vẹn tồn kho
      req.flash('error', 'Phiếu nhập đã tạo không thể chỉnh sửa');
      return res.redirect('/admin/import-receipts');
    } catch (error) { return next(error); }
  },

  async confirm(req, res, next) {
    try {
      const { id } = req.params;
      await importReceiptService.confirmImportReceipt(id);
      req.flash('success', 'Phiếu nhập #' + id + ' đã xác nhận — tồn kho đã được cập nhật');
      return res.redirect('/admin/import-receipts');
    } catch (error) {
      req.flash('error', error.message);
      return res.redirect('/admin/import-receipts');
    }
  },
};
