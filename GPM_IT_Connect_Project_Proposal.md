# Final Year Diploma Project Proposal

## Project Title

**GPM IT Connect - Smart Student Portal for Information Technology Department**

## 1. Introduction

The Information Technology Department of Government Polytechnic Mumbai handles academic coordination, notices, attendance records, learning resources, events, internships, and student communication across multiple student batches. At present, much of this information is typically distributed across notice boards, messaging groups, spreadsheets, and manual records. This creates delays, duplication of effort, and difficulty in tracking important academic activities.

To solve this problem, we propose **GPM IT Connect**, a centralized web and mobile-friendly student portal designed specifically for the IT Department. The platform will help students, faculty, class coordinators, and the Head of Department manage academic and departmental activities through a single digital system.

Based on the department information page, the IT Department has **120+ sanctioned seats** across regular and minority shifts, which makes a centralized digital platform highly useful for efficient coordination and communication.

## 2. Problem Statement

The current flow of academic and departmental information is fragmented and partially manual. Students often depend on multiple channels to check attendance, notes, notices, internship updates, and event information. Faculty members also need a better way to manage attendance, share resources, and communicate updates. There is a need for one integrated platform that improves transparency, accessibility, and record management for all stakeholders in the department.

## 3. Project Objective

The main objective of this project is to develop a centralized portal for the IT Department that can be accessed through desktop and mobile devices. The system will:

- Provide one platform for students, faculty, coordinators, and HOD.
- Digitize attendance, notices, timetable, and academic resource sharing.
- Improve communication within the department.
- Support internship, placement, and event-related activities.
- Offer a scalable foundation for future smart features such as AI support and alumni networking.

## 4. Scope of the Project

The proposed system will cover the following major functions:

- User authentication and role-based access
- Attendance management
- Timetable and schedule management
- Notice and circular publishing
- Resource center for notes and study material
- Internship and placement information
- Event and industrial visit coordination
- Student academic tracking dashboard

Advanced features such as AI assistance, alumni network, project repository, and discussion forum may be added as enhancement modules depending on available development time.

## 5. Proposed Users

The system will support the following user roles:

1. Student
2. Faculty
3. Admin
4. HOD

## 6. Proposed Technology Stack

### Frontend

- React.js
- Tailwind CSS
- Material UI

### Backend

- Spring Boot (Java)

### Database

- MySQL

### Authentication and Security

- JWT Authentication
- Role-Based Access Control

### Deployment

- Docker
- Nginx
- AWS / Render / Railway

### Notifications

- Firebase Cloud Messaging (FCM)
- Email Notifications

## 7. System Architecture

```text
React Frontend
      |
   REST APIs
      |
Spring Boot Backend
      |
 MySQL Database
      |
File Storage (Notes, PDFs, Images)
```

## 8. Core Modules

### 8.1 User Management

- Login
- Registration
- Forgot Password
- Profile Management
- Role-Based Access

### 8.2 Attendance Management

- Faculty marks attendance
- Student attendance percentage
- Subject-wise attendance
- Defaulter list
- Attendance analytics

### 8.3 Smart Timetable

- Calendar view
- Weekly view
- Today's lectures
- Lab schedule
- Exam timetable

### 8.4 Important Updates

- Notices
- Circulars
- Exam forms
- Result announcements

### 8.5 Resource Center

- Curriculum PDFs
- Notes
- Lab manuals
- Previous year papers
- E-books
- Video tutorials

### 8.6 Fest Management

- Event registration
- Team formation
- Event schedule
- Winners gallery

### 8.7 Industrial Visit Module

- Upcoming visits
- Registration
- Visit reports
- Certificates

### 8.8 Internship Portal

- Internship opportunities
- Company details
- Apply links
- Internship history

## 9. Additional Features

The following features can be added to increase the practical value and innovation level of the project:

- Placement Cell
- Mini Project Repository
- Faculty Directory
- Student Achievement Portal
- Lost and Found
- Discussion Forum
- Alumni Network
- Academic Tracker
- Digital Notice Board

## 10. USP Feature

### AI Assistant

An AI-powered assistant can be integrated as the standout feature of the system. It can help students by:

- Explaining technical concepts
- Generating simple Java programs
- Summarizing notes
- Creating viva questions

This feature can make the project more innovative and attractive during final evaluation and exhibition.

## 11. Database Tables

The proposed database design will include the following main tables:

```text
Users
Students
Faculty
Attendance
Subjects
Timetable
Notices
Resources
Events
IndustrialVisits
Internships
Projects
Placements
Achievements
Alumni
```

## 12. Expected Outcomes

After implementation, the system is expected to provide:

- Faster communication between department and students
- Better tracking of academic records
- Easy access to study material and notices
- Reduced manual work for faculty and coordinators
- Improved support for internship, placement, and departmental activities
- A modern digital identity for the IT Department

## 13. Feasibility

The project is technically feasible because it uses widely adopted web technologies such as React, Spring Boot, and MySQL. It is also suitable for a team of 3 to 4 students because the work can be divided into frontend, backend, database, and testing/deployment tasks.

The project is scalable, modular, and can be developed in phases:

- Phase 1: Authentication, attendance, timetable, notices, resources
- Phase 2: Internship, placement, events, industrial visits
- Phase 3: AI assistant, alumni network, project repository, advanced analytics

## 14. Features to Prioritize

### Must Have

- Login
- Attendance
- Timetable
- Notices
- Resources

### Good to Have

- Internship Portal
- Placement Cell
- Event/Fest Module
- Industrial Visits

### USP for Better Evaluation

- AI Assistant
- Project Repository
- Alumni Network

## 15. Expected Viva Questions

- Why React?
- Why Spring Boot?
- Why JWT?
- What is REST API?
- What is role-based authentication?
- Explain MVC architecture.
- Explain database normalization.
- How did you implement the attendance module?
- How is data secured?

## 16. Conclusion

**GPM IT Connect** is a practical and industry-relevant final year diploma project that addresses real problems in academic communication and departmental management. It combines core academic modules with modern web technologies and leaves room for advanced features like AI assistance and digital collaboration. The project has strong real-world usability, a clear technical structure, and enough scope to demonstrate both development skills and system design understanding during viva and exhibition.

## 17. Reference

1. Government Polytechnic Mumbai, Information Technology Department  
   [https://gpmumbai.ac.in/gpmweb/departments/information-technology/](https://gpmumbai.ac.in/gpmweb/departments/information-technology/)
