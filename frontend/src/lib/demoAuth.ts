import type { UserProfile } from '../types'

export interface DemoAccount {
  role: string
  email: string
  password: string
  user: UserProfile
}

export const demoAccounts: DemoAccount[] = [
  {
    role: 'Student',
    email: 'student@gpmitconnect.edu',
    password: 'student123',
    user: {
      id: 101,
      fullName: 'Saad Shaikh',
      email: 'student@gpmitconnect.edu',
      role: 'STUDENT',
      department: 'Information Technology',
      yearOfStudy: 'Final Year',
      division: 'B',
      phoneNumber: '9876543210',
    },
  },
  {
    role: 'Faculty',
    email: 'faculty@gpmitconnect.edu',
    password: 'faculty123',
    user: {
      id: 201,
      fullName: 'Prof. Mehta',
      email: 'faculty@gpmitconnect.edu',
      role: 'FACULTY',
      department: 'Information Technology',
      yearOfStudy: null,
      division: null,
      phoneNumber: '9876543211',
    },
  },
  {
    role: 'Admin',
    email: 'admin@gpmitconnect.edu',
    password: 'admin123',
    user: {
      id: 301,
      fullName: 'Admin GPM',
      email: 'admin@gpmitconnect.edu',
      role: 'ADMIN',
      department: 'Information Technology',
      yearOfStudy: null,
      division: null,
      phoneNumber: '9876543212',
    },
  },
  {
    role: 'HOD',
    email: 'hod@gpmitconnect.edu',
    password: 'hod123',
    user: {
      id: 401,
      fullName: 'Dr. Head of Department',
      email: 'hod@gpmitconnect.edu',
      role: 'HOD',
      department: 'Information Technology',
      yearOfStudy: null,
      division: null,
      phoneNumber: '9876543213',
    },
  },
]
