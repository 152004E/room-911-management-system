package com.room911.service;

import com.room911.dto.FaceVerificationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class FacialRecognitionService {

    private static final String AI_SERVICE_URL = "http://localhost:8001";

    @Autowired
    private RestTemplate restTemplate;

    public FaceVerificationResponse verifyFace(Long employeeId, String imageBase64) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("employee_id", String.valueOf(employeeId));
        body.add("image_base64", imageBase64);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<FaceVerificationResponse> response = restTemplate.postForEntity(
                AI_SERVICE_URL + "/verify-face",
                request,
                FaceVerificationResponse.class
            );
            return response.getBody();
        } catch (HttpClientErrorException.NotFound e) {
            return new FaceVerificationResponse(false, 0.0, "No face registered for this employee");
        } catch (Exception e) {
            return new FaceVerificationResponse(false, 0.0, "AI service error: " + e.getMessage());
        }
    }

    /**
     * Returns null on success, or an error message string on failure.
     */
    public String registerFace(Long employeeId, String imageBase64) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("employee_id", String.valueOf(employeeId));
        body.add("image_base64", imageBase64);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                AI_SERVICE_URL + "/register-face",
                request,
                Map.class
            );
            Map<?, ?> responseBody = response.getBody();
            boolean success = responseBody != null && Boolean.TRUE.equals(responseBody.get("success"));
            return success ? null : "El servicio de IA no confirmó el registro";
        } catch (HttpClientErrorException e) {
            try {
                @SuppressWarnings("unchecked")
                Map<String, Object> errorBody = new com.fasterxml.jackson.databind.ObjectMapper()
                    .readValue(e.getResponseBodyAsString(), Map.class);
                Object detail = errorBody.get("detail");
                return detail != null ? detail.toString() : "No se pudo registrar el rostro";
            } catch (Exception parseEx) {
                return "No se pudo registrar el rostro: " + e.getStatusCode();
            }
        } catch (Exception e) {
            return "Error al conectar con el servicio de reconocimiento facial";
        }
    }

    public boolean hasFace(Long employeeId) {
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(
                AI_SERVICE_URL + "/faces/" + employeeId,
                Map.class
            );
            Map<?, ?> responseBody = response.getBody();
            return responseBody != null && Boolean.TRUE.equals(responseBody.get("registered"));
        } catch (Exception e) {
            return false;
        }
    }

    public void deleteFace(Long employeeId) {
        try {
            restTemplate.delete(AI_SERVICE_URL + "/faces/" + employeeId);
        } catch (Exception e) {
            // ignore if not found
        }
    }
}
