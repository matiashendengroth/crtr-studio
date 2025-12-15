# Feature: Timeline Editor Page

## Overview
After all videos are generated, user arrives at the timeline editor where they can preview, regenerate shots, and export to DaVinci Resolve.

## Purpose
- Preview the complete documentary
- Regenerate any shots that need improvement
- Fine-tune timing and transitions
- Export to DaVinci Resolve for final polish

---

## Page Layout

### Main Areas
1. **Video Preview** (center/top) - Full documentary playback
2. **Timeline** (bottom) - All scenes, audio, music tracks
3. **Scene Inspector** (right) - Details for selected scene
4. **Export Panel** (top-right) - DaVinci Resolve export

---

## Core Features

### 1. Video Preview

**Purpose**: Watch the complete documentary

**Controls**:
- Play/Pause (spacebar)
- Timeline scrubber (click to jump)
- Current time / Total duration (e.g., "3:45 / 15:30")
- Volume control
- Playback speed (0.5x, 1x, 1.5x, 2x)
- Fullscreen toggle

**Behavior**:
- Loads all generated videos
- Synced with timeline below
- Shows current scene indicator
- Smooth playback across scene transitions

**Quality Toggle**:
- Preview (lower quality, fast loading)
- Full Quality (1080p, slower loading)

---

### 2. Timeline View

**Purpose**: See all video scenes and audio tracks

**Track Structure** (bottom to top):
```
┌──────────────────────────────────────────────┐
│ Text/Graphics   [Title]  [Lower Third]       │
│ Video Scenes    [S1][S2][S3][S4][S5][S6]...  │
│ Narration      [━━━━━━━━━━━━━━━━━━━━━━━━]  │
│ Background     [~~~~~~~~~~~~~~~~~~~~~~~]       │
│ Music                                          │
└──────────────────────────────────────────────┘
```

**Video Track**:
- Shows all generated scenes in sequence
- Each scene is a clip with thumbnail
- Color-coded by section
- Duration visible on hover

**Narration Track**:
- Full-length narration audio
- Waveform visualization
- Synced with video scenes
- Volume adjustable

**Music Track**:
- Background music (full length)
- Low volume (15-20%)
- Fades at start/end
- Replaceable

**Text/Graphics Track**:
- Title cards
- Lower thirds
- Section dividers
- Can add/edit

---

### 3. Scene Inspector Panel

When a scene is selected on timeline:

```
┌─────────────────────────────────────┐
│ Scene 12: "Black Hole Discovery"    │
├─────────────────────────────────────┤
│ [Thumbnail Preview]                 │
│                                      │
│ Duration: 18 seconds                │
│ Status: ✓ Generated                 │
│                                      │
│ Starting Frame:                     │
│ [Preview Image]                     │
│                                      │
│ Video Prompt:                       │
│ "Orange glowing ring of black hole  │
│ M87, dark center, accretion disk,   │
│ slow zoom towards center..."        │
│                                      │
│ Narration:                          │
│ "In 2019, the Event Horizon        │
│ Telescope captured the first..."    │
│                                      │
│ Actions:                            │
│ [🔄 Regenerate Video]               │
│ [✏️ Edit Prompt]                    │
│ [🖼️ Change Starting Frame]          │
│ [❌ Delete Scene]                   │
└─────────────────────────────────────┘
```

**Information Displayed**:
- Scene number and title
- Thumbnail preview
- Duration
- Generation status
- Starting frame used
- Video generation prompt
- Narration text

**Actions Available**:
1. **Regenerate Video** - Generate new version with same prompt
2. **Edit Prompt** - Modify prompt and regenerate
3. **Change Starting Frame** - Upload new keyframe and regenerate
4. **Delete Scene** - Remove from timeline

---

### 4. Regenerate Shot Feature

**When to Use**:
- Video didn't match expectations
- Camera movement not right
- Visual quality issues
- Want different variation

**Regeneration Options**:

#### Option 1: Same Prompt, New Generation
```
[🔄 Regenerate]
↓
"Generating with same prompt but different seed..."
↓
New video replaces old in timeline
```

#### Option 2: Edit Prompt
```
[✏️ Edit Prompt]
↓
Modal with editable prompt:
┌──────────────────────────────────┐
│ Edit Video Prompt                │
├──────────────────────────────────┤
│ [Text area with current prompt]  │
│                                   │
│ Tips:                            │
│ - Be specific about movement     │
│ - Describe lighting/mood         │
│ - Mention camera angle           │
│                                   │
│ [Cancel]  [Regenerate with Edit] │
└──────────────────────────────────┘
↓
Regenerates with new prompt
```

#### Option 3: Change Starting Frame
```
[🖼️ Change Starting Frame]
↓
Upload new image OR generate new frame
↓
Regenerates video from new keyframe
```

**Regeneration Process**:
1. Click regenerate
2. Scene marked as "Regenerating..."
3. Original video stays until new one ready
4. Progress shown (30-60 seconds)
5. New video swaps in automatically
6. Can compare old vs new

**Comparison Mode**:
```
Before:  [Old Video Preview]
After:   [New Video Preview]

[Keep New]  [Keep Old]  [Regenerate Again]
```

---

### 5. Export to DaVinci Resolve

**Export Panel** (top-right):
```
┌────────────────────────────────┐
│ Export to DaVinci Resolve      │
├────────────────────────────────┤
│ Project Name:                  │
│ [My Documentary]               │
│                                 │
│ Export Format:                 │
│ ○ DaVinci Project (.drp)       │
│ ● Final Cut Pro XML + Media    │
│ ○ Premiere Pro XML + Media     │
│                                 │
│ Media Export:                  │
│ ☑ Individual Scene Videos      │
│ ☑ Narration Audio (WAV)        │
│ ☑ Background Music              │
│ ☑ Project File                  │
│                                 │
│ Resolution:                    │
│ ○ 1080p  ● 4K                  │
│                                 │
│ [Export to DaVinci Resolve] 🚀 │
└────────────────────────────────┘
```

**Export Options**:

#### 1. DaVinci Project (.drp) 
- Native DaVinci Resolve project file
- Includes timeline structure
- All media linked
- Ready to open in DaVinci

#### 2. Final Cut Pro XML + Media
- XML file with timeline
- All video clips exported
- Audio tracks exported
- Compatible with DaVinci and FCP

#### 3. Premiere Pro XML + Media
- Premiere-compatible XML
- Also works in DaVinci
- Industry standard format

**What Gets Exported**:

```
export-my-documentary-2024-12-15/
├── project.xml (or .drp)
├── media/
│   ├── video-clips/
│   │   ├── scene-01-intro.mp4
│   │   ├── scene-02-history.mp4
│   │   ├── scene-03-discovery.mp4
│   │   └── ...
│   ├── audio/
│   │   ├── narration-full.wav
│   │   └── background-music.mp3
│   └── graphics/
│       ├── title-card.png
│       └── lower-thirds/
│           └── ...
├── metadata.json
└── README.txt
```

**README.txt Contents**:
```
Documentary Export - [Project Name]
Generated: 2024-12-15 14:30:00

INSTRUCTIONS:
1. Open DaVinci Resolve
2. File → Import → Project
3. Select project.xml (or .drp)
4. Media will link automatically
5. All clips are in correct sequence
6. Apply color grading and final touches
7. Export with your settings

MEDIA STRUCTURE:
- video-clips/: Individual scenes (45 clips total)
- audio/: Narration and background music
- graphics/: Title cards and overlays

SETTINGS:
Resolution: 4K (3840x2160)
Frame Rate: 30fps
Audio: 48kHz, Stereo

For support: contact@yourdomain.com
```

**Export Process**:
```
1. User clicks "Export to DaVinci Resolve"
2. Validation check (all scenes generated)
3. Show export progress modal:
   
   ┌─────────────────────────────────┐
   │ Exporting to DaVinci Resolve    │
   ├─────────────────────────────────┤
   │ ▓▓▓▓▓▓▓▓▓▓░░░░░░  68%          │
   │                                  │
   │ Exporting scene 31 of 45...     │
   │ Estimated time: 2 minutes       │
   │                                  │
   │ ☑ Project file created           │
   │ ☑ Narration audio exported       │
   │ ⏳ Exporting video clips...      │
   │ ⏱️ Creating graphics...           │
   │                                  │
   └─────────────────────────────────┘
   
4. When complete:
   
   ┌─────────────────────────────────┐
   │ ✅ Export Complete!              │
   ├─────────────────────────────────┤
   │ Your project is ready for       │
   │ DaVinci Resolve.                │
   │                                  │
   │ [Download Export Package]       │
   │ [Open Folder]                   │
   │                                  │
   │ Package Size: 2.4 GB            │
   └─────────────────────────────────┘
```

---

## Alternative Export: Direct MP4

For users who don't need DaVinci:

```
┌────────────────────────────────┐
│ Quick Export (MP4)             │
├────────────────────────────────┤
│ Resolution:                    │
│ ○ 1080p  ● 4K                  │
│                                 │
│ Quality:                       │
│ ○ Good  ● High  ○ Max          │
│                                 │
│ [Export MP4] 🎬                 │
└────────────────────────────────┘
```

Renders final video as single MP4:
- No further editing needed
- YouTube-ready
- Smaller file size
- Faster export

---

## Additional Features

### Timeline Controls

**Zoom**:
- Zoom in: See frame-by-frame detail
- Zoom out: See full documentary
- Fit to view: Show entire timeline

**Snap to Grid**:
- Toggle on/off
- Helps align clips
- Snap to scene boundaries

**Markers**:
- Add markers for notes
- Mark sections for review
- Color-coded markers

### Undo/Redo
- Undo (Ctrl/Cmd + Z)
- Redo (Ctrl/Cmd + Shift + Z)
- Tracks all changes
- Unlimited history

### Auto-Save
- Saves every 30 seconds
- Shows "Saved" indicator
- Can restore if crash
- Version history

### Keyboard Shortcuts
```
Space       - Play/Pause
←/→         - Frame by frame
J/K/L       - Rewind/Pause/Fast-forward
I/O         - Mark in/out
⌘/Ctrl + Z  - Undo
⌘/Ctrl + S  - Save
⌘/Ctrl + E  - Export
```

---

## Error Handling

### Regeneration Fails
```
⚠️ Regeneration Failed
Scene 12 couldn't be regenerated.

Possible reasons:
- Service temporarily unavailable
- Invalid prompt
- Starting frame issue

[Try Again]  [Edit Prompt]  [Use Original]
```

### Export Fails
```
⚠️ Export Failed
Couldn't create export package.

[Retry Export]  [Download Partial]  [Contact Support]
```

### Missing Videos
If some videos never generated:
```
⚠️ Incomplete Timeline
3 scenes are missing videos:
- Scene 12, 23, 34

[Regenerate Missing]  [Export Without Them]  [Go Back to Storyboard]
```

---

## Performance Considerations

### Video Loading
- Progressive loading (low → high quality)
- Preload next/previous scenes
- Cache loaded videos
- Lazy load off-screen content

### Timeline Rendering
- Virtual scrolling for long timelines
- Render only visible portion
- Optimize waveform drawing
- Debounce scrubbing

### Export Optimization
- Parallel video encoding
- Incremental progress updates
- Resume capability if interrupted
- Verify export integrity

---

## User Flow

```
1. User arrives after video generation complete
2. Sees full timeline with all scenes
3. Clicks play to preview documentary
4. Notices Scene 12 needs improvement
5. Clicks Scene 12 → Regenerate
6. Waits 45 seconds for new version
7. Previews new version → Better!
8. Reviews rest of timeline
9. Makes final adjustments
10. Clicks "Export to DaVinci Resolve"
11. Downloads export package
12. Opens in DaVinci for color grading
13. Exports final video from DaVinci
```

---

## Success Metrics

Track:
- Average regenerations per project
- Most regenerated scenes (identify patterns)
- Time spent in timeline editor
- Export success rate
- DaVinci vs MP4 export ratio
- User satisfaction with regeneration feature

---

## Notes

- Timeline editor is about refinement, not major changes
- Regeneration must be fast and reliable (<60s)
- DaVinci export is key differentiator
- Preview quality affects perceived professionalism
- Make regeneration feel safe (keep old until new ready)
- Clear feedback on all actions
