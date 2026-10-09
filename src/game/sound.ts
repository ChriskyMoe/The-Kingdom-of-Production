import { Howl, Howler } from 'howler'
import { useSyncExternalStore } from 'react'

/** Kenney CC0 sound effects (public/assets/sfx). */
const FILES = {
  start: 'start',
  levelup: 'levelup',
  victory: 'victory',
  fail: 'fail',
  boss: 'boss',
  save: 'save',
  select: 'select',
  error: 'error',
  glitch: 'glitch',
  whoosh: 'whoosh',
  step: 'step',
  coin: 'coin',
  door: 'door',
  sword: 'sword',
  hit: 'hit',
  page: 'page',
  latch: 'latch',
} as const
export type Sfx = keyof typeof FILES

const cache = new Map<Sfx, Howl>()
const KEY = 'git-quest-v2-sound'

let muted = true
try {
  muted = localStorage.getItem(KEY) !== 'on'
} catch {
  /* storage blocked: stay muted */
}
Howler.mute(muted)
const listeners = new Set<() => void>()

function howl(name: Sfx) {
  let h = cache.get(name)
  if (!h) {
    h = new Howl({ src: [`assets/sfx/${FILES[name]}.ogg`], volume: name === 'step' ? 0.35 : 0.6 })
    cache.set(name, h)
  }
  return h
}

/** Play a sound effect (silent while muted). */
export function sfx(name: Sfx) {
  if (muted) return
  howl(name).play()
}

export function setMuted(m: boolean) {
  muted = m
  Howler.mute(m)
  try {
    localStorage.setItem(KEY, m ? 'off' : 'on')
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l())
}

export const toggleMuted = () => setMuted(!muted)

export function useMuted() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => muted,
  )
}
