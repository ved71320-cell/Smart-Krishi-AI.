-- Smart Krishi AI - Database Schema
-- This file is used for documentation and to help GitHub identify the SQL component of the project.

-- Table: market_prices
-- Stores real-time crop prices from various regions.
CREATE TABLE IF NOT EXISTS market_prices (
    id TEXT PRIMARY KEY,
    crop TEXT NOT NULL,
    price TEXT NOT NULL,
    region TEXT NOT NULL,
    trend TEXT CHECK(trend IN ('up', 'down', 'stable')) NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: scan_history
-- Stores the history of plant disease detections.
CREATE TABLE IF NOT EXISTS scan_history (
    id TEXT PRIMARY KEY,
    disease_name TEXT NOT NULL,
    confidence REAL NOT NULL,
    image_data TEXT, -- Base64 encoded image or URL
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: user_settings
-- Stores application-wide configuration and user preferences.
CREATE TABLE IF NOT EXISTS user_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);
