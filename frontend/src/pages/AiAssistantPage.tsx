import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { motion } from 'framer-motion'
import {
  Alert,
  Button,
  Chip,
  Grid,
  Stack,
  TextField,
} from '@mui/material'
import {
  Bot,
  FileUp,
  History,
  Loader2,
  Paperclip,
  SendHorizontal,
  X,
  RefreshCcw,
  Lightbulb,
} from 'lucide-react'

import { PageHeader } from '../components/PageHeader'
import { Panel } from '../components/Panel'
import { api } from '../lib/api'
import type { AiAnswer } from '../types'

const promptSuggestions = [
  'Explain cloud computing in simple words.',
  'Generate a Java program for linked list insertion.',
  'Summarize DBMS notes for viva.',
  'Create 10 viva questions for Spring Boot.',
]

type ChatMessage = {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  liveModel?: boolean
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-300">
        <Bot size={16} />
      </span>
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-amber-300 [animation-delay:-0.2s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-amber-300 [animation-delay:-0.1s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-amber-300" />
      </div>
    </div>
  )
}

/* Typewriter component — types out text one character at a time */
function TypewriterText({ text, speed = 14 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    if (!text) return
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <p className="whitespace-pre-wrap text-sm leading-7">
      {displayed}
      {!done && (
        <span
          style={{
            display: 'inline-block',
            width: 2,
            height: '1em',
            background: '#fbbf24',
            marginLeft: 2,
            verticalAlign: 'text-bottom',
            animation: 'blink-cursor 0.7s steps(1) infinite',
          }}
        />
      )}
    </p>
  )
}

export function AiAssistantPage() {
  const [prompt, setPrompt] = useState(promptSuggestions[0])
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      content:
        'Hi! I can explain topics, generate programs, summarize notes, and create viva questions for your IT subjects.',
      timestamp: new Date().toISOString(),
    },
  ])
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [result, setResult] = useState<AiAnswer | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, loading])

  const history = useMemo(
    () => messages.filter((message) => message.role === 'user').slice(-6).reverse(),
    [messages],
  )

  const askAssistant = async (nextPrompt?: string) => {
    const value = (nextPrompt ?? prompt).trim()
    if (!value || loading) {
      return
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: value,
      timestamp: new Date().toISOString(),
    }

    setMessages((current) => [...current, userMessage])
    setLoading(true)
    setError('')

    try {
      const { data } = await api.post<AiAnswer>('/ai/ask', { prompt: value })
      setResult(data)
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.answer,
          timestamp: new Date().toISOString(),
          liveModel: data.liveModel,
        },
      ])
      setPrompt('')
    } catch {
      setError('Unable to get a response from the assistant right now.')
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content:
            'The live model is unavailable at the moment. Please try a simpler prompt or check the backend AI settings.',
          timestamp: new Date().toISOString(),
          liveModel: false,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(event.target.files ?? []).map((file) => file.name)
    setSelectedFiles((current) => [...current, ...incoming].slice(0, 5))
    event.target.value = ''
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="AI academic assistant"
        title="Chat with GPM AI"
        description="A premium Gemini-style assistant for explanations, code samples, summaries, and viva prep."
        chips={
          <>
            <span className="portal-accent-badge">Gemini-ready</span>
            <span className="portal-badge">Conversation history</span>
            <span className="portal-badge">File uploads</span>
          </>
        }
      />

      {error ? (
        <Alert
          severity="error"
          sx={{ borderRadius: 3, bgcolor: 'rgba(248, 113, 113, 0.1)', color: 'inherit' }}
        >
          {error}
        </Alert>
      ) : null}

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Panel title="Conversation history" subtitle="Recent questions you asked the assistant">
            <Stack spacing={1.25}>
              {history.length > 0 ? (
                history.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => setPrompt(entry.content)}
                    className="list-card text-left"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-300">
                        <History size={16} />
                      </span>
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-medium text-white">{entry.content}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-400">
                          Tap to reuse
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-sm text-slate-400">
                  Your past prompts will appear here.
                </div>
              )}
            </Stack>

            <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="text-amber-300" size={16} />
                <p className="text-sm font-medium text-white">Suggested prompts</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {promptSuggestions.map((item) => (
                  <Chip key={item} label={item} onClick={() => setPrompt(item)} />
                ))}
              </div>
            </div>
          </Panel>

          <Panel title="Uploads" subtitle="Attach notes or screenshots for better answers" className="mt-3">
            <label className="flex cursor-pointer items-center gap-3 rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-4 text-sm text-slate-300 transition hover:border-amber-300/20 hover:bg-white/[0.04]">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-300">
                <FileUp size={18} />
              </span>
              <span className="flex-1">
                <span className="block font-medium text-white">Upload files</span>
                <span className="block text-xs uppercase tracking-[0.24em] text-slate-400">
                  PDF, images, notes
                </span>
              </span>
              <input type="file" multiple className="hidden" onChange={handleFiles} />
            </label>

            {selectedFiles.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedFiles.map((file) => (
                  <span
                    key={file}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-slate-200"
                  >
                    {file}
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedFiles((current) => current.filter((currentFile) => currentFile !== file))
                      }
                      className="rounded-full text-slate-400 transition hover:text-white"
                      aria-label={`Remove ${file}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-400">No files attached yet.</p>
            )}
          </Panel>
        </Grid>

        <Grid size={{ xs: 12, lg: 9 }}>
          <Panel
            title="GPM AI workspace"
            subtitle={
              result?.liveModel ? 'Live Gemini response' : 'Chat-friendly interface with a premium look'
            }
            action={
              <div className="flex items-center gap-2">
                <span className="portal-badge">Prompt: 1</span>
                <span className="portal-accent-badge">Live chat</span>
              </div>
            }
          >
            <div className="flex h-[68vh] flex-col rounded-[24px] border border-white/10 bg-slate-950/40">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-white">ChatGPT-style assistant</p>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Ask for notes, code, summaries, and viva prep
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setMessages([
                        {
                          id: Date.now(),
                          role: 'assistant',
                          content:
                            'Hi! I can explain topics, generate programs, summarize notes, and create viva questions for your IT subjects.',
                          timestamp: new Date().toISOString(),
                        },
                      ])
                      setPrompt(promptSuggestions[0])
                      setSelectedFiles([])
                      setResult(null)
                    }}
                    startIcon={<RefreshCcw size={16} />}
                  >
                    New chat
                  </Button>
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className={message.role === 'user' ? 'ml-auto max-w-[82%]' : 'mr-auto max-w-[82%]'}
                  >
                    <div
                      className={
                        message.role === 'user'
                          ? 'rounded-[26px] rounded-tr-md border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-slate-50 shadow-[0_14px_40px_rgba(251,191,36,0.08)]'
                          : 'rounded-[26px] rounded-tl-md border border-white/10 bg-white/[0.04] px-4 py-3 text-slate-100'
                      }
                    >
                      {message.role === 'user' ? (
                        <p className="whitespace-pre-wrap text-sm leading-7">{message.content}</p>
                      ) : (
                        <TypewriterText text={message.content} speed={12} />
                      )}
                      <div className="mt-2 flex items-center justify-between gap-3 text-[0.65rem] uppercase tracking-[0.24em] text-slate-400">
                        <span>{message.role === 'user' ? 'You' : 'GPM AI'}</span>
                        <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {loading ? <TypingIndicator /> : null}
                <div ref={bottomRef} />
              </div>

              <div className="border-t border-white/10 px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  {promptSuggestions.slice(0, 3).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPrompt(item)}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-amber-300/20 hover:bg-white/[0.06]"
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-end">
                  <TextField
                    label="Prompt"
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    multiline
                    minRows={4}
                    fullWidth
                  />
                  <div className="flex gap-2 lg:flex-col">
                    <Button component="label" variant="outlined" startIcon={<Paperclip size={16} />}>
                      Attach
                      <input type="file" multiple hidden onChange={handleFiles} />
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => void askAssistant()}
                      disabled={loading || !prompt.trim()}
                      startIcon={loading ? <Loader2 className="animate-spin" size={16} /> : <SendHorizontal size={16} />}
                    >
                      {loading ? 'Thinking...' : 'Send'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </Grid>
      </Grid>
    </Stack>
  )
}
