const salesInvoiceService = require('../../services/salesInvoice.service');
const customerService = require('../../services/customer.service');
const importLotService = require('../../services/importLot.service');

module.exports = {
  async list(req, res, next) {
    try {
      const invoices = await salesInvoiceService.getAllSalesInvoices();
      return res.render('staff/salesInvoices/list', { title: 'Hóa đơn bán hàng', invoices });
    } catch (error) { return next(error); }
  },

  async detail(req, res, next) {
    try {
      const invoice = await salesInvoiceService.getSalesInvoiceById(req.params.id);
      if (!invoice) return res.redirect('/staff/sales-invoices');
      return res.render('staff/salesInvoices/detail', { title: 'Chi tiết hóa đơn', invoice });
    } catch (error) { return next(error); }
  },

  async showCreate(req, res, next) {
    try {
      const [customers, lots] = await Promise.all([
        customerService.getAllCustomers(),
        importLotService.getAllLots(),
      ]);
      return res.render('staff/salesInvoices/create', { title: 'Tạo hóa đơn', customers, lots });
    } catch (error) { return next(error); }
  },

  async create(req, res, next) {
    try {
      const { customer_id, discount, items } = req.body;
      const employee_id = req.session.user?.id;
      let itemArr = Array.isArray(items) ? items : (items ? [items] : []);
      await salesInvoiceService.createSalesInvoice({ employee_id, customer_id: customer_id || null, discount, items: itemArr });
      req.flash('success', 'Tạo hóa đơn thành công');
      return res.redirect('/staff/sales-invoices');
    } catch (error) { return next(error); }
  },

  async print(req, res, next) {
    try {
      const invoice = await salesInvoiceService.printInvoice(req.params.id);
      return res.render('staff/salesInvoices/print', { title: 'In hóa đơn', invoice });
    } catch (error) { return next(error); }
  },
};
