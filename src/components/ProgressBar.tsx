import { motion } from 'framer-motion'

/** Chunky pixel progress bar along the top of the stage. */
export function ProgressBar({ value }: { value: number }) {
  return (
    <div
      className="absolute top-0 left-0 z-20 h-[5px] w-full bg-[#0b0c16]"
      role="progressbar"
      aria-label="Deck progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
    >
      <motion.div className="h-full bg-accent" animate={{ width: `${value * 100}%` }} transition={{ duration: 0.4 }} />
    </div>
  )
}
