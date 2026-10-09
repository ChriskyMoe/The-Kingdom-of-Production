import { useEffect } from 'react'
import { Landscape } from '../game/Landscape'
import { Sprite } from '../game/Sprite'
import { Walker } from '../game/Walker'
import { fx } from '../game/fx'
import { sfx } from '../game/sound'
import { SlideLayout } from '../components/SlideLayout'
import { QuestCard } from '../components/QuestCard'
import { AgentFlow, type FlowStep } from '../components/AgentFlow'
import { useSteps } from '../hooks/useSteps'

const STEPS: (FlowStep & { log: string })[] = [
  { label: 'Issue', actor: 'human', log: '#7 Add a loading state to the login button and create a test' },
  { label: 'AI agent', actor: 'ai', log: 'agent> starting on branch agent/login-loading' },
  { label: 'Research repo', actor: 'ai', log: 'agent> read components/LoginButton.tsx, tests/LoginButton.test.tsx' },
  { label: 'Plan', actor: 'ai', log: 'agent> plan: add `loading` prop → disable button + show "Signing in…" → add test' },
  { label: 'Edit', actor: 'ai', log: 'agent> edited 2 files (+18 −3)' },
  { label: 'Test', actor: 'ci', log: '$ npm test   ✓ 4 passed' },
  { label: 'CI', actor: 'ci', log: 'GitHub Actions: lint ✓  test ✓  build ✓' },
  { label: 'Pull Request', actor: 'ai', log: 'PR #8 “Add loading state to LoginButton” · Closes #7' },
  { label: 'Human review', actor: 'human', log: 'you> reviewed the diff, tried it in the preview, approved ✓' },
]

export default function Slide25LiveQuest() {
  const sim = useSteps(STEPS.length, 650, false)
  const shown = STEPS.slice(0, sim.step)
  useEffect(() => {
    if (sim.step === 0) return
    sfx(sim.step === STEPS.length ? 'victory' : 'select')
    if (sim.step === STEPS.length) fx.burst(1080, 300, 'confetti', 60)
  }, [sim.step])
  return (
    <SlideLayout title="The agent’s quest" lead="Our AI party member takes a real quest — then we review its work." badge="Start the quest">
      <div className="flex h-full flex-col gap-4">
        <div className="grid grid-cols-[1fr_auto] items-center gap-5">
          <QuestCard title="Add a loading state to the login button and create a test." className="!p-4" />
          <button className="btn btn-primary !px-6 !py-4 !text-[14px]" onClick={sim.replay}>
            ▶ Start the quest
          </button>
        </div>
        <Landscape className="h-[120px] shrink-0" ground={36} clouds={false}>
          {[['sign', 40], ['chest', 230], ['anvil', 470], ['robotGray', 700], ['knight', 960]].map(([n, x]) => (
            <Sprite key={n as string} name={n as 'sign'} size={40} className="absolute bottom-[36px]" style={{ left: x as number }} />
          ))}
          <Walker name="robot" x={90 + Math.min(sim.step, 8) * 112} y={30} size={52} speed={400} />
          <Walker name="heroKnight" x={sim.step >= STEPS.length ? 1040 : 1100} y={30} size={52} />
        </Landscape>
        <AgentFlow steps={STEPS} progress={sim.step} />
        <div className="rpg mono flex-1 overflow-hidden px-4 py-2 text-[14px] leading-relaxed" aria-live="polite">
          <div className="head mb-1 text-[8px] text-faint">QUEST LOG (EXAMPLE RUN)</div>
          {shown.length === 0 && <div className="text-faint">Press “Start the quest”.</div>}
          {shown.map((s) => (
            <div key={s.label} className={s.actor === 'ai' ? 'text-magic' : s.actor === 'ci' ? 'text-accent' : 'text-info'}>
              {s.log}
            </div>
          ))}
        </div>
      </div>
    </SlideLayout>
  )
}
