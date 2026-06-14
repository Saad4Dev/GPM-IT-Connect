import { useState } from 'react'

import { cn } from '../lib/cn'

const gpmLogoUrl = 'https://gpmumbai.ac.in/gpmweb/wp-content/uploads/2021/10/Logo-7.png'

interface BrandMarkProps {
  compact?: boolean
  className?: string
  showDepartment?: boolean
}

export function BrandMark({
  compact = false,
  className,
  showDepartment = true,
}: BrandMarkProps) {
  const [failedToLoad, setFailedToLoad] = useState(false)

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_18px_48px_rgba(0,0,0,0.35)]">
        {failedToLoad ? (
          <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-orange-500 text-sm font-black text-slate-950">
            GPM
          </div>
        ) : (
          <img
            src={gpmLogoUrl}
            alt="Government Polytechnic Mumbai logo"
            className="h-full w-full object-contain p-1.5"
            loading="eager"
            onError={() => setFailedToLoad(true)}
          />
        )}
      </div>

      {!compact ? (
        <div className="min-w-0">
          <p className="text-[0.65rem] uppercase tracking-[0.38em] text-amber-300/90">
            Government Polytechnic Mumbai
          </p>
          <p className="mt-1 text-lg font-semibold text-white">GPM IT Connect</p>
          {showDepartment ? (
            <p className="text-sm text-slate-300">Information Technology Department</p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

