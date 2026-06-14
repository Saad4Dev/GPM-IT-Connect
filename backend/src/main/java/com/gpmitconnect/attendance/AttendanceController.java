package com.gpmitconnect.attendance;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.gpmitconnect.subject.Subject;
import com.gpmitconnect.subject.SubjectRepository;
import com.gpmitconnect.user.Role;
import com.gpmitconnect.user.User;
import com.gpmitconnect.user.UserRepository;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;

    public AttendanceController(
            AttendanceRepository attendanceRepository,
            UserRepository userRepository,
            SubjectRepository subjectRepository) {
        this.attendanceRepository = attendanceRepository;
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
    }

    @GetMapping("/my")
    public List<AttendanceEntryResponse> myAttendance(@AuthenticationPrincipal User user) {
        return attendanceRepository.findByStudentIdOrderByAttendanceDateDesc(user.getId()).stream()
                .map(record -> new AttendanceEntryResponse(
                        record.getId(),
                        record.getSubject().getName(),
                        record.getAttendanceDate().toString(),
                        record.getStatus(),
                        record.getMarkedBy().getFullName(),
                        record.getRemarks()))
                .toList();
    }

    @GetMapping("/analytics/my")
    public List<AttendanceSummaryResponse> myAnalytics(@AuthenticationPrincipal User user) {
        Map<String, List<AttendanceRecord>> grouped = new LinkedHashMap<>();
        for (AttendanceRecord record : attendanceRepository.findByStudentIdOrderByAttendanceDateDesc(user.getId())) {
            grouped.computeIfAbsent(record.getSubject().getName(), ignored -> new ArrayList<>()).add(record);
        }

        List<AttendanceSummaryResponse> responses = new ArrayList<>();
        for (Map.Entry<String, List<AttendanceRecord>> entry : grouped.entrySet()) {
            long total = entry.getValue().size();
            long present = entry.getValue().stream()
                    .filter(record -> record.getStatus() == AttendanceStatus.PRESENT || record.getStatus() == AttendanceStatus.LATE)
                    .count();
            double percentage = total == 0 ? 0 : (present * 100.0) / total;
            responses.add(new AttendanceSummaryResponse(entry.getKey(), present, total, Math.round(percentage * 100.0) / 100.0));
        }

        responses.sort(Comparator.comparing(AttendanceSummaryResponse::subject));
        return responses;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('FACULTY','ADMIN','HOD')")
    public List<AttendanceEntryResponse> allAttendance() {
        return attendanceRepository.findAll().stream()
                .sorted(Comparator.comparing(AttendanceRecord::getAttendanceDate).reversed())
                .map(record -> new AttendanceEntryResponse(
                        record.getId(),
                        record.getStudent().getFullName() + " - " + record.getSubject().getName(),
                        record.getAttendanceDate().toString(),
                        record.getStatus(),
                        record.getMarkedBy().getFullName(),
                        record.getRemarks()))
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('FACULTY','ADMIN','HOD')")
    public AttendanceEntryResponse markAttendance(
            @Valid @RequestBody AttendanceMarkRequest request,
            @AuthenticationPrincipal User currentUser) {
        User student = userRepository.findById(request.studentId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
        if (student.getRole() != Role.STUDENT) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Attendance can only be marked for students");
        }

        Subject subject = subjectRepository.findById(request.subjectId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subject not found"));

        AttendanceRecord record = new AttendanceRecord();
        record.setStudent(student);
        record.setSubject(subject);
        record.setMarkedBy(currentUser);
        record.setAttendanceDate(request.attendanceDate());
        record.setStatus(request.status());
        record.setRemarks(request.remarks());
        AttendanceRecord saved = attendanceRepository.save(record);

        return new AttendanceEntryResponse(
                saved.getId(),
                saved.getStudent().getFullName() + " - " + saved.getSubject().getName(),
                saved.getAttendanceDate().toString(),
                saved.getStatus(),
                saved.getMarkedBy().getFullName(),
                saved.getRemarks());
    }
}
