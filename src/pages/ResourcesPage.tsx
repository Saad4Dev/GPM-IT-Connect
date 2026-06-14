import { useEffect, useState } from 'react'
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
import { formatDateTime, humanize } from '../lib/format'
import type { AcademicResource, UserProfile } from '../types'

const resourceTypes = ['PDF', 'NOTE', 'VIDEO', 'LINK', 'MANUAL'] as const

export function ResourcesPage() {
  const { user } = useAuth()
  const canManage = user?.role !== 'STUDENT'

  const [resources, setResources] = useState<AcademicResource[]>([])
  const [directory, setDirectory] = useState<UserProfile[]>([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
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

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Resources"
        title="Resource center"
        description="Notes, papers, manuals, videos, and direct links for the IT department."
      />

      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}

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
          <Panel title="Available Resources" subtitle="Study material arranged for quick access">
            <Stack spacing={1.5}>
              {resources.map((resource) => (
                <Box key={resource.id} className="list-card">
                  <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                    <Typography className="status-pill status-neutral">{humanize(resource.type)}</Typography>
                    <Typography className="status-pill status-neutral">{resource.subjectName}</Typography>
                  </Stack>
                  <Typography sx={{ mt: 1.5, fontWeight: 700 }}>
                    {resource.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {resource.description}
                  </Typography>
                  <Stack
                    direction="row"
                    useFlexGap
                    sx={{ justifyContent: 'space-between', mt: 1.5, flexWrap: 'wrap' }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {resource.uploader} · {formatDateTime(resource.uploadedAt)}
                    </Typography>
                    <Link href={resource.resourceUrl} target="_blank" rel="noreferrer">
                      Open resource
                    </Link>
                  </Stack>
                </Box>
              ))}
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
