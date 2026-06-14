package com.gpmitconnect.timetable;

public record TimetableResponse(
        Long id,
        String title,
        String subjectName,
        String facultyName,
        String room,
        String dayOfWeek,
        String startTime,
        String endTime,
        EntryType type,
        String audience) {
}
