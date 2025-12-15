# Intelligent Shot Orchestration - Claude as Director

CRTR Studio as a research and assembly tool that gathers the best possible footage, then packages everything for user editing.

---

## Philosophy

**CRTR Studio = Smart Research Assistant + Asset Packager**

NOT trying to:
- ❌ Make final editing decisions
- ❌ Force multi-shot everywhere
- ❌ Generate AI when real footage exists
- ❌ Lock user into specific timeline

INSTEAD:
- ✅ Research and gather best available footage
- ✅ Prioritize real footage over AI
- ✅ Use multi-shot only where it enhances story
- ✅ Package everything for DaVinci Resolve editing
- ✅ Let user make final creative decisions

---

## Asset Priority Hierarchy

### For Each Shot (Claude Decides):

```
1. STOCK VIDEO (Pexels, NASA video library)
   - Real footage, authentic
   - FREE
   - Best for: Space footage, nature, B-roll, establishing shots
   - Example: "ISS flyover Earth" → NASA video archive

2. STOCK IMAGE + Effects
   - Real photos with Ken Burns/pan/zoom
   - FREE or very cheap
   - Best for: Portraits, diagrams, historical photos
   - Example: "Einstein portrait" → Pexels photo + slow zoom

3. MOTION GRAPHIC Template
   - After Effects project template with instructions
   - $0 during generation
   - Best for: Data visualizations, timelines, maps, infographics, lower thirds
   - Example: "Timeline 1915-2024" → AE template + JSON data file

4. AI GENERATION (Last Resort)
   - When no real footage exists
   - Most expensive option
   - Best for: Concepts, visualizations, impossible shots
   - Example: "Black hole accretion disk simulation" → fal.ai generation
```

---

## Shot Structure (Flexible)

### Simple Scene (1 shot)
```
Scene: "NASA launches rocket"
  Shot 1: Stock video (NASA archive) - 15s
  Cost: $0
```

### Standard Scene (2-3 shots)
```
Scene: "Explaining gravity"
  Shot 1: Diagram (stock image + Ken Burns) - 8s
  Shot 2: Real Earth footage (NASA video) - 7s
  Cost: $0
```

### Complex Scene (4-5 shots, rare)
```
Scene: "Visualizing impossible physics"
  Shot 1: Stock video (galaxy formation) - 5s
  Shot 2: Motion graphic placeholder (equations) - 5s
  Shot 3: AI generation (concept visualization) - 5s
  Shot 4: Stock image (scientist portrait) - 5s
  Cost: Stock ($0) + AI ($0.30 + $0.56) = $0.86
```

**Claude decides shot count based on narrative needs, not fixed formula.**

---

## Cost Optimization Strategy

### Realistic Distribution (Claude-Orchestrated)

**For 15-min documentary with ~120 shots total:**

| Asset Type | Shots | % | Cost Each | Total |
|------------|-------|---|-----------|-------|
| **Stock Video** | 40 | 33% | $0 | $0 |
| **Stock Image + Effects** | 40 | 33% | $0 | $0 |
| **Motion Graphics** | 20 | 17% | $0 | $0 |
| **AI Generated** | 20 | 17% | varies | ~$30 |

### AI Generation Breakdown (20 shots)
```
Images (Nano Banana Pro 4K):
  - 20 shots × $0.30 = $6.00

Videos (varies by shot length):
  - Assuming 50% need video (10 shots × 5s avg)
  - 50s @ $0.112/s = $5.60
  - Some v2v for continuity: +$2.80

AI Total: ~$14.40
```

### Full Production Cost
```
Claude (script + orchestration):     $0.15
GenAIPro (30-45 voiceover chunks):   $0.90
Stock videos (Pexels/NASA):          $0.00
Stock images (Pexels/NASA):          $0.00
Motion graphics (user creates):      $0.00
AI generation (20 shots):            $14.40
────────────────────────────────────────────
REALISTIC TOTAL:                     $15.45
```

**WAY cheaper than multi-shot everywhere approach!**

---

## Claude's Orchestration Logic

### Scene Analysis Prompt

```typescript
For each scene, Claude analyzes:
{
  "scene": "Introduction to black holes",
  "narration": "Black holes are the most mysterious objects...",
  "duration": 20,
  
  "shots": [
    {
      "visualDescription": "Wide shot of spiral galaxy with black hole at center",
      "searchTerms": ["spiral galaxy", "black hole", "milky way center"],
      "assetStrategy": "STOCK_VIDEO_FIRST", // Try NASA/Hubble video
      "fallback": "AI_VIDEO", // Generate if no stock found
      "shotType": "establishing",
      "duration": 8,
      "reasoning": "Real footage exists in NASA archives"
    },
    {
      "visualDescription": "Diagram showing black hole structure with labels",
      "searchTerms": ["black hole diagram", "event horizon", "accretion disk"],
      "assetStrategy": "STOCK_IMAGE", // NASA diagrams
      "effect": "ken_burns_zoom",
      "shotType": "educational",
      "duration": 7,
      "reasoning": "Educational diagrams readily available"
    },
    {
      "visualDescription": "Simulated view approaching event horizon",
      "searchTerms": null,
      "assetStrategy": "AI_VIDEO", // No real footage of this exists
      "fallback": null,
      "shotType": "conceptual",
      "duration": 5,
      "reasoning": "Impossible to film, requires AI generation"
    }
  ]
}
```

### Decision Tree

```
For each shot:
  1. Can this be found as stock video?
     → Search Pexels Video API
     → Search NASA Video Library
     → If found with >70% relevance: USE IT ($0)
  
  2. Can this be shown as stock image + effects?
     → Search Pexels Images
     → Search NASA/Hubble/ESA images
     → If found: USE IT + add Ken Burns ($0)
  
  3. Is this data visualization or infographic?
     → Create motion graphic placeholder
     → Export instructions for After Effects
     → Cost: $0 (user creates)
  
  4. Does this require AI generation?
     → Generate with fal.ai as last resort
     → Cost: $0.30 (image) or $0.86 (video with image)
```

---

## Stock Video Sources

### 1. Pexels Videos
- **Free, commercial use**
- High quality 4K footage
- Categories: Nature, space, people, cities, abstract
- API: https://www.pexels.com/api/documentation/#videos

### 2. NASA Video Library
- **Public domain**
- Space missions, Earth from space, planets, rockets
- API: https://images.nasa.gov (includes videos)

### 3. ESA Video Archive
- **Attribution required**
- European space missions, telescopes, launches

---

## Export Package for DaVinci Resolve

### Folder Structure
```
project-export-{id}/
├── 01-stock-videos/
│   ├── shot-001-galaxy.mp4
│   ├── shot-005-rocket-launch.mp4
│   └── ...
├── 02-stock-images/
│   ├── shot-002-diagram.jpg
│   ├── shot-004-portrait.jpg
│   └── ...
├── 03-ai-generated/
│   ├── shot-003-blackhole.mp4
│   └── ...
├── 04-motion-graphics/
│   ├── shot-006-timeline-PLACEHOLDER.txt
│   └── shot-010-data-viz-PLACEHOLDER.txt
├── 05-audio/
│   ├── scene-01-narration.wav
│   ├── scene-02-narration.wav
│   └── combined-narration.wav
├── timeline.xml              # DaVinci Resolve project
├── metadata.json             # Shot details, sources, prompts
└── README.txt                # Assembly instructions
```

### metadata.json Example
```json
{
  "project": {
    "title": "The Mystery of Black Holes",
    "duration": 900,
    "totalShots": 120,
    "breakdown": {
      "stockVideo": 40,
      "stockImage": 40,
      "motionGraphics": 20,
      "aiGenerated": 20
    }
  },
  "shots": [
    {
      "id": "shot-001",
      "scene": "Introduction",
      "source": "nasa",
      "type": "stock_video",
      "file": "01-stock-videos/shot-001-galaxy.mp4",
      "duration": 8,
      "searchTerms": ["spiral galaxy", "black hole"],
      "license": "public_domain",
      "originalUrl": "https://images.nasa.gov/..."
    },
    {
      "id": "shot-003",
      "scene": "Introduction",
      "source": "fal_ai",
      "type": "ai_video",
      "file": "03-ai-generated/shot-003-blackhole.mp4",
      "duration": 5,
      "prompt": "Simulated view approaching black hole event horizon",
      "cost": 0.86,
      "model": "fal-ai/kling-video/o1/image-to-video"
    },
    {
      "id": "shot-006",
      "scene": "Timeline",
      "source": "user",
      "type": "motion_graphic",
      "file": "04-motion-graphics/shot-006-timeline-PLACEHOLDER.txt",
      "duration": 10,
      "instructions": "Create animated timeline from 1915-2024 showing key discoveries in black hole physics"
    }
  ]
}
```

---

## User Editing Workflow

### 1. Generate Package (CRTR Studio)
- Script → Claude orchestrates shots
- Gather stock footage automatically
- Generate AI only where needed
- Export organized package

### 2. Import to DaVinci Resolve
- Open timeline.xml
- All assets already placed on timeline
- Rough assembly complete
- Placeholders for motion graphics

### 3. User Refinement (Your Role)
- Adjust timing and pacing
- Create motion graphics in After Effects
- Add background music
- Color grading
- Sound design
- Final polish

---

## Revised Cost Estimates

### Typical Documentary Breakdown

**Conservative (Lots of Real Footage Available):**
- 80% stock footage (video + images): $0
- 10% motion graphics (user creates): $0
- 10% AI generation (12 shots): ~$8
- **Total: $9.05 per video** 🎉

**Balanced (Mix of Stock + AI):**
- 60% stock footage: $0
- 20% motion graphics: $0
- 20% AI generation (24 shots): ~$15
- **Total: $16.05 per video**

**AI-Heavy (Conceptual/Abstract Topic):**
- 40% stock footage: $0
- 20% motion graphics: $0
- 40% AI generation (48 shots): ~$30
- **Total: $31.05 per video**

---

## Pricing Strategy (Revised)

### Customer Pricing
```
Conservative topic: $9.05 cost → Price $39
Balanced topic: $16.05 cost → Price $49
AI-heavy topic: $31.05 cost → Price $69

Average: $49/video
Cost: ~$16
Margin: $33 (67%)
```

### Market Position
- VidRush: $150-300 (similar research + AI approach)
- **CRTR Studio: $49** (67-84% cheaper!)
- Traditional editor: $150-500
- Time: 30-45 min vs 50+ hours

---

## Updated Database Schema

```prisma
model Shot {
  id String
  sceneId String
  order Int
  
  // Asset strategy
  assetStrategy String  // 'stock_video' | 'stock_image' | 'ai_video' | 'motion_graphic'
  searchTerms String[]  // For stock search
  
  // Source tracking
  source String?        // 'pexels' | 'nasa' | 'hubble' | 'fal_ai' | 'user'
  sourceUrl String?     // Original URL if stock
  
  // Files
  videoUrl String?
  imageUrl String?
  
  // Multi-shot only when needed
  shotAngle String?     // Optional, null for single-shot scenes
  
  duration Int
  generationCost Float
}
```

---

## Benefits of Smart Orchestration

### 1. Cost Efficiency
- $9-31 vs $86 (multi-shot everywhere)
- 50-90% real footage (free)
- AI only where needed

### 2. Authenticity
- Real NASA footage > AI simulation
- Historical photos > AI recreation
- User creates custom graphics

### 3. User Control
- You decide final edit
- Package ready for DaVinci
- Easy to rearrange/replace shots
- Full creative freedom

### 4. Faster Generation
- Stock lookup: instant
- AI generation: only 10-20 shots vs 90
- Total time: 20-30 min vs 45-90 min

---

## Implementation Priority

### Phase 1: Smart Research (MVP)
1. Claude orchestrates shot strategy
2. Stock video search (Pexels API)
3. Stock image search (Pexels, NASA)
4. AI generation fallback
5. Package export with metadata

### Phase 2: Enhanced Sources
1. NASA video library integration
2. ESA video archive
3. Better relevance scoring
4. Shot recommendations

### Phase 3: User Tools
1. Preview all options before committing
2. Manually override asset choices
3. Add your own footage to package
4. Custom shot instructions

---

## Summary

**Smart Orchestration Approach:**
- ✅ Real footage FIRST (Pexels, NASA videos)
- ✅ Stock images SECOND (with effects)
- ✅ Motion graphics as placeholders
- ✅ AI generation LAST RESORT
- ✅ Multi-shot only where it improves story
- ✅ User edits final product in DaVinci

**Cost:** $9-31 per video (vs $86 multi-shot everywhere)  
**Price:** $49 average (67% margin)  
**Market:** 67-84% cheaper than competitors  
**Speed:** 20-30 min vs 45-90 min  

**CRTR Studio = Smart research assistant that packages everything for your final edit.** 🎬


