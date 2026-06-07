module.exports = { success(data = {}, message = 'OK') { return { success: true, message, data }; }, failed(message = 'FAILED', error = null) { return { success: false, message, error }; } };
