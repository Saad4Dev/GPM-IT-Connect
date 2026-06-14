package com.gpmitconnect.config;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import com.gpmitconnect.attendance.AttendanceRecord;
import com.gpmitconnect.attendance.AttendanceRepository;
import com.gpmitconnect.attendance.AttendanceStatus;
import com.gpmitconnect.notice.Notice;
import com.gpmitconnect.notice.NoticeCategory;
import com.gpmitconnect.notice.NoticeRepository;
import com.gpmitconnect.opportunity.Opportunity;
import com.gpmitconnect.opportunity.OpportunityRepository;
import com.gpmitconnect.opportunity.OpportunityType;
import com.gpmitconnect.resource.AcademicResource;
import com.gpmitconnect.resource.ResourceRepository;
import com.gpmitconnect.resource.ResourceType;
import com.gpmitconnect.subject.Subject;
import com.gpmitconnect.subject.SubjectRepository;
import com.gpmitconnect.timetable.EntryType;
import com.gpmitconnect.timetable.TimetableEntry;
import com.gpmitconnect.timetable.TimetableRepository;
import com.gpmitconnect.user.Role;
import com.gpmitconnect.user.User;
import com.gpmitconnect.user.UserRepository;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    ApplicationRunner seedData(
            UserRepository userRepository,
            SubjectRepository subjectRepository,
            AttendanceRepository attendanceRepository,
            TimetableRepository timetableRepository,
            NoticeRepository noticeRepository,
            ResourceRepository resourceRepository,
            OpportunityRepository opportunityRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() > 0) {
                return;
            }

            User admin = createUser("Admin GPM", "admin@gpmitconnect.edu", "admin123", Role.ADMIN, null, null, "9000000001",
                    passwordEncoder);
            User hod = createUser("Dr. Head of Department", "hod@gpmitconnect.edu", "hod123", Role.HOD, null, null,
                    "9000000002", passwordEncoder);
            User faculty = createUser("Prof. Mehta", "faculty@gpmitconnect.edu", "faculty123", Role.FACULTY, null, null,
                    "9000000003", passwordEncoder);
            User student = createUser("Aarav Patil", "student@gpmitconnect.edu", "student123", Role.STUDENT, "Final Year",
                    "A", "9000000004", passwordEncoder);

            userRepository.saveAll(List.of(admin, hod, faculty, student));

            Subject web = createSubject("IT601", "Web Development", 6, "Prof. Mehta");
            Subject cloud = createSubject("IT602", "Cloud Computing", 6, "Prof. Shah");
            Subject java = createSubject("IT603", "Advanced Java", 6, "Prof. Kulkarni");
            Subject project = createSubject("IT604", "Project Management", 6, "Prof. Joshi");
            subjectRepository.saveAll(List.of(web, cloud, java, project));

            attendanceRepository.saveAll(List.of(
                    createAttendance(student, web, faculty, LocalDate.now().minusDays(4), AttendanceStatus.PRESENT, "On time"),
                    createAttendance(student, cloud, faculty, LocalDate.now().minusDays(3), AttendanceStatus.LATE, "Joined late by 5 minutes"),
                    createAttendance(student, java, faculty, LocalDate.now().minusDays(2), AttendanceStatus.PRESENT, "Active participation"),
                    createAttendance(student, project, faculty, LocalDate.now().minusDays(1), AttendanceStatus.ABSENT, "Medical leave")));

            timetableRepository.saveAll(List.of(
                    createTimetable("Web Development Lecture", "Web Development", "Prof. Mehta", "Lab 3", DayOfWeek.MONDAY,
                            LocalTime.of(9, 0), LocalTime.of(10, 0), EntryType.LECTURE, "TYIF"),
                    createTimetable("Cloud Computing", "Cloud Computing", "Prof. Shah", "Room 205", DayOfWeek.MONDAY,
                            LocalTime.of(10, 15), LocalTime.of(11, 15), EntryType.LECTURE, "TYIF"),
                    createTimetable("Java Lab", "Advanced Java", "Prof. Kulkarni", "Lab 1", DayOfWeek.TUESDAY,
                            LocalTime.of(13, 0), LocalTime.of(15, 0), EntryType.LAB, "TYIF"),
                    createTimetable("Project Review", "Project Management", "Prof. Joshi", "Seminar Hall", DayOfWeek.WEDNESDAY,
                            LocalTime.of(11, 30), LocalTime.of(12, 30), EntryType.LECTURE, "TYIF"),
                    createTimetable("Aptitude Practice", "Placement Preparation", "Training Cell", "Room 302", DayOfWeek.FRIDAY,
                            LocalTime.of(14, 0), LocalTime.of(15, 0), EntryType.LECTURE, "TYIF")));

            noticeRepository.saveAll(List.of(
                    createNotice("Internal Assessment Schedule Released",
                            "Internal assessment tests for all final year students will begin next Monday.",
                            NoticeCategory.EXAM, true, faculty, LocalDateTime.now().minusDays(1)),
                    createNotice("Project Review Submission",
                            "Teams must submit the latest project progress PPT by Friday evening.",
                            NoticeCategory.GENERAL, true, hod, LocalDateTime.now().minusHours(6)),
                    createNotice("Hackathon Registration Open",
                            "Students can register for the inter-college hackathon using the department desk.",
                            NoticeCategory.EVENT, false, admin, LocalDateTime.now().minusDays(3))));

            resourceRepository.saveAll(List.of(
                    createResource("Cloud Computing Unit 3 Notes",
                            "Concise faculty notes for virtualization, scaling, and service models.",
                            ResourceType.NOTE,
                            "https://example.com/cloud-unit-3",
                            "Cloud Computing",
                            faculty,
                            LocalDateTime.now().minusDays(2)),
                    createResource("Advanced Java Lab Manual",
                            "Complete lab manual covering JDBC, Servlets, and Spring basics.",
                            ResourceType.MANUAL,
                            "https://example.com/advanced-java-lab-manual",
                            "Advanced Java",
                            faculty,
                            LocalDateTime.now().minusDays(5)),
                    createResource("Web Development Previous Year Paper",
                            "Solved question paper for university preparation.",
                            ResourceType.PDF,
                            "https://example.com/web-paper",
                            "Web Development",
                            admin,
                            LocalDateTime.now().minusDays(7))));

            opportunityRepository.saveAll(List.of(
                    createOpportunity("Frontend Intern", "TechBridge Labs", OpportunityType.INTERNSHIP, "Mumbai", "Rs. 12,000/month",
                            "https://example.com/intern-frontend", LocalDate.now().plusDays(12),
                            "Work on React dashboards and UI components for live client projects.", LocalDateTime.now().minusDays(1)),
                    createOpportunity("Java Developer Trainee", "Nova Systems", OpportunityType.PLACEMENT, "Navi Mumbai",
                            "CTC 3.6 LPA", "https://example.com/java-trainee", LocalDate.now().plusDays(18),
                            "Entry-level role for diploma graduates with strong Java and SQL basics.", LocalDateTime.now().minusDays(2)),
                    createOpportunity("Cloud Support Intern", "SkyServe", OpportunityType.INTERNSHIP, "Hybrid",
                            "Rs. 10,000/month", "https://example.com/cloud-intern", LocalDate.now().plusDays(25),
                            "Assist with deployment monitoring, documentation, and ticket resolution.", LocalDateTime.now().minusDays(4))));
        };
    }

    private User createUser(String fullName, String email, String password, Role role, String yearOfStudy, String division,
            String phoneNumber, PasswordEncoder passwordEncoder) {
        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setDepartment("Information Technology");
        user.setYearOfStudy(yearOfStudy);
        user.setDivision(division);
        user.setPhoneNumber(phoneNumber);
        return user;
    }

    private Subject createSubject(String code, String name, int semester, String facultyName) {
        Subject subject = new Subject();
        subject.setCode(code);
        subject.setName(name);
        subject.setSemester(semester);
        subject.setFacultyName(facultyName);
        return subject;
    }

    private AttendanceRecord createAttendance(
            User student,
            Subject subject,
            User markedBy,
            LocalDate date,
            AttendanceStatus status,
            String remarks) {
        AttendanceRecord record = new AttendanceRecord();
        record.setStudent(student);
        record.setSubject(subject);
        record.setMarkedBy(markedBy);
        record.setAttendanceDate(date);
        record.setStatus(status);
        record.setRemarks(remarks);
        return record;
    }

    private TimetableEntry createTimetable(
            String title,
            String subjectName,
            String facultyName,
            String room,
            DayOfWeek dayOfWeek,
            LocalTime startTime,
            LocalTime endTime,
            EntryType type,
            String audience) {
        TimetableEntry entry = new TimetableEntry();
        entry.setTitle(title);
        entry.setSubjectName(subjectName);
        entry.setFacultyName(facultyName);
        entry.setRoom(room);
        entry.setDayOfWeek(dayOfWeek);
        entry.setStartTime(startTime);
        entry.setEndTime(endTime);
        entry.setType(type);
        entry.setAudience(audience);
        return entry;
    }

    private Notice createNotice(
            String title,
            String content,
            NoticeCategory category,
            boolean pinned,
            User author,
            LocalDateTime publishedAt) {
        Notice notice = new Notice();
        notice.setTitle(title);
        notice.setContent(content);
        notice.setCategory(category);
        notice.setPinned(pinned);
        notice.setAuthor(author);
        notice.setPublishedAt(publishedAt);
        return notice;
    }

    private AcademicResource createResource(
            String title,
            String description,
            ResourceType type,
            String url,
            String subject,
            User uploader,
            LocalDateTime uploadedAt) {
        AcademicResource resource = new AcademicResource();
        resource.setTitle(title);
        resource.setDescription(description);
        resource.setType(type);
        resource.setResourceUrl(url);
        resource.setSubjectName(subject);
        resource.setUploader(uploader);
        resource.setUploadedAt(uploadedAt);
        return resource;
    }

    private Opportunity createOpportunity(
            String title,
            String company,
            OpportunityType type,
            String location,
            String stipend,
            String applyUrl,
            LocalDate deadline,
            String description,
            LocalDateTime createdAt) {
        Opportunity opportunity = new Opportunity();
        opportunity.setTitle(title);
        opportunity.setCompany(company);
        opportunity.setType(type);
        opportunity.setLocation(location);
        opportunity.setStipend(stipend);
        opportunity.setApplyUrl(applyUrl);
        opportunity.setDeadline(deadline);
        opportunity.setDescription(description);
        opportunity.setCreatedAt(createdAt);
        return opportunity;
    }
}
