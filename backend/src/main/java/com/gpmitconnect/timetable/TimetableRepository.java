package com.gpmitconnect.timetable;

import java.time.DayOfWeek;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TimetableRepository extends JpaRepository<TimetableEntry, Long> {

    List<TimetableEntry> findByDayOfWeekOrderByStartTimeAsc(DayOfWeek dayOfWeek);
}
