import { NextRequest, NextResponse } from 'next/server';
import { getArRecord, setArRecord } from '@/lib/ai/arStore';
import { generateArImageWithGemini } from '@/lib/ai/geminiImageService';

const inFlightJobs = new Set<string>();

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ imageId: string }> }
) {
  const { imageId } = await context.params;
  const url = new URL(req.url);
  const force = url.searchParams.get('force') === 'true';

  let body: { imageUrl?: string; promptOverride?: string } = {};
  try {
    body = await req.json();
  } catch {}

  const sourceImageUrl = body.imageUrl;
  const existing = getArRecord(imageId);

  if (!force && existing && existing.status === 'completed' && existing.arImageUrl) {
    return NextResponse.json({
      imageId,
      status: 'completed',
      arImageUrl: existing.arImageUrl,
      cached: true,
    });
  }

  if (inFlightJobs.has(imageId)) {
    return NextResponse.json(
      {
        imageId,
        status: 'processing',
        message: 'Generation already in progress.',
      },
      { status: 409 }
    );
  }

  if (!sourceImageUrl) {
    return NextResponse.json(
      {
        imageId,
        status: 'failed',
        error: 'Required imageUrl is missing in request body.',
      },
      { status: 400 }
    );
  }

  inFlightJobs.add(imageId);
  await setArRecord(imageId, {
    originalImageUrl: sourceImageUrl,
    status: 'processing',
    error: null,
  });

  try {
    const result = await generateArImageWithGemini(imageId, sourceImageUrl, body.promptOverride);
    if (result.success && result.arImageUrl) {
      const updated = await setArRecord(imageId, {
        arImageUrl: result.arImageUrl,
        status: 'completed',
        error: null,
      });
      return NextResponse.json({
        imageId,
        status: 'completed',
        arImageUrl: updated.arImageUrl,
      });
    } else {
      await setArRecord(imageId, {
        status: 'failed',
        error: result.error,
      });
      return NextResponse.json(
        {
          imageId,
          status: 'failed',
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown generation error';
    await setArRecord(imageId, { status: 'failed', error: msg });
    return NextResponse.json({ imageId, status: 'failed', error: msg }, { status: 500 });
  } finally {
    inFlightJobs.delete(imageId);
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ imageId: string }> }
) {
  const { imageId } = await context.params;
  const record = getArRecord(imageId);

  if (!record) {
    return NextResponse.json(
      {
        imageId,
        status: 'pending',
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    imageId: record.id,
    status: record.status,
    arImageUrl: record.arImageUrl || null,
    updatedAt: record.updatedAt,
    error: record.error || null,
  });
}
