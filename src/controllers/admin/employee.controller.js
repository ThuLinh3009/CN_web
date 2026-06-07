const employeeService = require('../../services/employee.service');

module.exports = {
  async list(req, res, next) {
    try {
      const employees = await employeeService.getAllEmployees();
      return res.render('admin/employees/list', { title: 'Quản lý nhân viên', employees });
    } catch (error) { return next(error); }
  },

  async showCreate(req, res, next) {
    try {
      const roles = await employeeService.getAllRoles();
      return res.render('admin/employees/create', { title: 'Thêm nhân viên', roles });
    } catch (error) { return next(error); }
  },

  async create(req, res, next) {
    try {
      await employeeService.createEmployee(req.body);
      req.flash('success', 'Thêm nhân viên thành công');
      return res.redirect('/admin/employees');
    } catch (error) { return next(error); }
  },

  async showEdit(req, res, next) {
    try {
      const employee = await employeeService.getEmployeeById(req.params.id);
      if (!employee) return res.redirect('/admin/employees');
      const roles = await employeeService.getAllRoles();
      return res.render('admin/employees/edit', { title: 'Chỉnh sửa nhân viên', employee, roles });
    } catch (error) { return next(error); }
  },

  async update(req, res, next) {
    try {
      await employeeService.updateEmployee(req.params.id, req.body);
      req.flash('success', 'Cập nhật nhân viên thành công');
      return res.redirect('/admin/employees');
    } catch (error) { return next(error); }
  },

  async delete(req, res, next) {
    try {
      await employeeService.deleteEmployee(req.params.id);
      req.flash('success', 'Đã vô hiệu hóa nhân viên');
      return res.redirect('/admin/employees');
    } catch (error) { return next(error); }
  },
};
