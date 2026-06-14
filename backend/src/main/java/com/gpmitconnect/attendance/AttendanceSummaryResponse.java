package com.gpmitconnect.attendance;

public record AttendanceSummaryResponse(
        String subject,
        long presentCount,
        long totalClasses,
        double percentage) {
}
