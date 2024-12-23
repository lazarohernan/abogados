/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  experimental: {
    turbo: {
      rules: {
        // Configuración de reglas específicas para Turbopack
      }
    }
  },
  // Configuración específica para producción usando webpack
  webpack: (config, { isServer, dev }) => {
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