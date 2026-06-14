package com.gpmitconnect.attendance;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;

public record AttendanceMarkRequest(
        @NotNull Long studentId,
        @NotNull Long subjectId,
        @NotNull LocalDate attendanceDate,
        @NotNull AttendanceStatus status,
        String remarks) {
}
