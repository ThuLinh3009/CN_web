module.exports = ({ page = 1, limit = 10 } = {}) => ({ page: Number(page), limit: Number(limit), offset: (Number(page) - 1) * Number(limit) });
