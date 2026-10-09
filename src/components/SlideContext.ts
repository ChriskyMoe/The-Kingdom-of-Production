import { createContext, useContext } from 'react'
import type { SlideDef } from '../slides/types'

export const SlideContext = createContext<{ def: SlideDef; index: number; count: number } | null>(null)

export const useSlide = () => {
  const ctx = useContext(SlideContext)
  if (!ctx) throw new Error('useSlide must be used inside a slide')
  return ctx
}
