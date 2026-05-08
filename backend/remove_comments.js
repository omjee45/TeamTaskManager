const fs = require('fs');
const path = require('path');

const filePaths = [
  '../frontend/src/pages/Tasks.jsx',
  '../frontend/src/pages/Projects.jsx',
  '../frontend/src/pages/Dashboard.jsx',
  '../frontend/src/App.jsx',
  './src/routes/userRoutes.js',
  './src/models/User.js',
  './src/controllers/taskController.js',
  './src/controllers/projectController.js',
  './src/controllers/dashboardController.js',
  './src/controllers/authController.js',
  './server.js'
];

filePaths.forEach(relPath => {
  const absolutePath = path.join(__dirname, relPath);
  if (!fs.existsSync(absolutePath)) return;
  
  let content = fs.readFileSync(absolutePath, 'utf8');
  
  // Remove JSX comments: {/* ... */}
  content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  
  // Remove line comments but only if they start with // (ignoring whitespace) to avoid URLs
  content = content.replace(/^\s*\/\/.*$/gm, '');

  // Clean up multiple empty lines left behind by comment removal
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

  fs.writeFileSync(absolutePath, content, 'utf8');
  console.log(`Cleaned ${absolutePath}`);
});
