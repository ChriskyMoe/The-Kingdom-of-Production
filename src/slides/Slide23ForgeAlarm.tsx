import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SlideLayout } from '../components/SlideLayout'
import { AgentFlow, ActorLegend, type FlowStep } from '../components/AgentFlow'
import { Landscape } from '../game/Landscape'
import { Sprite } from '../game/Sprite'
import { Walker } from '../game/Walker'
import { useSteps } from '../hooks/useSteps'
import { fx } from '../game/fx'
import { sfx } from '../game/sound'

const TRAD: FlowStep[] = [
  { label: 'Code', actor: 'human' },
  { label: 'CI', actor: 'ci' },
  { label: '✕ FAIL', actor: 'ci', bad: true },
  { label: 'Human investigates', detail: 'reads logs, reproduces, fixes', actor: 'human' },
]
const AGENT: FlowStep[] = [
  { label: 'Code', actor: 'human' },
  { label: 'CI', actor: 'ci' },
  { label: '✕ FAIL', actor: 'ci', bad: true },
  { label: 'Agent investigates', actor: 'ai' },
  { label: 'Root cause', actor: 'ai' },
  { label: 'Prepares fix', actor: 'ai' },
  { label: 'Runs tests', actor: 'ci' },
  { label: 'Updates PR', actor: 'ai' },
  { label: 'Human reviews', actor: 'human' },
]
// where the robot stands at each agent step (scene x)
const ROBOT_X = [980, 980, 980, 320, 320, 560, 560, 820, 820]
const BUBBLE = ['', '', 'ALARM!', 'Reading the CI log…', 'Found it: null user in login()', 'Writing a fix + test', 'npm test ✓ 4 passed', 'Pushed to PR #43', '']

/** The forge alarm rings. Traditional: the hero digs alone. Agent-assisted: the NPC investigates and updates the PR; the human reviews. */
export default function Slide23ForgeAlarm() {
  const [mode, setMode] = useState<'trad' | 'agent'>('agent')
  const steps = mode === 'trad' ? TRAD : AGENT
  const sim = useSteps(steps.length, 750, true)
  const s = sim.step
  const failed = s >= 3
  const fixed = mode === 'agent' && s >= 7

  useEffect(() => {
    if (s === 3) {
      sfx('error')
      fx.burst(330, 330, 'smoke', 30)
      fx.shake(6)
    }
    if (mode === 'agent' && s === 7) sfx('latch')
    if (mode === 'agent' && s === 9) {
      sfx('victory')
      fx.burst(860, 320, 'sparkle', 30)
    }
  }, [s, mode])

  const pick = (m: 'trad' | 'agent') => {
    setMode(m)
    sim.replay()
  }
  const robotX = ROBOT_X[Math.max(0, s - 1)]

  return (
    <SlideLayout title="Alarm at the forge: CI fails" lead="Automation finds the failure. The agent investigates. A human decides." badge="Switch mode · replay">
      <div className="flex h-full flex-col gap-3">
        <Landscape className="h-[230px] shrink-0" sky="cave" ground={50} groundTile="floor">
          <div className="absolute bottom-[50px] left-[280px] flex flex-col items-center">
            <Sprite name={failed && !fixed ? 'crab' : 'robotGray'} size={64} className={failed && !fixed ? 'walk' : ''} />
            <span className={`head text-[8px] ${failed && !fixed ? 'text-danger' : 'text-accent'}`}>{failed && !fixed ? 'CI ✕' : 'CI'}</span>
          </div>
          <Sprite name="anvil" size={52} className="absolute bottom-[50px] left-[540px]" />
          <div className="absolute bottom-[50px] left-[780px] flex flex-col items-center">
            <Sprite name="knight" size={56} />
            <span className="head text-[8px] text-text">PR #43</span>
          </div>
          {mode === 'agent' && (
            <Walker name="robot" x={robotX} y={110} size={60} speed={500}>
              <AnimatePresence mode="wait">
                {BUBBLE[s - 1] && (
                  <motion.div key={s} className="pixel absolute -top-9 left-1/2 -translate-x-1/2 border-2 border-[#0b0c16] bg-text px-2 text-[14px] whitespace-nowrap text-[#0b0c16]" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    {BUBBLE[s - 1]}
                  </motion.div>
                )}
              </AnimatePresence>
            </Walker>
          )}
          <Walker name="heroKnight" x={mode === 'trad' && s >= 4 ? 380 : 1080} y={110} size={60} speed={300}>
            {mode === 'trad' && s >= 4 && <div className="pixel absolute -top-9 left-1/2 -translate-x-1/2 border-2 border-[#0b0c16] bg-text px-2 text-[14px] whitespace-nowrap text-[#0b0c16]">Reading 2,000 log lines…</div>}
            {mode === 'agent' && s >= 9 && <div className="head absolute -top-8 left-1/2 -translate-x-1/2 bg-accent px-1 text-[8px] text-[#0b0c16]">REVIEW ✓</div>}
          </Walker>
        </Landscape>
        <div className="flex items-center gap-3">
          <div className="flex border-[3px] border-[#0b0c16]" role="group" aria-label="Workflow">
            <button className={`btn !border-0 ${mode === 'trad' ? 'btn-primary' : ''}`} onClick={() => pick('trad')} aria-pressed={mode === 'trad'}>
              Traditional
            </button>
            <button className={`btn !border-0 ${mode === 'agent' ? 'btn-primary' : ''}`} onClick={() => pick('agent')} aria-pressed={mode === 'agent'}>
              Agent-assisted
            </button>
          </div>
          <button className="btn" onClick={sim.replay}>
            ↺ Replay
          </button>
          <div className="ml-auto">
            <ActorLegend />
          </div>
        </div>
        <div className="rpg px-4 py-3">
          <AgentFlow steps={steps} progress={s} />
        </div>
        <div className="rpg pixel flex items-center gap-3 px-4 py-2 text-[18px] !border-danger">
          <Sprite name="lock" size={28} />
          <p>
            The agent <b className="text-accent-2">updates the PR</b>. It does <b className="text-danger">not</b> deploy its own fix to production — merge and deploy stay behind review and protected environments.
          </p>
        </div>
      </div>
    </SlideLayout>
  )
}
