module.exports = (validator) => (req, res, next) => {
  try { if (typeof validator === 'function') validator(req.body || {}, req.params || {}, req.query || {}); next(); } catch (error) { next(error); }
};
