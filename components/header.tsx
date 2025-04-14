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
