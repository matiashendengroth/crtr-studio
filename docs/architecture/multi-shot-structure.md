# Multi-Shot Scene Architecture

Complete guide to the Scene → Shot structure for cinematic documentary production.

---

## Structure Overview

```
Project (15-min documentary)
  └─ Section (Chapter, e.g., "Introduction", "History")
      └─ Scene (Location/sequence, e.g., "Explaining Black Holes")
          └─ Shot (Camera angle, e.g., "Wide shot", "Close-up")
              - videoUrl or imageUrl
              - shotType (AI_VIDEO, IMAGE_EFFECT, MOTION_GRAPHIC)
              - shotAngle (WIDE, CLOSE_UP, DETAIL, etc.)
```

---

## Example: One Scene Breakdown

**Scene:** "Introduction to Black Holes" (20 seconds)

**Shot 1:** Wide Shot (5s) - AI_VIDEO
- Prompt: "Wide establishing shot of galaxy with massive black hole at center, cinematic space documentary"
- Type: AI_VIDEO
- Angle: WIDE
- Cost: Image $0.30 + Video (5s @ $0.112/s) = $0.86

**Shot 2:** Medium Shot (5s) - IMAGE_EFFECT  
- Prompt: "Diagram of black hole with event horizon and accretion disk labeled"
- Type: IMAGE_EFFECT (stock from NASA)
- Angle: MEDIUM
- Cost: $0 (stock media)

**Shot 3:** Close-up (5s) - AI_VIDEO
- Prompt: "Extreme close-up of matter spiraling into black hole, based on @Video1, maintain camera language"
- Type: AI_VIDEO (v2v from Shot 1 for continuity)
- Angle: EXTREME_CLOSE_UP
- Cost: Image $0 (reuse frame) + Video (5s @ $0.168/s) = $0.84

**Shot 4:** Detail B-Roll (5s) - IMAGE_EFFECT
- Prompt: "Hubble telescope photograph of distant black hole"
- Type: IMAGE_EFFECT (stock from Hubble)
- Angle: DETAIL
- Cost: $0 (stock media)

**Scene Total:** $1.70 for 4 shots (20 seconds)

---

## Documentary Structure (15 minutes)

### Breakdown
- **45 scenes** (20 seconds each on average)
- **~4 shots per scene** (average, some have 3, some have 5)
- **180 total shots** (45 × 4)
- **Average shot duration:** 5 seconds (cinematic pacing)

### Shot Distribution (50/30/20 rule)
- **AI_VIDEO:** 90 shots (50%) - Dynamic footage
- **IMAGE_EFFECT:** 54 shots (30%) - Static with Ken Burns/effects
- **MOTION_GRAPHIC:** 36 shots (20%) - User creates in post

---

## Cost Calculation (Production Quality)

### AI_VIDEO Shots (90 total)

**Strategy:** Use i2v for first shot of scene, v2v for continuity shots

**Assumptions:**
- 45 scenes with AI_VIDEO shots
- 2 AI shots per scene on average (90 / 45 = 2)
- Shot 1: i2v ($0.112/s)
- Shot 2+: v2v ($0.168/s) for cinematic continuity

**Breakdown:**
```
First shots (45 × 5s):
  - Images: 45 × $0.30 = $13.50
  - Videos: 45 × 5s @ $0.112/s = $25.20
  - Subtotal: $38.70

Continuity shots (45 × 5s):
  - Images: $0 (reuse or extract from video)
  - Videos: 45 × 5s @ $0.168/s = $37.80
  - Subtotal: $37.80

AI_VIDEO Total: $76.50
```

### IMAGE_EFFECT Shots (54 total)

**Strategy:** 50% stock media (NASA/Pexels), 50% AI generation

```
Stock media (27 shots):        $0.00
AI generated (27 × $0.30):     $8.10
─────────────────────────────────
IMAGE_EFFECT Total:            $8.10
```

### MOTION_GRAPHIC Shots (36 total)
```
Placeholder only (user creates): $0.00
```

### Audio & Script
```
Claude (script + scenes):       $0.15
GenAIPro (45 scene narrations): $0.90
─────────────────────────────────
Audio Total:                    $1.05
```

### **Production Total**
```
AI_VIDEO shots:        $76.50
IMAGE_EFFECT shots:    $8.10
MOTION_GRAPHIC shots:  $0.00
Audio & Script:        $1.05
─────────────────────────────────
TOTAL:                 $85.65 per video
```

---

## Development vs Production Costs

### Development (Testing)
- Shots: 180 × 3s average (shorter for testing)
- Resolution: 1K images
- AI_VIDEO: 45 first shots + 45 continuity
  - Images: 45 × $0.15 = $6.75
  - i2v: 45 × 3s @ $0.112/s = $15.12
  - v2v: 45 × 3s @ $0.168/s = $22.68
  - Subtotal: $44.55
- IMAGE_EFFECT: 27 × $0.15 = $4.05
- Audio: $1.05
- **DEV TOTAL: $49.65**

### Production (Max Quality)
- Shots: 180 × 5s average
- Resolution: 4K images
- **PROD TOTAL: $85.65**

---

## Shot Angle Distribution

### Typical Scene (4 shots, 20 seconds)

1. **Wide/Establishing** (5s) - Sets context
2. **Medium/Main Action** (5s) - Focus on subject
3. **Close-up/Detail** (5s) - Emotional/important detail
4. **B-roll/Cutaway** (5s) - Supporting footage

### Shot Angle Types

| Angle | Use Case | % of Shots |
|-------|----------|------------|
| **WIDE** | Establishing, context | 20% |
| **MEDIUM** | Main action, dialogue | 25% |
| **CLOSE_UP** | Emotion, detail | 20% |
| **DETAIL** | Macro, specific focus | 15% |
| **B_ROLL** | Supporting footage | 15% |
| **Other** | POV, aerial, etc. | 5% |

---

## Scene Generation Workflow

### Phase 1: Scene Breakdown (Claude)
```
Input: Full documentary script
Output: 45 scenes with descriptions

Example scene:
{
  "name": "Introduction to Black Holes",
  "narration": "Black holes are among the most mysterious...",
  "duration": 20,
  "suggestedShots": [
    "Wide establishing shot of galaxy",
    "Diagram of black hole structure",
    "Close-up of accretion disk",
    "B-roll Hubble imagery"
  ]
}
```

### Phase 2: Shot Breakdown (Claude)
```
Input: Scene description
Output: 3-5 shots per scene with detailed prompts

Example shots:
[
  {
    "order": 1,
    "shotAngle": "WIDE",
    "shotType": "AI_VIDEO",
    "visualPrompt": "Wide cinematic shot of spiral galaxy...",
    "duration": 5
  },
  {
    "order": 2,
    "shotAngle": "MEDIUM",
    "shotType": "IMAGE_EFFECT",
    "visualPrompt": "Labeled diagram of black hole...",
    "duration": 5
  },
  ...
]
```

### Phase 3: Asset Generation (Parallel)
```
For each shot:
  1. Try stock media (NASA/Pexels) - FREE
  2. If no match, generate with fal.ai
     - First shot: i2v
     - Subsequent: v2v (for continuity)
  3. Track costs per shot
```

### Phase 4: Audio Generation (Per Scene)
```
For each scene:
  1. Generate voiceover chunk (GenAIPro)
  2. Cost: $0.02 per scene
  3. Store as scene.audioUrl
```

---

## Benefits of Multi-Shot Architecture

### 1. Cinematic Quality
- Multiple angles keep viewer engaged
- Professional documentary pacing
- Better storytelling flow

### 2. Visual Variety
- Mix of wide/medium/close shots
- Dynamic vs static footage
- Stock + AI + user graphics

### 3. Efficient Editing
- Shots are pre-timed (5s avg)
- Easy to rearrange in timeline
- Clear shot boundaries

### 4. Flexible Regeneration
- Regenerate single shot without affecting others
- Test different angles for same moment
- A/B test shot variations

### 5. Cinematic Continuity (v2v)
- Use v2v for shots within same scene
- Maintains camera language
- Smooth transitions
- Worth the 50% premium ($0.168/s vs $0.112/s)

---

## When to Use i2v vs v2v

### i2v (Image-to-Video) - $0.112/s
**Use for:**
- First shot of a scene
- Independent shots
- Location changes
- New camera setups

### v2v (Video-to-Video) - $0.168/s
**Use for:**
- Subsequent shots in same scene
- Maintaining camera style
- Match cuts
- Shot sequences requiring continuity

**Example Scene:**
1. Wide shot (i2v) → $0.56
2. Medium shot (v2v from #1) → $0.84
3. Close-up (v2v from #2) → $0.84
4. Return to wide (v2v from #1) → $0.84

Total: $3.08 for 4 shots (20s)

---

## Pricing Impact

### Old Architecture (45 "scenes" = single shots)
```
Cost: $53.63 per video
```

### New Architecture (45 scenes × 4 shots = 180 shots)
```
Cost: $85.65 per video
Increase: +$32.02 (60% more)
```

### Revised Customer Pricing
```
Production cost: $85.65
Infrastructure: $2.00
Total cost: $87.65

Price to customer: $99 (was $69)
Gross margin: $11.35 (13%)
```

### Market Comparison (Still Competitive!)
- VidRush: $150-300/video
- Traditional editor: $150-500/video
- **CRTR Studio: $99/video** (34-80% cheaper)
- Multi-shot, cinematic quality
- 30-60 min generation time

---

## Database Schema

### Key Relationships

```prisma
Scene {
  id String
  narration String       // Full scene narration
  audioUrl String?       // Combined audio for scene
  duration Int           // Sum of shot durations
  shots Shot[]
}

Shot {
  id String
  sceneId String
  order Int              // Shot order within scene
  shotType ShotType      // AI_VIDEO, IMAGE_EFFECT, MOTION_GRAPHIC
  shotAngle ShotAngle    // WIDE, MEDIUM, CLOSE_UP, etc.
  visualPrompt String
  duration Int           // Typically 5 seconds
  
  videoUrl String?
  imageUrl String?
  
  // For v2v continuity
  previousShotId String?
  previousShot Shot?
}
```

---

## Implementation Phases

### Phase 1: Basic Multi-Shot (MVP)
- Generate 4 shots per scene
- All i2v (no v2v yet)
- Cost: ~$77 per video

### Phase 2: Add v2v Continuity
- Use v2v for sequential shots
- Maintains cinematic language
- Cost: ~$86 per video (current estimate)

### Phase 3: Smart Shot Selection
- AI determines optimal shot count (3-5)
- Dynamic based on scene content
- Optimize cost vs quality

### Phase 4: User Shot Control
- User can add/remove shots
- Change shot angles
- Reorder shots in timeline

---

## Summary

**Multi-Shot Architecture:**
- ✅ Professional cinematic quality
- ✅ 180 shots vs 45 (4× more detail)
- ✅ Visual variety and engagement
- ✅ Flexible editing and regeneration
- ✅ Still 34-80% cheaper than competitors
- 💰 $85.65 production cost (vs $53.63 single-shot)
- 💰 $99 customer price (vs $69)

**Worth the premium** for professional documentary quality with multiple camera angles per scene!


