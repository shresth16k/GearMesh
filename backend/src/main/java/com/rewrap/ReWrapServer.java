package com.rewrap;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

/**
 * ReWrap Native Java REST API Server
 * Built with standard JDK 17 com.sun.net.httpserver
 * Provides instant live endpoints with zero external dependencies.
 */
public class ReWrapServer {
    private static final int PORT = 8080;

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);

        // CORS and Options pre-flight handler wrapper
        server.createContext("/api/health", new HealthHandler());
        server.createContext("/api/items", new ItemsHandler());
        server.createContext("/api/transactions", new TransactionsHandler());
        server.createContext("/api/user/profile", new ProfileHandler());
        server.createContext("/api/borrow", new BorrowHandler());

        server.setExecutor(null);
        System.out.println("=================================================");
        System.out.println("  ReWrap Java Backend Server Started on Port " + PORT);
        System.out.println("  Philosophy: Things move. People connect. A greener tomorrow.");
        System.out.println("  Endpoints: http://localhost:8080/api/health");
        System.out.println("             http://localhost:8080/api/items");
        System.out.println("             http://localhost:8080/api/transactions");
        System.out.println("             http://localhost:8080/api/user/profile");
        System.out.println("=================================================");
        server.start();
    }

    private static void sendJsonResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
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
                    "service": "ReWrap Java Backend",
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
}
