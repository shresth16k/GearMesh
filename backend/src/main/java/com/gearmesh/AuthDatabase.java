package com.gearmesh;

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
    private static final String JDBC_URL = resolveJdbcUrl();
    private static final int ITERATIONS = 120_000;
    private static final int KEY_LENGTH = 256;
    private static final SecureRandom RANDOM = new SecureRandom();

    private static String resolveJdbcUrl() {
        String envDb = System.getenv("SQLITE_DB_PATH");
        if (envDb != null && !envDb.isBlank()) {
            return "jdbc:sqlite:" + envDb.trim();
        }
        java.io.File[] candidates = new java.io.File[] {
            new java.io.File("backend/GearMesh.db"),
            new java.io.File("GearMesh.db"),
            new java.io.File("gearmesh.db"),
            new java.io.File("../gearmesh.db"),
            new java.io.File("../backend/GearMesh.db")
        };
        for (java.io.File file : candidates) {
            if (file.exists() && file.isFile()) {
                return "jdbc:sqlite:" + file.getAbsolutePath().replace("\\", "/");
            }
        }
        return "jdbc:sqlite:GearMesh.db";
    }

    AuthDatabase() throws SQLException {
        try {
            Class.forName("org.sqlite.JDBC");
        } catch (ClassNotFoundException exception) {
            throw new IllegalStateException("SQLite JDBC driver is missing. Run the backend with Maven.", exception);
        }
        try (Connection connection = connect(); var statement = connection.createStatement()) {
            statement.executeUpdate("CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE COLLATE NOCASE, password_hash TEXT NOT NULL, password_salt TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)");
            statement.executeUpdate("CREATE TABLE IF NOT EXISTS email_otps (email TEXT PRIMARY KEY COLLATE NOCASE, otp TEXT NOT NULL, expires_at INTEGER NOT NULL, user_id TEXT NOT NULL, user_name TEXT NOT NULL)");
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

    java.util.List<UserRecord> getAllUsers() throws SQLException {
        java.util.List<UserRecord> users = new java.util.ArrayList<>();
        try (Connection connection = connect();
             PreparedStatement statement = connection.prepareStatement("SELECT id, name, email, created_at FROM users ORDER BY created_at DESC");
             ResultSet result = statement.executeQuery()) {
            while (result.next()) {
                users.add(new UserRecord(
                    result.getString("id"),
                    result.getString("name"),
                    result.getString("email"),
                    result.getString("created_at") != null ? result.getString("created_at") : "Recent"
                ));
            }
        }
        return users;
    }

    boolean checkAdmin(String adminId, String password) {
        if (adminId == null || password == null) return false;
        String trimmedId = adminId.trim().toLowerCase();
        return ("admin".equals(trimmedId) || "admin@gearmesh.com".equals(trimmedId)) && "admin123".equals(password.trim());
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

    AuthResult getUserByEmail(String email) throws SQLException {
        if (email == null || email.isBlank()) return null;
        try (Connection connection = connect(); PreparedStatement statement = connection.prepareStatement("SELECT id, name, email FROM users WHERE email = ? COLLATE NOCASE")) {
            statement.setString(1, email.trim());
            try (ResultSet result = statement.executeQuery()) {
                if (!result.next()) return null;
                return new AuthResult(result.getString("id"), result.getString("name"), result.getString("email"));
            }
        }
    }

    OtpResult createOtp(String email, String userId, String userName) throws SQLException {
        String cleanEmail = email.trim().toLowerCase();
        int codeInt = 100000 + RANDOM.nextInt(900000);
        String otp = String.valueOf(codeInt);
        long expiresAt = System.currentTimeMillis() + (5 * 60 * 1000); // 5 minutes

        try (Connection connection = connect()) {
            try (PreparedStatement deleteStatement = connection.prepareStatement("DELETE FROM email_otps WHERE email = ? COLLATE NOCASE")) {
                deleteStatement.setString(1, cleanEmail);
                deleteStatement.executeUpdate();
            }
            try (PreparedStatement insertStatement = connection.prepareStatement("INSERT INTO email_otps (email, otp, expires_at, user_id, user_name) VALUES (?, ?, ?, ?, ?)")) {
                insertStatement.setString(1, cleanEmail);
                insertStatement.setString(2, otp);
                insertStatement.setLong(3, expiresAt);
                insertStatement.setString(4, userId);
                insertStatement.setString(5, userName);
                insertStatement.executeUpdate();
            }
        }

        System.out.println("=================================================");
        System.out.println("  [GEARMESH 2FA SERVICE] Secure OTP Generated");
        System.out.println("  Recipient: " + cleanEmail);
        System.out.println("  2FA Code:  " + otp);
        System.out.println("  Expires:   5 Minutes (" + new java.util.Date(expiresAt) + ")");
        System.out.println("=================================================");

        // Send real Gmail OTP email asynchronously so it doesn't block the API response
        final String finalEmail = cleanEmail;
        final String finalOtp = otp;
        final String finalName = userName;
        Thread emailThread = new Thread(() -> {
            boolean sent = GmailEmailService.sendOtpEmail(finalEmail, finalOtp, finalName);
            if (!sent) {
                System.err.println("[GEARMESH 2FA] WARNING: Email could not be sent to " + finalEmail + ". Check email.properties configuration.");
            }
        });
        emailThread.setDaemon(true);
        emailThread.setName("gearmesh-email-sender");
        emailThread.start();

        return new OtpResult(cleanEmail, otp, expiresAt);
    }

    AuthResult verifyOtp(String email, String otp) throws SQLException {
        if (email == null || otp == null) return null;
        String cleanEmail = email.trim().toLowerCase();
        String cleanOtp = otp.trim();
        long now = System.currentTimeMillis();

        try (Connection connection = connect()) {
            String userId = null;
            String userName = null;
            try (PreparedStatement selectStatement = connection.prepareStatement("SELECT otp, expires_at, user_id, user_name FROM email_otps WHERE email = ? COLLATE NOCASE")) {
                selectStatement.setString(1, cleanEmail);
                try (ResultSet result = selectStatement.executeQuery()) {
                    if (!result.next()) return null;
                    String storedOtp = result.getString("otp");
                    long expiresAt = result.getLong("expires_at");
                    if (now > expiresAt || !storedOtp.equals(cleanOtp)) {
                        return null;
                    }
                    userId = result.getString("user_id");
                    userName = result.getString("user_name");
                }
            }

            if (userId != null) {
                try (PreparedStatement deleteStatement = connection.prepareStatement("DELETE FROM email_otps WHERE email = ? COLLATE NOCASE")) {
                    deleteStatement.setString(1, cleanEmail);
                    deleteStatement.executeUpdate();
                }
                return new AuthResult(userId, userName, cleanEmail);
            }
        }
        return null;
    }

    record AuthResult(String id, String name, String email) {}
    record UserRecord(String id, String name, String email, String createdAt) {}
    record OtpResult(String email, String otp, long expiresAt) {}
    static final class DuplicateEmailException extends SQLException {}
}
