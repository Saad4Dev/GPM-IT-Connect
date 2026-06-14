package com.gpmitconnect.ai;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiAssistantController {

    private final GeminiService geminiService;

    public AiAssistantController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/ask")
    public AiResponse ask(@Valid @RequestBody AiPromptRequest request) {
        return geminiService.answer(request.prompt());
    }
}
