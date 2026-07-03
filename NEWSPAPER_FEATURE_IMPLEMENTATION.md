# Kế Hoạch Triển Khai: "Tự Chọn Bố Cục Tờ Báo" (Newspaper Customizer)

> File này mô tả kế hoạch cho tính năng MỚI, CHƯA code — người dùng đọc,
> chốt phương án rồi mới bắt đầu implement theo từng Phase bên dưới.

## 1. Mục tiêu (theo yêu cầu người dùng)
Sau khi phỏng vấn xong 1 NPC, người chơi được vào màn hình "biên tập báo":
- Chọn 1 trong nhiều **bố cục (layout)** kiểu photobooth (khung ảnh + khung
  chữ sắp sẵn theo lưới, không phải kéo-thả tự do).
- Có **5 ảnh** được cấp sẵn (ảnh nhân vật/bối cảnh của NPC đó) + được tự
  thêm ảnh bằng **URL** nếu muốn.
- Nội dung chữ **cắt/dán từ chính các câu trả lời AI đã nhận được** trong
  lúc phỏng vấn (không gõ lại từ đầu) — chọn đoạn nào ghép vào ô nào.
- Tự viết **tiêu đề**, và định dạng chữ: **in đậm**, **bôi màu highlight**.
- Làm ra **3 tờ báo** — mỗi tờ ứng với 1 trong 3 NPC (`ongBaData`,
  `hungData`, `baNamData`) — độc lập, style riêng từng tờ nếu muốn.

## 2. Đánh giá tính khả thi
**Khả thi tốt**, không cần thư viện editor nặng (Canva-style). Lý do:
- Dữ liệu nội dung "cắt ghép" đã có sẵn 100% dưới dạng text tĩnh trong
  `npc_*.json` (`responses[x].text`, `notebook.sections[x].content`) và
  trong state `messages` (lịch sử chat) của `useConversation.js` — không
  cần gọi AI thêm, chỉ cần UI để **chọn đoạn có sẵn** rồi dán vào khung.
- Bố cục "photobooth" (lưới cố định, không kéo-thả tự do) là dạng đơn
  giản nhất để build bằng CSS Grid — không cần react-dnd/react-beautiful-dnd.
- Project đã có tiền lệ "vẽ chữ đè lên ảnh nền" ở `DiaryCanvas.jsx` (dùng
  canvas 2D) — nhưng cho tính năng NÀY nên đổi hướng, xem mục 4.
- Rủi ro chính không nằm ở tính năng, mà ở khối lượng UI (nhiều layout,
  nhiều state) — cần chia phase nhỏ, xem mục 10.

## 3. Quyết định kỹ thuật quan trọng: DOM/CSS thay vì Canvas
`DiaryCanvas.jsx` vẽ chữ bằng `ctx.fillText` trên `<canvas>`. Cách này
**không phù hợp** cho tính năng báo vì:
- In đậm/bôi màu từng đoạn chữ tuỳ ý trong canvas rất phức tạp (phải tự
  đo từng từ, tự tô nền từng cụm — không có `<b>`/`<mark>` như HTML).
- Người dùng cần **chọn văn bản** (bôi đen) để áp định dạng — hành vi này
  là của trình duyệt (Selection API), chỉ hoạt động tự nhiên trên DOM
  thật, không hoạt động trên canvas.

→ **Đề xuất**: Trang báo là các `<div>`/CSS Grid thật (HTML), khung chữ
dùng `contentEditable` hoặc textarea + toolbar định dạng đơn giản (thay vì
contentEditable phức tạp, xem mục 7). Khi người dùng bấm "Tải ảnh báo",
mới **chụp DOM thành ảnh PNG** bằng thư viện `html-to-image` (nhẹ, không
cần server, hoạt động tốt với CSS Grid + ảnh + text). Cần thêm vào
`package.json`:
```
npm install html-to-image
```
(nằm trong domain `registry.npmjs.org` đã được whitelist mạng nên cài
được bình thường).

## 4. Nguồn dữ liệu nội dung ("cắt ghép từ câu trả lời AI")
Có 2 nguồn, nên gộp làm 1 danh sách "ngân hàng đoạn trích" cho người dùng
chọn:
1. `npcData.notebook.sections[].content` — bản tóm tắt ngắn gọn, đã có
   `label` + `icon`, phù hợp làm đoạn trích báo (5 mục/NPC).
2. `messages` từ `useConversation.js` — lịch sử chat thật (`sender: 'npc'`),
   câu trả lời dài hơn, có ngữ cảnh câu hỏi người chơi hỏi kèm theo — hợp
   để trích "phát biểu" kiểu phỏng vấn báo chí thật.
→ Cần `InterviewScene.jsx` truyền `messages` xuống khi gọi `onComplete`,
để state này còn tồn tại khi vào màn hình biên tập báo (hiện `messages`
sống trong `useConversation`, mất khi rời `InterviewScene`).

## 5. Bố cục kiểu "photobooth" (layout templates)
Đề xuất 4 template cố định, định nghĩa bằng object JS (không hard-code
JSX riêng từng cái) để dễ thêm sau này:

```js
// src/data/newspaperLayouts.js
export const LAYOUTS = [
  {
    id: 'strip-3',        // dải ảnh dọc kiểu photobooth cổ điển
    name: 'Dải Ảnh',
    grid: '1fr',
    slots: [
      { type: 'headline' },
      { type: 'image', ratio: '4/3' },
      { type: 'text' },
      { type: 'image', ratio: '4/3' },
      { type: 'text' },
      { type: 'image', ratio: '4/3' },
    ],
  },
  {
    id: 'grid-2x2',        // 4 ảnh lưới + chữ 2 cột dưới, kiểu trang nhất báo
    name: 'Lưới 2x2',
    columns: 2,
    slots: [
      { type: 'headline', span: 2 },
      { type: 'image', ratio: '1/1' }, { type: 'image', ratio: '1/1' },
      { type: 'image', ratio: '1/1' }, { type: 'image', ratio: '1/1' },
      { type: 'text', span: 2 },
    ],
  },
  {
    id: 'feature-hero',    // 1 ảnh lớn nổi bật + 4 ảnh nhỏ + chữ 2 cột
    name: 'Ảnh Bìa',
    slots: [
      { type: 'headline' },
      { type: 'image', ratio: '16/9', size: 'large' },
      { type: 'text', columns: 2 },
      { type: 'image', ratio: '1/1' }, { type: 'image', ratio: '1/1' },
      { type: 'image', ratio: '1/1' }, { type: 'image', ratio: '1/1' },
    ],
  },
  {
    id: 'scattered',       // ảnh xoay nhẹ góc kiểu polaroid rải rác
    name: 'Rải Polaroid',
    freeform: true,        // vị trí % cố định sẵn theo từng slot, KHÔNG cho kéo tự do
    slots: [
      { type: 'headline' },
      { type: 'image', ratio: '1/1', rotate: -6, top: '18%', left: '6%' },
      { type: 'image', ratio: '1/1', rotate: 4,  top: '10%', left: '58%' },
      { type: 'image', ratio: '1/1', rotate: -3, top: '52%', left: '30%' },
      { type: 'text' },
    ],
  },
]
```
Mỗi layout luôn cần **đúng 5 slot ảnh** để khớp với "được cấp 5 ảnh" —
`feature-hero` và `strip-3` ở trên cần chỉnh lại số slot ảnh cho đủ 5 khi
code thật (bản trên chỉ minh hoạ ý tưởng bố cục, không phải JSON cuối).

## 6. Xử lý ảnh (5 ảnh có sẵn + URL tự thêm)
- Mỗi NPC đã có sẵn đúng 5 ảnh milestone (`ba_nam_1..5.png`,
  `ong_tu_1..5.png`, `hung_1..5.png` trong `public/`) — dùng
  `SECTION_BACKGROUNDS` có sẵn trong `npcAssets.js` làm **bộ ảnh mặc định**
  đổ sẵn vào 5 slot ảnh của layout đang chọn.
- Thêm 1 "khay ảnh" (image tray) cho phép:
  - Kéo/click chọn 1 trong 5 ảnh có sẵn để đặt vào 1 slot cụ thể.
  - Dán URL ảnh ngoài vào 1 ô input → thêm vào khay như ảnh thứ 6, 7...
    để thay thế slot bất kỳ. Ràng buộc: chỉ nhận URL `https://` hợp lệ,
    `<img onError>` fallback về ảnh mặc định nếu URL chết — KHÔNG tự động
    tải ảnh về server (project hiện không có upload backend, `server/`
    chỉ lo RAG chat).
- Slot ảnh lưu trong state dạng `{ slotIndex: { src, alt } }`.

## 7. Định dạng chữ (tiêu đề, in đậm, bôi màu)
Không dùng `contentEditable` thô (dễ vỡ khi export html-to-image, khó
kiểm soát paste). Đề xuất mô hình **rich-text tối giản tự quản**:
- Mỗi khung chữ lưu dạng mảng đoạn: `[{ text: 'abc', bold: false, mark: null }, ...]`.
- Người dùng bôi đen (Selection API trên `<span>` hiển thị) → toolbar nổi
  lên với 2 nút: **B** (in đậm) và 🖍️ (highlight, đổi `mark` thành 1 trong
  3-4 màu có sẵn) → tách đoạn đang chọn thành segment mới rồi áp style.
- Tiêu đề (`headline` slot) là 1 `<input>`/`<textarea>` riêng, style cỡ
  chữ lớn theo layout, không cần rich-text (chỉ đổi được font-size/màu
  qua 1-2 nút toggle nếu muốn, không bắt buộc).
- Đây là phần **phức tạp nhất** của tính năng — có thể làm phiên bản rút
  gọn ở Phase đầu: chỉ cho bôi đậm/màu **toàn bộ đoạn** (không cắt segment
  theo từng chữ) để giảm độ khó, nâng cấp lên chọn-từng-từ ở phase sau.

## 8. Xuất file
- Nút "Tải Tờ Báo" → `html-to-image` (`toPng(domNode)`) → tạo file PNG,
  trigger download bằng thẻ `<a download>` tạm — không cần server.
- Vì làm **3 tờ báo** (1/NPC), nên lưu state báo theo `npc.id` — người
  dùng có thể quay lại chỉnh từng tờ riêng, không mất tờ đã làm trước.
  Đề xuất lưu vào `localStorage` (key `newspaper_${npc.id}`) để không mất
  khi refresh — dữ liệu chỉ text/URL/layout id, không lưu ảnh nhị phân nên
  nhẹ.

## 9. Luồng người dùng & điểm gắn vào code hiện tại
1. `CompletionScreen` trong `App.jsx` (sau khi phỏng vấn xong 1 NPC) —
   thêm nút **"📰 Làm Tờ Báo"** bên cạnh nút "← Quay về làng", chuyển
   `scene` sang `'newspaper'`.
2. Scene mới `src/scenes/NewspaperScene.jsx`:
   - Nhận `npcData` + `messages` (lịch sử chat, xem mục 4) qua props.
   - Layout picker (thumbnail nhỏ của 4 template mục 5) ở đầu trang.
   - "Ngân hàng đoạn trích" (mục 4) hiện ở sidebar/panel gấp mở được —
     click 1 đoạn để chèn vào khung chữ đang được chọn.
   - Khay ảnh (mục 6) tương tự, click ảnh để chèn vào slot ảnh đang chọn.
   - Vùng preview chính = layout thật, dùng CSS Grid theo `LAYOUTS[id]`.
3. `App.jsx` cần thêm case `scene === 'newspaper'` render
   `NewspaperScene`, có nút quay lại `'complete'` hoặc thẳng `'village'`.
4. (Tuỳ chọn, không bắt buộc Phase 1) Sau khi cả 3 NPC có
   `localStorage.newspaper_*`, thêm màn "Phòng Triển Lãm" xem lại đủ 3 tờ
   báo cạnh nhau — có thể làm ở Phase cuối nếu người dùng muốn.

## 10. Kế hoạch triển khai theo Phase (để làm dần, dễ review từng bước)
- **Phase 1 — Khung sườn tĩnh**: `newspaperLayouts.js` (4 template) +
  `NewspaperScene.jsx` render 1 layout cố định với dữ liệu mẫu hard-code,
  gắn nút vào `CompletionScreen`, chưa có chỉnh sửa gì. Mục tiêu: xác nhận
  layout nhìn ổn trước khi làm phần tương tác.
- **Phase 2 — Chọn layout + chèn ảnh/chữ có sẵn**: layout picker hoạt
  động thật, khay ảnh 5 ảnh mặc định + đoạn trích từ `notebook.sections`
  chèn được vào slot (chưa có bold/highlight, chưa có URL ảnh ngoài).
- **Phase 3 — Định dạng chữ + URL ảnh ngoài**: thêm bold/highlight (bản
  rút gọn: áp cho cả đoạn) + input URL ảnh, thêm đoạn trích từ `messages`
  (lịch sử chat) làm nguồn thứ 2.
- **Phase 4 — Export + lưu trạng thái**: `html-to-image` xuất PNG,
  `localStorage` lưu/khôi phục theo từng NPC.
- **Phase 5 (tuỳ chọn)** — nâng cấp bold/highlight lên chọn-từng-từ, thêm
  màn "Phòng Triển Lãm" xem đủ 3 tờ báo.

## 11. Rủi ro / câu hỏi mở cần người dùng chốt trước khi code Phase 1
1. 4 template ở mục 5 có đúng ý "kiểu photobooth" không, hay muốn mẫu
   khác (vd: kiểu trang nhất báo giấy thật, cột dọc kiểu tạp chí)?
2. Rich-text bold/highlight: chấp nhận bản rút gọn "áp cho cả đoạn" ở
   Phase 3, hay bắt buộc phải chọn-từng-từ ngay từ đầu (tốn công hơn)?
3. Xuất file: chỉ cần ảnh PNG, hay cần thêm PDF (dùng thêm `jspdf`)?
4. Có cần lưu tờ báo lên server để xem lại trên máy khác không, hay
   `localStorage` (chỉ lưu trên máy đang dùng) là đủ?
