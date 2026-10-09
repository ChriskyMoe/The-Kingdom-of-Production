import type { Transition, Variants } from 'framer-motion'

/** Snappy HUD-style ease: quick in, soft settle. */
export const ease: Transition['ease'] = [0.22, 1, 0.36, 1]

/** Parent that staggers its children on slide entry. */
export const stagger = (gap = 0.12, delay = 0.1): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
})

/** Fade-up child, used with `stagger`. */
export const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
}

/** HUD "boot" pop for cards and nodes. */
export const pop: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease } },
}

export const slideTransition: Variants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease } },
  exit: { opacity: 0, x: -24, transition: { duration: 0.2 } },
}
