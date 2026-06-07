const salesInvoiceService = require('../../services/salesInvoice.service');
const { query } = require('../../config/db');
const customerService = require('../../services/customer.service');
const importLotService = require('../../services/importLot.service');

module.exports = {
  async list(req, res, next) {
    try {
      const invoices = await salesInvoiceService.getAllSalesInvoices();
      return res.render('admin/salesInvoices/list', { title: 'Hóa đơn bán hàng', invoices });
    } catch (error) { return next(error); }
  },

  async showCreate(req, res, next) {
    try {
      const [customers, lots] = await Promise.all([
        customerService.getAllCustomers(),
        importLotService.getAllLots(),
      ]);
      return res.render('admin/salesInvoices/create', { title: 'Tạo hóa đơn bán', customers, lots });
    } catch (error) { return next(error); }
  },

  async create(req, res, next) {
    try {
      const { customer_id, discount, items } = req.body;
      const employee_id = req.session.user?.id;
      let itemArr = Array.isArray(items) ? items : (items ? [items] : []);
      const result = await salesInvoiceService.createSalesInvoice({
        employee_id, customer_id: customer_id || null, discount, items: itemArr
      });
      req.flash('success', 'Tạo hóa đơn thành công');
      return res.redirect('/admin/sales-invoices');
    } catch (error) { return next(error); }
  },

  async detail(req, res, next) {
    try {
      const invoice = await salesInvoiceService.getSalesInvoiceById(req.params.id);
      if (!invoice) return res.redirect('/admin/sales-invoices');
      return res.render('admin/salesInvoices/detail', { title: 'Chi tiết hóa đơn', invoice });
    } catch (error) { return next(error); }
  },

  async update(req, res, next) {
    try {
      // Hóa đơn bán đã lưu không cho phép chỉnh sửa — toàn vẹn dữ liệu
      req.flash('error', 'Hóa đơn đã tạo không thể chỉnh sửa');
      return res.redirect('/admin/sales-invoices');
    } catch (error) { return next(error); }
  },

  async markPaid(req, res, next) {
    try {
      const { id } = req.params;
      const result = await salesInvoiceService.markPaid(id);
      if (!result.ok) {
        req.flash('error', result.message);
      } else {
        req.flash('success', 'Đã đánh dấu thanh toán cho hóa đơn #' + id);
      }
      return res.redirect('/admin/sales-invoices');
    } catch (error) {
      req.flash('error', error.message);
      return res.redirect('/admin/sales-invoices');
    }
  },

  async print(req, res, next) {
    try {
      const invoice = await salesInvoiceService.printInvoice(req.params.id);
      return res.render('admin/salesInvoices/print', { title: 'In hóa đơn', invoice });
    } catch (error) { return next(error); }
  },
};
