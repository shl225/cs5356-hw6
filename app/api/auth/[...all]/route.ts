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

    // Handle the sign-out request by first using the BetterAuth handler
    // then ensuring cookies are cleared
    if (req.url.includes("sign-out")) {
      try {
        // Let BetterAuth handle initial sign-out process
        const authResponse = await postHandler(req);
        
        // Now ensure all cookies are properly cleared
        const response = new NextResponse(JSON.stringify({ success: true }), { 
          status: 200,
          headers: authResponse.headers
        });
        
        // Add cookie clearing headers
        response.headers.append("Set-Cookie", `session=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`);
        
        return response;
      } catch (error) {
        console.error("Sign-out error:", error);
        return NextResponse.json({ error: "Failed to sign out" }, { status: 500 });
      }
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
