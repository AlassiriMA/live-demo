module.exports = {
  apps: [
    {
      name: 'portfolio',
      script: './scripts/prod-server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
        ENABLE_COMPRESSION: 'true',
        ENABLE_RATE_LIMIT: 'true'
      },
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '500M',
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};