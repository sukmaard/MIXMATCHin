const { spawn } = require('child_process');

const isWindows = process.platform === 'win32';
const npmCommand = isWindows ? 'npm.cmd' : 'npm';

const processes = [
  spawn(process.execPath, ['server/index.cjs'], {
    stdio: 'inherit',
    env: { ...process.env, API_PORT: process.env.API_PORT || '3001' }
  }),
  spawn(npmCommand, ['run', 'dev'], {
    stdio: 'inherit',
    env: { ...process.env }
  })
];

function shutdown() {
  processes.forEach(child => {
    if (!child.killed) child.kill();
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

processes.forEach(child => {
  child.on('exit', code => {
    if (code && code !== 0) {
      shutdown();
      process.exit(code);
    }
  });
});
