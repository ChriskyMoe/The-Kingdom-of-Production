import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SlideLayout } from '../components/SlideLayout'
import { usePipeline } from '../components/Pipeline'
import { Landscape } from '../game/Landscape'
import { Sprite } from '../game/Sprite'
import { fx } from '../game/fx'
import { sfx } from '../game/sound'

const STAGES = ['Install', 'Lint', 'Type check', 'Unit tests', 'Integration', 'Build', 'Security']
const CMDS = ['npm ci', 'npm run lint', 'tsc --noEmit', 'npm test', 'npm run test:int', 'npm run build', 'CodeQL · deps']
const X0 = 40
const GAP = 160

/** CI as a forge: seven automatons test your sword on a conveyor belt. Break a test and the forge smokes. */
export default function Slide12AutomatonForge() {
  const [broken, setBroken] = useState(false)
  const { statuses, run } = usePipeline(STAGES.length, 620)
  const last = useRef<string>('')
  const active = Math.max(0, statuses.findLastIndex((s) => s !== 'pending' && s !== 'skipped'))
  const failed = statuses.includes('failed')
  const finished = statuses.every((s) => s === 'passed' || s === 'failed' || s === 'skipped')

  useEffect(() => {
    const key = statuses.join()
    if (key === last.current) return
    last.current = key
    const i = statuses.findLastIndex((s) => s === 'passed' || s === 'failed')
    if (i < 0) return
    const x = X0 + 70 + i * GAP + 50
    if (statuses[i] === 'failed') {
      sfx('error')
      fx.burst(x, 330, 'smoke', 30)
      fx.burst(x, 330, 'hit', 20)
      fx.shake(10)
    } else if (statuses[i] === 'passed') {
      sfx('latch')
      fx.burst(x, 330, 'sparkle', 10)
      if (i === STAGES.length - 1) {
        sfx('victory')
        fx.burst(640, 300, 'confetti', 70)
      }
    }
  }, [statuses])

  return (
    <SlideLayout title="The automaton forge: CI" lead="“What if nobody remembers to run the tests?” → Continuous Integration." badge="Run CI · break a test">
      <div className="flex h-full flex-col gap-3">
        <Landscape className="h-[340px] shrink-0" sky="cave" ground={60} groundTile="floor">
          {/* conveyor belt */}
          <div className="absolute right-0 bottom-[60px] left-0 h-[18px] border-y-[3px] border-[#0b0c16] bg-[#566c86]" style={{ backgroundImage: 'repeating-linear-gradient(90deg,#566c86 0 18px,#333c57 18px 22px)' }} aria-hidden />
          {STAGES.map((s, i) => {
            const st = statuses[i]
            return (
              <div key={s} className="absolute bottom-[78px] flex w-[110px] flex-col items-center" style={{ left: X0 + i * GAP }}>
                <motion.div animate={st === 'running' ? { y: [0, -8, 0] } : st === 'failed' ? { rotate: [0, -10, 10, 0] } : {}} transition={{ duration: 0.4, repeat: st === 'running' ? Infinity : 0 }}>
                  <Sprite name={st === 'failed' ? 'crab' : 'robotGray'} size={76} style={{ filter: st === 'passed' ? 'drop-shadow(0 0 6px #a7f070)' : undefined }} />
                </motion.div>
                <span className="head mt-1 text-center text-[8px] leading-tight text-text">{s}</span>
                <span className={`head mt-1 text-[8px] ${st === 'passed' ? 'text-accent' : st === 'failed' ? 'text-danger' : st === 'running' ? 'text-accent-2' : 'text-faint'}`}>
                  {st === 'passed' ? '✓ PASS' : st === 'failed' ? '✕ FAIL' : st === 'running' ? '… TEST' : st === 'skipped' ? 'SKIP' : 'WAIT'}
                </span>
              </div>
            )
          })}
          {/* the sword (your PR) riding the belt */}
          <motion.div className="absolute bottom-[70px]" animate={{ left: X0 + 70 + active * GAP }} transition={{ duration: 0.4 }}>
            <Sprite name="swordBig" size={40} className={failed ? '' : 'shine'} style={{ transform: 'rotate(90deg)' }} />
          </motion.div>
          <div className="mono absolute top-3 left-3 bg-[#0b0c16]/80 px-2 py-1 text-[13px] text-muted">PR #43 · {CMDS[active]}</div>
          <AnimatePresence>
            {finished && (
              <motion.div
                className={`head absolute top-10 left-1/2 -translate-x-1/2 border-[3px] border-[#0b0c16] px-5 py-3 text-[22px] ${failed ? 'bg-danger text-text' : 'bg-accent text-[#0b0c16]'}`}
                initial={{ scale: 0, rotate: -8 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ opacity: 0 }}
              >
                {failed ? '✕ CI FAILED' : '✓ CI PASSED'}
              </motion.div>
            )}
          </AnimatePresence>
        </Landscape>
        <div className="flex items-center gap-3">
          <button className="btn btn-primary" onClick={() => run(broken ? 3 : null)}>
            ▶ Run CI on PR #43
          </button>
          <button className={`btn ${broken ? 'btn-red' : ''}`} onClick={() => setBroken((b) => !b)} aria-pressed={broken}>
            🐞 {broken ? 'Test is broken' : 'Break a test'}
          </button>
        </div>
        <div className="rpg flex-1 px-5 py-3">
          <div className="head text-[11px] text-accent-2">CONTINUOUS INTEGRATION</div>
          <p className="pixel mt-2 text-[20px] text-text">
            {finished
              ? failed
                ? 'Unit tests failed → the PR cannot merge. Fix it, push again, and the forge re-runs automatically.'
                : 'Every check is green → reviewers can focus on the logic, not on “did you run the tests?”.'
              : 'Every push and every PR runs the same checks automatically. Nobody has to remember.'}
          </p>
        </div>
      </div>
    </SlideLayout>
  )
}
