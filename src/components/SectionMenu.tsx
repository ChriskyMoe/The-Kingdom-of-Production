import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { SlideDef } from '../slides/types'
import { RANKS } from '../data/levels'

type Props = { slides: SlideDef[]; index: number; onPick: (i: number) => void; onClose: () => void }

/** Level select screen: jump to any slide, grouped by rank. */
export function SectionMenu({ slides, index, onPick, onClose }: Props) {
  const groups = RANKS.map((name, rank) => ({
    name,
    rank,
    items: slides.map((s, i) => ({ s, i })).filter(({ s }) => s.rank === rank),
  })).filter((g) => g.items.length)
  return (
    <motion.div
      className="no-print absolute inset-0 z-40 bg-bg/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Level select"
    >
      <div className="absolute inset-x-14 top-9 bottom-14" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="pixel text-[30px]">
            World map <span className="mono ml-2 text-[14px] font-normal text-faint">click a slide to jump</span>
          </h3>
          <button className="btn" onClick={onClose} aria-label="Close menu">
            <X size={16} /> Esc
          </button>
        </div>
        <div className="mt-4 columns-4 gap-4">
          {groups.map((g) => (
            <div key={g.rank} className="panel mb-3 break-inside-avoid p-3">
              <div className="mono text-[12px] tracking-[0.14em] text-accent uppercase">
                LV {g.rank} · {g.name}
              </div>
              <ul className="mt-1">
                {g.items.map(({ s, i }) => (
                  <li key={s.id}>
                    <button
                      className={`w-full rounded px-1.5 py-0.5 text-left text-[14px] hover:bg-surface-2 ${i === index ? 'text-accent' : 'text-muted'}`}
                      onClick={() => onPick(i)}
                    >
                      <span className="mono mr-2 text-faint">{String(i + 1).padStart(2, '0')}</span>
                      {s.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
