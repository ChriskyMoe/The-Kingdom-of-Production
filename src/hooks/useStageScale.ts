import { useEffect, useState } from 'react'

export const STAGE_W = 1280
export const STAGE_H = 720

/** Scale factor that fits the fixed 1280×720 stage into the window. */
export function useStageScale(reserveRight = 0) {
  const calc = () => Math.min((window.innerWidth - reserveRight) / STAGE_W, window.innerHeight / STAGE_H)
  const [scale, setScale] = useState(calc)
  useEffect(() => {
    const onResize = () => setScale(calc())
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reserveRight])
  return scale
}
