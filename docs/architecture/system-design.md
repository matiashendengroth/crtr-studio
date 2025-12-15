# CRTR Studio - Technical Architecture

## Overview
CRTR Studio is an AI-powered documentary video generation platform built as a monorepo with React frontend and Node.js backend, using Prisma for database management and Docker for containerization.

---

## Technology Stack

### Frontend (`packages/web`)
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Form Handling**: Zod validation + FormData
- **Video Player**: Custom VideoPlayer component
- **Timeline Editor**: Custom multi-track timeline

### Backend (`packages/api`)
- **Runtime**: Node.js 20 LTS
- **Framework**: Express or Fastify
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Job Queue**: BullMQ + Redis
- **File Storage**: S3-compatible (AWS S3 / R2 / MinIO)
- **Authentication**: JWT tokens

### Infrastructure
- **Package Manager**: Yarn Berry (v4+)
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Frontend Hosting**: Vercel / Netlify
- **Backend Hosting**: Railway / Render / Fly.io
- **Database Hosting**: Managed PostgreSQL (Supabase / Neon / Railway)
- **Redis**: Managed Redis (Upstash / Railway)

### External AI Services

**Unified Provider: fal.ai**

#### Development Environment
- **Script Generation**: Claude API (Anthropic)
- **Image Generation**: fal.ai FLUX/dev (~$0.10/image)
- **Video Generation**: fal.ai Kling Standard (~$0.02/second)
- **Voiceover**: GenAIPro API
- **Purpose**: Fast iteration, low cost testing (~$7.65/project)

#### Production Environment
- **Script Generation**: Claude API (Anthropic)
- **Image Generation**: fal.ai FLUX/pro (~$0.20/image)
- **Video Generation**: fal.ai Kling O1 i2v ($0.112/second)
- **Voiceover**: GenAIPro API
- **Purpose**: Maximum quality for customer deliverables (~$52.53/project)

**Why fal.ai:**
- ✅ Single API integration instead of 4-5 different providers
- ✅ One API key, simpler auth
- ✅ Consistent error handling
- ✅ Easy model switching
- ✅ Better monitoring dashboard

**Configuration via Environment Variables:**
```env
# .env.development
NODE_ENV=development
FAL_API_KEY=your-fal-api-key
IMAGE_GEN_MODEL=fal-ai/flux/dev
VIDEO_GEN_MODEL=fal-ai/kling-video/v1/standard
VIDEO_CLIP_LENGTH=10

# .env.production
NODE_ENV=production
FAL_API_KEY=your-fal-api-key
IMAGE_GEN_MODEL=fal-ai/flux/pro
VIDEO_GEN_MODEL=fal-ai/kling-video/v1/pro
VIDEO_CLIP_LENGTH=20
```

---

## Database Schema (Prisma)

```prisma
// packages/api/prisma/schema.prisma

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  projects  Project[]
}

model Project {
  id          String        @id @default(cuid())
  userId      String
  title       String
  topic       String
  duration    Int           // Target duration in seconds
  status      ProjectStatus @default(DRAFT)
  script      String?       // AI-generated script
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  sections    Section[]
  exportJobs  ExportJob[]
  
  @@index([userId])
}

enum ProjectStatus {
  DRAFT
  GENERATING_SCRIPT
  SCRIPT_READY
  GENERATING_SCENES
  SCENES_READY
  GENERATING_VIDEOS
  COMPLETE
  EXPORTED
  FAILED
}

model Section {
  id        String   @id @default(cuid())
  projectId String
  name      String
  order     Int
  createdAt DateTime @default(now())
  
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  scenes    Scene[]
  
  @@index([projectId])
}

model Scene {
  id          String    @id @default(cuid())
  sectionId   String
  order       Int
  shotType    ShotType  @default(AI_VIDEO)
  
  // Common fields
  narration   String
  duration    Int       // Duration in seconds
  audioUrl    String?   // GenAIPro generated voiceover
  audioJobId  String?   // BullMQ job ID
  
  // AI Video fields
  visualPrompt       String?
  startingFrameUrl   String?    // Nanobana Pro generated
  frameJobId         String?
  videoPrompt        String?
  videoUrl           String?    // Kling AI generated
  videoJobId         String?
  videoSeed          Int?       // For reproducibility
  
  // Image Effect fields
  imageUrl           String?
  imageEffect        ImageEffect?
  
  // Motion Graphic fields
  motionGraphicDesc  String?
  
  // Composition
  focalPoints        Json       // Array of {x, y, description}
  matchCutWithId     String?    // Scene ID to match cut with
  
  // Metadata
  generationAttempts Int        @default(0)
  generationCost     Float      @default(0)
  status             SceneStatus @default(PENDING)
  createdAt          DateTime   @default(now())
  updatedAt          DateTime   @updatedAt
  
  section            Section    @relation(fields: [sectionId], references: [id], onDelete: Cascade)
  matchCutWith       Scene?     @relation("MatchCuts", fields: [matchCutWithId], references: [id])
  matchedScenes      Scene[]    @relation("MatchCuts")
  
  @@index([sectionId])
}

enum ShotType {
  AI_VIDEO         // 50% - Kling AI generation
  IMAGE_EFFECT     // 30% - Static image with effects
  MOTION_GRAPHIC   // 20% - Placeholder for After Effects
}

enum ImageEffect {
  KEN_BURNS
  PAN
  ZOOM
  PARALLAX
  RAPID_SWAP
}

enum SceneStatus {
  PENDING
  GENERATING_AUDIO
  GENERATING_FRAME
  GENERATING_VIDEO
  COMPLETE
  FAILED
  NEEDS_REGENERATION
}

model ExportJob {
  id         String      @id @default(cuid())
  projectId  String
  format     ExportFormat @default(DAVINCI_XML)
  status     JobStatus   @default(QUEUED)
  downloadUrl String?
  error      String?
  createdAt  DateTime    @default(now())
  completedAt DateTime?
  
  project    Project     @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  @@index([projectId])
}

enum ExportFormat {
  DAVINCI_XML
  DAVINCI_DRP
}

enum JobStatus {
  QUEUED
  PROCESSING
  COMPLETE
  FAILED
}
```

---

## API Architecture

### Modular Service Structure

```
packages/api/src/
├── server.ts                 # Express/Fastify app setup
├── routes/
│   ├── auth.routes.ts        # POST /auth/signup, /auth/login
│   ├── projects.routes.ts    # CRUD projects
│   ├── scenes.routes.ts      # CRUD scenes
│   └── exports.routes.ts     # Export jobs
├── controllers/              # Route handlers
│   ├── projects.controller.ts
│   ├── scenes.controller.ts
│   └── exports.controller.ts
├── services/                 # Business logic & AI integrations
│   ├── claude/
│   │   ├── claude.service.ts
│   │   └── prompts/
│   │       ├── script-generation.ts
│   │       └── scene-breakdown.ts
│   ├── nanobana/
│   │   └── nanobana.service.ts
│   ├── kling/
│   │   └── kling.service.ts
│   ├── genaipro/
│   │   └── genaipro.service.ts
│   ├── export/
│   │   ├── davinci-export.service.ts
│   │   └── templates/
│   │       └── davinci-xml.ts
│   └── queue/
│       ├── queue.service.ts
│       └── processors/
│           ├── script-generation.processor.ts
│           ├── scene-breakdown.processor.ts
│           ├── audio-generation.processor.ts
│           ├── frame-generation.processor.ts
│           ├── video-generation.processor.ts
│           └── export.processor.ts
├── middlewares/
│   ├── auth.middleware.ts    # JWT verification
│   ├── ownership.middleware.ts # Resource ownership checks
│   └── rate-limit.middleware.ts
├── utils/
│   ├── file-upload.util.ts
│   ├── ffmpeg.util.ts        # Video processing
│   └── cost-calculator.util.ts
└── prisma/
    └── schema.prisma
```

---

## Complete User Workflow with API Calls

### **Phase 1: Script Generation**

**Frontend → Backend**
```typescript
POST /api/projects
{
  "topic": "The History of Black Holes",
  "duration": 900, // 15 minutes in seconds
  "outline": "Optional user-provided outline or key points"
}

Response:
{
  "id": "proj_123",
  "status": "GENERATING_SCRIPT",
  "jobId": "job_abc"
}
```

**Backend Processing**
1. Create project in database
2. Queue script generation job (BullMQ)
3. Job processor calls Claude API with script generation prompt
4. Store script in project
5. Update project status to `SCRIPT_READY`
6. Emit WebSocket event to frontend

**Frontend Polling**
```typescript
GET /api/projects/proj_123

Response:
{
  "id": "proj_123",
  "status": "SCRIPT_READY",
  "script": "In 2019, humanity captured the first image..."
}
```

---

### **Phase 2: User Reviews Script**

**Frontend → Backend**
```typescript
PATCH /api/projects/proj_123
{
  "script": "Updated script after user edits..."
}
```

---

### **Phase 3: Scene Breakdown + Voiceover Generation**

**Frontend → Backend**
```typescript
POST /api/projects/proj_123/generate-scenes

Response:
{
  "status": "GENERATING_SCENES",
  "jobId": "job_def"
}
```

**Backend Processing**
1. Queue scene breakdown job
2. Claude analyzes script and creates scenes with:
   - Shot type distribution (50/30/20 rule)
   - Narration text per scene
   - Visual prompts for AI_VIDEO scenes
   - Effect suggestions for IMAGE_EFFECT scenes
   - Descriptions for MOTION_GRAPHIC scenes
   - Focal points (2-3 per scene)
   - Match cut suggestions
3. Create Section and Scene records in database
4. Queue voiceover generation jobs **per scene** (parallel)
5. Each job calls GenAIPro API for that scene's narration
6. Store audioUrl for each scene
7. Update project status to `SCENES_READY`

**Voiceover Generation Pattern**
```typescript
// queue/processors/audio-generation.processor.ts
async function processAudioGeneration(job: Job<{ sceneId: string }>) {
  const scene = await prisma.scene.findUnique({
    where: { id: job.data.sceneId }
  });
  
  // Generate voiceover for THIS scene only
  const audioUrl = await genAIProService.generateVoiceover({
    text: scene.narration,
    voice: 'documentary-male', // or user-selected voice
    duration: scene.duration
  });
  
  await prisma.scene.update({
    where: { id: scene.id },
    data: { 
      audioUrl,
      status: 'GENERATING_FRAME' // Move to next step
    }
  });
}
```

---

### **Phase 4: Starting Frame Generation**

After scenes + audio are ready, queue frame generation for AI_VIDEO scenes:

```typescript
// Only for scenes where shotType === 'AI_VIDEO'
async function processFrameGeneration(job: Job<{ sceneId: string }>) {
  const scene = await prisma.scene.findUnique({
    where: { id: job.data.sceneId }
  });
  
  // Generate starting frame with Nanobana Pro
  const frameUrl = await nanobanaService.generateImage({
    prompt: scene.visualPrompt,
    aspectRatio: '16:9',
    quality: 'high'
  });
  
  await prisma.scene.update({
    where: { id: scene.id },
    data: { 
      startingFrameUrl: frameUrl,
      status: 'COMPLETE' // Ready for storyboard review
    }
  });
}
```

---

### **Phase 5: Storyboard Page**

Frontend fetches all scenes with starting frames:

```typescript
GET /api/projects/proj_123/scenes

Response:
{
  "sections": [
    {
      "id": "sec_1",
      "name": "Introduction",
      "scenes": [
        {
          "id": "scene_1",
          "shotType": "AI_VIDEO",
          "narration": "In 2019...",
          "duration": 18,
          "audioUrl": "https://cdn.../scene-1-audio.wav",
          "visualPrompt": "Orange glowing ring...",
          "startingFrameUrl": "https://cdn.../scene-1-frame.jpg",
          "videoPrompt": "Slow zoom into black hole...",
          "focalPoints": [
            { "x": 0.5, "y": 0.5, "description": "Black hole center" }
          ],
          "status": "COMPLETE"
        },
        {
          "id": "scene_2",
          "shotType": "IMAGE_EFFECT",
          "narration": "Scientists worked for years...",
          "duration": 12,
          "audioUrl": "https://cdn.../scene-2-audio.wav",
          "imageUrl": "https://cdn.../telescope-team.jpg",
          "imageEffect": "KEN_BURNS",
          "status": "COMPLETE"
        },
        {
          "id": "scene_3",
          "shotType": "MOTION_GRAPHIC",
          "narration": "The timeline shows...",
          "duration": 10,
          "audioUrl": "https://cdn.../scene-3-audio.wav",
          "motionGraphicDesc": "Timeline graphic 2015-2019 showing key milestones",
          "status": "COMPLETE"
        }
      ]
    }
  ]
}
```

**User edits a scene:**
```typescript
PATCH /api/scenes/scene_1
{
  "narration": "Updated narration text...",
  "visualPrompt": "Updated visual prompt..."
}

// Optionally regenerate assets
POST /api/scenes/scene_1/regenerate-audio
POST /api/scenes/scene_1/regenerate-frame
```

---

### **Phase 6: Generate Videos**

User approves storyboard and clicks "Generate All Videos":

```typescript
POST /api/projects/proj_123/generate-videos

Response:
{
  "status": "GENERATING_VIDEOS",
  "totalScenes": 45,
  "aiVideoScenes": 22 // Only AI_VIDEO scenes generate videos
}
```

**Backend Processing**
1. Queue video generation jobs for AI_VIDEO scenes only (3-5 concurrent)
2. Each job calls Kling AI with starting frame + video prompt
3. Kling returns job ID (async processing)
4. Poll Kling API or wait for webhook
5. Store videoUrl when complete
6. Update scene status
7. Emit progress updates via WebSocket

```typescript
// queue/processors/video-generation.processor.ts
async function processVideoGeneration(job: Job<{ sceneId: string }>) {
  const scene = await prisma.scene.findUnique({
    where: { id: job.data.sceneId }
  });
  
  // Start Kling AI generation
  const klingJob = await klingService.generateVideo({
    startingFrame: scene.startingFrameUrl,
    prompt: scene.videoPrompt,
    duration: scene.duration,
    seed: scene.videoSeed // Use same seed for regeneration
  });
  
  // Poll for completion (or wait for webhook)
  const videoUrl = await klingService.pollCompletion(klingJob.id);
  
  await prisma.scene.update({
    where: { id: scene.id },
    data: { 
      videoUrl,
      videoJobId: klingJob.id,
      status: 'COMPLETE',
      generationAttempts: scene.generationAttempts + 1,
      generationCost: scene.generationCost + 0.25 // Track costs
    }
  });
  
  // Check if all scenes complete → update project status
  const incompleteScenesCount = await prisma.scene.count({
    where: {
      section: { projectId: scene.section.projectId },
      status: { not: 'COMPLETE' }
    }
  });
  
  if (incompleteScenesCount === 0) {
    await prisma.project.update({
      where: { id: scene.section.projectId },
      data: { status: 'COMPLETE' }
    });
  }
}
```

**Progress Updates (WebSocket)**
```typescript
// Emitted from backend
{
  "event": "video_generation_progress",
  "data": {
    "projectId": "proj_123",
    "completedScenes": 12,
    "totalScenes": 22,
    "currentScene": {
      "id": "scene_13",
      "status": "GENERATING_VIDEO"
    }
  }
}
```

---

### **Phase 7: Timeline Editor**

Frontend fetches complete project:

```typescript
GET /api/projects/proj_123/timeline

Response:
{
  "sections": [...], // All scenes with videos/images/audio
  "totalDuration": 903, // seconds
  "tracks": {
    "video": [...],      // Scene clips in order
    "narration": [...],  // All audio chunks
    "graphics": [...]    // Motion graphic placeholders
  }
}
```

**Regenerate a scene:**
```typescript
POST /api/scenes/scene_1/regenerate-video
{
  "videoPrompt": "Updated prompt with different camera angle",
  "seed": null // New seed for different result
}
```

---

### **Phase 8: Export to DaVinci**

```typescript
POST /api/projects/proj_123/export
{
  "format": "DAVINCI_XML"
}

Response:
{
  "id": "export_789",
  "status": "QUEUED",
  "format": "DAVINCI_XML"
}
```

**Backend Export Processing**
1. Queue export job
2. Generate DaVinci Resolve XML with timeline structure
3. Download all assets (videos, images, audio chunks)
4. Create folder structure:
   - `video-clips/` - AI_VIDEO scenes
   - `images/` - IMAGE_EFFECT scenes
   - `audio/` - Individual scene audio + combined track
   - `motion-graphics/` - Text file with instructions
5. Generate metadata.json with scene info
6. Generate README.txt with import instructions
7. Zip entire folder
8. Upload to S3 and return download URL

```typescript
GET /api/exports/export_789

Response:
{
  "id": "export_789",
  "status": "COMPLETE",
  "downloadUrl": "https://s3.../project-123-export.zip",
  "expiresAt": "2024-12-21T10:00:00Z"
}
```

---

## Key Technical Decisions

### **1. Voiceover Chunking**
✅ **Generate per-scene**, not entire script
- Easier to edit/regenerate
- Better error handling
- Faster iteration
- Timeline assembles chunks

### **2. Shot Type Distribution**
- 50% AI_VIDEO (expensive, dynamic)
- 30% IMAGE_EFFECT (cheap, effective)
- 20% MOTION_GRAPHIC (user adds in DaVinci)
- Optimizes cost and production time

### **3. Composition Rules**
- Max 2-3 focal points per shot
- Match cuts tracked via `matchCutWithId`
- Claude AI suggests these during scene breakdown

### **4. Job Queue Architecture**
- BullMQ + Redis for async processing
- Parallel processing (3-5 concurrent video generations)
- Retry logic with exponential backoff
- Cost tracking per generation

### **5. Asset Storage**
- CDN URLs for all generated assets
- S3-compatible storage (AWS S3, Cloudflare R2, MinIO)
- Presigned URLs for secure downloads
- Automatic cleanup of old exports (7-day expiry)

---

## Performance Considerations

### **Backend**
- Rate limiting on AI service calls
- Webhook-based completion (avoid polling)
- Database connection pooling (Prisma)
- Redis caching for frequently accessed data
- Horizontal scaling via containerization

### **Frontend**
- Lazy loading of timeline tracks
- Virtual scrolling for long scene lists
- Progressive image loading (blur-up)
- Debounced scrubbing on timeline
- TanStack Query for aggressive caching

---

## Cost Optimization

### **Per Project (15-min documentary, 45 scenes)**

#### Development Environment Costs
- Script generation (Claude): $0.05
- Scene breakdown (Claude): $0.10
- Voiceover (45 chunks @ $0.02): $0.90
- fal.ai FLUX/dev (22 images @ $0.10): $2.20
- fal.ai Kling Standard (220s @ $0.02/s): $4.40
- **DEV TOTAL: ~$7.65**

#### Production Environment Costs (with Stock Media)
- Script generation (Claude): $0.05
- Scene breakdown (Claude): $0.10
- Voiceover (45 chunks @ $0.02): $0.90
- Stock media (11 images, 50%): $0.00
- fal.ai FLUX/pro (11 images @ $0.20): $2.20
- fal.ai Kling O1 (440s @ $0.112/s): $49.28
- **PROD TOTAL: ~$52.53**

**Stock Media Strategy:**
- Try NASA/Pexels/Hubble APIs first (free, public domain)
- Claude AI evaluates relevance (>70% match required)
- Falls back to Nanobana Pro 4K for custom content
- Saves $3-5 per video depending on topic
- Often higher quality (NASA 4K+, authentic space imagery)

**Shot Type Strategy Saves Money:**

Without shot type mix (100% AI video):
- 45 scenes × 20s = 900 seconds
- 900s × $0.112/s = **$100.80** (production tier)

With 50/30/20 mix:
- 22 AI videos (440s) = $49.28
- 14 image effects (static) = included in image gen cost
- 9 motion graphics = $0
- **Total: $49.28 for videos**

**Savings: $51.52 (51% reduction) on video generation costs**

**Business Model:**
- Cost per video: ~$55.61 (production quality)
- Customer pricing: $69/video
- Gross margin: $13.39 (24%)
- Market positioning: 50-90% cheaper than competitors ($150-500/video)
- Value proposition: Professional quality in 30-60 min vs 50+ hours traditional editing

---

## Security

- JWT tokens with 24h expiry
- Resource ownership validation on all mutations
- API keys stored in environment variables
- Rate limiting per user (10 projects/day free tier)
- Webhook signature verification (Kling, GenAIPro)
- S3 presigned URLs with expiration
- SQL injection prevention via Prisma

---

## Monitoring & Analytics

Track:
- Generation success rates per service
- Average generation times
- Cost per project
- User retention and churn
- Most regenerated scenes (identify quality issues)
- Export format preferences
- Error rates and types

---

This architecture supports the complete workflow from topic input → AI script generation → scene breakdown → voiceover chunks → frame generation → storyboard review → video generation → timeline editing → DaVinci export.


