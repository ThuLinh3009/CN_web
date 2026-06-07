function loginPayload(body) {
  if (!body || typeof body !== 'object') throw new Error('Payload không hợp lệ');
  return true;
}

function registerCustomerPayload(body) {
  if (!body || typeof body !== 'object') throw new Error('Payload không hợp lệ');
  return true;
}

module.exports = {
  loginPayload,
  registerCustomerPayload
};
