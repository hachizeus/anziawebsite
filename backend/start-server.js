// This file is used to start the server on Render
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Start the server
const server = spawn('node', [join(__dirname, 'server.js')], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: process.env.PORT || 4000
  }
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.kill('SIGTERM');
});