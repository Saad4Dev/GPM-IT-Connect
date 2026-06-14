import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

import { cn } from '../lib/cn'

interface MetricCardProps {
  label: string
  value: string | number
  helper: string
  icon: ReactNode
  className?: string
}

export function MetricCard({ label, value, helper, icon, className }: MetricCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'portal-card relative flex h-full min-h-[210px] flex-col justify-between overflow-hidden border-white/10 bg-white/[0.04] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] md:p-6',
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-300/10 text-amber-300 shadow-[0_14px_28px_rgba(251,191,36,0.12)]">
        {icon}
      </div>
      <div className="mt-6">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">{label}</p>
        <p className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-white md:text-[2.65rem]">
          {value}
        </p>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">{helper}</p>
    </motion.article>
  )
}
