"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "./ui/button"
import { authClient } from "@/lib/auth-client"

export function AdminNavEntry() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const interval = setInterval(async () => {
      const session = await authClient.getSession()
      const user = session?.data?.user
      setIsAdmin(user?.role === "admin")
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!isAdmin) return null

  return (
    <Link href="/admin">
      <Button variant="ghost">Admin</Button>
    </Link>
  )
}
