import { useEffect, useRef } from 'react'
import { fx, type BurstKind } from './fx'

type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; color: string; g: number; text?: string }

const PALETTE: Record<BurstKind, string[]> = {
  sparkle: ['#ffcd75', '#f4f4f4', '#a7f070'],
  smoke: ['#566c86', '#94b0c2', '#333c57'],
  confetti: ['#a7f070', '#ffcd75', '#41a6f6', '#c58cf2', '#ff5a6a'],
  hit: ['#ff5a6a', '#ffcd75', '#f4f4f4'],
  coins: ['#ffcd75', '#ef7d57'],
  magic: ['#c58cf2', '#73eff7', '#f4f4f4'],
}

/** Canvas particle layer (pixel squares + floating text). Also handles screen shake via `onShake`. */
export function FxLayer({ onShake }: { onShake: (power: number) => void }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const parts = useRef<P[]>([])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const off = fx.on((e) => {
      if (e.type === 'shake') {
        if (!reduce) onShake(e.power ?? 6)
        return
      }
      if (e.type === 'text') {
        parts.current.push({ x: e.x, y: e.y, vx: 0, vy: -0.6, life: 0, max: 70, size: 14, color: e.color ?? '#ffcd75', g: 0, text: e.text })
        return
      }
      if (reduce) return
      const n = e.count ?? (e.kind === 'confetti' ? 60 : 22)
      const pal = PALETTE[e.kind]
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2
        const sp = e.kind === 'smoke' ? 0.6 + Math.random() : e.kind === 'confetti' ? 2 + Math.random() * 5 : 1.5 + Math.random() * 3.5
        parts.current.push({
          x: e.x,
          y: e.y,
          vx: Math.cos(a) * sp,
          vy: e.kind === 'smoke' ? -Math.abs(Math.sin(a) * sp) - 0.4 : Math.sin(a) * sp - (e.kind === 'confetti' ? 3 : 1),
          life: 0,
          max: 40 + Math.random() * 40,
          size: e.kind === 'smoke' ? 8 + Math.random() * 6 : 4 + Math.floor(Math.random() * 3) * 2,
          color: pal[Math.floor(Math.random() * pal.length)],
          g: e.kind === 'smoke' || e.kind === 'magic' ? -0.01 : 0.12,
        })
      }
    })

    let raf = 0
    const tick = () => {
      const c = ref.current
      const ctx = c?.getContext('2d')
      if (c && ctx) {
        ctx.clearRect(0, 0, c.width, c.height)
        ctx.imageSmoothingEnabled = false
        parts.current = parts.current.filter((p) => p.life < p.max)
        for (const p of parts.current) {
          p.life++
          p.x += p.vx
          p.y += p.vy
          p.vy += p.g
          const alpha = 1 - p.life / p.max
          ctx.globalAlpha = Math.max(0, alpha)
          if (p.text) {
            ctx.font = `${p.size}px "Press Start 2P", monospace`
            ctx.textAlign = 'center'
            ctx.fillStyle = '#0b0c16'
            ctx.fillText(p.text, p.x + 2, p.y + 2)
            ctx.fillStyle = p.color
            ctx.fillText(p.text, p.x, p.y)
          } else {
            ctx.fillStyle = p.color
            ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size)
          }
        }
        ctx.globalAlpha = 1
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      off()
      cancelAnimationFrame(raf)
    }
  }, [onShake])

  return <canvas ref={ref} width={1280} height={720} className="no-print pointer-events-none absolute inset-0 z-30" aria-hidden />
}
