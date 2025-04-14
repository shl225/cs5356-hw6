"use client"

import Link from "next/link"
import { UserButton } from "@daveyplate/better-auth-ui"
import { Button } from "./ui/button"
import { AdminNavEntry } from "./AdminNavEntry"
import { useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"

export function Header() {
    const [session, setSession] = useState<any>(null)
    const [isAdmin, setIsAdmin] = useState<boolean>(false)

    // Enhanced session fetching with debugging
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const currentSession = await authClient.getSession()
                console.log("Current session:", currentSession)
                setSession(currentSession)
                
                // Explicitly check for admin role and set state
                if (currentSession?.user?.role === 'admin') {
                    console.log("User is admin!")
                    setIsAdmin(true)
                } else {
                    console.log("User is not admin:", currentSession?.user?.role)
                    setIsAdmin(false)
                }
            } catch (error) {
                console.error("Failed to fetch session:", error)
            }
        }

        fetchSession()

        // Also refresh when window regains focus
        const handleFocus = () => {
            fetchSession()
        }

        window.addEventListener('focus', handleFocus)
        return () => {
            window.removeEventListener('focus', handleFocus)
        }
    }, [])

    return (
        <header className="sticky top-0 z-50 px-4 py-3 border-b bg-background/60 backdrop-blur">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2">
                        CS 5356 – HW 6
                    </Link>
                    {session && (
                        <nav className="flex items-center gap-2">
                            <Link href="/todos">
                                <Button variant="ghost">Todos</Button>
                            </Link>
                            {/* Use the explicit isAdmin state */}
                            {isAdmin && <AdminNavEntry />}
                        </nav>
                    )}
                </div>
                <UserButton />
            </div>
        </header>
    )
}
