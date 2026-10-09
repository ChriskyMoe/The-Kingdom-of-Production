import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Steps a counter from 0 to `total` on a timer (for animated flows/pipelines).
 * Reduced motion jumps straight to the end. Timers are cleared on unmount.
 */
export function useSteps(total: number, ms = 600, autoStart = true) {
  const reduce = useReducedMotion()
  const [step, setStep] = useState(autoStart && reduce ? total : 0)
  const [running, setRunning] = useState(autoStart && !reduce)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!running || step >= total) return
    timer.current = window.setTimeout(() => setStep((s) => s + 1), ms)
    return () => window.clearTimeout(timer.current)
  }, [running, step, total, ms])

  const replay = useCallback(() => {
    window.clearTimeout(timer.current)
    if (reduce) {
      setStep(total)
      return
    }
    setStep(0)
    setRunning(true)
  }, [reduce, total])

  return { step, running: running && step < total, replay, setStep }
}
