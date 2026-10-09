import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Play, RotateCcw } from 'lucide-react'

export type TermLine = {
  cmd: string
  out?: string[]
  /** Colour for the output lines. */
  tone?: 'ok' | 'bad' | 'muted'
}

type Props = {
  lines: TermLine[]
  title?: string
  /** Start typing when mounted (otherwise wait for ▶ Run). */
  autoPlay?: boolean
  /** Index of the command to highlight (for step-through explanations). */
  active?: number
  onLineClick?: (i: number) => void
  /** Called whenever a command finishes, with its index. */
  onProgress?: (done: number) => void
  className?: string
  prompt?: string
  /** Smaller text for tight layouts. */
  dense?: boolean
  /** Milliseconds per typed character. */
  typeMs?: number
  /** Pause after each command finishes, in ms. */
  pauseMs?: number
  /** One button press = one command (the presenter drives it). */
  stepMode?: boolean
}

const TONE = { ok: 'text-accent', bad: 'text-danger', muted: 'text-muted' }

/** Simulated terminal that types each command and then prints its output. */
export function Terminal({ lines, title = 'bash', autoPlay = false, active, onLineClick, onProgress, className = '', prompt = '$', dense = false, typeMs = 28, pauseMs = 380, stepMode = false }: Props) {
  const reduce = useReducedMotion()
  const [done, setDone] = useState(autoPlay && reduce ? lines.length : 0) // commands fully shown
  const [chars, setChars] = useState(0) // chars typed in the current command
  const [target, setTarget] = useState(autoPlay ? lines.length : 0) // run until this many commands are done
  const running = done < target
  const started = target > 0 || done > 0
  const t = useRef<number | undefined>(undefined)
  const body = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!running) return
    const cmd = lines[done].cmd
    // Before typing the next command, pause so the result of the last one can be explained
    if (chars < cmd.length) t.current = window.setTimeout(() => setChars((c) => c + 1), chars === 0 && done > 0 ? pauseMs : typeMs)
    else
      t.current = window.setTimeout(() => {
        setDone((d) => d + 1)
        setChars(0)
      }, 380)
    return () => window.clearTimeout(t.current)
  }, [running, done, chars, lines, typeMs, pauseMs])

  useEffect(() => {
    onProgress?.(done)
  }, [done, onProgress])

  // Keep the newest line in view when the output grows
  useEffect(() => {
    const el = body.current
    if (el) el.scrollTop = el.scrollHeight
  }, [done, chars])

  const run = () => {
    window.clearTimeout(t.current)
    setDone(reduce ? lines.length : 0)
    setChars(0)
    setTarget(lines.length)
  }

  // Step mode: each press casts exactly one command; after the last one the button restarts
  const step = () => {
    if (running) return
    if (done >= lines.length) {
      window.clearTimeout(t.current)
      setDone(0)
      setChars(0)
      setTarget(0)
      return
    }
    if (reduce) setDone(done + 1)
    setTarget(done + 1)
  }
  const finished = done >= lines.length

  return (
    <div className={`panel flex flex-col overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-3 py-2">
        <span className="h-3 w-3 rounded-full bg-danger/70" aria-hidden />
        <span className="h-3 w-3 rounded-full bg-warn/70" aria-hidden />
        <span className="h-3 w-3 rounded-full bg-accent/70" aria-hidden />
        <span className="mono ml-2 text-[12px] text-faint">{title}</span>
        {stepMode ? (
          <button className={`btn ml-auto !px-2.5 !py-1 !text-[12px] ${finished ? '' : 'btn-primary'}`} onClick={step} disabled={running} aria-label={finished ? 'Restart spellbook' : `Cast next spell ${done + 1} of ${lines.length}`}>
            {finished ? <RotateCcw size={13} /> : <Play size={13} />}
            {finished ? 'Restart' : running ? 'Casting…' : `Next spell ${done + 1}/${lines.length}`}
          </button>
        ) : (
          <button className="btn ml-auto !px-2.5 !py-1 !text-[12px]" onClick={run} aria-label={started ? 'Replay terminal' : 'Run terminal'}>
            {started ? <RotateCcw size={13} /> : <Play size={13} />}
            {started ? 'Replay' : 'Run'}
          </button>
        )}
      </div>
      <div ref={body} className={`mono min-h-0 flex-1 overflow-y-auto ${dense ? 'space-y-0 px-4 py-2 text-[13px] leading-snug' : 'space-y-1 p-4 text-[15px] leading-relaxed'}`} aria-live="polite">
        {lines.map((l, i) => {
          const visible = i < done || (i === done && running)
          if (!visible) return null
          const text = i < done ? l.cmd : l.cmd.slice(0, chars)
          const isActive = active === i
          return (
            <div
              key={i}
              className={`rounded px-1 ${onLineClick ? 'cursor-pointer hover:bg-surface-2' : ''} ${isActive ? 'bg-tint-green outline outline-1 outline-accent' : ''}`}
              onClick={onLineClick ? () => onLineClick(i) : undefined}
            >
              <div>
                <span className="text-accent">{prompt}</span> <span className="text-text">{text}</span>
                {i === done && running && <span className="blink ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-text" aria-hidden />}
              </div>
              {i < done &&
                l.out?.map((o, j) => (
                  <div key={j} className={`pl-4 ${dense ? 'text-[12px]' : 'text-[14px]'} ${TONE[l.tone ?? 'muted']}`}>
                    {o}
                  </div>
                ))}
            </div>
          )
        })}
        {!started && (
          <div className="text-faint">
            <span className="text-accent">{prompt}</span> <span className="blink inline-block h-4 w-2 translate-y-0.5 bg-faint" aria-hidden />
            <span className="ml-3 text-[13px]">press {stepMode ? 'Next spell' : 'Run'}</span>
          </div>
        )}
      </div>
    </div>
  )
}
