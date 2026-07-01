import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { getKnowledgeBase, search } from './knowledgeBase.js'
import { generateReply } from './llm.js'

const PORT = process.env.PORT || 3001
const THRESHOLD = Number(process.env.SIMILARITY_THRESHOLD || 0.78)

const app = express()
app.use(cors())
app.use(express.json())

function pickFallback(npc) {
  const list = npc.fallback || []
  return list[Math.floor(Math.random() * list.length)] || 'Bà chưa nghe rõ câu hỏi của cháu...'
}

app.post('/api/chat', async (req, res) => {
  try {
    const { npcId, message } = req.body || {}
    if (!npcId || !message?.trim()) {
      return res.status(400).json({ error: 'Thiếu npcId hoặc message' })
    }

    const { npcs } = await getKnowledgeBase()
    const npc = npcs[npcId]
    if (!npc) return res.status(404).json({ error: `Không tìm thấy NPC "${npcId}"` })

    const matches = await search(npcId, message, 2)
    const best = matches[0]

    // Không liên quan tới chủ đề nào -> dùng fallback, không tốn quota Gemini
    if (!best || best.score < THRESHOLD) {
      return res.json({ text: pickFallback(npc), unlock: [] })
    }

    const generated = await generateReply(npc, message, matches)

    // Gemini lỗi/hết quota -> rơi về câu trả lời gốc trong JSON (vẫn đúng nội dung)
    const text = generated || best.text

    return res.json({ text, unlock: best.unlock, matchedScore: best.score })
  } catch (err) {
    console.error('[API] /api/chat lỗi:', err)
    res.status(500).json({ error: 'Lỗi server' })
  }
})

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, async () => {
  console.log(`[Server] Đang chạy tại http://localhost:${PORT}`)
  await getKnowledgeBase() // warm up: embed sẵn dữ liệu ngay khi khởi động
})
