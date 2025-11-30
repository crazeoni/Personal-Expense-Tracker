const fs = require('fs');
const path = require('path');

// Copy shared package directly into dist (not in node_modules)
const sharedSrc = path.join(__dirname, '../shared/dist');
const sharedDest = path.join(__dirname, 'dist/@expense-tracker/shared');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`Source not found: ${src}`);
    return;
  }
  
  // Remove __tests__ from shared
  if (path.basename(src) === '__tests__') {
    return;
  }
  
  fs.mkdirSync(dest, { recursive: true });
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.name === '__tests__') continue;
    
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Copying shared package for Lambda...');
copyRecursive(sharedSrc, sharedDest);

console.log('✅ Shared package copied successfully!');