"use client"
import Link from "next/link"
import { UserButton } from "@daveyplate/better-auth-ui"
import { Button } from "./ui/button"
import { AdminNavEntry } from "./AdminNavEntry"
import { auth } from "@/lib/auth"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

export function Header() {
    // Use React Query to fetch and cache session data
    const { data: session, refetch } = useQuery({
        queryKey: ["session"],
        queryFn: () => auth.api.getSession(),
        // Fallback to null if no session
        placeholderData: null
    })

    // Refetch session data when component mounts
    useEffect(() => {
        refetch()
    }, [refetch])

    // Debug session data
    console.log("Current session:", session)

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
                        {session?.user?.role === 'admin' && <AdminNavEntry />}
                    </nav>
                </div>
                <UserButton />
            </div>
        </header>
    )
}
