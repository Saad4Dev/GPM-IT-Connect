import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import { Panel } from '../components/Panel'
import { PageHeader } from '../components/PageHeader'
import { api } from '../lib/api'
import { humanize } from '../lib/format'
import type { TimetableEntry } from '../types'

const dayOptions = ['ALL', 'TODAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']

export function TimetablePage() {
  const [selectedDay, setSelectedDay] = useState('ALL')
  const [entries, setEntries] = useState<TimetableEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const suffix =
          selectedDay === 'ALL'
            ? ''
            : `?day=${selectedDay === 'TODAY' ? 'today' : selectedDay.toLowerCase()}`
        const { data } = await api.get<TimetableEntry[]>(`/timetable${suffix}`)
        setEntries(data)
      } catch {
        setError('Unable to load timetable entries.')
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [selectedDay])

  const groupedEntries = useMemo(() => {
    return entries.reduce<Record<string, TimetableEntry[]>>((accumulator, entry) => {
      accumulator[entry.dayOfWeek] = [...(accumulator[entry.dayOfWeek] ?? []), entry]
      return accumulator
    }, {})
  }, [entries])

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
        eyebrow="Timetable"
        title="Smart timetable"
        description="Weekly lecture, lab, and review schedule for the department."
        actions={
          <TextField
            select
            label="Filter"
            value={selectedDay}
            onChange={(event) => setSelectedDay(event.target.value)}
            sx={{ minWidth: 200 }}
          >
            {dayOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {humanize(option)}
              </MenuItem>
            ))}
          </TextField>
        }
      />

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Grid container spacing={2.5}>
        {Object.entries(groupedEntries).map(([day, dayEntries]) => (
          <Grid key={day} size={{ xs: 12, lg: 6 }}>
            <Panel title={humanize(day)} subtitle={`${dayEntries.length} scheduled items`}>
              <Stack spacing={1.5}>
                {dayEntries.map((entry) => (
                  <Box key={entry.id} className="list-card">
                    <Typography sx={{ fontWeight: 700 }}>{entry.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {entry.startTime} - {entry.endTime} · {entry.room}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {entry.subjectName} · {entry.facultyName}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Panel>
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}
