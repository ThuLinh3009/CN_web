function createCategoryPayload(body) {
  if (!body || typeof body !== 'object') throw new Error('Payload không hợp lệ');
  return true;
}

function updateCategoryPayload(body) {
  if (!body || typeof body !== 'object') throw new Error('Payload không hợp lệ');
  return true;
}

module.exports = {
  createCategoryPayload,
  updateCategoryPayload
};
