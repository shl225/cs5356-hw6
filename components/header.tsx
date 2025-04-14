"use client"

import Link from "next/link"
import { UserButton } from "@daveyplate/better-auth-ui"
import { Button } from "./ui/button"
import { AdminNavEntry } from "./AdminNavEntry"
import { useSession } from "@/lib/hooks"  
import { useState, useEffect } from "react"  
import { isAdmin } from "@/lib/role-check"  
import { useRouter } from "next/navigation"

export function Header() {
    const { session, setSession } = useSession();
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if the user is an admin as soon as the session is available
        if (session?.user?.id) {
            isAdmin(session.user.id).then(setIsUserAdmin);
        }
    }, [session]);

    // Handle logout (clear cookies and refresh session)
    const handleLogout = async () => {
        await fetch('/api/auth/sign-out', {
            method: 'POST',
            credentials: 'include', // Ensure cookies are sent with the request
        });
        setSession(null); // Reset session state
        router.push('/'); // Redirect to the home page or login page
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
                        {/* Only show the Admin tab if the user is an admin */}
                        {isUserAdmin && <AdminNavEntry />}
                    </nav>
                </div>
                <div className="flex items-center gap-2">
                    <UserButton />
                    <button onClick={handleLogout} className="text-sm font-medium text-primary hover:text-secondary">
                        Sign out
                    </button>
                </div>
            </div>
        </header>
    );
}
