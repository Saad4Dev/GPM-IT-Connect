import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Grid,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'

import { Panel } from '../components/Panel'
import { PageHeader } from '../components/PageHeader'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'
import { formatDateTime, humanize } from '../lib/format'
import type { Notice } from '../types'

const categories = ['GENERAL', 'EXAM', 'EVENT', 'PLACEMENT'] as const

export function NoticesPage() {
  const { user } = useAuth()
  const canManage = user?.role !== 'STUDENT'

  const [notices, setNotices] = useState<Notice[]>([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
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

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Notice board"
        title="Official announcements"
        description="Official announcements for classes, exams, projects, and events."
      />

      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}

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

      <Panel title="All Notices" subtitle="Latest updates from faculty and administration">
        <Stack spacing={1.5}>
          {notices.map((notice) => (
            <Box key={notice.id} className="list-card">
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                <Typography className="status-pill status-neutral">{humanize(notice.category)}</Typography>
                {notice.pinned ? <Typography className="status-pill status-present">Pinned</Typography> : null}
              </Stack>
              <Typography sx={{ mt: 1.5, fontWeight: 700 }}>
                {notice.title}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {notice.content}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                {notice.author} · {formatDateTime(notice.publishedAt)}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Panel>
    </Stack>
  )
}
