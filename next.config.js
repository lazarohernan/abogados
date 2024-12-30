/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  experimental: {
    turbo: {
      rules: {
        // Configuración de reglas específicas para Turbopack
      },
    },
  },
  webpack: (config, { isServer, dev }) => {
    // Configuración del alias '@'
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');

    // Configuración específica para producción
    if (!dev) {
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        bufferutil: 'commonjs bufferutil',
      });
    }
    return config;
  },
};

module.exports = nextConfig;