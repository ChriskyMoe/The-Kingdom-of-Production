import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Landscape, TreeLine } from '../game/Landscape'
import { Castle, House, Sprite } from '../game/Sprite'
import { Walker } from '../game/Walker'
import { Dialogue } from '../game/Dialogue'
import { fx } from '../game/fx'
import { setMuted, sfx } from '../game/sound'

/** Start screen: title over a pixel kingdom, PRESS START, then the elder asks the opening question. */
export default function Slide01Title() {
  const [step, setStep] = useState(0)
  const start = () => {
    setMuted(false)
    sfx('start')
    fx.burst(640, 470, 'sparkle', 40)
    setStep(1)
  }
  return (
    <div className="absolute inset-0">
      <Landscape className="absolute inset-0 !border-0 !outline-0" ground={150} sky="dusk">
        <TreeLine className="absolute bottom-[150px] left-0" names={['treeTall', 'tree', 'bush', 'treeRound', 'tree']} size={64} />
        <House className="absolute bottom-[150px] left-[330px]" size={56} />
        <Castle className="absolute right-[60px] bottom-[150px]" size={64} width={5} />
        <TreeLine className="absolute right-[390px] bottom-[150px]" names={['treeOrange', 'treeOrangeRound']} size={56} />
        <Walker name="hero" x={step === 0 ? 120 : 560} y={480} size={80} />
        <AnimatePresence>{step >= 1 && <Walker key="elder" name="elder" x={680} y={480} size={80} />}</AnimatePresence>
      </Landscape>

      <motion.div className="absolute inset-x-0 top-[70px] text-center" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="head text-[64px] leading-tight text-accent-2" style={{ textShadow: '6px 6px 0 #0b0c16, -2px -2px 0 #b13e53' }}>
          THE GIT QUEST
        </h1>
        <div className="head mt-3 text-[18px] text-text" style={{ textShadow: '3px 3px 0 #0b0c16' }}>
          II · THE KINGDOM OF PRODUCTION
        </div>
        <p className="pixel mt-4 text-[24px] text-text" style={{ textShadow: '2px 2px 0 #0b0c16' }}>
          From Save Points to AI Agents
        </p>
      </motion.div>

      <div className="absolute inset-x-0 top-[330px] flex justify-center">
        {step === 0 ? (
          <button className="btn btn-gold !px-8 !py-4 !text-[16px]" onClick={start}>
            <span className="blink">▶</span> PRESS START
          </button>
        ) : (
          <div className="rpg pixel flex gap-6 px-6 py-3 text-[19px]">
            <span>
              MISSION: <b className="text-accent-2">Ship a feature to production</b>
            </span>
            <span>
              CLASS: <b className="text-accent">New Developer</b>
            </span>
            <span className="flex items-center gap-1">
              <Sprite name="coin" size={22} /> 0 XP
            </span>
          </div>
        )}
      </div>

      <div className="absolute inset-x-12 bottom-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="q" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Dialogue speaker="elder" name="VILLAGE ELDER" text="Young developer… what happens if you change the production code, and something goes wrong?" />
              <button
                className="btn absolute -top-14 right-0"
                onClick={() => {
                  setStep(2)
                  sfx('save')
                  fx.burst(640, 600, 'magic', 40)
                }}
              >
                Answer ▶
              </button>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="a" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Dialogue speaker="elder" name="VILLAGE ELDER" tone="gold" text="No undo. No history. No backup. You need a SAVE SYSTEM. Your quest begins in the village." />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {step === 0 && (
        <div className="head no-print absolute inset-x-0 bottom-8 text-center text-[10px] text-muted">
          → next slide · S sound · ? controls · N notes
        </div>
      )}
    </div>
  )
}
