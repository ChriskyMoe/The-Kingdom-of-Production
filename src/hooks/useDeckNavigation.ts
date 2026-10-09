import { useCallback, useEffect, useState } from 'react'

const readHash = (count: number) => {
  const n = parseInt(window.location.hash.replace('#', ''), 10)
  return Number.isFinite(n) && n >= 1 && n <= count ? n - 1 : 0
}

const isTyping = (el: Element | null) =>
  !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || (el as HTMLElement).isContentEditable)

export type Overlay = 'none' | 'help' | 'menu'

/**
 * Keyboard, hash and swipe navigation for the deck.
 * ← → Space PageUp PageDown Home End, F fullscreen, N notes, ? help, M menu, Esc closes overlays.
 */
export function useDeckNavigation(count: number) {
  const [index, setIndex] = useState(() => readHash(count))
  const [overlay, setOverlay] = useState<Overlay>('none')
  const [notes, setNotes] = useState(false)

  const go = useCallback((i: number) => setIndex(Math.max(0, Math.min(count - 1, i))), [count])
  const next = useCallback(() => setIndex((i) => Math.min(count - 1, i + 1)), [count])
  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), [])

  useEffect(() => {
    const target = `#${index + 1}`
    if (window.location.hash !== target) history.replaceState(null, '', target)
  }, [index])

  useEffect(() => {
    const onHash = () => setIndex(readHash(count))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [count])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(document.activeElement) || e.ctrlKey || e.metaKey || e.altKey) return
      const k = e.key
      if (k === 'Escape') return setOverlay('none')
      if (k === '?' || k === 'h' || k === 'H') return setOverlay((o) => (o === 'help' ? 'none' : 'help'))
      if (k === 'm' || k === 'M') return setOverlay((o) => (o === 'menu' ? 'none' : 'menu'))
      if (k === 'n' || k === 'N') return setNotes((v) => !v)
      if (k === 'f' || k === 'F') {
        if (document.fullscreenElement) void document.exitFullscreen()
        else void document.documentElement.requestFullscreen?.()
        return
      }
      if (overlay !== 'none') return
      if (k === 'ArrowRight' || k === 'PageDown' || k === ' ' || k === 'Spacebar') {
        // Space on a focused button should press it, not advance
        if (k === ' ' && document.activeElement?.tagName === 'BUTTON') return
        e.preventDefault()
        next()
      } else if (k === 'ArrowLeft' || k === 'PageUp') {
        e.preventDefault()
        prev()
      } else if (k === 'Home') {
        e.preventDefault()
        go(0)
      } else if (k === 'End') {
        e.preventDefault()
        go(count - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [count, go, next, prev, overlay])

  // Release focus after a click so arrows/space go back to the deck
  useEffect(() => {
    const onUp = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      if (el.closest('button')) setTimeout(() => (document.activeElement as HTMLElement | null)?.blur(), 0)
    }
    window.addEventListener('mouseup', onUp)
    return () => window.removeEventListener('mouseup', onUp)
  }, [])

  // Touch swipe (ignored when the touch starts on a control)
  useEffect(() => {
    let x0: number | null = null
    const start = (e: TouchEvent) => {
      const t = e.target as HTMLElement
      x0 = t.closest('button, input, a, [data-no-swipe]') ? null : e.touches[0].clientX
    }
    const end = (e: TouchEvent) => {
      if (x0 === null) return
      const dx = e.changedTouches[0].clientX - x0
      if (Math.abs(dx) > 60) (dx < 0 ? next : prev)()
      x0 = null
    }
    window.addEventListener('touchstart', start, { passive: true })
    window.addEventListener('touchend', end)
    return () => {
      window.removeEventListener('touchstart', start)
      window.removeEventListener('touchend', end)
    }
  }, [next, prev])

  return { index, go, next, prev, overlay, setOverlay, notes, setNotes }
}
