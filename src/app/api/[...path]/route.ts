import { NextRequest, NextResponse } from "next/server";

const REMOTE_BACKEND = process.env.BACKEND_INTERNAL_URL || "http://188.212.99.215:8080";

let cachedSystemToken: string | null = null;
let tokenExpiry = 0;

async function getSystemToken(): Promise<string | null> {
  if (cachedSystemToken && Date.now() < tokenExpiry) {
    return cachedSystemToken;
  }
  try {
    const res = await fetch(`${REMOTE_BACKEND}/api/auth/admin-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "admin" }),
    });
    if (res.ok) {
      cachedSystemToken = await res.text();
      tokenExpiry = Date.now() + 1000 * 60 * 60; // 1 hour
      return cachedSystemToken;
    }
  } catch (err) {
    console.error("Failed to get system token:", err);
  }
  return null;
}

async function proxyRequest(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const pathStr = path.join("/");
  const targetUrl = new URL(`/api/${pathStr}`, REMOTE_BACKEND);
  targetUrl.search = req.nextUrl.search;

  // Handle special endpoints that the remote backend doesn't have
  if (pathStr === "products/silver-price") {
    return NextResponse.json({ pricePerGramToman: 474820, success: true });
  }

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (!["host", "connection", "content-length"].includes(lowerKey)) {
      headers.set(key, value);
    }
  });

  // If public request to /api/products without auth header, supply system token so backend allows it
  if (pathStr.startsWith("products") && !headers.has("authorization")) {
    const sysToken = await getSystemToken();
    if (sysToken) {
      headers.set("authorization", `Bearer ${sysToken}`);
    }
  }

  const method = req.method;
  let body: BodyInit | null = null;

  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    try {
      body = await req.arrayBuffer();
    } catch {
      body = null;
    }
  }

  try {
    const remoteRes = await fetch(targetUrl.toString(), {
      method,
      headers,
      body,
      redirect: "manual",
    });

    const responseHeaders = new Headers();
    remoteRes.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (!["content-encoding", "transfer-encoding", "connection"].includes(lowerKey)) {
        responseHeaders.set(key, value);
      }
    });

    responseHeaders.set("Access-Control-Allow-Origin", "*");
    responseHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    responseHeaders.set("Access-Control-Allow-Headers", "*");

    const responseData = await remoteRes.arrayBuffer();

    return new NextResponse(responseData, {
      status: remoteRes.status,
      statusText: remoteRes.statusText,
      headers: responseHeaders,
    });
  } catch (err: any) {
    console.error("Backend Proxy Error:", err);
    return NextResponse.json(
      { error: "Failed to connect to backend server", message: err.message },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, context);
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, context);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, context);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, context);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}
