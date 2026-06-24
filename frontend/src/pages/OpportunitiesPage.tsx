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
import { Search, MapPin, AlarmClock } from 'lucide-react'

import { Panel } from '../components/Panel'
import { PageHeader } from '../components/PageHeader'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'
import { formatDate, humanize } from '../lib/format'
import type { Opportunity } from '../types'

const types = ['INTERNSHIP', 'PLACEMENT'] as const

function isClosingSoon(deadline: string): boolean {
  if (!deadline) return false
  const diff = new Date(deadline).getTime() - Date.now()
  return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000
}

export function OpportunitiesPage() {
  const { user } = useAuth()
  const canManage = user?.role !== 'STUDENT'

  const [items, setItems] = useState<Opportunity[]>([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [activeType, setActiveType] = useState<'ALL' | 'INTERNSHIP' | 'PLACEMENT'>('ALL')
  const [locationFilter, setLocationFilter] = useState('')
  const [form, setForm] = useState({
    title: '',
    company: '',
    type: 'INTERNSHIP',
    location: '',
    stipend: '',
    applyUrl: '',
    deadline: '',
    description: '',
  })

  const load = async () => {
    try {
      const { data } = await api.get<Opportunity[]>('/opportunities')
      setItems(data)
    } catch {
      setError('Unable to load internships and placements.')
    }
  }

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void load()
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  const locations = useMemo(
    () => Array.from(new Set(items.map((i) => i.location).filter(Boolean))),
    [items],
  )

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return items.filter((item) => {
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q) ||
        (item.description ?? '').toLowerCase().includes(q)
      const matchesType = activeType === 'ALL' || item.type === activeType
      const matchesLocation = !locationFilter || item.location === locationFilter
      return matchesSearch && matchesType && matchesLocation
    })
  }, [items, search, activeType, locationFilter])

  const grouped = useMemo(
    () => ({
      internships: filtered.filter((item) => item.type === 'INTERNSHIP'),
      placements: filtered.filter((item) => item.type === 'PLACEMENT'),
    }),
    [filtered],
  )

  const createOpportunity = async () => {
    try {
      await api.post('/opportunities', form)
      setMessage('Opportunity posted successfully.')
      setForm({
        title: '',
        company: '',
        type: 'INTERNSHIP',
        location: '',
        stipend: '',
        applyUrl: '',
        deadline: '',
        description: '',
      })
      await load()
    } catch {
      setMessage('')
      setError('Unable to post the opportunity.')
    }
  }

  const OpportunityCard = ({ item, index }: { item: Opportunity; index: number }) => {
    const closing = isClosingSoon(item.deadline)
    return (
      <motion.div
        key={item.id}
        layout
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ delay: index * 0.06, duration: 0.3 }}
      >
        <Box
          className="list-card"
          sx={{
            position: 'relative',
            border: closing ? '1px solid rgba(248,113,113,0.3)' : undefined,
            background: closing ? 'rgba(248,113,113,0.04)' : undefined,
          }}
        >
          {closing && (
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.5,
                py: 0.25,
                borderRadius: 999,
                bgcolor: 'rgba(248,113,113,0.15)',
                border: '1px solid rgba(248,113,113,0.4)',
                color: '#f87171',
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              <AlarmClock size={12} />
              Closes soon
            </Box>
          )}

          <Typography sx={{ fontWeight: 700, pr: closing ? 12 : 0 }}>{item.title}</Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 0.5, alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {item.company}
            </Typography>
            {item.location ? (
              <>
                <Typography variant="body2" color="text.secondary">·</Typography>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.4, color: 'text.secondary' }}>
                  <MapPin size={12} />
                  <Typography variant="body2" color="text.secondary">{item.location}</Typography>
                </Box>
              </>
            ) : null}
          </Stack>
          <Typography variant="body2" sx={{ mt: 1 }}>{item.description}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {item.stipend} · Deadline {formatDate(item.deadline)}
          </Typography>
          <Link href={item.applyUrl} target="_blank" rel="noreferrer" sx={{ mt: 0.5, display: 'inline-block' }}>
            Apply now ↗
          </Link>
        </Box>
      </motion.div>
    )
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Opportunities"
        title="Internship and placement portal"
        description="Track active company openings, deadlines, and application links."
      />

      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}

      {/* ── Post Form (Faculty/Admin) ── */}
      {canManage ? (
        <Panel title="Post Opportunity" subtitle="Add an internship or placement drive">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
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
                label="Company"
                value={form.company}
                onChange={(event) => setForm({ ...form, company: event.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                select
                fullWidth
                label="Type"
                value={form.type}
                onChange={(event) => setForm({ ...form, type: event.target.value })}
              >
                {types.map((type) => (
                  <MenuItem key={type} value={type}>
                    {humanize(type)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                fullWidth
                label="Location"
                value={form.location}
                onChange={(event) => setForm({ ...form, location: event.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button fullWidth variant="contained" sx={{ height: '100%' }} onClick={() => void createOpportunity()}>
                Publish
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Stipend / CTC"
                value={form.stipend}
                onChange={(event) => setForm({ ...form, stipend: event.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Apply URL"
                value={form.applyUrl}
                onChange={(event) => setForm({ ...form, applyUrl: event.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                fullWidth
                type="date"
                label="Deadline"
                slotProps={{ inputLabel: { shrink: true } }}
                value={form.deadline}
                onChange={(event) => setForm({ ...form, deadline: event.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
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

      {/* ── Search & Filter Bar ── */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ alignItems: 'flex-start' }}>
        <TextField
          fullWidth
          placeholder="Search by title, company, or description…"
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
        {locations.length > 0 && (
          <TextField
            select
            label="Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All locations</MenuItem>
            {locations.map((loc) => (
              <MenuItem key={loc} value={loc}>
                {loc}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Stack>

      {/* Type toggle pills */}
      <Stack direction="row" spacing={1}>
        {([
          { key: 'ALL',       label: 'All',       color: undefined },
          { key: 'INTERNSHIP', label: 'Internships', color: { bg: 'rgba(96,165,250,0.12)', text: '#60a5fa', border: 'rgba(96,165,250,0.3)' } },
          { key: 'PLACEMENT',  label: 'Placements',  color: { bg: 'rgba(52,211,153,0.12)', text: '#34d399', border: 'rgba(52,211,153,0.3)' } },
        ] as const).map(({ key, label, color }) => {
          const isActive = activeType === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveType(key)}
              style={{
                padding: '5px 18px',
                borderRadius: 999,
                border: isActive
                  ? `1.5px solid ${color?.border ?? 'rgba(255,255,255,0.4)'}`
                  : '1.5px solid rgba(255,255,255,0.1)',
                background: isActive
                  ? (color?.bg ?? 'rgba(255,255,255,0.1)')
                  : 'transparent',
                color: isActive
                  ? (color?.text ?? '#fff')
                  : 'rgba(255,255,255,0.4)',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                letterSpacing: '0.04em',
              }}
            >
              {label}
            </button>
          )
        })}
      </Stack>

      {/* ── Listings ── */}
      <Grid container spacing={2.5}>
        {(activeType === 'ALL' || activeType === 'INTERNSHIP') && (
          <Grid size={{ xs: 12, lg: activeType === 'ALL' ? 6 : 12 }}>
            <Panel title="Internships" subtitle={`${grouped.internships.length} active listing${grouped.internships.length !== 1 ? 's' : ''}`}>
              <Stack spacing={1.5}>
                <AnimatePresence mode="popLayout">
                  {grouped.internships.map((item, i) => (
                    <OpportunityCard key={item.id} item={item} index={i} />
                  ))}
                  {grouped.internships.length === 0 && (
                    <motion.div key="empty-int" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Box sx={{ p: 3, textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 3 }}>
                        <Typography color="text.secondary">No internships match your search.</Typography>
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Stack>
            </Panel>
          </Grid>
        )}

        {(activeType === 'ALL' || activeType === 'PLACEMENT') && (
          <Grid size={{ xs: 12, lg: activeType === 'ALL' ? 6 : 12 }}>
            <Panel title="Placements" subtitle={`${grouped.placements.length} active listing${grouped.placements.length !== 1 ? 's' : ''}`}>
              <Stack spacing={1.5}>
                <AnimatePresence mode="popLayout">
                  {grouped.placements.map((item, i) => (
                    <OpportunityCard key={item.id} item={item} index={i} />
                  ))}
                  {grouped.placements.length === 0 && (
                    <motion.div key="empty-pl" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Box sx={{ p: 3, textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 3 }}>
                        <Typography color="text.secondary">No placements match your search.</Typography>
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Stack>
            </Panel>
          </Grid>
        )}
      </Grid>
    </Stack>
  )
}
