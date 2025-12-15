# Feature: Generation Progress Page

## Overview
Shows user what's happening during the two main generation phases:
1. **Initial Analysis** - Creating scenes, storyline, and starting frames
2. **Video Generation** - Creating videos with Kling AI after storyboard approval

---

## Phase 1: Initial Analysis & Setup (Before Storyboard)

### Visual Design
- Horizontal progress bar with connected steps
- Each step shows as a circle/dot
- Completed steps filled/colored
- Current step highlighted
- Future steps greyed out

### Generation Steps

#### Step 1: Analyzing Script
**Status Message**: "Analyzing your script..."
**What's Happening**:
- Claude AI reads the entire script
- Identifies key topics and themes
- Detects natural scene breaks
- Plans narrative structure

**Duration**: ~5-10 seconds

#### Step 2: Creating Scenes & Storyline
**Status Message**: "Creating scenes and storyline..."
**What's Happening**:
- Breaking script into individual scenes
- Creating visual descriptions for each scene
- Planning narrative arc (hook, climax, resolution)
- Calculating pacing and timing
- Creating video generation prompts

**Duration**: ~15-30 seconds

**Shows**:
- "Scene 12 of 45 created..."
- Total scenes count updates live

#### Step 3: Generating Starting Frames
**Status Message**: "Generating preview images for all scenes..."
**What's Happening**:
- AI generates starting frame image for each scene
- Uses Midjourney or DALL-E
- Creates 16:9 high-quality keyframes
- Parallel processing (4-8 at once)

**Duration**: ~30-60 seconds

**Shows**:
- "Generating frame 18 of 45..."
- Thumbnail previews appear as they complete
- Grid of completed frames

### Progress Bar (Phase 1)
```
● ───── ● ───── ○ 
Analyze Scenes  Frames
[████████░░] 75%

Generating starting frames...
Frame 34 of 45 complete
```

### Completion
**Message**: "Your storyboard is ready!"
**Action**: Auto-redirect to Storyboard Page in 2 seconds
**Or**: "Review Storyboard" button

---

## Phase 2: Video Generation (After Storyboard Approval)

User clicks "Generate All Videos" from storyboard → Returns to progress page

### Visual Design
- Same horizontal progress bar style
- Shows individual scene generation progress
- Thumbnail grid of completed videos
- Estimated time remaining

### Generation Steps

#### Step 1: Preparing Generation
**Status Message**: "Preparing video generation..."
**What's Happening**:
- Validating all scenes
- Uploading starting frames to Kling AI
- Creating generation queue
- Optimizing batch processing

**Duration**: ~5-10 seconds

#### Step 2: Generating Videos
**Status Message**: "Generating videos with Kling AI..."
**What's Happening**:
- Sending scenes to Kling AI (3-5 parallel)
- Creating video from starting frame + prompt
- Processing in optimal order
- Downloading completed videos

**Duration**: ~5-15 minutes (for 40 scenes)
- Each scene: 30-60 seconds
- Parallel processing speeds up

**Shows**:
```
Generating Scene 12 of 45...
[████████████████░░░░] 68%

Recently Completed:
┌──────┐ ┌──────┐ ┌──────┐
│Scene │ │Scene │ │Scene │
│  10  │ │  11  │ │  9   │
│  ✓   │ │  ✓   │ │  ✓   │
└──────┘ └──────┘ └──────┘

Currently Generating:
┌──────┐ ┌──────┐ ┌──────┐
│Scene │ │Scene │ │Scene │
│  12  │ │  13  │ │  14  │
│  ⟳   │ │  ⟳   │ │  ⟳   │
└──────┘ └──────┘ └──────┘

Estimated time: 4 minutes
```

#### Step 3: Assembling Timeline
**Status Message**: "Assembling your documentary timeline..."
**What's Happening**:
- Creating Twick timeline
- Adding all video clips
- Syncing narration audio
- Adding background music
- Applying transitions
- Adding text overlays

**Duration**: ~20-40 seconds

#### Step 4: Finalizing
**Status Message**: "Adding finishing touches..."
**What's Happening**:
- Final validation
- Generating full preview
- Preparing timeline editor
- Saving project

**Duration**: ~5-10 seconds

### Progress Bar (Phase 2)
```
● ───── ● ───── ● ───── ○
Prepare Generate Timeline Final
[████████████████████████░░░░] 85%

Generating videos...
Scene 38 of 45 complete
Estimated time: 2 minutes
```

---

## UI Layout

### Full Page Layout
```
┌────────────────────────────────────────────────┐
│         Generating Your Documentary             │
├────────────────────────────────────────────────┤
│                                                 │
│  ● ───── ● ───── ● ───── ○                    │
│  Analyze Scenes  Frames  Complete              │
│                                                 │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░  68%                 │
│                                                 │
│  Generating starting frames...                 │
│  Frame 34 of 45 complete                       │
│                                                 │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │
│  │ ✓    │ │ ✓    │ │ ✓    │ │ ⟳    │         │
│  │Frame │ │Frame │ │Frame │ │Frame │         │
│  │  31  │ │  32  │ │  33  │ │  34  │         │
│  └──────┘ └──────┘ └──────┘ └──────┘         │
│                                                 │
│  Estimated time: 15 seconds                    │
│                                                 │
│  💡 Tip: You'll be able to edit everything     │
│     on the next page before generating videos  │
│                                                 │
│                    [Cancel]                     │
└────────────────────────────────────────────────┘
```

### Video Generation Layout
```
┌────────────────────────────────────────────────┐
│         Generating Your Documentary             │
├────────────────────────────────────────────────┤
│                                                 │
│  ● ───── ● ───── ● ───── ○                    │
│  Prepare Generate Timeline Final               │
│                                                 │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░  72%               │
│                                                 │
│  Generating videos with Kling AI...            │
│  Scene 32 of 45 complete                       │
│                                                 │
│  Recently Completed:                           │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │
│  │  ✓   │ │  ✓   │ │  ✓   │ │  ✓   │         │
│  │Scene │ │Scene │ │Scene │ │Scene │         │
│  │  29  │ │  30  │ │  31  │ │  28  │         │
│  └──────┘ └──────┘ └──────┘ └──────┘         │
│                                                 │
│  Currently Generating (3 parallel):            │
│  ┌──────┐ ┌──────┐ ┌──────┐                   │
│  │  ⟳   │ │  ⟳   │ │  ⟳   │                   │
│  │Scene │ │Scene │ │Scene │                   │
│  │  32  │ │  33  │ │  34  │                   │
│  └──────┘ └──────┘ └──────┘                   │
│                                                 │
│  Estimated time: 3 minutes 20 seconds          │
│                                                 │
│  💡 Videos generate in 30-60s each. You can    │
│     regenerate any scene later if needed.      │
│                                                 │
│                    [Cancel]                     │
└────────────────────────────────────────────────┘
```

---

## Additional UI Elements

### Time Estimates

**Phase 1** (Initial Analysis):
```
Step 1: 5-10 seconds
Step 2: 15-30 seconds  
Step 3: 30-60 seconds
Total: ~1-2 minutes
```

**Phase 2** (Video Generation):
```
Step 1: 5-10 seconds
Step 2: 5-15 minutes (depends on scene count)
Step 3: 20-40 seconds
Step 4: 5-10 seconds
Total: ~6-16 minutes
```

**Display**:
- "Estimated time remaining: 2 minutes"
- Updates every 10 seconds based on actual progress
- Shows faster/slower than expected

### Cancel Button

**Phase 1**: "Cancel" 
- Stops generation
- Returns to front page
- No charges applied

**Phase 2**: "Cancel Generation"
- Shows confirmation: "Are you sure? Already generated videos will be saved."
- Stops queue
- Saves completed videos
- Can resume later

### Tips Carousel

**Phase 1 Tips**:
- "AI is analyzing your script to create the perfect visual story"
- "Starting frames help you preview exactly what will be generated"
- "You'll be able to edit everything before video generation begins"
- "The storyboard lets you reorder, edit, and refine all scenes"

**Phase 2 Tips**:
- "Kling AI creates high-quality videos from your starting frames"
- "Each video is generated in 30-60 seconds"
- "You can regenerate any scene later if needed"
- "Videos are synced with narration automatically"
- "The timeline editor gives you full control over the final video"

---

## Error Handling

### Phase 1 Errors

**Script Analysis Failed**:
```
⚠️ Script Analysis Failed
We couldn't analyze your script. Please try again or 
contact support if this persists.

[Try Again]  [Back to Edit Script]
```

**Starting Frame Generation Failed**:
```
⚠️ Some Starting Frames Failed
3 frames couldn't be generated. You can:
- Continue anyway (we'll generate frames later)
- Retry failed frames
- Edit scene descriptions

Failed Scenes: 12, 23, 34

[Retry Failed]  [Continue Anyway]  [Cancel]
```

### Phase 2 Errors

**Video Generation Failed**:
```
⚠️ Video Generation Issues
Some videos failed to generate:

Scene 12: "Timeout - will retry automatically"
Scene 25: "Quality check failed - needs review"

[View Failed Scenes]  [Continue with Others]
```

**Automatic Retry**:
- Failed videos retry automatically (up to 3 times)
- Different seed each retry
- User notified of retries
- Can manually intervene

---

## Success States

### Phase 1 Complete
```
✅ Storyboard Ready!

Your storyboard has been created with 45 scenes.
Review and edit before generating videos.

Redirecting to storyboard in 3 seconds...

[Go to Storyboard Now]
```

### Phase 2 Complete
```
✅ Your Documentary is Ready!

All 45 videos have been generated and assembled.
Ready for preview and final edits.

Redirecting to timeline editor in 3 seconds...

[Open Timeline Editor]
```

---

## Technical Implementation

### Real-Time Updates

**WebSocket Connection**:
```typescript
const ws = new WebSocket('/api/generation/progress');

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  
  switch (update.type) {
    case 'progress':
      setProgress(update.percentage);
      setMessage(update.message);
      break;
      
    case 'scene_completed':
      addCompletedScene(update.sceneId, update.thumbnailUrl);
      break;
      
    case 'estimate_updated':
      setEstimatedTime(update.seconds);
      break;
      
    case 'error':
      showError(update.error);
      break;
  }
};
```

### State Management
```typescript
interface GenerationProgress {
  phase: 'analysis' | 'video-generation';
  stage: string;
  percentage: number;
  message: string;
  details?: string;
  estimatedTimeRemaining: number;
  
  // Phase 1 specific
  totalScenes?: number;
  scenesCreated?: number;
  framesGenerated?: number;
  
  // Phase 2 specific
  totalVideos?: number;
  videosCompleted?: number;
  videosInProgress?: number;
  completedScenes?: string[];
  failedScenes?: string[];
}
```

---

## Performance Monitoring

### Track These Metrics:
- Average time per phase
- Scene generation success rate
- Video generation success rate
- User drop-off points
- Cancellation reasons
- Error frequency

### Optimization Targets:
- Phase 1 complete: <2 minutes
- Phase 2 complete: <10 minutes for 40 scenes
- Success rate: >95%
- User satisfaction: >4.5/5

---

## Mobile Considerations

### Responsive Design
- Simplified progress bar on mobile
- Vertical layout for scene thumbnails
- Larger touch targets
- Bottom sheet for details
- Background processing with notifications

### Notifications
- Send push notification when Phase 1 complete
- Send notification when videos ready
- Allow user to leave and come back

---

## Notes

- Two distinct generation phases with different progress screens
- Clear visual feedback at all times
- Show completed work (thumbnails) to maintain engagement
- Realistic time estimates build trust
- Allow cancellation with saved progress
- Auto-redirect when complete (with option to go immediately)
