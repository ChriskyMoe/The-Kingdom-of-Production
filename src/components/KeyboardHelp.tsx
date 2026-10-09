import { motion } from 'framer-motion'
import { X } from 'lucide-react'

const KEYS: [string, string][] = [
  ['→  Space  PgDn', 'Next slide'],
  ['←  PgUp', 'Previous slide'],
  ['Home / End', 'First / last slide'],
  ['F', 'Fullscreen'],
  ['S', 'Sound on / off'],
  ['N', 'Presenter notes'],
  ['M', 'World map (all slides)'],
  ['?  H', 'This help'],
  ['Esc', 'Close overlay'],
]

export function KeyboardHelp({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="no-print absolute inset-0 z-40 grid place-items-center bg-bg/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard controls"
    >
      <div className="hud panel w-[480px] p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="pixel text-[22px]">Controls</h3>
          <button className="btn !px-2 !py-1" onClick={onClose} aria-label="Close help">
            <X size={16} />
          </button>
        </div>
        <dl className="mt-4 grid grid-cols-[170px_1fr] gap-y-2.5">
          {KEYS.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="mono text-[14px] text-accent">{k}</dt>
              <dd className="text-[15px] text-muted">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[13px] text-faint">
          Add <span className="mono">#12</span> to the URL to open slide 12. Add <span className="mono">?print</span> to print every slide.
        </p>
      </div>
    </motion.div>
  )
}
