import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, ShieldCheck } from 'lucide-react'
import { SlideLayout } from '../components/SlideLayout'
import { SECURITY_TREE } from '../data/skillTree'
import { Sprite } from '../game/Sprite'
import type { SpriteName } from '../game/sprites'
import { fx, stagePoint } from '../game/fx'
import { sfx } from '../game/sound'

const ICONS: SpriteName[] = ['robotBlue', 'potionGreen', 'key', 'staff', 'crystal', 'sign']

// Indexes into SECURITY_TREE, grouped by what they protect
const COLUMNS = [
  { name: 'Dependencies', items: [0, 1] },
  { name: 'Your code', items: [3, 4] },
  { name: 'Secrets & disclosure', items: [2, 5] },
]

export default function Slide17SecurityTree() {
  const [open, setOpen] = useState<Set<number>>(new Set())
  const [sel, setSel] = useState<number | null>(null)
  const [priv, setPriv] = useState(false)
  const pick = (i: number, el?: Element) => {
    if (!open.has(i)) {
      sfx('coin')
      const p = stagePoint(el ?? null)
      fx.burst(p.x, p.y, 'magic', 24)
    } else sfx('select')
    setOpen((s) => new Set(s).add(i))
    setSel(i)
  }
  const cost = (i: number) => {
    const st = SECURITY_TREE[i].status
    if (priv && SECURITY_TREE[i].name === 'Security advisories') return { text: 'Public repos only', cls: 'border-faint text-muted' }
    if (!priv || st.includes('ga')) return { text: 'Free', cls: 'border-accent text-accent' }
    return { text: i === 2 ? 'Secret Protection (paid)' : 'Code Security (paid)', cls: 'border-info text-info' }
  }

  return (
    <SlideLayout title="Security skill tree" lead="Automatic guards that watch your code and dependencies." badge="Unlock skills · switch repo type">
      <div className="grid h-full grid-cols-[1fr_330px] gap-6">
        <div className="flex flex-col items-center">
          <div className="flex w-[230px] items-center justify-center gap-2 rounded-xl border-2 border-accent bg-surface py-3">
            <ShieldCheck className="text-accent" size={26} aria-hidden />
            <span className="head text-[16px] text-accent">SECURITY</span>
          </div>
          <span className="h-5 w-0.5 bg-accent" aria-hidden />
          <div className="grid w-full grid-cols-3 gap-6">
            {COLUMNS.map((col, ci) => (
              <div key={col.name} className="relative flex flex-col items-center">
                {/* bus line joining the three columns */}
                <span className={`absolute top-0 h-0.5 bg-accent ${ci === 0 ? 'left-1/2 right-[-12px]' : ci === 2 ? 'right-1/2 left-[-12px]' : '-right-3 -left-3'}`} aria-hidden />
                <span className="h-5 w-0.5 bg-accent" aria-hidden />
                <div className="mono mb-2 text-[12px] tracking-[0.16em] text-muted uppercase">{col.name}</div>
                {col.items.map((i, k) => {
                  const n = SECURITY_TREE[i]
                  const isOpen = open.has(i)
                  const c = cost(i)
                  return (
                    <div key={n.name} className="flex w-full flex-col items-center">
                      {k > 0 && <span className={`h-6 w-0.5 ${isOpen ? 'bg-accent' : 'bg-line'}`} aria-hidden />}
                      <motion.button
                        onClick={(e) => pick(i, e.currentTarget)}
                        aria-pressed={sel === i}
                        className={`w-full rounded-lg border-2 px-3 py-3 text-left transition-colors ${isOpen ? 'border-accent bg-surface-2' : 'border-dashed border-line bg-bg'} ${sel === i ? 'ring-2 ring-text/40' : ''}`}
                        animate={isOpen ? { scale: [1, 1.05, 1] } : {}}
                      >
                        <span className={`pixel flex items-center gap-2 text-[19px] ${isOpen ? 'text-text' : 'text-faint'}`}>
                          {isOpen ? <Sprite name={ICONS[i]} size={30} /> : <Lock size={14} aria-hidden />}
                          {n.name}
                        </span>
                        <span className={`mono mt-1 inline-block rounded border px-1.5 text-[12px] ${isOpen ? c.cls : 'invisible'}`}>{c.text}</span>
                      </motion.button>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="panel flex p-1" role="group" aria-label="Repository type">
            <button className={`flex-1 rounded-md px-3 py-2 text-[15px] ${!priv ? 'bg-tint-green text-accent' : 'text-muted'}`} onClick={() => setPriv(false)} aria-pressed={!priv}>
              Public repo
            </button>
            <button className={`flex-1 rounded-md px-3 py-2 text-[15px] ${priv ? 'bg-tint-blue text-info' : 'text-muted'}`} onClick={() => setPriv(true)} aria-pressed={priv}>
              Private repo
            </button>
          </div>
          <div className="hud panel flex-1 p-5" aria-live="polite">
            {sel === null ? (
              <p className="text-[17px] text-muted">Click a locked skill to unlock it.</p>
            ) : (
              <>
                <div className="pixel text-[24px] text-text">{SECURITY_TREE[sel].name}</div>
                <p className="mt-2 text-[17px] leading-snug text-muted">{SECURITY_TREE[sel].note}</p>
                <span className={`mono mt-3 inline-block rounded border px-2 py-0.5 text-[13px] ${cost(sel).cls}`}>
                  {priv ? 'Private repo' : 'Public repo'}: {cost(sel).text}
                </span>
              </>
            )}
          </div>
          <button className="btn justify-center" onClick={() => setOpen(new Set(SECURITY_TREE.map((_, i) => i)))}>
            Unlock all ({open.size}/{SECURITY_TREE.length})
          </button>
          <p className="mono text-[11px] leading-snug text-faint">GitHub Secret Protection and GitHub Code Security are paid add-ons, available on Team and Enterprise plans.</p>
        </div>
      </div>
    </SlideLayout>
  )
}
