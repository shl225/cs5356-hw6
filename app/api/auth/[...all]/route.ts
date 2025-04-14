import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"
import { NextRequest, NextResponse } from "next/server"

const { POST: postHandler, GET: getHandler } = toNextJsHandler(auth)

export async function GET(req: NextRequest) {
  try {
    console.log("GET request to:", req.url)
    return await getHandler(req)
  } catch (error) {
    console.error("GET Error:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("POST request to:", req.url)

    // Check if the request is for the sign-out route
    if (req.url.includes("sign-out")) {
      await auth.signOut(req); // Sign out the user
      // Explicitly clear the cookies for session removal
      const response = new NextResponse("Logged out successfully", { status: 200 });
      
      // Clear the session cookie
      response.headers.set("Set-Cookie", "session=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax");
      
      return response; // Return the response after signing out
    }
    
    return await postHandler(req)
  } catch (error) {
    console.error("POST Error:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function OPTIONS(req: NextRequest) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': req.headers.get('origin') || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true'
  }

  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders
  })
}
