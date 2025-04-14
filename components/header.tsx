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
        if (window.location.pathname === "/auth/sign-out") {
            handleSignOut();
        }
    }, [session]);

    useEffect(() => {
        if (session?.user?.id) {
            isAdmin(session.user.id).then(setIsUserAdmin);
        }
    }, [session]);

    const handleSignOut = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setSession(null); 
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
                        {isUserAdmin && <AdminNavEntry />}
                    </nav>
                </div>
                <UserButton/>
            </div>
        </header>
    );
}
