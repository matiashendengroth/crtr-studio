# CRTR Studio Documentation

Complete documentation index for CRTR Studio - Your smart research assistant for documentary production.

---

## 🚀 Getting Started

**New to the project? Start here:**

| Document | Description |
|----------|-------------|
| [`getting-started/START-HERE.md`](getting-started/START-HERE.md) | **Read this first!** Complete project overview |
| [`getting-started/SETUP.md`](getting-started/SETUP.md) | Development environment setup |
| [`getting-started/API-KEYS-SETUP.md`](getting-started/API-KEYS-SETUP.md) | Configure your API keys |
| [`getting-started/PROJECT-STATUS.md`](getting-started/PROJECT-STATUS.md) | What's done, what's next |

---

## 🏗️ Architecture

**System design and technical architecture:**

| Document | Description |
|----------|-------------|
| [`architecture/README.md`](architecture/README.md) | **Complete system overview** |
| [`architecture/system-design.md`](architecture/system-design.md) | Database schema, API structure |
| [`architecture/intelligent-orchestration.md`](architecture/intelligent-orchestration.md) | How Claude decides asset strategy |
| [`architecture/stock-footage-selection.md`](architecture/stock-footage-selection.md) | **How Claude picks best stock footage** |
| [`architecture/multi-shot-structure.md`](architecture/multi-shot-structure.md) | Scene → Shot hierarchy |
| [`architecture/timeline-components.md`](architecture/timeline-components.md) | React components & shot assembly |
| [`architecture/visual-diagrams.md`](architecture/visual-diagrams.md) | Visual architecture diagrams |
| [`architecture/workflow-summary.md`](architecture/workflow-summary.md) | User journey and workflow |
| [`architecture/generation-process.md`](architecture/generation-process.md) | Asset generation pipeline |

---

## 🔌 API Integrations

**External service integrations:**

| Document | Description |
|----------|-------------|
| [`integrations/fal-ai.md`](integrations/fal-ai.md) | Image & video generation (Nano Banana Pro + Kling O1) |
| [`integrations/stock-media.md`](integrations/stock-media.md) | Stock footage strategy (Pexels, NASA) |
| [`integrations/nasa-api.md`](integrations/nasa-api.md) | NASA Images API guide |
| [`integrations/premiere-pro-fcpxml.md`](integrations/premiere-pro-fcpxml.md) | FCPXML generation for Premiere Pro |
| [`integrations/after-effects-templates.md`](integrations/after-effects-templates.md) | Motion graphic template generation |

**Coming soon:**
- `integrations/pexels-api.md` - Pexels Video/Image API details
- `integrations/genaipro-api.md` - Voiceover API details

---

## ✨ Features

**Feature specifications and implementation guides:**

| Document | Description |
|----------|-------------|
| [`features/front-page-new-project.md`](features/front-page-new-project.md) | Project creation flow |
| [`features/storyboard-page.md`](features/storyboard-page.md) | Scene/shot storyboard editor |
| [`features/editor-page.md`](features/editor-page.md) | Timeline editor (future) |
| [`features/generation-progress-page.md`](features/generation-progress-page.md) | Progress tracking UI |

---

## 🎨 Design System

**UI/UX design specifications:**

| Document | Description |
|----------|-------------|
| [`design/README.md`](design/README.md) | **Complete design system** |
| [`design/front-page-design.md`](design/front-page-design.md) | Landing page design |
| [`design/storyboard-page-design.md`](design/storyboard-page-design.md) | Storyboard interface |
| [`design/timeline-editor-design.md`](design/timeline-editor-design.md) | Timeline editor UI |

---

## 💼 Business

**Pricing, costs, and business strategy:**

| Document | Description |
|----------|-------------|
| [`business/pricing-strategy.md`](business/pricing-strategy.md) | Complete pricing analysis |

**Key metrics:**
- Average cost: $16/video
- Customer price: $49/video
- Profit margin: 67%

---

## 📚 Research

**Competitive analysis and case studies:**

| Document | Description |
|----------|-------------|
| [`research/ltx-studio-case-study.md`](research/ltx-studio-case-study.md) | LTX Studio analysis |
| [`research/weave-ai-design-study.md`](research/weave-ai-design-study.md) | Weave AI design study |

---

## Quick Reference

### Core Concept
**CRTR Studio = Research Assistant + Asset Packager**

NOT a final video editor - it's a tool that:
- ✅ Researches and gathers footage (Pexels, NASA)
- ✅ Generates AI content only when needed (10-20% of shots)
- ✅ Packages everything for DaVinci Resolve editing
- ✅ User maintains full creative control

### Asset Priority (Claude Orchestrates)
```
1. Stock Video (Pexels, NASA)       → FREE
2. Stock Images + Effects           → FREE
3. Motion Graphics (placeholders)   → $0
4. AI Generation (fal.ai)           → Last resort
```

### Database Structure
```
User → Project → Section → Scene → Shot[]
```

### Tech Stack
- **Frontend:** React + TypeScript + Tailwind + TanStack Query
- **Backend:** Node.js + Express + Prisma + PostgreSQL
- **AI:** fal.ai (images/videos) + Claude (orchestration) + GenAIPro (voiceover)
- **Stock:** Pexels + NASA (free footage)
- **Export:** Premiere Pro (FCPXML) + After Effects (templates)

---

## Documentation by Role

### For Developers
1. Start: `getting-started/START-HERE.md`
2. Setup: `getting-started/SETUP.md`
3. Architecture: `architecture/README.md`
4. Coding rules: `../CLAUDE.md` (root)
5. Features: `features/`

### For Designers
1. Design system: `design/README.md`
2. Page designs: `design/`

### For Business/Product
1. Pricing: `business/pricing-strategy.md`
2. Market research: `research/`

---

## Contributing

See [`../CLAUDE.md`](../CLAUDE.md) for development guidelines and coding patterns.

---

**Questions?** Start with `getting-started/START-HERE.md` for complete overview.

