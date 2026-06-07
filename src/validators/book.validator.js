function createBookPayload(body) {
  if (!body || typeof body !== 'object') throw new Error('Payload không hợp lệ');
  return true;
}

function updateBookPayload(body) {
  if (!body || typeof body !== 'object') throw new Error('Payload không hợp lệ');
  return true;
}

module.exports = {
  createBookPayload,
  updateBookPayload
};
