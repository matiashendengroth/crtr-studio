# CRTR Studio - Storyboard Page Design

**Inspired by:** LTX Studio storyboard interface  
**Purpose:** Review, edit, and approve AI-generated scenes before video generation

---

## Layout Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  Navbar (persistent)                                             │
├──────────────┬──────────────────────────────────────────────────┤
│              │  Top Action Bar                                   │
│              ├──────────────────────────────────────────────────┤
│              │                                                   │
│   Section    │         Scene Grid (main area)                   │
│  Navigator   │                                                   │
│   (sidebar)  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐                    │
│              │  │ S1 │ │ S2 │ │ S3 │ │ S4 │                    │
│              │  └────┘ └────┘ └────┘ └────┘                    │
│              │  ┌────┐ ┌────┐ ┌────┐ ┌────┐                    │
│              │  │ S5 │ │ S6 │ │ S7 │ │ S8 │                    │
│              │  └────┘ └────┘ └────┘ └────┘                    │
│              │                                                   │
└──────────────┴──────────────────────────────────────────────────┘
```

---

## Color Scheme (Dark Mode)

```css
/* Same as front page */
--background: #0a0a0a;
--surface: #151515;
--surface-elevated: #1f1f1f;
--border: #2a2a2a;

/* Shot Type Colors */
--shot-ai-video: #6366f1;        /* Indigo */
--shot-image-effect: #8b5cf6;    /* Purple */
--shot-motion-graphic: #ec4899;  /* Pink */

/* Status Colors */
--status-pending: #f59e0b;       /* Amber */
--status-generating: #3b82f6;    /* Blue */
--status-complete: #22c55e;      /* Green */
--status-failed: #ef4444;        /* Red */
```

---

## 1. Top Action Bar

```
┌──────────────────────────────────────────────────────────┐
│  ← Back     Documentary Title      [Save] [Generate All] │
└──────────────────────────────────────────────────────────┘
```

**Specifications:**
- Height: `64px`
- Background: `var(--surface)`
- Border bottom: `1px solid var(--border)`
- Padding: `px-6`
- Position: `sticky top-0`

**Elements:**

```tsx
// Back Button
<button className="
  flex items-center gap-2
  px-4 py-2 rounded-lg
  text-secondary hover:text-primary
  hover:bg-surface-elevated
  transition-all duration-200
">
  <ChevronLeft size={20} />
  Back
</button>

// Title (editable)
<h1 className="
  text-xl font-semibold text-primary
  cursor-pointer hover:text-accent-primary
">
  The History of Black Holes
</h1>

// Save Button
<button className="
  px-4 py-2 rounded-lg
  border border-border
  text-secondary hover:text-primary
  hover:border-accent-primary
  transition-all duration-200
">
  Save Draft
</button>

// Generate All Button (primary CTA)
<button className="
  px-6 py-2 rounded-lg
  bg-gradient-to-r from-indigo-600 to-purple-600
  hover:from-indigo-500 hover:to-purple-500
  text-white font-medium
  shadow-lg shadow-accent-glow
  transition-all duration-200
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Generate All Videos →
</button>
```

---

## 2. Section Navigator (Left Sidebar)

```
┌─────────────────────┐
│  Sections           │
├─────────────────────┤
│                     │
│ ○ Introduction      │
│   8 scenes          │
│   ■■■■■■□□          │
│                     │
│ ● Origins           │ ← Active
│   12 scenes         │
│   ■■■■■■■■■□□□      │
│                     │
│ ○ Modern Era        │
│   15 scenes         │
│   ■■■□□□□□□□□□□□□  │
│                     │
│ ○ Future            │
│   10 scenes         │
│   □□□□□□□□□□        │
│                     │
│ + Add Section       │
│                     │
└─────────────────────┘
```

**Specifications:**
- Width: `280px`
- Background: `var(--surface)`
- Border right: `1px solid var(--border)`
- Fixed position, full height

**Section Item:**

```tsx
<button className={`
  w-full p-4 rounded-lg
  text-left transition-all duration-200
  ${isActive 
    ? 'bg-surface-elevated border-l-2 border-accent-primary' 
    : 'hover:bg-surface-elevated'
  }
`}>
  {/* Radio indicator */}
  <div className="flex items-center gap-3 mb-2">
    <div className={`
      w-4 h-4 rounded-full border-2
      ${isActive 
        ? 'border-accent-primary bg-accent-primary' 
        : 'border-border'
      }
    `}>
      {isActive && <div className="w-2 h-2 rounded-full bg-white m-auto" />}
    </div>
    <span className="font-medium text-primary">Introduction</span>
  </div>
  
  {/* Scene count */}
  <div className="text-sm text-secondary mb-2 ml-7">
    8 scenes
  </div>
  
  {/* Progress bar */}
  <div className="ml-7 h-1.5 bg-surface-elevated rounded-full overflow-hidden">
    <div 
      className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
      style={{ width: '75%' }}
    />
  </div>
</button>
```

---

## 3. Scene Grid (Main Area)

**Grid Layout:**
- 4 columns on desktop (`grid-cols-4`)
- 3 columns on tablet (`md:grid-cols-3`)
- 2 columns on mobile (`sm:grid-cols-2`)
- Gap: `gap-6`
- Padding: `p-6`

---

## 4. Scene Card

```
┌─────────────────────────┐
│ Scene 3.2      [badge]  │ ← Header
├─────────────────────────┤
│                         │
│    [Preview Image]      │ ← 16:9 thumbnail
│                         │
├─────────────────────────┤
│ ⚡ AI Video             │ ← Shot type
│ ⏱️ 18s                  │ ← Duration
│ ✓ Ready                 │ ← Status
├─────────────────────────┤
│ "In 2019, humanity..."  │ ← Narration preview
├─────────────────────────┤
│ [Edit] [🎵] [Regenerate]│ ← Actions
└─────────────────────────┘
```

**Implementation:**

```tsx
<div className={`
  group relative
  rounded-xl overflow-hidden
  bg-surface border
  transition-all duration-300
  hover:shadow-xl hover:shadow-accent-glow
  ${isSelected ? 'border-accent-primary border-2' : 'border-border'}
  ${isDragging ? 'opacity-50 scale-95' : ''}
`}>
  
  {/* Header */}
  <div className="p-3 flex items-center justify-between bg-surface-elevated">
    <span className="text-sm font-medium text-secondary">
      Scene {scene.number}
    </span>
    
    {/* Shot Type Badge */}
    <Badge shotType={scene.shotType} />
  </div>
  
  {/* Preview Image */}
  <div className="relative aspect-video bg-black overflow-hidden">
    {scene.startingFrameUrl ? (
      <>
        <img 
          src={scene.startingFrameUrl}
          alt={`Scene ${scene.number}`}
          className="w-full h-full object-cover"
        />
        
        {/* Hover overlay */}
        <div className="
          absolute inset-0
          bg-black/60 opacity-0 group-hover:opacity-100
          flex items-center justify-center
          transition-opacity duration-200
        ">
          <button className="
            p-3 rounded-full
            bg-white/20 backdrop-blur-sm
            hover:bg-white/30
            transition-all duration-200
          ">
            <Play size={24} className="text-white" />
          </button>
        </div>
      </>
    ) : (
      // Loading state
      <div className="w-full h-full flex items-center justify-center">
        <Loader className="animate-spin text-accent-primary" size={32} />
        <span className="ml-2 text-sm text-secondary">Generating...</span>
      </div>
    )}
  </div>
  
  {/* Metadata */}
  <div className="p-3 space-y-2">
    {/* Shot Type */}
    <div className="flex items-center gap-2 text-sm">
      <ShotTypeIcon type={scene.shotType} />
      <span className="text-secondary">{scene.shotTypeName}</span>
    </div>
    
    {/* Duration */}
    <div className="flex items-center gap-2 text-sm">
      <Clock size={14} className="text-secondary" />
      <span className="text-secondary">{scene.duration}s</span>
    </div>
    
    {/* Status */}
    <div className="flex items-center gap-2 text-sm">
      <StatusIcon status={scene.status} />
      <span className={getStatusColor(scene.status)}>
        {scene.statusText}
      </span>
    </div>
  </div>
  
  {/* Narration Preview */}
  <div className="px-3 pb-3">
    <p className="text-sm text-secondary line-clamp-2">
      {scene.narration}
    </p>
  </div>
  
  {/* Actions */}
  <div className="p-3 pt-0 flex items-center gap-2">
    <button className="
      flex-1 px-3 py-1.5 rounded-lg
      bg-surface-elevated border border-border
      text-sm text-secondary hover:text-primary
      hover:border-accent-primary
      transition-all duration-200
    ">
      Edit
    </button>
    
    {/* Audio preview button */}
    {scene.audioUrl && (
      <button className="
        p-1.5 rounded-lg
        bg-surface-elevated border border-border
        hover:border-accent-primary
        transition-all duration-200
      ">
        <Volume2 size={16} className="text-secondary" />
      </button>
    )}
    
    {/* Regenerate button */}
    <button className="
      p-1.5 rounded-lg
      bg-surface-elevated border border-border
      hover:border-accent-primary
      transition-all duration-200
    ">
      <RefreshCw size={16} className="text-secondary" />
    </button>
  </div>
  
  {/* Drag handle (appears on hover) */}
  <div className="
    absolute top-3 right-3
    opacity-0 group-hover:opacity-100
    transition-opacity duration-200
  ">
    <GripVertical size={20} className="text-secondary cursor-move" />
  </div>
</div>
```

---

## 5. Shot Type Badge

```tsx
const ShotTypeBadge = ({ shotType }: { shotType: ShotType }) => {
  const config = {
    AI_VIDEO: {
      color: 'from-indigo-600 to-blue-600',
      icon: '🎬',
      label: 'AI Video'
    },
    IMAGE_EFFECT: {
      color: 'from-purple-600 to-pink-600',
      icon: '🖼️',
      label: 'Image Effect'
    },
    MOTION_GRAPHIC: {
      color: 'from-pink-600 to-rose-600',
      icon: '📊',
      label: 'Motion Graphic'
    }
  };
  
  const { color, icon, label } = config[shotType];
  
  return (
    <div className={`
      inline-flex items-center gap-1.5
      px-2 py-1 rounded-md
      bg-gradient-to-r ${color}
      text-xs font-medium text-white
    `}>
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
};
```

---

## 6. Scene Editor Modal

Opens when clicking "Edit" on a scene card:

```
┌──────────────────────────────────────────────────────┐
│  Edit Scene 3.2                                 [X]  │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Shot Type                                           │
│  ○ AI Video  ● Image Effect  ○ Motion Graphic       │
│                                                       │
│  Duration                                            │
│  [====●===================] 18 seconds               │
│                                                       │
│  Narration                                           │
│  ┌─────────────────────────────────────────────────┐│
│  │ In 2019, humanity captured the first image...  ││
│  │                                                 ││
│  │                                                 ││
│  └─────────────────────────────────────────────────┘│
│  [🎵 Preview Audio]                                  │
│                                                       │
│  Visual Prompt (AI Video only)                       │
│  ┌─────────────────────────────────────────────────┐│
│  │ Orange glowing ring of black hole M87...       ││
│  └─────────────────────────────────────────────────┘│
│                                                       │
│  Starting Frame                                      │
│  ┌─────────────────────┐                            │
│  │   [Preview Image]   │  [Regenerate] [Upload]     │
│  └─────────────────────┘                            │
│                                                       │
│  ────────────────────────────────────────────────    │
│                          [Cancel]  [Save Changes]    │
└──────────────────────────────────────────────────────┘
```

**Modal Specifications:**

```tsx
<Dialog className="
  max-w-3xl w-full
  bg-surface-elevated rounded-2xl
  border border-border
  shadow-2xl
">
  {/* Header */}
  <div className="
    flex items-center justify-between
    p-6 border-b border-border
  ">
    <h2 className="text-2xl font-semibold text-primary">
      Edit Scene {scene.number}
    </h2>
    <button className="
      p-2 rounded-lg
      text-secondary hover:text-primary
      hover:bg-surface
      transition-all duration-200
    ">
      <X size={20} />
    </button>
  </div>
  
  {/* Content */}
  <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
    {/* Shot Type Selector */}
    <div>
      <label className="block text-sm font-medium text-primary mb-3">
        Shot Type
      </label>
      <div className="flex gap-3">
        {shotTypes.map(type => (
          <button className={`
            flex-1 p-4 rounded-xl
            border-2 transition-all duration-200
            ${selected === type
              ? 'border-accent-primary bg-accent-primary/10'
              : 'border-border hover:border-accent-primary/50'
            }
          `}>
            <div className="text-2xl mb-2">{type.icon}</div>
            <div className="font-medium text-primary">{type.label}</div>
          </button>
        ))}
      </div>
    </div>
    
    {/* Duration Slider */}
    <div>
      <label className="block text-sm font-medium text-primary mb-3">
        Duration
      </label>
      <input 
        type="range"
        min="5"
        max="60"
        className="w-full accent-accent-primary"
      />
      <div className="text-right text-sm text-secondary mt-1">
        {duration} seconds
      </div>
    </div>
    
    {/* Narration Textarea */}
    <div>
      <label className="block text-sm font-medium text-primary mb-3">
        Narration
      </label>
      <textarea 
        rows={4}
        className="
          w-full px-4 py-3 rounded-xl
          bg-surface border border-border
          text-primary placeholder:text-secondary
          focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20
          transition-all duration-200
        "
        placeholder="Enter narration text..."
      />
      <button className="
        mt-2 px-4 py-2 rounded-lg
        bg-surface-elevated border border-border
        text-sm text-secondary hover:text-primary
        hover:border-accent-primary
        transition-all duration-200
      ">
        <Volume2 size={16} className="inline mr-2" />
        Preview Audio
      </button>
    </div>
    
    {/* Visual Prompt (conditional) */}
    {shotType === 'AI_VIDEO' && (
      <div>
        <label className="block text-sm font-medium text-primary mb-3">
          Visual Prompt
        </label>
        <textarea 
          rows={3}
          className="
            w-full px-4 py-3 rounded-xl
            bg-surface border border-border
            text-primary placeholder:text-secondary
            focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20
            transition-all duration-200
          "
          placeholder="Describe the visual scene..."
        />
      </div>
    )}
    
    {/* Starting Frame */}
    <div>
      <label className="block text-sm font-medium text-primary mb-3">
        Starting Frame
      </label>
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <img 
            src={scene.startingFrameUrl}
            alt="Starting frame"
            className="w-64 aspect-video object-cover rounded-lg border border-border"
          />
        </div>
        <div className="flex flex-col gap-2">
          <button className="
            px-4 py-2 rounded-lg
            bg-surface-elevated border border-border
            text-sm text-secondary hover:text-primary
            hover:border-accent-primary
            transition-all duration-200
          ">
            <RefreshCw size={16} className="inline mr-2" />
            Regenerate
          </button>
          <button className="
            px-4 py-2 rounded-lg
            bg-surface-elevated border border-border
            text-sm text-secondary hover:text-primary
            hover:border-accent-primary
            transition-all duration-200
          ">
            <Upload size={16} className="inline mr-2" />
            Upload Custom
          </button>
        </div>
      </div>
    </div>
  </div>
  
  {/* Footer */}
  <div className="
    flex items-center justify-end gap-3
    p-6 border-t border-border
  ">
    <button className="
      px-6 py-2 rounded-lg
      text-secondary hover:text-primary
      hover:bg-surface
      transition-all duration-200
    ">
      Cancel
    </button>
    <button className="
      px-6 py-2 rounded-lg
      bg-gradient-to-r from-indigo-600 to-purple-600
      hover:from-indigo-500 hover:to-purple-500
      text-white font-medium
      shadow-lg shadow-accent-glow
      transition-all duration-200
    ">
      Save Changes
    </button>
  </div>
</Dialog>
```

---

## 7. Bulk Actions Bar

Appears when scenes are selected:

```
┌──────────────────────────────────────────────────────┐
│  12 scenes selected     [Delete] [Change Type] [Move]│
└──────────────────────────────────────────────────────┘
```

**Specifications:**
- Position: `fixed bottom-6 left-1/2 -translate-x-1/2`
- Background: `var(--surface-elevated)` with backdrop blur
- Border: `1px solid var(--border)`
- Border radius: `rounded-xl`
- Padding: `px-6 py-4`
- Shadow: `shadow-2xl`
- Animation: Slide up from bottom

---

## 8. Empty State

When no scenes generated yet:

```
┌──────────────────────────────────────────────────────┐
│                                                       │
│                      📋                               │
│                                                       │
│              Generating Scenes...                     │
│                                                       │
│    AI is analyzing your script and creating scenes   │
│              This will take ~30 seconds               │
│                                                       │
│    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░ 65%                        │
│                                                       │
└──────────────────────────────────────────────────────┘
```

---

## 9. Drag & Drop

**Visual Feedback:**
```tsx
// Drag source (being dragged)
className="opacity-50 scale-95 cursor-grabbing"

// Drop target (valid)
className="border-2 border-dashed border-accent-primary bg-accent-primary/10"

// Drop target (invalid)
className="border-2 border-dashed border-red-500 bg-red-500/10"

// Drag preview (follows cursor)
<div className="
  fixed pointer-events-none
  opacity-80 rotate-3 scale-110
  shadow-2xl
">
  {/* Scene card preview */}
</div>
```

---

## 10. Keyboard Shortcuts

Display in bottom-right corner (toggleable):

```
┌──────────────────────┐
│  Keyboard Shortcuts  │
├──────────────────────┤
│  ⌘ S    Save         │
│  ⌘ G    Generate All │
│  E      Edit Scene   │
│  Space  Preview      │
│  Del    Delete       │
│  ⌘ Z    Undo         │
│  ⌘ Y    Redo         │
│  ?      Help         │
└──────────────────────┘
```

---

## Responsive Behavior

### **Desktop (1280px+)**
- 4-column scene grid
- Sidebar always visible
- All features accessible

### **Tablet (768px - 1279px)**
- 3-column scene grid
- Collapsible sidebar
- Compact action buttons

### **Mobile (< 768px)**
- 1-column scene grid (full width cards)
- Sidebar in drawer (hamburger menu)
- Bottom action sheet for scene actions
- Swipe gestures for navigation

---

## Performance Optimizations

1. **Virtual Scrolling**: Only render visible scene cards
2. **Lazy Loading**: Load images as they enter viewport
3. **Debounced Search**: Wait 300ms before filtering
4. **Optimistic Updates**: Immediate UI feedback, sync in background
5. **Cached Thumbnails**: Store in browser cache
6. **Skeleton Loaders**: Show while data loading

---

This storyboard interface gives users complete control before expensive video generation, following LTX Studio's proven patterns while maintaining CRTR Studio's dark aesthetic.



