import type { Role } from '../types'

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
  }).format(new Date(value))

export const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))

export const formatRole = (role: Role) =>
  role.charAt(0) + role.slice(1).toLowerCase()

export const humanize = (value: string) =>
  value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
