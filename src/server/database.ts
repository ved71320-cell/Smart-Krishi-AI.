import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const dbPath = path.resolve(process.cwd(), 'smart_krishi.db');

// Initialize database
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Exception Handling for Database Initialization
try {
  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS market_prices (
      id TEXT PRIMARY KEY,
      crop TEXT NOT NULL,
      price TEXT NOT NULL,
      region TEXT NOT NULL,
      trend TEXT CHECK(trend IN ('up', 'down', 'stable')) NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS scan_history (
      id TEXT PRIMARY KEY,
      disease_name TEXT NOT NULL,
      confidence REAL NOT NULL,
      image_data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Seed initial market data if empty
  const rowCount = db.prepare('SELECT COUNT(*) as count FROM market_prices').get() as { count: number };
  if (rowCount.count === 0) {
    const insert = db.prepare('INSERT INTO market_prices (id, crop, price, region, trend) VALUES (?, ?, ?, ?, ?)');
    const initialData = [
      ['1', 'Wheat', '₹2,150/q', 'Nashik, MH', 'up'],
      ['2', 'Rice (Basmati)', '₹4,200/q', 'Karnal, HR', 'stable'],
      ['3', 'Tomato', '₹1,200/q', 'Pune, MH', 'down'],
      ['4', 'Onion', '₹1,800/q', 'Lasalgaon, MH', 'up'],
      ['5', 'Cotton', '₹7,500/q', 'Rajkot, GJ', 'stable']
    ];
    
    const transaction = db.transaction((data) => {
      for (const row of data) insert.run(row);
    });
    transaction(initialData);
    console.log('Database seeded with initial market data.');
  }
} catch (error) {
  console.error('Failed to initialize database:', error);
  throw new Error('Database Initialization Error: ' + (error instanceof Error ? error.message : String(error)));
}

export default db;
