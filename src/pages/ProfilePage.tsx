import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { AutoAwesome, Campaign, CheckCircle, MenuBook, Work } from '@mui/icons-material'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material'

import { MetricCard } from '../components/MetricCard'
import { PageHeader } from '../components/PageHeader'
import { Panel } from '../components/Panel'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'
import { formatDateTime, formatRole, humanize } from '../lib/format'
import type { DashboardSummary } from '../types'

export function ProfilePage() {
  const { user } = useAuth()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setError('')
        const { data } = await api.get<DashboardSummary>('/dashboard/summary')
        setSummary(data)
      } catch {
        setError('Live dashboard snapshot is unavailable right now.')
      } finally {
        setLoading(false)
      }
    }

    void loadSummary()
  }, [])

  const firstName = user?.fullName?.split(' ')[0] ?? 'Student'

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Student profile"
        title="My profile"
        description="Review your account details, role, and live academic snapshot."
        actions={
          <>
            <Button component={RouterLink} to="/dashboard" variant="outlined">
              Back to dashboard
            </Button>
            <Button component={RouterLink} to="/hub" variant="contained">
              Open department hub
            </Button>
          </>
        }
      />

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Panel
            title="Account Details"
            subtitle="Your details are synced from the authentication service"
            action={
              <Button component={RouterLink} to="/hub" variant="outlined">
                Open Department Hub
              </Button>
            }
          >
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Avatar sx={{ width: 72, height: 72, bgcolor: 'secondary.main', color: 'primary.main', fontWeight: 800 }}>
                  {user?.fullName?.charAt(0) ?? 'G'}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    {user?.fullName}
                  </Typography>
                  <Typography color="text.secondary">{user?.email}</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                    <Chip label={formatRole(user?.role ?? 'STUDENT')} color="secondary" />
                    <Chip label={user?.department ?? 'Information Technology'} variant="outlined" />
                  </Stack>
                </Box>
              </Stack>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box className="list-card">
                    <Typography variant="body2" color="text.secondary">
                      Academic year
                    </Typography>
                    <Typography sx={{ fontWeight: 700 }}>
                      {user?.yearOfStudy ?? 'Not set'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box className="list-card">
                    <Typography variant="body2" color="text.secondary">
                      Division
                    </Typography>
                    <Typography sx={{ fontWeight: 700 }}>
                      {user?.division ?? 'Not set'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box className="list-card">
                    <Typography variant="body2" color="text.secondary">
                      Contact number
                    </Typography>
                    <Typography sx={{ fontWeight: 700 }}>
                      {user?.phoneNumber ?? 'Not set'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box className="list-card">
                    <Typography variant="body2" color="text.secondary">
                      Sign-in role
                    </Typography>
                    <Typography sx={{ fontWeight: 700 }}>{formatRole(user?.role ?? 'STUDENT')}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Stack>
          </Panel>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Panel
            title="Access & Security"
            subtitle="A quick summary of how the portal protects your account"
          >
            <Stack spacing={1.5}>
              <Chip icon={<CheckCircle />} label="JWT authentication enabled" color="secondary" />
              <Chip icon={<AutoAwesome />} label="Role-based navigation" variant="outlined" />
              <Chip icon={<Campaign />} label="Notices, events, and updates" variant="outlined" />
              <Chip icon={<MenuBook />} label="Resources and study material" variant="outlined" />
              <Chip icon={<Work />} label="Opportunities and placements" variant="outlined" />
              <Box className="list-card">
                <Typography sx={{ fontWeight: 700 }}>Portal focus</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {firstName} can jump between attendance, timetable, notices, resources, and the
                  new department hub without leaving the app shell.
                </Typography>
              </Box>
              <Button component={RouterLink} to="/dashboard" variant="contained">
                Back to dashboard
              </Button>
            </Stack>
          </Panel>
        </Grid>
      </Grid>

      {loading ? (
        <Box className="center-state">
          <CircularProgress />
        </Box>
      ) : summary ? (
        <>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <MetricCard
                label="Attendance"
                value={`${summary.attendancePercentage}%`}
                helper={`${summary.totalAttendanceEntries} entries in the system`}
                icon={<CheckCircle />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <MetricCard
                label="Notices"
                value={summary.noticeCount}
                helper="Latest announcements at a glance"
                icon={<Campaign />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <MetricCard
                label="Resources"
                value={summary.resourceCount}
                helper="Notes, manuals, and revision links"
                icon={<MenuBook />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <MetricCard
                label="Openings"
                value={summary.internshipCount + summary.placementCount}
                helper="Internships and placements combined"
                icon={<Work />}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Panel title="Latest Notice" subtitle="The most recent department update">
                {summary.latestNotices[0] ? (
                  <Stack spacing={1.5}>
                    <Chip
                      label={humanize(summary.latestNotices[0].category)}
                      color="secondary"
                      sx={{ alignSelf: 'flex-start' }}
                    />
                    <Typography sx={{ fontWeight: 800 }}>{summary.latestNotices[0].title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Published {formatDateTime(summary.latestNotices[0].publishedAt)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pinned updates stay visible across the portal dashboard.
                    </Typography>
                  </Stack>
                ) : (
                  <Typography color="text.secondary">No notices are available yet.</Typography>
                )}
              </Panel>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Panel title="Today's Schedule" subtitle="Your current lectures and lab slots">
                {summary.todaysSchedule.length > 0 ? (
                  <Stack spacing={1.5}>
                    {summary.todaysSchedule.map((item) => (
                      <Box key={`${item.title}-${item.slot}`} className="list-card">
                        <Typography sx={{ fontWeight: 700 }}>{item.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.slot} · {item.room}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.facultyName}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography color="text.secondary">No classes are scheduled for today.</Typography>
                )}
              </Panel>
            </Grid>
          </Grid>
        </>
      ) : error ? (
        <Alert severity="warning">{error}</Alert>
      ) : null}
    </Stack>
  )
}
