# CRTR Studio - Final Architecture (Smart Orchestration)

Complete overview of the finalized architecture with intelligent shot orchestration.

---

## Core Philosophy

**CRTR Studio = Research Assistant + Asset Packager**

NOT trying to:
- ❌ Replace professional editors
- ❌ Make final creative decisions
- ❌ Generate AI when real footage exists

INSTEAD:
- ✅ Intelligently research and gather best footage
- ✅ Prioritize authentic real footage over AI
- ✅ Package everything for DaVinci Resolve
- ✅ Let user maintain full creative control

---

## Asset Priority Hierarchy (Claude Orchestrates)

```
For each shot, Claude decides:

1. Stock Video (Pexels, NASA)        → Cost: $0
   └─ Real footage, authentic, instant
   
2. Stock Image + Effects             → Cost: $0
   └─ Real photos with Ken Burns, pan, zoom
   
3. Motion Graphic Placeholder        → Cost: $0
   └─ User creates in After Effects/DaVinci
   
4. AI Generation (fal.ai)            → Cost: $0.15-2.50
   └─ ONLY when no real footage exists
```

---

## Database Schema (Final)

```prisma
User
  └─ Project (Documentary)
      └─ Section (Chapter)
          └─ Scene (Location/sequence, e.g., "Black Holes Explained")
              ├─ audioUrl (scene narration)
              └─ Shot[] (1-5 shots per scene, flexible)
                  ├─ assetStrategy ('stock_video' | 'stock_image' | 'ai_video' | 'motion_graphic')
                  ├─ source ('pexels' | 'nasa' | 'fal_ai' | 'user')
                  ├─ videoUrl or imageUrl
                  ├─ shotAngle (WIDE, MEDIUM, CLOSE_UP, etc.)
                  └─ generationCost
```

**Key Design:**
- Flexible shot count (Claude decides 1-5 per scene)
- Multi-shot only where it improves story
- Tracks source and cost per shot
- Supports stock → AI fallback

---

## AI Services (Unified via fal.ai)

### Images: Nano Banana Pro
- Model: `fal-ai/nano-banana-pro`
- Resolution: 1K ($0.15) or 4K ($0.30)
- Google Gemini 3 Pro architecture
- Link: https://fal.ai/models/fal-ai/nano-banana-pro

### Videos: Kling O1
- Model: `fal-ai/kling-video/o1/image-to-video`
- Cost: $0.112/second
- Durations: 5s or 10s
- Link: https://fal.ai/models/fal-ai/kling-video/o1/image-to-video

### v2v (Future Feature): Kling O1 Reference
- Model: `fal-ai/kling-video/o1/video-to-video/reference`
- Cost: $0.168/second (50% premium)
- Use for: Shot continuity within scenes
- Link: https://fal.ai/models/fal-ai/kling-video/o1/video-to-video/reference

### Script & Orchestration: Claude
- Model: Claude 3.5 Sonnet
- Cost: ~$0.05-0.10 per documentary
- Uses: Script generation, shot orchestration, relevance evaluation

### Voiceover: GenAIPro
- API: https://genaipro.vn/docs-api
- Cost: ~$0.02 per scene narration
- ~45 scenes = $0.90 per video

---

## Stock Media Sources (FREE)

### 1. Pexels (Images & Videos)
- API: https://www.pexels.com/api/documentation
- Rate limit: 200 requests/hour
- License: Commercial-safe, no attribution
- Content: Millions of photos/videos

### 2. NASA Images & Video Library
- API: https://images-api.nasa.gov
- Content: 190,000+ assets (public domain)
- Quality: Up to 8K masters (.tif files)
- See: `docs/technical/nasa-images-api-guide.md`

### 3. Hubble/ESA
- HubbleSite: https://hubblesite.org/api/v3
- ESA: https://www.esa.int/ESA_Multimedia
- Quality: Elite deep-space imagery

---

## Cost Analysis (Final)

### Typical Documentary (120 shots, 15 minutes)

**Conservative (Space/Nature - 80% stock):**
```
Claude + GenAIPro:              $1.05
Stock videos (40 shots):        $0.00
Stock images (40 shots):        $0.00
Motion graphics (20 shots):     $0.00
AI generated (12 shots):        $8.00
─────────────────────────────────────
TOTAL:                          $9.05
```

**Balanced (Mix - 60% stock):**
```
Claude + GenAIPro:              $1.05
Stock (72 shots):               $0.00
Motion graphics (24 shots):     $0.00
AI generated (24 shots):        $15.00
─────────────────────────────────────
TOTAL:                          $16.05
```

**AI-Heavy (Conceptual - 40% stock):**
```
Claude + GenAIPro:              $1.05
Stock (48 shots):               $0.00
Motion graphics (24 shots):     $0.00
AI generated (48 shots):        $30.00
─────────────────────────────────────
TOTAL:                          $31.05
```

**Average production cost: $16/video**

---

## Pricing Strategy (Final)

| Plan | Price | Avg Cost | Profit | Margin |
|------|-------|----------|--------|--------|
| **Free Trial** | $0 | $16 | -$16 | Loss leader |
| **Pay-Per-Video** | $49 | $18 | $31 | 67% |
| **Creator (3/mo)** | $99 | $54 | $45 | 45% |
| **Pro (6/mo)** | $199 | $108 | $91 | 46% |

**All tiers profitable!**

### Market Comparison
- VidRush: $150-300/video
- Traditional editor: $150-500/video
- Manual research: 20-40 hours + licensing
- **CRTR Studio: $49** (67-84% cheaper)

---

## Tech Stack (Final)

### Backend
- **Runtime:** Node.js 20 + TypeScript
- **Framework:** Express
- **Database:** PostgreSQL + Prisma
- **Jobs:** BullMQ + Redis
- **Storage:** S3-compatible

### Frontend
- **Framework:** React 18 + TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS v3
- **State:** TanStack Query
- **Router:** React Router v6

### AI Services
- **fal.ai:** Images (Nano Banana Pro) + Videos (Kling O1)
- **Claude:** Script generation + shot orchestration
- **GenAIPro:** Voiceover generation
- **Stock:** Pexels + NASA (free)

### Infrastructure
- **Monorepo:** Yarn Berry workspace
- **Containers:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Hosting:** Vercel (web) + Railway (api)

---

## Workflow (Final)

### 1. User Input
- Topic: "The Mystery of Black Holes"
- Optional: Outline/key points

### 2. Claude Script Generation
- 2000-3000 word documentary script
- User reviews and edits

### 3. Claude Shot Orchestration
- Breaks script into scenes
- Determines shot strategy per scene:
  - Search terms for stock footage
  - Which shots need AI generation
  - Motion graphic placeholders
  - Shot count (1-5 based on narrative)

### 4. Asset Gathering (Parallel)
- Search Pexels Video API
- Search NASA Images API
- Download/cache stock media
- Generate AI assets (only where needed)
- Generate voiceover chunks (per scene)

### 5. Package Assembly
- Organize by type (stock-videos/, ai-generated/, etc.)
- Generate DaVinci Resolve XML timeline
- Create metadata.json with sources
- Generate README with instructions

### 6. Export to User
- Download ZIP package
- Import to DaVinci Resolve
- User performs final edit

**Time:** 20-30 minutes  
**Cost:** $9-31 depending on AI usage  
**Output:** Research package ready for editing

---

## Key Features

### 1. Intelligent Orchestration
- Claude decides best asset strategy per shot
- Real footage prioritized
- Multi-shot only where it improves story
- Cost-optimized automatically

### 2. Stock Media Integration
- Pexels Video API (millions of videos)
- NASA Images & Video (190k+ space assets)
- Hubble/ESA elite imagery
- All FREE, public domain

### 3. AI Fallback
- fal.ai Nano Banana Pro (images)
- fal.ai Kling O1 (videos)
- Only when no real footage exists
- Typically 10-20% of shots

### 4. Professional Export
- DaVinci Resolve XML project
- Organized folder structure
- Metadata with sources & prompts
- User maintains creative control

---

## Development Phases

### Phase 1: Core Pipeline (Weeks 1-2)
- User auth & project creation
- Claude script generation
- Basic shot orchestration

### Phase 2: Stock Integration (Weeks 3-4)
- Pexels API integration
- NASA Images API integration
- Stock relevance evaluation (Claude)
- Fallback to AI generation

### Phase 3: AI Generation (Weeks 5-6)
- fal.ai Nano Banana Pro (images)
- fal.ai Kling O1 (videos)
- BullMQ job queue
- Progress tracking

### Phase 4: Export (Week 7)
- DaVinci XML generation
- Asset organization
- ZIP packaging
- Metadata generation

### Phase 5: Polish (Week 8)
- Timeline preview
- Shot regeneration
- Manual footage upload
- Quality improvements

---

## Success Metrics

### Target (Month 3)
- 67% profit margin on pay-per-video
- 80% stock footage usage (minimize AI costs)
- <30 min average generation time
- 4.5/5 user satisfaction
- 70% of users proceed with final edit

### Track
- Stock footage success rate
- AI generation percentage
- Cost per video (actual vs estimate)
- User retention
- Export completion rate

---

## Documentation Index

### Technical
- `docs/technical/architecture.md` - System architecture
- `docs/technical/intelligent-orchestration.md` - Shot orchestration logic
- `docs/technical/fal-ai-integration.md` - fal.ai setup
- `docs/technical/fal-ai-models.md` - Model specs & pricing
- `docs/technical/nasa-images-api-guide.md` - NASA API integration
- `docs/technical/stock-media-integration.md` - Stock strategy

### Setup
- `SETUP.md` - Development environment setup
- `API-KEYS-SETUP.md` - API key configuration

### Business
- `docs/PRICING.md` - Pricing strategy
- `docs/FAL-AI-MIGRATION-SUMMARY.md` - Why fal.ai

---

## Summary

**Final Architecture:**
- ✅ Smart orchestration (Claude decides best assets)
- ✅ Real footage first (80-90% stock)
- ✅ AI only where needed (10-20%)
- ✅ Multi-shot flexibility (1-5 per scene)
- ✅ User maintains creative control
- ✅ Export package for DaVinci editing

**Economics:**
- Average cost: $16/video
- Customer price: $49
- Profit: $31 (67% margin)
- All tiers profitable

**Market Position:**
- 67-84% cheaper than competitors
- 20-30 min vs 20-40 hours manual research
- Authentic footage (real NASA/Pexels)
- Professional editing workflow

**CRTR Studio = Your smart research assistant that packages the best footage for your final creative edit!** 🎬


