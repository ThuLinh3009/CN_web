// Rate limiter đơn giản dùng bộ nhớ trong process (không cần thư viện ngoài)
// Với production nên dùng express-rate-limit + Redis store

const store = new Map(); // ip -> { count, resetAt }

function rateLimit({ windowMs = 60_000, max = 20, message = 'Quá nhiều yêu cầu, vui lòng thử lại sau.' } = {}) {
  return (req, res, next) => {
    const key = req.ip || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    let record = store.get(key);

    if (!record || now > record.resetAt) {
      record = { count: 1, resetAt: now + windowMs };
      store.set(key, record);
      return next();
    }

    record.count += 1;
    if (record.count > max) {
      return res.status(429).render('client/errors/404', { title: message });
    }
    next();
  };
}

// Dọn bộ nhớ định kỳ để tránh memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (now > record.resetAt) store.delete(key);
  }
}, 5 * 60_000);

module.exports = { rateLimit };
