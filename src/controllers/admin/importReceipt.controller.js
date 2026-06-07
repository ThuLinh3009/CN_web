const importReceiptService = require('../../services/importReceipt.service');
const supplierService = require('../../services/supplier.service');
const bookService = require('../../services/book.service');
const importLotService = require('../../services/importLot.service');

// Parse lot_id[], quantity[], unit_price[] từ form thành array items
function parseItems(body) {
  const lotIds = [].concat(body['lot_id'] || []);
  const quantities = [].concat(body['quantity'] || []);
  const unitPrices = [].concat(body['unit_price'] || []);
  return lotIds.map((lotId, i) => ({
    lot_id: lotId,
    quantity: quantities[i],
    unit_price: unitPrices[i],
  }));
}

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
      const { supplier_id, note } = req.body;
      const employee_id = req.session.user?.id;
      const itemArr = parseItems(req.body);
      await importReceiptService.createImportReceipt({ employee_id, supplier_id, note, items: itemArr });
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

  async showEdit(req, res, next) {
    try {
      const receipt = await importReceiptService.getImportReceiptById(req.params.id);
      if (!receipt) return res.redirect('/admin/import-receipts');
      if (receipt.status === 'confirmed') {
        req.flash('error', 'Không thể sửa phiếu nhập đã xác nhận');
        return res.redirect('/admin/import-receipts/' + req.params.id);
      }
      const [suppliers, lots] = await Promise.all([
        supplierService.getAllSuppliers(),
        importLotService.getAllLots(),
      ]);
      return res.render('admin/importReceipts/edit', { title: 'Sửa phiếu nhập', receipt, suppliers, lots });
    } catch (error) { return next(error); }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { supplier_id, note } = req.body;
      const itemArr = parseItems(req.body);
      await importReceiptService.updateImportReceipt(id, { supplier_id, note, items: itemArr });
      req.flash('success', 'Cập nhật phiếu nhập thành công');
      return res.redirect('/admin/import-receipts/' + id);
    } catch (error) {
      req.flash('error', error.message);
      return res.redirect('/admin/import-receipts/' + req.params.id);
    }
  },

  async print(req, res, next) {
    try {
      const receipt = await importReceiptService.getImportReceiptById(req.params.id);
      if (!receipt) return res.redirect('/admin/import-receipts');
      return res.render('admin/importReceipts/print', { title: 'In phiếu nhập', receipt });
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
