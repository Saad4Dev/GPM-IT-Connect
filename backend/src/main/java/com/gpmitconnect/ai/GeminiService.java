package com.gpmitconnect.ai;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final String apiKey;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public GeminiService(@Value("${app.gemini.api-key}") String apiKey, ObjectMapper objectMapper) {
        this.apiKey = apiKey;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    public AiResponse answer(String prompt) {
        if (apiKey == null || apiKey.isBlank()) {
            return new AiResponse("""
                    Gemini API key is not configured yet. The AI assistant module is wired and ready.
                    Add GEMINI_API_KEY to the backend environment to get live answers.

                    Demo guidance:
                    - Explain the topic in simple terms.
                    - Generate concise Java examples.
                    - Summarize notes into bullet points.
                    - Create viva questions with short answers.
                    """.strip(), false);
        }

        try {
            Map<String, Object> payload = Map.of(
                    "contents", new Object[] {
                            Map.of("parts", new Object[] { Map.of("text", prompt) })
                    });

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(
                            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key="
                                    + apiKey))
                    .timeout(Duration.ofSeconds(20))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(payload)))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            JsonNode root = objectMapper.readTree(response.body());
            JsonNode textNode = root.path("candidates").path(0).path("content").path("parts").path(0).path("text");
            String answer = textNode.isMissingNode() ? "The AI service responded without content." : textNode.asText();
            return new AiResponse(answer, true);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            return new AiResponse("Unable to reach Gemini right now: " + exception.getMessage(), false);
        } catch (IOException exception) {
            return new AiResponse("Unable to reach Gemini right now: " + exception.getMessage(), false);
        }
    }
}
