import fs from 'node:fs';
import path from 'node:path';
import { buildArGenerationPrompt } from './prompts';

export interface GenerationResult {
  success: boolean;
  arImageUrl?: string;
  error?: string;
}

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'generated-ar');

function ensureUploadsDirectory() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

/**
 * Downloads or reads an image into a buffer and extracts its MIME type
 */
async function getImageBufferAndMime(imagePathOrUrl: string): Promise<{ buffer: Buffer; mimeType: string }> {
  // 1. Local path in public/
  if (imagePathOrUrl.startsWith('/') && !imagePathOrUrl.startsWith('//')) {
    const cleanPath = imagePathOrUrl.split('?')[0];
    const absolutePath = path.join(process.cwd(), 'public', cleanPath);
    if (fs.existsSync(absolutePath)) {
      const buffer = fs.readFileSync(absolutePath);
      const ext = path.extname(absolutePath).toLowerCase();
      const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
      return { buffer, mimeType };
    }
  }

  // 2. Remote URL
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(imagePathOrUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NafisJewelleryAi/1.0)',
      },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Failed to download source image: HTTP ${res.status}`);
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let mimeType = 'image/jpeg';
    if (contentType.includes('png')) mimeType = 'image/png';
    else if (contentType.includes('webp')) mimeType = 'image/webp';

    return { buffer, mimeType };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    throw new Error(err instanceof Error ? err.message : 'Source image download timed out or failed');
  }
}

/**
 * Executes AI image generation using Google Gemini Nano Banana
 */
export async function generateArImageWithGemini(
  productId: string | number,
  sourceImageUrl: string,
  promptOverride?: string
): Promise<GenerationResult> {
  const idStr = String(productId);
  ensureUploadsDirectory();

  // 1. Check for Gemini API Key - MUST be configured
  const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
  if (!apiKey) {
    return {
      success: false,
      error:
        'کلید API اختصاصی Gemini (متغیر GEMINI_API_KEY) در فایل .env.local تنظیم نشده است. لطفاً کلید معتبر خود را در .env.local قرار دهید.',
    };
  }

  // 2. Fetch source image
  let imagePayload: { buffer: Buffer; mimeType: string };
  try {
    imagePayload = await getImageBufferAndMime(sourceImageUrl);
  } catch (err: unknown) {
    return {
      success: false,
      error: `Could not load source image: ${err instanceof Error ? err.message : 'Unknown error'}`,
    };
  }

  const prompt = buildArGenerationPrompt(promptOverride);
  const destinationFilename = `product_${idStr}.png`;
  const destinationPath = path.join(UPLOADS_DIR, destinationFilename);
  const publicUrl = `/uploads/generated-ar/${destinationFilename}`;
  const base64Data = imagePayload.buffer.toString('base64');

  // Attempt 1: Gemini Interactions API (Nano Banana 2 / gemini-3.1-flash-image)
  try {
    const interactionsEndpoint = `https://generativelanguage.googleapis.com/v1beta/interactions`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    const response = await fetch(interactionsEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        model: 'gemini-3.1-flash-image',
        input: [
          { type: 'text', text: prompt },
          { type: 'image', mime_type: imagePayload.mimeType, data: base64Data },
        ],
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const outputImage = data?.output_image || data?.output?.image;
      if (outputImage && outputImage.data) {
        const generatedBuffer = Buffer.from(outputImage.data, 'base64');
        fs.writeFileSync(destinationPath, generatedBuffer);
        return {
          success: true,
          arImageUrl: `${publicUrl}?v=${Date.now()}`,
        };
      }
    }
  } catch (err) {
    console.warn('[Gemini AI] Interactions API attempt failed, trying generateContent fallback:', err);
  }

  // Attempt 2: Standard generateContent API (gemini-2.5-flash-image)
  try {
    const generateContentEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    const response = await fetch(generateContentEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: imagePayload.mimeType,
                  data: base64Data,
                },
              },
            ],
          },
        ],
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        const imgData = part?.inline_data?.data || part?.inlineData?.data;
        if (imgData) {
          const generatedBuffer = Buffer.from(imgData, 'base64');
          fs.writeFileSync(destinationPath, generatedBuffer);
          return {
            success: true,
            arImageUrl: `${publicUrl}?v=${Date.now()}`,
          };
        }
      }
    } else {
      const errText = await response.text();
      let msg = errText;
      try {
        const parsed = JSON.parse(errText);
        msg = parsed.error?.message || errText;
      } catch {}
      return {
        success: false,
        error: `خطای Gemini API: ${msg.substring(0, 160)}`,
      };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown generation error';
    return {
      success: false,
      error: `پردازش هوش مصنوعی با خطا مواجه شد: ${msg}`,
    };
  }

  return {
    success: false,
    error: 'خروجی مدل هوش مصنوعی فاقد فایل تصویر بود.',
  };
}
