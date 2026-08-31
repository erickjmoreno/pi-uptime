export default {
  apps: [
    {
      name: 'pi-uptime',
      script: './index.js',
      autorestart: true,
      watch: false,
      max_memory_restart: '100M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
