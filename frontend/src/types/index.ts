export type Role = 'STUDENT' | 'FACULTY' | 'ADMIN' | 'HOD'

export interface UserProfile {
  id: number
  fullName: string
  email: string
  role: Role
  department: string
  yearOfStudy: string | null
  division: string | null
  phoneNumber: string | null
}

export interface AuthResponse {
  token: string
  user: UserProfile
}

export interface RegisterInput {
  fullName: string
  email: string
  password: string
  role: Role
  yearOfStudy?: string
  division?: string
  phoneNumber?: string
}

export interface Notice {
  id: number
  title: string
  content: string
  category: 'GENERAL' | 'EXAM' | 'EVENT' | 'PLACEMENT'
  pinned: boolean
  publishedAt: string
  author: string
}

export interface DashboardSummary {
  userName: string
  role: Role
  totalAttendanceEntries: number
  attendancePercentage: number
  noticeCount: number
  resourceCount: number
  internshipCount: number
  placementCount: number
  latestNotices: Array<{
    title: string
    category: Notice['category']
    pinned: boolean
    publishedAt: string
  }>
  todaysSchedule: Array<{
    title: string
    slot: string
    room: string
    facultyName: string
  }>
  topOpportunities: Array<{
    title: string
    company: string
    type: 'INTERNSHIP' | 'PLACEMENT'
    deadline: string
    location: string
  }>
}

export interface AttendanceEntry {
  id: number
  subject: string
  date: string
  status: 'PRESENT' | 'ABSENT' | 'LATE'
  markedBy: string
  remarks: string | null
}

export interface AttendanceSummary {
  subject: string
  presentCount: number
  totalClasses: number
  percentage: number
}

export interface TimetableEntry {
  id: number
  title: string
  subjectName: string
  facultyName: string
  room: string
  dayOfWeek: string
  startTime: string
  endTime: string
  type: 'LECTURE' | 'LAB' | 'EXAM'
  audience: string
}

export interface Subject {
  id: number
  code: string
  name: string
  semester: number
  facultyName: string
}

export interface AcademicResource {
  id: number
  title: string
  description: string
  type: 'PDF' | 'NOTE' | 'VIDEO' | 'LINK' | 'MANUAL'
  resourceUrl: string
  subjectName: string
  uploadedAt: string
  uploader: string
}

export interface Opportunity {
  id: number
  title: string
  company: string
  type: 'INTERNSHIP' | 'PLACEMENT'
  location: string
  stipend: string
  applyUrl: string
  deadline: string
  description: string
  createdAt: string
}

export interface AiAnswer {
  answer: string
  liveModel: boolean
}
