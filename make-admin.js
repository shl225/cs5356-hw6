import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

async function makeUserAdmin(email = 'sa@gmail.com', useLocalDB = true) {
  // Choose which database to connect to
  const connectionString = useLocalDB ? process.env.LOCAL_DATABASE_URL : process.env.DATABASE_URL;
  console.log(`Connecting to: ${connectionString ? connectionString.split('@')[1] : 'Unknown database'}`);
  
  const pool = new Pool({
    connectionString,
    ssl: !useLocalDB && process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined
  });

  try {
    const client = await pool.connect();
    
    // First, list all users to see what's actually in the database
    const allUsersQuery = `SELECT id, name, email, role FROM users;`;
    const allUsersResult = await client.query(allUsersQuery);
    
    console.log('\nAll users in database:');
    if (allUsersResult.rows.length === 0) {
      console.log('No users found in the database.');
    } else {
      allUsersResult.rows.forEach(user => {
        console.log({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || 'none'
        });
      });
    }
    
    // Try to find the user with case-insensitive matching
    const findUserQuery = `
      SELECT id, name, email, role FROM users WHERE LOWER(email) = LOWER($1);
    `;
    
    const userResult = await client.query(findUserQuery, [email]);
    
    if (userResult.rows.length === 0) {
      console.log(`\nNo user found with email: ${email} (case insensitive)`);
      return;
    }
    
    const user = userResult.rows[0];
    console.log('\nFound user:', {
      id: user.id,
      name: user.name,
      email: user.email,
      currentRole: user.role || 'none'
    });
    
    // Update the user's role to admin
    const updateQuery = `
      UPDATE users SET role = 'admin' WHERE id = $1 RETURNING id, name, email, role;
    `;
    
    const updateResult = await client.query(updateQuery, [user.id]);
    
    if (updateResult.rows.length > 0) {
      const updatedUser = updateResult.rows[0];
      console.log('\nUser successfully updated to admin:');
      console.log({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      });
    } else {
      console.log('Failed to update user role');
    }
    
    client.release();
  } catch (err) {
    console.error('Error updating user role:', err);
  } finally {
    await pool.end();
  }
}

// Run the function with the local database
const email = process.argv[2] || 'sa@gmail.com';
const useLocalDB = process.argv[3] !== 'remote'; // Default to local unless 'remote' is specified
console.log(`Looking for user with email: ${email} in ${useLocalDB ? 'local' : 'remote'} database`);
makeUserAdmin(email, useLocalDB);