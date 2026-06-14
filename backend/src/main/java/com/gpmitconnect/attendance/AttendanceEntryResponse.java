package com.gpmitconnect.attendance;

public record AttendanceEntryResponse(
        Long id,
        String subject,
        String date,
        AttendanceStatus status,
        String markedBy,
        String remarks) {
}
