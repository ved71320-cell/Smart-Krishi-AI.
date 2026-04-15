import db from '../database.ts';
import { v4 as uuidv4 } from 'uuid';

export interface ScanRecord {
  id: string;
  disease_name: string;
  confidence: number;
  image_data?: string;
  created_at?: string;
}

export class ScanService {
  /**
   * Saves a new scan result to the database.
   */
  static saveScan(record: Omit<ScanRecord, 'id' | 'created_at'>): ScanRecord {
    try {
      const id = uuidv4();
      const stmt = db.prepare(`
        INSERT INTO scan_history (id, disease_name, confidence, image_data)
        VALUES (?, ?, ?, ?)
      `);
      stmt.run(id, record.disease_name, record.confidence, record.image_data || null);
      
      return {
        id,
        ...record,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('ScanService.saveScan Error:', error);
      throw new Error('DBMS_ERROR: Failed to persist scan result to SQL database.');
    }
  }

  /**
   * Retrieves the recent scan history.
   */
  static getRecentHistory(limit: number = 10): ScanRecord[] {
    try {
      const stmt = db.prepare('SELECT * FROM scan_history ORDER BY created_at DESC LIMIT ?');
      return stmt.all(limit) as ScanRecord[];
    } catch (error) {
      console.error('ScanService.getRecentHistory Error:', error);
      throw new Error('DBMS_ERROR: Failed to fetch scan history.');
    }
  }
}
