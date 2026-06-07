module.exports = (app) => {
  app.use('/', require('./client/home.routes'));
  app.use('/books', require('./client/book.routes'));
  app.use('/cart', require('./client/cart.routes'));
  app.use('/checkout', require('./client/checkout.routes'));
  app.use('/', require('./client/auth.routes'));
  app.use('/profile', require('./client/profile.routes'));
  app.use('/contact', require('./client/contact.routes'));
  app.use('/', require('./client/page.routes'));
  app.use('/chat', require('./chat.routes'));

  app.use('/admin', require('./admin/dashboard.routes'));
  app.use('/admin/books', require('./admin/book.routes'));
  app.use('/admin/categories', require('./admin/category.routes'));
  app.use('/admin/customers', require('./admin/customer.routes'));
  app.use('/admin/employees', require('./admin/employee.routes'));
  app.use('/admin/suppliers', require('./admin/supplier.routes'));
  app.use('/admin/book-attributes', require('./admin/bookAttribute.routes'));
  app.use('/admin/import-lots', require('./admin/importLot.routes'));
  app.use('/admin/import-receipts', require('./admin/importReceipt.routes'));
  app.use('/admin/statistics', require('./admin/statistics.routes'));
  app.use('/admin/orders', require('./admin/order.routes'));

  app.use('/staff', require('./staff/dashboard.routes'));
  app.use('/staff/books', require('./staff/book.routes'));
  app.use('/staff/categories', require('./staff/category.routes'));
  app.use('/staff/statistics', require('./staff/statistics.routes'));
  app.use('/staff/orders', require('./staff/order.routes'));
};
