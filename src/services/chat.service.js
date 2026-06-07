const { GoogleGenAI } = require('@google/genai');
const { query } = require('../config/db');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Lấy dữ liệu sách từ DB để cung cấp context cho bot
async function getBookContext() {
  const books = await query(`
    SELECT b.id, b.title, b.author, b.quantity, c.name AS category,
      (SELECT sp.new_price FROM sale_prices sp
       JOIN import_lots il ON il.id = sp.lot_id
       WHERE il.book_id = b.id
       ORDER BY sp.updated_at DESC LIMIT 1) AS price
    FROM books b
    LEFT JOIN categories c ON c.id = b.category_id
    WHERE b.is_deleted = 0 AND b.is_active = 1
    ORDER BY b.id DESC
    LIMIT 50
  `);

  if (!books.length) return 'Hiện chưa có sách nào trong hệ thống.';

  return books.map(b =>
    `- "${b.title}" (${b.author || 'Chưa rõ tác giả'}) | Thể loại: ${b.category || 'N/A'} | Giá: ${b.price ? Number(b.price).toLocaleString('vi-VN') + 'đ' : 'Chưa có giá'} | Tồn kho: ${b.quantity > 0 ? b.quantity + ' cuốn' : 'Hết hàng'}`
  ).join('\n');
}

async function chat(userMessage, customerId = null) {
  const bookContext = await getBookContext();

  // Lấy thông tin đơn hàng của khách nếu đã đăng nhập
  let orderContext = '';
  if (customerId) {
    const orders = await query(`
      SELECT code, status, total_amount, payment_status, created_at
      FROM orders WHERE customer_id = ?
      ORDER BY created_at DESC LIMIT 5
    `, [customerId]);

    if (orders.length) {
      const STATUS_VI = {
        pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận',
        shipping: 'Đang giao', delivered: 'Đã giao', cancelled: 'Đã hủy'
      };
      orderContext = '\n\nĐơn hàng gần đây của khách:\n' + orders.map(o => {
        var d = o.created_at ? new Date(o.created_at) : null;
        var dateStr = d ? (('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2)+'/'+d.getFullYear()) : '';
        return `- Mã: ${o.code} | Trạng thái: ${STATUS_VI[o.status]||o.status} | Tổng: ${Number(o.total_amount).toLocaleString('vi-VN')}đ | Ngày: ${dateStr} | Thanh toán: ${o.payment_status==='paid'?'Đã thanh toán':'Chưa thanh toán'}`;
      }).join('\n');
    }
  }

  const systemPrompt = `Bạn là trợ lý tư vấn sách thông minh của cửa hàng sách TBook. Nhiệm vụ của bạn là giúp khách hàng tìm sách phù hợp, trả lời câu hỏi về sách, giá cả, tồn kho và đơn hàng.

Danh sách sách hiện có trong cửa hàng:
${bookContext}${orderContext}

Quy tắc trả lời:
- Trả lời ngắn gọn, thân thiện, dùng tiếng Việt
- Khi gợi ý sách, đề xuất 2-3 cuốn phù hợp nhất kèm giá và tình trạng tồn kho
- Nếu sách hết hàng, thông báo rõ và gợi ý sách tương tự
- Nếu khách hỏi về đơn hàng mà chưa đăng nhập, nhắc khách đăng nhập
- Không bịa thông tin sách ngoài danh sách đã cung cấp
- Câu trả lời tối đa 150 từ
- Dùng số thứ tự (1. 2. 3.) khi liệt kê sách, xuống dòng giữa các mục`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite',
    contents: userMessage,
    config: {
      systemInstruction: systemPrompt,
      maxOutputTokens: 400,
    },
  });

  return response.text || 'Xin lỗi, tôi chưa thể trả lời lúc này.';
}

module.exports = { chat };
