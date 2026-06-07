const contactService = require('../../services/contact.service');

module.exports = {
  async index(req, res, next) {
    try {
      return res.render('client/contact', { title: 'Liên hệ' });
    } catch (error) { return next(error); }
  },

  async submit(req, res, next) {
    try {
      await contactService.createContact(req.body);
      req.flash('success', 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.');
      return res.redirect('/contact');
    } catch (error) { return next(error); }
  },
};
