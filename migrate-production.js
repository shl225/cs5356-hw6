import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path from 'path';

async function runMigrations() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { 
      rejectUnauthorized: false 
    }
  });

  try {
    const client = await pool.connect();
    
    // Read migration files
    const migrationDir = './database/migrations';
    const migrationFiles = fs.readdirSync(migrationDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // ensure migrations are applied in order

    console.log('Migration files found:', migrationFiles);

    // Apply each migration
    for (const file of migrationFiles) {
      const migrationPath = path.join(migrationDir, file);
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      
      console.log(`Applying migration: ${file}`);
      try {
        await client.query(migrationSQL);
        console.log(`Migration ${file} applied successfully`);
      } catch (error) {
        console.error(`Error applying migration ${file}:`, error);
      }
    }

    client.release();
  } catch (error) {
    console.error('Migration process failed:', error);
  } finally {
    await pool.end();
  }
}

runMigrations();