const { query } = require('./config/database');

async function checkDb() {
  console.log('--- SHOW TABLES ---');
  try {
    const tables = await query('SHOW TABLES;');
    console.log(tables);
  } catch (err) {
    console.error('SHOW TABLES failed:', err);
  }

  console.log('\n--- DESCRIBE projects ---');
  try {
    const descProjects = await query('DESCRIBE projects;');
    console.log(descProjects);
  } catch (err) {
    console.error('DESCRIBE projects failed:', err);
  }

  process.exit(0);
}

checkDb();
