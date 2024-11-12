/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['http2.mlstatic.com'],
      },
      env: {
        JWT_SECRET: process.env.JWT_SECRET,  // Expone JWT_SECRET a todo el proyecto
      },
};

console.log('JWT_SECRET in next.config.js:', process.env.JWT_SECRET);

export default nextConfig;
