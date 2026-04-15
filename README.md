# Smart Krishi AI 🌾

An AI-powered mobile assistant for farmers and gardeners featuring plant disease detection, crop recommendations, and a voice assistant.

## 🏗️ Architecture (Java-Inspired Design)

This project follows a professional **Enterprise Architecture** pattern, commonly found in Java/Spring applications, but implemented using **TypeScript and Node.js** for modern web performance.

### Key Layers:
1.  **Presentation Layer (React)**: A polished, responsive UI built with Tailwind CSS and Framer Motion.
2.  **Service Layer (DAO Pattern)**: Business logic is encapsulated in Service classes (`MarketService.ts`, `ScanService.ts`), mimicking Java's Data Access Object (DAO) pattern.
3.  **Data Layer (SQL DBMS)**: Powered by a robust **SQLite** database with structured schemas and relational integrity.
4.  **Exception Handling**: Comprehensive server-side middleware and client-side boundaries to handle application and database exceptions gracefully.

## 🛠️ Tech Stack
-   **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons.
-   **Backend**: Node.js, Express.
-   **Database**: SQLite (SQL DBMS).
-   **AI**: Google Gemini API (Vision & Voice).

## 📊 Database Schema
The database consists of the following tables:
-   `market_prices`: Real-time crop rates.
-   `scan_history`: Persistent history of plant disease detections.
-   `user_settings`: Application configuration.

Refer to `schema.sql` for the full DDL (Data Definition Language) scripts.

## 🚀 Features
-   **Plant Disease Detection**: Instant analysis of leaf photos using AI.
-   **Market Trends**: Live price tracking from nearby Mandis.
-   **AI Voice Assistant**: Supports Hindi, Marathi, and English with full voice-to-text and text-to-speech.
-   **Crop Recommendations**: Smart suggestions based on weather and location.
