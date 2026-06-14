import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'

import App from './App'
import { AuthProvider } from './context/AuthContext'
import './index.css'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0f172a',
      light: '#1d4ed8',
      contrastText: '#f8fafc',
    },
    secondary: {
      main: '#fbbf24',
      light: '#fde68a',
      contrastText: '#0b1220',
    },
    background: {
      default: '#050b15',
      paper: 'rgba(9, 15, 28, 0.84)',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#a7b4c7',
    },
  },
  typography: {
    fontFamily: '"IBM Plex Sans", sans-serif',
    h3: {
      fontFamily: '"Outfit", sans-serif',
      letterSpacing: '-0.04em',
      fontWeight: 800,
    },
    h4: {
      fontFamily: '"Outfit", sans-serif',
      letterSpacing: '-0.03em',
      fontWeight: 800,
    },
    h5: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
    },
    h6: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          textTransform: 'none',
          fontWeight: 700,
          paddingInline: 18,
          paddingBlock: 12,
          boxShadow: 'none',
        },
        contained: {
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          color: '#0b1220',
          boxShadow: '0 16px 34px rgba(251, 191, 36, 0.18)',
          '&:hover': {
            background: 'linear-gradient(135deg, #ffd75f 0%, #fbbf24 100%)',
            boxShadow: '0 20px 40px rgba(251, 191, 36, 0.24)',
          },
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.14)',
          background: 'rgba(255, 255, 255, 0.03)',
          '&:hover': {
            borderColor: 'rgba(251, 191, 36, 0.28)',
            background: 'rgba(255, 255, 255, 0.06)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          transition: 'border-color 180ms ease, background 180ms ease, box-shadow 180ms ease',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.12)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(251, 191, 36, 0.28)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#fbbf24',
            borderWidth: 1.5,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#a7b4c7',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 52,
        },
        indicator: {
          height: 3,
          borderRadius: 999,
          backgroundColor: '#fbbf24',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          minHeight: 52,
          color: '#a7b4c7',
          fontWeight: 700,
          letterSpacing: 0,
          paddingInline: 18,
          '&.Mui-selected': {
            color: '#f8fafc',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
          letterSpacing: '0.01em',
          height: 32,
        },
        colorSecondary: {
          color: '#0b1220',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          marginBottom: 8,
          padding: '14px 16px',
          color: '#a7b4c7',
          transition: 'transform 180ms ease, background-color 180ms ease, color 180ms ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            color: '#f8fafc',
            transform: 'translateX(2px)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(251, 191, 36, 0.12)',
            color: '#f8fafc',
            boxShadow: 'inset 0 0 0 1px rgba(251, 191, 36, 0.18)',
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'rgba(251, 191, 36, 0.16)',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 42,
          color: 'inherit',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
