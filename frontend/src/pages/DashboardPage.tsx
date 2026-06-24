import { useEffect, useMemo, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Alert, Button, Chip, Grid, Stack, Typography } from '@mui/material'
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  CircleGauge,
  Sparkles,
  UserRound,
  Layers3,
  LibraryBig,
  ChartColumnBig,
} from 'lucide-react'

import { MetricCard } from '../components/MetricCard'
import { PageHeader } from '../components/PageHeader'
import { Panel } from '../components/Panel'
import { api } from '../lib/api'
import { formatDate, formatDateTime, humanize } from '../lib/format'
import type { DashboardSummary } from '../types'

const campusEvents = [
  {
    title: 'Industrial Visit',
    date: '24 Jun 2026',
    note: 'Site visit with report submission and certificate tracking.',
  },
  {
    title: 'Tech Fest',
    date: '30 Jun 2026',
    note: 'Project showcase, quiz rounds, and intra-department competitions.',
  },
  {
    title: 'Placement Drive',
    date: '07 Jul 2026',
    note: 'Company registration, eligibility tracking, and preparation support.',
  },
]

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="portal-card p-6 md:p-8">
        <div className="h-4 w-40 rounded-full portal-loading-skeleton" />
        <div className="mt-5 h-10 w-3/4 rounded-2xl portal-loading-skeleton" />
        <div className="mt-3 h-5 w-1/2 rounded-full portal-loading-skeleton" />
        <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 rounded-3xl portal-loading-skeleton" />
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        <div className="h-56 rounded-[28px] portal-card portal-loading-skeleton xl:col-span-2" />
        <div className="h-56 rounded-[28px] portal-card portal-loading-skeleton xl:col-span-1" />
        <div className="h-56 rounded-[28px] portal-card portal-loading-skeleton xl:col-span-1" />
      </div>
    </div>
  )
}

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get<DashboardSummary>('/dashboard/summary')
        setSummary(data)
      } catch {
        setError('Unable to load the dashboard right now.')
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  const liveLecture = useMemo(() => {
    if (!summary || !summary.todaysSchedule) return null
    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    for (const lecture of summary.todaysSchedule) {
      try {
        const [startStr, endStr] = lecture.slot.split(' - ')
        const [startH, startM] = startStr.split(':').map(Number)
        const [endH, endM] = endStr.split(':').map(Number)
        const startMinutes = startH * 60 + startM
        const endMinutes = endH * 60 + endM

        if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
          const progress = ((currentMinutes - startMinutes) / (endMinutes - startMinutes)) * 100
          const minutesLeft = endMinutes - currentMinutes
          return {
            ...lecture,
            progress,
            minutesLeft,
          }
        }
      } catch {
        // Ignore
      }
    }
    return null
  }, [summary])

  const nextLecture = useMemo(() => {
    if (!summary || !summary.todaysSchedule) return null
    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    let closest = null
    let minDiff = Infinity

    for (const lecture of summary.todaysSchedule) {
      try {
        const [startStr] = lecture.slot.split(' - ')
        const [startH, startM] = startStr.split(':').map(Number)
        const startMinutes = startH * 60 + startM

        const diff = startMinutes - currentMinutes
        if (diff > 0 && diff < minDiff) {
          minDiff = diff
          closest = {
            ...lecture,
            minutesToStart: diff,
          }
        }
      } catch {
        // Ignore
      }
    }
    return closest
  }, [summary])

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error || !summary) {
    return (
      <Alert
        severity="error"
        sx={{ borderRadius: 3, bgcolor: 'rgba(248, 113, 113, 0.1)', color: 'inherit' }}
      >
        {error || 'Dashboard data is unavailable.'}
      </Alert>
    )
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Government Polytechnic Mumbai"
        title="Department pulse at a glance"
        description="Track academics, communication, and career opportunities from one polished dashboard."
        chips={
          <>
            <span className="portal-accent-badge">Role: student portal</span>
            <span className="portal-badge">Attendance {summary.attendancePercentage}%</span>
            <span className="portal-badge">{summary.noticeCount} live notices</span>
          </>
        }
        actions={
          <>
            <Button component={RouterLink} to="/hub" variant="outlined" startIcon={<ArrowRight size={16} />}>
              Department hub
            </Button>
            <Button component={RouterLink} to="/ai-assistant" variant="contained" startIcon={<Sparkles size={16} />}>
              AI assistant
            </Button>
          </>
        }
      />

      {summary.attendancePercentage < 75 ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[24px] border border-rose-500/25 bg-rose-500/5 p-5 flex items-start sm:items-center gap-4 shadow-[0_12px_40px_rgba(239,68,68,0.06)]"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
            <CircleGauge size={22} className="animate-pulse" />
          </div>
          <div className="min-w-0">
            <h4 className="text-base font-bold text-white leading-snug">Attendance Alert</h4>
            <p className="text-sm text-rose-300/90 leading-relaxed mt-0.5">
              Your overall attendance of <span className="font-extrabold text-rose-200">{summary.attendancePercentage}%</span> is currently below the mandatory 75% department requirement. Please check your subject analytics or consult your coordinator.
            </p>
          </div>
        </motion.div>
      ) : null}

      {liveLecture ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="portal-card relative overflow-hidden p-6 border-emerald-500/25 bg-emerald-500/[0.03] shadow-[0_20px_50px_rgba(16,185,129,0.06)]"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="live-badge">
                  <span className="live-dot" />
                  Live Now
                </span>
                <span className="text-xs text-slate-400">Ongoing Class</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">{liveLecture.title}</h3>
              <p className="text-sm text-slate-300">
                Time: <span className="font-semibold text-white">{liveLecture.slot}</span> · Room: <span className="font-semibold text-emerald-400">{liveLecture.room}</span> · Faculty: {liveLecture.facultyName}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5 md:min-w-[240px]">
              <div className="flex justify-between w-full text-xs">
                <span className="text-slate-400">Lecture Timeline</span>
                <span className="text-emerald-400 font-semibold">{liveLecture.minutesLeft} mins remaining</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000"
                  style={{ width: `${liveLecture.progress}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ) : nextLecture ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="portal-card relative overflow-hidden p-6 border-amber-500/25 bg-amber-500/[0.01]"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="portal-accent-badge">Next Lecture</span>
                <span className="text-xs text-slate-400">Starts in {nextLecture.minutesToStart} mins</span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">{nextLecture.title}</h3>
              <p className="text-sm text-slate-300">
                Time: <span className="font-semibold text-white">{nextLecture.slot}</span> · Room: <span className="font-semibold text-amber-300">{nextLecture.room}</span> · {nextLecture.facultyName}
              </p>
            </div>
            <div>
              <span className="text-xs text-amber-300/70 uppercase tracking-widest font-bold">Today's Schedule</span>
            </div>
          </div>
        </motion.div>
      ) : null}

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut', delay: 0.05 }}
        className="portal-card overflow-hidden p-6 md:p-8"
      >
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <span className="portal-accent-badge">Welcome back, {summary.userName}</span>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.06em] text-white md:text-5xl">
              Department pulse at a glance
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-[1.02rem]">
              Monitor attendance, notices, resources, timetable updates, and career opportunities
              from one clean academic workspace.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button component={RouterLink} to="/attendance" variant="contained">
                Attendance overview
              </Button>
              <Button component={RouterLink} to="/notices" variant="outlined">
                Recent notices
              </Button>
              <Button component={RouterLink} to="/resources" variant="outlined">
                Resource center
              </Button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Total classes</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">
                  {summary.totalAttendanceEntries}
                </p>
                <p className="mt-1 text-sm text-slate-400">Attendance entries recorded</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Resources</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">
                  {summary.resourceCount}
                </p>
                <p className="mt-1 text-sm text-slate-400">Notes, manuals, and study links</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Opportunities</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">
                  {summary.internshipCount + summary.placementCount}
                </p>
                <p className="mt-1 text-sm text-slate-400">Internships and placement updates</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.66rem] uppercase tracking-[0.34em] text-amber-300/90">
                  Attendance overview
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">
                  {summary.attendancePercentage}%
                </p>
                <p className="mt-1 text-sm text-slate-400">Current semester health snapshot</p>
              </div>

              <div className="relative h-28 w-28 shrink-0">
                <svg width="112" height="112" viewBox="0 0 120 120" className="-rotate-90">
                  <defs>
                    <linearGradient id="attendanceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="transparent"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="transparent"
                    stroke="url(#attendanceGrad)"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 50}
                    strokeDashoffset={2 * Math.PI * 50 * (1 - summary.attendancePercentage / 100)}
                    strokeLinecap="round"
                    filter="url(#glow)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-lg font-extrabold text-white leading-none">{summary.attendancePercentage}%</p>
                    <p className="text-[0.55rem] uppercase tracking-[0.2em] text-amber-300 font-semibold mt-1">Present</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <BadgeCheck className="text-amber-300" size={18} />
                <p className="mt-2 text-sm font-medium text-white">Academic rhythm</p>
                <p className="mt-1 text-sm text-slate-400">Classes and practicals recorded</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <CircleGauge className="text-amber-300" size={18} />
                <p className="mt-2 text-sm font-medium text-white">Portal status</p>
                <p className="mt-1 text-sm text-slate-400">Live and ready for the department</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            label="Attendance"
            value={`${summary.attendancePercentage}%`}
            helper={`${summary.totalAttendanceEntries} attendance entries recorded`}
            icon={<BadgeCheck size={22} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            label="Notices"
            value={summary.noticeCount}
            helper="Important department updates available"
            icon={<BellRing size={22} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            label="Resources"
            value={summary.resourceCount}
            helper="Notes, manuals, and study links"
            icon={<BookOpen size={22} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            label="Opportunities"
            value={summary.internshipCount + summary.placementCount}
            helper={`${summary.internshipCount} internships and ${summary.placementCount} placements`}
            icon={<BriefcaseBusiness size={22} />}
          />
        </Grid>
      </Grid>

      <Panel
        title="Quick access"
        subtitle="Jump to the pages most students and faculty use every day"
      >
        <Grid container spacing={2}>
          {[
            { label: 'My profile', desc: 'Manage your contact details and roles', path: '/profile', color: 'from-amber-500/10 to-amber-500/5 border-amber-300/10', icon: <UserRound className="text-amber-300" size={22} /> },
            { label: 'Department hub', desc: 'Mini projects, alumni, forum, lost & found', path: '/hub', color: 'from-sky-500/10 to-sky-500/5 border-sky-300/10', icon: <Layers3 className="text-sky-300" size={22} /> },
            { label: 'Attendance tracker', desc: 'Track your attendance and classes', path: '/attendance', color: 'from-emerald-500/10 to-emerald-500/5 border-emerald-300/10', icon: <ChartColumnBig className="text-emerald-300" size={22} /> },
            { label: 'Learning resources', desc: 'Study notes, practical manuals, files', path: '/resources', color: 'from-violet-500/10 to-violet-500/5 border-violet-300/10', icon: <LibraryBig className="text-violet-300" size={22} /> },
          ].map((item) => (
            <Grid key={item.path} size={{ xs: 12, sm: 6, md: 3 }}>
              <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.985 }} className="h-full">
                <RouterLink to={item.path} className={`flex h-full flex-col justify-between portal-card p-5 border ${item.color.split(' ')[2]} bg-gradient-to-br ${item.color.split(' ')[0]} ${item.color.split(' ')[1]}`}>
                  <div>
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] border border-white/5 mb-3.5">
                      {item.icon}
                    </div>
                    <h4 className="text-base font-bold text-white mb-1">{item.label}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-end text-xs font-semibold text-amber-300/80 gap-1">
                    Open page <ArrowRight size={13} />
                  </div>
                </RouterLink>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Panel>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Panel title="Recent Notices" subtitle="Pinned announcements stay at the top">
            <Stack spacing={1.5}>
              {summary.latestNotices.length > 0 ? (
                summary.latestNotices.map((notice) => (
                  <div key={`${notice.title}-${notice.publishedAt}`} className="list-card">
                    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                      <Chip label={humanize(notice.category)} size="small" />
                      {notice.pinned ? <Chip label="Pinned" size="small" color="secondary" /> : null}
                    </Stack>
                    <Typography sx={{ mt: 1.5, fontWeight: 700, color: 'white' }}>
                      {notice.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDateTime(notice.publishedAt)}
                    </Typography>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center text-slate-400">
                  No notices are available yet.
                </div>
              )}
            </Stack>
          </Panel>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Panel title="Today&apos;s Lectures" subtitle="Live view of lectures, labs, and reviews">
            <Stack spacing={1.5}>
              {summary.todaysSchedule.length > 0 ? (
                summary.todaysSchedule.map((slot) => (
                  <div key={`${slot.title}-${slot.slot}`} className="list-card">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-300" />
                      <div className="min-w-0">
                        <Typography sx={{ fontWeight: 700, color: 'white' }}>{slot.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {slot.slot} · {slot.room}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {slot.facultyName}
                        </Typography>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center text-slate-400">
                  No timetable entries for today.
                </div>
              )}
            </Stack>
          </Panel>
        </Grid>

        <Grid size={{ xs: 12, lg: 3 }}>
          <Panel title="Upcoming Openings" subtitle="Internships and placement drives">
            <Stack spacing={1.5}>
              {summary.topOpportunities.length > 0 ? (
                summary.topOpportunities.map((item) => (
                  <div key={`${item.title}-${item.company}`} className="list-card">
                    <Chip
                      label={humanize(item.type)}
                      size="small"
                      color={item.type === 'INTERNSHIP' ? 'secondary' : 'primary'}
                    />
                    <Typography sx={{ mt: 1.5, fontWeight: 700, color: 'white' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.company} · {item.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Deadline: {formatDate(item.deadline)}
                    </Typography>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center text-slate-400">
                  No current openings.
                </div>
              )}
            </Stack>
          </Panel>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Panel title="Academic performance" subtitle="A quick dashboard of the portal’s academic health">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: 'Attendance health',
                  value: `${summary.attendancePercentage}%`,
                  helper: `${summary.totalAttendanceEntries} entries tracked`,
                  progress: summary.attendancePercentage,
                },
                {
                  title: 'Notice activity',
                  value: summary.noticeCount,
                  helper: 'Updates available for the department',
                  progress: Math.min(summary.noticeCount * 16, 100),
                },
                {
                  title: 'Career updates',
                  value: summary.internshipCount + summary.placementCount,
                  helper: 'Internships and placements combined',
                  progress: Math.min((summary.internshipCount + summary.placementCount) * 25, 100),
                },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.28em] text-slate-400">
                        {item.value}
                      </p>
                    </div>
                    <CircleGauge className="text-amber-300" size={18} />
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-amber-300 to-amber-500"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-slate-400">{item.helper}</p>
                </div>
              ))}
            </div>
          </Panel>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Panel title="Campus events" subtitle="Upcoming activities across the department">
            <Stack spacing={1.5}>
              {campusEvents.map((event) => (
                <div key={event.title} className="list-card">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{event.title}</p>
                      <p className="mt-1 text-sm text-slate-400">{event.date}</p>
                    </div>
                    <CalendarDays className="text-amber-300" size={18} />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{event.note}</p>
                </div>
              ))}
            </Stack>
          </Panel>
        </Grid>
      </Grid>
    </Stack>
  )
}
