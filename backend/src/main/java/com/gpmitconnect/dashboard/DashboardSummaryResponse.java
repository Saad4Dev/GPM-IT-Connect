package com.gpmitconnect.dashboard;

import java.util.List;

import com.gpmitconnect.notice.NoticeCategory;
import com.gpmitconnect.opportunity.OpportunityType;
import com.gpmitconnect.user.Role;

public record DashboardSummaryResponse(
        String userName,
        Role role,
        long totalAttendanceEntries,
        double attendancePercentage,
        long noticeCount,
        long resourceCount,
        long internshipCount,
        long placementCount,
        List<NoticePreview> latestNotices,
        List<TimetablePreview> todaysSchedule,
        List<OpportunityPreview> topOpportunities) {

    public record NoticePreview(String title, NoticeCategory category, boolean pinned, String publishedAt) {
    }

    public record TimetablePreview(String title, String slot, String room, String facultyName) {
    }

    public record OpportunityPreview(String title, String company, OpportunityType type, String deadline, String location) {
    }
}
