const orderService = require('../../services/order.service');

const STATUS_LABEL = {
  pending:   'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping:  'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
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

      return res.render('admin/orders/list', {
        title: 'Quản lý đơn hàng online',
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
        return res.redirect('/admin/orders');
      }
      return res.render('admin/orders/detail', {
        title: 'Chi tiết đơn hàng #' + (order.code || order.id),
        order,
        statuses: orderService.VALID_STATUSES,
        STATUS_LABEL,
      });
    } catch (error) { return next(error); }
  },

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await orderService.updateOrderStatus(id, status);
      req.flash('success', `Đã cập nhật trạng thái đơn hàng #${id} → "${STATUS_LABEL[status] || status}"`);
      return res.redirect('/admin/orders/' + id);
    } catch (error) {
      req.flash('error', error.message);
      return res.redirect('/admin/orders/' + req.params.id);
    }
  },

  async print(req, res, next) {
    try {
      const order = await orderService.getOrderById(req.params.id);
      if (!order) {
        req.flash('error', 'Đơn hàng không tồn tại');
        return res.redirect('/admin/orders');
      }
      return res.render('admin/orders/print', {
        title: 'In phiếu giao hàng #' + (order.code || order.id),
        order, STATUS_LABEL,
        layout: false,
      });
    } catch (error) { return next(error); }
  },

  async markPaid(req, res, next) {
    try {
      const { id } = req.params;
      await orderService.markOrderPaid(id);
      req.flash('success', `Đã xác nhận thanh toán đơn hàng #${id}`);
      return res.redirect('/admin/orders/' + id);
    } catch (error) {
      req.flash('error', error.message);
      return res.redirect('/admin/orders/' + req.params.id);
    }
  },
};
