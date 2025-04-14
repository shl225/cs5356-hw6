"use client"

import { useCallback, useState, useEffect } from "react"
import { auth } from "./auth"

type ActionState = {
  status: "idle" | "executing" | "completed"
  error?: string
}

export function useSession() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    let ignore = false;

    async function fetchSession() {
      const session = await auth.api.getSession();
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

export function useActionState(action: (formData: FormData) => Promise<any>) {
  const [state, setState] = useState<ActionState>({ status: "idle" })

  const execute = useCallback(
    async (formData: FormData) => {
      setState({ status: "executing" })

      try {
        const result = await action(formData)
        if (result?.error) {
          setState({ status: "completed", error: result.error })
        } else {
          setState({ status: "completed" })
        }
        return result
      } catch (error) {
        setState({
          status: "completed",
          error: error instanceof Error ? error.message : "Something went wrong",
        })
        return { error: "Something went wrong" }
      }
    },
    [action]
  )

  return {
    ...state,
    execute,
  }
}