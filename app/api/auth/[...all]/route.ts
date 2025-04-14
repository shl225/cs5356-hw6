import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"
import { NextRequest, NextResponse } from "next/server"

const { POST: postHandler, GET: getHandler } = toNextJsHandler(auth)

// Helper to add CORS headers to all responses
function addCorsHeaders(response: NextResponse, req: NextRequest) {
  const origin = req.headers.get('origin') || 'https://cs5356-hw6-git-main-shl225s-projects.vercel.app';
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function GET(req: NextRequest) {
  try {
    console.log("GET request to:", req.url)
    const response = await getHandler(req);
    return addCorsHeaders(response, req);
  } catch (error) {
    console.error("GET Error:", error)
    const errorResponse = NextResponse.json({ error: String(error) }, { status: 500 });
    return addCorsHeaders(errorResponse, req);
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("POST request to:", req.url)
    
    // Handle the sign-out request
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
        response.headers.set("Set-Cookie", `session=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`);
        
        return addCorsHeaders(response, req);
      } catch (error) {
        console.error("Sign-out error:", error);
        const errorResponse = NextResponse.json({ error: "Failed to sign out" }, { status: 500 });
        return addCorsHeaders(errorResponse, req);
      }
    }
    
    // All other POST requests
    const response = await postHandler(req);
    return addCorsHeaders(response, req);
  } catch (error) {
    console.error("POST Error:", error)
    const errorResponse = NextResponse.json({ error: String(error) }, { status: 500 });
    return addCorsHeaders(errorResponse, req);
  }
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin') || 'https://cs5356-hw6-git-main-shl225s-projects.vercel.app';
  
  const response = new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true'
    }
  });
  
  return response;
}
