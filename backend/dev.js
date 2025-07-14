// Development server script with mock API enabled
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Copy development env to .env
try {
  const devEnvPath = path.join(__dirname, '.env.development');
  const envPath = path.join(__dirname, '.env');
  
  if (fs.existsSync(devEnvPath)) {
    fs.copyFileSync(devEnvPath, envPath);
    console.log('Development environment variables copied to .env');
  } else {
    console.warn('Development environment file (.env.development) not found');
  }
} catch (error) {
  console.error('Error setting up development environment:', error);
}

// Start the server with nodemon
const server = spawn('nodemon', ['server.js'], { 
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development',
    USE_MOCK_API: 'true'
  }
});

server.on('error', (error) => {
  console.error('Failed to start server:', error);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Stopping development server...');
  server.kill('SIGINT');
  process.exit(0);
});
