import db from '../database.ts';

export interface MarketPrice {
  id: string;
  crop: string;
  price: string;
  region: string;
  trend: 'up' | 'down' | 'stable';
  updated_at?: string;
}

export class MarketService {
  /**
   * Fetches all market prices from the database.
   * Includes robust exception handling.
   */
  static getAllPrices(): MarketPrice[] {
    try {
      const stmt = db.prepare('SELECT * FROM market_prices ORDER BY crop ASC');
      return stmt.all() as MarketPrice[];
    } catch (error) {
      console.error('MarketService.getAllPrices Error:', error);
      throw new Error('DBMS_ERROR: Failed to retrieve market prices from SQL database.');
    }
  }

  /**
   * Updates a market price.
   */
  static updatePrice(id: string, price: string, trend: 'up' | 'down' | 'stable'): void {
    try {
      const stmt = db.prepare('UPDATE market_prices SET price = ?, trend = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
      const result = stmt.run(price, trend, id);
      if (result.changes === 0) {
        throw new Error(`No record found with ID: ${id}`);
      }
    } catch (error) {
      console.error('MarketService.updatePrice Error:', error);
      throw new Error('DBMS_ERROR: Failed to update market price.');
    }
  }
}
