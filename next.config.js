/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    // Disable static error page generation
    useFileSystemPublicRoutes: true,
    // Reduce these to essentials
    images: {
        unoptimized: true
    },
    // Add ESLint configuration
    eslint: {
        ignoreDuringBuilds: false,
        dirs: ['src']
    }
};

module.exports = nextConfig;
