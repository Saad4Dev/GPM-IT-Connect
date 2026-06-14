package com.gpmitconnect.subject;

public record SubjectResponse(
        Long id,
        String code,
        String name,
        int semester,
        String facultyName) {

    public static SubjectResponse from(Subject subject) {
        return new SubjectResponse(
                subject.getId(),
                subject.getCode(),
                subject.getName(),
                subject.getSemester(),
                subject.getFacultyName());
    }
}
