"use client"

import { useState, useEffect } from "react"
import { auth } from "./auth"

export function useSession() {
  const [session, setSession] = useState<any>(null); 

  useEffect(() => {
    let ignore = false;

    async function fetchSession() {
      const session = await auth.api.getSession({
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      });
      if (!ignore) {
        setSession(session);
      }
    }

    fetchSession();
    return () => {
      ignore = true;
    };
  }, []);

  return { session, setSession }; 
}
