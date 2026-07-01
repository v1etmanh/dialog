# Backend RAG cho Dan Bau Dialog

## Kiến trúc
1. **Embedding (local, miễn phí):** `@xenova/transformers` chạy model
   `Xenova/multilingual-e5-small` ngay trong Node — nhúng toàn bộ câu trả lời
   có sẵn trong `src/data/npc_*.json` khi server khởi động.
2. **Retrieval:** khi người chơi gõ câu hỏi bất kỳ, so cosine similarity giữa
   câu hỏi và các đoạn đã nhúng, lấy top 2 đoạn gần nhất.
3. **Generation (Gemini free tier):** gửi đoạn tư liệu + câu hỏi cho Gemini,
   yêu cầu diễn đạt lại theo giọng nhân vật, chỉ dựa trên tư liệu đã cho.
4. **Fallback 2 lớp:**
   - Similarity quá thấp -> dùng câu `fallback` có sẵn, không gọi Gemini.
   - Gemini lỗi/hết quota -> dùng nguyên văn `text` gốc trong JSON.
   - Backend sập/offline -> frontend tự rơi về `aiSimulator.js` (keyword cũ).

## Chạy thử

```bash
cd server
npm install
cp .env.example .env
# Điền GEMINI_API_KEY vào .env (lấy free tại https://aistudio.google.com/apikey)
npm run dev
```

Lần chạy đầu tiên sẽ tự tải model embedding (~470MB, cần mạng), các lần sau
dùng cache local nên khởi động nhanh hơn nhiều.

Ở cửa sổ terminal khác, chạy frontend như bình thường:

```bash
npm run dev   # ở thư mục gốc dự án
```

Vite sẽ tự proxy `/api/*` sang `http://localhost:3001`.

## Điều chỉnh độ nhạy
`SIMILARITY_THRESHOLD` trong `.env` (mặc định 0.78) quyết định khi nào coi
câu hỏi là "liên quan đủ" để gọi Gemini. Nếu thấy NPC hay rơi vào fallback dù
hỏi đúng chủ đề -> giảm giá trị này xuống (vd 0.72). Nếu thấy NPC trả lời lạc
đề -> tăng lên.
