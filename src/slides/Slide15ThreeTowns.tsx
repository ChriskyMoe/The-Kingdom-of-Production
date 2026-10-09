import { useState } from 'react'
import { motion } from 'framer-motion'
import { CircleCheck, Clock, RotateCcw } from 'lucide-react'
import { Castle, House, Sprite } from '../game/Sprite'
import { fx } from '../game/fx'
import { sfx } from '../game/sound'
import { SlideLayout } from '../components/SlideLayout'

type EnvState = 'idle' | 'waiting' | 'deployed' | 'blocked'

const ENVS = [
  { name: 'Development', secret: 'DB_URL = dev-db…', rules: ['Any branch', 'No approval'] },
  { name: 'Staging', secret: 'DB_URL = staging-db…', rules: ['Only main', 'Verify here first'] },
  { name: 'Production', secret: 'DB_URL = prod-db…', rules: ['Only main', 'Required reviewer: @release-team', 'Wait timer (optional)'] },
]

export default function Slide15ThreeTowns() {
  const [st, setSt] = useState<EnvState[]>(['idle', 'idle', 'idle'])
  const [branch, setBranch] = useState<'main' | 'feature/x'>('main')
  const set = (i: number, v: EnvState) => {
    setSt((s) => s.map((x, j) => (j === i ? v : x)))
    if (v === 'deployed') {
      sfx(i === 2 ? 'victory' : 'coin')
      fx.burst(250 + i * 400, 330, i === 2 ? 'confetti' : 'sparkle', i === 2 ? 60 : 24)
    }
    if (v === 'blocked') {
      sfx('error')
      fx.shake(6)
    }
    if (v === 'waiting') sfx('latch')
  }

  const deploy = (i: number) => {
    if (i > 0 && branch !== 'main') return set(i, 'blocked')
    if (i > 0 && st[i - 1] !== 'deployed') return set(i, 'blocked')
    set(i, i === 2 ? 'waiting' : 'deployed')
  }

  return (
    <SlideLayout title="Three towns: environments" lead="Same code, different towns — each with its own keys and gate rules." badge="Deploy · approve">
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="pixel text-[17px] text-muted">Deploying from branch:</span>
          {(['main', 'feature/x'] as const).map((b) => (
            <button key={b} className="btn !py-1" aria-pressed={branch === b} onClick={() => setBranch(b)}>
              {b}
            </button>
          ))}
          <button className="btn ml-auto !py-1" onClick={() => setSt(['idle', 'idle', 'idle'])}>
            <RotateCcw size={14} /> Reset
          </button>
        </div>
        <div className="grid flex-1 grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-3">
          {ENVS.map((e, i) => (
            <Env
              key={e.name}
              env={e}
              state={st[i]}
              prod={i === 2}
              onDeploy={() => deploy(i)}
              onApprove={() => set(2, 'deployed')}
              reason={branch !== 'main' && i > 0 ? `Branch rule: only main can deploy to ${e.name}.` : `Deploy to ${ENVS[i - 1]?.name} first.`}
            />
          )).flatMap((el, i) => (i < 2 ? [el, <div key={`a${i}`} className="mono self-center text-[26px] text-faint" aria-hidden>→</div>] : [el]))}
        </div>
        <p className="pixel text-[14px] text-faint">
          Environment secrets, required reviewers and wait timers: free on public repos. For private repos, required reviewers and wait timers need GitHub Enterprise.
        </p>
      </div>
    </SlideLayout>
  )
}

function Env({
  env,
  state,
  prod,
  onDeploy,
  onApprove,
  reason,
}: {
  env: (typeof ENVS)[number]
  state: EnvState
  prod: boolean
  onDeploy: () => void
  onApprove: () => void
  reason: string
}) {
  const border = state === 'deployed' ? 'border-accent' : state === 'waiting' ? 'border-warn' : state === 'blocked' ? 'border-danger' : prod ? 'border-accent-2' : 'border-line'
  return (
    <motion.div className={`rpg flex flex-col px-4 py-3 ${border}`} animate={state === 'blocked' ? { x: [0, -5, 5, 0] } : {}}>
      <div className="relative flex h-[96px] items-end justify-center overflow-hidden border-[3px] border-[#0b0c16]" style={{ background: 'linear-gradient(#41a6f6,#73eff7)' }}>
        <div className="absolute right-0 bottom-0 left-0 h-3 bg-good" />
        {env.name === 'Development' && <House size={32} className="relative" />}
        {env.name === 'Staging' && (
          <div className="relative flex items-end gap-1">
            <House size={28} roof="gray" />
            <House size={28} />
          </div>
        )}
        {prod && <Castle size={24} width={6} className="relative" />}
        {state === 'deployed' && <Sprite name={prod ? 'flagGold' : 'flagGreen'} size={30} className="float absolute top-1 right-2" />}
      </div>
      <div className="head mt-2 text-[13px] text-accent-2">{env.name}</div>
      <div className="mono mt-2 flex items-center gap-2 border-2 border-[#0b0c16] bg-bg px-2 py-1 text-[13px] text-muted">
        <Sprite name="key" size={20} /> {env.secret.replace(/=.*/, '= ••••••••')}
      </div>
      <ul className="pixel mt-2 space-y-0.5 text-[16px] text-muted">
        {env.rules.map((r) => (
          <li key={r}>• {r}</li>
        ))}
      </ul>
      <div className="mt-auto pt-3">
        {state === 'idle' && (
          <button className="btn w-full justify-center" onClick={onDeploy}>
            ▶ Deploy
          </button>
        )}
        {state === 'deployed' && (
          <div className="head flex items-center gap-2 text-[11px] text-accent">
            <CircleCheck size={18} /> Deployed
          </div>
        )}
        {state === 'waiting' && (
          <div>
            <div className="pixel flex items-center gap-2 text-[16px] text-warn">
              <Clock size={16} /> Waiting for @release-team
            </div>
            <button className="btn btn-primary mt-2 w-full justify-center" onClick={onApprove}>
              Approve and deploy
            </button>
          </div>
        )}
        {state === 'blocked' && (
          <div className="pixel text-[16px] text-danger">
            ✕ Blocked. {reason}
            <button className="btn mt-2 w-full justify-center" onClick={onDeploy}>
              Try again
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
