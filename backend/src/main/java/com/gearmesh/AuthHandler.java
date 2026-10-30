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
            if (email.isBlank() || password.length() < 8 || (registration && name.isBlank())) {
                GearMeshServer.sendJsonResponse(exchange, 400, "{\"error\":\"Enter a valid name, email, and password of at least 8 characters.\"}");
                return;
            }

            AuthDatabase.AuthResult user = registration ? database.register(name, email, password) : database.login(email, password);
            if (user == null) {
                GearMeshServer.sendJsonResponse(exchange, 401, "{\"error\":\"Invalid email or password.\"}");
                return;
            }
            GearMeshServer.sendJsonResponse(exchange, 200, "{\"user\":" + userJson(user) + "}");
        } catch (AuthDatabase.DuplicateEmailException exception) {
            GearMeshServer.sendJsonResponse(exchange, 409, "{\"error\":\"An account with this email already exists.\"}");
        } catch (SQLException exception) {
            exception.printStackTrace();
            GearMeshServer.sendJsonResponse(exchange, 500, "{\"error\":\"The authentication service is unavailable.\"}");
        }
    }

    private static String jsonValue(String body, String key) {
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

    private static String userJson(AuthDatabase.AuthResult user) {
        return "{\"id\":\"" + escape(user.id()) + "\",\"name\":\"" + escape(user.name()) + "\",\"email\":\"" + escape(user.email()) + "\"}";
    }

    private static String escape(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
