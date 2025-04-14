import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"

const isProduction = typeof window !== 'undefined' && 
  window.location.hostname.includes('vercel.app');

export const authClient = createAuthClient({
    plugins: [
        adminClient() // adding admin role
    ],
    // Use BetterAuth's signOut callback
    onSignOut: () => {
        // Redirect to homepage after sign out
        window.location.href = "/"
    },
    // Set baseUrl for production environments
    ...(isProduction ? {
        baseUrl: 'https://cs5356-hw6-git-main-shl225s-projects.vercel.app'
    } : {})
})
