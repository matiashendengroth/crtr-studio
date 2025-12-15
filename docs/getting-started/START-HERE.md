# 🎬 START HERE - CRTR Studio Project Overview

Everything you need to know to start building.

---

## What Is CRTR Studio?

**Your Smart Research Assistant for Documentary Production**

NOT a final video editor - it's a **research and packaging tool** that:
- ✅ Gathers real footage (Pexels videos, NASA archives)
- ✅ Generates AI content only when needed (10-20% of shots)
- ✅ Creates motion graphic placeholders
- ✅ Packages everything for YOUR final edit in DaVinci Resolve

**You maintain full creative control.** CRTR Studio does the research, you do the art.

---

## Economics (Final Numbers)

### Production Cost Per 15-Min Documentary

**Conservative (Space/Nature topic):**
- 80% stock footage (free)
- 10% AI generation
- 10% motion graphics
- **Cost: $9/video**

**Balanced (General topic):**
- 60% stock footage (free)
- 20% AI generation
- 20% motion graphics
- **Cost: $16/video**

**AI-Heavy (Abstract/Conceptual):**
- 40% stock footage
- 40% AI generation
- 20% motion graphics
- **Cost: $31/video**

**Average: $16 per video**

### Customer Pricing
- **Pay-Per-Video:** $49 → $31 profit (67% margin)
- **Creator Plan:** $99/mo (3 videos) → $45/mo profit
- **Pro Plan:** $199/mo (6 videos) → $91/mo profit

**Market comparison:**
- VidRush: $150-300/video
- Traditional editor: $150-500/video
- CRTR Studio: $49/video (**67-84% cheaper**)

---

## Tech Stack (What You're Building With)

### Backend (`packages/api/`)
- Node.js 20 + TypeScript + Express
- PostgreSQL + Prisma ORM
- BullMQ + Redis (job queue)
- Docker for local development

### Frontend (`packages/web/`)
- React 18 + TypeScript + Vite
- Tailwind CSS v3 (dark mode)
- TanStack Query (data fetching)
- React Router v6

### AI Services (via fal.ai)
- **Images:** fal.ai/nano-banana-pro ($0.15-0.30)
- **Videos:** fal.ai/kling-video/o1/image-to-video ($0.112/s)
- **v2v:** fal.ai/kling-video/o1/video-to-video/reference ($0.168/s - future)
- **Script:** Claude API
- **Voiceover:** GenAIPro API

### Stock Sources (FREE)
- **Pexels:** Millions of videos/images
- **NASA:** 190k+ space assets (public domain)
- **Hubble/ESA:** Elite deep-space imagery

---

## Database Structure

```
User
  └─ Project ("The Mystery of Black Holes")
      └─ Section ("Introduction", "History", "Modern Research")
          └─ Scene ("Explaining Event Horizons")
              ├─ audioUrl (scene narration chunk)
              └─ Shot[] (1-5 shots per scene, flexible)
                  ├─ videoUrl or imageUrl
                  ├─ source ('pexels' | 'nasa' | 'fal_ai')
                  ├─ shotAngle (WIDE, CLOSE_UP, etc.)
                  └─ generationCost
```

**Key insight:**
- Scene = sequence/location (e.g., "Explaining black holes")
- Shot = individual camera angle (e.g., "Wide shot of galaxy")
- Flexible shot count (Claude decides 1-5 based on narrative)

---

## Asset Orchestration (How It Works)

### For Each Shot, Claude Decides:

**Priority 1:** Stock Video (Pexels, NASA)
```
Example: "Rocket launch" → NASA video archive → FREE
```

**Priority 2:** Stock Image + Effects
```
Example: "Einstein portrait" → Pexels photo + Ken Burns → FREE
```

**Priority 3:** Motion Graphic
```
Example: "Timeline 1915-2024" → Placeholder for After Effects → $0
```

**Priority 4:** AI Generation (Last Resort)
```
Example: "Black hole simulation" → fal.ai Nano Banana Pro + Kling O1 → $0.86
```

**Result:** 80-90% free footage, 10-20% AI = $16 average cost

---

## Export Package Structure

```
your-documentary-{timestamp}/
├── 01-stock-videos/
│   ├── shot-001-galaxy-nasa.mp4
│   ├── shot-005-rocket-launch.mp4
│   └── ...
├── 02-stock-images/
│   ├── shot-002-einstein-portrait.jpg
│   ├── shot-008-diagram.jpg
│   └── ...
├── 03-ai-generated/
│   ├── shot-003-blackhole-sim.mp4
│   └── shot-012-concept-viz.mp4
├── 04-motion-graphics/
│   ├── shot-006-timeline-INSTRUCTIONS.txt
│   └── shot-010-data-viz-INSTRUCTIONS.txt
├── 05-audio/
│   ├── scene-01-intro.wav
│   ├── scene-02-history.wav
│   └── narration-combined.wav
├── timeline.xml              # FCPXML for Premiere Pro
├── metadata.json             # Shot sources, costs, prompts
└── README.txt                # Assembly instructions
```

**Import to DaVinci Resolve and make it yours!**

---

## Quick Start (15 min)

### 1. Install Dependencies
```bash
corepack enable
yarn install
```

### 2. Add API Keys
```bash
cp packages/api/env.example packages/api/.env
# Edit packages/api/.env and add keys from API-KEYS-SETUP.md
```

### 3. Start Services
```bash
# Terminal 1: Docker
yarn docker:up

# Terminal 2: Backend
yarn dev:api

# Terminal 3: Frontend  
yarn dev:web
```

### 4. Verify
- Backend: http://localhost:3001/health
- Frontend: http://localhost:5173
- Database: `yarn db:studio`

**Done!** Ready to build features.

---

## Development Roadmap

### Phase 1: Foundation (Week 1)
- ✅ Project scaffolding (COMPLETE)
- ⏳ User authentication
- ⏳ Project CRUD

### Phase 2: Script Generation (Week 2)
- ⏳ Claude API integration
- ⏳ Script generation endpoint
- ⏳ Script review UI

### Phase 3: Shot Orchestration (Week 3)
- ⏳ Claude shot breakdown
- ⏳ Asset strategy determination
- ⏳ Stock media search

### Phase 4: Asset Gathering (Week 4)
- ⏳ Pexels API integration
- ⏳ NASA API integration
- ⏳ fal.ai generation fallback
- ⏳ Voiceover generation

### Phase 5: Export Package (Week 5)
- ⏳ DaVinci XML generation
- ⏳ Asset organization
- ⏳ ZIP packaging
- ⏳ Download delivery

---

## File Organization

### Key Files to Start With

**Backend:**
- `packages/api/src/index.ts` - Server entry point
- `packages/api/src/routes/` - API endpoints
- `packages/api/prisma/schema.prisma` - Database schema

**Frontend:**
- `packages/web/src/main.tsx` - App entry point
- `packages/web/src/App.tsx` - Main component
- `packages/web/src/pages/` - Page components

### Documentation
- **`START-HERE.md`** - This file (overview)
- **`GETTING-STARTED.md`** - Beginner setup guide
- **`SETUP.md`** - Detailed setup instructions
- **`API-KEYS-SETUP.md`** - Your API keys
- **`docs/FINAL-ARCHITECTURE.md`** - Complete architecture
- **`docs/technical/`** - Technical deep-dives

---

## What Makes This Different

### Traditional Approach
- Manual research: 20-40 hours
- Stock licensing: $0-500
- Video editing: 30-50 hours
- **Total:** 50-90 hours + $150-500

### CRTR Studio Approach
- **Research:** Automated (20-30 min)
- **Licensing:** Free stock footage
- **Generation:** AI only where needed
- **Editing:** You do the creative work
- **Total:** 20-30 min research + your editing time

**You save:** 20-40 hours of research + licensing costs  
**You retain:** Full creative control of final product

---

## Your Workflow

1. **Input:** "The Mystery of Black Holes"
2. **CRTR generates:** Script (Claude)
3. **You review:** Edit script if needed
4. **CRTR orchestrates:** Determines shots, searches stock
5. **CRTR gathers:** Downloads footage, generates AI fallback
6. **CRTR packages:** Organizes for DaVinci Resolve
7. **You download:** ZIP package
8. **You edit:** Import to DaVinci, add your creative touch
9. **You export:** Final masterpiece

---

## Key Principles (Remember These)

1. **Real footage FIRST** - Stock before AI
2. **Claude orchestrates** - AI decides best asset strategy
3. **User controls final edit** - Not trying to replace you
4. **Cost optimized** - 80-90% free stock footage
5. **Quality maintained** - 4K stock + AI where needed

---

## Ready to Build?

### Immediate Next Steps:

1. ✅ Verify setup works (all servers running)
2. ⏳ Build authentication system
3. ⏳ Implement project creation
4. ⏳ Integrate Claude for script generation
5. ⏳ Build shot orchestration logic

### Detailed Implementation Guides:
- Features: `docs/features/`
- Technical: `docs/technical/`
- Coding rules: `CLAUDE.md`

---

## Questions?

- **Setup issues?** → Check `SETUP.md`
- **API keys?** → Check `API-KEYS-SETUP.md`
- **Architecture?** → Check `docs/FINAL-ARCHITECTURE.md`
- **Costs?** → Check `docs/PRICING.md`

---

**Everything is ready. Time to build your research assistant!** 🚀

**Core Philosophy:** CRTR Studio researches and packages. YOU create the masterpiece.


