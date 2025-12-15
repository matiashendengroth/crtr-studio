# CRTR Studio - Complete Workflow Summary

## Tech Stack at a Glance

| Component | Technology |
|-----------|-----------|
| **Script Generation** | Claude API |
| **Voiceover** | GenAIPro API (per-scene chunks) |
| **Starting Frames** | Nanobana Pro |
| **Video Generation** | Kling AI |
| **Frontend** | React + TypeScript + Tailwind |
| **Backend** | Node.js + Express/Fastify + Prisma |
| **Database** | PostgreSQL + Redis |
| **Queue** | BullMQ |
| **Export** | DaVinci Resolve XML only |

---

## Complete User Journey

### **1. New Project Creation** (30 seconds)

**User Input:**
- Topic: "The History of Black Holes"
- Duration: 15 minutes
- Optional: Key points/outline

**AI Processing:**
- Claude generates full documentary script (2000-3000 words)
- User reviews and edits script

---

### **2. Scene Breakdown** (20 seconds)

**AI Processing (Claude):**
- Analyzes script structure
- Creates 40-50 scenes distributed as:
  - **50% AI_VIDEO** - Dynamic Kling AI generations
  - **30% IMAGE_EFFECT** - Static images with Ken Burns/effects
  - **20% MOTION_GRAPHIC** - Placeholders for After Effects
- Assigns narration text per scene
- Creates visual prompts for AI scenes
- Suggests image effects and motion graphics
- Plans focal points (max 2-3 per shot)
- Plans match cuts between scenes

---

### **3. Asset Generation** (2-3 minutes)

Runs in **parallel**:

#### **A. Voiceover (per scene)**
- GenAIPro generates audio chunk for **each scene individually**
- 45 scenes = 45 separate audio files
- Benefit: Easy to regenerate if narration edited

#### **B. Starting Frames (AI_VIDEO scenes only)**
- Nanobana Pro generates starting frame for each AI scene
- ~22 frames for 50% AI_VIDEO distribution
- 16:9, 1920x1080, high quality

**User arrives at Storyboard Page** ✅

---

### **4. Storyboard Review** (5-30 minutes user time)

**User sees:**
- All scenes in grid view
- Shot type badges (🎬 AI Video, 🖼️ Image Effect, 📊 Motion Graphic)
- Starting frames for AI scenes
- Audio preview (play narration)
- Visual prompts and descriptions

**User can:**
- Edit narration → regenerate audio chunk
- Edit visual prompt → regenerate starting frame
- Change shot type
- Reorder scenes (drag & drop)
- Add/remove scenes
- Change effects for image scenes
- Edit motion graphic descriptions

**Critical:** No expensive video generation happens until user approves!

---

### **5. Video Generation** (5-15 minutes)

User clicks **"Generate All Videos"**

**Processing:**
- Queue video generation for **AI_VIDEO scenes only** (22 scenes)
- 3-5 concurrent generations to optimize time
- Kling AI generates from starting frame + prompt
- Each video takes ~30-60 seconds
- IMAGE_EFFECT and MOTION_GRAPHIC scenes skip this step

**Progress shown:**
- "Generating scene 12 of 22..."
- Current scene thumbnail
- Estimated time remaining
- Real-time WebSocket updates

---

### **6. Timeline Editor** (5-30 minutes user time)

**User arrives at timeline with:**
- All generated videos loaded
- All audio chunks assembled in sequence
- Multi-track view (video, narration, graphics placeholders)

**User can:**
- Preview entire documentary
- Scrub through timeline
- Select any scene → see details
- **Regenerate individual scenes:**
  - Same prompt, new seed (different variation)
  - Edit prompt and regenerate
  - Change starting frame and regenerate
- Check audio sync
- Review pacing

---

### **7. Export to DaVinci** (2-5 minutes)

**Export includes:**

```
export-black-holes-doc/
├── project.xml              ← DaVinci Resolve project
├── video-clips/
│   ├── scene-01-ai.mp4     ← AI_VIDEO scenes
│   ├── scene-02-ai.mp4
│   └── ...
├── images/
│   ├── scene-03-portrait.jpg  ← IMAGE_EFFECT scenes
│   ├── scene-04-landscape.jpg
│   └── ... (with effect metadata)
├── audio/
│   ├── scene-01-narration.wav  ← Individual chunks
│   ├── scene-02-narration.wav
│   ├── ...
│   └── narration-full.wav      ← Combined track
├── motion-graphics/
│   └── instructions.txt         ← Descriptions + timecodes
├── metadata.json                ← Scene info, shot types
└── README.txt                   ← Import instructions
```

**What user does in DaVinci:**
1. Import project.xml
2. All clips auto-arranged on timeline
3. Add background music
4. Add sound effects
5. Create motion graphics (from instructions.txt)
6. Apply color grading
7. Final polish
8. Export final video

---

## Shot Type Strategy

### **Why 50/30/20 Distribution?**

#### **50% AI_VIDEO (Kling AI)**
- **Use for:** Dynamic scenes, complex movements, establishing shots
- **Cost (Dev):** ~$0.20 per scene (Kling Standard, 10s clips)
- **Cost (Prod):** ~$2.24 per scene (Kling O1 i2v, 20s clips @ $0.112/s)
- **Time:** 30-60 seconds per scene
- **Example:** Black hole simulation, space telescope flythrough

#### **30% IMAGE_EFFECT (Static + Effects)**
- **Use for:** Portraits, landscapes, archival photos, diagrams
- **Cost (Dev):** ~$0.134 per scene (Google Imagen 1K)
- **Cost (Prod):** ~$0.24 per scene (Nanobana Pro 4K)
- **Time:** 5 seconds per scene
- **Effects:** Ken Burns, pan, zoom, parallax, rapid swap
- **Example:** Portrait of Einstein with Ken Burns effect

#### **20% MOTION_GRAPHIC (After Effects/DaVinci)**
- **Use for:** Data visualizations, timelines, maps, infographics
- **Cost:** $0 (user creates in DaVinci/After Effects)
- **Time:** Skipped during generation
- **Example:** Timeline showing 1915-2024, bar chart of data

### **Cost Comparison**

#### Development Environment (Fast Testing)
**Without mix (all AI video):**
- 45 scenes × 10s × $0.02/s = **$9.00**

**With 50/30/20 mix:**
- 22 AI videos × 10s × $0.02/s = $4.40
- 14 images × $0.134 = $1.88
- 9 motion graphics × $0 = $0
- **Total: $6.28** (30% savings + faster iteration)

#### Production Environment (Max Quality)
**Without mix (all AI video):**
- 45 scenes × 20s × $0.112/s = **$100.80**

**With 50/30/20 mix:**
- 22 AI videos × 20s × $0.112/s = $49.28
- 14 images × $0.24 = $3.36
- 9 motion graphics × $0 = $0
- **Total: $52.64** (48% savings!)

**Full Production Cost Breakdown:**
- Claude (script): $0.05
- Claude (scenes): $0.10
- GenAIPro (45 audio): $0.90
- Images (22 frames): $5.28
- Videos (440s): $49.28
- **TOTAL: $55.61/video**

**Business Model:**
- Customer price: $69/video
- Gross margin: $13.39 (24%)
- Competitive advantage: 50-90% cheaper than VidRush ($150-300) or traditional editing ($150-500)

---

## Voiceover Chunking Strategy

### **Why Per-Scene?**

#### **❌ Bad: Generate entire script at once**
```
Full 15-min narration → One long audio file → Hard to edit
```

**Problems:**
- If user edits one scene's narration → regenerate entire 15 minutes
- One failure breaks everything
- Slow iteration
- Can't A/B test different narrators per section

#### **✅ Good: Generate per scene**
```
Scene 1 narration → audio-01.wav (18 seconds)
Scene 2 narration → audio-02.wav (12 seconds)
Scene 3 narration → audio-03.wav (15 seconds)
...
Timeline assembles all chunks in sequence
```

**Benefits:**
- Edit Scene 12 narration → only regenerate that 20-second chunk
- Faster regeneration (20s vs 5min)
- Better error handling (one failure doesn't break all)
- Can use different voices per section
- Export includes both chunks + combined track

---

## Timeline Assembly Logic

```typescript
// Backend assembles timeline
const timeline = {
  tracks: {
    video: scenes.map(scene => ({
      type: scene.shotType,
      url: scene.videoUrl || scene.imageUrl,
      effect: scene.imageEffect,
      duration: scene.duration,
      startTime: calculateStartTime(scene)
    })),
    
    narration: scenes.map(scene => ({
      url: scene.audioUrl,
      duration: scene.duration,
      startTime: calculateStartTime(scene)
    })),
    
    graphics: scenes
      .filter(s => s.shotType === 'MOTION_GRAPHIC')
      .map(scene => ({
        description: scene.motionGraphicDesc,
        duration: scene.duration,
        startTime: calculateStartTime(scene)
      }))
  }
};
```

---

## Composition Rules (AI Enforced)

### **Max 2-3 Focal Points Per Shot**

**Why?**
- Viewer attention span
- Clearer storytelling
- Better for video compression
- Easier to match cut

**Example Scene:**
```json
{
  "focalPoints": [
    { "x": 0.5, "y": 0.4, "description": "Black hole event horizon" },
    { "x": 0.3, "y": 0.7, "description": "Accretion disk glow" }
  ]
}
```

### **Match Cuts**

Scenes can reference previous scene for smooth transitions:

```json
{
  "id": "scene-05",
  "matchCutWith": "scene-04",
  "description": "Match cut from Earth telescope to space view"
}
```

Claude AI suggests these during scene breakdown based on visual continuity.

---

## Key Differentiators

### **vs LTX Studio**
- ✅ Cheaper (50/30/20 mix vs 100% AI video)
- ✅ Faster (parallel voiceover generation)
- ✅ More control (edit before generating)
- ✅ DaVinci export (professional workflow)

### **vs Runway Gen-3**
- ✅ Documentary-focused (not general purpose)
- ✅ Script generation included
- ✅ Voiceover included
- ✅ Full timeline editor

### **vs Traditional Production**
- ✅ 100x faster (30-60 min vs 50+ hours)
- ✅ 3-9x cheaper ($55-69 vs $150-500)
- ✅ No filming equipment needed
- ✅ Instant revisions (regenerate individual scenes)

---

## Typical Project Timeline

| Phase | Duration | User Active? |
|-------|----------|--------------|
| Script Generation | 30s | ⏸️ Wait |
| Script Review | 5-10 min | ✅ Active |
| Scene Breakdown | 20s | ⏸️ Wait |
| Asset Generation | 2-3 min | ⏸️ Wait |
| **Storyboard Review** | 5-30 min | ✅ **Active** |
| Video Generation | 5-15 min | ⏸️ Wait (can leave) |
| **Timeline Editor** | 5-30 min | ✅ **Active** |
| Export | 2-5 min | ⏸️ Wait |
| **DaVinci Polish** | 1-3 hours | ✅ **Active** |
| **TOTAL** | **1.5-4 hours** | vs 50+ hours traditional |

---

## API Cost Estimates

### Development Environment (Testing)
| Service | Usage | Cost per Project |
|---------|-------|------------------|
| Claude (script) | 1 request | $0.05 |
| Claude (scenes) | 1 request | $0.10 |
| GenAIPro (audio) | 45 chunks | $0.90 |
| Google Imagen 1K | 22 images | $2.95 |
| Kling Standard 10s | 220 seconds | $4.40 |
| **DEV TOTAL** | 15-min doc | **$8.40** |

### Production Environment (Customer-Facing)
| Service | Usage | Cost per Project |
|---------|-------|------------------|
| Claude (script) | 1 request | $0.05 |
| Claude (scenes) | 1 request | $0.10 |
| GenAIPro (audio) | 45 chunks | $0.90 |
| Nanobana Pro 4K | 22 images | $5.28 |
| Kling O1 i2v 20s | 440 seconds @ $0.112/s | $49.28 |
| **PROD TOTAL** | 15-min doc | **$55.61** |

### Pricing Strategy & Margins

| Plan | Price | Cost | Margin | Use Case |
|------|-------|------|--------|----------|
| **Free Trial** | $0 (1 video) | -$55.61 | Loss leader | Acquisition |
| **Pay-Per-Video** | $69 | $55.61 | $13.39 (24%) | Occasional users |
| **Creator** | $149/mo (3 videos) | $166.83 | -$17.83/mo | Regular creators* |
| **Pro** | $299/mo (8 videos) | $444.88 | -$145.88/mo | Power users* |

*Subscription plans subsidized by pay-per-video margins. Focus on volume and retention.

### Market Comparison
- **VidRush**: $150-300/video (AI-generated)
- **Upwork editors**: $150-500/video (3-5 days)
- **Traditional production**: $1,500-2,500 (50+ hours)
- **CRTR Studio**: $69/video (30-60 min) - **50-90% cheaper**

---

This workflow maximizes quality, minimizes cost, and gives users control at every step. The 50/30/20 shot distribution is key to making this economically viable while maintaining documentary quality.


