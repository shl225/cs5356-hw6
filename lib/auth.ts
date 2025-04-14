import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

import { db } from "@/database/db"
import * as schema from "@/database/schema"
import { nextCookies } from "better-auth/next-js"

import { admin } from "better-auth/plugins"

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        usePlural: true,
        schema
    }),
    session: {
        cookieCache: {
            enabled: true,
            // Cache duration in seconds.
            // set to 5 mins for development; 
            // could be a week or longer in production
            maxAge: 5 * 60 
        }
    },
    emailAndPassword: {
        enabled: true,
        allowedOrigins: process.env.BETTER_AUTH_URL.split(',').map(origin => origin.trim())
    },
    plugins: [
        nextCookies(), // keep this last in `plugins` array
        admin() //adding admin role
    ],
    routes: {
        api: {
            prefix: "/api/auth",
            signUp: "/sign-up/email",
            signIn: "/sign-in/email",
            getSession: "/get-session"
        }
    }
})
