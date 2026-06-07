const orderService = require('../../services/order.service');

const STATUS_LABEL = {
  pending:   'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping:  'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
};

// Staff được: pending→confirmed, confirmed→shipping, shipping→delivered
// Hủy đơn + mark paid → chỉ Admin
const STAFF_ALLOWED_TRANSITIONS = {
  pending:   ['confirmed'],
  confirmed: ['shipping'],
  shipping:  ['delivered'],
  delivered: [],
  cancelled: [],
};

module.exports = {
  async list(req, res, next) {
    try {
      const status = req.query.status || '';
      const page   = parseInt(req.query.page) || 1;
      const limit  = 20;

      const [orders, total] = await Promise.all([
        orderService.getAllOrders({ status: status || undefined, page, limit }),
        orderService.countOrders({ status: status || undefined }),
      ]);
      const totalPages = Math.ceil(total / limit);

      return res.render('staff/orders/list', {
        title: 'Đơn hàng online',
        orders, total, page, totalPages, limit,
        currentStatus: status,
        statuses: orderService.VALID_STATUSES,
        STATUS_LABEL,
      });
    } catch (error) { return next(error); }
  },

  async detail(req, res, next) {
    try {
      const order = await orderService.getOrderById(req.params.id);
      if (!order) {
        req.flash('error', 'Đơn hàng không tồn tại');
        return res.redirect('/staff/orders');
      }
      return res.render('staff/orders/detail', {
        title: 'Chi tiết đơn hàng #' + (order.code || order.id),
        order,
        STATUS_LABEL,
        STAFF_ALLOWED_TRANSITIONS,
      });
    } catch (error) { return next(error); }
  },

  async print(req, res, next) {
    try {
      const order = await orderService.getOrderById(req.params.id);
      if (!order) {
        req.flash('error', 'Đơn hàng không tồn tại');
        return res.redirect('/staff/orders');
      }
      return res.render('staff/orders/print', {
        title: 'In phiếu giao hàng #' + (order.code || order.id),
        order, STATUS_LABEL,
        layout: false,
      });
    } catch (error) { return next(error); }
  },

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Staff không được hủy đơn
      if (status === 'cancelled') {
        req.flash('error', 'Nhân viên không có quyền hủy đơn hàng');
        return res.redirect('/staff/orders/' + id);
      }

      await orderService.updateOrderStatus(id, status);
      req.flash('success', `Đã cập nhật trạng thái đơn hàng #${id} → "${STATUS_LABEL[status] || status}"`);
      return res.redirect('/staff/orders/' + id);
    } catch (error) {
      req.flash('error', error.message);
      return res.redirect('/staff/orders/' + req.params.id);
    }
  },
};
