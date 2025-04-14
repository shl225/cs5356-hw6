"use client"

import Link from "next/link"
import { UserButton } from "@daveyplate/better-auth-ui"
import { Button } from "./ui/button"
import { AdminNavEntry } from "./AdminNavEntry"
import { useState, useEffect } from "react"
import { authClient } from "@/lib/auth-client"  // Use authClient to get session

export function Header() {
    const [session, setSession] = useState<any>(null);

    // Fetch session data on component mount
    useEffect(() => {
        const fetchSession = async () => {
            const currentSession = await authClient.getSession();
            setSession(currentSession);
        };
        
        fetchSession(); // Fetch session immediately when the component mounts
    }, []); // Only run once on mount

    if (!session) {
        // If session is not available, show the public layout without Admin tab
        return (
            <header className="sticky top-0 z-50 px-4 py-3 border-b bg-background/60 backdrop-blur">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            CS 5356 – HW 6
                        </Link>
                    </div>
                    <UserButton />
                </div>
            </header>
        );
    }

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
                        {/* Show AdminNavEntry only if the user is an admin */}
                        {session?.user?.role === "admin" && <AdminNavEntry />}
                    </nav>
                </div>
                <UserButton />
            </div>
        </header>
    );
}
