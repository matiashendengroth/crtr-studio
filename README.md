# CRTR Studio

**Your Smart Research Assistant for Documentary Production**

Transform a topic into an organized package of footage, narration, and instructions. CRTR Studio researches and gathers the best assets (prioritizing real footage), then packages everything for your final creative edit in Premiere Pro.

**📌 New to the project?**
- **Quick overview:** [`START-HERE.md`](START-HERE.md)
- **Ready to build:** [`PROJECT-STATUS.md`](PROJECT-STATUS.md)
- **Setup guide:** [`GETTING-STARTED.md`](GETTING-STARTED.md)

---

## Overview

**Input:** Topic + optional outline  
**Output:** Research package with organized footage ready for your editing in Premiere Pro

**Time:** 20-30 minutes to gather & assemble assets  
**Cost:** ~$9-31 per video (depending on AI usage) | Avg $16

---

## Tech Stack

- **Frontend:** React + TypeScript + Tailwind CSS + TanStack Query
- **Backend:** Node.js + Express + Prisma + PostgreSQL + Redis
- **AI Services:**
  - Script: Claude API
  - Voiceover: GenAIPro
  - Images & Videos: **fal.ai** (unified provider)
    - Images: FLUX/Stable Diffusion models
    - Videos: Kling O1 via fal.ai
- **Infrastructure:** Yarn Berry monorepo + Docker + BullMQ

---

## Workflow

```
1. Topic Input
   ↓
2. Claude Script Generation (2000-3000 words)
   ↓
3. User Reviews & Edits Script
   ↓
4. Claude Shot Orchestration (determines asset strategy per shot)
   ↓
5. Asset Gathering (parallel):
   • Search stock footage (Pexels Videos, NASA Videos)
   • Search stock images (Pexels, NASA, Hubble)
   • Generate AI content (only where no stock available)
   • Generate voiceover chunks (per scene)
   ↓
6. Package Assembly:
   • Organize folders (stock-videos/, ai-generated/, etc.)
   • Generate DaVinci Resolve XML timeline
   • Create metadata.json with sources
   ↓
7. Download Export Package
   ↓
8. 🎬 YOU EDIT in Premiere Pro (timing, music, color, final polish)
   Create motion graphics in After Effects with provided templates
```

**Time:** 20-30 min for CRTR + your editing time  
**CRTR's role:** Research & package  
**Your role:** Creative final edit

---

## Key Features

### **1. Intelligent Shot Orchestration**
- Claude analyzes script and determines best asset strategy per shot
- **Priority:** Real footage (Pexels/NASA videos) → Stock images → Motion graphics → AI generation
- Multi-shot scenes only where it improves storytelling
- 80-90% real/stock footage, 10-20% AI-generated (cost optimized)

### **2. Smart Shot Distribution + Stock Media**
- **50% AI Video** - Dynamic Kling AI generations (22 clips)
- **30% Image Effects** - Stock media (NASA, Pexels) + AI fallback (14 clips)
- **20% Motion Graphics** - Placeholders for After Effects (9 clips)
- **Result:** Professional quality at ~$53/video (vs $150-500 competitors)
- **Bonus:** Stock media often higher quality (NASA 4K+, authentic space imagery)

### **3. Voiceover Chunking**
- Each scene gets separate audio file (not one long file)
- Edit scene narration → regenerate only that chunk
- Faster iteration, better error handling

### **4. Free Stock Media Integration**
- NASA Image Library (140,000+ space images/videos, public domain)
- Pexels API (millions of stock photos/videos, commercial-safe)
- HubbleSite (elite deep-space visuals, 8K resolution)
- Claude AI evaluates relevance (>70% match required)
- Falls back to AI generation for custom content
- **Saves $3-5 per video**, often higher quality than AI

### **5. Composition Intelligence**
- Max 2-3 focal points per shot
- Match cuts tracked between scenes
- AI optimizes for visual flow

### **6. Export Package for Your Editing**
- Organized folder structure (stock-videos/, stock-images/, ai-generated/, motion-graphics/)
- **Premiere Pro XML (FCPXML)** with timeline pre-assembled
- **After Effects project files** for motion graphics
- Per-scene audio files + combined narration track
- metadata.json with shot details, sources, prompts
- README with import instructions
- **You maintain full creative control** - adjust timing, add music, color grade, final polish

---

## Documentation

### **Start Here**
- 🎯 [`START-HERE.md`](START-HERE.md) - **Read this first!** Complete overview
- 🚀 [`GETTING-STARTED.md`](GETTING-STARTED.md) - Beginner-friendly setup
- 🔧 [`SETUP.md`](SETUP.md) - Detailed setup instructions
- 🔐 [`API-KEYS-SETUP.md`](API-KEYS-SETUP.md) - Your API keys (secure)

### **Architecture**
- 📐 [`docs/FINAL-ARCHITECTURE.md`](docs/FINAL-ARCHITECTURE.md) - **Complete architecture overview**
- 🎭 [`docs/technical/intelligent-orchestration.md`](docs/technical/intelligent-orchestration.md) - Shot orchestration logic
- 🏗️ [`docs/technical/architecture.md`](docs/technical/architecture.md) - System architecture
- 🎬 [`docs/technical/multi-shot-architecture.md`](docs/technical/multi-shot-architecture.md) - Scene/Shot structure

### **AI Services**
- 🤖 [`docs/technical/fal-ai-models.md`](docs/technical/fal-ai-models.md) - fal.ai models & pricing
- 🛰️ [`docs/technical/nasa-images-api-guide.md`](docs/technical/nasa-images-api-guide.md) - NASA API integration
- 📸 [`docs/technical/stock-media-integration.md`](docs/technical/stock-media-integration.md) - Stock strategy

### **Business**
- 💰 [`docs/PRICING.md`](docs/PRICING.md) - Pricing strategy & margins

### **Coding**
- 📖 [`CLAUDE.md`](CLAUDE.md) - Development rules & patterns

---

## Quick Start

**Complete setup guide:** [`GETTING-STARTED.md`](GETTING-STARTED.md)

### TL;DR (15 minutes)
```bash
# 1. Install
corepack enable
yarn install

# 2. Add API keys (see API-KEYS-SETUP.md)
cp packages/api/env.example packages/api/.env
# Edit .env and add your keys

# 3. Start Docker
yarn docker:up

# 4. Setup database
cd packages/api
yarn db:generate
yarn db:push

# 5. Start servers (2 terminals)
yarn dev:api      # Terminal 1
yarn dev:web      # Terminal 2
```

**Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001/health
- Database: `yarn db:studio`

---

## Project Structure

```
crtr-studio/
├── packages/
│   ├── web/              # React frontend
│   └── api/              # Node.js backend
├── docs/
│   ├── technical/        # Architecture & setup
│   ├── features/         # Feature specifications
│   └── research/         # Design studies
├── docker-compose.yml
├── claude.md             # Dev guidelines
└── README.md
```

---

## Cost Breakdown (per 15-min documentary)

### Smart Orchestration (Claude prioritizes real footage)

**Asset Priority:** Stock Video → Stock Images → Motion Graphics → AI (last resort)

#### Conservative (Lots of Real Footage Available)
| Component | Usage | Cost |
|-----------|-------|------|
| Claude (script + orchestration) | 2 requests | $0.15 |
| GenAIPro (voiceover chunks) | 30-45 chunks | $0.90 |
| Stock videos (Pexels, NASA) | 40 shots (33%) | $0.00 |
| Stock images + effects | 40 shots (33%) | $0.00 |
| Motion graphics (user creates) | 20 shots (17%) | $0.00 |
| AI generated (fal.ai) | 12 shots (10%) | $8.00 |
| **CONSERVATIVE TOTAL** | ~120 shots | **$9.05** |

#### Balanced (Mix of Stock + AI)
| Component | Usage | Cost |
|-----------|-------|------|
| Claude + GenAIPro | | $1.05 |
| Stock footage (60%) | 72 shots | $0.00 |
| Motion graphics (20%) | 24 shots | $0.00 |
| AI generated (20%) | 24 shots | $15.00 |
| **BALANCED TOTAL** | ~120 shots | **$16.05** |

#### AI-Heavy (Abstract/Conceptual Topic)
| Component | Usage | Cost |
|-----------|-------|------|
| Claude + GenAIPro | | $1.05 |
| Stock footage (40%) | 48 shots | $0.00 |
| Motion graphics (20%) | 24 shots | $0.00 |
| AI generated (40%) | 48 shots | $30.00 |
| **AI-HEAVY TOTAL** | ~120 shots | **$31.05** |

**Smart Hybrid Strategy:**
- Try free stock media first (NASA, Pexels, Hubble for space/nature)
- Fall back to AI generation for custom/niche content
- Saves $3-5 per video depending on documentary topic
- Often higher quality (NASA images are 4K+, authentic)

---

## Pricing Strategy

### **Target Market**
Documentary creators, YouTubers, educators, course creators who need professional video quality without hiring traditional editors.

### **Competitive Analysis**
- **VidRush**: $150-300/video, AI-generated
- **Upwork video editor**: $150-500/video, 3-5 day turnaround
- **Fiverr editor**: $50-200/video, variable quality
- **In-house editing**: 50+ hours labor @ $30-50/hr = $1,500-2,500

### **Our Pricing (Production Tier)**
| Plan | Price | Cost (Avg) | Margin | Target Customer |
|------|-------|------------|--------|-----------------|
| **Free Trial** | $0 (1 video) | $16 | -$16 loss leader | Acquisition funnel |
| **Pay-Per-Video** | $49/video | $18 | +$31 (67% margin) | Occasional users |
| **Creator Plan** | $99/month (3 videos) | $54 | +$45/mo | Regular creators |
| **Pro Plan** | $199/month (6 videos) | $108 | +$91/mo | Power users |

*Average cost: $16/video (varies $9-31 based on AI usage)*  
*Infrastructure: ~$2/video (hosting, CDN, payment processing)*  
*Healthy margins enable reinvestment in better stock sources & AI models*

### **Profit Margin Breakdown (Smart Orchestration)**
```
Revenue: $49/video
- Research & AI costs: $16 (avg, varies $9-31)
- Infrastructure: ~$2 (hosting, storage, bandwidth)
= Net profit: $31 per video (67% margin) ✅

With scale (Creator/Pro plans):
Creator: $99/3 videos = $33/video revenue
         3 × $18 = $54 total cost
         = +$45/month profit ✅

Pro: $199/6 videos = $33.17/video revenue  
     6 × $18 = $108 total cost
     = +$91/month profit ✅

Strategy: All tiers profitable, healthy margins enable growth
Real footage first approach dramatically reduces costs
User maintains creative control with final edit
```

---

## Roadmap

### **Phase 1: MVP** (Current)
- [x] Architecture documentation
- [x] Two-tier service configuration (dev/prod)
- [ ] Environment-based AI service routing
- [ ] Project creation & script generation
- [ ] Scene breakdown & asset generation
- [ ] Storyboard editor
- [ ] Video generation pipeline
- [ ] Timeline editor
- [ ] DaVinci export

### **Phase 2: Polish**
- [ ] User authentication & billing
- [ ] WebSocket real-time progress
- [ ] Regeneration history (compare versions)
- [ ] Template library (pre-built storyboards)
- [ ] Voice selection (different narrators)

### **Phase 3: Scale**
- [ ] Team collaboration
- [ ] Custom style guides
- [ ] Multiple aspect ratios (9:16, 1:1)
- [ ] Subtitle generation
- [ ] Multi-language support

---

## Key Design Decisions

### **Why Two-Tier Service Configuration?**
**Development (fast iteration, low cost):**
- Google Imagen 1K resolution ($0.134/image)
- Kling Standard tier (~$0.02/second estimated)
- 10-second clips for faster testing
- **Cost:** ~$4.50/project

**Production (max quality):**
- Nanobana Pro 4K resolution ($0.24/image)
- Kling O1 image-to-video ($0.112/second)
- 20-second clips for professional quality
- **Cost:** ~$55/project

**Why this matters:** Developers iterate fast and cheaply during testing, while customers get maximum quality. Same manufacturer APIs ensure consistent behavior across environments.

### **Why Voiceover Chunking?**
Generate per-scene instead of entire script:
- Edit one scene → regenerate 20s, not 15 min
- Better error handling
- Faster iteration
- Can use different voices per section

### **Why 50/30/20 Shot Distribution + Stock Media?**
- **50% AI Video**: High quality, dynamic movement (22 clips @ Kling O1)
- **30% Image Effects**: Stock media when available, AI fallback (14 clips)
  - NASA/Pexels/Hubble: Free, often 4K+, authentic
  - Nanobana Pro 4K: Custom content fallback
  - Claude AI evaluates relevance (>70% match required)
- **20% Motion Graphics**: User adds in post (9 clips - data viz, timelines)
- **Result**: Professional quality at ~$53/video production cost

**Value Proposition:**
- VidRush similar service: $150-300/video (AI-heavy approach)
- Traditional video editor: $150-500/video (multi-day turnaround)
- Manual research: 20-40 hours gathering footage + $0-500 licensing
- **CRTR Studio: $49/video** (67-84% cheaper, 20-30 min generation)
- **Key difference:** Research assistant that gathers real footage + AI fallback
- **You control:** Final edit timing, music, color grading, polish in Premiere Pro
- **Output:** Organized package + After Effects templates ready for your creative touch

### **Why DaVinci Resolve Export Only?**
- Professional workflow (color grading, final polish)
- User adds background music & sound effects
- User creates motion graphics
- CRTR Studio focuses on core video generation

### **Why Monorepo with Yarn Berry?**
- Shared types between frontend/backend
- Faster installs with PnP
- Better dependency management
- Modular, scalable architecture

---

## Contributing

See [`CLAUDE.md`](claude.md) for development guidelines.

---

## License

[TBD]

---

**Built for documentary creators who want AI assistance without losing creative control.**


