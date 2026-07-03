// Asset mapping for NPC portraits & milestone backgrounds.
// Actual generated file names in /public don't always match portraitId
// (e.g. Ông Ba's files are named ong_tu_*), so we map explicitly here.

export const CHARACTER_IMAGES = {
  ba_nam: '/ba_nam.png',
  ong_ba: '/ong_tu.png',
  hung: '/hung.png',
}

// Order matters: first key = default/starting background before any
// section is unlocked.
export const SECTION_BACKGROUNDS = {
  ba_nam: {
    origin: '/ba_nam_1.png',
    structure: '/ba_nam_4.png',
    playing: '/ba_nam_5.png',
    sound: '/ba_nam_3.png',
    memories: '/ba_nam_2.png',
  },
  ong_ba: {
    origin: '/ong_tu_3.png',
    rules: '/ong_tu_4.png',
    materials: '/ong_tu_2.png',
    meaning: '/ong_tu_5.png',
    memories: '/ong_tu_1.png',
  },
  // hung_* chưa có ảnh thật khi viết map này — gán theo đúng thứ tự mốc
  // kiến thức trong npc_hung.json (origin→_1 ... memories→_5). Nếu ảnh AI
  // gen ra không khớp nội dung mốc tương ứng, chỉ cần đổi lại số ở đây,
  // không cần đổi tên file ảnh.
  hung: {
    origin: '/hung_1.png',
    selection: '/hung_2.png',
    treatment: '/hung_3.png',
    carving: '/hung_4.png',
    memories: '/hung_5.png',
  },
}

export const DIARY_IMAGE = '/diary.png'

export function getBackgroundSrc(portraitId, sectionId) {
  const map = SECTION_BACKGROUNDS[portraitId]
  if (!map) return null
  return map[sectionId] || Object.values(map)[0] || null
}

export function getAllBackgrounds(portraitId) {
  return Object.values(SECTION_BACKGROUNDS[portraitId] || {})
}
