import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SlideLayout } from '../components/SlideLayout'
import { AgentFlow, type FlowStep } from '../components/AgentFlow'
import { Landscape } from '../game/Landscape'
import { Walker } from '../game/Walker'
import { Dialogue } from '../game/Dialogue'
import { useSteps } from '../hooks/useSteps'
import { fx } from '../game/fx'
import { sfx } from '../game/sound'

const OLD: FlowStep[] = [
  { label: 'Human', actor: 'human' },
  { label: 'Write code', actor: 'human' },
  { label: 'Run tests', actor: 'human' },
  { label: 'Create PR', actor: 'human' },
  { label: 'Wait for review', actor: 'human' },
]
const NEW: FlowStep[] = [
  { label: 'Human', actor: 'human' },
  { label: 'Describe task', actor: 'human' },
  { label: 'Research', actor: 'ai' },
  { label: 'Plan', actor: 'ai' },
  { label: 'Code', actor: 'ai' },
  { label: 'Test', actor: 'ai' },
  { label: 'PR', actor: 'ai' },
  { label: 'Human review', actor: 'human' },
]

/** "A wild AI agent appeared!" — recruit it, then race the old solo workflow against the new party. */
export default function Slide19NpcJoins() {
  const [stage, setStage] = useState(0) // 0 nothing, 1 appeared, 2 recruited
  const oldRun = useSteps(OLD.length, 1100, false)
  const newRun = useSteps(NEW.length, 420, false)

  const appear = () => {
    setStage(1)
    sfx('glitch')
    fx.burst(900, 330, 'magic', 50)
  }
  const recruit = () => {
    setStage(2)
    sfx('levelup')
    fx.burst(640, 330, 'confetti', 60)
    oldRun.replay()
    newRun.replay()
  }

  return (
    <SlideLayout title="A wild AI agent appeared!" lead="A new party member can take a quest from start to PR." badge={stage < 2 ? 'Recruit the NPC' : 'Replay the race'}>
      <div className="flex h-full flex-col gap-3">
        <Landscape className="h-[250px] shrink-0" ground={60} sky="day">
          <Walker name="heroKnight" x={stage === 2 ? 470 : 300} bottom={60} size={64} />
          <AnimatePresence>
            {stage >= 1 && (
              <motion.div key="r" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}>
                <Walker name="robot" x={stage === 2 ? 560 : 860} bottom={60} size={64}>
                  <div className="head text-center text-[7px] text-magic">AI AGENT</div>
                </Walker>
              </motion.div>
            )}
          </AnimatePresence>
          {stage === 0 && (
            <button className="btn btn-gold absolute top-1/2 right-[120px] -translate-y-1/2" onClick={appear}>
              ? Something approaches…
            </button>
          )}
          {stage === 1 && (
            <button className="btn btn-primary absolute top-6 right-6" onClick={recruit}>
              ★ Recruit to party
            </button>
          )}
          {stage === 2 && (
            <button
              className="btn absolute top-6 right-6"
              onClick={() => {
                oldRun.replay()
                newRun.replay()
              }}
            >
              ↺ Replay race
            </button>
          )}
        </Landscape>

        {stage < 2 ? (
          <Dialogue
            speaker={stage === 0 ? 'heroKnight' : 'robot'}
            name={stage === 0 ? 'YOU' : 'AI AGENT'}
            tone={stage === 0 ? 'normal' : 'magic'}
            text={
              stage === 0
                ? 'Until now I did every step myself: write code, run tests, open the PR, wait…'
                : 'Hello! I’m an AI agent. Give me a quest — I can research, plan, code, test and open a PR. You stay the leader.'
            }
          />
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-3">
            <Lane title="SOLO (OLD WAY)" sub="A human does every step" steps={OLD} progress={oldRun.step} />
            <Lane title="PARTY (NEW WAY)" sub="Humans start and finish; the agent does the middle" steps={NEW} progress={newRun.step} magic />
          </div>
        )}
      </div>
    </SlideLayout>
  )
}

function Lane({ title, sub, steps, progress, magic }: { title: string; sub: string; steps: FlowStep[]; progress: number; magic?: boolean }) {
  return (
    <div className={`rpg px-4 py-2.5 ${magic ? '!border-magic' : ''}`}>
      <div className="flex items-baseline gap-3">
        <span className={`head text-[10px] ${magic ? 'text-magic' : 'text-info'}`}>{title}</span>
        <span className="pixel text-[16px] text-muted">{sub}</span>
        <span className="head ml-auto text-[9px] text-faint">
          {Math.min(progress, steps.length)}/{steps.length}
        </span>
      </div>
      <AgentFlow steps={steps} progress={progress} className="mt-2" />
    </div>
  )
}
