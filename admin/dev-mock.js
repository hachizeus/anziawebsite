// Development script for admin with mock API
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create .env file with mock API settings
const envContent = `VITE_BACKEND_URL=http://localhost:4000
USE_MOCK_API=true`;

try {
  fs.writeFileSync(path.join(__dirname, '.env'), envContent);
  console.log('.env file created with mock API settings');
} catch (error) {
  console.error('Error creating .env file:', error);
}

// Start the admin frontend
const adminProcess = spawn('npm', ['run', 'dev'], { 
  stdio: 'inherit',
  env: {
    ...process.env,
    USE_MOCK_API: 'true'
  }
});

adminProcess.on('error', (error) => {
  console.error('Failed to start admin frontend:', error);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Stopping admin frontend...');
  adminProcess.kill('SIGINT');
  process.exit(0);
});