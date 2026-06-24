import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Alert,
  Box,
  Button,
  Grid,
  InputAdornment,
  Link,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Search, FileText, Video, Link2, BookOpen, FileDown } from 'lucide-react'

import { Panel } from '../components/Panel'
import { PageHeader } from '../components/PageHeader'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'
import { formatDateTime, humanize } from '../lib/format'
import type { AcademicResource, UserProfile } from '../types'

const resourceTypes = ['PDF', 'NOTE', 'VIDEO', 'LINK', 'MANUAL'] as const

const typeIcon: Record<string, React.ReactNode> = {
  PDF:    <FileDown size={16} />,
  NOTE:   <FileText size={16} />,
  VIDEO:  <Video size={16} />,
  LINK:   <Link2 size={16} />,
  MANUAL: <BookOpen size={16} />,
}

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  PDF:    { bg: 'rgba(248,113,113,0.12)', text: '#f87171', border: 'rgba(248,113,113,0.3)' },
  NOTE:   { bg: 'rgba(148,163,184,0.12)', text: '#94a3b8', border: 'rgba(148,163,184,0.25)' },
  VIDEO:  { bg: 'rgba(167,139,250,0.12)', text: '#a78bfa', border: 'rgba(167,139,250,0.3)' },
  LINK:   { bg: 'rgba(96,165,250,0.12)',  text: '#60a5fa', border: 'rgba(96,165,250,0.3)' },
  MANUAL: { bg: 'rgba(52,211,153,0.12)',  text: '#34d399', border: 'rgba(52,211,153,0.3)' },
}

export function ResourcesPage() {
  const { user } = useAuth()
  const canManage = user?.role !== 'STUDENT'

  const [resources, setResources] = useState<AcademicResource[]>([])
  const [directory, setDirectory] = useState<UserProfile[]>([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [activeType, setActiveType] = useState<string>('ALL')
  const [subjectFilter, setSubjectFilter] = useState<string>('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'NOTE',
    resourceUrl: '',
    subjectName: '',
  })

  const load = async () => {
    try {
      const [resourcesResponse, directoryResponse] = await Promise.all([
        api.get<AcademicResource[]>('/resources'),
        api.get<UserProfile[]>('/users/directory'),
      ])
      setResources(resourcesResponse.data)
      setDirectory(directoryResponse.data)
    } catch {
      setError('Unable to load resources right now.')
    }
  }

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void load()
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  const createResource = async () => {
    try {
      await api.post('/resources', form)
      setMessage('Resource published successfully.')
      setForm({ title: '', description: '', type: 'NOTE', resourceUrl: '', subjectName: '' })
      await load()
    } catch {
      setMessage('')
      setError('Unable to add resource.')
    }
  }

  /* Unique subject names for dropdown */
  const subjects = useMemo(
    () => Array.from(new Set(resources.map((r) => r.subjectName).filter(Boolean))),
    [resources],
  )

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return resources.filter((r) => {
      const matchesSearch = !q || r.title.toLowerCase().includes(q) || (r.description ?? '').toLowerCase().includes(q)
      const matchesType = activeType === 'ALL' || r.type === activeType
      const matchesSubject = !subjectFilter || r.subjectName === subjectFilter
      return matchesSearch && matchesType && matchesSubject
    })
  }, [resources, search, activeType, subjectFilter])

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Resources"
        title="Resource center"
        description="Notes, papers, manuals, videos, and direct links for the IT department."
      />

      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}

      {/* ── Upload Form (Faculty/Admin) ── */}
      {canManage ? (
        <Panel title="Upload Learning Resource" subtitle="Add new references for students and faculty">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Title"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Subject"
                value={form.subjectName}
                onChange={(event) => setForm({ ...form, subjectName: event.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                select
                fullWidth
                label="Type"
                value={form.type}
                onChange={(event) => setForm({ ...form, type: event.target.value })}
              >
                {resourceTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {humanize(type)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                sx={{ height: '100%' }}
                variant="contained"
                onClick={() => void createResource()}
              >
                Publish
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                label="Resource URL"
                value={form.resourceUrl}
                onChange={(event) => setForm({ ...form, resourceUrl: event.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Description"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
            </Grid>
          </Grid>
        </Panel>
      ) : null}

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* ── Search & Filter Bar ── */}
          <Stack spacing={2} sx={{ mb: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ alignItems: 'flex-start' }}>
              <TextField
                fullWidth
                placeholder="Search by title or description…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={16} style={{ color: 'rgba(255,255,255,0.3)' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              {subjects.length > 0 && (
                <TextField
                  select
                  label="Subject"
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  sx={{ minWidth: 160 }}
                >
                  <MenuItem value="">All subjects</MenuItem>
                  {subjects.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </Stack>

            {/* Type pills */}
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {['ALL', ...resourceTypes].map((t) => {
                const isActive = activeType === t
                const colStyle = t !== 'ALL' ? typeColors[t] : undefined
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setActiveType(t)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '5px 14px',
                      borderRadius: 999,
                      border: isActive
                        ? `1.5px solid ${colStyle?.border ?? 'rgba(255,255,255,0.4)'}`
                        : '1.5px solid rgba(255,255,255,0.1)',
                      background: isActive
                        ? (colStyle?.bg ?? 'rgba(255,255,255,0.1)')
                        : 'transparent',
                      color: isActive
                        ? (colStyle?.text ?? '#fff')
                        : 'rgba(255,255,255,0.4)',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    {t !== 'ALL' && typeIcon[t]}
                    {t === 'ALL' ? 'All' : humanize(t)}
                  </button>
                )
              })}
            </Stack>
          </Stack>

          <Panel
            title="Available Resources"
            subtitle={`${filtered.length} resource${filtered.length !== 1 ? 's' : ''} found`}
          >
            <Stack spacing={1.5}>
              <AnimatePresence mode="popLayout">
                {filtered.map((resource, i) => {
                  const colStyle = typeColors[resource.type] ?? typeColors.NOTE
                  return (
                    <motion.div
                      key={resource.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ delay: i * 0.05, duration: 0.28 }}
                    >
                      <Box className="list-card">
                        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', mb: 1 }}>
                          <Box
                            component="span"
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 0.75,
                              px: 1.5,
                              py: 0.25,
                              borderRadius: 999,
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: '0.06em',
                              bgcolor: colStyle.bg,
                              color: colStyle.text,
                              border: `1px solid ${colStyle.border}`,
                            }}
                          >
                            {typeIcon[resource.type]}
                            {humanize(resource.type)}
                          </Box>
                          <Box
                            component="span"
                            sx={{
                              px: 1.5,
                              py: 0.25,
                              borderRadius: 999,
                              fontSize: 11,
                              fontWeight: 700,
                              bgcolor: 'rgba(148,163,184,0.1)',
                              color: '#94a3b8',
                              border: '1px solid rgba(148,163,184,0.2)',
                            }}
                          >
                            {resource.subjectName}
                          </Box>
                        </Stack>
                        <Typography sx={{ mt: 0.5, fontWeight: 700 }}>{resource.title}</Typography>
                        <Typography variant="body2" sx={{ mt: 0.75 }}>{resource.description}</Typography>
                        <Stack
                          direction="row"
                          useFlexGap
                          sx={{ justifyContent: 'space-between', mt: 1.5, flexWrap: 'wrap' }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {resource.uploader} · {formatDateTime(resource.uploadedAt)}
                          </Typography>
                          <Link href={resource.resourceUrl} target="_blank" rel="noreferrer">
                            Open resource ↗
                          </Link>
                        </Stack>
                      </Box>
                    </motion.div>
                  )
                })}
                {filtered.length === 0 && (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Box
                      sx={{
                        p: 4,
                        textAlign: 'center',
                        border: '1px dashed rgba(255,255,255,0.1)',
                        borderRadius: 3,
                      }}
                    >
                      <Typography color="text.secondary">
                        No resources match your search or filters.
                      </Typography>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </Stack>
          </Panel>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Panel title="Faculty Directory" subtitle="Quick view of department contacts">
            <Stack spacing={1.5}>
              {directory.map((member) => (
                <Box key={member.id} className="list-card">
                  <Typography sx={{ fontWeight: 700 }}>{member.fullName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {humanize(member.role)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.email}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Panel>
        </Grid>
      </Grid>
    </Stack>
  )
}
