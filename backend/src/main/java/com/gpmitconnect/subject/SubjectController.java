package com.gpmitconnect.subject;

import java.util.Comparator;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectRepository subjectRepository;

    public SubjectController(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    @GetMapping
    public List<SubjectResponse> all() {
        return subjectRepository.findAll().stream()
                .sorted(Comparator.comparing(Subject::getName))
                .map(SubjectResponse::from)
                .toList();
    }
}
