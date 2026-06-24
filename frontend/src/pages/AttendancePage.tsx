import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Chip,
} from '@mui/material'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

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

/* ── SVG Bar Chart ─────────────────────────────────────────── */
function AttendanceBarChart({ data }: { data: AttendanceSummary[] }) {
  const W = 340
  const H = 160
  const PAD_L = 28
  const PAD_B = 36
  const BAR_GAP = 8
  const chartW = W - PAD_L - 8
  const chartH = H - PAD_B - 8
  const barW = data.length > 0 ? Math.min(48, (chartW - BAR_GAP * (data.length - 1)) / data.length) : 32

  if (data.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No analytics data available yet.
        </Typography>
      </Box>
    )
  }

  const totalSlotW = chartW / data.length

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: 'block', minWidth: Math.max(W, data.length * 60) }}
        aria-label="Attendance bar chart"
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((pct) => {
          const y = 8 + chartH - (pct / 100) * chartH
          return (
            <g key={pct}>
              <line
                x1={PAD_L}
                x2={W - 8}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.07)"
                strokeWidth={1}
              />
              <text
                x={PAD_L - 4}
                y={y + 4}
                fill="rgba(255,255,255,0.3)"
                fontSize={8}
                textAnchor="end"
              >
                {pct}
              </text>
            </g>
          )
        })}

        {/* Bars */}
        {data.map((item, i) => {
          const pct = Math.min(item.percentage, 100)
          const barH = (pct / 100) * chartH
          const x = PAD_L + i * totalSlotW + (totalSlotW - barW) / 2
          const y = 8 + chartH - barH
          const color = pct >= 75
            ? 'url(#barGreen)'
            : pct >= 60
            ? 'url(#barAmber)'
            : 'url(#barRed)'
          const shortName = item.subject.length > 8 ? item.subject.slice(0, 7) + '…' : item.subject

          return (
            <g key={item.subject}>
              <rect
                x={x}
                y={8 + chartH}
                width={barW}
                height={0}
                rx={5}
                fill={color}
                opacity={0.9}
              >
                <animate
                  attributeName="height"
                  from="0"
                  to={barH}
                  dur="0.7s"
                  begin={`${i * 0.12}s`}
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.34 1.56 0.64 1"
                />
                <animate
                  attributeName="y"
                  from={8 + chartH}
                  to={y}
                  dur="0.7s"
                  begin={`${i * 0.12}s`}
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.34 1.56 0.64 1"
                />
              </rect>
              {/* Percentage label */}
              <text
                x={x + barW / 2}
                y={y - 4}
                fill="rgba(255,255,255,0.7)"
                fontSize={9}
                textAnchor="middle"
              >
                {pct}%
              </text>
              {/* Subject label */}
              <text
                x={x + barW / 2}
                y={H - 4}
                fill="rgba(255,255,255,0.4)"
                fontSize={8}
                textAnchor="middle"
              >
                {shortName}
              </text>
            </g>
          )
        })}

        {/* 75% threshold line */}
        {(() => {
          const ty = 8 + chartH - 0.75 * chartH
          return (
            <line
              x1={PAD_L}
              x2={W - 8}
              y1={ty}
              y2={ty}
              stroke="rgba(251,191,36,0.55)"
              strokeWidth={1.5}
              strokeDasharray="5,3"
            />
          )
        })()}

        {/* Gradient defs */}
        <defs>
          <linearGradient id="barGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="barAmber" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="barRed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
      </svg>
    </Box>
  )
}

/* ── Status Toggle Button ──────────────────────────────────── */
function StatusToggle({
  value,
  onChange,
}: {
  value: 'PRESENT' | 'ABSENT' | 'LATE'
  onChange: (status: 'PRESENT' | 'ABSENT' | 'LATE') => void
}) {
  const options: { key: 'PRESENT' | 'ABSENT' | 'LATE'; icon: React.ReactNode; color: string }[] = [
    { key: 'PRESENT', icon: <CheckCircle size={15} />, color: '#34d399' },
    { key: 'ABSENT',  icon: <XCircle size={15} />,     color: '#f87171' },
    { key: 'LATE',    icon: <Clock size={15} />,        color: '#fbbf24' },
  ]
  return (
    <Stack direction="row" spacing={0.5}>
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 10px',
            borderRadius: 999,
            border: value === opt.key ? `1.5px solid ${opt.color}` : '1.5px solid rgba(255,255,255,0.12)',
            background: value === opt.key ? `${opt.color}22` : 'transparent',
            color: value === opt.key ? opt.color : 'rgba(255,255,255,0.4)',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.18s ease',
          }}
        >
          {opt.icon}
          {opt.key.charAt(0) + opt.key.slice(1).toLowerCase()}
        </button>
      ))}
    </Stack>
  )
}

/* ── Main Page ─────────────────────────────────────────────── */
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

  const [bulkSubjectId, setBulkSubjectId] = useState('')
  const [bulkDate, setBulkDate] = useState(new Date().toISOString().slice(0, 10))
  const [studentStatuses, setStudentStatuses] = useState<Record<number, { status: 'PRESENT' | 'ABSENT' | 'LATE', remarks: string }>>({})
  const [submittingBulk, setSubmittingBulk] = useState(false)
  const [markMode, setMarkMode] = useState<'single' | 'bulk'>('single')

  useEffect(() => {
    if (students.length > 0) {
      const initialMap: Record<number, { status: 'PRESENT' | 'ABSENT' | 'LATE', remarks: string }> = {}
      for (const student of students) {
        initialMap[student.id] = { status: 'PRESENT', remarks: '' }
      }
      setStudentStatuses(initialMap)
    }
  }, [students])

  const presentCount = useMemo(
    () => Object.values(studentStatuses).filter((s) => s.status === 'PRESENT').length,
    [studentStatuses],
  )
  const absentCount = useMemo(
    () => Object.values(studentStatuses).filter((s) => s.status === 'ABSENT').length,
    [studentStatuses],
  )
  const lateCount = useMemo(
    () => Object.values(studentStatuses).filter((s) => s.status === 'LATE').length,
    [studentStatuses],
  )

  const handleBulkSubmit = async () => {
    if (!bulkSubjectId || !bulkDate) {
      setError('Please select a subject and date.')
      return
    }
    setSubmittingBulk(true)
    setError('')
    setMessage('')
    try {
      const promises = students.map((student) => {
        const state = studentStatuses[student.id] || { status: 'PRESENT', remarks: '' }
        return api.post('/attendance', {
          studentId: student.id,
          subjectId: Number(bulkSubjectId),
          attendanceDate: bulkDate,
          status: state.status,
          remarks: state.remarks,
        })
      })
      await Promise.all(promises)
      setMessage(`Bulk attendance recorded successfully for ${students.length} students.`)
      await load()
    } catch {
      setError('Unable to submit bulk attendance.')
    } finally {
      setSubmittingBulk(false)
    }
  }

  const handleStatusChange = (studentId: number, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setStudentStatuses((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }))
  }

  const handleRemarksChange = (studentId: number, remarks: string) => {
    setStudentStatuses((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }))
  }

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
        description="Review daily attendance entries and subject-wise performance analytics."
      />

      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}

      <Grid container spacing={2.5}>
        {/* ── Subject Analytics Panel ── */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Panel title="Subject Analytics" subtitle="Attendance health across core subjects">
            <AttendanceBarChart data={analytics} />

            <Stack spacing={1.5} sx={{ mt: 2 }}>
              {analytics.map((item, i) => {
                const pct = item.percentage
                const color = pct >= 75 ? '#34d399' : pct >= 60 ? '#fbbf24' : '#f87171'
                return (
                  <motion.div
                    key={item.subject}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.35 }}
                  >
                    <Box className="list-card">
                      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{item.subject}</Typography>
                        <Typography sx={{ fontSize: 13, fontWeight: 700, color }}>
                          {pct}%
                        </Typography>
                      </Stack>
                      {/* Animated health bar */}
                      <Box sx={{ height: 7, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(pct, 100)}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                          style={{
                            height: '100%',
                            borderRadius: 999,
                            background: `linear-gradient(90deg, ${color}cc, ${color})`,
                            boxShadow: `0 0 8px ${color}55`,
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, fontSize: 11 }}>
                        {item.presentCount} present · {item.totalClasses} total classes
                        {pct < 75 && (
                          <span style={{ color: '#f87171', marginLeft: 6 }}>⚠ Below 75%</span>
                        )}
                      </Typography>
                    </Box>
                  </motion.div>
                )
              })}
            </Stack>
          </Panel>
        </Grid>

        {/* ── Attendance History Panel ── */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Panel
            title={canManage ? 'Attendance Register' : 'My Attendance History'}
            subtitle={canManage ? 'Recent entries marked by faculty or admin' : 'Latest attendance updates'}
          >
            <Stack spacing={1.5}>
              {entries.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Box className="list-card">
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
                </motion.div>
              ))}
            </Stack>
          </Panel>
        </Grid>
      </Grid>

      {/* ── Faculty Attendance Marking Panel ── */}
      {canManage ? (
        <Panel
          title="Mark Attendance"
          subtitle="Create a new attendance entry — single student or bulk roster"
          action={
            <Tabs
              value={markMode}
              onChange={(_e, v) => setMarkMode(v as 'single' | 'bulk')}
              sx={{ minHeight: 32, '& .MuiTab-root': { minHeight: 32, py: 0.5, fontSize: 12 } }}
            >
              <Tab value="single" label="Single" />
              <Tab value="bulk" label="Bulk sheet" />
            </Tabs>
          }
        >
          {markMode === 'single' ? (
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
          ) : (
            /* ── Bulk Attendance Sheet ── */
            <Stack spacing={2}>
              {/* Controls row */}
              <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    select
                    fullWidth
                    label="Subject"
                    value={bulkSubjectId}
                    onChange={(e) => setBulkSubjectId(e.target.value)}
                  >
                    {subjects.map((subject) => (
                      <MenuItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Date"
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={bulkDate}
                    onChange={(e) => setBulkDate(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  {/* Live summary pills */}
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={`✓ ${presentCount} Present`}
                      size="small"
                      sx={{ bgcolor: '#34d39922', color: '#34d399', borderColor: '#34d39944', border: '1px solid' }}
                    />
                    <Chip
                      label={`✗ ${absentCount} Absent`}
                      size="small"
                      sx={{ bgcolor: '#f8717122', color: '#f87171', borderColor: '#f8717144', border: '1px solid' }}
                    />
                    <Chip
                      label={`⏱ ${lateCount} Late`}
                      size="small"
                      sx={{ bgcolor: '#fbbf2422', color: '#fbbf24', borderColor: '#fbbf2444', border: '1px solid' }}
                    />
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => void handleBulkSubmit()}
                    disabled={submittingBulk || !bulkSubjectId || !bulkDate}
                  >
                    {submittingBulk ? 'Saving…' : `Submit All (${students.length})`}
                  </Button>
                </Grid>
              </Grid>

              {/* Quick mark all */}
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                  Mark all as:
                </Typography>
                {statuses.map((s) => (
                  <Button
                    key={s}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: 11, py: 0.25, px: 1.5, borderRadius: 999 }}
                    onClick={() => {
                      setStudentStatuses((prev) => {
                        const next = { ...prev }
                        for (const id of Object.keys(next)) {
                          next[Number(id)] = { ...next[Number(id)], status: s }
                        }
                        return next
                      })
                    }}
                  >
                    {humanize(s)}
                  </Button>
                ))}
              </Stack>

              {/* Student grid table */}
              <TableContainer
                component={Paper}
                sx={{
                  bgcolor: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 3,
                  maxHeight: 420,
                  overflow: 'auto',
                }}
              >
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ bgcolor: 'rgba(15,23,42,0.95)', color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        #
                      </TableCell>
                      <TableCell sx={{ bgcolor: 'rgba(15,23,42,0.95)', color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        Student
                      </TableCell>
                      <TableCell sx={{ bgcolor: 'rgba(15,23,42,0.95)', color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        Status
                      </TableCell>
                      <TableCell sx={{ bgcolor: 'rgba(15,23,42,0.95)', color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        Remarks
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student, idx) => {
                      const state = studentStatuses[student.id] ?? { status: 'PRESENT', remarks: '' }
                      const rowColor =
                        state.status === 'PRESENT'
                          ? 'rgba(52,211,153,0.04)'
                          : state.status === 'ABSENT'
                          ? 'rgba(248,113,113,0.06)'
                          : 'rgba(251,191,36,0.05)'
                      return (
                        <TableRow
                          key={student.id}
                          sx={{
                            bgcolor: rowColor,
                            transition: 'background 0.2s',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' },
                          }}
                        >
                          <TableCell sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>
                            {idx + 1}
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontWeight: 600, fontSize: 13 }}>
                              {student.fullName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 11 }}>
                              {student.email}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <StatusToggle
                              value={state.status}
                              onChange={(s) => handleStatusChange(student.id, s)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              placeholder="Optional remark…"
                              value={state.remarks}
                              onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                              sx={{
                                minWidth: 160,
                                '& .MuiInputBase-input': { fontSize: 12, py: 0.75 },
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {students.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ color: 'rgba(255,255,255,0.3)', py: 4 }}>
                          No students found in the system.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          )}
        </Panel>
      ) : null}
    </Stack>
  )
}
