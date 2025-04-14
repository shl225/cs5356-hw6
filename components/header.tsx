"use client"

import Link from "next/link"
import { UserButton } from "@daveyplate/better-auth-ui"
import { Button } from "./ui/button"
import { AdminNavEntry } from "./AdminNavEntry"
import { authClient } from "@/lib/auth-client"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

export function Header() {
    //react query hook to fetch session data
    const { data: session, refetch } = useQuery({
        queryKey: ["session"],
        queryFn: () => authClient.getSession(),
    })

    //refetch session data when component mounts
    useEffect(() => {
        refetch()
    }, [refetch])

    //debug session data
    console.log("Current session:", session)

    const isAdmin = session && "user" in session && session.user?.role === 'admin';

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
                        {isAdmin && <AdminNavEntry />}
                    </nav>
                </div>
                <UserButton />
            </div>
        </header>
    )
}
