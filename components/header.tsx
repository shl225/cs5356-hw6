"use client"

import Link from "next/link"
import { UserButton } from "@daveyplate/better-auth-ui"
import { Button } from "./ui/button"
import { AdminNavEntry } from "./AdminNavEntry"
import { useSession } from "@/lib/hooks"  
import { useState, useEffect } from "react"  
import { isAdmin } from "@/lib/role-check"  
import { useRouter } from "next/navigation"
import { auth } from "@/lib/auth"

export function Header() {
    const { session, setSession } = useSession();
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if the page is redirected to /auth/sign-out
        if (window.location.pathname === "/auth/sign-out") {
            handleSignOut();
        }
    }, [session]);

    useEffect(() => {
        // If session is available, check if the user is an admin
        if (session?.user?.id) {
            isAdmin(session.user.id).then(setIsUserAdmin);
        }
    }, [session]);

    const handleSignOut = async () => {
        // Call the sign-out API to clear cookies on the server
        await fetch('/api/auth/sign-out', { method: 'POST' });

        // Manually reset session on client side to trigger UI update
        setSession(null); // Reset the session so the UI is updated

        // Optionally, redirect to home or login page
        router.push('/');
    };

    return (
        <header className="sticky top-0 z-50 px-4 py-3 border-b bg-background/60 backdrop-blur">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2">
                        CS 5356 – HW 6
                    </Link>
                    <nav className="flex items-center gap-2">
                        <Link href="/todos">
                            <Button variant="ghost">Todos</Button>
                        </Link>
                        {/* Show AdminNavEntry only if user is an admin */}
                        {isUserAdmin && <AdminNavEntry />}
                    </nav>
                </div>
                {/* Pass the handleSignOut function to UserButton to handle sign out */}
                <UserButton onSignOut={handleSignOut} />
            </div>
        </header>
    );
}
