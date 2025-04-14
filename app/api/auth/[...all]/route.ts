import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function GET(req: NextRequest) {
    const path = req.nextUrl.pathname.replace('/api/auth/', '');
    
    try {
        switch (path) {
            case 'get-session':
                // Use the same pattern as in todos/page.tsx
                return await auth.api.getSession({
                    headers: headers()
                });
            default:
                return NextResponse.json({ error: 'Not Found' }, { status: 404 });
        }
    } catch (error) {
        console.error('GET Error:', error);
        return NextResponse.json({ 
            error: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const path = req.nextUrl.pathname.replace('/api/auth/', '');
    
    try {
        switch (path) {
            case 'sign-up/email':
                return await auth.api.signUp(req);
            case 'sign-in/email':
                return await auth.api.signIn(req);
            default:
                return NextResponse.json({ error: 'Not Found' }, { status: 404 });
        }
    } catch (error) {
        console.error('POST Error:', error);
        return NextResponse.json({ 
            error: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
}

export async function OPTIONS(req: NextRequest) {
    const corsHeaders = {
        'Access-Control-Allow-Origin': req.headers.get('origin') || '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true'
    };

    return new NextResponse(null, {
        status: 200,
        headers: corsHeaders
    });
}
