module.exports = {
  apps: [{
    name: 'real-estate-backend',
    script: 'server.js',
    watch: true,
    ignore_watch: ['node_modules', 'uploads'],
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
