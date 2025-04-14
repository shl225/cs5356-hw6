"use client"

import Link from "next/link"
import { UserButton } from "@daveyplate/better-auth-ui"
import { Button } from "./ui/button"
import { AdminNavEntry } from "./AdminNavEntry"
import { useState, useEffect } from "react"
import { authClient } from "@/lib/auth-client"

export function Header() {
    const [session, setSession] = useState<any>(null);

    // Refresh session on component mount and on window focus
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const currentSession = await authClient.getSession();
                setSession(currentSession);
            } catch (error) {
                console.error("Failed to fetch session:", error);
            }
        };
        
        // Fetch session immediately when component mounts
        fetchSession();
        
        // Also refresh when window regains focus
        const handleFocus = () => {
            fetchSession();
        };
        
        window.addEventListener('focus', handleFocus);
        
        // Clean up event listener
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    // Return consistent layout structure but conditionally show navigation items
    return (
        <header className="sticky top-0 z-50 px-4 py-3 border-b bg-background/60 backdrop-blur">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2">
                        CS 5356 – HW 6
                    </Link>
                    {/* Only show navigation if logged in */}
                    {session && (
                        <nav className="flex items-center gap-2">
                            <Link href="/todos">
                                <Button variant="ghost">Todos</Button>
                            </Link>
                            {/* Show AdminNavEntry only if the user is an admin */}
                            {session.user && session.user.role === "admin" && <AdminNavEntry />}
                        </nav>
                    )}
                </div>
                <UserButton />
            </div>
        </header>
    );
}
