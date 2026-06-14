package com.gpmitconnect.attendance;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepository extends JpaRepository<AttendanceRecord, Long> {

    List<AttendanceRecord> findByStudentIdOrderByAttendanceDateDesc(Long studentId);
}
