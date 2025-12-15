# CRTR Studio - Timeline Editor Design

**Inspired by:** LTX Studio timeline + DaVinci Resolve + Premiere Pro  
**Purpose:** Preview documentary, regenerate scenes, fine-tune timing, export

---

## Layout Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Navbar (persistent)                                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│           Video Preview Area (center)                        │
│                                                              │
│           ┌────────────────────────────┐                    │
│           │                             │                    │
│           │    Video Player             │                    │
│           │                             │                    │
│           └────────────────────────────┘                    │
│           [◀] [▶] [⏸️] ──●──────── 00:03:45 / 00:15:30     │
│                                                              │
├────────────────────────────────────┬────────────────────────┤
│                                    │                         │
│  Timeline (multi-track)            │  Scene Inspector       │
│                                    │  (right panel)         │
│  Video    [S1][S2][S3][S4]        │                         │
│  Audio    ━━━━━━━━━━━━━━━━        │  Scene 3.2             │
│  Graphics [  ][  ]                 │  ─────────────         │
│                                    │  [Regenerate]          │
│                                    │                         │
└────────────────────────────────────┴────────────────────────┘
```

---

## 1. Top Action Bar

```
┌──────────────────────────────────────────────────────────┐
│  ← Back   The History of Black Holes   [Save] [Export]  │
└──────────────────────────────────────────────────────────┘
```

**Same as storyboard page** - refer to storyboard design doc.

---

## 2. Video Preview Area

```
┌──────────────────────────────────────────────────────────┐
│                                                           │
│              ┌─────────────────────────┐                 │
│              │                          │                 │
│              │                          │                 │
│              │    Video Player          │                 │
│              │    (16:9 ratio)          │                 │
│              │                          │                 │
│              │                          │                 │
│              └─────────────────────────┘                 │
│                                                           │
│  [◀10s] [▶︎] [⏸️] [▶10s]                               │
│  ──────●─────────────────────────────────────           │
│  00:03:45 / 00:15:30              [🔊 50%] [⚙️] [⛶]    │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

**Specifications:**

```tsx
<div className="
  flex flex-col items-center justify-center
  h-[60vh] px-8 py-6
  bg-black/50
">
  {/* Video Player */}
  <div className="
    relative w-full max-w-5xl
    aspect-video
    bg-black rounded-xl overflow-hidden
    shadow-2xl shadow-black/50
  ">
    <video 
      ref={videoRef}
      className="w-full h-full"
      src={currentVideoUrl}
    />
    
    {/* Overlay controls (appear on hover) */}
    <div className="
      absolute inset-0
      bg-gradient-to-t from-black/80 via-transparent to-transparent
      opacity-0 hover:opacity-100
      transition-opacity duration-200
    ">
      {/* Scene markers */}
      {scenes.map(scene => (
        <div 
          key={scene.id}
          className="
            absolute bottom-16
            w-px h-8 bg-white/50
          "
          style={{ left: `${(scene.startTime / totalDuration) * 100}%` }}
        />
      ))}
    </div>
  </div>
  
  {/* Controls */}
  <div className="w-full max-w-5xl mt-6">
    {/* Playback Controls */}
    <div className="flex items-center justify-center gap-4 mb-4">
      {/* Skip back */}
      <button className="
        p-3 rounded-full
        bg-surface-elevated border border-border
        text-secondary hover:text-primary
        hover:border-accent-primary
        transition-all duration-200
      ">
        <SkipBack size={20} />
      </button>
      
      {/* Play/Pause */}
      <button className="
        p-4 rounded-full
        bg-gradient-to-r from-indigo-600 to-purple-600
        hover:from-indigo-500 hover:to-purple-500
        text-white
        shadow-lg shadow-accent-glow
        transition-all duration-200
        hover:scale-110
      ">
        {isPlaying ? <Pause size={28} /> : <Play size={28} />}
      </button>
      
      {/* Skip forward */}
      <button className="
        p-3 rounded-full
        bg-surface-elevated border border-border
        text-secondary hover:text-primary
        hover:border-accent-primary
        transition-all duration-200
      ">
        <SkipForward size={20} />
      </button>
    </div>
    
    {/* Progress Bar */}
    <div className="relative h-2 bg-surface-elevated rounded-full overflow-hidden group cursor-pointer">
      {/* Loaded buffer */}
      <div 
        className="absolute h-full bg-border"
        style={{ width: `${bufferedPercent}%` }}
      />
      
      {/* Played progress */}
      <div 
        className="absolute h-full bg-gradient-to-r from-indigo-600 to-purple-600"
        style={{ width: `${playedPercent}%` }}
      />
      
      {/* Scrubber handle */}
      <div 
        className="
          absolute top-1/2 -translate-y-1/2
          w-4 h-4 rounded-full
          bg-white shadow-lg
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
        "
        style={{ left: `calc(${playedPercent}% - 8px)` }}
      />
    </div>
    
    {/* Time + Settings */}
    <div className="flex items-center justify-between mt-3">
      <span className="text-sm font-mono text-secondary">
        {formatTime(currentTime)} / {formatTime(totalDuration)}
      </span>
      
      <div className="flex items-center gap-4">
        {/* Volume */}
        <div className="flex items-center gap-2">
          <button className="text-secondary hover:text-primary">
            <Volume2 size={18} />
          </button>
          <input 
            type="range"
            min="0"
            max="100"
            value={volume}
            className="w-20 accent-accent-primary"
          />
          <span className="text-xs text-secondary w-8">{volume}%</span>
        </div>
        
        {/* Playback speed */}
        <button className="
          px-2 py-1 rounded
          text-xs font-medium text-secondary
          hover:text-primary hover:bg-surface-elevated
          transition-all duration-200
        ">
          {playbackSpeed}×
        </button>
        
        {/* Settings */}
        <button className="
          p-2 rounded
          text-secondary hover:text-primary
          hover:bg-surface-elevated
          transition-all duration-200
        ">
          <Settings size={18} />
        </button>
        
        {/* Fullscreen */}
        <button className="
          p-2 rounded
          text-secondary hover:text-primary
          hover:bg-surface-elevated
          transition-all duration-200
        ">
          <Maximize size={18} />
        </button>
      </div>
    </div>
  </div>
</div>
```

---

## 3. Timeline Editor (Bottom Panel)

```
┌──────────────────────────────────────────────────────────┐
│  Timeline Controls                                       │
│  [Fit] [🔍+] [🔍-] [Snap ✓]          00:00:00           │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Video    [Scene 1][Scene 2][Scene 3][Scene 4]...       │
│  ─────────────────────────────────────────────────────   │
│                                                           │
│  Audio    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │
│  ─────────────────────────────────────────────────────   │
│                                                           │
│  Graphics [Title]      [Lower Third]                     │
│  ─────────────────────────────────────────────────────   │
│                                                           │
│           ▲ Playhead                                     │
└──────────────────────────────────────────────────────────┘
```

**Layout:**
- Height: `40vh`
- Scrollable horizontally
- 3 tracks stacked vertically
- Zoom level adjustable (10s to full timeline)

---

### **3.1 Timeline Controls**

```tsx
<div className="
  flex items-center justify-between
  px-6 py-3
  bg-surface border-b border-border
">
  {/* Left controls */}
  <div className="flex items-center gap-2">
    {/* Fit to view */}
    <button className="
      px-3 py-1.5 rounded-lg
      text-xs font-medium
      bg-surface-elevated border border-border
      text-secondary hover:text-primary
      hover:border-accent-primary
      transition-all duration-200
    ">
      Fit
    </button>
    
    {/* Zoom out */}
    <button className="
      p-1.5 rounded-lg
      bg-surface-elevated border border-border
      text-secondary hover:text-primary
      hover:border-accent-primary
      transition-all duration-200
    ">
      <ZoomOut size={16} />
    </button>
    
    {/* Zoom slider */}
    <input 
      type="range"
      min="1"
      max="100"
      value={zoomLevel}
      className="w-32 accent-accent-primary"
    />
    
    {/* Zoom in */}
    <button className="
      p-1.5 rounded-lg
      bg-surface-elevated border border-border
      text-secondary hover:text-primary
      hover:border-accent-primary
      transition-all duration-200
    ">
      <ZoomIn size={16} />
    </button>
    
    {/* Snap to grid */}
    <button className={`
      px-3 py-1.5 rounded-lg
      text-xs font-medium
      border transition-all duration-200
      ${snapEnabled
        ? 'bg-accent-primary border-accent-primary text-white'
        : 'bg-surface-elevated border-border text-secondary hover:text-primary'
      }
    `}>
      Snap {snapEnabled && '✓'}
    </button>
  </div>
  
  {/* Center - current time */}
  <div className="
    px-4 py-1.5 rounded-lg
    bg-surface-elevated border border-border
    font-mono text-sm text-primary
  ">
    {formatTime(currentTime)}
  </div>
  
  {/* Right controls */}
  <div className="flex items-center gap-2">
    {/* Undo */}
    <button className="
      p-1.5 rounded-lg
      bg-surface-elevated border border-border
      text-secondary hover:text-primary
      hover:border-accent-primary
      transition-all duration-200
      disabled:opacity-50 disabled:cursor-not-allowed
    ">
      <Undo size={16} />
    </button>
    
    {/* Redo */}
    <button className="
      p-1.5 rounded-lg
      bg-surface-elevated border border-border
      text-secondary hover:text-primary
      hover:border-accent-primary
      transition-all duration-200
      disabled:opacity-50 disabled:cursor-not-allowed
    ">
      <Redo size={16} />
    </button>
  </div>
</div>
```

---

### **3.2 Video Track**

```tsx
<div className="relative h-24 bg-surface border-b border-border">
  {/* Track label */}
  <div className="
    absolute left-0 top-0 bottom-0 w-20
    flex items-center justify-center
    bg-surface-elevated border-r border-border
    text-xs font-medium text-secondary
  ">
    Video
  </div>
  
  {/* Track content */}
  <div className="ml-20 relative h-full overflow-x-auto overflow-y-hidden">
    {/* Time markers (top) */}
    <div className="absolute top-0 left-0 right-0 h-6 flex">
      {timeMarkers.map((time, i) => (
        <div 
          key={i}
          className="relative"
          style={{ left: `${(time / totalDuration) * 100}%` }}
        >
          <div className="absolute -translate-x-1/2">
            <div className="w-px h-2 bg-border" />
            <span className="text-xs text-secondary">{formatTime(time)}</span>
          </div>
        </div>
      ))}
    </div>
    
    {/* Scene clips */}
    <div className="absolute top-6 left-0 right-0 bottom-0 flex">
      {scenes.map((scene, i) => (
        <div
          key={scene.id}
          className={`
            relative group
            h-full border-r-2 border-black
            cursor-pointer
            ${selectedScene?.id === scene.id 
              ? 'ring-2 ring-accent-primary' 
              : ''
            }
          `}
          style={{ 
            width: `${(scene.duration / totalDuration) * 100}%`,
            background: getSceneColor(scene.shotType)
          }}
          onClick={() => selectScene(scene)}
        >
          {/* Thumbnail */}
          <img 
            src={scene.videoUrl || scene.startingFrameUrl}
            alt={`Scene ${scene.number}`}
            className="w-full h-full object-cover opacity-60"
          />
          
          {/* Overlay info */}
          <div className="
            absolute inset-0
            bg-gradient-to-t from-black/80 via-transparent
            flex flex-col justify-end
            p-2
          ">
            <span className="text-xs font-medium text-white">
              Scene {scene.number}
            </span>
            <span className="text-xs text-white/70">
              {scene.duration}s
            </span>
          </div>
          
          {/* Hover actions */}
          <div className="
            absolute inset-0
            bg-black/60
            flex items-center justify-center gap-2
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
          ">
            <button className="
              p-2 rounded-full
              bg-white/20 backdrop-blur-sm
              hover:bg-white/30
              transition-all duration-200
            ">
              <Play size={16} className="text-white" />
            </button>
            <button className="
              p-2 rounded-full
              bg-white/20 backdrop-blur-sm
              hover:bg-white/30
              transition-all duration-200
            ">
              <RefreshCw size={16} className="text-white" />
            </button>
          </div>
          
          {/* Resize handles */}
          <div className="
            absolute left-0 top-0 bottom-0 w-2
            cursor-ew-resize
            bg-accent-primary/0 hover:bg-accent-primary/50
            transition-colors duration-200
          " />
          <div className="
            absolute right-0 top-0 bottom-0 w-2
            cursor-ew-resize
            bg-accent-primary/0 hover:bg-accent-primary/50
            transition-colors duration-200
          " />
        </div>
      ))}
    </div>
  </div>
</div>
```

**Scene Colors by Shot Type:**
```tsx
const getSceneColor = (shotType: ShotType) => {
  const colors = {
    AI_VIDEO: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    IMAGE_EFFECT: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    MOTION_GRAPHIC: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
  };
  return colors[shotType];
};
```

---

### **3.3 Audio Track (Narration)**

```tsx
<div className="relative h-20 bg-surface border-b border-border">
  {/* Track label */}
  <div className="
    absolute left-0 top-0 bottom-0 w-20
    flex items-center justify-center
    bg-surface-elevated border-r border-border
    text-xs font-medium text-secondary
  ">
    Audio
  </div>
  
  {/* Waveform visualization */}
  <div className="ml-20 relative h-full">
    <canvas 
      ref={waveformRef}
      className="w-full h-full"
      style={{ 
        background: 'linear-gradient(180deg, #151515 0%, #0a0a0a 100%)' 
      }}
    />
    
    {/* Audio chunks (overlay) */}
    {scenes.map(scene => (
      <div
        key={scene.id}
        className="
          absolute top-0 bottom-0
          border-x border-border/30
        "
        style={{
          left: `${(scene.startTime / totalDuration) * 100}%`,
          width: `${(scene.duration / totalDuration) * 100}%`
        }}
      >
        {/* Mini waveform for this chunk */}
        <div className="w-full h-full flex items-center justify-center opacity-50">
          <svg className="w-full h-12" viewBox="0 0 100 40">
            {/* Simplified waveform bars */}
            {Array.from({ length: 50 }).map((_, i) => (
              <rect
                key={i}
                x={i * 2}
                y={20 - Math.random() * 15}
                width={1.5}
                height={Math.random() * 30}
                fill="#6366f1"
                opacity={0.7}
              />
            ))}
          </svg>
        </div>
      </div>
    ))}
  </div>
</div>
```

---

### **3.4 Graphics Track (Motion Graphics Placeholders)**

```tsx
<div className="relative h-16 bg-surface">
  {/* Track label */}
  <div className="
    absolute left-0 top-0 bottom-0 w-20
    flex items-center justify-center
    bg-surface-elevated border-r border-border
    text-xs font-medium text-secondary
  ">
    Graphics
  </div>
  
  {/* Graphic elements */}
  <div className="ml-20 relative h-full">
    {motionGraphics.map(graphic => (
      <div
        key={graphic.id}
        className="
          absolute top-1/2 -translate-y-1/2
          h-12 px-3 rounded-lg
          bg-gradient-to-r from-pink-600 to-rose-600
          border border-pink-500
          flex items-center gap-2
          cursor-move
          hover:shadow-lg hover:shadow-pink-500/50
          transition-all duration-200
        "
        style={{
          left: `${(graphic.startTime / totalDuration) * 100}%`,
          width: `${(graphic.duration / totalDuration) * 100}%`
        }}
      >
        <FileText size={14} className="text-white" />
        <span className="text-xs font-medium text-white truncate">
          {graphic.description}
        </span>
      </div>
    ))}
    
    {/* Add graphic button */}
    <button className="
      absolute right-4 top-1/2 -translate-y-1/2
      p-2 rounded-lg
      bg-surface-elevated border border-dashed border-border
      text-secondary hover:text-primary
      hover:border-accent-primary
      transition-all duration-200
    ">
      <Plus size={16} />
    </button>
  </div>
</div>
```

---

### **3.5 Playhead**

```tsx
<div 
  className="
    absolute top-0 bottom-0
    w-px bg-red-500
    z-50
    pointer-events-none
  "
  style={{ left: `${(currentTime / totalDuration) * 100}%` }}
>
  {/* Top handle */}
  <div className="
    absolute -top-1 left-1/2 -translate-x-1/2
    w-3 h-3 rounded-full
    bg-red-500 border-2 border-background
  " />
  
  {/* Bottom handle */}
  <div className="
    absolute -bottom-1 left-1/2 -translate-x-1/2
    w-3 h-3 rounded-full
    bg-red-500 border-2 border-background
  " />
</div>
```

---

## 4. Scene Inspector (Right Panel)

```
┌──────────────────────────┐
│  Scene 3.2               │
├──────────────────────────┤
│  [Thumbnail]             │
│                          │
│  ⚡ AI Video • 18s       │
│  ✓ Generated             │
│                          │
│  Narration:              │
│  "In 2019, humanity..."  │
│  [🎵 Play Audio]         │
│                          │
│  Visual Prompt:          │
│  "Orange glowing ring..."│
│                          │
│  ────────────────────    │
│  [Regenerate Video]      │
│  [Edit Scene]            │
│  [Delete Scene]          │
│                          │
│  Generation History      │
│  • v3 (current) 2m ago   │
│  • v2 (previous) 5m ago  │
│  • v1 (original) 10m ago │
│                          │
└──────────────────────────┘
```

**Implementation:**

```tsx
<div className="
  w-80 h-full
  bg-surface border-l border-border
  overflow-y-auto
">
  {selectedScene ? (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-primary mb-2">
          Scene {selectedScene.number}
        </h3>
        <ShotTypeBadge shotType={selectedScene.shotType} />
      </div>
      
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
        <img 
          src={selectedScene.videoUrl || selectedScene.startingFrameUrl}
          alt={`Scene ${selectedScene.number}`}
          className="w-full h-full object-cover"
        />
        <button className="
          absolute inset-0
          flex items-center justify-center
          bg-black/40 opacity-0 hover:opacity-100
          transition-opacity duration-200
        ">
          <Play size={32} className="text-white" />
        </button>
      </div>
      
      {/* Metadata */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-secondary" />
          <span className="text-secondary">{selectedScene.duration}s</span>
        </div>
        <div className="flex items-center gap-2">
          <StatusIcon status={selectedScene.status} />
          <span className={getStatusColor(selectedScene.status)}>
            {selectedScene.statusText}
          </span>
        </div>
      </div>
      
      {/* Narration */}
      <div>
        <label className="block text-sm font-medium text-primary mb-2">
          Narration
        </label>
        <p className="text-sm text-secondary mb-3">
          {selectedScene.narration}
        </p>
        <button className="
          w-full px-4 py-2 rounded-lg
          bg-surface-elevated border border-border
          text-sm text-secondary hover:text-primary
          hover:border-accent-primary
          transition-all duration-200
        ">
          <Volume2 size={16} className="inline mr-2" />
          Play Audio
        </button>
      </div>
      
      {/* Visual Prompt */}
      {selectedScene.shotType === 'AI_VIDEO' && (
        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Visual Prompt
          </label>
          <p className="text-sm text-secondary">
            {selectedScene.visualPrompt}
          </p>
        </div>
      )}
      
      {/* Actions */}
      <div className="space-y-2">
        <button className="
          w-full px-4 py-3 rounded-lg
          bg-gradient-to-r from-indigo-600 to-purple-600
          hover:from-indigo-500 hover:to-purple-500
          text-white font-medium
          shadow-lg shadow-accent-glow
          transition-all duration-200
        ">
          <RefreshCw size={16} className="inline mr-2" />
          Regenerate Video
        </button>
        
        <button className="
          w-full px-4 py-2 rounded-lg
          bg-surface-elevated border border-border
          text-secondary hover:text-primary
          hover:border-accent-primary
          transition-all duration-200
        ">
          <Edit size={16} className="inline mr-2" />
          Edit Scene
        </button>
        
        <button className="
          w-full px-4 py-2 rounded-lg
          bg-surface-elevated border border-red-500/50
          text-red-500 hover:bg-red-500/10
          hover:border-red-500
          transition-all duration-200
        ">
          <Trash2 size={16} className="inline mr-2" />
          Delete Scene
        </button>
      </div>
      
      {/* Generation History */}
      {selectedScene.history && selectedScene.history.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-primary mb-3">
            Generation History
          </label>
          <div className="space-y-2">
            {selectedScene.history.map((version, i) => (
              <button
                key={version.id}
                className={`
                  w-full p-3 rounded-lg
                  text-left transition-all duration-200
                  ${version.isCurrent
                    ? 'bg-accent-primary/10 border border-accent-primary'
                    : 'bg-surface-elevated border border-border hover:border-accent-primary'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-primary">
                    Version {selectedScene.history.length - i}
                    {version.isCurrent && ' (current)'}
                  </span>
                  <span className="text-xs text-secondary">
                    {formatRelativeTime(version.createdAt)}
                  </span>
                </div>
                {!version.isCurrent && (
                  <button className="text-xs text-accent-primary hover:underline">
                    Restore this version
                  </button>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  ) : (
    // No scene selected
    <div className="
      h-full flex flex-col items-center justify-center
      p-6 text-center
    ">
      <Film size={48} className="text-secondary mb-4" />
      <p className="text-sm text-secondary">
        Select a scene from the timeline
        <br />
        to view details and options
      </p>
    </div>
  )}
</div>
```

---

## 5. Export Modal

```
┌──────────────────────────────────────────────────────┐
│  Export to DaVinci Resolve                      [X]  │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Project Name                                        │
│  [The History of Black Holes                    ]   │
│                                                       │
│  Export Format                                       │
│  ○ DaVinci Resolve Project (.drp)                   │
│  ● Final Cut Pro XML + Media  (recommended)         │
│  ○ Premiere Pro XML + Media                         │
│                                                       │
│  What will be exported:                              │
│  ☑ Video clips (22 AI videos)                       │
│  ☑ Images (14 with effect metadata)                 │
│  ☑ Audio (45 narration chunks + combined track)     │
│  ☑ Motion graphics instructions (9 placeholders)    │
│  ☑ Project file with timeline structure             │
│                                                       │
│  Resolution                                          │
│  ○ 1080p (1920x1080)  ● 4K (3840x2160)              │
│                                                       │
│  Estimated Package Size: ~2.4 GB                     │
│                                                       │
│  ─────────────────────────────────────────────────   │
│                          [Cancel]  [Export Package]  │
└──────────────────────────────────────────────────────┘
```

**Progress Modal (after clicking export):**

```
┌──────────────────────────────────────────────────────┐
│  Exporting to DaVinci Resolve                        │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░ 68%                           │
│                                                       │
│  Exporting scene 31 of 45...                         │
│  Estimated time: 2 minutes                           │
│                                                       │
│  ✓ Project file created                              │
│  ✓ Narration audio exported                          │
│  ⏳ Exporting video clips...                         │
│  ⏱️  Creating motion graphics instructions...        │
│                                                       │
└──────────────────────────────────────────────────────┘
```

**Success Modal:**

```
┌──────────────────────────────────────────────────────┐
│  ✅ Export Complete!                                 │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Your project is ready for DaVinci Resolve.          │
│                                                       │
│  Package Size: 2.4 GB                                │
│  Export Time: 3 minutes 45 seconds                   │
│                                                       │
│  [Download Export Package (ZIP)]                     │
│  [View Export Folder]                                │
│                                                       │
│  Next steps:                                          │
│  1. Extract the ZIP file                             │
│  2. Open DaVinci Resolve                             │
│  3. File → Import → Project                          │
│  4. Select the .drp or .xml file                     │
│  5. Add music, color grade, and export!              │
│                                                       │
│                          [Close]  [Start New Project]│
└──────────────────────────────────────────────────────┘
```

---

## 6. Keyboard Shortcuts

Global shortcuts available in timeline:

```
Space         - Play/Pause
←/→           - Frame by frame (1 frame)
⌘/Ctrl + ←/→  - Skip 10 seconds
J/K/L         - Rewind/Pause/Fast-forward
I/O           - Mark in/out points
E             - Edit selected scene
R             - Regenerate selected scene
Del/Backspace - Delete selected scene
⌘/Ctrl + Z    - Undo
⌘/Ctrl + Y    - Redo
⌘/Ctrl + S    - Save
⌘/Ctrl + E    - Export
F             - Fullscreen video
⌘/Ctrl + F    - Fit timeline to view
+/-           - Zoom in/out timeline
⌘/Ctrl + D    - Duplicate scene
⌘/Ctrl + C    - Copy scene
⌘/Ctrl + V    - Paste scene
?             - Show keyboard shortcuts
```

---

## 7. Responsive Behavior

### **Desktop (1280px+)**
- Full layout with all panels
- Scene inspector always visible
- Timeline full height

### **Tablet (768px - 1279px)**
- Scene inspector in slide-out drawer
- Simplified timeline controls
- 2-column time markers

### **Mobile (< 768px)**
- Stack video player above timeline
- Timeline in bottom sheet (swipe up)
- Scene inspector in modal
- Touch gestures for scrubbing

---

## 8. Performance Optimizations

1. **Video Preloading**: Preload next/previous scene clips
2. **Waveform Caching**: Generate waveforms once, cache as image
3. **Virtual Timeline**: Only render visible portion of timeline
4. **Debounced Scrubbing**: Update video every 100ms during scrub
5. **Lazy Scene Loading**: Load scene data as needed
6. **Web Workers**: Process exports in background thread
7. **Progressive Download**: Download export in chunks

---

This timeline editor provides professional video editing capabilities while maintaining the dark, modern aesthetic of CRTR Studio. It's inspired by industry-standard tools but simplified for documentary-specific workflows.



