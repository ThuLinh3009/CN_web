const importReceiptService = require('../../services/importReceipt.service');
const supplierService = require('../../services/supplier.service');
const importLotService = require('../../services/importLot.service');

module.exports = {
  async list(req, res, next) {
    try {
      const receipts = await importReceiptService.getAllImportReceipts();
      return res.render('staff/importReceipts/list', { title: 'Phiếu nhập hàng', receipts });
    } catch (error) { return next(error); }
  },

  async detail(req, res, next) {
    try {
      const receipt = await importReceiptService.getImportReceiptById(req.params.id);
      if (!receipt) return res.redirect('/staff/import-receipts');
      return res.render('staff/importReceipts/detail', { title: 'Chi tiết phiếu nhập', receipt });
    } catch (error) { return next(error); }
  },

  async showCreate(req, res, next) {
    try {
      const [suppliers, lots] = await Promise.all([
        supplierService.getAllSuppliers(),
        importLotService.getAllLots(),
      ]);
      return res.render('staff/importReceipts/create', { title: 'Tạo phiếu nhập', suppliers, lots });
    } catch (error) { return next(error); }
  },

  async create(req, res, next) {
    try {
      const { supplier_id, items } = req.body;
      const employee_id = req.session.user?.id;
      let itemArr = Array.isArray(items) ? items : (items ? [items] : []);
      await importReceiptService.createImportReceipt({ employee_id, supplier_id, items: itemArr });
      req.flash('success', 'Tạo phiếu nhập thành công — vui lòng xác nhận để cộng kho');
      return res.redirect('/staff/import-receipts');
    } catch (error) { return next(error); }
  },

  async confirm(req, res, next) {
    try {
      await importReceiptService.confirmImportReceipt(req.params.id);
      req.flash('success', 'Phiếu nhập #' + req.params.id + ' đã xác nhận — tồn kho đã được cập nhật');
      return res.redirect('/staff/import-receipts');
    } catch (error) {
      req.flash('error', error.message);
      return res.redirect('/staff/import-receipts');
    }
  },
};
