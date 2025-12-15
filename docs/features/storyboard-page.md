# Feature: Storyboard Page

## Overview
After script analysis, users are shown a visual storyboard of all scenes before video generation begins. This allows them to review, edit, and approve the AI's interpretation of their script.

**Inspired by**: LTX Studio's storyboard interface

---

## Page Layout

### Left Sidebar: Section Navigator
```
┌─────────────────────────┐
│ ○ Introduction to...    │
│   LOCATIONS: 2  STYLE: 1│
│                          │
│ ○ Understanding Black... │
│   LOCATIONS: 3  STYLE: 2│
│                          │
│ ○ Einstein's Theory...  │
│   LOCATIONS: 4  STYLE: 1│
│                          │
│ [+ Add Section]          │
└─────────────────────────┘
```

**Purpose**: 
- Organize scenes into logical sections/chapters
- Quick navigation between sections
- Show scene counts per section

**Interactions**:
- Click section to jump to those scenes
- Expand/collapse sections
- Drag to reorder sections
- Edit section names

### Main Area: Scene Grid
```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  [Scene 8.1]        [Scene 8.2]        [Scene 8.3]         │
│  ┌──────────┐       ┌──────────┐       ┌──────────┐        │
│  │          │       │          │       │          │        │
│  │  Image   │       │  Image   │       │  Image   │        │
│  │ Preview  │       │ Preview  │       │ Preview  │        │
│  │          │       │          │       │          │        │
│  └──────────┘       └──────────┘       └──────────┘        │
│  [Edit Image]       [Edit Image]       [Edit Image]        │
│  [Generate Video]   [Generate Video]   [Generate Video]    │
│                                                              │
│  "Description..."   "Description..."   "Description..."     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Scene Card Components

### Visual Layout
```
┌─────────────────────────────┐
│         Scene 3.2           │ ← Scene Number
├─────────────────────────────┤
│                             │
│      [Preview Image]        │ ← AI-generated thumbnail
│         960 x 540           │
│                             │
├─────────────────────────────┤
│ 🎬 Edit Image  🎥 Generate  │ ← Action buttons
├─────────────────────────────┤
│ Duration: 18 seconds        │ ← Scene metadata
│ Style: Historical Footage   │
├─────────────────────────────┤
│ "The Event Horizon          │
│ Telescope captured the      │ ← Scene description
│ first image of a black      │
│ hole in 2019..."            │
└─────────────────────────────┘
```

### Scene Card Information

**Top Section**:
- Scene number (e.g., "8.1" = Section 8, Scene 1)
- Section indicator/color coding

**Preview Image**:
- AI-generated thumbnail (16:9 aspect ratio)
- Shows what visuals will be used
- Generated from visual description
- Loading state while generating

**Action Buttons**:
1. **Edit Image** 
   - Opens scene editor modal
   - Modify visual description
   - Choose different stock footage
   - Regenerate thumbnail

2. **Generate Video**
   - Generate just this scene
   - Useful for testing/preview
   - Shows progress inline

**Metadata Display**:
- Duration (in seconds)
- Visual style (Historical, Modern, Graphics, etc.)
- Location (if applicable)
- Time period (if applicable)

**Description Text**:
- Narration text for this scene
- Visual description
- Truncated with "Read more" if long
- Click to expand/edit

---

## Top Action Bar

```
┌──────────────────────────────────────────────────────────────┐
│ ← Back to Script    [Save Draft]   [Generate All Videos] 🚀 │
└──────────────────────────────────────────────────────────────┘
```

**Buttons**:
1. **Back to Script** - Return to edit original script
2. **Save Draft** - Save current storyboard state
3. **Generate All Videos** - Primary CTA, proceed to generation

---

## Scene Editor Modal

Opens when clicking "Edit Image" on any scene:

```
┌─────────────────────────────────────────────────────────┐
│  Edit Scene 3.2                                    [X]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Scene Duration: [18 seconds] ▼                         │
│                                                          │
│  Narration:                                             │
│  ┌────────────────────────────────────────────────────┐ │
│  │ The Event Horizon Telescope captured the first    │ │
│  │ image of a black hole in 2019, showing the        │ │
│  │ shadow cast by the supermassive black hole at     │ │
│  │ the center of galaxy M87.                         │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  Visual Description:                                    │
│  ┌────────────────────────────────────────────────────┐ │
│  │ The famous orange ring image of black hole M87,   │ │
│  │ glowing accretion disk, dark center, scientific   │ │
│  │ visualization, high resolution                     │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  Visual Style:                                          │
│  ○ Historical Footage  ● Space/Science  ○ Graphics     │
│                                                          │
│  Stock Footage Options:                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ Option 1 │  │ Option 2 │  │ Option 3 │            │
│  │  [img]   │  │  [img]   │  │  [img]   │            │
│  │  ✓       │  │          │  │          │            │
│  └──────────┘  └──────────┘  └──────────┘            │
│                                                          │
│  [Regenerate Options]    [AI Generate New Image]       │
│                                                          │
│                          [Cancel]  [Save Changes]       │
└─────────────────────────────────────────────────────────┘
```

**Editable Fields**:
- Duration slider (5-60 seconds)
- Narration text
- Visual description
- Visual style selector
- Stock footage selection
- Motion/animation options

**Actions**:
- Regenerate stock footage options
- Generate custom AI image
- Preview changes
- Save or cancel

---

## Features & Interactions

### 1. Drag and Drop Reordering
- Grab any scene card
- Drag to new position
- Visual indicator shows drop zone
- Auto-saves on drop
- Updates scene numbers automatically

### 2. Bulk Actions
```
[Select Mode]  [Select All]  [Delete Selected]  [Move Selected]
```

When in select mode:
- Checkboxes appear on scene cards
- Select multiple scenes
- Bulk edit (duration, style, etc.)
- Bulk delete
- Bulk move to different section

### 3. Section Management

**Add Section**:
- Click "+ Add Section" button
- Name the section
- Drag scenes into it
- Sections represent chapters in documentary

**Section Actions**:
- Rename section
- Collapse/expand all scenes in section
- Delete section (moves scenes to "Unsorted")
- Reorder sections

### 4. Scene Generation States

**States**:
1. **Analyzing** - AI analyzing script segment
2. **Generating Preview** - Creating thumbnail
3. **Ready** - Preview shown, ready to edit
4. **Editing** - User is editing scene
5. **Generating Video** - Individual scene being generated
6. **Complete** - Scene video generated

**Visual Indicators**:
```
Analyzing:    [Spinner] Analyzing scene...
Generating:   [Progress] Generating preview... 45%
Ready:        [✓] Ready to edit
Editing:      [Pencil icon] Editing...
Complete:     [✓] Video ready
Error:        [!] Generation failed
```

### 5. Preview Generation

**Auto-generate**:
- When storyboard loads, queue all preview images
- Generate 3-5 at a time (parallel)
- Show placeholders while generating
- User can start editing before all complete

**Thumbnail Generation**:
- Use AI image generation (DALL-E/Midjourney)
- Based on visual description
- 960x540 resolution (16:9)
- Style matches scene requirements
- Cache for future use

### 6. Real-Time Collaboration (Future)
- Show when others are viewing/editing
- Live cursor positions
- Comments on scenes
- Version history

---

## User Workflow

### Initial Load
```
1. User clicks "Generate Video from Script"
2. System analyzes script
3. Redirects to Storyboard page
4. Shows loading state with progress
5. Scenes populate one by one
6. Preview thumbnails generate in background
```

### Review & Edit
```
1. User scrolls through all scenes
2. Clicks "Edit Image" on any scene
3. Modifies description or selects different footage
4. Saves changes
5. Preview regenerates
6. Repeats for any scenes needing changes
```

### Approval & Generation
```
1. User reviews all scenes
2. Makes final adjustments
3. Clicks "Generate All Videos"
4. System validates all scenes
5. Redirects to Progress page
6. Video generation begins
```

---

## Technical Requirements

### Performance
- Load and display 50+ scene cards smoothly
- Lazy load preview images (viewport-based)
- Debounce search/filter operations
- Optimize drag-and-drop for large storyboards

### Data Structure
```typescript
interface Storyboard {
  id: string;
  scriptId: string;
  sections: Section[];
  totalDuration: number;
  createdAt: string;
  updatedAt: string;
}

interface Section {
  id: string;
  name: string;
  order: number;
  scenes: Scene[];
}

interface Scene {
  id: string;
  sectionId: string;
  order: number;
  sceneNumber: string; // e.g., "3.2"
  duration: number;
  narration: string;
  visualDescription: string;
  visualStyle: 'historical' | 'modern' | 'space' | 'graphics' | 'animation';
  previewImageUrl?: string;
  stockFootageOptions: StockFootage[];
  selectedFootageId?: string;
  status: 'analyzing' | 'generating-preview' | 'ready' | 'editing' | 'complete';
  metadata: {
    location?: string;
    era?: string;
    keywords: string[];
  };
}
```

### API Endpoints
```
GET  /api/storyboard/:scriptId          - Get storyboard
POST /api/storyboard/:scriptId/generate - Generate initial storyboard
PUT  /api/storyboard/:id                - Update storyboard
PUT  /api/storyboard/:id/scene/:sceneId - Update individual scene
POST /api/storyboard/:id/scene/:sceneId/regenerate-preview - Regenerate thumbnail
POST /api/storyboard/:id/reorder        - Reorder scenes
DELETE /api/storyboard/:id/scene/:sceneId - Delete scene
```

### State Management
```typescript
// React state structure
const [storyboard, setStoryboard] = useState<Storyboard | null>(null);
const [selectedScenes, setSelectedScenes] = useState<string[]>([]);
const [editingScene, setEditingScene] = useState<Scene | null>(null);
const [isGenerating, setIsGenerating] = useState(false);
const [filter, setFilter] = useState({ style: 'all', section: 'all' });
```

---

## Error Handling

### Preview Generation Fails
- Show placeholder with retry button
- Fallback to text-based card
- Allow user to proceed anyway

### Scene Validation Errors
- Highlight problematic scenes
- Show clear error messages
- Prevent generation until fixed

### Auto-Save Failures
- Show "Save failed" notification
- Retry automatically
- Cache changes locally

---

## Mobile Considerations

### Responsive Layout
- Stack scene cards vertically on mobile
- Larger touch targets (48px minimum)
- Swipe gestures for navigation
- Simplified scene cards (less metadata shown)
- Bottom sheet for scene editor (not modal)

---

## Success Metrics

Track these metrics:
- Time spent reviewing storyboard
- Number of scenes edited
- Scene edit frequency
- Scenes deleted/added
- Generation success rate after storyboard approval
- User satisfaction with generated scenes

---

## Future Enhancements

### Phase 2
- Video preview (not just thumbnail)
- Audio waveform display
- Transition preview between scenes
- Alternative script versions (A/B test)

### Phase 3
- Templates (pre-built storyboard structures)
- Style transfer (apply style to all scenes)
- Smart suggestions ("Scene 3 could use B-roll")
- Automatic pacing optimization

---

## Notes

- This is the most critical page for user control
- Users must feel confident before clicking "Generate"
- Preview quality directly impacts trust
- Make editing feel fast and responsive
- Auto-save everything (never lose work)
- Clear visual feedback at all times




