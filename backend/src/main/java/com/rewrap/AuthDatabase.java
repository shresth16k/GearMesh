package com.rewrap;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Base64;
import java.util.UUID;

final class AuthDatabase {
    private static final String JDBC_URL = "jdbc:sqlite:rewrap.db";
    private static final int ITERATIONS = 120_000;
    private static final int KEY_LENGTH = 256;
    private static final SecureRandom RANDOM = new SecureRandom();

    AuthDatabase() throws SQLException {
        try {
            Class.forName("org.sqlite.JDBC");
        } catch (ClassNotFoundException exception) {
            throw new IllegalStateException("SQLite JDBC driver is missing. Run the backend with Maven.", exception);
        }
        try (Connection connection = connect(); var statement = connection.createStatement()) {
            statement.executeUpdate("CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE COLLATE NOCASE, password_hash TEXT NOT NULL, password_salt TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)");
        }
    }

    AuthResult register(String name, String email, String password) throws SQLException {
        byte[] salt = new byte[16];
        RANDOM.nextBytes(salt);
        String id = UUID.randomUUID().toString();
        try (Connection connection = connect(); PreparedStatement statement = connection.prepareStatement("INSERT INTO users (id, name, email, password_hash, password_salt) VALUES (?, ?, ?, ?, ?)")) {
            String normalizedEmail = email.trim().toLowerCase();
            String normalizedName = name.trim();
            statement.setString(1, id);
            statement.setString(2, normalizedName);
            statement.setString(3, normalizedEmail);
            statement.setString(4, hash(password, salt));
            statement.setString(5, Base64.getEncoder().encodeToString(salt));
            statement.executeUpdate();
            return new AuthResult(id, normalizedName, normalizedEmail);
        } catch (SQLException exception) {
            if (exception.getMessage() != null && exception.getMessage().contains("UNIQUE")) throw new DuplicateEmailException();
            throw exception;
        }
    }

    AuthResult login(String email, String password) throws SQLException {
        try (Connection connection = connect(); PreparedStatement statement = connection.prepareStatement("SELECT id, name, email, password_hash, password_salt FROM users WHERE email = ? COLLATE NOCASE")) {
            statement.setString(1, email.trim());
            try (ResultSet result = statement.executeQuery()) {
                if (!result.next()) return null;
                byte[] salt = Base64.getDecoder().decode(result.getString("password_salt"));
                byte[] expected = Base64.getDecoder().decode(result.getString("password_hash"));
                byte[] actual = Base64.getDecoder().decode(hash(password, salt));
                if (!MessageDigest.isEqual(expected, actual)) return null;
                return new AuthResult(result.getString("id"), result.getString("name"), result.getString("email"));
            }
        }
    }

    private Connection connect() throws SQLException { return DriverManager.getConnection(JDBC_URL); }

    private String hash(String password, byte[] salt) {
        try {
            PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, ITERATIONS, KEY_LENGTH);
            return Base64.getEncoder().encodeToString(SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded());
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to hash password", exception);
        }
    }

    record AuthResult(String id, String name, String email) {}
    static final class DuplicateEmailException extends SQLException {}
}