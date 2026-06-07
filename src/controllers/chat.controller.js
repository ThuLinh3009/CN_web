const chatService = require('../services/chat.service');

module.exports = {
  async chat(req, res, next) {
    try {
      const { message } = req.body;
      if (!message || !message.trim()) {
        return res.json({ reply: 'Bạn chưa nhập câu hỏi.' });
      }
      const customerId = req.session?.user?.id || null;
      const reply = await chatService.chat(message.trim(), customerId);
      return res.json({ reply });
    } catch (error) {
      console.error('Chat error:', error.message || error);
      return res.json({ reply: `[DEBUG] ${error.message}` });
    }
  }
};
