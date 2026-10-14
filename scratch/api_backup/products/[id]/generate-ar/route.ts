import { NextRequest, NextResponse } from 'next/server';
import { getArRecord, setArRecord } from '@/lib/ai/arStore';
import { generateArImageWithGemini } from '@/lib/ai/geminiImageService';
import { initialProducts } from '@/data/products';

// Mutex lock to prevent duplicate parallel executions for the same product
const inFlightJobs = new Set<string>();

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const url = new URL(req.url);
  const force = url.searchParams.get('force') === 'true';

  let body: { imageUrl?: string; promptOverride?: string } = {};
  try {
    body = await req.json();
  } catch {
    // Body is optional
  }

  // 1. Resolve source image URL
  let sourceImageUrl = body.imageUrl;
  if (!sourceImageUrl) {
    const defaultProduct = initialProducts.find((p) => String(p.id) === id);
    if (defaultProduct) {
      sourceImageUrl = defaultProduct.image;
    }
  }

  // 2. Check existing record
  const existing = getArRecord(id);
  if (!force && existing && existing.status === 'completed' && existing.arImageUrl) {
    return NextResponse.json({
      id,
      status: 'completed',
      arImageUrl: existing.arImageUrl,
      message: 'Existing AR image retrieved from persistent database.',
      cached: true,
    });
  }

  // 3. Avoid duplicate parallel generation
  if (inFlightJobs.has(id)) {
    return NextResponse.json(
      {
        id,
        status: 'processing',
        message: 'Generation is already in progress for this product. Please wait.',
      },
      { status: 409 }
    );
  }

  if (!sourceImageUrl) {
    return NextResponse.json(
      {
        id,
        status: 'failed',
        error: 'No source image URL provided or found for this product.',
      },
      { status: 400 }
    );
  }

  // 4. Mark status as processing
  inFlightJobs.add(id);
  await setArRecord(id, {
    originalImageUrl: sourceImageUrl,
    status: 'processing',
    error: null,
  });

  try {
    // 5. Execute generation
    const result = await generateArImageWithGemini(id, sourceImageUrl, body.promptOverride);

    if (result.success && result.arImageUrl) {
      const updated = await setArRecord(id, {
        arImageUrl: result.arImageUrl,
        status: 'completed',
        error: null,
      });

      return NextResponse.json({
        id,
        status: 'completed',
        arImageUrl: updated.arImageUrl,
        message: 'AR image generated and persisted successfully.',
      });
    } else {
      const errReason = result.error || 'AI generation failed.';
      await setArRecord(id, {
        status: 'failed',
        error: errReason,
      });

      return NextResponse.json(
        {
          id,
          status: 'failed',
          error: errReason,
        },
        { status: 500 }
      );
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal generation error';
    await setArRecord(id, {
      status: 'failed',
      error: msg,
    });
    return NextResponse.json(
      {
        id,
        status: 'failed',
        error: msg,
      },
      { status: 500 }
    );
  } finally {
    inFlightJobs.delete(id);
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const record = getArRecord(id);

  if (!record) {
    return NextResponse.json(
      {
        id,
        status: 'pending',
        message: 'No AR image generation record found for this product.',
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: record.id,
    status: record.status,
    arImageUrl: record.arImageUrl || null,
    updatedAt: record.updatedAt,
    error: record.error || null,
  });
}
