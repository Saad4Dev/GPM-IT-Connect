import { useMemo, useState, type ReactNode } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { Avatar, Drawer, IconButton, useMediaQuery } from '@mui/material'
import {
  BellRing,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LibraryBig,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  UserRound,
  BriefcaseBusiness,
  Layers3,
  ChartColumnBig,
} from 'lucide-react'
import { motion } from 'framer-motion'

import { BrandMark } from './BrandMark'
import { useAuth } from '../context/AuthContext'
import { cn } from '../lib/cn'
import { formatRole } from '../lib/format'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Profile', path: '/profile', icon: UserRound },
  { label: 'Attendance', path: '/attendance', icon: ChartColumnBig },
  { label: 'Timetable', path: '/timetable', icon: CalendarRange },
  { label: 'Notices', path: '/notices', icon: BellRing },
  { label: 'Resources', path: '/resources', icon: LibraryBig },
  { label: 'Opportunities', path: '/opportunities', icon: BriefcaseBusiness },
  { label: 'Department Hub', path: '/hub', icon: Layers3 },
  { label: 'AI Assistant', path: '/ai-assistant', icon: Sparkles },
]

const quickLinks = [
  { label: 'Attendance', path: '/attendance', icon: ChartColumnBig },
  { label: 'Resources', path: '/resources', icon: LibraryBig },
  { label: 'Hub', path: '/hub', icon: Layers3 },
  { label: 'AI', path: '/ai-assistant', icon: Sparkles },
]

function SidebarContent({
  compact = false,
  onNavigate,
  onCollapse,
  mobile = false,
}: {
  compact?: boolean
  onNavigate?: () => void
  onCollapse?: () => void
  mobile?: boolean
}) {
  const location = useLocation()
  const { user, logout } = useAuth()

  const initials = useMemo(() => {
    const raw = user?.fullName?.trim() || 'GPM Student'
    return raw
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('')
  }, [user?.fullName])

  return (
    <div className={cn('flex h-full flex-col', compact ? 'gap-4' : 'gap-5')}>
      <div className={cn('flex items-start justify-between gap-3', compact && 'justify-center')}>
        <BrandMark compact={compact} showDepartment={!compact} />
        {!mobile && onCollapse ? (
          <IconButton
            onClick={onCollapse}
            aria-label={compact ? 'Expand sidebar' : 'Collapse sidebar'}
            className="!rounded-2xl !border !border-white/10 !bg-white/5 !text-white hover:!bg-white/10"
          >
            {compact ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </IconButton>
        ) : null}
      </div>

      <div
        className={cn(
          'portal-card relative overflow-hidden border-white/10 bg-white/[0.04] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.26)]',
          compact && 'p-3',
        )}
      >
        <div className={cn('flex items-center gap-3', compact && 'justify-center')}>
          <Avatar
            className="!h-11 !w-11 !bg-gradient-to-br !from-amber-300 !to-amber-500 !font-semibold !text-slate-950"
          >
            {initials || 'G'}
          </Avatar>
          {!compact ? (
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-white">
                {user?.fullName || 'Saad Shaikh'}
              </p>
              <p className="truncate text-sm text-slate-400">{user?.email}</p>
            </div>
          ) : null}
        </div>
        {!compact ? (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="portal-accent-badge">{formatRole(user?.role ?? 'STUDENT')}</span>
              <span className="portal-badge">{user?.department ?? 'IT Department'}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              A role-based student portal for academics, communication, and career readiness.
            </p>
          </>
        ) : null}
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path
          const Icon = item.icon

          return (
            <motion.div
              key={item.path}
              whileHover={{ x: compact ? 0 : 4 }}
              whileTap={{ scale: 0.985 }}
            >
              <RouterLink
                to={item.path}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                title={item.label}
                className={cn(
                  'group relative flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition duration-200',
                  compact ? 'justify-center px-3' : 'justify-start',
                  active
                    ? 'border-amber-300/20 bg-amber-300/10 text-white shadow-[0_18px_40px_rgba(251,191,36,0.12)]'
                    : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white',
                )}
              >
                {active ? (
                  <span className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-amber-300" />
                ) : null}
                <span
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition duration-200',
                    active
                      ? 'border-amber-300/20 bg-amber-300/10 text-amber-300'
                      : 'border-white/10 bg-white/5 text-slate-300 group-hover:text-white',
                  )}
                >
                  <Icon size={18} />
                </span>
                {!compact ? <span>{item.label}</span> : null}
                {active && !compact ? (
                  <span className="ml-auto h-2 w-2 rounded-full bg-amber-300" />
                ) : null}
              </RouterLink>
            </motion.div>
          )
        })}
      </nav>

      {!compact ? (
        <div className="grid grid-cols-2 gap-2">
          {quickLinks.map((item) => {
            const Icon = item.icon
            return (
              <motion.div key={item.path} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <RouterLink
                  to={item.path}
                  onClick={onNavigate}
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm font-medium text-slate-200 transition duration-200 hover:border-amber-300/20 hover:bg-white/[0.06]"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-300/10 text-amber-300">
                    <Icon size={16} />
                  </span>
                  <span className="truncate">{item.label}</span>
                </RouterLink>
              </motion.div>
            )
          })}
        </div>
      ) : null}

      <div className="mt-auto space-y-3">
        {!compact ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
            <p className="text-[0.65rem] uppercase tracking-[0.34em] text-amber-300/90">
              Portal status
            </p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-white">Department portal live</p>
                <p className="text-sm text-slate-400">All academic modules available</p>
              </div>
              <span className="portal-accent-badge">Online</span>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={logout}
          className={cn(
            'flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-200 transition duration-200 hover:-translate-y-0.5 hover:border-rose-300/20 hover:bg-rose-500/10 hover:text-white',
            compact && 'justify-center px-3',
          )}
        >
          <LogOut size={18} />
          {!compact ? <span>Logout</span> : null}
        </button>

        {compact ? (
          <div className="flex justify-center">
            <span className="portal-badge">IT</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const isMobile = useMediaQuery('(max-width: 900px)')
  const { user } = useAuth()

  const sidebarWidth = collapsed ? 108 : 320
  const welcomeName = user?.fullName?.split(' ')[0] ?? 'Student'
  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="portal-shell">
      {!isMobile ? (
        <motion.aside
          initial={false}
          animate={{ width: sidebarWidth }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed left-4 top-4 z-30 hidden h-[calc(100vh-2rem)] md:block"
        >
          <div className="portal-surface flex h-full w-full flex-col p-4">
            <SidebarContent compact={collapsed} onCollapse={() => setCollapsed((value) => !value)} />
          </div>
        </motion.aside>
      ) : null}

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 336,
            background: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        <div className="m-4 h-[calc(100%-2rem)] portal-surface p-4">
          <SidebarContent mobile onNavigate={() => setMobileOpen(false)} />
        </div>
      </Drawer>

      <main
        className="min-h-screen px-4 pb-4 pt-4 transition-[margin-left] duration-300 md:px-4 md:pb-4"
        style={{ marginLeft: isMobile ? 0 : sidebarWidth + 32 }}
      >
        <header className="portal-card mb-6 flex items-center gap-4 px-5 py-4">
          {isMobile ? (
            <IconButton
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="!rounded-2xl !border !border-white/10 !bg-white/5 !text-white hover:!bg-white/10"
            >
              <Menu size={18} />
            </IconButton>
          ) : null}

          <div className="min-w-0 flex-1">
            <p className="text-[0.65rem] uppercase tracking-[0.34em] text-amber-300/90">
              Government Polytechnic Mumbai · Information Technology Department
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-white">
                Welcome back, {welcomeName}
              </h2>
              <span className="portal-badge">{formatRole(user?.role ?? 'STUDENT')}</span>
              <span className="portal-badge">{today}</span>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Monitor classes, notices, resources, and opportunities from one premium dashboard.
            </p>
          </div>

          {!isMobile ? (
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:-translate-y-0.5 hover:bg-white/10"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          ) : null}
        </header>

        <div className="pb-8">{children}</div>
      </main>
    </div>
  )
}
