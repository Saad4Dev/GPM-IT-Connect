import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Alert,
  Box,
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { Search, Pin } from 'lucide-react'

import { Panel } from '../components/Panel'
import { PageHeader } from '../components/PageHeader'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'
import { formatDateTime, humanize } from '../lib/format'
import type { Notice } from '../types'

const categories = ['GENERAL', 'EXAM', 'EVENT', 'PLACEMENT'] as const

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  GENERAL:   { bg: 'rgba(148,163,184,0.12)', text: '#94a3b8', border: 'rgba(148,163,184,0.25)' },
  EXAM:      { bg: 'rgba(248,113,113,0.12)', text: '#f87171', border: 'rgba(248,113,113,0.3)' },
  EVENT:     { bg: 'rgba(96,165,250,0.12)',  text: '#60a5fa', border: 'rgba(96,165,250,0.3)' },
  PLACEMENT: { bg: 'rgba(52,211,153,0.12)',  text: '#34d399', border: 'rgba(52,211,153,0.3)' },
}

export function NoticesPage() {
  const { user } = useAuth()
  const canManage = user?.role !== 'STUDENT'

  const [notices, setNotices] = useState<Notice[]>([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('ALL')
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'GENERAL',
    pinned: false,
  })

  const load = async () => {
    try {
      const { data } = await api.get<Notice[]>('/notices')
      setNotices(data)
    } catch {
      setError('Unable to load notices.')
    }
  }

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void load()
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  const createNotice = async () => {
    try {
      await api.post('/notices', form)
      setMessage('Notice published successfully.')
      setForm({ title: '', content: '', category: 'GENERAL', pinned: false })
      await load()
    } catch {
      setMessage('')
      setError('Unable to publish notice.')
    }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return notices.filter((n) => {
      const matchesSearch = !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
      const matchesCat = activeCategory === 'ALL' || n.category === activeCategory
      return matchesSearch && matchesCat
    })
  }, [notices, search, activeCategory])

  const pinned = useMemo(() => filtered.filter((n) => n.pinned), [filtered])
  const regular = useMemo(() => filtered.filter((n) => !n.pinned), [filtered])

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Notice board"
        title="Official announcements"
        description="Official announcements for classes, exams, projects, and events."
      />

      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}

      {/* ── Publish Form (Faculty/Admin) ── */}
      {canManage ? (
        <Panel title="Publish Notice" subtitle="Visible instantly to portal users">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 5 }}>
              <TextField
                fullWidth
                label="Title"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                select
                fullWidth
                label="Category"
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {humanize(category)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', height: '100%' }}>
                <Switch
                  checked={form.pinned}
                  onChange={(event) => setForm({ ...form, pinned: event.target.checked })}
                />
                <Typography>Pinned</Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                sx={{ height: '100%' }}
                variant="contained"
                onClick={() => void createNotice()}
              >
                Publish
              </Button>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Content"
                value={form.content}
                onChange={(event) => setForm({ ...form, content: event.target.value })}
              />
            </Grid>
          </Grid>
        </Panel>
      ) : null}

      {/* ── Search & Category Filter Bar ── */}
      <Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search notices…"
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
            sx={{ maxWidth: 360 }}
          />
        </Stack>

        {/* Category pills */}
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {['ALL', ...categories].map((cat) => {
            const isActive = activeCategory === cat
            const colStyle = cat !== 'ALL' ? categoryColors[cat] : undefined
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '5px 16px',
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
                  letterSpacing: '0.04em',
                }}
              >
                {cat === 'ALL' ? 'All' : humanize(cat)}
              </button>
            )
          })}
        </Stack>
      </Box>

      {/* ── Pinned Notices Carousel ── */}
      <AnimatePresence>
        {pinned.length > 0 ? (
          <motion.div
            key="pinned-panel"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <Panel
              title="Pinned Announcements"
              subtitle={`${pinned.length} pinned notice${pinned.length > 1 ? 's' : ''}`}
              action={
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Pin size={14} style={{ color: '#fbbf24' }} />
                  <Typography variant="body2" sx={{ color: '#fbbf24', fontSize: 12 }}>
                    Priority
                  </Typography>
                </Stack>
              }
            >
              <Box
                sx={{
                  border: '1px solid rgba(251,191,36,0.2)',
                  borderRadius: 3,
                  p: 0.5,
                  background: 'linear-gradient(135deg, rgba(251,191,36,0.06) 0%, rgba(251,191,36,0.02) 100%)',
                }}
              >
                <Stack spacing={1}>
                  {pinned.map((notice, i) => {
                    const colStyle = categoryColors[notice.category] ?? categoryColors.GENERAL
                    return (
                      <motion.div
                        key={notice.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2.5,
                            bgcolor: 'rgba(251,191,36,0.04)',
                            border: '1px solid rgba(251,191,36,0.12)',
                          }}
                        >
                          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', mb: 1 }}>
                            <Box
                              component="span"
                              sx={{
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
                              {humanize(notice.category)}
                            </Box>
                            <Box
                              component="span"
                              sx={{
                                px: 1.5,
                                py: 0.25,
                                borderRadius: 999,
                                fontSize: 11,
                                fontWeight: 700,
                                bgcolor: 'rgba(251,191,36,0.15)',
                                color: '#fbbf24',
                                border: '1px solid rgba(251,191,36,0.3)',
                              }}
                            >
                              📌 Pinned
                            </Box>
                          </Stack>
                          <Typography sx={{ fontWeight: 700 }}>{notice.title}</Typography>
                          <Typography variant="body2" sx={{ mt: 0.75, color: 'rgba(255,255,255,0.7)' }}>
                            {notice.content}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: 11 }}>
                            {notice.author} · {formatDateTime(notice.publishedAt)}
                          </Typography>
                        </Box>
                      </motion.div>
                    )
                  })}
                </Stack>
              </Box>
            </Panel>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* ── Regular Notices Feed ── */}
      <Panel
        title="All Notices"
        subtitle={`${regular.length} notice${regular.length !== 1 ? 's' : ''}${search || activeCategory !== 'ALL' ? ' matching filters' : ''}`}
      >
        <Stack spacing={1.5}>
          <AnimatePresence mode="popLayout">
            {regular.map((notice, i) => {
              const colStyle = categoryColors[notice.category] ?? categoryColors.GENERAL
              return (
                <motion.div
                  key={notice.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Box className="list-card">
                    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                      <Box
                        component="span"
                        sx={{
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
                        {humanize(notice.category)}
                      </Box>
                    </Stack>
                    <Typography sx={{ mt: 1.5, fontWeight: 700 }}>{notice.title}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>{notice.content}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                      {notice.author} · {formatDateTime(notice.publishedAt)}
                    </Typography>
                  </Box>
                </motion.div>
              )
            })}
            {filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Box
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    border: '1px dashed rgba(255,255,255,0.1)',
                    borderRadius: 3,
                  }}
                >
                  <Typography color="text.secondary">No notices match your search or filter.</Typography>
                </Box>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </Stack>
      </Panel>
    </Stack>
  )
}
