const path = require('path');
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  },
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'query',
            key: 'clearCache',
            value: 'true'
          }
        ],
        destination: '/pre-repay',
        permanent: false
      },
      {
        source: '/pre-repay',
        destination: '/',
        permanent: false
      }
    ];
  }
};

module.exports = nextConfig;
