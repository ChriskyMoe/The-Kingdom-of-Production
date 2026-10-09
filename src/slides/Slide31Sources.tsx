import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { SlideLayout } from '../components/SlideLayout'
import { REFERENCES } from '../data/references'

export default function Slide31Sources() {
  const [topic, setTopic] = useState<string | null>(null)
  const groups = topic ? REFERENCES.filter((g) => g.topic === topic) : REFERENCES
  return (
    <SlideLayout title="Sources" lead="Official docs only. Checked 9 Oct 2026 — GitHub changes often, so check again before you present." badge="Filter by topic">
      <div className="flex h-full flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <button className="btn !py-1" aria-pressed={topic === null} onClick={() => setTopic(null)}>
            All
          </button>
          {REFERENCES.map((g) => (
            <button key={g.topic} className="btn !py-1" aria-pressed={topic === g.topic} onClick={() => setTopic(g.topic)}>
              {g.topic}
            </button>
          ))}
        </div>
        <div className="columns-3 gap-5">
          {groups.map((g) => (
            <div key={g.topic} className="mb-3 break-inside-avoid">
              <div className="mono mb-1 text-[12px] tracking-[0.16em] text-accent uppercase">{g.topic}</div>
              <ul className="space-y-0.5">
                {g.items.map((it) => (
                  <li key={it.url}>
                    <a href={it.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[16px] leading-snug no-underline hover:underline">
                      <ExternalLink size={12} className="shrink-0" aria-hidden />
                      {it.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mono mt-auto text-[12px] text-faint">Full list with GA / preview / plan labels: REFERENCES.md in the project folder.</p>
      </div>
    </SlideLayout>
  )
}
