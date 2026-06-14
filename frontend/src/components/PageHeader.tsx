import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

import { cn } from '../lib/cn'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
  chips?: ReactNode
  className?: string
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  chips,
  className,
}: PageHeaderProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'portal-card relative overflow-hidden border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.34)]',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent_24%)]" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="text-[0.66rem] uppercase tracking-[0.38em] text-amber-300/90">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-[1.02rem]">
              {description}
            </p>
          ) : null}
          {chips ? <div className="mt-4 flex flex-wrap gap-2">{chips}</div> : null}
        </div>

        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </motion.section>
  )
}

