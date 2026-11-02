package com.gearmesh;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Properties;

/**
 * GearMesh Google OAuth Platform Configuration
 * Loads credentials dynamically from properties file or environment variables.
 */
public final class GoogleAuthConfig {
    private static String clientId = "";
    private static String clientSecret = "";

    static {
        loadConfig();
    }

    public static synchronized void loadConfig() {
        File[] candidates = new File[] {
            new File("backend/google-oauth.properties"),
            new File("google-oauth.properties"),
            new File("../backend/google-oauth.properties"),
            new File("../google-oauth.properties")
        };
        for (File file : candidates) {
            if (file.exists() && file.isFile()) {
                try (InputStream in = new FileInputStream(file)) {
                    Properties props = new Properties();
                    props.load(in);
                    String id = props.getProperty("google.client.id");
                    String secret = props.getProperty("google.client.secret");
                    if (id != null && !id.isBlank()) clientId = id.trim();
                    if (secret != null && !secret.isBlank()) clientSecret = secret.trim();
                } catch (Exception ignored) {}
            }
        }

        // Environment variables fallback
        String envId = System.getenv("GEARMESH_GOOGLE_CLIENT_ID");
        if (envId != null && !envId.isBlank()) clientId = envId.trim();

        String envSecret = System.getenv("GEARMESH_GOOGLE_CLIENT_SECRET");
        if (envSecret != null && !envSecret.isBlank()) clientSecret = envSecret.trim();
    }

    public static String getClientId() {
        return clientId;
    }

    public static String getClientSecret() {
        return clientSecret;
    }

    private GoogleAuthConfig() {}
}
