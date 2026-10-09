import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SlideLayout } from '../components/SlideLayout'
import { Landscape } from '../game/Landscape'
import { Castle, Sprite } from '../game/Sprite'
import { Walker } from '../game/Walker'
import { Dialogue } from '../game/Dialogue'
import { fx } from '../game/fx'
import { sfx } from '../game/sound'

type Path = 'ask' | 'review' | 'blind'
const CHECKS = ['Does it meet the goal?', 'Does it behave correctly?', 'Is it secure?', 'Is the risk acceptable?']

/**
 * Story scene (replaces V1's quiz): the AI companion asks to open the gate to production.
 * Review first → the gate opens safely. Let it in blind → a bug sneaks in with it.
 */
export default function Slide24GateOfTrust() {
  const [path, setPath] = useState<Path>('ask')
  const [ticks, setTicks] = useState(0)
  const [gateOpen, setGateOpen] = useState(false)

  useEffect(() => {
    if (path !== 'review') return
    if (ticks < CHECKS.length) {
      const t = window.setTimeout(() => {
        setTicks((n) => n + 1)
        sfx('coin')
      }, 650)
      return () => window.clearTimeout(t)
    }
    const t = window.setTimeout(() => {
      setGateOpen(true)
      sfx('door')
      window.setTimeout(() => {
        sfx('victory')
        fx.burst(240, 330, 'confetti', 60)
      }, 500)
    }, 400)
    return () => window.clearTimeout(t)
  }, [path, ticks])

  useEffect(() => {
    if (path !== 'blind') return
    sfx('door')
    const t = window.setTimeout(() => {
      sfx('fail')
      fx.shake(14)
      fx.burst(200, 330, 'smoke', 40)
      fx.text(240, 260, 'A BUG GOT IN!', '#ff5a6a')
    }, 1500)
    return () => window.clearTimeout(t)
  }, [path])

  const choose = (p: Path) => {
    setTicks(0)
    setGateOpen(p === 'blind')
    setPath(p)
    sfx('select')
  }

  const robotX = path === 'ask' ? 520 : gateOpen ? 150 : 400
  return (
    <SlideLayout title="The gate of trust" lead="AI can accelerate execution. Humans remain responsible for important decisions." badge="Choose what the leader does">
      <div className="flex h-full flex-col gap-3">
        <Landscape className="h-[230px] shrink-0" ground={50} sky={path === 'blind' ? 'dusk' : 'day'}>
          <Castle className="absolute bottom-[50px] left-[40px]" size={44} width={5} open={gateOpen} />
          <span className="head absolute bottom-[16px] left-[90px] text-[9px] text-text">PRODUCTION</span>
          <Walker name="robot" x={robotX} y={110} size={60} speed={260}>
            <div className="head text-center text-[7px] text-magic">AI AGENT</div>
          </Walker>
          <Walker name="heroKnight" x={path === 'review' ? 480 : 720} y={110} size={60} speed={260}>
            <div className="head text-center text-[7px] text-info">YOU</div>
          </Walker>
          <AnimatePresence>
            {path === 'blind' && (
              <motion.div key="bug" className="absolute bottom-[50px]" initial={{ left: 1150 }} animate={{ left: 330 }} transition={{ duration: 1.5, ease: 'linear' }}>
                <Sprite name="bug" size={56} className="walk" flip />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {path === 'review' && (
              <motion.div className="rpg absolute top-3 right-3 w-[360px] px-4 py-2" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="head text-[9px] text-info">YOUR REVIEW</div>
                {CHECKS.map((c, i) => (
                  <div key={c} className={`pixel text-[17px] ${i < ticks ? 'text-accent' : 'text-faint'}`}>
                    {i < ticks ? '☑' : '☐'} {c}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </Landscape>

        {path === 'ask' && (
          <div className="flex flex-col gap-3">
            <Dialogue speaker="robot" name="AI AGENT" tone="magic" text="I wrote the fix and the tests pass. May I open the gate to production?" />
            <div className="flex gap-3">
              <button className="btn btn-primary flex-1 justify-center !py-4 !text-[13px]" onClick={() => choose('review')}>
                ▶ “Show me first. I’ll review it.”
              </button>
              <button className="btn btn-red flex-1 justify-center !py-4 !text-[13px]" onClick={() => choose('blind')}>
                ▶ “Sure, go straight in.”
              </button>
            </div>
          </div>
        )}
        {path === 'blind' && (
          <div className="flex flex-col gap-3">
            <Dialogue speaker="bug" name="PRODUCTION BUG" tone="danger" text="Hehehe. Nobody checked the change… so I walked right in with it." />
            <button className="btn self-start" onClick={() => choose('ask')}>
              ↺ Try again
            </button>
          </div>
        )}
        {path === 'review' && (
          <div className="grid flex-1 grid-cols-2 gap-4">
            <div className="rpg px-4 py-3 !border-magic">
              <div className="head flex items-center gap-2 text-[10px] text-magic">
                <Sprite name="robot" size={28} /> AI PARTY MEMBER
              </div>
              <p className="pixel mt-2 text-[19px] text-text">researches · plans · writes code · runs tests · proposes changes</p>
            </div>
            <div className="rpg px-4 py-3 !border-info">
              <div className="head flex items-center gap-2 text-[10px] text-info">
                <Sprite name="heroKnight" size={28} /> HUMAN LEADER
              </div>
              <p className="pixel mt-2 text-[19px] text-text">defines goals · reviews architecture, behaviour and security · evaluates risk · approves important changes</p>
            </div>
            <button className="btn col-span-2 self-start justify-self-start" onClick={() => choose('ask')}>
              ↺ Replay the scene
            </button>
          </div>
        )}
      </div>
    </SlideLayout>
  )
}
