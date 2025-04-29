/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    // Disable static error page generation
    useFileSystemPublicRoutes: true,
    // Configure images
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ui-avatars.com',
                pathname: '/api/**'
            }
        ]
    },
    // Add ESLint configuration
    eslint: {
        ignoreDuringBuilds: false,
        dirs: ['src']
    }
};

module.exports = nextConfig;
