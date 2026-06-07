module.exports = (error, req, res, next) => {
  console.error(error);
  const isProd = process.env.NODE_ENV === 'production';
  // Chỉ hiện message chi tiết nếu là lỗi validation (do chính app tạo ra), không phải lỗi hệ thống
  const safeMessage = (!isProd || error.isValidation)
    ? (error.message || 'Đã có lỗi xảy ra')
    : 'Đã có lỗi xảy ra, vui lòng thử lại sau.';
  res.status(error.status || 500).render('client/errors/500', { title: '500 - Lỗi hệ thống', message: safeMessage });
};
