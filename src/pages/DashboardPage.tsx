import { useEffect, useState } from 'react'
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

              <div
                className="relative flex h-28 w-28 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#fbbf24 ${summary.attendancePercentage}%, rgba(255,255,255,0.08) 0)`,
                }}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-slate-950 text-center">
                  <div>
                    <p className="text-sm font-semibold text-white">{summary.attendancePercentage}%</p>
                    <p className="text-[0.65rem] uppercase tracking-[0.25em] text-slate-400">present</p>
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
        <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap' }}>
          <Button component={RouterLink} to="/profile" variant="outlined">
            My profile
          </Button>
          <Button component={RouterLink} to="/hub" variant="outlined">
            Department hub
          </Button>
          <Button component={RouterLink} to="/attendance" variant="outlined">
            Attendance
          </Button>
          <Button component={RouterLink} to="/resources" variant="outlined">
            Resources
          </Button>
          <Button component={RouterLink} to="/ai-assistant" variant="outlined">
            AI assistant
          </Button>
        </Stack>
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
