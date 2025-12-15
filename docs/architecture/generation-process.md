# Generation Process - Under the Hood

## Overview
This document explains the complete workflow from script input to final video export.

## Complete Workflow

```
Script Input
    ↓
AI Scene Breakdown + Storyline Creation
    ↓
Generate Starting Frames + Video Prompts
    ↓
STORYBOARD PAGE (User Review & Edit)
    ↓
Generate All Videos with Kling AI
    ↓
TIMELINE EDITOR (Preview & Regenerate)
    ↓
Export to DaVinci Resolve
```

---

## Phase 1: Script Analysis & Scene Breakdown

### Input
- User's pasted script (2000-3000 words for 15-min documentary)

### AI Processing (Claude)
Creates three things simultaneously:
1. **Scenes** - Individual shots/segments
2. **Storyline** - Narrative arc and pacing
3. **Script refinement** - Optimize narration timing

### Output
```json
{
  "sections": [
    {
      "id": "section-1",
      "name": "Introduction to Black Holes",
      "scenes": [
        {
          "id": "scene-1-1",
          "duration": 18,
          "narration": "In 2019, humanity captured the first image...",
          "visualPrompt": "Orange glowing ring of black hole M87, dark center, accretion disk, scientific visualization",
          "styleGuide": "space-science",
          "cameraMovement": "slow-zoom-in",
          "mood": "awe-inspiring"
        }
      ]
    }
  ],
  "storyline": {
    "hook": "scene-1-1",
    "climax": "scene-4-3",
    "resolution": "scene-5-2",
    "pacing": "slow-build"
  }
}
```

**Duration**: ~10-20 seconds

---

## Phase 2: Generate Starting Frames + Video Prompts

### Starting Frame Generation
For EACH scene, generate a starting frame (keyframe image):

**Process**:
```typescript
for (const scene of allScenes) {
  // Generate starting frame with AI
  const startingFrame = await generateImage({
    prompt: scene.visualPrompt,
    style: scene.styleGuide,
    aspectRatio: "16:9",
    quality: "high",
    model: "midjourney" // or DALL-E 3
  });
  
  scene.startingFrameUrl = startingFrame.url;
  
  // Create video generation prompt
  scene.videoPrompt = createKlingPrompt({
    visualDescription: scene.visualPrompt,
    cameraMovement: scene.cameraMovement,
    duration: scene.duration,
    mood: scene.mood
  });
}
```

**Starting Frame Requirements**:
- 16:9 aspect ratio
- High resolution (1920x1080 minimum)
- Matches documentary style
- Clear, well-composed
- Ready for video generation

**Video Prompt Format** (for Kling AI):
```
"[Visual description], [camera movement], [duration]s, [mood/lighting], 
documentary style, high quality, cinematic"

Example:
"Orange glowing ring of supermassive black hole, dark void at center, 
bright accretion disk, slow zoom towards center, 18 seconds, 
dramatic lighting, scientific documentary style, 4K quality, cinematic"
```

**Duration**: ~30-60 seconds (parallel generation of all starting frames)

---

## Phase 3: STORYBOARD PAGE (User Control)

User now sees all scenes with:
- ✅ Starting frame preview images
- ✅ Video generation prompts
- ✅ Scene metadata (duration, narration)

### User Actions Available

#### 1. Preview Scene
- Shows starting frame
- Plays narration audio
- Shows intended duration
- Displays video prompt

#### 2. Edit Scene
```
Edit Modal:
- Narration text [editable]
- Starting frame [regenerate or upload custom]
- Video prompt [editable]
- Duration [adjustable]
- Camera movement [dropdown]
- Visual style [dropdown]
```

#### 3. Reorder Scenes
- Drag and drop to new position
- Updates storyline automatically
- Recalculates total duration

#### 4. Add/Remove Scenes
- Delete scenes that don't fit
- Add new scenes manually
- Duplicate and modify existing scenes

#### 5. Approve for Generation
- Review all scenes one final time
- Check total duration
- Click "Generate All Videos"

**User Time**: 5-30 minutes (depending on edits needed)

---

## Phase 4: Generate All Videos with Kling AI

### Kling AI Video Generation

**What is Kling AI**:
- AI video generation model
- Creates high-quality video from starting frame + prompt
- Supports up to 60 seconds per generation
- Maintains consistency from keyframe

### Generation Process

```typescript
async function generateAllVideos(scenes: Scene[]) {
  const queue = [];
  
  for (const scene of scenes) {
    queue.push({
      sceneId: scene.id,
      startingFrame: scene.startingFrameUrl,
      prompt: scene.videoPrompt,
      duration: scene.duration,
      settings: {
        model: "kling-o1",
        quality: "high",
        fps: 30,
        resolution: "1920x1080"
      }
    });
  }
  
  // Process 3-5 videos at a time (parallel)
  const results = await processQueue(queue, {
    concurrent: 4,
    onProgress: (completed, total) => {
      updateProgress(completed, total);
    }
  });
  
  return results;
}
```

### Progress Tracking

Shows user:
- Current scene being generated (e.g., "Scene 3 of 45")
- Estimated time remaining
- Thumbnail of what's being generated
- Overall progress percentage

**Duration**: ~5-15 minutes for full 15-minute documentary
- Depends on number of scenes
- Average: 30-60 seconds per scene generation
- Parallel processing speeds this up

---

## Phase 5: TIMELINE EDITOR

### Initial State
- All generated videos loaded
- Synced with narration audio
- Background music added
- Transitions applied

### User Capabilities

#### 1. Preview Timeline
- Play from any point
- Scrub through timeline
- Check audio sync
- Review pacing

#### 2. Regenerate Individual Shots
If a shot didn't turn out well:

```typescript
async function regenerateShot(sceneId: string) {
  const scene = timeline.getScene(sceneId);
  
  // Option 1: Same prompt, different generation
  const newVideo = await klingAI.generate({
    startingFrame: scene.startingFrameUrl,
    prompt: scene.videoPrompt,
    seed: randomSeed() // Different result
  });
  
  // Option 2: Edit prompt and regenerate
  const updatedPrompt = await showPromptEditor(scene.videoPrompt);
  const newVideo = await klingAI.generate({
    startingFrame: scene.startingFrameUrl,
    prompt: updatedPrompt
  });
  
  // Replace in timeline
  timeline.replaceScene(sceneId, newVideo);
}
```

#### 3. Fine-Tune Timing
- Trim clip start/end
- Adjust transition timing
- Sync audio better
- Adjust overall pacing

#### 4. Add Effects (Optional)
- Text overlays
- Lower thirds
- Motion graphics
- Color grading

### Timeline Features
- Multi-track (video, narration, music, effects)
- Zoom in/out for precision
- Snap to grid
- Undo/redo
- Auto-save

**User Time**: 5-30 minutes for refinements

---

## Phase 6: Export to DaVinci Resolve

### Export Options

#### Option 1: Direct DaVinci Export
```typescript
async function exportToDaVinci(timeline: Timeline) {
  // Create DaVinci Resolve project file (.drp)
  const davinciProject = {
    timeline: {
      fps: 30,
      resolution: "1920x1080",
      tracks: []
    },
    clips: [],
    effects: []
  };
  
  // Export all media
  for (const scene of timeline.scenes) {
    // Export video clip
    const clipPath = await exportClip(scene.videoUrl);
    
    // Add to DaVinci project
    davinciProject.clips.push({
      path: clipPath,
      inPoint: scene.startTime,
      outPoint: scene.endTime,
      track: 1
    });
  }
  
  // Export audio separately
  const audioPath = await exportAudio(timeline.narration);
  davinciProject.clips.push({
    path: audioPath,
    track: 2
  });
  
  // Generate .drp file
  const drpFile = await generateDaVinciProject(davinciProject);
  
  return {
    projectFile: drpFile,
    mediaFolder: mediaExportPath
  };
}
```

#### Option 2: Media + XML Export
- Export all video clips
- Export audio tracks
- Generate Final Cut Pro XML (compatible with DaVinci)
- Package everything in folder

#### Option 3: Direct MP4 Export
- Render final video
- High-quality MP4
- YouTube-ready
- No further editing needed

### Export Settings
```
Format: MP4 (H.264)
Resolution: 1920x1080 (or 4K)
Frame Rate: 30fps (or 60fps)
Bitrate: 20 Mbps (high quality)
Audio: AAC 192kbps
```

### DaVinci Resolve Integration

**Why DaVinci**:
- Professional color grading
- Advanced audio mixing
- Final polish and refinements
- Export with custom settings
- Add complex effects

**What Gets Exported**:
1. All video clips (individual scenes)
2. Narration audio track
3. Background music track
4. Project file (.drp or .xml)
5. Text overlays (if any)
6. Metadata for each clip

**Folder Structure**:
```
export-2024-12-15/
├── project.drp
├── video-clips/
│   ├── scene-1-1.mp4
│   ├── scene-1-2.mp4
│   └── ...
├── audio/
│   ├── narration.wav
│   └── background-music.mp3
├── graphics/
│   ├── title.png
│   └── lower-thirds.png
└── README.txt
```

---

## Technical Details

### Kling AI Integration

**API Usage**:
```typescript
interface KlingGenerationRequest {
  startingFrame: string; // URL or base64
  prompt: string;
  duration: number; // seconds
  settings: {
    model: "kling-o1";
    quality: "high" | "medium";
    fps: 24 | 30 | 60;
    resolution: "1920x1080" | "3840x2160";
    seed?: number; // For reproducible results
  };
}

async function generateVideoWithKling(request: KlingGenerationRequest) {
  const response = await klingAPI.generate({
    image: request.startingFrame,
    prompt: request.prompt,
    duration: request.duration,
    ...request.settings
  });
  
  // Poll for completion
  const result = await pollForCompletion(response.generationId);
  
  return {
    videoUrl: result.url,
    thumbnailUrl: result.thumbnail,
    duration: result.duration,
    generationTime: result.processingTime
  };
}
```

### Cost & Performance

**Per Scene**:
- Starting frame generation: ~$0.04 (Midjourney/DALL-E)
- Kling video generation: ~$0.15-0.30 per scene
- Total per 15-min doc (40 scenes): ~$8-15

**Time**:
- Starting frames: 1-2 seconds each
- Video generation: 30-60 seconds each
- Total for 40 scenes: 5-15 minutes

### Quality Checks

**Automated Validation**:
```typescript
async function validateGeneratedVideo(videoUrl: string, scene: Scene) {
  const checks = {
    duration: await checkDuration(videoUrl, scene.duration),
    quality: await checkQuality(videoUrl), // Resolution, bitrate
    content: await checkContent(videoUrl, scene.visualPrompt), // AI verify
    audio: await checkAudioSync(videoUrl, scene.narration)
  };
  
  if (!checks.duration || !checks.quality) {
    // Trigger automatic regeneration
    return { valid: false, reason: "quality_check_failed" };
  }
  
  return { valid: true };
}
```

---

## Fallback Strategies

### If Kling Generation Fails
1. **Retry with adjusted prompt**
2. **Try different seed**
3. **Fall back to stock footage** for that scene
4. **Use extended starting frame** with Ken Burns effect
5. **Mark for manual review**

### If Starting Frame Generation Fails
1. **Retry with simplified prompt**
2. **Try alternative AI model** (DALL-E → Midjourney)
3. **Use stock image** matching description
4. **Generate abstract/generic frame**

---

## Performance Optimization

### Parallel Processing
- Generate all starting frames in parallel (4-8 at once)
- Queue video generation (3-5 concurrent)
- Stream results as they complete

### Caching
- Cache starting frames (reuse if prompt unchanged)
- Cache video generations (avoid duplicate work)
- Store intermediate results

### User Experience
- Show progress for each step
- Allow partial approval (generate subset of scenes)
- Enable background processing (user can leave)
- Send notification when complete

---

## Summary

### New Workflow Advantages
1. ✅ **Full control before video generation** - No wasted generations
2. ✅ **See exactly what you'll get** - Starting frames preview
3. ✅ **Edit prompts before generating** - Fine-tune results
4. ✅ **Flexible timeline editing** - Regenerate only what needs fixing
5. ✅ **Professional output** - DaVinci integration for final polish

### Key Differences from Old Approach
- **Old**: Generate videos → hope they're good → edit if not
- **New**: Preview frames → edit prompts → generate → refine → export

### Critical Success Factors
- Fast starting frame generation (<5 seconds each)
- High-quality Kling video generation
- Intuitive storyboard editing
- Reliable regeneration of individual shots
- Smooth DaVinci export
