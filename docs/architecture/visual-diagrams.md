# CRTR Studio - Visual Architecture Overview

Quick visual guide to how everything connects.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        USER INPUT                            │
│  "Create documentary about The Mystery of Black Holes"      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              CLAUDE SCRIPT GENERATION                        │
│  • Generates 2000-3000 word script                          │
│  • User reviews and edits                                   │
│  • Cost: $0.05                                              │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│           CLAUDE SHOT ORCHESTRATION                          │
│  • Breaks into 45 scenes                                    │
│  • Determines 1-5 shots per scene (~120 shots total)        │
│  • Decides asset strategy for each shot:                    │
│    Priority 1: Stock video (Pexels, NASA)                   │
│    Priority 2: Stock image (Pexels, NASA, Hubble)           │
│    Priority 3: Motion graphic placeholder                   │
│    Priority 4: AI generation (fal.ai)                       │
│  • Cost: $0.10                                              │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                PARALLEL ASSET GATHERING                      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ STOCK SEARCH │  │ AI GENERATE  │  │  VOICEOVER   │     │
│  │              │  │              │  │              │     │
│  │ Pexels API   │  │ fal.ai       │  │ GenAIPro     │     │
│  │ NASA API     │  │ Nano Banana  │  │              │     │
│  │ Hubble API   │  │ + Kling O1   │  │ Per scene    │     │
│  │              │  │              │  │ chunks       │     │
│  │ ~80 shots    │  │ ~20 shots    │  │ 45 chunks    │     │
│  │ Cost: $0     │  │ Cost: $14.40 │  │ Cost: $0.90  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐                                           │
│  │ PLACEHOLDERS │                                           │
│  │              │                                           │
│  │ Motion       │                                           │
│  │ Graphics     │                                           │
│  │              │                                           │
│  │ ~20 shots    │                                           │
│  │ Cost: $0     │                                           │
│  └──────────────┘                                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              PACKAGE ASSEMBLY & EXPORT                       │
│                                                              │
│  your-documentary-export.zip                                │
│  ├── 01-stock-videos/          (Pexels, NASA)              │
│  ├── 02-stock-images/           (Pexels, NASA, Hubble)     │
│  ├── 03-ai-generated/           (fal.ai - only ~20 shots)  │
│  ├── 04-motion-graphics/        (Instructions for user)    │
│  ├── 05-audio/                  (Scene chunks + combined)  │
│  ├── timeline.xml               (DaVinci Resolve project)  │
│  ├── metadata.json              (Sources, costs, prompts)  │
│  └── README.txt                 (Assembly instructions)    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│             USER FINAL EDIT (DaVinci Resolve)               │
│  • Import timeline.xml                                      │
│  • Create motion graphics in After Effects                  │
│  • Adjust timing and pacing                                 │
│  • Add background music                                     │
│  • Color grading                                            │
│  • Sound design                                             │
│  • Export final masterpiece                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Structure

```
┌──────────┐
│   USER   │
└────┬─────┘
     │
     │ owns
     ▼
┌──────────┐
│ PROJECT  │ ← "The Mystery of Black Holes"
│          │   status: DRAFT → GENERATING → COMPLETE
│          │   totalCost: $16.05
└────┬─────┘
     │
     │ has many
     ▼
┌──────────┐
│ SECTION  │ ← "Introduction", "History", "Modern Research"
│          │   order: 1, 2, 3
└────┬─────┘
     │
     │ has many
     ▼
┌──────────┐
│  SCENE   │ ← "Explaining Black Holes"
│          │   narration: "Black holes are mysterious..."
│          │   audioUrl: scene-narration.wav
│          │   duration: 20s (sum of shots)
└────┬─────┘
     │
     │ has many (1-5)
     ▼
┌──────────┐
│   SHOT   │ ← Individual camera angle
│          │   order: 1, 2, 3, 4
│          │   shotAngle: WIDE, MEDIUM, CLOSE_UP, B_ROLL
│          │   shotType: AI_VIDEO | IMAGE_EFFECT | MOTION_GRAPHIC
│          │   source: 'pexels' | 'nasa' | 'fal_ai' | 'user'
│          │   videoUrl or imageUrl
│          │   duration: 5s (typical)
│          │   generationCost: $0 (stock) or $0.86 (AI)
└──────────┘
```

---

## Asset Decision Flow

```
For each shot:
  │
  ├─ Is it generic footage?
  │  (rocket launch, galaxy, ocean, etc.)
  │  │
  │  └─ YES → Search Pexels Videos + NASA Videos
  │           │
  │           ├─ Found match (>70% relevance)? → USE STOCK ($0) ✅
  │           │
  │           └─ No match? → Continue to next priority ↓
  │
  ├─ Can it be shown as still image?
  │  (portrait, diagram, landscape, etc.)
  │  │
  │  └─ YES → Search Pexels Images + NASA Images
  │           │
  │           ├─ Found match? → USE STOCK + effects ($0) ✅
  │           │
  │           └─ No match? → Continue to next priority ↓
  │
  ├─ Is it data/infographic?
  │  (timeline, chart, map, text overlay)
  │  │
  │  └─ YES → Create motion graphic placeholder ($0) ✅
  │           User creates in After Effects
  │
  └─ Generate with AI (last resort)
     │
     ├─ Image: fal.ai Nano Banana Pro ($0.30)
     └─ Video: fal.ai Kling O1 i2v ($0.56-2.24)
```

---

## Cost Breakdown by Asset Type

```
120 shots for 15-min documentary:

┌─────────────────┬────────┬─────────┬──────────┐
│  Asset Type     │ Shots  │ % Total │   Cost   │
├─────────────────┼────────┼─────────┼──────────┤
│ Stock Videos    │   40   │   33%   │   $0.00  │
│ Stock Images    │   40   │   33%   │   $0.00  │
│ Motion Graphics │   20   │   17%   │   $0.00  │
│ AI Generated    │   20   │   17%   │  $14.40  │
├─────────────────┼────────┼─────────┼──────────┤
│ Voiceover       │   45   │   N/A   │   $0.90  │
│ Script          │    1   │   N/A   │   $0.15  │
├─────────────────┼────────┼─────────┼──────────┤
│ TOTAL           │        │         │  $15.45  │
└─────────────────┴────────┴─────────┴──────────┘

With infrastructure: ~$18/video
Customer price: $49
Margin: $31 (67%)
```

---

## Service Architecture

```
                  ┌─────────────────┐
                  │   CRTR STUDIO   │
                  │   API Server    │
                  └────────┬────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐  ┌──────────────┐  ┌──────────────┐
│ ORCHESTRATION │  │ STOCK MEDIA  │  │ AI GENERATION│
│               │  │              │  │              │
│ Claude API    │  │ Pexels API   │  │ fal.ai       │
│ • Script      │  │ • Videos     │  │ • Nano Banana│
│ • Scenes      │  │ • Images     │  │ • Kling O1   │
│ • Shots       │  │              │  │              │
│ • Evaluation  │  │ NASA API     │  │ GenAIPro     │
│               │  │ • Images     │  │ • Voiceover  │
│ Cost: $0.15   │  │ • Videos     │  │              │
│               │  │              │  │ Cost: varies │
│               │  │ Cost: $0     │  │              │
└───────────────┘  └──────────────┘  └──────────────┘
        │                  │                  │
        └──────────────────┴──────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  PostgreSQL DB  │
                  │  • Projects     │
                  │  • Scenes       │
                  │  • Shots        │
                  │  • Costs        │
                  └─────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  EXPORT ENGINE  │
                  │  • DaVinci XML  │
                  │  • Folders      │
                  │  • Metadata     │
                  │  • ZIP package  │
                  └─────────────────┘
```

---

## Typical Shot Distribution Example

**Documentary: "The History of Space Exploration"**

### Scene 1: "First Moon Landing" (25 seconds, 4 shots)
```
Shot 1: Wide - Apollo 11 rocket launch
  Source: NASA video archive
  Cost: $0

Shot 2: Medium - Mission control celebration
  Source: NASA historical footage
  Cost: $0

Shot 3: Close-up - Astronaut boot on moon
  Source: NASA Apollo archive
  Cost: $0

Shot 4: Detail - American flag planted
  Source: NASA image + slow zoom
  Cost: $0

Scene cost: $0 (all stock!)
```

### Scene 5: "Modern Black Hole Discovery" (20 seconds, 3 shots)
```
Shot 1: Wide - Event Horizon Telescope array
  Source: Stock image (Pexels) + pan
  Cost: $0

Shot 2: Medium - Computer simulation visualization
  Source: AI generation (Nano Banana + Kling O1)
  Cost: $0.30 + $0.56 = $0.86

Shot 3: B-roll - Scientists analyzing data
  Source: Stock video (Pexels)
  Cost: $0

Scene cost: $0.86
```

### Scene 12: "Theoretical Physics" (15 seconds, 2 shots)
```
Shot 1: Medium - Equations on blackboard
  Source: Motion graphic placeholder
  Cost: $0 (you create in After Effects)

Shot 2: Wide - Abstract space-time visualization
  Source: AI generation (Kling O1)
  Cost: $0.30 + $1.12 = $1.42

Scene cost: $1.42
```

**Total for these 3 scenes (60s, 9 shots): $2.28**

---

## Why This Architecture Wins

### vs VidRush ($150-300)
- ❌ They: 100% AI-generated (no stock)
- ✅ Us: 80% real footage (authentic + free)
- ❌ They: Final edit locked
- ✅ Us: Export for your editing
- **Price:** $49 vs $150-300 (67-84% cheaper)

### vs Traditional Editor ($150-500)
- ❌ They: Manual research (20-40 hours)
- ✅ Us: Automated research (20-30 min)
- ❌ They: 3-5 day turnaround
- ✅ Us: Same day delivery
- ❌ They: Fixed revisions
- ✅ Us: Regenerate any shot instantly

### vs DIY Manual
- ❌ You: Research stock sites manually (hours)
- ✅ Us: AI searches and evaluates
- ❌ You: Track licensing manually
- ✅ Us: Auto-track sources and licenses
- ❌ You: Organize files yourself
- ✅ Us: Pre-organized for DaVinci

---

## Profit Margins Explained

```
Revenue: $49/video

Costs breakdown:
  Claude (script + orchestration):  $0.15
  GenAIPro (voiceover):             $0.90
  Stock footage (80 shots):         $0.00
  AI generated (20 shots):          $14.40
  Motion graphics (20 shots):       $0.00
  Infrastructure (S3, hosting):     $2.00
  ──────────────────────────────────────
  Total cost:                       $17.45

Profit: $31.55
Margin: 67%
```

**Why healthy margins matter:**
- Reinvest in better stock sources
- Add more AI models
- Improve orchestration logic
- Build advanced features
- Sustainable long-term

---

## What Makes CRTR Studio Special

### 1. Intelligent Asset Priority
```
Real Footage > AI Generation
Free > Paid
Authentic > Simulated
```

### 2. User Maintains Control
```
CRTR researches → You create
CRTR packages → You polish
CRTR suggests → You decide
```

### 3. Cost Optimized
```
80-90% free stock footage
10-20% AI where needed
Average: $16/video (vs $53-86 AI-first)
```

### 4. Professional Workflow
```
Export to DaVinci Resolve
Not locked into web editor
Industry-standard tools
Full creative freedom
```

---

## API Services Map

```
┌─────────────────────────────────────────┐
│          AI ORCHESTRATION               │
│  Claude API                             │
│  • Script generation                    │
│  • Scene/shot breakdown                 │
│  • Asset strategy decisions             │
│  • Stock relevance evaluation           │
├─────────────────────────────────────────┤
│         STOCK MEDIA (FREE)              │
│  Pexels API                             │
│  • Videos: Millions                     │
│  • Images: Millions                     │
│  • Rate limit: 200/hour                 │
│                                         │
│  NASA Images API                        │
│  • 190k+ assets                         │
│  • Public domain                        │
│  • Masters (.tif, ~orig.jpg)            │
│                                         │
│  Hubble/ESA                             │
│  • Elite deep-space imagery             │
│  • 8K+ resolution                       │
├─────────────────────────────────────────┤
│      AI GENERATION (FALLBACK)           │
│  fal.ai Platform                        │
│  • Nano Banana Pro (images)             │
│  • Kling O1 i2v (videos)                │
│  • Kling O1 v2v (continuity - future)   │
│                                         │
│  GenAIPro API                           │
│  • Voiceover generation                 │
│  • Per-scene chunks                     │
└─────────────────────────────────────────┘
```

---

## Summary

**CRTR Studio Architecture:**
- ✅ Scene/Shot hierarchy (flexible shot count)
- ✅ Intelligent orchestration (Claude decides)
- ✅ Real footage priority (80-90% stock)
- ✅ AI fallback (10-20% when needed)
- ✅ User maintains creative control
- ✅ Professional export (DaVinci Resolve)

**Economics:**
- Average cost: $16/video
- Customer price: $49
- Margin: 67%
- Market: 67-84% cheaper than competitors

**Philosophy:**
CRTR Studio = Research assistant that finds, gathers, and packages the best footage.  
YOU = The creative director who makes the final masterpiece.

**Ready to build!** 🎬


