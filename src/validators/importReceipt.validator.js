function createImportReceiptPayload(body) {
  if (!body || typeof body !== 'object') throw new Error('Payload không hợp lệ');
  return true;
}

function updateImportReceiptPayload(body) {
  if (!body || typeof body !== 'object') throw new Error('Payload không hợp lệ');
  return true;
}

module.exports = {
  createImportReceiptPayload,
  updateImportReceiptPayload
};
