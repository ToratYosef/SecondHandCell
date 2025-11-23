import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting backend server on port 8032...');

const serverProcess = spawn('npx', ['tsx', join(__dirname, 'server', 'index.ts')], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production', PORT: '8032' }
});

serverProcess.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

serverProcess.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Server exited with code ${code}`);
  }
  process.exit(code);
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  serverProcess.kill('SIGINT');
});
