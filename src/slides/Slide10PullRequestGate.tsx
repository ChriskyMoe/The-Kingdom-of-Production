import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, CircleCheck, CircleDot, Clock, GitPullRequest, Rocket } from 'lucide-react'
import { SlideLayout } from '../components/SlideLayout'
import { CodeDiff } from '../components/CodeDiff'
import { StatusIcon, type StageStatus } from '../components/Pipeline'
import { Landscape } from '../game/Landscape'
import { Castle, Sprite } from '../game/Sprite'
import { sfx } from '../game/sound'

const TABS = ['Conversation', 'Files changed', 'Checks'] as const
type Tab = (typeof TABS)[number]

const CHECKS: { name: string; s: StageStatus; t: string }[] = [
  { name: 'CI / lint', s: 'passed', t: '18s' },
  { name: 'CI / test', s: 'passed', t: '42s' },
  { name: 'CI / build', s: 'passed', t: '31s' },
  { name: 'CodeQL', s: 'running', t: '…' },
  { name: 'Dependency review', s: 'passed', t: '9s' },
]

const GUARD_SAYS: Record<string, string> = {
  Conversation: 'Halt! Tell me what this change does and why.',
  'Files changed': 'Open your bag. I inspect every item: green added, red removed.',
  Checks: 'Have the automatons tested it? No green checks, no entry.',
}

export default function Slide10PullRequestGate() {
  const [tab, setTab] = useState<Tab>('Conversation')
  return (
    <SlideLayout title="Pull Request = the checkpoint" lead="The gatekeeper inspects your change before it enters the castle (main)." badge="Click the tabs">
      <div className="grid h-full grid-cols-[300px_1fr] gap-4">
      <Landscape ground={56}>
        <Castle className="absolute bottom-[56px] left-[30px]" size={40} width={6} />
        <Sprite name="knight" size={60} className="bob absolute bottom-[56px] left-[40px]" />
        <Sprite name="heroKnight" size={60} className="bob absolute right-[20px] bottom-[56px]" flip />
        <motion.div key={tab} className="rpg pixel absolute top-3 right-3 left-3 px-3 py-2 text-[17px] leading-snug" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <span className="head block text-[8px] text-accent-2">GATEKEEPER</span>
          {GUARD_SAYS[tab]}
        </motion.div>
        {tab === 'Files changed' && (
          <motion.div className="absolute right-[90px] bottom-[120px] flex gap-1" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <Sprite name="potionGreen" size={30} className="shine" />
            <Sprite name="key" size={30} className="shine" />
            <Sprite name="bomb" size={30} className="opacity-60" />
          </motion.div>
        )}
      </Landscape>
      <div className="panel flex h-full flex-col overflow-hidden">
        <div className="border-b border-line px-5 pt-3">
          <div className="flex items-center gap-3">
            <span className="head text-[14px] text-text">Add user authentication</span>
            <span className="head text-[12px] text-faint">#43</span>
            <span className="ml-auto flex items-center gap-1.5 rounded-full bg-accent px-3 py-0.5 text-[14px] text-bg">
              <GitPullRequest size={14} aria-hidden /> Open
            </span>
          </div>
          <div className="mono mt-0.5 text-[13px] text-muted">
            wants to merge 3 commits into <span className="rounded bg-tint-blue px-1 text-info">main</span> from{' '}
            <span className="rounded bg-tint-blue px-1 text-info">feature/42-auth</span>
          </div>
          <div className="mt-2 flex gap-1" role="tablist">
            {TABS.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => {
                  setTab(t)
                  sfx('page')
                }}
                className={`pixel border-b-[3px] px-3 py-1.5 text-[17px] ${tab === t ? 'border-warn text-text' : 'border-transparent text-muted hover:text-text'}`}
              >
                {t}
                {t === 'Checks' && <span className="ml-1.5 rounded-full bg-surface-2 px-1.5 text-[12px]">5</span>}
                {t === 'Files changed' && <span className="ml-1.5 rounded-full bg-surface-2 px-1.5 text-[12px]">2</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[1fr_230px]">
          <motion.div key={tab} className="min-h-0 overflow-hidden p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="tabpanel">
            {tab === 'Conversation' && (
              <div className="space-y-3">
                <Comment who="you" text="Adds email + password login. Closes #42. Tested locally with 3 new unit tests." />
                <Comment who="alice" text="Can we rate-limit failed logins? Otherwise 👍" />
                <Comment who="Copilot" ai text="Possible issue: the password is compared with ===. Consider a constant-time compare." />
                <p className="mono text-[12px] text-faint">AI review shown here is Copilot code review (needs a paid Copilot plan). It does not count as a required approval by default.</p>
              </div>
            )}
            {tab === 'Files changed' && (
              <CodeDiff
                file="src/auth/login.ts"
                lines={[
                  { kind: ' ', text: "import { findUser } from './users'" },
                  { kind: '-', text: 'export function login() { throw new Error("TODO") }' },
                  { kind: '+', text: 'export async function login(email: string, password: string) {' },
                  { kind: '+', text: '  const user = await findUser(email)' },
                  { kind: '+', text: '  if (!user) return { ok: false }' },
                  { kind: '+', text: '  return { ok: await verify(password, user.hash) }' },
                  { kind: '+', text: '}' },
                ]}
              />
            )}
            {tab === 'Checks' && (
              <ul className="space-y-1.5">
                {CHECKS.map((c) => (
                  <li key={c.name} className={`flex items-center gap-3 rounded-md border border-line bg-surface-2 px-3 py-2 ${c.s === 'passed' ? 'text-accent' : 'text-warn'}`}>
                    <StatusIcon status={c.s} />
                    <span className="text-[16px] text-text">{c.name}</span>
                    <span className="mono ml-auto text-[13px] text-muted">
                      {c.s} · {c.t}
                    </span>
                  </li>
                ))}
                <li className="mono pt-1 text-[13px] text-muted">Required checks must pass before Merge turns green.</li>
              </ul>
            )}
          </motion.div>

          <aside className="space-y-3 border-l border-line p-4 text-[14px]">
            <Side label="Reviewers">
              <Row icon={<CircleCheck size={14} className="text-accent" />} text="alice · approved" />
              <Row icon={<Clock size={14} className="text-warn" />} text="@team/security · code owner" />
              <Row icon={<Bot size={14} className="text-accent-2" />} text="Copilot · commented" />
            </Side>
            <Side label="Linked issue">
              <Row icon={<CircleDot size={14} className="text-accent" />} text="#42 Add user authentication" />
            </Side>
            <Side label="Deployments">
              <Row icon={<Rocket size={14} className="text-info" />} text="preview · deployed" />
            </Side>
            <button className="w-full cursor-not-allowed rounded-md border border-line bg-surface-2 py-2 text-[15px] text-faint" disabled aria-disabled>
              Merge blocked: 1 review, 1 check pending
            </button>
          </aside>
        </div>
      </div>
      </div>
    </SlideLayout>
  )
}

function Comment({ who, text, ai }: { who: string; text: string; ai?: boolean }) {
  return (
    <div className={`rounded-md border px-3 py-2 ${ai ? 'border-accent-2/60 bg-tint-purple' : 'border-line bg-surface-2'}`}>
      <div className="mono flex items-center gap-1.5 text-[13px] text-muted">
        {ai && <Bot size={13} className="text-accent-2" aria-hidden />}
        <b className="text-text">{who}</b> commented
      </div>
      <p className="text-[16px] text-text">{text}</p>
    </div>
  )
}
function Side({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mono mb-1 text-[11px] tracking-[0.16em] text-faint uppercase">{label}</div>
      <div className="space-y-1">{children}</div>
    </div>
  )
}
function Row({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-muted">
      <span aria-hidden>{icon}</span>
      {text}
    </div>
  )
}
