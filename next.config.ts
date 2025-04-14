import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    experimental: {
        nodeMiddleware: true,  // Keep this enabled to use node middleware
    },
    async headers() {
        return [
            {
                source: '/api/auth/(.*)',  // This should work better for matching all routes under /api/auth/
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
                    { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
                    { key: 'Access-Control-Allow-Credentials', value: 'true' },
                ],
            },
        ]
    },
    async rewrites() {
        return [
            {
                source: '/todos',
                destination: '/api/todos',  // Adjust this to match your actual endpoint
            },
        ]
    }
}

export default nextConfig
