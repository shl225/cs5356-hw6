import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    plugins: [
        adminClient() // adding admin role
    ],
    // Use BetterAuth's signOut callback
    onSignOut: () => {
        // Redirect to homepage after sign out
        window.location.href = "/"
    }
})
