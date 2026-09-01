import { NextRequest, NextResponse } from "next/server";

const REMOTE_BACKEND = process.env.BACKEND_INTERNAL_URL || "http://188.212.99.215:8080";

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const targetUrl = new URL(`/uploads/${path.join("/")}`, REMOTE_BACKEND);

  try {
    const remoteRes = await fetch(targetUrl.toString());
    const contentType = remoteRes.headers.get("content-type") || "image/jpeg";
    const data = await remoteRes.arrayBuffer();

    return new NextResponse(data, {
      status: remoteRes.status,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err: any) {
    return new NextResponse("Image not found", { status: 404 });
  }
}
