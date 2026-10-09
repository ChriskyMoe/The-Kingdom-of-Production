import { AnimatePresence, motion } from 'framer-motion'
import { RANKS } from '../data/levels'
import { Sprite } from '../game/Sprite'

/** Big RPG "LEVEL UP!" banner shown when the audience reaches a new rank. */
export function LevelUp({ rank, show }: { rank: number; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={rank}
          className="no-print pointer-events-none absolute inset-x-0 top-[38%] z-40 flex justify-center"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: [0.6, 1.12, 1] }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.45 }}
          role="status"
          aria-live="polite"
        >
          <div className="rpg flex items-center gap-5 px-8 py-5">
            <Sprite name={rank >= 2 ? 'heroKnight' : 'hero'} size={72} className="float" />
            <div>
              <div className="head text-[30px] text-accent" style={{ textShadow: '4px 4px 0 #0b0c16' }}>
                LEVEL UP!
              </div>
              <div className="head mt-3 text-[13px] text-accent-2">
                LV {rank} · {RANKS[rank]}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
