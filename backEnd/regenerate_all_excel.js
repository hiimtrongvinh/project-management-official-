require('dotenv').config();
const { query } = require('./config/database');
const ProjectService = require('./services/project.service');

async function run() {
  try {
    console.log('Fetching all projects from database...');
    const projects = await query('SELECT id, title FROM projects');
    console.log(`Found ${projects.length} project(s) to process.`);
    
    for (const project of projects) {
      console.log(`Checking materials/items for project: ${project.title} (${project.id})...`);
      const items = await query('SELECT id FROM project_items WHERE project_id = ?', [project.id]);
      
      if (items.length > 0) {
        console.log(`Regenerating Excel documents for project ${project.id}...`);
        
        // Regenerate Handover Note
        try {
          const handoverResult = await ProjectService.createHandoverNote(project.id, 1);
          console.log(`-> Handover Note regenerated: ${handoverResult.file_name}`);
        } catch (err) {
          console.log(`-> Skipping Handover Note: ${err.message}`);
        }

        // Regenerate Acceptance Note
        try {
          const acceptanceResult = await ProjectService.createAcceptanceNote(project.id, 1);
          console.log(`-> Acceptance Note regenerated: ${acceptanceResult.file_name}`);
        } catch (err) {
          console.log(`-> Skipping Acceptance Note: ${err.message}`);
        }
      } else {
        console.log(`-> No items found, skipping.`);
      }
    }
    
    console.log('All Excel documents regenerated successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Regeneration process failed:', err);
    process.exit(1);
  }
}

run();
