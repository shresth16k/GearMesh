package com.gearmesh;

import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Properties;

/**
 * Google Gmail SMTP Dispatcher
 * Connects securely to smtp.gmail.com over SSL (port 465)
 * Sends real 2FA OTP verification emails to the recipient address.
 */
public class GmailEmailService {
    private static final String SMTP_HOST = "smtp.gmail.com";
    private static final int SMTP_PORT = 465;

    private static String senderEmail = "shrestheducation1@gmail.com";
    private static String appPassword = "cxorzxdwqidenyya"; // Provided by user

    static {
        loadConfig();
    }

    public static synchronized void loadConfig() {
        // Try loading from backend/email.properties or email.properties
        File[] candidates = new File[] {
            new File("backend/email.properties"),
            new File("email.properties"),
            new File("../backend/email.properties"),
            new File("../email.properties")
        };
        for (File file : candidates) {
            if (file.exists() && file.isFile()) {
                try (InputStream in = new FileInputStream(file)) {
                    Properties props = new Properties();
                    props.load(in);
                    String emailProp = props.getProperty("gmail.sender");
                    String passProp = props.getProperty("gmail.app.password");
                    if (emailProp != null && !emailProp.isBlank()) {
                        senderEmail = emailProp.trim();
                    }
                    if (passProp != null && !passProp.isBlank()) {
                        appPassword = passProp.trim().replaceAll("\\s+", "");
                    }
                } catch (Exception ignored) {}
            }
        }
        // Environment variable fallback
        String envEmail = System.getenv("GEARMESH_GMAIL_SENDER");
        if (envEmail != null && !envEmail.isBlank()) senderEmail = envEmail.trim();

        String envPass = System.getenv("GEARMESH_GMAIL_APP_PASSWORD");
        if (envPass != null && !envPass.isBlank()) appPassword = envPass.trim().replaceAll("\\s+", "");
    }

    public static void setSenderEmail(String email) {
        if (email != null && !email.isBlank()) {
            senderEmail = email.trim();
            saveConfig();
        }
    }

    public static String getSenderEmail() {
        return senderEmail;
    }

    public static void setAppPassword(String pass) {
        if (pass != null && !pass.isBlank()) {
            appPassword = pass.trim().replaceAll("\\s+", "");
            saveConfig();
        }
    }

    private static void saveConfig() {
        try {
            File file = new File("backend/email.properties");
            if (!file.getParentFile().exists()) file.getParentFile().mkdirs();
            try (FileOutputStream out = new FileOutputStream(file)) {
                Properties props = new Properties();
                props.setProperty("gmail.sender", senderEmail);
                props.setProperty("gmail.app.password", appPassword);
                props.store(out, "GearMesh Google SMTP Configuration");
            }
        } catch (Exception e) {
            System.err.println("Could not save email.properties: " + e.getMessage());
        }
    }

    /**
     * Sends an HTML verification email via Google SMTP
     */
    public static boolean sendOtpEmail(String recipientEmail, String otpCode, String userName) {
        if (senderEmail == null || senderEmail.isBlank()) {
            System.err.println("[GEARMESH GMAIL SERVICE] Notice: Sender Gmail address not yet configured.");
            System.err.println("[GEARMESH GMAIL SERVICE] Please configure your Gmail address in backend/email.properties");
            return false;
        }

        String target = recipientEmail.trim();
        String safeName = (userName != null && !userName.isBlank()) ? userName.trim() : "Valued Member";

        System.out.println("=================================================");
        System.out.println("  [GEARMESH GMAIL SERVICE] Sending Live Email via Google SMTP");
        System.out.println("  From: " + senderEmail);
        System.out.println("  To:   " + target);
        System.out.println("  OTP:  " + otpCode);
        System.out.println("=================================================");

        String subject = "GearMesh Security: Your Verification Code is " + otpCode;
        String htmlBody = "<!DOCTYPE html><html><body style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4EFEA; margin: 0; padding: 32px 16px;\">" +
                "<div style=\"max-width: 520px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 18px rgba(0,0,0,0.06); border: 1px solid #E5E7EB;\">" +
                "<div style=\"background: #10291F; padding: 28px 24px; text-align: center;\">" +
                "<h1 style=\"color: #FFFFFF; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;\">GearMesh</h1>" +
                "<p style=\"color: #A8B8A3; margin: 6px 0 0; font-size: 13px;\">Borrow • Share • Belong</p>" +
                "</div>" +
                "<div style=\"padding: 32px 28px; text-align: center;\">" +
                "<h2 style=\"color: #111827; margin: 0 0 12px; font-size: 20px;\">Two-Factor Authentication</h2>" +
                "<p style=\"color: #4B5563; font-size: 14px; line-height: 1.5; margin: 0 0 24px;\">Hello <strong>" + escapeHtml(safeName) + "</strong>,<br/>Use the verification code below to complete your GearMesh sign-in or registration:</p>" +
                "<div style=\"display: inline-block; background: #FAF8F5; border: 2px solid #1B3B2B; border-radius: 12px; padding: 14px 28px; margin: 0 auto 24px;\">" +
                "<span style=\"font-family: monospace, Courier, monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #1B3B2B;\">" + otpCode + "</span>" +
                "</div>" +
                "<p style=\"color: #6B7280; font-size: 13px; margin: 0 0 20px;\">⏱️ This one-time code is valid for <strong>5 minutes</strong>. Never share this code with anyone.</p>" +
                "<div style=\"border-top: 1px solid #E5E7EB; padding-top: 18px; color: #9CA3AF; font-size: 12px;\">" +
                "If you did not request this email, please secure your account immediately.<br/>" +
                "© 2026 GearMesh Inc. All rights reserved." +
                "</div>" +
                "</div>" +
                "</div>" +
                "</body></html>";

        return sendRawSmtp(senderEmail, appPassword, target, subject, htmlBody);
    }

    private static boolean sendRawSmtp(String from, String password, String to, String subject, String htmlContent) {
        try (SSLSocket socket = (SSLSocket) SSLSocketFactory.getDefault().createSocket(SMTP_HOST, SMTP_PORT);
             BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8));
             BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream(), StandardCharsets.UTF_8))) {

            socket.setSoTimeout(15000);
            readResponse(reader); // 220 banner

            send(writer, "EHLO localhost");
            readResponse(reader); // 250

            send(writer, "AUTH LOGIN");
            readResponse(reader); // 334 Username

            send(writer, Base64.getEncoder().encodeToString(from.getBytes(StandardCharsets.UTF_8)));
            readResponse(reader); // 334 Password

            send(writer, Base64.getEncoder().encodeToString(password.getBytes(StandardCharsets.UTF_8)));
            String authResp = readResponse(reader);
            if (!authResp.startsWith("235")) {
                System.err.println("[GEARMESH GMAIL SERVICE] Google Auth Failed: " + authResp);
                return false;
            }

            send(writer, "MAIL FROM:<" + from + ">");
            readResponse(reader); // 250

            send(writer, "RCPT TO:<" + to + ">");
            readResponse(reader); // 250

            send(writer, "DATA");
            readResponse(reader); // 354

            // Write MIME email headers and body
            writer.write("From: GearMesh Security <" + from + ">\r\n");
            writer.write("To: <" + to + ">\r\n");
            writer.write("Subject: " + subject + "\r\n");
            writer.write("MIME-Version: 1.0\r\n");
            writer.write("Content-Type: text/html; charset=UTF-8\r\n");
            writer.write("\r\n");
            writer.write(htmlContent);
            writer.write("\r\n.\r\n");
            writer.flush();

            String sendResp = readResponse(reader); // 250 OK
            System.out.println("[GEARMESH GMAIL SERVICE] Email sent successfully to " + to + ": " + sendResp.split("\n")[0]);

            send(writer, "QUIT");
            return true;
        } catch (Exception e) {
            System.err.println("[GEARMESH GMAIL SERVICE] Error sending email: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    private static void send(BufferedWriter writer, String command) throws IOException {
        writer.write(command + "\r\n");
        writer.flush();
    }

    private static String readResponse(BufferedReader reader) throws IOException {
        String line;
        StringBuilder sb = new StringBuilder();
        while ((line = reader.readLine()) != null) {
            sb.append(line).append("\n");
            if (line.length() >= 4 && line.charAt(3) == ' ') break;
        }
        return sb.toString().trim();
    }

    private static String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }
}
