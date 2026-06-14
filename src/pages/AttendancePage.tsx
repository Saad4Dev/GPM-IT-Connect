import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import { Panel } from '../components/Panel'
import { PageHeader } from '../components/PageHeader'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'
import { formatDate, humanize } from '../lib/format'
import type {
  AttendanceEntry,
  AttendanceSummary,
  Subject,
  UserProfile,
} from '../types'

const statuses = ['PRESENT', 'ABSENT', 'LATE'] as const

export function AttendancePage() {
  const { user } = useAuth()
  const canManage = user?.role !== 'STUDENT'

  const [entries, setEntries] = useState<AttendanceEntry[]>([])
  const [analytics, setAnalytics] = useState<AttendanceSummary[]>([])
  const [students, setStudents] = useState<UserProfile[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    studentId: '',
    subjectId: '',
    attendanceDate: new Date().toISOString().slice(0, 10),
    status: 'PRESENT',
    remarks: '',
  })

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const baseRequests = [
        api.get<AttendanceEntry[]>(canManage ? '/attendance' : '/attendance/my'),
        api.get<AttendanceSummary[]>('/attendance/analytics/my'),
      ]

      const privilegedRequests = canManage
        ? [api.get<UserProfile[]>('/users/students'), api.get<Subject[]>('/subjects')]
        : []

      const results = await Promise.all([...baseRequests, ...privilegedRequests])
      setEntries(results[0].data as AttendanceEntry[])
      setAnalytics(results[1].data as AttendanceSummary[])

      if (canManage) {
        setStudents(results[2].data as UserProfile[])
        setSubjects(results[3].data as Subject[])
      }
    } catch {
      setError('Unable to load attendance information.')
    } finally {
      setLoading(false)
    }
  }

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    void load()
  }, [canManage])
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  const markAttendance = async () => {
    try {
      await api.post('/attendance', {
        studentId: Number(form.studentId),
        subjectId: Number(form.subjectId),
        attendanceDate: form.attendanceDate,
        status: form.status,
        remarks: form.remarks,
      })
      setMessage('Attendance marked successfully.')
      setForm((current) => ({ ...current, remarks: '' }))
      await load()
    } catch {
      setMessage('')
      setError('Unable to mark attendance.')
    }
  }

  if (loading) {
    return (
      <Box className="center-state">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Attendance"
        title="Attendance management"
        description="Review daily attendance entries and subject-wise performance."
      />

      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Panel title="Subject Analytics" subtitle="Attendance health across core subjects">
            <Stack spacing={1.5}>
              {analytics.map((item) => (
                <Box key={item.subject} className="list-card">
                  <Typography sx={{ fontWeight: 700 }}>{item.subject}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.presentCount} present out of {item.totalClasses} classes
                  </Typography>
                  <Typography className="percentage-text">{item.percentage}% attendance</Typography>
                </Box>
              ))}
            </Stack>
          </Panel>
        </Grid>

        <Grid size={{ xs: 12, lg: 7 }}>
          <Panel
            title={canManage ? 'Attendance Register' : 'My Attendance History'}
            subtitle={canManage ? 'Recent entries marked by faculty or admin' : 'Latest attendance updates'}
          >
            <Stack spacing={1.5}>
              {entries.map((entry) => (
                <Box key={entry.id} className="list-card">
                  <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>{entry.subject}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(entry.date)} · Marked by {entry.markedBy}
                      </Typography>
                    </Box>
                    <Typography className={`status-pill status-${entry.status.toLowerCase()}`}>
                      {humanize(entry.status)}
                    </Typography>
                  </Stack>
                  {entry.remarks ? (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {entry.remarks}
                    </Typography>
                  ) : null}
                </Box>
              ))}
            </Stack>
          </Panel>
        </Grid>
      </Grid>

      {canManage ? (
        <Panel title="Mark Attendance" subtitle="Create a new attendance entry for a student">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                select
                fullWidth
                label="Student"
                value={form.studentId}
                onChange={(event) => setForm({ ...form, studentId: event.target.value })}
              >
                {students.map((student) => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.fullName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                select
                fullWidth
                label="Subject"
                value={form.subjectId}
                onChange={(event) => setForm({ ...form, subjectId: event.target.value })}
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                slotProps={{ inputLabel: { shrink: true } }}
                value={form.attendanceDate}
                onChange={(event) => setForm({ ...form, attendanceDate: event.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                select
                fullWidth
                label="Status"
                value={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.value })}
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {humanize(status)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                variant="contained"
                sx={{ height: '100%' }}
                onClick={() => void markAttendance()}
                disabled={!form.studentId || !form.subjectId}
              >
                Save
              </Button>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Remarks"
                value={form.remarks}
                onChange={(event) => setForm({ ...form, remarks: event.target.value })}
              />
            </Grid>
          </Grid>
        </Panel>
      ) : null}
    </Stack>
  )
}
