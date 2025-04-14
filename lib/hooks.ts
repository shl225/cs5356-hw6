"use client"

import { useState, useEffect } from "react"
import { auth } from "./auth"

export function useSession() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    let ignore = false;

    async function fetchSession() {
      // Create a Headers object if needed
      const headers = new Headers();
      // You can optionally add headers if needed:
      // headers.append('Cookie', document.cookie);

      const session = await auth.api.getSession({ headers });

      if (!ignore) {
        setSession(session);
      }
    }

    fetchSession();
    return () => {
      ignore = true;
    };
  }, []);

  return { session };
}
