import { useState, type SyntheticEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Users,
  LogIn,
  UserPlus,
} from 'lucide-react'

import { BrandMark } from '../components/BrandMark'
import { useAuth } from '../context/AuthContext'
import { demoAccounts } from '../lib/demoAuth'
import type { RegisterInput, Role } from '../types'

type AuthMode = 'login' | 'register'

interface RegisterFormState extends RegisterInput {
  confirmPassword: string
}

const roleOptions: Array<{ label: string; value: Role }> = [
  { label: 'Student', value: 'STUDENT' },
  { label: 'Faculty', value: 'FACULTY' },
  { label: 'Admin', value: 'ADMIN' },
  { label: 'HOD', value: 'HOD' },
]

const featurePills = [
  'Attendance analytics',
  'Timetable management',
  'Notice board',
  'Resource center',
  'Project repository',
  'Alumni network',
  'AI assistant',
]

const spotlight = [
  { label: 'Role-based access', icon: ShieldCheck },
  { label: 'Academic modules', icon: BookOpen },
  { label: 'Collaboration-ready', icon: Users },
  { label: 'AI assisted learning', icon: Sparkles },
]

export function LoginPage() {
  const navigate = useNavigate()
  const { login, register } = useAuth()

  const [mode, setMode] = useState<AuthMode>('login')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [loginForm, setLoginForm] = useState({
    email: 'student@gpmitconnect.edu',
    password: 'student123',
  })
  const [registerForm, setRegisterForm] = useState<RegisterFormState>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
    yearOfStudy: 'Final Year',
    division: 'B',
    phoneNumber: '',
  })

  const handleModeChange = (_event: SyntheticEvent, nextMode: AuthMode) => {
    setMode(nextMode)
    setError('')
  }

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await login(loginForm.email, loginForm.password)
      navigate('/dashboard')
    } catch {
      setError('Login failed. Please verify the email and password.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match.')
      setSubmitting(false)
      return
    }

    try {
      await register({
        fullName: registerForm.fullName,
        email: registerForm.email,
        password: registerForm.password,
        role: registerForm.role,
        yearOfStudy: registerForm.yearOfStudy,
        division: registerForm.division,
        phoneNumber: registerForm.phoneNumber,
      })
      navigate('/dashboard')
    } catch {
      setError('Unable to create your account. Please review the form and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.section
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="portal-card flex h-full flex-col justify-between p-6 md:p-8 lg:p-10"
        >
          <div>
            <BrandMark className="mb-8" />
            <p className="text-[0.66rem] uppercase tracking-[0.38em] text-amber-300/90">
              Final Year Diploma Project
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.06em] text-white md:text-5xl xl:text-6xl">
              Smart student portal for academics, communication, and campus life.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-[1.02rem]">
              GPM IT Connect brings the Information Technology Department into one clean digital
              workspace built for students, faculty, coordinators, and the HOD.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {featurePills.map((pill) => (
                <span key={pill} className="portal-accent-badge">
                  {pill}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {spotlight.map((item) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300/10 text-amber-300">
                      <Icon size={18} />
                    </div>
                    <p className="mt-3 text-sm font-medium text-white">{item.label}</p>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">IT seats</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">120+</p>
                <p className="mt-1 text-sm text-slate-400">Regular and minority shift intake</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Security</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">JWT</p>
                <p className="mt-1 text-sm text-slate-400">Role-based access control</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">USP</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">AI</p>
                <p className="mt-1 text-sm text-slate-400">Gemini-powered learning helper</p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.66rem] uppercase tracking-[0.34em] text-amber-300/90">
                  Demo accounts
                </p>
                <p className="mt-1 text-sm text-slate-400">Tap any card to autofill a login</p>
              </div>
              <span className="portal-badge">Ready for exhibition</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {demoAccounts.map((account) => (
                <motion.button
                  type="button"
                  key={account.role}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setMode('login')
                    setLoginForm({ email: account.email, password: account.password })
                  }}
                  className="credential-card text-left"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{account.role}</p>
                      <p className="mt-1 text-sm text-slate-300">{account.email}</p>
                    </div>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-300">
                      <LogIn size={18} />
                    </span>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-2 text-xs text-slate-400">
                    <ArrowRight size={14} />
                    <span>{account.password}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.05 }}
          className="portal-card flex h-full flex-col p-6 md:p-8"
        >
          <div className="mb-6">
            <span className="portal-accent-badge">Secure portal access</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white">
              Join the GPM portal
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Sign in with a demo account or create a new department profile.
            </p>
          </div>

          <Tabs
            value={mode}
            onChange={handleModeChange}
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab label="Sign in" value="login" />
            <Tab label="Create account" value="register" />
          </Tabs>

          {error ? (
            <Alert
              severity="error"
              sx={{ mb: 2, borderRadius: 3, bgcolor: 'rgba(248, 113, 113, 0.12)' }}
            >
              {error}
            </Alert>
          ) : null}

          {mode === 'login' ? (
            <form className="flex flex-1 flex-col" onSubmit={handleLogin}>
              <Stack spacing={2.25}>
                <TextField
                  label="Email"
                  value={loginForm.email}
                  onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                  fullWidth
                />
                <TextField
                  label="Password"
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                  fullWidth
                />
                <Button
                  type="submit"
                  size="large"
                  variant="contained"
                  fullWidth
                  startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <GraduationCap size={18} />}
                  disabled={submitting}
                >
                  {submitting ? 'Entering portal...' : 'Enter portal'}
                </Button>
              </Stack>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-medium text-white">Why this portal stands out</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Built as a premium college dashboard with attendance, notices, timetable,
                  project repository, placement updates, and AI assistance in one place.
                </p>
              </div>
            </form>
          ) : (
            <form className="flex flex-1 flex-col" onSubmit={handleRegister}>
              <Stack spacing={2}>
                <TextField
                  label="Full name"
                  value={registerForm.fullName}
                  onChange={(event) =>
                    setRegisterForm({ ...registerForm, fullName: event.target.value })
                  }
                  fullWidth
                />
                <TextField
                  label="Email"
                  value={registerForm.email}
                  onChange={(event) =>
                    setRegisterForm({ ...registerForm, email: event.target.value })
                  }
                  fullWidth
                />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      select
                      fullWidth
                      label="Role"
                      value={registerForm.role}
                      onChange={(event) =>
                        setRegisterForm({
                          ...registerForm,
                          role: event.target.value as Role,
                        })
                      }
                    >
                      {roleOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Phone number"
                      value={registerForm.phoneNumber}
                      onChange={(event) =>
                        setRegisterForm({ ...registerForm, phoneNumber: event.target.value })
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Year of study"
                      value={registerForm.yearOfStudy}
                      onChange={(event) =>
                        setRegisterForm({ ...registerForm, yearOfStudy: event.target.value })
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Division"
                      value={registerForm.division}
                      onChange={(event) =>
                        setRegisterForm({ ...registerForm, division: event.target.value })
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <TextField
                  label="Password"
                  type="password"
                  value={registerForm.password}
                  onChange={(event) =>
                    setRegisterForm({ ...registerForm, password: event.target.value })
                  }
                  fullWidth
                />
                <TextField
                  label="Confirm password"
                  type="password"
                  value={registerForm.confirmPassword}
                  onChange={(event) =>
                    setRegisterForm({
                      ...registerForm,
                      confirmPassword: event.target.value,
                    })
                  }
                  fullWidth
                />
                <Typography variant="body2" color="text.secondary">
                  Students can keep the default year and division values. Faculty, admin, and HOD
                  can leave those fields as-is.
                </Typography>
                <Button
                  type="submit"
                  size="large"
                  variant="contained"
                  fullWidth
                  startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <UserPlus size={18} />}
                  disabled={submitting}
                >
                  {submitting ? 'Creating account...' : 'Create account'}
                </Button>
              </Stack>
            </form>
          )}
        </motion.section>
      </div>
    </div>
  )
}
