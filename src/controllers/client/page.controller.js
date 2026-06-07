const pageService = require('../../services/page.service');

module.exports = {
  async news(req, res, next) {
    try {
      const newsList = await pageService.getNews(12);
      return res.render('client/news', { title: 'Tin tức', newsList });
    } catch (error) { return next(error); }
  },

  async about(req, res, next) {
    try {
      const newsList = await pageService.getNews(6);
      return res.render('client/about', { title: 'Giới thiệu', newsList });
    } catch (error) { return next(error); }
  },
};
