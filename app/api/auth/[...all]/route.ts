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
    
    // Enhanced sign-out handling
    if (req.url.includes("sign-out")) {
      console.log("Processing sign-out request");
      
      try {
        // Let BetterAuth handle initial sign-out process
        const authResponse = await postHandler(req);
        console.log("BetterAuth sign-out complete");
        
        // Create a successful response
        const response = new NextResponse(JSON.stringify({ success: true }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        // Add CORS headers
        const corsResponse = addCorsHeaders(response, req);
        
        // Clear all possible session cookies (expanding the list to catch all)
        const cookiesToClear = [
          'session',
          'better_auth_session',
          'better-auth-session',
          'auth_session',
          'auth-session'
        ];
        
        cookiesToClear.forEach(cookieName => {
          corsResponse.headers.append(
            "Set-Cookie", 
            `${cookieName}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`
          );
        });
        
        console.log("Sign-out response cookies:", corsResponse.headers.get('Set-Cookie'));
        return corsResponse;
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
