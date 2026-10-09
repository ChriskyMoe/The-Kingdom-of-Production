import { MonitorPlay } from 'lucide-react'

/** "Stop presenting, switch to the terminal / GitHub" marker. */
export function DemoMarker({ text, compact = false }: { text: string; compact?: boolean }) {
  if (compact)
    return (
      <span className="chip border-warn bg-[#3a2420] text-warn" role="note">
        <span className="blink inline-block h-2 w-2 bg-warn" aria-hidden />
        LIVE DEMO · {text}
      </span>
    )
  return (
    <div className="rpg flex items-center gap-4 px-5 py-3" role="note" style={{ borderColor: 'var(--warn)' }}>
      <MonitorPlay className="text-warn" size={28} aria-hidden />
      <div>
        <div className="head text-[10px] text-warn">LIVE DEMO — SWITCH SCREENS</div>
        <div className="pixel mt-1 text-[19px] text-text">{text}</div>
      </div>
    </div>
  )
}
