# GPM IT Connect

GPM IT Connect is a full-stack academic portal for the Information Technology Department of Government Polytechnic Mumbai. It is designed as a final year diploma project and includes a role-based dashboard for students, faculty, admin, and HOD.

## Implemented modules

- JWT authentication with role-based access control
- Student and staff dashboard
- Attendance records and analytics
- Timetable view
- Notice board
- Resource center
- Internship and placement portal
- Faculty directory
- AI assistant endpoint with Gemini integration support
- Seed data for demo accounts and sample records

## Tech stack

- Frontend: React, TypeScript, Vite, Material UI
- Backend: Spring Boot, Spring Security, Spring Data JPA
- Database: MySQL in Docker, H2 for local development fallback
- Deployment: Docker, Docker Compose, Nginx

## Project structure

```text
.
├── backend
├── frontend
├── docker-compose.yml
├── GPM_IT_Connect_Project_Proposal.md
└── README.md
```

## Demo accounts

- Student: `student@gpmitconnect.edu` / `student123`
- Faculty: `faculty@gpmitconnect.edu` / `faculty123`
- Admin: `admin@gpmitconnect.edu` / `admin123`
- HOD: `hod@gpmitconnect.edu` / `hod123`

## Run locally without Docker

### Backend

```bash
cd backend
mvn spring-boot:run
```

The backend starts on `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on `http://localhost:5173`.

## Run with Docker

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`
- MySQL: `localhost:3306`

## Gemini integration

The AI assistant works in demo mode by default. To enable live Gemini responses, set `GEMINI_API_KEY` before starting the backend or Docker Compose.

Example:

```bash
export GEMINI_API_KEY=your_api_key_here
docker compose up --build
```

## Verified commands

- `cd backend && mvn test`
- `cd frontend && npm run build`

## Notes

- The backend uses H2 by default for quick local runs, so you can start developing immediately without MySQL.
- Docker Compose switches the backend to MySQL automatically.
- Seed data is inserted on first startup only.
