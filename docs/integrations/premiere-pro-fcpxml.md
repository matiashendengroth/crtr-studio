# Premiere Pro Export - FCPXML Generation

Complete guide to generating FCPXML (Final Cut Pro XML) for Premiere Pro import.

---

## Why FCPXML?

**FCPXML = Industry Standard**
- ✅ Premiere Pro imports natively
- ✅ Final Cut Pro compatible
- ✅ Well-documented format
- ✅ Libraries and tools available
- ✅ Easier than proprietary formats

**vs Other Formats:**
- DaVinci .drp: Proprietary, limited docs
- Adobe Premiere XML: Older format
- EDL: Too basic, no media linking
- **FCPXML: Modern, flexible, standard**

---

## FCPXML Structure

### Basic Template

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.10">
  <resources>
    <!-- All media files -->
    <format id="r1" name="FFVideoFormat1080p30" frameDuration="1001/30000s" width="1920" height="1080"/>
    
    <asset id="asset-shot-001" name="Shot 001" uid="shot-001" src="file:///01-stock-videos/shot-001-galaxy.mp4" start="0s" duration="5s" hasVideo="1" format="r1"/>
    
    <asset id="asset-shot-002" name="Shot 002" uid="shot-002" src="file:///03-ai-generated/shot-002-blackhole.mp4" start="0s" duration="5s" hasVideo="1" format="r1"/>
    
    <asset id="asset-audio-scene-01" name="Scene 01 Audio" uid="audio-01" src="file:///05-audio/scene-01.wav" start="0s" duration="20s" hasAudio="1" audioSources="1" audioChannels="2" audioRate="48000"/>
  </resources>
  
  <library>
    <event name="Documentary Project">
      <project name="The Mystery of Black Holes">
        <sequence format="r1" duration="900s" tcStart="0s" tcFormat="NDF">
          <spine>
            <!-- Main video track -->
            <asset-clip ref="asset-shot-001" offset="0s" name="Shot 001" duration="5s" start="0s"/>
            <asset-clip ref="asset-shot-002" offset="5s" name="Shot 002" duration="5s" start="0s"/>
            <!-- ... more shots -->
            
            <!-- Audio clips layered on video -->
            <asset-clip ref="asset-audio-scene-01" offset="0s" duration="20s" lane="-1"/>
          </spine>
        </sequence>
      </project>
    </event>
  </library>
</fcpxml>
```

---

## Implementation

### FCPXML Generator Service

```typescript
// packages/api/src/services/export/fcpxml-generator.service.ts

export class FCPXMLGeneratorService {
  generate(project: Project, scenes: Scene[], shots: Shot[]): string {
    const resources = this.generateResources(shots, scenes);
    const timeline = this.generateTimeline(project, shots, scenes);
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.10">
  ${resources}
  ${timeline}
</fcpxml>`;
  }
  
  private generateResources(shots: Shot[], scenes: Scene[]): string {
    const format = `<format id="r1" name="FFVideoFormat1080p30" frameDuration="1001/30000s" width="1920" height="1080"/>`;
    
    // Generate video/image assets
    const videoAssets = shots.map((shot, i) => {
      const id = `asset-shot-${shot.id}`;
      const filename = this.getShotFilename(shot);
      const hasVideo = shot.shotType === 'AI_VIDEO' ? '1' : '0';
      const hasAudio = '0'; // Shots don't have audio, scenes do
      
      return `<asset id="${id}" name="Shot ${i + 1}" uid="${shot.id}" src="file:///${filename}" start="0s" duration="${shot.duration}s" hasVideo="${hasVideo}" hasAudio="${hasAudio}" format="r1"/>`;
    }).join('\n    ');
    
    // Generate audio assets
    const audioAssets = scenes.map((scene, i) => {
      const id = `asset-audio-scene-${scene.id}`;
      const filename = `05-audio/scene-${String(i + 1).padStart(2, '0')}.wav`;
      
      return `<asset id="${id}" name="Scene ${i + 1} Audio" uid="${scene.id}" src="file:///${filename}" start="0s" duration="${scene.duration}s" hasAudio="1" audioSources="1" audioChannels="2" audioRate="48000"/>`;
    }).join('\n    ');
    
    return `<resources>
    ${format}
    ${videoAssets}
    ${audioAssets}
  </resources>`;
  }
  
  private generateTimeline(project: Project, shots: Shot[], scenes: Scene[]): string {
    const totalDuration = shots.reduce((sum, shot) => sum + shot.duration, 0);
    
    // Generate video spine (main track)
    let currentOffset = 0;
    const videoClips = shots.map(shot => {
      const clip = `<asset-clip ref="asset-shot-${shot.id}" offset="${currentOffset}s" name="${shot.shotAngle || 'Shot'}" duration="${shot.duration}s" start="0s"/>`;
      currentOffset += shot.duration;
      return clip;
    }).join('\n            ');
    
    // Generate audio clips (layered on spine with lane="-1")
    currentOffset = 0;
    const audioClips = scenes.map(scene => {
      const clip = `<asset-clip ref="asset-audio-scene-${scene.id}" offset="${currentOffset}s" duration="${scene.duration}s" lane="-1" start="0s"/>`;
      currentOffset += scene.duration;
      return clip;
    }).join('\n            ');
    
    return `<library>
    <event name="${project.title}">
      <project name="${project.title}">
        <sequence format="r1" duration="${totalDuration}s" tcStart="0s" tcFormat="NDF">
          <spine>
            ${videoClips}
            ${audioClips}
          </spine>
        </sequence>
      </project>
    </event>
  </library>`;
  }
  
  private getShotFilename(shot: Shot): string {
    const folder = this.getFolderForShot(shot);
    const num = String(shot.order).padStart(3, '0');
    
    if (shot.source === 'pexels' || shot.source === 'nasa') {
      return `${folder}/shot-${num}-${shot.source}.mp4`;
    } else if (shot.shotType === 'AI_VIDEO') {
      return `${folder}/shot-${num}-ai.mp4`;
    } else {
      return `${folder}/shot-${num}.jpg`;
    }
  }
  
  private getFolderForShot(shot: Shot): string {
    if (shot.source === 'pexels' || shot.source === 'nasa') {
      return '01-stock-videos';
    } else if (shot.shotType === 'IMAGE_EFFECT') {
      return '02-stock-images';
    } else if (shot.shotType === 'AI_VIDEO') {
      return '03-ai-generated';
    } else {
      return '04-motion-graphics';
    }
  }
}
```

---

## FCPXML Reference

### Key Elements

**`<resources>`**
- Defines all media files
- Each file has unique ID
- Specifies format, duration, type

**`<sequence>`**
- Main timeline container
- Defines format (resolution, framerate)
- Contains `<spine>` (main track)

**`<spine>`**
- Primary video/audio track
- Clips are placed in sequence
- Offset determines position

**`<lane>`**
- Additional tracks above/below spine
- `lane="1"` = above (graphics)
- `lane="-1"` = below (audio)

---

## Import to Premiere Pro

### User Workflow

1. **Extract ZIP package**
```
export-mystery-of-black-holes/
├── timeline.xml              ← FCPXML file
├── 01-stock-videos/
├── 02-stock-images/
├── 03-ai-generated/
├── 04-motion-graphics/
└── 05-audio/
```

2. **Import to Premiere**
```
Premiere Pro → File → Import
→ Select timeline.xml
→ Premiere reads FCPXML
→ Creates new sequence with all clips
→ Media links automatically (relative paths)
```

3. **Verify Import**
- All shots in sequence on timeline
- Audio tracks aligned
- Motion graphic placeholders visible
- Ready for editing

---

## Testing FCPXML

### Validation
```typescript
import { parseString } from 'xml2js';

function validateFCPXML(xml: string): boolean {
  try {
    parseString(xml, (err, result) => {
      if (err) throw err;
      
      // Check required elements
      if (!result.fcpxml) throw new Error('Missing fcpxml root');
      if (!result.fcpxml.resources) throw new Error('Missing resources');
      if (!result.fcpxml.library) throw new Error('Missing library');
      
      return true;
    });
  } catch (error) {
    console.error('FCPXML validation failed:', error);
    return false;
  }
}
```

### Test Import
1. Generate FCPXML for test project
2. Import to Premiere Pro
3. Verify:
   - All clips present
   - Correct durations
   - Audio synced
   - No broken media links

---

## Libraries

### Node.js XML Generation
```bash
yarn workspace @crtr/api add xmlbuilder2
```

```typescript
import { create } from 'xmlbuilder2';

const doc = create({ version: '1.0', encoding: 'UTF-8' })
  .dtd({ sysID: 'fcpxml' })
  .ele('fcpxml', { version: '1.10' })
    .ele('resources')
      .ele('format', { id: 'r1', name: 'FFVideoFormat1080p30' })
    .up()
    .ele('library')
      .ele('event', { name: project.title })
        .ele('project', { name: project.title })
          .ele('sequence', { format: 'r1', duration: '900s' })
            .ele('spine')
              // Add clips here
            .up()
          .up()
        .up()
      .up()
    .up()
  .end({ prettyPrint: true });
```

---

## Troubleshooting

### Media Not Linking
**Problem:** Premiere says "media offline"  
**Solution:** Use relative paths from XML location

```xml
<!-- Good: Relative path -->
<asset src="file:///01-stock-videos/shot-001.mp4"/>

<!-- Bad: Absolute path -->
<asset src="file:///Users/you/Downloads/shot-001.mp4"/>
```

### Frame Rate Mismatch
**Problem:** Clips appear wrong duration  
**Solution:** Ensure consistent framerate

```xml
<format frameDuration="1001/30000s" /> <!-- 29.97 fps -->
```

### Audio Out of Sync
**Problem:** Narration doesn't match video  
**Solution:** Check audio offset and lane

```xml
<asset-clip ref="audio" offset="0s" lane="-1"/>
```

---

## Summary

**FCPXML Benefits:**
- ✅ Simpler than DaVinci format
- ✅ Well-documented standard
- ✅ Premiere imports natively
- ✅ Easier to generate programmatically
- ✅ Better library support

**Implementation:**
- Use `xmlbuilder2` for generation
- Generate resources section (all media)
- Generate timeline spine (shot sequence)
- Add audio on separate lanes
- Validate before export

**Ready to implement!** 🎬


