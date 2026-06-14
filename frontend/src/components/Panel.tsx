import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

import { cn } from '../lib/cn'

interface PanelProps {
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
  id?: string
  children?: ReactNode
}

export function Panel({ title, subtitle, action, className, children, id }: PanelProps) {
  return (
    <motion.section
      whileHover={{ y: -2 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={cn(
        'portal-card relative overflow-hidden border-white/10 bg-white/[0.035] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:p-6',
        className,
      )}
      id={id}
    >
      <div className="relative mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm leading-6 text-slate-400">{subtitle}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="relative">{children}</div>
    </motion.section>
  )
}
