import * as mysql from 'mysql2/promise';

export interface Bookmark {
  id: number;
  url: string;
  title: string;
  created_at: Date;
}

export interface HistoryItem {
  id: number;
  url: string;
  title: string;
  visited_at: Date;
}

export class DatabaseManager {
  private connection: mysql.Connection | null = null;

  async initialize() {
    try {
      // Connect to MySQL server
      this.connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '12345678',
        database: 'probe_browser',
        authPlugins: {
          mysql_native_password: () => () => Buffer.alloc(0)
        }
      });

      console.log('Connected to MySQL database');
      
      // Create tables if they don't exist
      await this.createTables();
    } catch (error: any) {
      if (error.code === 'ER_BAD_DB_ERROR') {
        // Database doesn't exist, create it
        await this.createDatabase();
        await this.initialize();
      } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        console.warn('MySQL access denied. Running without database. Bookmarks and history will not be saved.');
        // Continue without database - browser will still work
        return;
      } else {
        console.error('Database connection error:', error);
        console.warn('Running without database. Bookmarks and history will not be saved.');
        // Don't throw - allow browser to work without database
        return;
      }
    }
  }

  private async createDatabase() {
    try {
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '12345678',
        authPlugins: {
          mysql_native_password: () => () => Buffer.alloc(0)
        }
      });

      await connection.query('CREATE DATABASE IF NOT EXISTS probe_browser');
      await connection.end();
      console.log('Database created successfully');
    } catch (error) {
      console.error('Error creating database:', error);
      throw error;
    }
  }

  private async createTables() {
    if (!this.connection) return;

    // Create bookmarks table
    await this.connection.query(`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        url VARCHAR(2048) NOT NULL,
        title VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create history table
    await this.connection.query(`
      CREATE TABLE IF NOT EXISTS history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        url VARCHAR(2048) NOT NULL,
        title VARCHAR(255),
        visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_visited_at (visited_at)
      )
    `);

    console.log('Database tables created successfully');
  }

  async addBookmark(url: string, title: string): Promise<void> {
    if (!this.connection) throw new Error('Database not connected');
    
    await this.connection.query(
      'INSERT INTO bookmarks (url, title) VALUES (?, ?)',
      [url, title]
    );
  }

  async getBookmarks(): Promise<Bookmark[]> {
    if (!this.connection) throw new Error('Database not connected');
    
    const [rows] = await this.connection.query(
      'SELECT * FROM bookmarks ORDER BY created_at DESC'
    );
    
    return rows as Bookmark[];
  }

  async deleteBookmark(id: number): Promise<void> {
    if (!this.connection) throw new Error('Database not connected');
    
    await this.connection.query('DELETE FROM bookmarks WHERE id = ?', [id]);
  }

  async addHistory(url: string, title: string): Promise<void> {
    if (!this.connection) throw new Error('Database not connected');
    
    await this.connection.query(
      'INSERT INTO history (url, title) VALUES (?, ?)',
      [url, title]
    );
  }

  async getHistory(limit: number = 100): Promise<HistoryItem[]> {
    if (!this.connection) throw new Error('Database not connected');
    
    const [rows] = await this.connection.query(
      'SELECT * FROM history ORDER BY visited_at DESC LIMIT ?',
      [limit]
    );
    
    return rows as HistoryItem[];
  }

  async clearHistory(): Promise<void> {
    if (!this.connection) throw new Error('Database not connected');
    
    await this.connection.query('DELETE FROM history');
  }

  async close() {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }
  }
}
