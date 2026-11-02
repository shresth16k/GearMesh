package com.gearmesh;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;

/**
 * GearMesh Native Java REST API Server
 * Built with standard JDK 17 com.sun.net.httpserver
 * Provides instant live endpoints with zero external dependencies.
 */
public class GearMeshServer {
    private static final int PORT = 8080;

    public static void main(String[] args) throws IOException, SQLException {
        AuthDatabase authDatabase = new AuthDatabase();
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);

        // CORS and Options pre-flight handler wrapper
        server.createContext("/api/health", new HealthHandler());
        server.createContext("/api/items", new ItemsHandler());
        server.createContext("/api/transactions", new TransactionsHandler());
        server.createContext("/api/user/profile", new ProfileHandler());
        server.createContext("/api/borrow", new BorrowHandler());
        server.createContext("/api/auth/register", new AuthHandler(authDatabase, true));
        server.createContext("/api/auth/login", new AuthHandler(authDatabase, false));
        server.createContext("/api/auth/send-otp", new SendOtpHandler(authDatabase));
        server.createContext("/api/auth/verify-otp", new OtpVerifyHandler(authDatabase));
        server.createContext("/api/auth/resend-otp", new OtpResendHandler(authDatabase));
        server.createContext("/api/auth/google", new GoogleAuthHandler(authDatabase));
        server.createContext("/api/admin/login", new AdminLoginHandler(authDatabase));
        server.createContext("/api/admin/users", new AdminUsersHandler(authDatabase));
        server.createContext("/api/admin/stats", new AdminStatsHandler(authDatabase));

        server.setExecutor(null);
        System.out.println("=================================================");
        System.out.println("  GearMesh Java Backend Server Started on Port " + PORT);
        System.out.println("  Philosophy: Things move. People connect. A greener tomorrow.");
        System.out.println("  Endpoints: http://localhost:8080/api/health");
        System.out.println("             http://localhost:8080/api/items");
        System.out.println("             http://localhost:8080/api/transactions");
        System.out.println("             http://localhost:8080/api/user/profile");
        System.out.println("             http://localhost:8080/api/admin/users");
        System.out.println("             http://localhost:8080/api/admin/stats");
        System.out.println("=================================================");
        server.start();
    }

    static void sendJsonResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        // Add CORS headers
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");

        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        OutputStream os = exchange.getResponseBody();
        os.write(bytes);
        os.close();
    }

    static class HealthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String json = """
                {
                    "status": "UP",
                    "service": "GearMesh Java Backend",
                    "version": "1.0.0",
                    "philosophy": "Things move. People connect. A greener tomorrow.",
                    "region": "Dehradun, India"
                }
                """;
            sendJsonResponse(exchange, 200, json);
        }
    }

    static class ProfileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String json = """
                {
                    "id": "u-current",
                    "name": "Alex Rivera",
                    "location": "Rajpur Road, Dehradun",
                    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
                    "rating": 4.9,
                    "reviewsCount": 28,
                    "isVerified": true,
                    "itemsBorrowed": 12,
                    "itemsLent": 8,
                    "impactSavedAmount": 12400,
                    "impactKgKept": 18.5
                }
                """;
            sendJsonResponse(exchange, 200, json);
        }
    }

    static class ItemsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String json = """
                [
                    {
                        "id": "item-1",
                        "title": "Sony A7 III Mirrorless Camera",
                        "category": "electronics",
                        "pricePerDay": 450,
                        "rating": 4.9,
                        "reviewCount": 32,
                        "distanceKm": 1.2,
                        "location": "Hathibarkala, Dehradun",
                        "imageUrl": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
                        "isAvailable": true,
                        "carbonSavingsKg": 26,
                        "materialSavingsKg": 2.1
                    },
                    {
                        "id": "item-2",
                        "title": "Quechua 4-Person Canvas Camping Tent",
                        "category": "camping",
                        "pricePerDay": 250,
                        "rating": 4.8,
                        "reviewCount": 19,
                        "distanceKm": 0.8,
                        "location": "Dalanwala, Dehradun",
                        "imageUrl": "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
                        "isAvailable": true,
                        "carbonSavingsKg": 34,
                        "materialSavingsKg": 7.2
                    },
                    {
                        "id": "item-3",
                        "title": "Trek Dual Sport 2 Hybrid Bicycle",
                        "category": "sports",
                        "pricePerDay": 200,
                        "rating": 4.7,
                        "reviewCount": 24,
                        "distanceKm": 2.1,
                        "location": "Chakrata Road, Dehradun",
                        "imageUrl": "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80",
                        "isAvailable": true,
                        "carbonSavingsKg": 52,
                        "materialSavingsKg": 14.0
                    },
                    {
                        "id": "item-4",
                        "title": "Bosch Professional 18V Cordless Drill & Impact Set",
                        "category": "tools",
                        "pricePerDay": 150,
                        "rating": 4.9,
                        "reviewCount": 42,
                        "distanceKm": 1.5,
                        "location": "Jakhan, Dehradun",
                        "imageUrl": "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
                        "isAvailable": true,
                        "carbonSavingsKg": 19,
                        "materialSavingsKg": 4.5
                    },
                    {
                        "id": "item-5",
                        "title": "XGIMI Halo+ 1080p Smart Portable Projector",
                        "category": "electronics",
                        "pricePerDay": 350,
                        "rating": 4.8,
                        "reviewCount": 27,
                        "distanceKm": 3.4,
                        "location": "Ballupur, Dehradun",
                        "imageUrl": "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",
                        "isAvailable": true,
                        "carbonSavingsKg": 28,
                        "materialSavingsKg": 3.2
                    },
                    {
                        "id": "item-6",
                        "title": "KitchenAid Artisan 4.8L Stand Mixer",
                        "category": "kitchen",
                        "pricePerDay": 180,
                        "rating": 5.0,
                        "reviewCount": 14,
                        "distanceKm": 2.8,
                        "location": "Vasant Vihar, Dehradun",
                        "imageUrl": "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80",
                        "isAvailable": false,
                        "carbonSavingsKg": 42,
                        "materialSavingsKg": 11.5
                    },
                    {
                        "id": "item-7",
                        "title": "DJI Mini 3 Pro 4K HDR Lightweight Drone",
                        "category": "electronics",
                        "pricePerDay": 550,
                        "rating": 4.9,
                        "reviewCount": 38,
                        "distanceKm": 1.8,
                        "location": "Rajpur Road, Dehradun",
                        "imageUrl": "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80",
                        "isAvailable": true,
                        "carbonSavingsKg": 31,
                        "materialSavingsKg": 2.8
                    },
                    {
                        "id": "item-8",
                        "title": "Coleman 54-Quart Steel-Belted Cooler & Dual Stove",
                        "category": "camping",
                        "pricePerDay": 220,
                        "rating": 4.8,
                        "reviewCount": 22,
                        "distanceKm": 2.4,
                        "location": "Dharampur, Dehradun",
                        "imageUrl": "https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=800&q=80",
                        "isAvailable": true,
                        "carbonSavingsKg": 39,
                        "materialSavingsKg": 9.8
                    },
                    {
                        "id": "item-9",
                        "title": "Marshall Kilburn II Portable Bluetooth Speaker",
                        "category": "events",
                        "pricePerDay": 280,
                        "rating": 5.0,
                        "reviewCount": 46,
                        "distanceKm": 0.9,
                        "location": "Race Course, Dehradun",
                        "imageUrl": "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
                        "isAvailable": true,
                        "carbonSavingsKg": 22,
                        "materialSavingsKg": 3.5
                    },
                    {
                        "id": "item-10",
                        "title": "Kärcher K4 Power Control High-Pressure Washer",
                        "category": "tools",
                        "pricePerDay": 190,
                        "rating": 4.8,
                        "reviewCount": 31,
                        "distanceKm": 2.7,
                        "location": "Saharanpur Road, Dehradun",
                        "imageUrl": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
                        "isAvailable": true,
                        "carbonSavingsKg": 44,
                        "materialSavingsKg": 12.0
                    },
                    {
                        "id": "item-11",
                        "title": "Nintendo Switch OLED + 4 Controllers & Party Games",
                        "category": "events",
                        "pricePerDay": 320,
                        "rating": 4.9,
                        "reviewCount": 54,
                        "distanceKm": 1.4,
                        "location": "EC Road, Dehradun",
                        "imageUrl": "https://images.unsplash.com/photo-1578303512597-8be9246dd4d3?auto=format&fit=crop&w=800&q=80",
                        "isAvailable": true,
                        "carbonSavingsKg": 18,
                        "materialSavingsKg": 1.9
                    },
                    {
                        "id": "item-12",
                        "title": "Patagonia Black Hole 70L Weatherproof Duffel Pack",
                        "category": "sports",
                        "pricePerDay": 140,
                        "rating": 4.9,
                        "reviewCount": 18,
                        "distanceKm": 1.9,
                        "location": "Kishanpur, Dehradun",
                        "imageUrl": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
                        "isAvailable": true,
                        "carbonSavingsKg": 16,
                        "materialSavingsKg": 3.1
                    },
                    {
                        "id": "item-13",
                        "title": "Celestron AstroMaster 130EQ Reflector Telescope",
                        "category": "electronics",
                        "pricePerDay": 300,
                        "rating": 5.0,
                        "reviewCount": 16,
                        "distanceKm": 3.1,
                        "location": "Mussoorie Diversion, Dehradun",
                        "imageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
                        "isAvailable": true,
                        "carbonSavingsKg": 35,
                        "materialSavingsKg": 8.5
                    },
                    {
                        "id": "item-14",
                        "title": "Weber Go-Anywhere Portable Charcoal Barbecue Grill",
                        "category": "kitchen",
                        "pricePerDay": 160,
                        "rating": 4.7,
                        "reviewCount": 25,
                        "distanceKm": 2.2,
                        "location": "Subhash Nagar, Dehradun",
                        "imageUrl": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
                        "isAvailable": true,
                        "carbonSavingsKg": 24,
                        "materialSavingsKg": 6.8
                    },
                    {
                        "id": "item-15",
                        "title": "Fender FA-125 Dreadnought Acoustic Guitar",
                        "category": "events",
                        "pricePerDay": 150,
                        "rating": 4.8,
                        "reviewCount": 20,
                        "distanceKm": 1.1,
                        "location": "Subhash Road, Dehradun",
                        "imageUrl": "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80",
                        "isAvailable": true,
                        "carbonSavingsKg": 20,
                        "materialSavingsKg": 4.2
                    },
                    {
                        "id": "item-16",
                        "title": "Thule Apex XT 4-Bike Hitch Mount Carrier",
                        "category": "sports",
                        "pricePerDay": 230,
                        "rating": 4.9,
                        "reviewCount": 17,
                        "distanceKm": 2.6,
                        "location": "Jakhan, Dehradun",
                        "imageUrl": "https://images.unsplash.com/photo-1502744688674-c619d1586c9e?auto=format&fit=crop&w=800&q=80",
                        "isAvailable": true,
                        "carbonSavingsKg": 48,
                        "materialSavingsKg": 13.5
                    }
                ]
                """;
            sendJsonResponse(exchange, 200, json);
        }
    }

    static class TransactionsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String json = """
                [
                    {
                        "id": "tx-101",
                        "itemId": "item-2",
                        "itemTitle": "Quechua 4-Person Canvas Camping Tent",
                        "totalCost": 500,
                        "status": "approved",
                        "type": "borrowing",
                        "pickupMethod": "locker",
                        "lockerNumber": "Locker A-12",
                        "lockerCode": "4827",
                        "lockerValidUntil": "18 Sept, 8:00 PM"
                    }
                ]
                """;
            sendJsonResponse(exchange, 200, json);
        }
    }

    static class BorrowHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String json = """
                {
                    "success": true,
                    "transactionId": "tx-202",
                    "status": "approved",
                    "pickupMethod": "locker",
                    "lockerNumber": "Locker A-12",
                    "lockerCode": "4827",
                    "lockerValidUntil": "20 Sept, 8:00 PM",
                    "message": "Borrow request approved. Smart locker compartment reserved."
                }
                """;
            sendJsonResponse(exchange, 200, json);
        }
    }

    static class AdminUsersHandler implements HttpHandler {
        private final AuthDatabase database;

        AdminUsersHandler(AuthDatabase database) {
            this.database = database;
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 204, "");
                return;
            }
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }
            try {
                var users = database.getAllUsers();
                StringBuilder json = new StringBuilder("[");
                for (int i = 0; i < users.size(); i++) {
                    var u = users.get(i);
                    json.append("{\"id\":\"").append(AuthHandler.escape(u.id()))
                        .append("\",\"name\":\"").append(AuthHandler.escape(u.name()))
                        .append("\",\"email\":\"").append(AuthHandler.escape(u.email()))
                        .append("\",\"createdAt\":\"").append(AuthHandler.escape(u.createdAt()))
                        .append("\"}");
                    if (i < users.size() - 1) json.append(",");
                }
                json.append("]");
                sendJsonResponse(exchange, 200, json.toString());
            } catch (SQLException e) {
                e.printStackTrace();
                sendJsonResponse(exchange, 500, "{\"error\":\"Database query failed\"}");
            }
        }
    }

    static class AdminLoginHandler implements HttpHandler {
        private final AuthDatabase database;

        AdminLoginHandler(AuthDatabase database) {
            this.database = database;
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 204, "");
                return;
            }
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }
            String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
            String adminId = AuthHandler.jsonValue(body, "adminId");
            if (adminId.isBlank()) adminId = AuthHandler.jsonValue(body, "email");
            if (adminId.isBlank()) adminId = AuthHandler.jsonValue(body, "username");
            String password = AuthHandler.jsonValue(body, "password");

            if (database.checkAdmin(adminId, password)) {
                String token = "adm-" + Long.toHexString(System.currentTimeMillis());
                String response = "{\"success\":true,\"token\":\"" + token + "\",\"admin\":{\"id\":\"admin\",\"name\":\"GearMesh Root Admin\",\"role\":\"SUPER_ADMIN\"}}";
                sendJsonResponse(exchange, 200, response);
            } else {
                sendJsonResponse(exchange, 401, "{\"error\":\"Invalid Admin ID or Password. Default is admin / admin123\"}");
            }
        }
    }

    static class AdminStatsHandler implements HttpHandler {
        private final AuthDatabase database;

        AdminStatsHandler(AuthDatabase database) {
            this.database = database;
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 204, "");
                return;
            }
            try {
                int userCount = database.getAllUsers().size();
                String json = """
                    {
                        "totalUsers": %d,
                        "totalListings": 16,
                        "activeBorrows": 4,
                        "totalLockers": 8,
                        "activeLockers": 3,
                        "co2AvoidedKg": 642,
                        "materialKeptKg": 184.5,
                        "communitySavings": 84200,
                        "dbStatus": "CONNECTED",
                        "serverVersion": "1.0.0"
                    }
                    """.formatted(userCount);
                sendJsonResponse(exchange, 200, json);
            } catch (SQLException e) {
                sendJsonResponse(exchange, 500, "{\"error\":\"Failed to load stats\"}");
            }
        }
    }
}

