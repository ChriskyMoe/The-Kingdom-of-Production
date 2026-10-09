import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SlideLayout } from '../components/SlideLayout'
import { AgentFlow, type FlowStep } from '../components/AgentFlow'
import { Sprite } from '../game/Sprite'
import type { SpriteName } from '../game/sprites'
import { fx } from '../game/fx'
import { sfx } from '../game/sound'

const GENS: { name: string; tag: string; you: string; forms: SpriteName[]; steps: FlowStep[] }[] = [
  {
    name: 'Autocomplete',
    tag: 'finishes your line',
    you: 'You type. It suggests the next few lines.',
    forms: ['slime'],
    steps: [
      { label: 'Developer types', actor: 'human' },
      { label: 'AI suggestion', actor: 'ai' },
    ],
  },
  {
    name: 'Chat',
    tag: 'answers your question',
    you: 'You ask. It answers. You copy and paste.',
    forms: ['ghost'],
    steps: [
      { label: 'Developer', actor: 'human' },
      { label: 'Question', actor: 'human' },
      { label: 'AI answer', actor: 'ai' },
    ],
  },
  {
    name: 'Agent',
    tag: 'works toward your goal',
    you: 'You give a goal. It uses tools in a loop.',
    forms: ['robot'],
    steps: [
      { label: 'Goal', actor: 'human' },
      { label: 'Research', actor: 'ai' },
      { label: 'Plan', actor: 'ai' },
      { label: 'Edit', actor: 'ai' },
      { label: 'Run tests', actor: 'ai' },
      { label: 'Iterate', actor: 'ai' },
      { label: 'Create PR', actor: 'ai' },
    ],
  },
  {
    name: 'Agentic workflow',
    tag: 'part of the delivery system',
    you: 'Agents are wired into issues, CI and review.',
    forms: ['robot', 'robotBlue', 'factory'],
    steps: [
      { label: 'Issue', actor: 'human' },
      { label: 'Agent', actor: 'ai' },
      { label: 'Code', actor: 'ai' },
      { label: 'CI', actor: 'ci' },
      { label: 'Fix failures', actor: 'ai' },
      { label: 'PR updated', actor: 'ai' },
      { label: 'Human approval', actor: 'human' },
      { label: 'Deploy', actor: 'ci' },
    ],
  },
]

/** Monster-style evolution: autocomplete → chat → agent → agentic workflow. */
export default function Slide20Evolution() {
  const [g, setG] = useState(0)
  const [flash, setFlash] = useState(0)
  const evolve = (to: number) => {
    setG(to)
    setFlash((f) => f + 1)
    sfx(to > g ? 'levelup' : 'whoosh')
    fx.burst(640, 300, 'magic', 60)
  }
  const gen = GENS[g]
  return (
    <SlideLayout title="Evolution: AI agent ≠ autocomplete" lead="Four forms. Each evolution does more of the loop — and needs more checks." badge="Evolve!">
      <div className="flex h-full flex-col gap-3">
        <div className="grid grid-cols-4 gap-3">
          {GENS.map((x, i) => (
            <button key={x.name} onClick={() => evolve(i)} aria-pressed={g === i} className={`rpg flex flex-col items-center px-3 py-2 ${g === i ? '!border-magic' : 'opacity-70 hover:opacity-100'}`}>
              <span className="head text-[9px] text-magic">FORM {i + 1}</span>
              <span className="mt-1 flex h-[44px] items-end">
                {x.forms.map((f, k) => (
                  <Sprite key={k} name={f} size={i <= g ? 40 : 40} style={{ filter: i <= g ? undefined : 'brightness(0)' }} />
                ))}
              </span>
              <span className="head mt-1 text-[10px] text-text">{i <= g ? x.name : '???'}</span>
            </button>
          ))}
        </div>

        <div className="relative flex min-h-0 flex-1 items-center gap-8 border-[3px] border-[#f4f4f4] px-8 outline outline-[3px] outline-[#0b0c16]" style={{ background: 'radial-gradient(circle at 25% 50%, #5d3d8a, #1a1c2c 60%)' }}>
          <AnimatePresence>
            <motion.div key={flash} className="pointer-events-none absolute inset-0 bg-white" initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 0.6 }} />
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div key={g} className="flex shrink-0 items-end gap-1" initial={{ scale: 0.2, rotate: -20, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} exit={{ scale: 0.2, opacity: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>
              {gen.forms.map((f, k) => (
                <Sprite key={k} name={f} size={gen.forms.length > 1 ? 88 : 140} className="float" />
              ))}
            </motion.div>
          </AnimatePresence>
          <div className="min-w-0 flex-1">
            <div className="head text-[11px] text-magic">
              FORM {g + 1} · {gen.name.toUpperCase()}
            </div>
            <div className="head mt-2 text-[16px] text-accent-2">{gen.tag}</div>
            <p className="pixel mt-3 text-[22px] text-text">{gen.you}</p>
            <AgentFlow key={g} steps={gen.steps} progress={gen.steps.length} className="mt-4" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-gold" onClick={() => evolve((g + 1) % GENS.length)}>
            ✦ {g === GENS.length - 1 ? 'Start again' : 'Evolve!'}
          </button>
          <p className="pixel text-[18px] text-muted">
            More autonomy = more power. It also needs <b className="text-text">permissions, checks and review</b>.
          </p>
        </div>
      </div>
    </SlideLayout>
  )
}
