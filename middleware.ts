import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const pathname = request.nextUrl.pathname
  
  // Get the current session
  const session = await auth.api.getSession(request)
  
  // Handle /todos route - redirect to sign in if not authenticated
  if (pathname === "/todos") {
    if (!session) {
      const signInUrl = new URL("/auth/sign-in", request.url)
      return NextResponse.redirect(signInUrl)
    }
    return NextResponse.next()
  }
  
  // Handle /admin route - redirect to home if not authenticated or not admin
  if (pathname === "/admin") {
    if (!session || session.user.role !== "admin") {
      const homeUrl = new URL("/", request.url)
      return NextResponse.redirect(homeUrl)
    }
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export const config = {
  runtime: "nodejs",
  matcher: ["/todos", "/admin"]
}
