const { query } = require('./config/database');
const ProjectService = require('./services/project.service');

async function run() {
  try {
    console.log('Fetching all HTML contracts from the database...');
    // Find all documents with .html extension
    const docs = await query(
      "SELECT id, project_id, created_by, file_name FROM project_documents WHERE file_name LIKE '%.html' OR file_path LIKE '%.html'"
    );
    
    console.log(`Found ${docs.length} HTML contract(s) to migrate.`);
    
    for (const doc of docs) {
      console.log(`Migrating contract for project ${doc.project_id}...`);
      const result = await ProjectService.createContract(doc.project_id, doc.created_by || 1);
      console.log(`Successfully migrated ${doc.project_id}:`, result);
    }
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

run();
