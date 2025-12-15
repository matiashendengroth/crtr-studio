# NASA Images API - Complete Integration Guide

How to properly use the NASA Images & Video Library for CRTR Studio.

Source: [NASA Images API](https://images.nasa.gov)

---

## API Overview

**Endpoint:** `https://images-api.nasa.gov/search`

**Key Features:**
- 190,000+ assets (images, videos, audio)
- **Public domain** - monetization allowed, attribution optional
- High-resolution masters (TIF, original JPG)
- Perfect for space documentaries

**Sources:**
- Hubble Space Telescope
- James Webb Space Telescope (JWST)
- Cassini, Voyager, Apollo missions
- Mars rovers, ISS footage
- Historical NASA archives

---

## API Structure (Critical Understanding)

### Search Response Structure
```
collection
 ├─ items[]          ← Each search result
 │   ├─ data[]       ← Metadata (title, description, nasa_id)
 │   ├─ links[]      ← Preview thumbnails only
 │   └─ href         ← MOST IMPORTANT: Link to asset collection
 ├─ metadata         ← Total hits
 └─ links[]          ← Pagination (next page)
```

### The Key Field (Never Miss This!)
```json
{
  "href": "https://images-assets.nasa.gov/image/PIA11480/collection.json"
}
```

**This href contains the FULL asset list with all resolutions.**

---

## Proper Asset Fetching (3 Steps)

### Step 1: Search for Assets
```typescript
const searchUrl = 'https://images-api.nasa.gov/search?q=saturn&media_type=image';
const search = await fetch(searchUrl).then(r => r.json());

const item = search.collection.items[0];
const metadata = item.data[0];
const nasaId = metadata.nasa_id;  // e.g., "PIA11480"
```

### Step 2: Get Asset Collection
```typescript
const assetsUrl = `https://images-assets.nasa.gov/image/${nasaId}/collection.json`;
const assets = await fetch(assetsUrl).then(r => r.json());

// Returns array like:
// [
//   "PIA11480~orig.jpg",
//   "PIA11480~large.jpg",
//   "PIA11480~medium.jpg",
//   "PIA11480~small.jpg",
//   "PIA11480.tif"
// ]
```

### Step 3: Select Best Quality
```typescript
// Priority: TIF > orig.jpg > large.jpg
const bestAsset = assets.find(url => url.endsWith('.tif'))
  || assets.find(url => url.includes('~orig.jpg'))
  || assets.find(url => url.includes('~large.jpg'));

console.log(bestAsset);
// Full URL is base + filename
```

---

## Image Variants Explained

| Suffix | Resolution | Use Case |
|--------|-----------|----------|
| `.tif` | **Master archival** | Best quality, convert to PNG/JPG |
| `~orig.jpg` | **Original JPG** | High quality, ready to use |
| `~large.jpg` | High-res | Good for most uses |
| `~medium.jpg` | Mid-res | Quick preview |
| `~small.jpg` | Low-res | Thumbnails |
| `~thumb.jpg` | Tiny | UI preview only |

**For documentaries, always prefer:**
1. `.tif` (convert to PNG/JPG)
2. `~orig.jpg`
3. `~large.jpg`

---

## Complete Integration Example

```typescript
// packages/api/src/services/stock-media/nasa-client.ts

export class NASAImagesClient {
  private apiKey: string;
  private baseUrl = 'https://images-api.nasa.gov';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async search(query: string, options?: {
    mediaType?: 'image' | 'video' | 'audio';
    yearStart?: string;
    yearEnd?: string;
    page?: number;
  }): Promise<NASASearchResult[]> {
    const params = new URLSearchParams({
      q: query,
      media_type: options?.mediaType || 'image',
      ...(options?.yearStart && { year_start: options.yearStart }),
      ...(options?.yearEnd && { year_end: options.yearEnd }),
      ...(options?.page && { page: options.page.toString() }),
    });
    
    const url = `${this.baseUrl}/search?${params}`;
    const response = await fetch(url);
    const data = await response.json();
    
    return data.collection.items.map(item => ({
      nasaId: item.data[0].nasa_id,
      title: item.data[0].title,
      description: item.data[0].description,
      keywords: item.data[0].keywords || [],
      dateCreated: item.data[0].date_created,
      center: item.data[0].center,
      thumbnailUrl: item.links?.[0]?.href,
      assetCollectionUrl: item.href,
    }));
  }
  
  async getAssets(nasaId: string, mediaType: 'image' | 'video' = 'image'): Promise<string[]> {
    const url = `https://images-assets.nasa.gov/${mediaType}/${nasaId}/collection.json`;
    const response = await fetch(url);
    return await response.json();
  }
  
  async getBestQuality(nasaId: string, mediaType: 'image' | 'video' = 'image'): Promise<string> {
    const assets = await this.getAssets(nasaId, mediaType);
    
    // Priority: TIF > orig.jpg > large.jpg > medium.jpg
    const best = assets.find(url => url.endsWith('.tif'))
      || assets.find(url => url.includes('~orig.jpg'))
      || assets.find(url => url.includes('~large.jpg'))
      || assets.find(url => url.includes('~medium.jpg'));
    
    if (!best) {
      throw new Error(`No suitable quality asset found for ${nasaId}`);
    }
    
    return best;
  }
}

interface NASASearchResult {
  nasaId: string;
  title: string;
  description: string;
  keywords: string[];
  dateCreated: string;
  center: string;
  thumbnailUrl?: string;
  assetCollectionUrl: string;
}
```

---

## Search Query Examples

### Space Phenomena
```
?q=black hole
?q=nebula
?q=galaxy
?q=supernova
?q=pulsar
```

### Planets & Moons
```
?q=mars surface
?q=jupiter red spot
?q=saturn rings
?q=europa moon
?q=titan atmosphere
```

### Missions
```
?q=apollo 11
?q=cassini saturn
?q=voyager
?q=curiosity rover
?q=hubble deep field
```

### Telescopes
```
?q=hubble&year_start=2020
?q=james webb
?q=jwst
```

---

## Pagination

```typescript
async function crawlAllPages(query: string): Promise<NASASearchResult[]> {
  const results: NASASearchResult[] = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const batch = await nasaClient.search(query, { page });
    results.push(...batch);
    
    // Check for next page link in response
    // (implementation depends on response structure)
    page++;
    
    if (batch.length === 0) {
      hasMore = false;
    }
    
    // Be polite: 1-3 requests/second
    await sleep(500);
  }
  
  return results;
}
```

---

## Local Database Strategy (Recommended)

### Why Build Local Database?

**Benefits:**
- Instant search (no API calls)
- Semantic search with embeddings
- Pre-filtered for documentary use
- Offline capability
- Cost tracking

### Database Schema

```prisma
model NASAAsset {
  id          String   @id  // nasa_id
  title       String
  description String?  @db.Text
  mediaType   String   // 'image' | 'video' | 'audio'
  center      String?
  dateCreated DateTime?
  keywords    String[]
  
  // Best available file
  bestQualityUrl String?
  thumbnailUrl   String?
  
  // Metadata
  width       Int?
  height      Int?
  filesize    Int?
  
  // AI embeddings for semantic search
  embedding   Float[]  // Vector embeddings
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([mediaType])
  @@index([center])
  @@fulltext([title, description])
}
```

### Ingestion Strategy

**Phase 1: Metadata Only (Fast)**
```typescript
// Crawl search results, store metadata
// DO NOT download files yet
// ~50-100 MB for 190k assets

const categories = [
  'black hole', 'nebula', 'galaxy', 'mars', 'jupiter',
  'saturn', 'apollo', 'hubble', 'jwst', 'iss'
];

for (const category of categories) {
  const results = await crawlAllPages(category);
  await db.nasaAsset.createMany({ data: results });
}
```

**Phase 2: Lazy Download (On-Demand)**
```typescript
// Only download when actually used in video
// Saves terabytes of storage

async function getAssetForShot(nasaId: string): Promise<string> {
  const asset = await db.nasaAsset.findUnique({ where: { id: nasaId }});
  
  if (asset.bestQualityUrl) {
    return asset.bestQualityUrl;  // Already cached
  }
  
  // Fetch and cache on first use
  const url = await nasaClient.getBestQuality(nasaId);
  const localPath = await downloadAndCache(url);
  
  await db.nasaAsset.update({
    where: { id: nasaId },
    data: { bestQualityUrl: localPath }
  });
  
  return localPath;
}
```

**Phase 3: Embeddings (AI-Powered Search)**
```typescript
// Generate embeddings for semantic search
import OpenAI from 'openai';

async function embedAssets() {
  const assets = await db.nasaAsset.findMany();
  
  for (const asset of assets) {
    const text = `${asset.title}. ${asset.description}. ${asset.keywords.join(', ')}`;
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    
    await db.nasaAsset.update({
      where: { id: asset.id },
      data: { embedding: embedding.data[0].embedding }
    });
  }
}
```

---

## Integration with CRTR Studio

### Shot Search Flow

```typescript
// packages/api/src/services/stock-media/stock-media-selector.ts

async function findNASAFootage(visualPrompt: string): Promise<MediaResult | null> {
  // 1. Generate embedding for prompt
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: visualPrompt,
  });
  
  // 2. Vector search in local NASA database
  const results = await db.$queryRaw`
    SELECT id, title, description, thumbnailUrl,
           1 - (embedding <=> ${embedding.data[0].embedding}::vector) as similarity
    FROM "NASAAsset"
    WHERE mediaType = 'image'
    ORDER BY embedding <=> ${embedding.data[0].embedding}::vector
    LIMIT 10
  `;
  
  // 3. Claude evaluates relevance
  const best = await claudeEvaluateRelevance(visualPrompt, results);
  
  if (best && best.similarity > 0.7) {
    return {
      id: best.id,
      source: 'nasa',
      url: await getAssetForShot(best.id),
      license: 'public_domain',
      relevanceScore: best.similarity,
    };
  }
  
  return null;
}
```

---

## Storage Estimates

| Data | Size | Storage |
|------|------|---------|
| **Metadata only** | 190k assets | 50-100 MB |
| **Orig JPGs** | Selected assets | 1-2 TB |
| **TIF masters** | All files | 3-6 TB |

**Recommendation:**
- Store metadata in Postgres
- Store files in S3/Backblaze B2
- Lazy-download on first use
- CDN for frequently used assets

---

## Rate Limiting (Be Polite)

```typescript
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class RateLimitedNASAClient extends NASAImagesClient {
  private lastRequest = 0;
  private minInterval = 333; // 3 requests/second max
  
  async search(...args: any[]) {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequest;
    
    if (timeSinceLastRequest < this.minInterval) {
      await sleep(this.minInterval - timeSinceLastRequest);
    }
    
    this.lastRequest = Date.now();
    return super.search(...args);
  }
}
```

---

## Licensing (Safe!)

**NASA Images:**
- ✅ Public domain
- ✅ Commercial use allowed
- ✅ Monetization allowed
- ✅ Attribution optional (but recommended)
- ✅ Re-distribution allowed

**Perfect for:**
- YouTube monetization
- Commercial documentaries
- AI training data
- Stock footage sales

---

## API Keys

Get your NASA API key: [https://api.nasa.gov](https://api.nasa.gov)

Add to `.env`:
```env
NASA_API_KEY=your-key-here
```

**Note:** NASA API key is mainly for higher rate limits. The Images API works without it, but having a key is recommended.

---

## Common Pitfalls (Avoid These!)

### ❌ Don't: Use thumbnail links from search
```typescript
// WRONG - These are tiny thumbnails
const url = item.links[0].href;
```

### ✅ Do: Fetch asset collection for HQ files
```typescript
// CORRECT
const assets = await getAssets(item.data[0].nasa_id);
const best = assets.find(url => url.includes('~orig.jpg'));
```

### ❌ Don't: Download everything upfront
```
// WRONG - Will use 3-6 TB
downloadAllNASAAssets();
```

### ✅ Do: Lazy-download on use
```typescript
// CORRECT
const url = await getAssetWhenNeeded(nasaId);
```

---

## Summary

**NASA Images API is perfect for CRTR Studio:**
- ✅ 190,000+ high-quality space assets
- ✅ Public domain, commercially safe
- ✅ Perfect for space documentaries
- ✅ AI-ready with embeddings
- ✅ Local database for instant search

**Workflow:**
1. Ingest metadata to local DB
2. Add embeddings for semantic search
3. Lazy-download assets on first use
4. Integrate with shot orchestration

**Cost:** FREE (public domain)  
**Storage:** 50-100 MB metadata + lazy assets  
**Quality:** Masters (.tif), originals (~orig.jpg)

This is one of the BEST free resources for documentary footage! 🚀


