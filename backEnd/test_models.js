const ProjectModel = require('./models/project.model');
const MaterialModel = require('./models/material.model');

async function test() {
  console.log('Testing ProjectModel.findAll()...');
  try {
    const projects = await ProjectModel.findAll();
    console.log('Projects loaded successfully, count:', projects.data.length);
  } catch (err) {
    console.error('ProjectModel.findAll() failed:', err);
  }

  console.log('\nTesting MaterialModel.findAll()...');
  try {
    const materials = await MaterialModel.findAll();
    console.log('Materials loaded successfully, count:', materials.length);
  } catch (err) {
    console.error('MaterialModel.findAll() failed:', err);
  }

  process.exit(0);
}

test();
