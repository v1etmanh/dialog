# PROJECT LOG — danbau-dialog

## [2026-07-01] - Khảo sát cấu trúc + soạn prompt gen ảnh giao diện
- **Hành động**: Không tìm thấy CONTEXT.md/ARCHITECTURE.md. Đã liệt kê thực tế
  thư mục gốc và `src/` để nắm cấu trúc. Xác nhận `NPCPortrait.jsx` hiện vẽ
  nhân vật bằng canvas 2D thủ công (không dùng ảnh). `Notebook.jsx` là panel
  CSS trượt cạnh phải (chưa có ảnh sổ tay dạng sách mở như bản phác thảo).
  Đã soạn 3 prompt AI gen ảnh (nhân vật tách nền, bối cảnh, sổ nhật ký mở)
  theo yêu cầu người dùng, dựa trên dữ liệu thật từ npc_danbau.json.
- **Tác động**: Chưa chỉnh sửa code/file nào trong dự án — chỉ là bước lên kế
  hoạch (đầu ra: các prompt gen ảnh gửi trong chat, chưa lưu file riêng).
- **Ghi chú cho tương lai**: Khi có ảnh AI gen xong, cần:
  1. Tách nền nhân vật (rembg/remove.bg) → PNG trong suốt.
  2. Đặt tên file theo đúng `portraitId` (`ong_ba.png`, `ba_nam.png`, kèm
     `*_bg.png` cho nền), lưu vào `public/portraits/`.
  3. Refactor `NPCPortrait.jsx`: thay canvas draw bằng 2 lớp `<img>`
     (nền + nhân vật), giữ hiệu ứng "breathing" bằng CSS transform.
  4. Cân nhắc thiết kế lại `Notebook.jsx` thành dạng sổ mở 2 trang (theo
     phác thảo) thay vì panel trượt, với cơ chế tự cuộn/điền khi có
     `unlockedSections` mới — chưa code, mới ở mức ý tưởng.

## [2026-07-01] - Soạn prompt gen nền theo từng mốc kiến thức (5 mốc/nhân vật)
- **Hành động**: Đọc `useNotebook.js`, `npc_danbau.json`, `npc_oanquan.json` để
  lấy đúng danh sách `sections` (mốc kiến thức) của Bà Năm (origin, structure,
  playing, sound, memories) và Ông Ba (origin, rules, materials, meaning,
  memories). Soạn 10 prompt gen ảnh nền (5 mốc × 2 nhân vật) theo yêu cầu:
  mỗi mốc kiến thức unlock tương ứng 1 nền cảnh riêng, dùng chung 1 "style
  anchor" để giữ đồng bộ phong cách giữa các ảnh.
- **Tác động**: Chưa chỉnh sửa code — chỉ là output prompt gửi trong chat,
  chưa lưu ảnh/file trong repo.
- **Ghi chú cho tương lai**: Khi implement đổi nền theo mốc:
  1. Đặt tên file `{portraitId}_{sectionId}.png` (vd: `ba_nam_origin.png`)
     để map trực tiếp từ `npcData.notebook.sections[].id`.
  2. Nền hiển thị = section unlock gần nhất; trước khi unlock gì dùng nền
     mặc định (bối cảnh chung đã soạn prompt ở log trước).
  3. Dùng CSS crossfade (~0.6s opacity transition) khi đổi nền, đồng bộ với
     animation `notebookPulse` đã có sẵn trong `InterviewScene.jsx`.

## [2026-07-01] - Implement: đổi nền theo mốc kiến thức + tích hợp ảnh AI gen
- **Hành động**:
  1. Đọc `public/` thực tế bằng list_directory (ảnh đặt tên: `ba_nam.png`,
     `ba_nam_1..5.png`, `ong_tu.png`, `ong_tu_1..5.png`, `diary.png` — LƯU Ý:
     file của Ông Ba đặt tên `ong_tu` chứ không phải `ong_ba`).
  2. Tạo `src/data/npcAssets.js`: bảng map `portraitId` ("ba_nam"/"ong_ba")
     → ảnh nhân vật + map `sectionId` → ảnh nền, dựa trên NỘI DUNG THỰC của
     từng ảnh (xem bằng mắt qua thumbnail người dùng gửi), KHÔNG suy đoán
     theo thứ tự số file:
     - ba_nam: origin→ba_nam_1, structure→ba_nam_4, playing→ba_nam_5,
       sound→ba_nam_3, memories→ba_nam_2
     - ong_ba: origin→ong_tu_3, rules→ong_tu_4, materials→ong_tu_2,
       meaning→ong_tu_5, memories→ong_tu_1
  3. Sửa `useNotebook.js`: thêm state `currentSectionId` (mốc unlock gần
     nhất, không bị clear sau 3s như `recentlyUnlocked`) để biết nền nào
     đang active.
  4. Viết lại toàn bộ `NPCPortrait.jsx`: bỏ canvas vẽ tay, chuyển sang
     layer ảnh thật (nền crossfade theo `currentSectionId` + nhân vật PNG
     tách nền đè lên, có animation "breathing" bằng transform).
  5. Sửa `InterviewScene.jsx`: lấy `currentSectionId` từ `useNotebook` và
     truyền xuống `NPCPortrait`.
  6. Sửa `Notebook.jsx`: dùng `diary.png` làm icon header + watermark nền
     mờ phía dưới panel (giữ nguyên layout panel trượt cạnh phải, CHƯA
     redesign thành sổ mở dưới màn hình như bản phác thảo gốc — xem ghi chú
     bên dưới).
- **Tác động**: Thay đổi hành vi hiển thị portrait từ vẽ canvas → ảnh AI.
  Cần chạy `npm run dev` để kiểm tra thực tế vì môi trường thực thi code
  hiện tại không có quyền build/preview trực tiếp dự án Windows.
- **Ghi chú cho tương lai**:
  1. Mapping ảnh→mốc kiến thức ở bước 2 là SUY ĐOÁN dựa trên nội dung ảnh
     nhìn thấy qua thumbnail, cần người dùng xác nhận lại hoặc sửa trực
     tiếp trong `src/data/npcAssets.js` nếu gán sai mốc nào.
  2. Notebook vẫn là panel trượt — nếu muốn đúng bản phác thảo gốc (sổ mở
     2 trang cố định ở dưới màn hình, tự cuộn khi có thông tin mới), cần
     redesign riêng `Notebook.jsx`/`NotebookSection.jsx` thành layout mới,
     đây là việc lớn hơn nên để làm ở bước sau khi bước này được xác nhận
     chạy ổn.

## [2026-07-01] - Implement: redesign Sổ Ghi Chép thành dock cố định ở dưới
- **Hành động**:
  1. Đọc lại `Notebook.jsx`, `NotebookSection.jsx`, `InterviewScene.jsx`,
     `index.css` (biến màu) trước khi sửa để bám đúng dữ liệu/style thật.
  2. Viết lại `Notebook.jsx`: bỏ hoàn toàn kiểu modal trượt từ cạnh phải
     (position fixed + backdrop). Thay bằng dock gắn cố định ở dưới màn
     hình (theo đúng phác thảo gốc), có thanh toggle thu/phóng, và danh
     sách "trang sổ" cuộn ngang (scroll-snap). Thêm `useEffect` theo dõi
     `currentSectionId`: tự mở rộng (`setExpanded(true)`) + tự cuộn
     (`scrollIntoView`) đến đúng trang vừa unlock — đáp ứng đúng yêu cầu
     "cuốn sổ tự động điền khi lấy được 1 thông tin mới".
  3. Sửa `NotebookSection.jsx`: đổi từ block full-width sang thẻ "trang"
     kích thước cố định (168px cao, 190px rộng khi đặt trong dock), thêm
     placeholder khóa 🔒 canh giữa khi chưa unlock để các thẻ đều nhau.
  4. Sửa `InterviewScene.jsx`: bỏ state `notebookOpen` và nút mở modal ở
     top bar (đổi thành badge tiến độ tĩnh không click được); gắn
     `<Notebook>` làm phần tử flex cố định phía trên ô nhập liệu, luôn
     mounted (không còn overlay điều kiện).
- **Tác động**: Thay đổi lớn về UX của tính năng ghi chép — từ modal ẩn/hiện
  sang dock luôn hiển thị ở dưới màn hình. Cần chạy `npm run dev` để kiểm
  tra layout thực tế (đặc biệt là chiều cao vùng chat còn lại có đủ thoải
  mái không khi dock đang mở).
- **Ghi chú cho tương lai**:
  1. Nếu vùng chat bị chật khi dock mở, có thể thêm mặc định `expanded:
     false` lúc mới vào scene (chỉ auto-mở khi có unlock mới) thay vì luôn
     mở sẵn.
  2. Ảnh `diary.png` hiện chỉ dùng làm icon nhỏ (22px) ở thanh toggle —
     nếu muốn hiệu ứng "bìa sổ" rõ hơn có thể dùng làm nền mờ cho toàn dock.

## [2026-07-01] - Hiệu ứng chữ hiện dần kiểu viết tay + rebalance layout cho chat
- **Hành động**:
  1. Đọc lại `PROJECT_LOG.md` (mục ghi chú "nếu chật thì mặc định collapse"
     từ log trước), đọc lại `Notebook.jsx` và `NotebookSection.jsx` hiện
     tại trước khi sửa.
  2. Sửa `NotebookSection.jsx`: thêm hiệu ứng nội dung hiện dần từng ký tự
     (2 ký tự/16ms) mô phỏng cảm giác viết tay, kèm con trỏ nhấp nháy
     (`inkCursorBlink`) trong lúc đang "viết". Dùng `useRef` để chỉ chạy
     animation MỘT LẦN khi section chuyển từ khóa → mở khóa; các lần
     re-render sau hiển thị full text ngay, tránh replay animation gây khó
     chịu khi cuộn carousel qua lại.
  3. Sửa `Notebook.jsx`: đổi state `expanded` mặc định từ `true` → `false`
     để nhường không gian cho lịch sử chat ngay từ đầu. Khi có mốc mới
     (`currentSectionId` đổi) vẫn tự mở + tự cuộn tới trang đó như cũ,
     nhưng giờ thêm timer tự đóng lại sau 7 giây để trả lại chỗ cho khung
     chat. Nếu người dùng chủ động bấm nút toggle, timer tự đóng bị hủy
     (tôn trọng thao tác thủ công của người dùng).
- **Tác động**: Vùng chat (`MessageList`) giờ mặc định chiếm đủ không gian
  vì sổ ghi chép không còn mở sẵn thường trực — chỉ "nhấp nháy" hiện lên
  tạm thời mỗi khi có kiến thức mới rồi tự thu lại. Cần chạy `npm run dev`
  để cảm nhận timing 7s có hợp lý không (đặc biệt với đoạn content dài như
  "Nguồn Gốc" ~400 ký tự, animation viết tay mất ~3.2s + thời gian đọc).
- **Ghi chú cho tương lai**:
  1. Nếu 7s auto-collapse quá ngắn/dài, chỉnh số `7000` trong
     `collapseTimerRef.current = setTimeout(...)` ở `Notebook.jsx`.
  2. Tốc độ viết tay (2 ký tự/16ms) đang cố định cho mọi section bất kể độ
     dài — có thể cân nhắc scale theo `section.content.length` nếu muốn
     tổng thời gian viết luôn đồng đều giữa các mốc.


## [2026-07-03] - Thêm nhân vật thứ 3: Anh Hùng (Điêu Khắc Gốc Tre)
- **Hành động**:
  1. Đọc toàn bộ `PROJECT_LOG.md`, `App.jsx`, `VillageScene.jsx`,
     `npcAssets.js`, `useNotebook.js`, `useConversation.js`, cả 2
     `npc_*.json` hiện có, và toàn bộ `server/src/*.js` để nắm đúng schema
     dữ liệu NPC + cơ chế backend RAG tự nạp `npc_*.json` trước khi thêm
     nhân vật mới.
  2. Research nghề điêu khắc gốc tre (thực tế ngoài đời: chọn gốc theo loại
     đất, ngâm bùn + phơi nắng chống mối mọt, đặc thù "không sửa được sai"
     khi đục) để dữ liệu hội thoại có căn cứ thật, không bịa khống.
  3. Theo yêu cầu người dùng, gắn thêm lớp cốt truyện cá nhân: Hùng là bạn
     thân thuở nhỏ của Long — chồng của nhân vật người chơi (nhà báo đi
     phỏng vấn) — hiện Long đang dần mất trí nhớ. Việc phỏng vấn Hùng vừa
     để ghi chép nghề thủ công, vừa mang ý nghĩa lưu giữ ký ức hộ Long.
  4. Tạo `src/data/npc_hung.json`: 5 mốc kiến thức (`origin`, `selection`,
     `treatment`, `carving`, `memories`) cùng `fallback`, theo đúng schema
     2 file NPC cũ. Mốc `memories` được viết lại trực tiếp gắn với Long
     thay vì chỉ kể kỷ niệm nghề chung chung.
  5. Sửa `App.jsx`: import `npc_hung.json`, thêm vào `ALL_NPCS` (thứ tự
     `[ongBaData, hungData, baNamData]` để Hùng hiển thị ở giữa làng).
  6. Sửa `src/data/npcAssets.js`: thêm `CHARACTER_IMAGES.hung` (`/hung.png`)
     và `SECTION_BACKGROUNDS.hung` (map `origin→hung_1` ... `memories→
     hung_5`, theo đúng thứ tự mốc trong JSON — CHƯA xác nhận bằng ảnh
     thật vì người dùng sẽ tự thêm ảnh vào `public/` sau).
  7. Sửa `src/scenes/VillageScene.jsx`: trước đây `NPCCard` chỉ hỗ trợ 2
     vị trí trái/phải suy từ index, và avatar emoji + màu gradient bị
     hard-code theo `isLeft`. Đã refactor:
     - Thêm bảng `NPC_DISPLAY` (icon + gradient) khoá theo `npc.id` thay vì
       suy theo vị trí, để mở rộng thêm nhân vật không phải sửa logic.
     - Tách phần định vị (`position: 'left' | 'center' | 'right'`, dùng
       wrapper `<div>`) khỏi phần hiệu ứng hover (transform scale/translateY
       trên `<button>`) — tránh xung đột transform khi card ở giữa cần
       `translateX(-50%)` để canh giữa.
     - `VillageScene` giờ tự chọn `position` theo `npcs.length`: 2 NPC vẫn
       trái/phải như cũ (không đổi hành vi), 3 NPC trở lên thì
       trái/giữa/phải.
  8. **Không sửa gì ở `server/`** — `data.js` tự đọc mọi file khớp
     `npc_*.json` trong `src/data`, tự embed khi restart server nên
     `npc_hung.json` sẽ tự được nạp vào RAG mà không cần đổi code backend.
- **Tác động**: Làng giờ có 3 NPC hiển thị trái/giữa/phải. Notebook, tiến
  độ, gợi ý câu hỏi (`NotebookBadge` trong `InterviewScene.jsx`) đều đọc
  dữ liệu generic từ `npcData` nên hoạt động ngay với Hùng, không cần sửa.
  Cần chạy `npm run dev` (frontend) và restart `server` (để re-embed thêm
  5 đoạn tri thức mới) để kiểm tra thực tế.
- **Ghi chú cho tương lai**:
  1. Người dùng sẽ tự tạo và thêm ảnh vào `public/`: `hung.png` (nhân vật,
     nền trong suốt) + `hung_1.png` … `hung_5.png` (nền theo mốc, thứ tự
     đúng theo mảng `sections` trong `npc_hung.json`: origin, selection,
     treatment, carving, memories). Nếu ảnh gen ra không khớp nội dung
     mốc tương ứng, chỉ cần đổi số trong `SECTION_BACKGROUNDS.hung` ở
     `npcAssets.js`, không cần đổi tên file ảnh.
  2. `drawVillage()` trong `VillageScene.jsx` vẫn chỉ vẽ 2 ngôi nhà nền
     (trái/phải) bằng canvas — chưa vẽ thêm nhà/xưởng cho vị trí giữa.
     Card của Hùng vẫn hiển thị đúng vị trí giữa nhưng nền phía sau chưa
     có công trình riêng cho anh; có thể cân nhắc thêm 1 `drawHouse` nhỏ
     ở giữa nếu muốn đồng bộ hình ảnh.
  3. Tên "Long" (chồng của người chơi) hiện hard-code trong lời thoại của
     Hùng — nếu sau này dự án có màn hình đặt tên nhân vật người chơi/
     chồng, cần thay chuỗi cứng này bằng biến động.


## [2026-07-03] - Fix lỗi gợi ý câu hỏi luôn ra nội dung "đàn bầu" cho mọi NPC
- **Bug được người dùng báo**: mở gợi ý câu hỏi (📔 badge góc trên) khi đang
  phỏng vấn Ông Ba hoặc Anh Hùng vẫn thấy vài câu hỏi về "đàn bầu" — sai
  hoàn toàn chủ đề.
- **Nguyên nhân**: `NotebookBadge` trong `InterviewScene.jsx` không đọc dữ
  liệu thật của từng NPC để tạo gợi ý. Nó dò regex trên `section.label`
  (`/nguồn/`, `/cấu/`, `/kỹ|kĩ/`, `/âm|tiếng/`, `/kỷ|ký|kỉ/`) rồi trả về
  các câu hỏi HARD-CODE sẵn nội dung về đàn bầu — code này rõ ràng chỉ
  được viết cho riêng Bà Năm rồi quên tổng quát hoá. Hậu quả: bất kỳ label
  nào của NPC khác chỉ cần trùng ký tự là bị gán nhầm câu hỏi đàn bầu, ví
  dụ label "Nguồn Gốc" (mọi NPC đều có) luôn khớp `/nguồn/`; "Kỹ Thuật
  Điêu Khắc" của Hùng chứa "Kỹ" nên khớp `/kỹ/` và bị gán nhầm câu
  "Làm sao để chơi đàn bầu?"; "Ký Ức Cùng Long" chứa "Ký" nên khớp
  `/kỷ|ký|kỉ/` và bị gán nhầm câu hỏi kỷ niệm đàn bầu.
- **Fix**: thêm hẳn trường `sampleQuestion` vào từng mục trong
  `responses` của cả 3 file `npc_*.json` (danbau, oanquan, hung) — câu hỏi
  mẫu do người viết nội dung soạn sẵn, đúng giọng văn/xưng hô riêng từng
  nhân vật, khớp đúng chủ đề `id` của mục đó. Sửa `NotebookBadge` trong
  `InterviewScene.jsx`: bỏ toàn bộ logic đoán bằng regex, đọc thẳng
  `npcData.responses[s.id].sampleQuestion`; chỉ fallback về câu hỏi
  generic (`Bạn có thể kể về ${label}?`) nếu mục nào lỡ thiếu trường này.
- **Tác động**: Gợi ý câu hỏi giờ luôn đúng nhân vật/chủ đề đang phỏng vấn.
  Không còn phụ thuộc vào chữ trong `label` nữa nên an toàn khi thêm NPC
  mới sau này — miễn có `sampleQuestion` là tự đúng, không cần sửa
  `InterviewScene.jsx`.
- **Ghi chú cho tương lai**: Khi tạo `npc_*.json` mới, PHẢI điền
  `sampleQuestion` cho từng mục trong `responses` (không chỉ `keywords` +
  `text` như trước) — coi đây là trường bắt buộc trong schema NPC từ giờ.


## [2026-07-03] - Lập kế hoạch tính năng "Tự Chọn Bố Cục Tờ Báo" (Newspaper Customizer)
- **Hành động**: Đọc `PROJECT_LOG.md`, `App.jsx`, `useNotebook.js`,
  `Notebook.jsx`, `DiaryCanvas.jsx`, `useConversation.js`, `npc_danbau.json`
  để hiểu luồng dữ liệu hiện tại (chat → unlock notebook → CompletionScreen)
  trước khi đề xuất tính năng mới theo yêu cầu người dùng: màn hình
  "biên tập báo" cho phép chọn layout kiểu photobooth, chèn 5 ảnh có sẵn +
  URL ảnh ngoài, cắt-dán nội dung từ câu trả lời AI đã nhận, viết tiêu đề,
  in đậm/bôi màu — tạo ra 3 tờ báo (1 tờ/NPC). Viết file kế hoạch
  `NEWSPAPER_FEATURE_IMPLEMENTATION.md` ở gốc dự án, CHƯA code gì.
- **Tác động**: Chỉ thêm 1 file tài liệu mới, không đổi code hiện có.
  Kế hoạch đề xuất bỏ cách vẽ canvas (`DiaryCanvas.jsx`) cho tính năng
  này, chuyển sang DOM/CSS Grid + xuất ảnh bằng `html-to-image` vì cần
  Selection API (bôi đen chọn chữ để in đậm/highlight) — canvas không hỗ
  trợ tự nhiên việc này.
- **Ghi chú cho tương lai**:
  1. Trước khi code Phase 1, cần người dùng chốt 4 câu hỏi mở ở mục 11
     của file kế hoạch (mẫu layout, mức độ rich-text, PNG/PDF, lưu server
     hay chỉ localStorage).
  2. `messages` (lịch sử chat thật) hiện sống trong `useConversation.js`
     và mất khi rời `InterviewScene` — cần truyền xuống `onComplete` nếu
     muốn dùng làm nguồn trích dẫn thứ 2 cho tờ báo (xem mục 4 kế hoạch).
  3. Chưa cài `html-to-image` — cần `npm install html-to-image` khi bắt
     đầu Phase 4.


## [2026-07-03] - Code Phase 1-3 tính năng "Biên Tập Báo" (Newspaper Customizer)
- **Thời gian**: 2026-07-03, sau khi người dùng chốt phương án ở
  `NEWSPAPER_FEATURE_IMPLEMENTATION.md` mục 11: (1) chỉ 1 bố cục kiểu
  "trang nhất báo giấy thật" (bỏ ý tưởng 4 template photobooth), (2) bắt
  buộc rich-text chọn-từng-từ (Selection API) ngay từ đầu, không làm bản
  rút gọn "áp cho cả đoạn", (3) chỉ xuất PNG (không PDF), (4) không cần
  lưu server, localStorage là đủ.
- **Hành động**:
  1. Đọc `App.jsx`, `InterviewScene.jsx`, `useConversation.js`,
     `useNotebook.js`, `Notebook.jsx`, `DiaryCanvas.jsx`, `npcAssets.js`,
     `npc_danbau.json`, `index.css`, `package.json` để nắm luồng dữ liệu
     & style hiện có trước khi code.
  2. Cài `html-to-image` (`npm install`) — dùng để chụp DOM trang báo
     thành PNG lúc xuất file.
  3. Tạo `src/components/newspaper/EditableRichText.jsx`: khung
     `contentEditable` chọn-từng-từ để in đậm/bôi màu qua
     `document.execCommand` + toolbar nổi lên khi có selection. Đồng bộ
     nội dung ra ngoài CHỈ lúc `onBlur` (không theo từng phím gõ) để
     tránh lỗi kinh điển React+contentEditable làm mất vị trí con trỏ.
  4. Tạo `src/components/newspaper/ImageSlot.jsx`: ô ảnh trên trang báo,
     nhận ảnh theo mô hình "chọn ảnh trong khay trước → bấm vào ô muốn
     đặt" (không dùng thư viện kéo-thả).
  5. Tạo `src/data/newspaperDefaults.js`: sinh bản nháp mặc định
     (masthead, headline, 5 slot ảnh lấy từ `getAllBackgrounds()` có sẵn,
     3 khung chữ mồi từ 3 mục đầu `notebook.sections`) + hàm
     `loadDraft`/`saveDraft` qua `localStorage` khoá theo `npc.id`.
  6. Tạo `src/scenes/NewspaperScene.jsx`: màn biên tập chính — sidebar có
     "Khay Ảnh" (5 ảnh mặc định + thêm URL ảnh ngoài) và "Ngân Hàng Đoạn
     Trích" (gộp `notebook.sections[].content` + lời NPC thật trong
     `messages` truyền từ `InterviewScene`); trang báo bên phải là 1 bố
     cục cố định: masthead + headline + byline + ảnh hero 16:9 + 2 cột
     chữ + hộp trích dẫn có ảnh minh hoạ + hàng 3 ảnh nhỏ + footer. Nút
     "Lưu nháp" (localStorage) và "Tải PNG" (`html-to-image`).
  7. Sửa `src/scenes/InterviewScene.jsx`: `onComplete(npcData, messages)`
     — truyền kèm lịch sử chat thật (trước đây chỉ truyền `npcData`).
  8. Sửa `src/App.jsx`: thêm state `interviewMessages`, scene
     `'newspaper'`, nút "📰 Làm Tờ Báo" trong `CompletionScreen` cạnh nút
     "Quay về làng", render `NewspaperScene` khi `scene === 'newspaper'`.
  9. Thêm ~280 dòng CSS vào `src/index.css` cho toàn bộ giao diện
     `.np-*` (topbar, sidebar, khay ảnh, ngân hàng đoạn trích, trang báo,
     ô ảnh, quote box) và `.rt-*` (rich text editable + toolbar nổi).
  10. Chạy `npm run build` — build thành công, không lỗi cú pháp/import
      (59 modules, `dist/` sinh ra bình thường).
- **Tác động**: Sau khi phỏng vấn xong 1 NPC, người chơi có thể bấm
  "📰 Làm Tờ Báo" để vào màn biên tập, chọn đoạn trích + ảnh có sẵn (hoặc
  URL ngoài) chèn vào 1 bố cục trang nhất cố định, bôi đậm/tô màu từng
  đoạn chữ tuỳ ý, rồi tải về PNG. Áp dụng độc lập cho cả 3 NPC (lưu riêng
  theo `npc.id` trong localStorage) — làm được "3 tờ báo" như yêu cầu.
- **CHƯA kiểm tra bằng mắt**: mới build thành công (không lỗi biên dịch),
  chưa chạy `npm run dev` để tự tay thử trên trình duyệt thật (chọn ảnh,
  bôi đen chọn chữ, kéo toolbar nổi, xuất PNG). Cần người dùng tự chạy
  `npm run dev` và test tay các luồng: (a) chọn ảnh trong khay rồi click
  vào ô ảnh, (b) bấm vào khung chữ rồi chèn 1 đoạn trích, (c) bôi đen 1
  cụm chữ rồi bấm B/màu trong toolbar nổi, (d) bấm "Tải PNG" xem ảnh xuất
  ra có đúng bố cục không.
- **Ghi chú cho tương lai**:
  1. `document.execCommand` đã bị deprecated (dù Chromium vẫn hỗ trợ) —
     nếu sau này cần chạy trên trình duyệt không hỗ trợ tốt, cân nhắc
     thay bằng 1 thư viện rich-text nhẹ (vd. Lexical/Slate) thay vì tự
     quản bằng execCommand.
  2. `html-to-image` đôi khi lỗi với ảnh cross-origin không có CORS header
     đúng (ảnh URL ngoài do người dùng dán vào) — nếu người dùng báo lỗi
     "Xuất ảnh lỗi" khi có ảnh URL ngoài, khả năng cao do CORS, cần thêm
     `crossOrigin: 'anonymous'` hoặc proxy ảnh qua server.
  3. `newspaperLayouts.js` nhiều-template ở bản kế hoạch ban đầu KHÔNG
     được dùng nữa — người dùng đã chọn chỉ 1 bố cục cố định, code thật
     nằm thẳng trong JSX của `NewspaperScene.jsx`, không tách file layout
     data riêng.
  3. Chưa làm "Phòng Triển Lãm" xem đủ 3 tờ báo cạnh nhau (Phase 5 trong
     kế hoạch) — có thể làm sau nếu người dùng cần.
