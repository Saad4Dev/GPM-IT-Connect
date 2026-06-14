package com.gpmitconnect.timetable;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/timetable")
public class TimetableController {

    private final TimetableRepository timetableRepository;

    public TimetableController(TimetableRepository timetableRepository) {
        this.timetableRepository = timetableRepository;
    }

    @GetMapping
    public List<TimetableResponse> getTimetable(@RequestParam(required = false) String day) {
        List<TimetableEntry> entries;
        if (day == null || day.isBlank()) {
            entries = timetableRepository.findAll().stream()
                    .sorted(Comparator.comparing(TimetableEntry::getDayOfWeek).thenComparing(TimetableEntry::getStartTime))
                    .toList();
        } else if ("today".equalsIgnoreCase(day)) {
            entries = timetableRepository.findByDayOfWeekOrderByStartTimeAsc(LocalDate.now().getDayOfWeek());
        } else {
            entries = timetableRepository.findByDayOfWeekOrderByStartTimeAsc(DayOfWeek.valueOf(day.toUpperCase()));
        }

        return entries.stream()
                .map(entry -> new TimetableResponse(
                        entry.getId(),
                        entry.getTitle(),
                        entry.getSubjectName(),
                        entry.getFacultyName(),
                        entry.getRoom(),
                        entry.getDayOfWeek().name(),
                        entry.getStartTime().toString(),
                        entry.getEndTime().toString(),
                        entry.getType(),
                        entry.getAudience()))
                .toList();
    }
}
