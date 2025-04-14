import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    experimental: {
        nodeMiddleware: true,  
    },
    async headers() {
        return [
            {
                source: '/api/auth/(.*)',  
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: 'https://cs5356-hw6-git-main-shl225s-projects.vercel.app' },
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
                destination: '/api/todos',  
            },
        ]
    }
}

export default nextConfig
