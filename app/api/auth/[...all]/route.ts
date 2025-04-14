import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"
import { NextRequest, NextResponse } from "next/server"

const { POST: postHandler, GET: getHandler } = toNextJsHandler(auth)

// Helper to add CORS headers to all responses
function addCorsHeaders(response: Response, req: NextRequest) {
  const origin = req.headers.get('origin') || 'https://cs5356-hw6-git-main-shl225s-projects.vercel.app';
  
  // Create a new response with the same body, status and headers
  const newResponse = new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
  
  // Add CORS headers
  newResponse.headers.set('Access-Control-Allow-Origin', origin);
  newResponse.headers.set('Access-Control-Allow-Credentials', 'true');
  newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return newResponse;
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
        
        // Convert to NextResponse and add cookie clearing
        const response = addCorsHeaders(authResponse, req);
        
        // Add cookie clearing header
        response.headers.set("Set-Cookie", `session=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`);
        
        return response;
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
  
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true'
    }
  });
}
