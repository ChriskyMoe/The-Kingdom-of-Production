import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sprite } from '../game/Sprite'
import type { SpriteName } from '../game/sprites'
import { fx } from '../game/fx'
import { sfx } from '../game/sound'
import { SlideLayout } from '../components/SlideLayout'

type Level = 0 | 1 | 2
const LEVEL = ['off', 'read', 'write'] as const

const TOOLS: { name: string; icon: SpriteName; x: number; y: number }[] = [
  { name: 'GitHub', icon: 'chest', x: 130, y: 70 },
  { name: 'Database', icon: 'barrel', x: 380, y: 40 },
  { name: 'Browser', icon: 'target', x: 630, y: 70 },
  { name: 'Cloud', icon: 'factoryGray', x: 130, y: 330 },
  { name: 'Docs / API', icon: 'sign', x: 380, y: 360 },
  { name: 'Monitoring', icon: 'beehive', x: 630, y: 330 },
]
const C = { x: 380, y: 200 }

export default function Slide22ToolBelt() {
  const [lv, setLv] = useState<Level[]>([1, 0, 0, 0, 1, 0])
  const cycle = (i: number) => {
    const next = ((lv[i] + 1) % 3) as Level
    setLv((s) => s.map((v, j) => (j === i ? next : v)))
    sfx(next === 0 ? 'door' : next === 2 ? 'sword' : 'coin')
    fx.burst(80 + TOOLS[i].x * 1.08, 190 + TOOLS[i].y, next === 2 ? 'hit' : 'magic', 16)
    if (next === 2 && lv.filter((v) => v === 2).length >= 2) fx.shake(5)
  }
  const capability = lv.reduce<number>((s, v) => s + v, 0) / 12
  const risk = lv.reduce<number>((s, v) => s + (v === 2 ? 3 : v), 0) / 18

  return (
    <SlideLayout title="MCP: the agent's tool belt" lead="A standard way to plug tools into an AI agent — “like a USB-C port for AI”." badge="Equip: off → read → write">
      <div className="grid h-full grid-cols-[1fr_300px] gap-6">
        <div className="relative border-[3px] border-[#f4f4f4] outline outline-[3px] outline-[#0b0c16]" style={{ background: 'radial-gradient(circle at 50% 48%, #3d2f5e, #1a1c2c 70%)' }}>
          <svg viewBox="0 0 760 420" className="h-full w-full" aria-hidden>
            {TOOLS.map((t, i) => (
              <line
                key={t.name}
                x1={C.x}
                y1={C.y}
                x2={t.x}
                y2={t.y}
                strokeWidth={lv[i] === 2 ? 4 : 2.5}
                className={lv[i] ? 'march' : ''}
                style={{ stroke: lv[i] === 2 ? 'var(--warn)' : lv[i] === 1 ? 'var(--accent)' : 'var(--line)', opacity: lv[i] ? 1 : 0.6 }}
              />
            ))}
          </svg>
          <div className="absolute inset-0">
            <div
              className="rpg absolute grid h-[130px] w-[150px] -translate-x-1/2 -translate-y-1/2 place-items-center text-center"
              style={{ left: `${(C.x / 760) * 100}%`, top: `${(C.y / 420) * 100}%` }}
            >
              <div>
                <Sprite name="robot" size={64} className="bob mx-auto" />
                <div className="head mt-1 text-[10px] text-magic">AI AGENT</div>
                <div className="pixel text-[14px] text-muted">MCP client</div>
              </div>
            </div>
            {TOOLS.map((t, i) => (
              <motion.button
                key={t.name}
                onClick={() => cycle(i)}
                aria-label={`${t.name}: ${LEVEL[lv[i]]} access. Click to change.`}
                className={`absolute flex w-[160px] -translate-x-1/2 -translate-y-1/2 items-center gap-2 border-[3px] bg-[#262b52] px-2 py-1.5 ${
                  lv[i] === 2 ? 'border-warn' : lv[i] === 1 ? 'border-accent' : 'border-[#0b0c16]'
                }`}
                style={{ left: `${(t.x / 760) * 100}%`, top: `${(t.y / 420) * 100}%` }}
                whileTap={{ scale: 0.95 }}
              >
                <Sprite name={t.icon} size={40} style={{ filter: lv[i] ? undefined : 'grayscale(1) brightness(0.6)' }} />
                <span className="text-left">
                  <span className="pixel block text-[17px] text-text">{t.name}</span>
                  <span className={`head block text-[8px] uppercase ${lv[i] === 2 ? 'text-warn' : lv[i] === 1 ? 'text-accent' : 'text-faint'}`}>{LEVEL[lv[i]]}</span>
                </span>
              </motion.button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Meter label="POWER" value={capability} color="var(--accent)" />
          <Meter label="RISK" value={risk} color={risk > 0.5 ? 'var(--danger)' : 'var(--warn)'} />
          <div className="rpg pixel flex-1 px-4 py-3 text-[18px] leading-snug text-muted" aria-live="polite">
            {risk > 0.5 ? (
              <span className="text-danger">
                Lots of write access. Use <b>least privilege</b>, read-only modes, test environments and human approval for risky actions.
              </span>
            ) : (
              <>More tools = more the agent can do. Every tool you add is also something it can break or leak.</>
            )}
          </div>
          <p className="pixel text-[14px] leading-snug text-faint">
            GitHub’s official MCP server (remote: GA) supports configurable toolsets and a read-only mode.
          </p>
        </div>
      </div>
    </SlideLayout>
  )
}

function Meter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="head flex justify-between text-[9px] text-muted">
        <span>{label}</span>
        <span>{Math.round(value * 100)}%</span>
      </div>
      <div className="mt-1 h-4 overflow-hidden border-[3px] border-[#0b0c16] bg-[#333c57]" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)}>
        <motion.div className="h-full" style={{ background: color }} animate={{ width: `${value * 100}%` }} />
      </div>
    </div>
  )
}
