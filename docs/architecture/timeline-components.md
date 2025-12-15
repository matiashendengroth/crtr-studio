# Timeline Editor - React Component Architecture

Complete technical implementation plan for the timeline editor and shot assembly.

---

## Component Hierarchy

```
TimelineEditorPage
├── VideoPreviewSection
│   ├── VideoPlayer
│   │   ├── VideoElement (HTML5 video or react-player)
│   │   └── PlaybackControls
│   │       ├── PlayPauseButton
│   │       ├── SkipButtons
│   │       ├── ProgressBar
│   │       ├── VolumeControl
│   │       └── SettingsMenu
│   └── QualityToggle
│
├── TimelineSection
│   ├── TimelineControls
│   │   ├── ZoomControls
│   │   ├── SnapToggle
│   │   └── UndoRedoButtons
│   ├── TimelineCanvas
│   │   ├── TimeMarkers
│   │   ├── Playhead
│   │   └── TrackContainer
│   │       ├── VideoTrack
│   │       │   └── SceneClip[]
│   │       ├── AudioTrack
│   │       │   └── WaveformVisualization
│   │       └── GraphicsTrack
│   │           └── MotionGraphicPlaceholder[]
│   └── TimelineScrollContainer
│
├── SceneInspectorPanel
│   ├── SceneDetails
│   ├── ThumbnailPreview
│   ├── NarrationDisplay
│   ├── PromptDisplay
│   ├── ActionButtons
│   │   ├── RegenerateButton
│   │   ├── EditButton
│   │   └── DeleteButton
│   └── GenerationHistory
│
└── ExportModal
    ├── ExportSettings
    ├── FormatSelector
    ├── ResolutionSelector
    └── ExportProgress
```

---

## Core Data Structures

### Timeline State

```typescript
// packages/web/src/hooks/useTimeline.ts

interface TimelineState {
  // Project data
  project: Project;
  scenes: Scene[];
  shots: Shot[];
  
  // Playback state
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  volume: number;
  playbackSpeed: number;
  
  // Timeline UI state
  zoomLevel: number;
  snapEnabled: boolean;
  selectedSceneId: string | null;
  selectedShotId: string | null;
  
  // Video assembly
  assembledVideoUrl: string | null;
  assemblyProgress: number;
}

interface Scene {
  id: string;
  sectionId: string;
  name: string;
  narration: string;
  audioUrl: string;
  duration: number;  // Sum of all shot durations
  shots: Shot[];
  startTime: number; // Calculated position in timeline
}

interface Shot {
  id: string;
  sceneId: string;
  order: number;
  shotType: 'AI_VIDEO' | 'IMAGE_EFFECT' | 'MOTION_GRAPHIC';
  shotAngle: 'WIDE' | 'MEDIUM' | 'CLOSE_UP' | 'DETAIL' | 'B_ROLL';
  source: 'pexels' | 'nasa' | 'fal_ai' | 'user';
  videoUrl?: string;
  imageUrl?: string;
  duration: number;
  visualPrompt: string;
  status: 'PENDING' | 'GENERATING' | 'COMPLETE' | 'FAILED';
  startTime: number; // Position within scene
}
```

---

## Shot Assembly Logic

### Backend Assembly Endpoint

```typescript
// packages/api/src/use-cases/assemble-timeline.use-case.ts

export class AssembleTimelineUseCase {
  /**
   * Assembles all shots into a single playable timeline
   * Returns metadata for frontend to construct video playlist
   */
  async execute(projectId: string): Promise<TimelineAssembly> {
    const project = await this.projectRepository.findById(projectId);
    const scenes = await this.sceneRepository.findByProject(projectId);
    
    // Calculate timeline positions
    let currentTime = 0;
    const timeline: TimelineItem[] = [];
    
    for (const scene of scenes) {
      const shots = await this.shotRepository.findByScene(scene.id);
      
      let sceneStartTime = currentTime;
      
      for (const shot of shots.sort((a, b) => a.order - b.order)) {
        timeline.push({
          type: 'shot',
          shotId: shot.id,
          sceneId: scene.id,
          videoUrl: shot.videoUrl,
          imageUrl: shot.imageUrl,
          duration: shot.duration,
          startTime: currentTime,
          endTime: currentTime + shot.duration,
          shotType: shot.shotType,
          shotAngle: shot.shotAngle,
        });
        
        currentTime += shot.duration;
      }
      
      // Add scene audio (overlays with shots)
      timeline.push({
        type: 'audio',
        sceneId: scene.id,
        audioUrl: scene.audioUrl,
        startTime: sceneStartTime,
        endTime: currentTime,
        duration: currentTime - sceneStartTime,
      });
    }
    
    return {
      projectId,
      totalDuration: currentTime,
      items: timeline,
    };
  }
}

interface TimelineItem {
  type: 'shot' | 'audio';
  shotId?: string;
  sceneId: string;
  videoUrl?: string;
  imageUrl?: string;
  audioUrl?: string;
  duration: number;
  startTime: number;
  endTime: number;
  shotType?: 'AI_VIDEO' | 'IMAGE_EFFECT' | 'MOTION_GRAPHIC';
  shotAngle?: string;
}

interface TimelineAssembly {
  projectId: string;
  totalDuration: number;
  items: TimelineItem[];
}
```

---

## Frontend Video Playback

### Multi-Shot Video Player

```typescript
// packages/web/src/components/VideoPlayer.tsx

export function VideoPlayer({ timeline }: { timeline: TimelineAssembly }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Find which shot should be playing at current time
  const currentShot = useMemo(() => {
    return timeline.items.find(
      item => item.type === 'shot' && 
              item.startTime <= currentTime && 
              item.endTime > currentTime
    );
  }, [timeline, currentTime]);
  
  // When current shot changes, switch video source
  useEffect(() => {
    if (currentShot && videoRef.current) {
      const shotLocalTime = currentTime - currentShot.startTime;
      
      // If different video, load it
      if (videoRef.current.src !== currentShot.videoUrl) {
        videoRef.current.src = currentShot.videoUrl;
        videoRef.current.currentTime = shotLocalTime;
        
        if (isPlaying) {
          videoRef.current.play();
        }
      }
    }
  }, [currentShot, currentTime, isPlaying]);
  
  // Sync with global timeline
  useInterval(() => {
    if (isPlaying && videoRef.current) {
      const shotLocalTime = videoRef.current.currentTime;
      const globalTime = currentShot.startTime + shotLocalTime;
      setCurrentTime(globalTime);
      
      // Check if shot ended
      if (globalTime >= currentShot.endTime) {
        // Move to next shot
        const nextShot = timeline.items.find(
          item => item.type === 'shot' && item.startTime === currentShot.endTime
        );
        
        if (nextShot) {
          setCurrentTime(nextShot.startTime);
        } else {
          // End of timeline
          setIsPlaying(false);
          setCurrentTime(0);
        }
      }
    }
  }, 100);
  
  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <PlaybackControls
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={timeline.totalDuration}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onSeek={(time) => setCurrentTime(time)}
      />
    </div>
  );
}
```

---

## Audio Synchronization

### Multi-Track Audio Manager

```typescript
// packages/web/src/hooks/useAudioSync.ts

export function useAudioSync(timeline: TimelineAssembly, currentTime: number, isPlaying: boolean) {
  const audioContextRef = useRef<AudioContext>();
  const audioBuffersRef = useRef<Map<string, AudioBuffer>>(new Map());
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  useEffect(() => {
    // Initialize Web Audio API
    audioContextRef.current = new AudioContext();
    
    // Preload all audio chunks
    preloadAudioChunks();
    
    return () => {
      audioContextRef.current?.close();
    };
  }, []);
  
  useEffect(() => {
    if (isPlaying) {
      playAudioAtTime(currentTime);
    } else {
      stopAllAudio();
    }
  }, [isPlaying, currentTime]);
  
  async function preloadAudioChunks() {
    const audioItems = timeline.items.filter(item => item.type === 'audio');
    
    for (const item of audioItems) {
      const response = await fetch(item.audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      
      audioBuffersRef.current.set(item.sceneId, audioBuffer);
    }
  }
  
  function playAudioAtTime(time: number) {
    stopAllAudio();
    
    const audioItems = timeline.items.filter(
      item => item.type === 'audio' && 
              item.startTime <= time && 
              item.endTime > time
    );
    
    for (const item of audioItems) {
      const buffer = audioBuffersRef.current.get(item.sceneId);
      if (!buffer) continue;
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      
      // Calculate offset within this audio chunk
      const offset = time - item.startTime;
      source.start(0, offset);
      
      activeSourcesRef.current.add(source);
    }
  }
  
  function stopAllAudio() {
    activeSourcesRef.current.forEach(source => {
      try {
        source.stop();
      } catch (e) {
        // Already stopped
      }
    });
    activeSourcesRef.current.clear();
  }
}
```

---

## Timeline Track Components

### Video Track with Multiple Shots

```typescript
// packages/web/src/components/timeline/VideoTrack.tsx

export function VideoTrack({ scenes, selectedShotId, onSelectShot }: VideoTrackProps) {
  const totalDuration = useMemo(() => {
    return scenes.reduce((sum, scene) => sum + scene.duration, 0);
  }, [scenes]);
  
  return (
    <div className="relative h-24 bg-surface border-b border-border">
      {/* Track label */}
      <div className="absolute left-0 top-0 bottom-0 w-20 flex items-center justify-center bg-surface-elevated border-r border-border text-xs font-medium text-secondary">
        Video
      </div>
      
      {/* Track content */}
      <div className="ml-20 relative h-full overflow-x-auto">
        <div className="absolute top-0 left-0 h-full flex">
          {scenes.map(scene => (
            <SceneGroup
              key={scene.id}
              scene={scene}
              totalDuration={totalDuration}
              selectedShotId={selectedShotId}
              onSelectShot={onSelectShot}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SceneGroup({ scene, totalDuration, selectedShotId, onSelectShot }) {
  const sceneWidth = (scene.duration / totalDuration) * 100;
  
  return (
    <div
      className="relative h-full border-r-4 border-black"
      style={{ width: `${sceneWidth}%` }}
    >
      {/* Render all shots within this scene */}
      {scene.shots.map((shot, i) => {
        const shotWidth = (shot.duration / scene.duration) * 100;
        
        return (
          <div
            key={shot.id}
            className={clsx(
              'absolute top-0 bottom-0 cursor-pointer group',
              'border-r border-black/50',
              selectedShotId === shot.id && 'ring-2 ring-accent-primary'
            )}
            style={{
              left: `${shot.startTime / scene.duration * 100}%`,
              width: `${shotWidth}%`,
              background: getShotTypeGradient(shot.shotType),
            }}
            onClick={() => onSelectShot(shot.id)}
          >
            {/* Thumbnail */}
            <img
              src={shot.videoUrl || shot.imageUrl}
              alt={`Shot ${shot.order}`}
              className="w-full h-full object-cover opacity-60"
            />
            
            {/* Shot info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent flex flex-col justify-end p-1.5">
              <div className="text-xs font-medium text-white">
                Shot {shot.order}
              </div>
              <div className="text-xs text-white/70">
                {shot.shotAngle}
              </div>
            </div>
            
            {/* Source badge */}
            {shot.source !== 'fal_ai' && (
              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-green-500/90 text-white text-xs font-medium">
                {shot.source.toUpperCase()}
              </div>
            )}
            
            {/* Hover actions */}
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30">
                <Play size={14} className="text-white" />
              </button>
              <button className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30">
                <RefreshCw size={14} className="text-white" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

---

## Shot Assembly & Voiceover Integration

### Backend: Assemble Export Package

```typescript
// packages/api/src/use-cases/export-timeline.use-case.ts

export class ExportTimelineUseCase {
  async execute(projectId: string): Promise<ExportPackage> {
    const project = await this.projectRepository.findById(projectId);
    const scenes = await this.sceneRepository.findByProject(projectId);
    
    const packageId = `export-${projectId}-${Date.now()}`;
    const exportPath = `/tmp/exports/${packageId}`;
    
    // 1. Create folder structure
    await this.createFolderStructure(exportPath);
    
    // 2. Organize shots by source
    const shots = await this.getAllShots(scenes);
    await this.organizeShots(shots, exportPath);
    
    // 3. Export audio chunks
    await this.exportAudio(scenes, exportPath);
    
    // 4. Generate Premiere Pro FCPXML
    const xml = await this.generateFCPXML(project, scenes, shots);
    await fs.writeFile(`${exportPath}/timeline.xml`, xml);
    
    // 5. Generate metadata
    const metadata = this.generateMetadata(project, scenes, shots);
    await fs.writeFile(`${exportPath}/metadata.json`, JSON.stringify(metadata, null, 2));
    
    // 6. Create README
    await this.generateReadme(exportPath, project);
    
    // 7. ZIP everything
    const zipPath = await this.zipExport(exportPath);
    
    // 8. Upload to S3
    const downloadUrl = await this.uploadToS3(zipPath);
    
    return {
      downloadUrl,
      packageSize: await this.getFileSize(zipPath),
      exportPath: packageId,
    };
  }
  
  private async organizeShots(shots: Shot[], exportPath: string) {
    for (const shot of shots) {
      let targetFolder: string;
      let filename: string;
      
      // Determine folder based on source
      if (shot.source === 'pexels' || shot.source === 'nasa') {
        targetFolder = `${exportPath}/01-stock-videos`;
        filename = `shot-${shot.order.toString().padStart(3, '0')}-${shot.source}.mp4`;
      } else if (shot.shotType === 'IMAGE_EFFECT') {
        targetFolder = `${exportPath}/02-stock-images`;
        filename = `shot-${shot.order.toString().padStart(3, '0')}.jpg`;
      } else if (shot.shotType === 'AI_VIDEO') {
        targetFolder = `${exportPath}/03-ai-generated`;
        filename = `shot-${shot.order.toString().padStart(3, '0')}-ai.mp4`;
      } else { // MOTION_GRAPHIC
        targetFolder = `${exportPath}/04-motion-graphics`;
        
        // Generate After Effects template + data file
        await this.motionGraphicsService.generateMotionGraphic(shot, exportPath);
        continue;
      }
      
      // Download and copy media file
      await this.downloadMedia(shot.videoUrl || shot.imageUrl, `${targetFolder}/${filename}`);
    }
  }
  
  private async exportAudio(scenes: Scene[], exportPath: string) {
    const audioPath = `${exportPath}/05-audio`;
    
    // Export individual scene chunks
    for (const scene of scenes) {
      const filename = `scene-${scene.order.toString().padStart(2, '0')}-${this.slugify(scene.name)}.wav`;
      await this.downloadMedia(scene.audioUrl, `${audioPath}/${filename}`);
    }
    
    // Generate combined narration track
    await this.combineAudioChunks(
      scenes.map(s => s.audioUrl),
      `${audioPath}/narration-combined.wav`
    );
  }
}
```

---

## Premiere Pro FCPXML Generation

```typescript
// packages/api/src/services/export/fcpxml-generator.service.ts

export class FCPXMLGeneratorService {
  generateTimeline(project: Project, scenes: Scene[], shots: Shot[]): string {
    const fps = 30;
    const totalFrames = shots.reduce((sum, shot) => sum + shot.duration * fps, 0);
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<xmeml version="5">
  <project>
    <name>${project.title}</name>
    <children>
      <sequence>
        <name>Main Timeline</name>
        <duration>${totalFrames}</duration>
        <rate>
          <timebase>${fps}</timebase>
        </rate>
        
        <!-- Video Track -->
        <media>
          <video>
            <track>
              ${this.generateVideoClips(shots, fps)}
            </track>
          </video>
          
          <!-- Audio Track -->
          <audio>
            <track>
              ${this.generateAudioClips(scenes, fps)}
            </track>
          </audio>
        </media>
      </sequence>
    </children>
  </project>
</xmeml>`;
  }
  
  private generateVideoClips(shots: Shot[], fps: number): string {
    let currentFrame = 0;
    
    return shots.map(shot => {
      const startFrame = currentFrame;
      const endFrame = currentFrame + (shot.duration * fps);
      const clipXML = `
      <clipitem id="shot-${shot.id}">
        <name>Shot ${shot.order} - ${shot.shotAngle}</name>
        <start>${startFrame}</start>
        <end>${endFrame}</end>
        <in>0</in>
        <out>${shot.duration * fps}</out>
        <file id="file-${shot.id}">
          <name>${this.getFilePath(shot)}</name>
          <pathurl>${this.getFilePath(shot)}</pathurl>
          <rate>
            <timebase>${fps}</timebase>
          </rate>
          <duration>${shot.duration * fps}</duration>
        </file>
      </clipitem>`;
      
      currentFrame = endFrame;
      return clipXML;
    }).join('\n');
  }
  
  private generateAudioClips(scenes: Scene[], fps: number): string {
    let currentFrame = 0;
    
    return scenes.map(scene => {
      const startFrame = currentFrame;
      const duration = scene.duration;
      const endFrame = currentFrame + (duration * fps);
      
      const clipXML = `
      <clipitem id="audio-scene-${scene.id}">
        <name>Scene ${scene.order} Audio</name>
        <start>${startFrame}</start>
        <end>${endFrame}</end>
        <file id="audio-file-${scene.id}">
          <pathurl>05-audio/scene-${scene.order.toString().padStart(2, '0')}.wav</pathurl>
          <rate>
            <timebase>48000</timebase>
          </rate>
        </file>
      </clipitem>`;
      
      currentFrame = endFrame;
      return clipXML;
    }).join('\n');
  }
}
```

---

## Frontend Timeline Rendering

### Timeline Canvas Component

```typescript
// packages/web/src/components/timeline/TimelineCanvas.tsx

export function TimelineCanvas({ timeline, currentTime, zoomLevel }: TimelineCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: timeline.totalDuration });
  
  // Calculate pixels per second based on zoom
  const pixelsPerSecond = useMemo(() => {
    return zoomLevel * 10; // zoom 1 = 10px/s, zoom 10 = 100px/s
  }, [zoomLevel]);
  
  // Virtual scrolling - only render visible shots
  const visibleShots = useMemo(() => {
    return timeline.items.filter(item => 
      item.type === 'shot' &&
      item.endTime >= visibleRange.start &&
      item.startTime <= visibleRange.end
    );
  }, [timeline, visibleRange]);
  
  return (
    <div className="relative overflow-x-auto" ref={canvasRef} onScroll={handleScroll}>
      <div style={{ width: `${timeline.totalDuration * pixelsPerSecond}px` }}>
        {/* Render tracks */}
        <VideoTrack shots={visibleShots} pixelsPerSecond={pixelsPerSecond} />
        <AudioTrack timeline={timeline} pixelsPerSecond={pixelsPerSecond} />
        <GraphicsTrack timeline={timeline} pixelsPerSecond={pixelsPerSecond} />
        
        {/* Playhead */}
        <Playhead position={currentTime * pixelsPerSecond} />
      </div>
    </div>
  );
}
```

---

## Shot Regeneration Hook

```typescript
// packages/web/src/hooks/useRegenerateShot.ts

export function useRegenerateShot() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ shotId, newPrompt }: { shotId: string; newPrompt?: string }) => {
      const response = await fetch(`/api/shots/${shotId}/regenerate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visualPrompt: newPrompt }),
      });
      
      if (!response.ok) throw new Error('Regeneration failed');
      
      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate timeline query to refetch
      queryClient.invalidateQueries({ queryKey: ['timeline', data.projectId] });
      
      // Poll for completion
      pollShotStatus(data.shotId);
    },
  });
}

async function pollShotStatus(shotId: string) {
  const maxAttempts = 60; // 60 seconds
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const response = await fetch(`/api/shots/${shotId}`);
    const shot = await response.json();
    
    if (shot.status === 'COMPLETE') {
      // Success! Update UI
      queryClient.setQueryData(['shot', shotId], shot);
      return shot;
    } else if (shot.status === 'FAILED') {
      throw new Error('Shot generation failed');
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    attempts++;
  }
  
  throw new Error('Shot generation timeout');
}
```

---

## Component Files to Create

### packages/web/src/pages/
- `TimelineEditorPage.tsx` - Main page component

### packages/web/src/components/timeline/
- `VideoPlayer.tsx` - Multi-shot video player
- `PlaybackControls.tsx` - Play/pause/scrub controls
- `TimelineCanvas.tsx` - Main timeline renderer
- `VideoTrack.tsx` - Video track with shots
- `AudioTrack.tsx` - Waveform visualization
- `GraphicsTrack.tsx` - Motion graphic placeholders
- `Playhead.tsx` - Red playhead indicator
- `SceneClip.tsx` - Individual scene/shot on timeline
- `TimelineControls.tsx` - Zoom, snap, undo/redo

### packages/web/src/components/
- `SceneInspector.tsx` - Right panel details
- `ExportModal.tsx` - Export configuration
- `RegenerateModal.tsx` - Shot regeneration dialog

### packages/web/src/hooks/
- `useTimeline.ts` - Timeline state management
- `useAudioSync.ts` - Multi-track audio synchronization
- `useVideoPlayback.ts` - Multi-shot video playback
- `useRegenerateShot.ts` - Shot regeneration mutation
- `useExportTimeline.ts` - Export package mutation

---

## Summary

**Timeline Editor Components:**
- ✅ Complete component hierarchy
- ✅ Shot assembly logic (backend)
- ✅ Multi-shot video playback (frontend)
- ✅ Audio synchronization (Web Audio API)
- ✅ Timeline rendering (virtual scrolling)
- ✅ DaVinci XML generation
- ✅ Export package assembly

**Key Technical Decisions:**
1. **Web Audio API** for multi-track sync
2. **Virtual scrolling** for performance
3. **HTML5 video** switching between shots
4. **Canvas/SVG** for waveform visualization
5. **TanStack Query** for data fetching
6. **Backend assembly** of export package

**Implementation Priority:**
1. Basic video player (single shot playback)
2. Timeline track rendering
3. Multi-shot playback with transitions
4. Audio synchronization
5. Shot regeneration
6. Export package generation

**Ready to implement!** 🎬

