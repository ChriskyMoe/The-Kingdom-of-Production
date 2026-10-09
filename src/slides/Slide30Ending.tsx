import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Landscape } from '../game/Landscape'
import { Castle, Sprite } from '../game/Sprite'
import type { SpriteName } from '../game/sprites'
import { fx } from '../game/fx'
import { sfx } from '../game/sound'

const LINES: { icon: SpriteName; a: string; b: string }[] = [
  { icon: 'crystal', a: 'Git is your', b: 'save system' },
  { icon: 'barrel', a: 'GitHub is your', b: 'multiplayer world' },
  { icon: 'robotGray', a: 'CI/CD is your', b: 'automation engine' },
  { icon: 'shield', a: 'Security is your', b: 'defense system' },
  { icon: 'robot', a: 'AI agents are your', b: 'teammates' },
  { icon: 'heroKnight', a: 'Humans are still the', b: 'players' },
]
const FINAL = [
  ['Git', 'gives us', 'history'],
  ['GitHub', 'gives us', 'collaboration'],
  ['CI/CD', 'gives us', 'automation'],
  ['Security', 'gives us', 'control'],
  ['AI agents', 'give us', 'leverage'],
  ['Humans', 'provide', 'judgment'],
]

/** Ending: the party enters the castle; the lessons roll like game credits; the final question. */
export default function Slide30Ending() {
  const [claimed, setClaimed] = useState(false)
  const claim = () => {
    setClaimed(true)
    sfx('victory')
    fx.burst(400, 200, 'confetti', 80)
    fx.burst(900, 200, 'confetti', 80)
  }
  return (
    <div className="absolute inset-0">
      <Landscape className="absolute inset-0 !border-0 !outline-0" sky="dusk" ground={110}>
        <Castle className="absolute right-[60px] bottom-[110px]" size={56} width={6} open />
        <div className="absolute right-[440px] bottom-[110px] flex gap-1">
          <Sprite name="heroKnight" size={64} className="bob" />
          <Sprite name="robot" size={64} className="bob" />
          <Sprite name="girl" size={64} className="bob" />
          <Sprite name="viking" size={64} className="bob" />
        </div>
      </Landscape>
      <div className="absolute top-7 left-12">
        <div className="head text-[10px] text-accent-2">■ FINAL LEVEL · LV 10</div>
        <h2 className="head mt-3 text-[26px] text-accent" style={{ textShadow: '4px 4px 0 #0b0c16' }}>
          QUEST COMPLETE
        </h2>
      </div>
      <motion.ul className="rpg absolute top-[110px] left-12 w-[560px] space-y-2 px-5 py-4" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.35 } } }}>
        {LINES.map((l) => (
          <motion.li key={l.b} className="flex items-center gap-3" variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}>
            <Sprite name={l.icon} size={36} />
            <span className="pixel text-[22px] text-muted">
              {l.a} <b className="text-text">{l.b}</b>.
            </span>
          </motion.li>
        ))}
      </motion.ul>
      <div className="rpg absolute top-[110px] right-12 w-[520px] px-5 py-4">
        <AnimatePresence mode="wait">
          {!claimed ? (
            <motion.div key="q" exit={{ opacity: 0 }}>
              <div className="head text-[9px] text-accent-2">ONE LAST QUESTION</div>
              <p className="pixel mt-2 text-[24px] leading-snug text-text">If an AI agent can write the code, what should the human developer become?</p>
              <button className="btn btn-gold mt-4" onClick={claim}>
                ★ Claim the final reward
              </button>
            </motion.div>
          ) : (
            <motion.div key="a" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.15 } } }}>
              {FINAL.map(([who, verb, what]) => (
                <motion.p key={who} className="pixel text-[21px] text-muted" variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
                  <b className="text-text">{who}</b> {verb} <b className="text-accent">{what}</b>.
                </motion.p>
              ))}
              <motion.p className="pixel mt-2 border-t-2 border-line pt-2 text-[20px] text-text" variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
                Together, they create a <b className="text-accent-2">modern software delivery system.</b>
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="head absolute bottom-16 left-12 text-[10px] text-text" style={{ textShadow: '2px 2px 0 #0b0c16' }}>
        THANK YOU FOR PLAYING · QUESTIONS?
      </div>
    </div>
  )
}
