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
        destination: '/pre-repay',
        permanent: true
      }
    ];
  }
};

module.exports = nextConfig;
