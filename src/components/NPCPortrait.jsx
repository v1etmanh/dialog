import { useEffect, useRef } from 'react'

const TWO_PI = Math.PI * 2

/* ─── drawing helpers ─────────────────────────────────────── */

function drawOngBa(ctx, w, h, t) {
  const breath = Math.sin(t * 0.9) * 2.5  // subtle body rise/fall

  // Background — warm wooden interior
  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, '#6b3a1f')
  bg.addColorStop(1, '#3d1f0a')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // Wood grain lines
  ctx.save()
  ctx.globalAlpha = 0.08
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 1
  for (let i = 0; i < w; i += 18) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i + 8, h)
    ctx.stroke()
  }
  ctx.restore()

  // Warm lantern glow at top
  const glow = ctx.createRadialGradient(w / 2, 0, 0, w / 2, 0, w * 0.8)
  glow.addColorStop(0, 'rgba(255,180,50,0.18)')
  glow.addColorStop(1, 'rgba(255,100,0,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, w, h)

  const cx = w / 2
  const bodyBase = h * 0.58 + breath

  // Body — dark indigo áo bà ba
  ctx.fillStyle = '#1a237e'
  ctx.beginPath()
  ctx.moveTo(cx - w * 0.38, h)
  ctx.lineTo(cx - w * 0.26, bodyBase)
  ctx.quadraticCurveTo(cx, bodyBase - h * 0.04, cx + w * 0.26, bodyBase)
  ctx.lineTo(cx + w * 0.38, h)
  ctx.closePath()
  ctx.fill()

  // Collar detail
  ctx.fillStyle = '#283593'
  ctx.beginPath()
  ctx.moveTo(cx - w * 0.1, bodyBase)
  ctx.lineTo(cx, bodyBase + h * 0.07)
  ctx.lineTo(cx + w * 0.1, bodyBase)
  ctx.closePath()
  ctx.fill()

  // Neck
  ctx.fillStyle = '#c8886a'
  ctx.beginPath()
  ctx.rect(cx - w * 0.07, bodyBase - h * 0.09, w * 0.14, h * 0.1)
  ctx.fill()

  // Head shadow
  const headY = h * 0.32 + breath * 0.5
  const headR = w * 0.21
  ctx.fillStyle = 'rgba(0,0,0,0.18)'
  ctx.beginPath()
  ctx.arc(cx + 3, headY + 4, headR, 0, TWO_PI)
  ctx.fill()

  // Head
  ctx.fillStyle = '#c8886a'
  ctx.beginPath()
  ctx.arc(cx, headY, headR, 0, TWO_PI)
  ctx.fill()

  // Ears
  ctx.fillStyle = '#c08060'
  ctx.beginPath()
  ctx.ellipse(cx - headR * 0.95, headY + headR * 0.05, headR * 0.16, headR * 0.22, 0, 0, TWO_PI)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + headR * 0.95, headY + headR * 0.05, headR * 0.16, headR * 0.22, 0, 0, TWO_PI)
  ctx.fill()

  // White hair — arc on top
  ctx.fillStyle = '#e8e5e0'
  ctx.beginPath()
  ctx.arc(cx, headY - headR * 0.1, headR, Math.PI, 0)
  ctx.fill()

  ctx.fillStyle = '#d8d5d0'
  ctx.beginPath()
  ctx.arc(cx, headY - headR * 0.25, headR * 0.88, Math.PI + 0.15, -0.15)
  ctx.fill()

  // Forehead age lines
  ctx.strokeStyle = 'rgba(180,120,80,0.5)'
  ctx.lineWidth = 0.8
  for (let i = 0; i < 3; i++) {
    ctx.beginPath()
    ctx.moveTo(cx - headR * 0.35 + i * headR * 0.02, headY - headR * 0.3 + i * headR * 0.12)
    ctx.lineTo(cx + headR * 0.3 + i * headR * 0.02, headY - headR * 0.28 + i * headR * 0.12)
    ctx.stroke()
  }

  // Eyebrows (bushy, grey/white for elderly)
  ctx.strokeStyle = '#aaaaaa'
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(cx - headR * 0.44, headY - headR * 0.22)
  ctx.quadraticCurveTo(cx - headR * 0.3, headY - headR * 0.3, cx - headR * 0.16, headY - headR * 0.21)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + headR * 0.16, headY - headR * 0.21)
  ctx.quadraticCurveTo(cx + headR * 0.3, headY - headR * 0.3, cx + headR * 0.44, headY - headR * 0.22)
  ctx.stroke()

  // Eyes — kind, slightly squinted
  ctx.fillStyle = '#2c1810'
  ctx.beginPath()
  ctx.ellipse(cx - headR * 0.28, headY - headR * 0.06, headR * 0.11, headR * 0.07, 0, 0, TWO_PI)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + headR * 0.28, headY - headR * 0.06, headR * 0.11, headR * 0.07, 0, 0, TWO_PI)
  ctx.fill()

  // Eye shine
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.beginPath()
  ctx.arc(cx - headR * 0.24, headY - headR * 0.09, headR * 0.03, 0, TWO_PI)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + headR * 0.32, headY - headR * 0.09, headR * 0.03, 0, TWO_PI)
  ctx.fill()

  // Crow's feet wrinkles
  ctx.strokeStyle = 'rgba(160,100,60,0.45)'
  ctx.lineWidth = 0.7
  ctx.beginPath()
  ctx.moveTo(cx - headR * 0.42, headY - headR * 0.04)
  ctx.lineTo(cx - headR * 0.52, headY)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx - headR * 0.42, headY - headR * 0.06)
  ctx.lineTo(cx - headR * 0.54, headY - headR * 0.1)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + headR * 0.42, headY - headR * 0.04)
  ctx.lineTo(cx + headR * 0.52, headY)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + headR * 0.42, headY - headR * 0.06)
  ctx.lineTo(cx + headR * 0.54, headY - headR * 0.1)
  ctx.stroke()

  // Nose
  ctx.fillStyle = '#b87a58'
  ctx.beginPath()
  ctx.ellipse(cx, headY + headR * 0.12, headR * 0.09, headR * 0.08, 0, 0, TWO_PI)
  ctx.fill()

  // Smile
  ctx.strokeStyle = '#8b4513'
  ctx.lineWidth = 1.8
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.arc(cx, headY + headR * 0.22, headR * 0.18, 0.1, Math.PI - 0.1)
  ctx.stroke()

  // Nasolabial folds
  ctx.strokeStyle = 'rgba(160,100,60,0.4)'
  ctx.lineWidth = 0.9
  ctx.beginPath()
  ctx.arc(cx - headR * 0.22, headY + headR * 0.17, headR * 0.13, -0.4, 0.9)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(cx + headR * 0.22, headY + headR * 0.17, headR * 0.13, Math.PI - 0.9, Math.PI + 0.4)
  ctx.stroke()

  // Chin beard (subtle white)
  ctx.fillStyle = 'rgba(230,225,220,0.5)'
  ctx.beginPath()
  ctx.ellipse(cx, headY + headR * 0.72, headR * 0.18, headR * 0.12, 0, 0, TWO_PI)
  ctx.fill()

  // Name tag at bottom
  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  roundRect(ctx, w * 0.1, h * 0.88, w * 0.8, h * 0.1, 6)
  ctx.fill()
  ctx.fillStyle = '#f0d090'
  ctx.font = `bold ${Math.round(h * 0.055)}px 'Be Vietnam Pro', sans-serif`
  ctx.textAlign = 'center'
  ctx.fillText('Ông Ba', cx, h * 0.945)
}

function drawBaNam(ctx, w, h, t) {
  const breath = Math.sin(t * 0.8) * 2.2

  // Background — soft interior with window light
  const bg = ctx.createLinearGradient(0, 0, w, h)
  bg.addColorStop(0, '#4a1942')
  bg.addColorStop(1, '#2a0d27')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // Window glow (top-right)
  const winGlow = ctx.createRadialGradient(w * 0.85, h * 0.1, 0, w * 0.85, h * 0.1, w * 0.6)
  winGlow.addColorStop(0, 'rgba(255,220,150,0.22)')
  winGlow.addColorStop(1, 'rgba(255,150,100,0)')
  ctx.fillStyle = winGlow
  ctx.fillRect(0, 0, w, h)

  // Soft floor glow
  const floorGlow = ctx.createRadialGradient(w / 2, h, 0, w / 2, h, w * 0.7)
  floorGlow.addColorStop(0, 'rgba(200,100,80,0.12)')
  floorGlow.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = floorGlow
  ctx.fillRect(0, 0, w, h)

  const cx = w / 2
  const bodyBase = h * 0.58 + breath

  // Body — áo dài (red/crimson)
  ctx.fillStyle = '#8b0000'
  ctx.beginPath()
  ctx.moveTo(cx - w * 0.32, h)
  ctx.lineTo(cx - w * 0.22, bodyBase)
  ctx.quadraticCurveTo(cx, bodyBase - h * 0.03, cx + w * 0.22, bodyBase)
  ctx.lineTo(cx + w * 0.32, h)
  ctx.closePath()
  ctx.fill()

  // Áo dài collar
  ctx.fillStyle = '#a00000'
  ctx.beginPath()
  ctx.moveTo(cx - w * 0.08, bodyBase)
  ctx.lineTo(cx, bodyBase + h * 0.06)
  ctx.lineTo(cx + w * 0.08, bodyBase)
  ctx.closePath()
  ctx.fill()

  // Gold trim on dress
  ctx.strokeStyle = '#d4a054'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(cx - w * 0.22, bodyBase)
  ctx.quadraticCurveTo(cx, bodyBase - h * 0.03, cx + w * 0.22, bodyBase)
  ctx.stroke()

  // Neck
  ctx.fillStyle = '#c8886a'
  ctx.beginPath()
  ctx.rect(cx - w * 0.065, bodyBase - h * 0.09, w * 0.13, h * 0.1)
  ctx.fill()

  // Head shadow
  const headY = h * 0.31 + breath * 0.5
  const headR = w * 0.2
  ctx.fillStyle = 'rgba(0,0,0,0.18)'
  ctx.beginPath()
  ctx.arc(cx + 3, headY + 4, headR, 0, TWO_PI)
  ctx.fill()

  // Head
  ctx.fillStyle = '#c8886a'
  ctx.beginPath()
  ctx.arc(cx, headY, headR, 0, TWO_PI)
  ctx.fill()

  // Ears
  ctx.fillStyle = '#c08060'
  ctx.beginPath()
  ctx.ellipse(cx - headR * 0.95, headY + headR * 0.05, headR * 0.14, headR * 0.2, 0, 0, TWO_PI)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + headR * 0.95, headY + headR * 0.05, headR * 0.14, headR * 0.2, 0, 0, TWO_PI)
  ctx.fill()

  // Hair — dark, pulled back in bun
  ctx.fillStyle = '#1a0a0a'
  ctx.beginPath()
  ctx.arc(cx, headY - headR * 0.08, headR, Math.PI, 0)
  ctx.fill()

  // Hair bun on top
  ctx.fillStyle = '#2a1010'
  ctx.beginPath()
  ctx.ellipse(cx, headY - headR * 0.85, headR * 0.28, headR * 0.22, 0, 0, TWO_PI)
  ctx.fill()

  // Bun detail (highlight)
  ctx.fillStyle = 'rgba(100,50,30,0.4)'
  ctx.beginPath()
  ctx.ellipse(cx - headR * 0.06, headY - headR * 0.92, headR * 0.1, headR * 0.08, -0.4, 0, TWO_PI)
  ctx.fill()

  // Hair pin (gold)
  ctx.strokeStyle = '#d4a054'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(cx - headR * 0.2, headY - headR * 0.75)
  ctx.lineTo(cx + headR * 0.25, headY - headR * 1.05)
  ctx.stroke()
  ctx.fillStyle = '#f0c060'
  ctx.beginPath()
  ctx.arc(cx + headR * 0.25, headY - headR * 1.05, headR * 0.045, 0, TWO_PI)
  ctx.fill()

  // Eyebrows (dark, gentle arch)
  ctx.strokeStyle = '#3a1a10'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(cx - headR * 0.42, headY - headR * 0.2)
  ctx.quadraticCurveTo(cx - headR * 0.28, headY - headR * 0.3, cx - headR * 0.14, headY - headR * 0.2)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + headR * 0.14, headY - headR * 0.2)
  ctx.quadraticCurveTo(cx + headR * 0.28, headY - headR * 0.3, cx + headR * 0.42, headY - headR * 0.2)
  ctx.stroke()

  // Eyes — gentle, almond-shaped
  ctx.fillStyle = '#1a0808'
  ctx.beginPath()
  ctx.ellipse(cx - headR * 0.27, headY - headR * 0.07, headR * 0.12, headR * 0.075, 0, 0, TWO_PI)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + headR * 0.27, headY - headR * 0.07, headR * 0.12, headR * 0.075, 0, 0, TWO_PI)
  ctx.fill()

  // Eye shine
  ctx.fillStyle = 'rgba(255,255,255,0.65)'
  ctx.beginPath()
  ctx.arc(cx - headR * 0.23, headY - headR * 0.1, headR * 0.03, 0, TWO_PI)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + headR * 0.31, headY - headR * 0.1, headR * 0.03, 0, TWO_PI)
  ctx.fill()

  // Nose — delicate
  ctx.fillStyle = '#b87a58'
  ctx.beginPath()
  ctx.ellipse(cx, headY + headR * 0.1, headR * 0.075, headR * 0.07, 0, 0, TWO_PI)
  ctx.fill()

  // Smile — soft and warm
  ctx.strokeStyle = '#8b3030'
  ctx.lineWidth = 1.6
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.arc(cx, headY + headR * 0.24, headR * 0.14, 0.1, Math.PI - 0.1)
  ctx.stroke()

  // Cheek blush
  ctx.fillStyle = 'rgba(220,100,80,0.18)'
  ctx.beginPath()
  ctx.ellipse(cx - headR * 0.42, headY + headR * 0.1, headR * 0.2, headR * 0.13, 0, 0, TWO_PI)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + headR * 0.42, headY + headR * 0.1, headR * 0.2, headR * 0.13, 0, 0, TWO_PI)
  ctx.fill()

  // Name tag
  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  roundRect(ctx, w * 0.1, h * 0.88, w * 0.8, h * 0.1, 6)
  ctx.fill()
  ctx.fillStyle = '#f0d090'
  ctx.font = `bold ${Math.round(h * 0.055)}px 'Be Vietnam Pro', sans-serif`
  ctx.textAlign = 'center'
  ctx.fillText('Bà Năm', cx, h * 0.945)
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

/* ─── Component ───────────────────────────────────────────── */

export default function NPCPortrait({ portraitId, width = 280, height = 360 }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const startRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const draw = (ts) => {
      if (!startRef.current) startRef.current = ts
      const t = (ts - startRef.current) / 1000

      ctx.clearRect(0, 0, width, height)
      if (portraitId === 'ong_ba') drawOngBa(ctx, width, height, t)
      else if (portraitId === 'ba_nam') drawBaNam(ctx, width, height, t)

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [portraitId, width, height])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        borderRadius: 12,
        boxShadow: '0 6px 24px rgba(0,0,0,0.4)',
        display: 'block'
      }}
    />
  )
}
