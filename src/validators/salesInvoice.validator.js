function createSalesInvoicePayload(body) {
  if (!body || typeof body !== 'object') throw new Error('Payload không hợp lệ');
  return true;
}

function updateSalesInvoicePayload(body) {
  if (!body || typeof body !== 'object') throw new Error('Payload không hợp lệ');
  return true;
}

module.exports = {
  createSalesInvoicePayload,
  updateSalesInvoicePayload
};
