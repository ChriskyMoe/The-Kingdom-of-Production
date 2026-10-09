import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Sprite } from './Sprite'
import type { SpriteName } from './sprites'
import { sfx } from './sound'

type Props = {
  name: SpriteName
  /** Target position (left/top in px inside the scene). */
  x: number
  /** Top position. Use `bottom` instead to stand on a ground strip. */
  y?: number
  /** Distance from the bottom of the scene (e.g. the ground height). */
  bottom?: number
  size?: number
  /** Pixels per second. */
  speed?: number
  onArrive?: () => void
  label?: string
  /** Show a small shadow under the feet. */
  shadow?: boolean
  className?: string
  children?: React.ReactNode
}

/**
 * A character that walks (bobbing, facing the right way, with footsteps)
 * to whatever x/y it is given.
 */
export function Walker({ name, x, y = 0, bottom, size = 64, speed = 260, onArrive, label, shadow = true, className = '', children }: Props) {
  const reduce = useReducedMotion()
  // Track the previous target during render (React's "adjust state on prop change" pattern)
  const [last, setLast] = useState({ x, y })
  const [trip, setTrip] = useState({ duration: 0, flip: false, n: 0 })
  if (last.x !== x || last.y !== y) {
    const dx = x - last.x
    const dist = Math.hypot(dx, y - last.y)
    setLast({ x, y })
    setTrip((t) => ({ duration: reduce ? 0 : Math.max(0.25, dist / speed), flip: Math.abs(dx) > 2 ? dx < 0 : t.flip, n: t.n + 1 }))
  }
  const [moving, setMoving] = useState(false)
  const arrive = useRef(onArrive)
  useEffect(() => {
    arrive.current = onArrive
  })

  useEffect(() => {
    if (trip.n === 0) return
    const start = window.setTimeout(() => setMoving(true), 0)
    const step = window.setInterval(() => sfx('step'), 260)
    const end = window.setTimeout(() => {
      window.clearInterval(step)
      setMoving(false)
      arrive.current?.()
    }, trip.duration * 1000)
    return () => {
      window.clearTimeout(start)
      window.clearInterval(step)
      window.clearTimeout(end)
    }
  }, [trip])

  return (
    <motion.div
      className={`absolute ${className}`}
      initial={false}
      animate={bottom === undefined ? { left: x, top: y } : { left: x, bottom }}
      transition={{ duration: trip.duration, ease: 'linear' }}
      style={{ width: size }}
      aria-label={label}
    >
      {children}
      <div className={moving ? 'walk' : 'bob'} style={{ width: size, height: size }}>
        <Sprite name={name} size={size} flip={trip.flip} />
      </div>
      {shadow && <div className="mx-auto -mt-2 h-2 rounded-[50%] bg-black/40" style={{ width: size * 0.6 }} aria-hidden />}
    </motion.div>
  )
}
