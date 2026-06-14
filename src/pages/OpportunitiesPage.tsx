import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Grid,
  Link,
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
import type { Opportunity } from '../types'

const types = ['INTERNSHIP', 'PLACEMENT'] as const

export function OpportunitiesPage() {
  const { user } = useAuth()
  const canManage = user?.role !== 'STUDENT'

  const [items, setItems] = useState<Opportunity[]>([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
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

  const grouped = useMemo(
    () => ({
      internships: items.filter((item) => item.type === 'INTERNSHIP'),
      placements: items.filter((item) => item.type === 'PLACEMENT'),
    }),
    [items],
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

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Opportunities"
        title="Internship and placement portal"
        description="Track active company openings, deadlines, and application links."
      />

      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}

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

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Panel title="Internships" subtitle={`${grouped.internships.length} active listings`}>
            <Stack spacing={1.5}>
              {grouped.internships.map((item) => (
                <Box key={item.id} className="list-card">
                  <Typography sx={{ fontWeight: 700 }}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.company} · {item.location}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {item.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {item.stipend} · Deadline {formatDate(item.deadline)}
                  </Typography>
                  <Link href={item.applyUrl} target="_blank" rel="noreferrer">
                    Apply now
                  </Link>
                </Box>
              ))}
            </Stack>
          </Panel>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Panel title="Placements" subtitle={`${grouped.placements.length} active listings`}>
            <Stack spacing={1.5}>
              {grouped.placements.map((item) => (
                <Box key={item.id} className="list-card">
                  <Typography sx={{ fontWeight: 700 }}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.company} · {item.location}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {item.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {item.stipend} · Deadline {formatDate(item.deadline)}
                  </Typography>
                  <Link href={item.applyUrl} target="_blank" rel="noreferrer">
                    Apply now
                  </Link>
                </Box>
              ))}
            </Stack>
          </Panel>
        </Grid>
      </Grid>
    </Stack>
  )
}
