import fs from 'node:fs';
import path from 'node:path';

export type ArImageStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface ArImageRecord {
  id: string;
  originalImageUrl: string;
  arImageUrl?: string;
  status: ArImageStatus;
  promptUsed?: string;
  error?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ArMetadataDatabase {
  products: Record<string, ArImageRecord>;
}

const DATA_FILE_PATH = path.join(process.cwd(), 'public', 'data', 'ar-metadata.json');

// In-memory cache for ultra-fast response times
let memoryCache: ArMetadataDatabase | null = null;
let writeQueue: Promise<void> = Promise.resolve();

function ensureDataDirectory() {
  const dir = path.dirname(DATA_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Reads the database from disk or in-memory cache
 */
export function getArDatabase(): ArMetadataDatabase {
  if (memoryCache) {
    return memoryCache;
  }

  ensureDataDirectory();

  if (fs.existsSync(DATA_FILE_PATH)) {
    try {
      const content = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      memoryCache = JSON.parse(content);
      return memoryCache!;
    } catch (err) {
      console.error('[AR Store] Error reading ar-metadata.json, initializing fresh store:', err);
    }
  }

  memoryCache = { products: {} };
  return memoryCache;
}

/**
 * Persists the current database to disk atomically
 */
async function persistDatabase(data: ArMetadataDatabase): Promise<void> {
  memoryCache = data;
  writeQueue = writeQueue.then(async () => {
    try {
      ensureDataDirectory();
      const tmpPath = `${DATA_FILE_PATH}.tmp.${Date.now()}`;
      fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tmpPath, DATA_FILE_PATH);
    } catch (err) {
      console.error('[AR Store] Failed to save ar-metadata.json:', err);
    }
  });
  return writeQueue;
}

/**
 * Gets the AR image record for a product ID
 */
export function getArRecord(productId: string | number): ArImageRecord | null {
  const db = getArDatabase();
  return db.products[String(productId)] || null;
}

/**
 * Updates or creates an AR image record
 */
export async function setArRecord(
  productId: string | number,
  updates: Partial<ArImageRecord> & { originalImageUrl?: string }
): Promise<ArImageRecord> {
  const db = getArDatabase();
  const idStr = String(productId);
  const now = new Date().toISOString();

  const existing = db.products[idStr] || {
    id: idStr,
    originalImageUrl: updates.originalImageUrl || '',
    status: 'pending' as ArImageStatus,
    createdAt: now,
    updatedAt: now,
  };

  const updatedRecord: ArImageRecord = {
    ...existing,
    ...updates,
    updatedAt: now,
  };

  db.products[idStr] = updatedRecord;
  await persistDatabase(db);
  return updatedRecord;
}
