/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['pdf-parse']
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    NEXT_PUBLIC_ANTHROPIC_API_KEY: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
  },
  images: {
    domains: ['localhost', 'images.unsplash.com', 'via.placeholder.com'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        'canvas': 'commonjs canvas',
      });
    }

    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

    return config;
  },
}

module.exports = nextConfig