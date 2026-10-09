export type Availability = 'ga' | 'preview' | 'plan' | 'paid' | 'copilot' | 'free-public' | 'infra'

const LABEL: Record<Availability, string> = {
  ga: 'GA',
  preview: 'Preview',
  plan: 'Plan-dependent',
  paid: 'Paid add-on',
  copilot: 'Copilot plan',
  'free-public': 'Free on public repos',
  infra: 'Needs your own infra',
}

const STYLE: Record<Availability, string> = {
  ga: 'border-accent text-accent',
  preview: 'border-warn text-warn',
  plan: 'border-info text-info',
  paid: 'border-info text-info',
  copilot: 'border-accent-2 text-accent-2',
  'free-public': 'border-accent text-accent',
  infra: 'border-faint text-muted',
}

/** Availability label, so preview / paid features are never shown as universal. */
export function StatusBadge({ status }: { status: Availability }) {
  return (
    <span className={`mono rounded border px-1.5 py-px text-[11px] leading-4 whitespace-nowrap ${STYLE[status]}`}>
      {LABEL[status]}
    </span>
  )
}
