import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useSlide } from './SlideContext'
import { DemoMarker } from './DemoMarker'
import { rise, stagger } from '../animations/variants'

type Props = {
  title: string
  /** One-line idea under the title (keep it short). */
  lead?: ReactNode
  /** Interactive pill in the top right, e.g. "Press SAVE 1". */
  badge?: string
  children: ReactNode
  className?: string
  /** Remove the default padding so a scene can fill the whole stage. */
  bleed?: boolean
}

/** Game-screen slide: area banner, pixel title, action hint, body. */
export function SlideLayout({ title, lead, badge, children, className = '', bleed = false }: Props) {
  const { def } = useSlide()
  return (
    <motion.div className={`absolute inset-0 flex flex-col ${bleed ? '' : 'px-12 pt-7 pb-14'}`} variants={stagger(0.1, 0.05)} initial="hidden" animate="show">
      <motion.header variants={rise} className={`relative z-10 flex items-start justify-between gap-6 ${bleed ? 'px-12 pt-7' : ''}`}>
        <div className="min-w-0">
          <div className="head flex items-center gap-2 text-[10px] text-accent-2">
            <span className="inline-block h-2.5 w-2.5 bg-accent-2" aria-hidden />
            {def.area ?? def.chapter} · LV {def.rank}
          </div>
          <h2 className="head mt-3 truncate text-[24px] leading-tight text-text" style={{ textShadow: '3px 3px 0 #0b0c16' }}>
            {title}
          </h2>
          {lead && <p className="pixel mt-2 text-[20px] leading-snug text-muted">{lead}</p>}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2 pt-1">
          {badge && (
            <span className="chip border-accent-2 text-accent-2">
              <span className="blink" aria-hidden>
                ▶
              </span>
              {badge}
            </span>
          )}
          {def.demo && <DemoMarker compact text={def.demo} />}
        </div>
      </motion.header>
      <motion.div variants={rise} className={`relative mt-4 min-h-0 flex-1 ${className}`}>
        {children}
      </motion.div>
    </motion.div>
  )
}
