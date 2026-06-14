package com.gpmitconnect.dashboard;

import java.time.LocalDate;
import java.util.List;

import com.gpmitconnect.attendance.AttendanceRecord;
import com.gpmitconnect.attendance.AttendanceRepository;
import com.gpmitconnect.attendance.AttendanceStatus;
import com.gpmitconnect.notice.NoticeRepository;
import com.gpmitconnect.opportunity.OpportunityRepository;
import com.gpmitconnect.opportunity.OpportunityType;
import com.gpmitconnect.resource.ResourceRepository;
import com.gpmitconnect.timetable.TimetableRepository;
import com.gpmitconnect.user.Role;
import com.gpmitconnect.user.User;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final AttendanceRepository attendanceRepository;
    private final NoticeRepository noticeRepository;
    private final ResourceRepository resourceRepository;
    private final OpportunityRepository opportunityRepository;
    private final TimetableRepository timetableRepository;

    public DashboardController(
            AttendanceRepository attendanceRepository,
            NoticeRepository noticeRepository,
            ResourceRepository resourceRepository,
            OpportunityRepository opportunityRepository,
            TimetableRepository timetableRepository) {
        this.attendanceRepository = attendanceRepository;
        this.noticeRepository = noticeRepository;
        this.resourceRepository = resourceRepository;
        this.opportunityRepository = opportunityRepository;
        this.timetableRepository = timetableRepository;
    }

    @GetMapping("/summary")
    public DashboardSummaryResponse summary(@AuthenticationPrincipal User user) {
        List<AttendanceRecord> attendance = user.getRole() == Role.STUDENT
                ? attendanceRepository.findByStudentIdOrderByAttendanceDateDesc(user.getId())
                : attendanceRepository.findAll();
        long totalAttendance = attendance.size();
        long presentAttendance = attendance.stream()
                .filter(record -> record.getStatus() == AttendanceStatus.PRESENT || record.getStatus() == AttendanceStatus.LATE)
                .count();
        double attendancePercentage = totalAttendance == 0 ? 0 : Math.round((presentAttendance * 10000.0) / totalAttendance) / 100.0;

        return new DashboardSummaryResponse(
                user.getFullName(),
                user.getRole(),
                totalAttendance,
                attendancePercentage,
                noticeRepository.count(),
                resourceRepository.count(),
                opportunityRepository.findAll().stream().filter(item -> item.getType() == OpportunityType.INTERNSHIP).count(),
                opportunityRepository.findAll().stream().filter(item -> item.getType() == OpportunityType.PLACEMENT).count(),
                noticeRepository.findTop5ByOrderByPinnedDescPublishedAtDesc().stream()
                        .map(notice -> new DashboardSummaryResponse.NoticePreview(
                                notice.getTitle(),
                                notice.getCategory(),
                                notice.isPinned(),
                                notice.getPublishedAt().toString()))
                        .toList(),
                timetableRepository.findByDayOfWeekOrderByStartTimeAsc(LocalDate.now().getDayOfWeek()).stream()
                        .map(item -> new DashboardSummaryResponse.TimetablePreview(
                                item.getTitle(),
                                item.getStartTime() + " - " + item.getEndTime(),
                                item.getRoom(),
                                item.getFacultyName()))
                        .toList(),
                opportunityRepository.findAll().stream()
                        .sorted((left, right) -> left.getDeadline().compareTo(right.getDeadline()))
                        .limit(5)
                        .map(item -> new DashboardSummaryResponse.OpportunityPreview(
                                item.getTitle(),
                                item.getCompany(),
                                item.getType(),
                                item.getDeadline().toString(),
                                item.getLocation()))
                        .toList());
    }
}
