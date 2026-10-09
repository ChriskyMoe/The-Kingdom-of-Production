/**
 * Tiny effects bus. Scenes call fx.burst / fx.text / fx.shake with stage coordinates
 * (1280×720 space); FxLayer draws them on a canvas above the slide.
 */
export type BurstKind = 'sparkle' | 'smoke' | 'confetti' | 'hit' | 'coins' | 'magic'
export type FxEvent =
  | { type: 'burst'; x: number; y: number; kind: BurstKind; count?: number }
  | { type: 'text'; x: number; y: number; text: string; color?: string }
  | { type: 'shake'; power?: number }

type Listener = (e: FxEvent) => void
const listeners = new Set<Listener>()

export const fx = {
  on(l: Listener) {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
  emit(e: FxEvent) {
    listeners.forEach((l) => l(e))
  },
  burst(x: number, y: number, kind: BurstKind = 'sparkle', count?: number) {
    fx.emit({ type: 'burst', x, y, kind, count })
  },
  text(x: number, y: number, text: string, color?: string) {
    fx.emit({ type: 'text', x, y, text, color })
  },
  shake(power = 6) {
    fx.emit({ type: 'shake', power })
  },
}

/**
 * Converts a DOM element's centre to stage coordinates, so a scene can say
 * fx.burst(...at(el)) without doing maths. `stage` is the <main> element.
 */
export function stagePoint(el: Element | null): { x: number; y: number } {
  const stage = document.querySelector('main[data-stage]') as HTMLElement | null
  if (!el || !stage) return { x: 640, y: 360 }
  const s = stage.getBoundingClientRect()
  const r = el.getBoundingClientRect()
  const scale = s.width / 1280
  return { x: (r.left + r.width / 2 - s.left) / scale, y: (r.top + r.height / 2 - s.top) / scale }
}
