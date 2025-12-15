# Stock Footage Selection Process - How Claude Picks the Best Match

Complete explanation of how CRTR Studio intelligently selects stock footage.

---

## Overview

**Problem:** Search APIs return 10-50 results. How do we pick the best one?

**Solution:** Claude AI evaluates all candidates and scores them 0-1 for relevance.

---

## The 3-Step Selection Process

### Step 1: Search Stock APIs

```typescript
// For a shot with visual prompt:
visualPrompt = "Wide shot of spiral galaxy with black hole at center, cinematic space documentary"

// Extract search terms (remove style instructions)
searchTerms = "spiral galaxy black hole center"

// Search multiple APIs
const candidates = [
  ...await searchNASA(searchTerms),      // NASA Images API
  ...await searchPexels(searchTerms),    // Pexels API
  ...await searchHubble(searchTerms),    // Hubble API
];

// Result: 15-30 candidate images/videos
```

---

### Step 2: Claude Evaluates Relevance

**Send to Claude:**
```
You are evaluating stock images/videos for a documentary scene.

Visual Prompt: "Wide shot of spiral galaxy with black hole at center, cinematic space documentary"

Available stock media:

1. Spiral Galaxy NGC 1300
   Description: Barred spiral galaxy NGC 1300, located 61 million light-years away
   Source: nasa

2. Andromeda Galaxy M31
   Description: Andromeda spiral galaxy with dark dust lanes
   Source: hubble

3. Milky Way Center
   Description: The center of our galaxy showing supermassive black hole Sagittarius A*
   Source: nasa

4. Galaxy Cluster Abell 2744
   Description: Multiple galaxies in deep space
   Source: hubble

5. Black Hole Simulation
   Description: Artist rendering of black hole accretion disk
   Source: nasa

Task: Rate each option 0-1 for relevance to the visual prompt.
Consider:
- Content match (spiral galaxy with black hole)
- Shot composition (wide shot requirement)
- Documentary style (scientific accuracy)
- Visual quality (cinematic)

Return JSON:
{
  "bestIndex": <number 0-4 or null>,
  "score": <0-1>,
  "reasoning": "<brief explanation>"
}

Only recommend if score > 0.7. Otherwise return null for AI generation fallback.
```

---

**Claude's Response:**
```json
{
  "bestIndex": 2,
  "score": 0.92,
  "reasoning": "Option 3 (Milky Way Center) best matches the requirements: shows spiral galaxy structure with actual black hole at center (Sagittarius A*). Wide framing suitable for establishing shot. Scientific accuracy from NASA. High quality for cinematic documentary."
}
```

---

### Step 3: Verify Score & Use or Fallback

```typescript
if (evaluation.score > 0.7) {
  // Good match! Use stock media
  const bestMatch = candidates[evaluation.bestIndex];
  
  return {
    imageUrl: bestMatch.originalUrl,
    source: 'nasa',
    cost: 0,  // FREE!
    relevanceScore: 0.92
  };
} else {
  // No good match, generate with AI
  return null; // Triggers fal.ai generation
}
```

---

## Why This Works

### 1. Semantic Understanding
Claude understands **meaning**, not just keywords:
- "Black hole" matches "Sagittarius A*" (Claude knows it's a black hole)
- "Spiral galaxy" matches "NGC 1300" (Claude knows the galaxy type)
- "Cinematic" filters out low-quality amateur shots

### 2. Multi-Factor Evaluation
Claude considers:
- ✅ Content match (what's in the image)
- ✅ Composition (wide shot vs close-up)
- ✅ Style requirements (cinematic, scientific)
- ✅ Quality (resolution, clarity)
- ✅ Authenticity (real vs simulation)

### 3. Strict Threshold
**Only accepts >0.7 relevance** means:
- No "close enough" matches
- Prevents poor quality substitutions
- User gets exactly what they need OR AI generates it

---

## Example Scenarios

### Scenario 1: Perfect Match (Use Stock)

**Prompt:** "ISS orbiting Earth, view from space"

**Search Results:**
1. "International Space Station over Earth" - NASA (0.98 score)
2. "Satellite in orbit" - Pexels (0.65 score)
3. "Space station interior" - NASA (0.45 score)

**Claude picks:** Option 1 (0.98 score)  
**Action:** Use NASA video (FREE, authentic, perfect match)

---

### Scenario 2: Decent Match (Use Stock)

**Prompt:** "Einstein writing equations on blackboard, historical documentary"

**Search Results:**
1. "Albert Einstein portrait 1920s" - Pexels (0.75 score)
2. "Scientist at blackboard" - Pexels (0.62 score)
3. "Physics equations chalk" - Pexels (0.58 score)

**Claude picks:** Option 1 (0.75 score - above threshold)  
**Action:** Use Pexels image + Ken Burns effect (FREE)  
**Note:** Not exact match (no blackboard), but authentic Einstein photo is better

---

### Scenario 3: No Good Match (Generate AI)

**Prompt:** "Simulated view approaching black hole event horizon, warped space-time"

**Search Results:**
1. "Black hole artist concept" - NASA (0.65 score)
2. "Galaxy spiral" - Hubble (0.42 score)
3. "Space abstract" - Pexels (0.38 score)

**Claude picks:** null (best is 0.65, below 0.7 threshold)  
**Action:** Generate with fal.ai Nano Banana Pro + Kling O1 ($0.86)  
**Reasoning:** This requires simulation, no real footage exists

---

## Advanced: Semantic Search (Optional Enhancement)

### Using Embeddings for Better Matching

```typescript
// Phase 1: Build local NASA database with embeddings
async function buildNASAEmbeddingIndex() {
  const assets = await crawlNASALibrary();
  
  for (const asset of assets) {
    // Generate embedding for title + description
    const text = `${asset.title}. ${asset.description}`;
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    
    await db.nasaAsset.create({
      data: {
        ...asset,
        embedding: embedding.data[0].embedding,
      }
    });
  }
}

// Phase 2: Semantic search
async function semanticSearchNASA(visualPrompt: string) {
  // Generate embedding for prompt
  const promptEmbedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: visualPrompt,
  });
  
  // Vector search (PostgreSQL with pgvector extension)
  const results = await db.$queryRaw`
    SELECT 
      id, title, description, thumbnailUrl,
      1 - (embedding <=> ${promptEmbedding.data[0].embedding}::vector) as similarity
    FROM "NASAAsset"
    WHERE mediaType = 'image'
    ORDER BY embedding <=> ${promptEmbedding.data[0].embedding}::vector
    LIMIT 10
  `;
  
  // Top 10 most semantically similar results
  // Then Claude evaluates these 10 for final selection
  return results;
}
```

**Benefits:**
- Faster (search 190k assets in milliseconds)
- Better matches (semantic similarity)
- Offline capability (no API calls)
- Pre-filtered candidates for Claude

---

## Selection Criteria (What Claude Evaluates)

### 1. Content Match (40% weight)
```
Prompt: "Black hole accretion disk"
✅ Shows black hole: +40%
✅ Shows accretion disk: +30%
❌ Just shows galaxy: +10%
```

### 2. Composition Match (25% weight)
```
Prompt requests: "Wide shot"
✅ Wide framing: +25%
⚠️ Medium framing: +15%
❌ Close-up: +5%
```

### 3. Style Match (20% weight)
```
Prompt requests: "Cinematic, dramatic lighting"
✅ High quality, dramatic: +20%
⚠️ Good quality: +15%
❌ Low quality: +5%
```

### 4. Authenticity (15% weight)
```
For documentary:
✅ Real photo/video: +15%
⚠️ Simulation (scientifically accurate): +10%
❌ Artist interpretation: +5%
```

**Total possible: 1.0 (100%)**

**Threshold: 0.7 (70%)**

---

## Fallback Chain

```
For each shot:
  
  1. Search Stock Video APIs
     ├─ Found match with score > 0.7?
     └─ YES → Use stock video ($0) ✅
     
  2. Search Stock Image APIs
     ├─ Found match with score > 0.7?
     └─ YES → Use stock image + effects ($0) ✅
     
  3. Check if Motion Graphic fits better
     ├─ Data viz, timeline, diagram?
     └─ YES → Generate AE template ($0) ✅
     
  4. Generate with AI (last resort)
     └─ fal.ai Nano Banana Pro + Kling O1 ($0.15-2.24) 💰
```

---

## Quality Assurance

### User Can Override

If Claude picks stock footage but user wants different:

```
Storyboard UI:
┌────────────────────────────────┐
│ Shot 3: Black Hole Simulation  │
├────────────────────────────────┤
│ [Stock Image Preview]          │
│ Source: NASA                   │
│ Relevance: 92%                 │
│                                 │
│ Not what you wanted?           │
│ [Try Different Stock]          │
│ [Generate with AI Instead]    │
└────────────────────────────────┘
```

**Options:**
1. See other candidates (show top 5)
2. Manual stock search
3. Force AI generation
4. Upload own image

---

## Implementation Code

### Complete Selection Service

```typescript
// packages/api/src/services/stock-media/intelligent-selector.ts

export class IntelligentStockSelector {
  constructor(
    private claudeService: ClaudeService,
    private nasaClient: NASAClient,
    private pexelsClient: PexelsClient
  ) {}
  
  async selectBestFootage(
    visualPrompt: string,
    shotType: ShotType,
    sceneType: 'space' | 'nature' | 'people' | 'historical' | 'other'
  ): Promise<StockMediaResult | null> {
    
    // 1. Extract search terms
    const searchTerms = this.extractSearchTerms(visualPrompt);
    
    // 2. Search appropriate APIs
    const candidates = await this.searchAPIs(searchTerms, sceneType, shotType);
    
    if (candidates.length === 0) {
      return null; // No candidates found
    }
    
    // 3. Claude evaluates all candidates
    const evaluation = await this.claudeEvaluate(visualPrompt, candidates);
    
    // 4. Return best if score > 0.7
    if (evaluation.score > 0.7) {
      return {
        ...candidates[evaluation.bestIndex],
        relevanceScore: evaluation.score,
        reasoning: evaluation.reasoning,
      };
    }
    
    return null; // No good match, will use AI
  }
  
  private async searchAPIs(
    searchTerms: string,
    sceneType: string,
    shotType: ShotType
  ): Promise<MediaCandidate[]> {
    const results: MediaCandidate[] = [];
    
    // Prioritize based on scene type
    if (sceneType === 'space') {
      results.push(...await this.nasaClient.search(searchTerms, { media_type: 'video' }));
      results.push(...await this.nasaClient.search(searchTerms, { media_type: 'image' }));
      results.push(...await this.hubbleClient.search(searchTerms));
    } else {
      results.push(...await this.pexelsClient.searchVideos(searchTerms));
      results.push(...await this.pexelsClient.searchPhotos(searchTerms));
    }
    
    // Fallback to Pexels if not enough results
    if (results.length < 10) {
      results.push(...await this.pexelsClient.search(searchTerms));
    }
    
    // Return top 15 for Claude to evaluate
    return results.slice(0, 15);
  }
  
  private async claudeEvaluate(
    visualPrompt: string,
    candidates: MediaCandidate[]
  ): Promise<Evaluation> {
    const prompt = this.buildEvaluationPrompt(visualPrompt, candidates);
    const response = await this.claudeService.generate(prompt);
    
    try {
      const evaluation = JSON.parse(response);
      return {
        bestIndex: evaluation.bestIndex,
        score: evaluation.score,
        reasoning: evaluation.reasoning,
      };
    } catch (error) {
      console.error('Failed to parse Claude evaluation:', error);
      return { bestIndex: null, score: 0, reasoning: 'Parse error' };
    }
  }
  
  private buildEvaluationPrompt(prompt: string, candidates: MediaCandidate[]): string {
    return `You are evaluating stock footage/images for a documentary shot.

Visual Prompt: "${prompt}"

Available options:
${candidates.map((c, i) => `
${i}. ${c.title}
   Description: ${c.description || 'No description'}
   Source: ${c.source}
   Media Type: ${c.mediaType}
   ${c.keywords ? `Keywords: ${c.keywords.join(', ')}` : ''}
`).join('\n')}

Evaluate each option on these criteria:
1. Content Match (40%): Does it show what the prompt describes?
2. Composition Match (25%): Does framing match the shot type (wide/medium/close-up)?
3. Style Match (20%): Does it fit documentary aesthetic (cinematic, scientific)?
4. Authenticity (15%): Is it real footage vs simulation/artistic rendering?

Return JSON:
{
  "bestIndex": <number 0-${candidates.length - 1} or null>,
  "score": <0.0 to 1.0>,
  "reasoning": "<brief 1-2 sentence explanation>",
  "alternativeIndex": <second best option or null>
}

IMPORTANT:
- Only recommend if score > 0.7 (70%)
- If no option scores > 0.7, return null for bestIndex
- Prefer real footage over simulations when available
- For space topics, NASA/Hubble imagery is usually highest quality
- Score honestly - mediocre match is worse than AI generation

Example response:
{
  "bestIndex": 2,
  "score": 0.92,
  "reasoning": "Option 3 perfectly matches: shows Milky Way center with actual black hole, wide framing, NASA quality, authentic scientific imagery.",
  "alternativeIndex": 0
}`;
  }
  
  private extractSearchTerms(visualPrompt: string): string {
    // Remove style/technical instructions, keep content
    return visualPrompt
      .replace(/cinematic|dramatic|4k|high quality|detailed|slow zoom|camera/gi, '')
      .replace(/wide shot|medium shot|close-up|extreme close-up/gi, '')
      .trim();
  }
}

interface MediaCandidate {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  originalUrl: string;
  source: 'nasa' | 'pexels' | 'hubble' | 'esa';
  license: string;
  mediaType: 'image' | 'video';
  keywords?: string[];
}

interface Evaluation {
  bestIndex: number | null;
  score: number;
  reasoning: string;
  alternativeIndex?: number;
}
```

---

## Scoring Examples

### High Score (0.9+) - Use Stock
```
Prompt: "Rocket launch from Kennedy Space Center"
Match: NASA video "Atlas V Rocket Launch, Cape Canaveral"

Score: 0.95
Reasoning: "Exact content match, real footage, high quality, perfect for documentary"
Action: USE STOCK (save $2.24)
```

### Moderate Score (0.7-0.8) - Use Stock
```
Prompt: "Astronaut portrait in spacesuit, professional studio lighting"
Match: Pexels photo "Astronaut in white suit against black background"

Score: 0.78
Reasoning: "Good content match. Not in spacesuit but close enough. Studio lit. Professional quality."
Action: USE STOCK (save $0.30, acceptable compromise)
```

### Low Score (0.5-0.7) - Generate AI
```
Prompt: "View approaching black hole event horizon, space-time warping effect"
Match: NASA "Black hole artist concept"

Score: 0.62
Reasoning: "Artist rendering not scientific visualization. Doesn't show approach or warping. Mediocre match."
Action: GENERATE AI (user expects specific visualization, stock insufficient)
```

### No Match (0-0.5) - Generate AI
```
Prompt: "Theoretical wormhole connecting two points in space-time"
Match: Various space images

Score: 0.35
Reasoning: "No real footage of wormholes exists. All candidates are unrelated."
Action: GENERATE AI (only option for theoretical concepts)
```

---

## Advanced: Multi-Pass Selection

### Phase 1: Try Videos First
```typescript
// For AI_VIDEO shots, prefer stock videos
const stockVideo = await selector.selectBestFootage(prompt, 'AI_VIDEO', 'space');

if (stockVideo && stockVideo.mediaType === 'video') {
  return stockVideo; // Perfect! Use stock video
}
```

### Phase 2: Try Images as Fallback
```typescript
// If no video, try stock images
const stockImage = await selector.selectBestFootage(prompt, 'IMAGE_EFFECT', 'space');

if (stockImage && stockImage.score > 0.7) {
  return {
    ...stockImage,
    useAsStatic: true,  // Apply Ken Burns effect
  };
}
```

### Phase 3: Generate AI
```typescript
// No suitable stock media found
return await fal.generateVideo(prompt);
```

---

## User Feedback Loop

### Learn from Regenerations

```typescript
// Track when users replace stock with AI
interface RegenerationFeedback {
  shotId: string;
  originalSource: 'stock' | 'ai';
  newSource: 'stock' | 'ai';
  originalRelevanceScore: number;
  userReason: string; // "Quality too low", "Wrong composition", etc.
}

// Use this data to:
// 1. Adjust relevance threshold (maybe 0.75 instead of 0.7)
// 2. Improve search term extraction
// 3. Fine-tune Claude evaluation prompt
// 4. Identify which stock sources work best
```

---

## Performance Optimization

### Caching

```typescript
// Cache Claude evaluations
const cacheKey = `evaluation:${md5(visualPrompt + candidateIds)}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached); // Reuse evaluation
}

const evaluation = await claudeEvaluate(prompt, candidates);
await redis.set(cacheKey, JSON.stringify(evaluation), 'EX', 86400); // 24hr cache
```

### Parallel Processing

```typescript
// Evaluate multiple shots in parallel
const evaluations = await Promise.all(
  shots.map(shot => selector.selectBestFootage(shot.visualPrompt, shot.shotType, sceneType))
);
```

---

## Summary

**How Stock Selection Works:**

1. **Search APIs:** Get 15-30 candidates from Pexels/NASA/Hubble
2. **Claude Evaluates:** Scores each 0-1 on content, composition, style, authenticity
3. **Threshold Check:** Only use if score > 0.7 (70%)
4. **Fallback to AI:** If no good match, generate with fal.ai

**Why Claude?**
- ✅ Understands semantic meaning (not just keywords)
- ✅ Multi-factor evaluation (content + composition + style + quality)
- ✅ Strict quality control (>0.7 threshold)
- ✅ Explainable decisions (reasoning provided)

**Result:**
- 80-90% stock footage usage (saves $30-40/video)
- High-quality matches (authentic > AI for documentaries)
- User trust (real NASA footage > AI simulation)

**This intelligent selection is KEY to making CRTR Studio economically viable while maintaining quality!** 🎯


