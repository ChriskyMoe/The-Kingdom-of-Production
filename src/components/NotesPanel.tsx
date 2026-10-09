import { X } from 'lucide-react'
import type { SlideNotes } from '../notes/notes'

/** Presenter notes drawer, shown beside the stage (N). */
export function NotesPanel({ notes, number, onClose }: { notes?: SlideNotes; number: number; onClose: () => void }) {
  return (
    <aside
      className="no-print fixed top-0 right-0 bottom-0 z-50 flex w-[400px] flex-col border-l border-line bg-surface"
      aria-label="Presenter notes"
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="mono text-[12px] tracking-[0.16em] text-accent uppercase">Presenter notes · slide {number}</div>
        <button className="btn !px-2 !py-1" onClick={onClose} aria-label="Close notes">
          <X size={14} />
        </button>
      </div>
      {notes ? (
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 text-[15px] leading-relaxed">
          <Section label="Say">
            {notes.say.map((line, i) => (
              <p key={i} className="mb-2 text-text">
                {line}
              </p>
            ))}
          </Section>
          <Section label="They should understand">
            <p className="text-muted">{notes.understand}</p>
          </Section>
          {notes.question && (
            <Section label="Ask the room">
              <p className="text-accent-2">“{notes.question}”</p>
            </Section>
          )}
          {notes.demo && (
            <Section label="Live demo">
              <p className="text-warn">{notes.demo}</p>
            </Section>
          )}
          {notes.click && (
            <Section label="Click">
              <p className="text-info">{notes.click}</p>
            </Section>
          )}
          <Section label="Transition">
            <p className="text-muted italic">{notes.next}</p>
          </Section>
        </div>
      ) : (
        <p className="p-4 text-muted">No notes for this slide.</p>
      )}
    </aside>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="mono mb-1 text-[11px] tracking-[0.16em] text-faint uppercase">{label}</h4>
      {children}
    </section>
  )
}
