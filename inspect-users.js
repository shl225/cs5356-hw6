import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

async function inspectUsersTable() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || process.env.LOCAL_DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined
  });

  try {
    const client = await pool.connect();

    // Detailed column information for users table
    const columnsQuery = `
      SELECT 
        column_name, 
        data_type, 
        character_maximum_length,
        is_nullable,
        column_default
      FROM 
        information_schema.columns
      WHERE 
        table_schema = 'public' AND 
        table_name = 'users'
      ORDER BY 
        ordinal_position;
    `;

    const columnsResult = await client.query(columnsQuery);

    console.log('Users Table Columns:');
    columnsResult.rows.forEach(column => {
      console.log(`- ${column.column_name}`);
      console.log(`  Type: ${column.data_type}`);
      console.log(`  Nullable: ${column.is_nullable}`);
      if (column.character_maximum_length) {
        console.log(`  Max Length: ${column.character_maximum_length}`);
      }
      if (column.column_default) {
        console.log(`  Default: ${column.column_default}`);
      }
      console.log('---');
    });

    // Sample data (first few rows)
    const sampleDataQuery = `
      SELECT * FROM users LIMIT 5;
    `;

    const sampleDataResult = await client.query(sampleDataQuery);

    if (sampleDataResult.rows.length > 0) {
      console.log('\nSample User Data:');
      console.log(JSON.stringify(sampleDataResult.rows, null, 2));
    } else {
      console.log('\nNo users found in the database.');
    }

    client.release();
  } catch (err) {
    console.error('Error inspecting users table:', err);
  } finally {
    await pool.end();
  }
}

inspectUsersTable();