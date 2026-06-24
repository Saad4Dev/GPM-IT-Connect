import { useState, type SyntheticEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link as RouterLink } from 'react-router-dom'
import {
  AssignmentTurnedIn,
  Campaign,
  EventAvailable,
  FolderOpen,
  Forum,
  Groups,
  School,
  Workspaces,
} from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import { MetricCard } from '../components/MetricCard'
import { PageHeader } from '../components/PageHeader'
import { Panel } from '../components/Panel'
import { useAuth } from '../context/AuthContext'
import { formatDateTime } from '../lib/format'

type HubSection = 'tracker' | 'projects' | 'network' | 'community'

interface TrackerItem {
  subject: string
  faculty: string
  attendance: number
  internal: number
  practical: number
  assignments: number
  status: string
}

interface ProjectItem {
  id: number
  title: string
  team: string
  stack: string[]
  mentor: string
  repoUrl: string
  demoUrl: string
  summary: string
  status: string
  submittedAt: string
}

interface AchievementItem {
  id: number
  title: string
  category: string
  issuer: string
  year: string
  description: string
}

interface AlumniItem {
  id: number
  name: string
  company: string
  role: string
  batch: string
  focus: string
}

interface ThreadItem {
  id: number
  title: string
  subject: string
  author: string
  replies: number
  tags: string[]
  updatedAt: string
}

interface LostFoundItem {
  id: number
  item: string
  type: 'Lost' | 'Found'
  location: string
  contact: string
  description: string
  updatedAt: string
}

const upcomingPrograms = [
  {
    title: 'Industrial Visit',
    status: 'Registration open',
    date: '24 Jun 2026',
    description: 'Site visit to an IT services hub with report submission and certificate tracking.',
    icon: <EventAvailable />,
  },
  {
    title: 'Tech Fest',
    status: 'Volunteers needed',
    date: '30 Jun 2026',
    description: 'Project showcase, quiz rounds, and intra-department competitions for students.',
    icon: <Campaign />,
  },
  {
    title: 'Placement Drive',
    status: 'Upcoming',
    date: '07 Jul 2026',
    description: 'Company registration, eligibility tracking, and interview preparation updates.',
    icon: <Workspaces />,
  },
  {
    title: 'Digital Notice Board',
    status: 'Live updates',
    date: 'All day',
    description: 'A single feed for screens in the department corridor and student portal.',
    icon: <School />,
  },
]

const trackerItems: TrackerItem[] = [
  {
    subject: 'Cloud Computing',
    faculty: 'Prof. Mehta',
    attendance: 88,
    internal: 82,
    practical: 90,
    assignments: 84,
    status: 'On track',
  },
  {
    subject: 'Java Programming',
    faculty: 'Prof. Deshmukh',
    attendance: 92,
    internal: 78,
    practical: 88,
    assignments: 80,
    status: 'Strong',
  },
  {
    subject: 'Project Management',
    faculty: 'Prof. Joshi',
    attendance: 74,
    internal: 70,
    practical: 76,
    assignments: 72,
    status: 'Needs attention',
  },
  {
    subject: 'Web Technology',
    faculty: 'Prof. Patil',
    attendance: 96,
    internal: 91,
    practical: 94,
    assignments: 89,
    status: 'Excellent',
  },
]

const initialProjects: ProjectItem[] = [
  {
    id: 1,
    title: 'Smart Attendance Tracker',
    team: 'Team ByteForce',
    stack: ['React', 'Spring Boot', 'MySQL'],
    mentor: 'Prof. Mehta',
    repoUrl: 'https://github.com/example/attendance-tracker',
    demoUrl: 'https://example.com/demo/attendance-tracker',
    summary: 'Marks attendance, calculates subject-wise percentage, and highlights defaulters.',
    status: 'Reviewed',
    submittedAt: '2026-06-10T09:15:00Z',
  },
  {
    id: 2,
    title: 'Placement Readiness Portal',
    team: 'Team NextStep',
    stack: ['React', 'Node.js', 'MongoDB'],
    mentor: 'Prof. Deshmukh',
    repoUrl: 'https://github.com/example/placement-portal',
    demoUrl: 'https://example.com/demo/placement-portal',
    summary: 'Resume builder, drive notifications, and company-specific preparation notes.',
    status: 'Published',
    submittedAt: '2026-06-08T15:30:00Z',
  },
]

const initialAchievements: AchievementItem[] = [
  {
    id: 1,
    title: 'Winner - State Hackathon',
    category: 'Hackathon',
    issuer: 'MHRD Innovation Cell',
    year: '2026',
    description: 'Built an energy-saving classroom automation prototype with live alerts.',
  },
  {
    id: 2,
    title: 'AWS Cloud Practitioner',
    category: 'Certification',
    issuer: 'Amazon Web Services',
    year: '2026',
    description: 'Validated cloud fundamentals, security, and deployment workflow.',
  },
  {
    id: 3,
    title: 'Inter-Polytechnic Football Runner-up',
    category: 'Sports',
    issuer: 'Mumbai Division',
    year: '2025',
    description: 'Represented the department at the state-level sports competition.',
  },
]

const alumniMentors: AlumniItem[] = [
  {
    id: 1,
    name: 'Rohit Shinde',
    company: 'TCS',
    role: 'Software Engineer',
    batch: '2021',
    focus: 'Cloud basics, interview prep, and resume reviews',
  },
  {
    id: 2,
    name: 'Priya Nair',
    company: 'Infosys',
    role: 'Associate Consultant',
    batch: '2020',
    focus: 'Full-stack roadmap and project mentoring',
  },
  {
    id: 3,
    name: 'Aman Khan',
    company: 'Pune University',
    role: 'M.Tech Scholar',
    batch: '2022',
    focus: 'Higher studies guidance and GATE preparation',
  },
]

const initialThreads: ThreadItem[] = [
  {
    id: 1,
    title: 'How do we prepare for the DBMS viva?',
    subject: 'Database Systems',
    author: 'Saad Shaikh',
    replies: 8,
    tags: ['viva', 'dbms', 'revision'],
    updatedAt: '2026-06-11T11:20:00Z',
  },
  {
    id: 2,
    title: 'Need help with Java collection examples',
    subject: 'Java Programming',
    author: 'Kavya Desai',
    replies: 5,
    tags: ['java', 'collections', 'coding'],
    updatedAt: '2026-06-12T05:45:00Z',
  },
]

const initialLostFound: LostFoundItem[] = [
  {
    id: 1,
    item: 'Student ID card',
    type: 'Lost',
    location: 'Library reading room',
    contact: 'student@gpmitconnect.edu',
    description: 'Blue lanyard card with Saad Shaikh name printed on it.',
    updatedAt: '2026-06-10T16:10:00Z',
  },
  {
    id: 2,
    item: 'Calculator',
    type: 'Found',
    location: 'Lab 204',
    contact: 'faculty@gpmitconnect.edu',
    description: 'Casio scientific calculator found after the practical session.',
    updatedAt: '2026-06-12T08:05:00Z',
  },
]

export function DepartmentHubPage() {
  const { user } = useAuth()
  const [section, setSection] = useState<HubSection>('tracker')
  const [projects, setProjects] = useState(initialProjects)
  const [projectForm, setProjectForm] = useState({
    title: '',
    team: '',
    stack: '',
    mentor: '',
    repoUrl: '',
    demoUrl: '',
    summary: '',
  })
  const [threads, setThreads] = useState(initialThreads)
  const [threadForm, setThreadForm] = useState({
    title: '',
    subject: '',
    description: '',
  })
  const [lostFound, setLostFound] = useState(initialLostFound)
  const [lostForm, setLostForm] = useState({
    item: '',
    type: 'Lost' as 'Lost' | 'Found',
    location: '',
    contact: user?.email ?? '',
    description: '',
  })
  const [message, setMessage] = useState('')

  const handleSectionChange = (_event: SyntheticEvent, nextSection: HubSection) => {
    setSection(nextSection)
    setMessage('')
  }

  const submitProject = () => {
    if (!projectForm.title || !projectForm.team || !projectForm.summary) {
      setMessage('Please fill the mini project title, team, and summary first.')
      return
    }

    setProjects((current) => [
      {
        id: Date.now(),
        title: projectForm.title,
        team: projectForm.team,
        stack: projectForm.stack
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        mentor: projectForm.mentor || user?.fullName || 'Department mentor',
        repoUrl: projectForm.repoUrl || '#',
        demoUrl: projectForm.demoUrl || '#',
        summary: projectForm.summary,
        status: 'Draft',
        submittedAt: new Date().toISOString(),
      },
      ...current,
    ])
    setProjectForm({
      title: '',
      team: '',
      stack: '',
      mentor: '',
      repoUrl: '',
      demoUrl: '',
      summary: '',
    })
    setMessage('Mini project added to the repository preview.')
  }

  const submitThread = () => {
    if (!threadForm.title || !threadForm.subject || !threadForm.description) {
      setMessage('Please add a discussion title, subject, and message.')
      return
    }

    setThreads((current) => [
      {
        id: Date.now(),
        title: threadForm.title,
        subject: threadForm.subject,
        author: user?.fullName ?? 'Student',
        replies: 0,
        tags: ['new'],
        updatedAt: new Date().toISOString(),
      },
      ...current,
    ])
    setThreadForm({ title: '', subject: '', description: '' })
    setMessage('Forum question posted successfully.')
  }

  const submitLostFound = () => {
    if (!lostForm.item || !lostForm.location || !lostForm.description) {
      setMessage('Please complete the lost & found item details.')
      return
    }

    setLostFound((current) => [
      {
        id: Date.now(),
        item: lostForm.item,
        type: lostForm.type,
        location: lostForm.location,
        contact: lostForm.contact || user?.email || 'department@gpmitconnect.edu',
        description: lostForm.description,
        updatedAt: new Date().toISOString(),
      },
      ...current,
    ])
    setLostForm({
      item: '',
      type: 'Lost',
      location: '',
      contact: user?.email ?? '',
      description: '',
    })
    setMessage('Lost & found update published to the community board.')
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Department hub"
        title="Department showcase"
        description="A frontend showcase for proposal modules like academic tracking, projects, alumni, forums, lost & found, events, and placement readiness."
        actions={
          <>
            <Button component={RouterLink} to="/dashboard" variant="outlined">
              Dashboard
            </Button>
            <Button component={RouterLink} to="/profile" variant="contained">
              My profile
            </Button>
          </>
        }
      />

      {message ? <Alert severity="success">{message}</Alert> : null}

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            label="Tracked subjects"
            value={trackerItems.length}
            helper="Attendance and internal progress across semester subjects"
            icon={<AssignmentTurnedIn />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            label="Mini projects"
            value={projects.length}
            helper="Student repository entries with source and demo links"
            icon={<FolderOpen />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            label="Alumni mentors"
            value={alumniMentors.length}
            helper="Profiles available for guidance and sessions"
            icon={<Groups />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            label="Community threads"
            value={threads.length}
            helper="Discussion forum and peer support questions"
            icon={<Forum />}
          />
        </Grid>
      </Grid>

      <Panel
        title="Upcoming programs"
        subtitle="Industrial visits, fest registrations, placements, and digital notice board updates"
        action={
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Button component={RouterLink} to="/profile" variant="outlined">
              My profile
            </Button>
            <Button component={RouterLink} to="/dashboard" variant="contained">
              Dashboard
            </Button>
          </Stack>
        }
      >
        <Grid container spacing={2}>
          {upcomingPrograms.map((program) => (
            <Grid key={program.title} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Box className="list-card">
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Box className="metric-icon" sx={{ width: 40, height: 40, mb: 0 }}>
                    {program.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800 }}>{program.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {program.date}
                    </Typography>
                  </Box>
                </Stack>
                <Chip label={program.status} size="small" sx={{ mt: 1.5 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {program.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Panel>

      {/* Animated tab bar with Framer Motion sliding indicator */}
      <Box
        sx={{
          display: 'flex',
          gap: 0,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          overflowX: 'auto',
          pb: 0,
        }}
        role="tablist"
      >
        {([
          { key: 'tracker',   label: 'Academic tracker' },
          { key: 'projects',  label: 'Project repository' },
          { key: 'network',   label: 'Network' },
          { key: 'community', label: 'Community board' },
        ] as const).map((tab) => {
          const isActive = section === tab.key
          return (
            <Box
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleSectionChange({} as SyntheticEvent, tab.key)}
              sx={{
                position: 'relative',
                px: 2.5,
                py: 1.5,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontSize: 14,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                transition: 'color 0.2s',
                userSelect: 'none',
                '&:hover': { color: 'rgba(255,255,255,0.8)' },
              }}
            >
              {tab.label}
              {isActive ? (
                <motion.div
                  layoutId="hub-tab-indicator"
                  style={{
                    position: 'absolute',
                    bottom: -1,
                    left: 0,
                    right: 0,
                    height: 2,
                    borderRadius: 2,
                    background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              ) : null}
            </Box>
          )
        })}
      </Box>

      <AnimatePresence mode="wait">
        {section === 'tracker' ? (
          <motion.div
            key="tracker"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <Grid container spacing={2.5}>
              {trackerItems.map((item) => (
                <Grid key={item.subject} size={{ xs: 12, lg: 6 }}>
                  <Panel
                    title={item.subject}
                    subtitle={`Faculty: ${item.faculty}`}
                    action={<Chip label={item.status} color="secondary" size="small" />}
                  >
                    <Stack spacing={2}>
                      {[
                        { label: 'Attendance', value: item.attendance },
                        { label: 'Internal marks', value: item.internal },
                        { label: 'Practicals', value: item.practical },
                        { label: 'Assignments', value: item.assignments },
                      ].map((progressItem) => (
                        <Box key={progressItem.label} className="list-card">
                          <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
                            <Typography sx={{ fontWeight: 700 }}>{progressItem.label}</Typography>
                            <Typography color="text.secondary">{progressItem.value}%</Typography>
                          </Stack>
                          <Box sx={{ position: 'relative', mt: 1.5, height: 12, borderRadius: 999, bgcolor: 'rgba(226,232,240,0.16)', overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.35)' }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progressItem.value}%` }}
                              transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                height: '100%',
                                borderRadius: 999,
                                background: 'linear-gradient(90deg, #f8fafc 0%, #e2e8f0 48%, #ffffff 62%, #cbd5e1 100%)',
                                boxShadow: '0 0 14px rgba(248,250,252,0.26), inset 0 1px 0 rgba(255,255,255,0.72)',
                              }}
                            />
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Panel>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {section === 'projects' ? (
          <motion.div key="projects" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Panel
              title="Submit mini project"
              subtitle="Upload source code, documentation, and demo links"
            >
              <Stack spacing={2}>
                <TextField
                  label="Project title"
                  value={projectForm.title}
                  onChange={(event) => setProjectForm({ ...projectForm, title: event.target.value })}
                  fullWidth
                />
                <TextField
                  label="Team name"
                  value={projectForm.team}
                  onChange={(event) => setProjectForm({ ...projectForm, team: event.target.value })}
                  fullWidth
                />
                <TextField
                  label="Tech stack"
                  value={projectForm.stack}
                  onChange={(event) => setProjectForm({ ...projectForm, stack: event.target.value })}
                  helperText="Separate stack items with commas"
                  fullWidth
                />
                <TextField
                  label="Mentor"
                  value={projectForm.mentor}
                  onChange={(event) => setProjectForm({ ...projectForm, mentor: event.target.value })}
                  fullWidth
                />
                <TextField
                  label="Repository URL"
                  value={projectForm.repoUrl}
                  onChange={(event) => setProjectForm({ ...projectForm, repoUrl: event.target.value })}
                  fullWidth
                />
                <TextField
                  label="Demo URL"
                  value={projectForm.demoUrl}
                  onChange={(event) => setProjectForm({ ...projectForm, demoUrl: event.target.value })}
                  fullWidth
                />
                <TextField
                  label="Summary"
                  value={projectForm.summary}
                  onChange={(event) => setProjectForm({ ...projectForm, summary: event.target.value })}
                  multiline
                  minRows={4}
                  fullWidth
                />
                <Button variant="contained" onClick={submitProject}>
                  Publish project
                </Button>
              </Stack>
            </Panel>
          </Grid>

          <Grid size={{ xs: 12, lg: 8 }}>
            <Panel title="Project repository" subtitle="Current mini projects available to the next batch">
              <Stack spacing={1.5}>
                {projects.map((project) => (
                  <Box key={project.id} className="list-card">
                    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                      <Chip label={project.status} color="secondary" size="small" />
                      {project.stack.map((stackItem) => (
                        <Chip key={stackItem} label={stackItem} variant="outlined" size="small" />
                      ))}
                    </Stack>
                    <Typography sx={{ mt: 1.5, fontWeight: 800 }}>{project.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {project.team} · Mentor: {project.mentor}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {project.summary}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      useFlexGap
                      sx={{ flexWrap: 'wrap', mt: 1.5, justifyContent: 'space-between' }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Submitted {formatDateTime(project.submittedAt)}
                      </Typography>
                      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                        <Button href={project.repoUrl} target="_blank" rel="noreferrer" size="small">
                          Source code
                        </Button>
                        <Button href={project.demoUrl} target="_blank" rel="noreferrer" size="small">
                          Demo
                        </Button>
                      </Stack>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Panel>
          </Grid>
          </Grid>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {section === 'network' ? (
          <motion.div key="network" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Panel title="Alumni network" subtitle="Guidance and mentorship from passed-out batches">
              <Stack spacing={1.5}>
                {alumniMentors.map((mentor) => (
                  <Box key={mentor.id} className="list-card">
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                      <Box className="metric-icon" sx={{ width: 42, height: 42, mb: 0 }}>
                        <School />
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 800 }}>{mentor.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {mentor.role} · {mentor.company}
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Batch {mentor.batch} · {mentor.focus}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Panel>
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <Panel title="Student achievements" subtitle="Certificates, competitions, and sports records">
              <Stack spacing={1.5}>
                {initialAchievements.map((achievement) => (
                  <Box key={achievement.id} className="list-card">
                    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                      <Chip label={achievement.category} size="small" />
                      <Chip label={achievement.year} size="small" variant="outlined" />
                    </Stack>
                    <Typography sx={{ mt: 1.5, fontWeight: 800 }}>{achievement.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {achievement.issuer}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {achievement.description}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Panel>
          </Grid>
          </Grid>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {section === 'community' ? (
          <motion.div key="community" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Panel title="Discussion forum" subtitle="Post doubts and share subject-wise solutions">
              <Stack spacing={2}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <TextField
                      label="Subject"
                      value={threadForm.subject}
                      onChange={(event) =>
                        setThreadForm({ ...threadForm, subject: event.target.value })
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <TextField
                      label="Discussion title"
                      value={threadForm.title}
                      onChange={(event) => setThreadForm({ ...threadForm, title: event.target.value })}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <Button variant="contained" sx={{ height: '100%' }} onClick={submitThread}>
                      Post
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Your doubt or solution"
                      value={threadForm.description}
                      onChange={(event) =>
                        setThreadForm({ ...threadForm, description: event.target.value })
                      }
                      multiline
                      minRows={4}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <Stack spacing={1.5}>
                  {threads.map((thread) => (
                    <Box key={thread.id} className="list-card">
                      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                        {thread.tags.map((tag) => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" />
                        ))}
                      </Stack>
                      <Typography sx={{ mt: 1.5, fontWeight: 800 }}>{thread.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {thread.subject} · {thread.author}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {thread.replies} replies · Updated {formatDateTime(thread.updatedAt)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Panel>
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <Panel title="Lost & found" subtitle="A simple board for misplaced items and quick updates">
              <Stack spacing={2}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      select
                      fullWidth
                      label="Type"
                      value={lostForm.type}
                      onChange={(event) =>
                        setLostForm({ ...lostForm, type: event.target.value as 'Lost' | 'Found' })
                      }
                    >
                      <MenuItem value="Lost">Lost</MenuItem>
                      <MenuItem value="Found">Found</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Item"
                      value={lostForm.item}
                      onChange={(event) => setLostForm({ ...lostForm, item: event.target.value })}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Location"
                      value={lostForm.location}
                      onChange={(event) => setLostForm({ ...lostForm, location: event.target.value })}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Contact"
                      value={lostForm.contact}
                      onChange={(event) => setLostForm({ ...lostForm, contact: event.target.value })}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Button variant="contained" sx={{ height: '100%' }} onClick={submitLostFound}>
                      Publish
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Description"
                      value={lostForm.description}
                      onChange={(event) =>
                        setLostForm({ ...lostForm, description: event.target.value })
                      }
                      multiline
                      minRows={3}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <Stack spacing={1.5}>
                  {lostFound.map((item) => (
                    <Box key={item.id} className="list-card">
                      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                        <Chip label={item.type} color="secondary" size="small" />
                        <Chip label={item.location} variant="outlined" size="small" />
                      </Stack>
                      <Typography sx={{ mt: 1.5, fontWeight: 800 }}>{item.item}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.contact} · Updated {formatDateTime(item.updatedAt)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Panel>
          </Grid>
          </Grid>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Stack>
  )
}
