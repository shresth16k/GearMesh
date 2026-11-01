package com.gearmesh;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;

final class AuthHandler implements HttpHandler {
    private final AuthDatabase database;
    private final boolean registration;

    AuthHandler(AuthDatabase database, boolean registration) {
        this.database = database;
        this.registration = registration;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            GearMeshServer.sendJsonResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
            return;
        }
        try {
            String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
            String email = jsonValue(body, "email");
            String password = jsonValue(body, "password");
            String name = registration ? jsonValue(body, "name") : "";
            if (email.isBlank() || password.length() < 4 || (registration && name.isBlank())) {
                GearMeshServer.sendJsonResponse(exchange, 400, "{\"error\":\"Enter a valid name, email, and password of at least 4 characters.\"}");
                return;
            }

            AuthDatabase.AuthResult user = registration ? database.register(name, email, password) : database.login(email, password);
            if (user == null) {
                GearMeshServer.sendJsonResponse(exchange, 401, "{\"error\":\"Invalid email or password.\"}");
                return;
            }
            database.createOtp(user.email(), user.id(), user.name());
            String actionMsg = registration
                ? "Account registered! A 6-digit verification code has been sent to your email."
                : "A 6-digit verification code has been sent to your email.";
            GearMeshServer.sendJsonResponse(exchange, 200, "{\"status\":\"2fa_required\",\"email\":\"" + escape(user.email()) + "\",\"message\":\"" + actionMsg + "\"}");
        } catch (AuthDatabase.DuplicateEmailException exception) {
            GearMeshServer.sendJsonResponse(exchange, 409, "{\"error\":\"An account with this email already exists.\"}");
        } catch (SQLException exception) {
            exception.printStackTrace();
            GearMeshServer.sendJsonResponse(exchange, 500, "{\"error\":\"The authentication service is unavailable.\"}");
        }
    }

    static String jsonValue(String body, String key) {
        int keyStart = body.indexOf("\"" + key + "\"");
        if (keyStart < 0) return "";
        int valueStart = body.indexOf(':', keyStart) + 1;
        while (valueStart < body.length() && Character.isWhitespace(body.charAt(valueStart))) valueStart++;
        if (valueStart >= body.length() || body.charAt(valueStart) != '"') return "";
        StringBuilder value = new StringBuilder();
        boolean escaped = false;
        for (int index = valueStart + 1; index < body.length(); index++) {
            char character = body.charAt(index);
            if (escaped) {
                value.append(character);
                escaped = false;
            } else if (character == '\\') {
                escaped = true;
            } else if (character == '"') {
                return value.toString();
            } else {
                value.append(character);
            }
        }
        return "";
    }

    static String userJson(AuthDatabase.AuthResult user) {
        return "{\"id\":\"" + escape(user.id()) + "\",\"name\":\"" + escape(user.name()) + "\",\"email\":\"" + escape(user.email()) + "\"}";
    }

    static String escape(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}

final class OtpVerifyHandler implements HttpHandler {
    private final AuthDatabase database;

    OtpVerifyHandler(AuthDatabase database) {
        this.database = database;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            GearMeshServer.sendJsonResponse(exchange, 204, "");
            return;
        }
        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            GearMeshServer.sendJsonResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
            return;
        }
        try {
            String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
            String email = AuthHandler.jsonValue(body, "email");
            String otp = AuthHandler.jsonValue(body, "otp");
            if (email.isBlank() || otp.isBlank()) {
                GearMeshServer.sendJsonResponse(exchange, 400, "{\"error\":\"Please enter the 6-digit code sent to your email.\"}");
                return;
            }

            AuthDatabase.AuthResult user = database.verifyOtp(email, otp);
            if (user == null) {
                GearMeshServer.sendJsonResponse(exchange, 401, "{\"error\":\"Invalid or expired verification code. Please try again or request a new code.\"}");
                return;
            }

            GearMeshServer.sendJsonResponse(exchange, 200, "{\"user\":" + AuthHandler.userJson(user) + "}");
        } catch (SQLException exception) {
            exception.printStackTrace();
            GearMeshServer.sendJsonResponse(exchange, 500, "{\"error\":\"Verification failed due to a server error.\"}");
        }
    }
}

final class OtpResendHandler implements HttpHandler {
    private final AuthDatabase database;

    OtpResendHandler(AuthDatabase database) {
        this.database = database;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            GearMeshServer.sendJsonResponse(exchange, 204, "");
            return;
        }
        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            GearMeshServer.sendJsonResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
            return;
        }
        try {
            String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
            String email = AuthHandler.jsonValue(body, "email");
            if (email.isBlank()) {
                GearMeshServer.sendJsonResponse(exchange, 400, "{\"error\":\"Please provide your email address.\"}");
                return;
            }

            AuthDatabase.AuthResult user = database.getUserByEmail(email);
            if (user == null) {
                GearMeshServer.sendJsonResponse(exchange, 404, "{\"error\":\"No account found with this email.\"}");
                return;
            }

            database.createOtp(user.email(), user.id(), user.name());
            GearMeshServer.sendJsonResponse(exchange, 200, "{\"success\":true,\"message\":\"A new 6-digit verification code has been sent to your email.\"}");
        } catch (SQLException exception) {
            exception.printStackTrace();
            GearMeshServer.sendJsonResponse(exchange, 500, "{\"error\":\"Unable to resend verification code.\"}");
        }
    }
}

final class SendOtpHandler implements HttpHandler {
    private final AuthDatabase database;

    SendOtpHandler(AuthDatabase database) {
        this.database = database;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            GearMeshServer.sendJsonResponse(exchange, 204, "");
            return;
        }
        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            GearMeshServer.sendJsonResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
            return;
        }
        try {
            String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
            String email = AuthHandler.jsonValue(body, "email");
            if (email.isBlank() || !email.contains("@")) {
                GearMeshServer.sendJsonResponse(exchange, 400, "{\"error\":\"Please provide a valid email address.\"}");
                return;
            }

            AuthDatabase.AuthResult user = database.getUserByEmail(email);
            if (user == null) {
                user = database.register(email.split("@")[0], email, "otp_" + java.util.UUID.randomUUID().toString().substring(0, 8));
            }

            database.createOtp(user.email(), user.id(), user.name());
            GearMeshServer.sendJsonResponse(exchange, 200, "{\"status\":\"2fa_required\",\"email\":\"" + AuthHandler.escape(user.email()) + "\",\"message\":\"A 6-digit verification code has been sent to your email.\"}");
        } catch (SQLException exception) {
            exception.printStackTrace();
            GearMeshServer.sendJsonResponse(exchange, 500, "{\"error\":\"Unable to send verification code.\"}");
        }
    }
}
