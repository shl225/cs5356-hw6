import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/database/db";
import * as schema from "@/database/schema";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";

// Use a fallback in case BETTER_AUTH_URL is not defined
const betterAuthUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000"; // Default fallback URL

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        usePlural: true,
        schema,
    }),
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // Session expiration
        },
    },
    emailAndPassword: {
        enabled: true,    },
    plugins: [
        nextCookies(), // Keep this last in plugins array
        admin(), // Adding the admin role plugin
    ],
    routes: {
        api: {
            prefix: "/api/auth",
            signUp: "/sign-up/email",
            signIn: "/sign-in/email",
            getSession: "/get-session",
        },
    },
});
