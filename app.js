const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('./src/config/session');
const registerRoutes = require('./src/routes');
const notFoundMiddleware = require('./src/middlewares/notFound.middleware');
const errorMiddleware = require('./src/middlewares/error.middleware');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session);
app.use(flash());

// Make currentUser and flash messages available to all views
app.use((req, res, next) => {
  res.locals.currentUser = req.session && req.session.user ? req.session.user : null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use(express.static(path.join(__dirname, 'src/public')));
registerRoutes(app);
app.use(notFoundMiddleware);
app.use(errorMiddleware);
module.exports = app;
