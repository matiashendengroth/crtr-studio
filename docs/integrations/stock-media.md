# Stock Media Integration - Free Images & Videos

Complete guide to integrating free stock media APIs to reduce IMAGE_EFFECT costs.

---

## Overview

Instead of generating all images with Nanobana Pro ($0.24/image), use **free stock media APIs** when appropriate content is available. This can reduce per-video costs by $3-5.

**Strategy:**
1. AI analyzes scene visual prompt
2. Attempts to find matching stock media (Pexels, NASA, Hubble, ESA)
3. Falls back to AI generation (Nanobana) if no good match
4. Prioritizes free stock for generic content (space, nature, historical)

---

## Stock Media APIs

### 1. NASA Image and Video Library
**Best for:** Space, astronomy, planets, missions, telescopes

```typescript
// Configuration
API_URL: https://images-api.nasa.gov/search
LICENSE: Public domain (no attribution required)
RESOLUTION: Up to 4K+
CONTENT: 140,000+ images and videos
```

**Example Search:**
```typescript
async function searchNASA(query: string): Promise<MediaResult[]> {
  const response = await fetch(
    `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`
  );
  
  const data = await response.json();
  
  return data.collection.items.map(item => ({
    id: item.data[0].nasa_id,
    title: item.data[0].title,
    description: item.data[0].description,
    thumbnailUrl: item.links[0].href,
    keywords: item.data[0].keywords,
    mediaType: 'image',
    source: 'nasa',
    license: 'public_domain'
  }));
}
```

**Use cases:**
- ✅ "Black hole visualization"
- ✅ "Mars rover on surface"
- ✅ "International Space Station"
- ✅ "Saturn's rings"
- ✅ "Nebula in deep space"

---

### 2. Pexels API
**Best for:** Generic B-roll, nature, people, cities, abstract

```typescript
// Configuration
API_URL: https://api.pexels.com/v1/
API_KEY: Required (free tier: 200 requests/hour)
LICENSE: Commercial-safe, no attribution required
RESOLUTION: Up to 4K
CONTENT: Millions of photos and videos
```

**Example Search:**
```typescript
async function searchPexels(query: string): Promise<MediaResult[]> {
  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15`,
    {
      headers: {
        'Authorization': process.env.PEXELS_API_KEY!
      }
    }
  );
  
  const data = await response.json();
  
  return data.photos.map(photo => ({
    id: photo.id.toString(),
    title: photo.alt,
    description: photo.alt,
    thumbnailUrl: photo.src.medium,
    originalUrl: photo.src.original,
    photographer: photo.photographer,
    mediaType: 'image',
    source: 'pexels',
    license: 'pexels'
  }));
}
```

**Use cases:**
- ✅ "Portrait of scientist"
- ✅ "Laboratory research"
- ✅ "Mountain landscape"
- ✅ "Ocean waves"
- ✅ "City skyline at night"

---

### 3. HubbleSite API
**Best for:** Elite deep-space visuals, nebulas, galaxies

```typescript
// Configuration
API_URL: https://hubblesite.org/api/v3/
LICENSE: Public domain
RESOLUTION: Extremely high (often 8K+)
CONTENT: Hubble telescope images/videos
```

**Example Search:**
```typescript
async function searchHubble(query: string): Promise<MediaResult[]> {
  const response = await fetch(
    `https://hubblesite.org/api/v3/images?page=all`
  );
  
  const data = await response.json();
  
  // Filter by query in title/description
  return data
    .filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase())
    )
    .map(item => ({
      id: item.id,
      title: item.name,
      description: item.description,
      thumbnailUrl: item.thumbnail,
      originalUrl: item.image_files.find(f => f.width > 2000)?.file_url,
      mediaType: 'image',
      source: 'hubble',
      license: 'public_domain'
    }));
}
```

**Use cases:**
- ✅ "Crab Nebula"
- ✅ "Andromeda Galaxy"
- ✅ "Pillars of Creation"
- ✅ "Supernova remnant"

---

### 4. NASA APOD (Astronomy Picture of the Day)
**Best for:** Curated high-quality space images

```typescript
// Configuration
API_URL: https://api.nasa.gov/planetary/apod
API_KEY: Required (free, unlimited requests)
LICENSE: Public domain
CONTENT: Daily curated space images
```

**Example Search:**
```typescript
async function getAPOD(date?: string): Promise<MediaResult> {
  const params = new URLSearchParams({
    api_key: process.env.NASA_API_KEY!,
    ...(date && { date })
  });
  
  const response = await fetch(
    `https://api.nasa.gov/planetary/apod?${params}`
  );
  
  const data = await response.json();
  
  return {
    id: data.date,
    title: data.title,
    description: data.explanation,
    thumbnailUrl: data.url,
    originalUrl: data.hdurl,
    mediaType: data.media_type, // 'image' or 'video'
    source: 'nasa_apod',
    license: 'public_domain'
  };
}
```

---

### 5. ESA Multimedia
**Best for:** European space missions, planets, telescopes

```typescript
// Configuration
API_URL: https://www.esa.int/ESA_Multimedia
LICENSE: Attribution required ("ESA/Hubble" or similar)
CONTENT: Missions, planets, telescopes, launches
NOTE: Less documented API, may require scraping
```

**Use cases:**
- ✅ "James Webb Space Telescope"
- ✅ "ExoMars rover"
- ✅ "Gaia mission"

---

## Smart Media Selection Service

```typescript
// packages/api/src/services/stock-media/stock-media-selector.ts

interface MediaSearchResult {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  originalUrl: string;
  source: 'nasa' | 'pexels' | 'hubble' | 'nasa_apod' | 'esa';
  license: 'public_domain' | 'pexels' | 'attribution_required';
  relevanceScore: number; // 0-1
  mediaType: 'image' | 'video';
}

export class StockMediaSelector {
  /**
   * Attempts to find free stock media matching the visual prompt
   * Returns null if no good match found (will use AI generation)
   */
  async findStockMedia(
    visualPrompt: string,
    sceneType: 'space' | 'nature' | 'people' | 'historical' | 'abstract' | 'other'
  ): Promise<MediaSearchResult | null> {
    
    // Extract key search terms from visual prompt
    const searchTerms = this.extractSearchTerms(visualPrompt);
    
    // Try appropriate APIs based on scene type
    const results: MediaSearchResult[] = [];
    
    if (sceneType === 'space') {
      // Prioritize NASA/Hubble for space content
      results.push(...await this.searchNASA(searchTerms));
      results.push(...await this.searchHubble(searchTerms));
    } else if (sceneType === 'nature' || sceneType === 'people') {
      // Use Pexels for generic content
      results.push(...await this.searchPexels(searchTerms));
    }
    
    // Fallback to Pexels for all types
    if (results.length < 5) {
      results.push(...await this.searchPexels(searchTerms));
    }
    
    // Use Claude to evaluate relevance
    const bestMatch = await this.evaluateRelevance(visualPrompt, results);
    
    // Only return if relevance score > 0.7
    return bestMatch && bestMatch.relevanceScore > 0.7 ? bestMatch : null;
  }
  
  /**
   * Uses Claude to evaluate how well stock media matches the prompt
   */
  private async evaluateRelevance(
    visualPrompt: string,
    candidates: MediaSearchResult[]
  ): Promise<MediaSearchResult | null> {
    if (candidates.length === 0) return null;
    
    const prompt = `
You are evaluating stock images/videos for a documentary scene.

Visual Prompt: "${visualPrompt}"

Available stock media:
${candidates.map((c, i) => `
${i + 1}. ${c.title}
   Description: ${c.description}
   Source: ${c.source}
`).join('\n')}

Task: Rate each option 0-1 for relevance. Return JSON:
{
  "bestIndex": <number or null>,
  "score": <0-1>,
  "reasoning": "<brief explanation>"
}

Only recommend if score > 0.7. Otherwise return null.
    `;
    
    const response = await this.claudeClient.generate(prompt);
    const evaluation = JSON.parse(response);
    
    if (evaluation.bestIndex === null || evaluation.score < 0.7) {
      return null;
    }
    
    return {
      ...candidates[evaluation.bestIndex],
      relevanceScore: evaluation.score
    };
  }
  
  private extractSearchTerms(visualPrompt: string): string {
    // Remove style instructions, keep content
    return visualPrompt
      .replace(/cinematic|dramatic|close-up|wide shot|4k|detailed/gi, '')
      .trim();
  }
  
  private async searchNASA(query: string): Promise<MediaSearchResult[]> {
    // Implementation from above
  }
  
  private async searchPexels(query: string): Promise<MediaSearchResult[]> {
    // Implementation from above
  }
  
  private async searchHubble(query: string): Promise<MediaSearchResult[]> {
    // Implementation from above
  }
}
```

---

## Updated Scene Generation Flow

```typescript
// packages/api/src/use-cases/generate-scene-assets.use-case.ts

export class GenerateSceneAssetsUseCase {
  async execute(sceneId: string) {
    const scene = await this.sceneRepository.findById(sceneId);
    
    // For IMAGE_EFFECT scenes, try stock media first
    if (scene.shotType === 'IMAGE_EFFECT') {
      const stockMedia = await this.stockMediaSelector.findStockMedia(
        scene.visualPrompt,
        scene.sceneType // 'space', 'nature', etc.
      );
      
      if (stockMedia) {
        // Found good stock media - use it for free!
        await this.sceneRepository.update(sceneId, {
          imageUrl: stockMedia.originalUrl,
          thumbnailUrl: stockMedia.thumbnailUrl,
          imageSource: stockMedia.source,
          imageLicense: stockMedia.license,
          generationCost: 0, // FREE!
          metadata: {
            stockMediaId: stockMedia.id,
            stockMediaTitle: stockMedia.title,
            attribution: stockMedia.license === 'attribution_required' 
              ? this.generateAttribution(stockMedia)
              : null
          }
        });
        
        return;
      }
    }
    
    // No stock media found - use AI generation
    const imageService = AIServiceFactory.getImageService();
    const imageResult = await imageService.generateImage(scene.visualPrompt);
    
    await this.sceneRepository.update(sceneId, {
      imageUrl: imageResult.imageUrl,
      imageSource: 'ai_generated',
      generationCost: imageResult.cost
    });
    
    // For AI_VIDEO scenes, continue with video generation
    if (scene.shotType === 'AI_VIDEO') {
      const videoService = AIServiceFactory.getVideoService();
      const videoResult = await videoService.generateVideo(
        scene.visualPrompt,
        imageResult.imageUrl
      );
      
      await this.sceneRepository.update(sceneId, {
        videoUrl: videoResult.videoUrl,
        generationCost: scene.generationCost + videoResult.cost
      });
    }
  }
  
  private generateAttribution(media: MediaSearchResult): string {
    switch (media.source) {
      case 'nasa':
      case 'hubble':
      case 'nasa_apod':
        return null; // Public domain, no attribution needed
      case 'esa':
        return 'ESA/Hubble';
      case 'pexels':
        return null; // Pexels doesn't require attribution
      default:
        return media.source;
    }
  }
}
```

---

## Updated Database Schema

```prisma
// Add to Scene model
model Scene {
  // ... existing fields
  
  imageSource      String?  // 'ai_generated' | 'nasa' | 'pexels' | 'hubble' | 'esa'
  imageLicense     String?  // 'public_domain' | 'pexels' | 'attribution_required'
  imageAttribution String?  // Attribution text if required
  stockMediaId     String?  // ID from stock API for reference
}
```

---

## Cost Impact

### Before (All AI Generated)
```
IMAGE_EFFECT (14 scenes):
- Nanobana Pro 4K: 14 × $0.24 = $3.36
```

### After (Hybrid Stock + AI)
```
Scenario 1: Space Documentary (80% stock available)
- Stock media: 11 × $0 = $0
- AI generated: 3 × $0.24 = $0.72
- Savings: $2.64 (79% reduction)

Scenario 2: Generic Documentary (50% stock available)
- Stock media: 7 × $0 = $0
- AI generated: 7 × $0.24 = $1.68
- Savings: $1.68 (50% reduction)

Scenario 3: Niche Topic (20% stock available)
- Stock media: 3 × $0 = $0
- AI generated: 11 × $0.24 = $2.64
- Savings: $0.72 (21% reduction)
```

### New Production Cost Breakdown
```
Optimistic (space/nature doc):
- Script + scenes: $0.15
- Audio: $0.90
- Images (20% AI, 80% stock): $0.96
- Videos: $49.28
- TOTAL: $51.29 (was $55.61, save $4.32)

Realistic (mixed content):
- Script + scenes: $0.15
- Audio: $0.90
- Images (50% AI, 50% stock): $1.68
- Videos: $49.28
- TOTAL: $52.01 (was $55.61, save $3.60)

Conservative (niche content):
- Script + scenes: $0.15
- Audio: $0.90
- Images (80% AI, 20% stock): $2.64
- Videos: $49.28
- TOTAL: $54.97 (was $55.61, save $0.64)
```

---

## Implementation Checklist

### Phase 1: NASA Integration
- [ ] Add NASA Image Library search
- [ ] Add NASA APOD API
- [ ] Test search relevance
- [ ] Handle attribution metadata

### Phase 2: Pexels Integration
- [ ] Register for Pexels API key
- [ ] Implement search endpoint
- [ ] Handle rate limits (200/hour)
- [ ] Cache search results

### Phase 3: HubbleSite Integration
- [ ] Add Hubble API client
- [ ] Filter by quality/resolution
- [ ] Handle large image files

### Phase 4: Smart Selection
- [ ] Claude-based relevance scoring
- [ ] Fallback logic (stock → AI)
- [ ] Track success rate (% stock vs AI)
- [ ] A/B test quality perception

### Phase 5: UI/UX
- [ ] Show stock media badge in storyboard
- [ ] Allow user to switch stock → AI if desired
- [ ] Display attribution in export
- [ ] Preview stock options before selecting

---

## API Rate Limits & Costs

| API | Rate Limit | Cost | Notes |
|-----|------------|------|-------|
| **NASA Image Library** | None | Free | Public domain |
| **Pexels** | 200/hour | Free | Commercial-safe |
| **HubbleSite** | None | Free | Public domain |
| **NASA APOD** | None | Free | Requires API key |
| **ESA** | Unknown | Free | Attribution required |

**No additional API costs!** All stock media APIs are free.

---

## Testing Strategy

### Unit Tests
```typescript
describe('StockMediaSelector', () => {
  it('should prefer NASA for space prompts', async () => {
    const result = await selector.findStockMedia(
      'Black hole accretion disk',
      'space'
    );
    expect(result?.source).toBe('nasa');
  });
  
  it('should use Pexels for nature prompts', async () => {
    const result = await selector.findStockMedia(
      'Mountain forest landscape',
      'nature'
    );
    expect(result?.source).toBe('pexels');
  });
  
  it('should return null if relevance < 0.7', async () => {
    const result = await selector.findStockMedia(
      'Fictional alien spacecraft design',
      'space'
    );
    expect(result).toBeNull();
  });
});
```

---

## Success Metrics

### Track
- **Stock media usage rate** (% scenes using stock vs AI)
- **Cost savings** (actual $ saved per video)
- **Quality perception** (user feedback on stock vs AI)
- **Regeneration rate** (do users replace stock with AI?)

### Targets
- 50% of IMAGE_EFFECT scenes use stock media
- $3-5 cost savings per video
- <10% stock→AI regeneration rate (indicates good selection)

---

## Summary

**Hybrid Approach:**
1. Try free stock media APIs first (NASA, Pexels, Hubble)
2. Use Claude to evaluate relevance (>0.7 score required)
3. Fall back to AI generation if no good match
4. Track attribution requirements in database
5. Display source in UI and export

**Cost Savings:**
- Optimistic: $4.32/video (80% stock)
- Realistic: $3.60/video (50% stock)
- Conservative: $0.64/video (20% stock)

**New Production Cost:** $51-55/video (down from $55.61)

**Benefits:**
- ✅ Lower costs without quality loss
- ✅ Often higher resolution (NASA 4K+)
- ✅ Authentic imagery (real space photos vs AI)
- ✅ Faster generation (no API wait time)
- ✅ No licensing concerns (public domain)

This strategy works especially well for space, nature, and historical documentaries where high-quality stock content is abundant.


