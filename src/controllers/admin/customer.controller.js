const customerService = require('../../services/customer.service');

module.exports = {
  async list(req, res, next) {
    try {
      const customers = await customerService.getAllCustomers();
      return res.render('admin/customers/list', { title: 'Quản lý khách hàng', customers });
    } catch (error) { return next(error); }
  },

  async showCreate(req, res, next) {
    try {
      return res.render('admin/customers/create', { title: 'Thêm khách hàng' });
    } catch (error) { return next(error); }
  },

  async create(req, res, next) {
    try {
      await customerService.createCustomer(req.body);
      req.flash('success', 'Thêm khách hàng thành công');
      return res.redirect('/admin/customers');
    } catch (error) { return next(error); }
  },

  async showEdit(req, res, next) {
    try {
      const customer = await customerService.getCustomerById(req.params.id);
      if (!customer) return res.redirect('/admin/customers');
      return res.render('admin/customers/edit', { title: 'Chỉnh sửa khách hàng', customer });
    } catch (error) { return next(error); }
  },

  async update(req, res, next) {
    try {
      await customerService.updateCustomer(req.params.id, req.body);
      req.flash('success', 'Cập nhật khách hàng thành công');
      return res.redirect('/admin/customers');
    } catch (error) { return next(error); }
  },

  async delete(req, res, next) {
    try {
      await customerService.deleteCustomer(req.params.id);
      req.flash('success', 'Đã vô hiệu hóa khách hàng');
      return res.redirect('/admin/customers');
    } catch (error) { return next(error); }
  },
};
