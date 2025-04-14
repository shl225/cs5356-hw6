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
    const { session } = useSession()
    const [isUserAdmin, setIsUserAdmin] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // If session is available, check if the user is an admin
        if (session?.user?.id) {
            isAdmin(session.user.id).then(setIsUserAdmin)
        }
    }, [session])

    useEffect(() => {
        // Redirect to home if user is logged out
        if (!session?.user) {
            router.push('/')
        }
    }, [session, router])

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

                {/* Use UserButton for sign-out */}
                <div>
                    <UserButton />
                </div>
            </div>
        </header>
    )
}
