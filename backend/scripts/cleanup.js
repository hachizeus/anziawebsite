import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Files to remove (relative to backend directory)
const filesToRemove = [
  'utils/cloudinary.js',
  'config/cloudinary.js',
  'config/supabase.js',
  'middleware/supabaseMiddleware.js',
  'utils/supabaseUtils.js'
];

// Directories to check for unused files
const dirsToCheck = [
  'utils',
  'config',
  'middleware',
  'routes',
  'controllers',
  'models'
];

// Function to safely remove a file
function removeFile(filePath) {
  const fullPath = path.join(rootDir, filePath);
  
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
      console.log(`✅ Removed: ${filePath}`);
      return true;
    } catch (error) {
      console.error(`❌ Error removing ${filePath}:`, error.message);
      return false;
    }
  } else {
    console.log(`⚠️ File not found: ${filePath}`);
    return false;
  }
}

// Function to scan files for Supabase references
function scanForSupabaseReferences(directory) {
  const results = [];
  
  try {
    const files = fs.readdirSync(path.join(rootDir, directory));
    
    for (const file of files) {
      const filePath = path.join(rootDir, directory, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isFile() && (file.endsWith('.js') || file.endsWith('.jsx'))) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        if (content.includes('supabase') || 
            content.includes('Supabase') || 
            content.includes('@supabase/supabase-js')) {
          results.push({
            path: path.join(directory, file),
            references: (content.match(/supabase|Supabase|@supabase\/supabase-js/g) || []).length
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning ${directory}:`, error.message);
  }
  
  return results;
}

// Main function
async function cleanup() {
  console.log('=== CLEANUP SCRIPT ===');
  console.log('Removing unused files and Supabase references...\n');
  
  // Remove specified files
  let removedCount = 0;
  for (const file of filesToRemove) {
    if (removeFile(file)) {
      removedCount++;
    }
  }
  
  console.log(`\nRemoved ${removedCount} out of ${filesToRemove.length} files.\n`);
  
  // Scan for Supabase references
  console.log('Scanning for Supabase references...\n');
  
  let totalReferences = 0;
  let filesWithReferences = 0;
  
  for (const dir of dirsToCheck) {
    const references = scanForSupabaseReferences(dir);
    
    if (references.length > 0) {
      console.log(`Found references in ${dir}:`);
      
      for (const ref of references) {
        console.log(`  - ${ref.path}: ${ref.references} references`);
        totalReferences += ref.references;
        filesWithReferences++;
      }
      
      console.log('');
    }
  }
  
  console.log(`\nFound ${totalReferences} Supabase references in ${filesWithReferences} files.`);
  console.log('\nCleanup complete!');
}

// Run the cleanup
cleanup().catch(error => {
  console.error('Error during cleanup:', error);
  process.exit(1);
});