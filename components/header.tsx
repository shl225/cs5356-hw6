"use client"

import Link from "next/link"
import { UserButton } from "@daveyplate/better-auth-ui"
import { Button } from "./ui/button"
import { AdminNavEntry } from "./AdminNavEntry"
import { useSession } from "@/lib/hooks"  
import { useState, useEffect } from "react"  
import { isAdmin } from "@/lib/role-check"  

export function Header() {
    const { session } = useSession();
    const [isUserAdmin, setIsUserAdmin] = useState(false);

    useEffect(() => {
        if (session?.user) {
            isAdmin(session.user.id).then(setIsUserAdmin);
        }
    }, [session]);

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
                <UserButton />
            </div>
        </header>
    );
}
