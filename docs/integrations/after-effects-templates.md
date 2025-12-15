# After Effects Template Generation

Complete guide to generating After Effects project templates for motion graphics.

---

## Overview

Instead of exporting text instructions, CRTR Studio generates **After Effects project templates** that users can:
- Open directly in After Effects
- Customize with their style
- Render or use Dynamic Link to Premiere
- Professional motion graphic workflow

---

## After Effects Project Structure

### .aep File Format

After Effects projects (.aep) are binary files, BUT we can:
1. **Generate JSON data files** for expressions/scripts
2. **Provide template .aep files** with placeholders
3. **Use ExtendScript** for automation

---

## Implementation Strategy

### Approach: Template Library + Data Files

**Don't:** Generate .aep files programmatically (complex binary format)  
**Do:** Provide pre-made templates + JSON data

```
04-motion-graphics/
├── timeline-template.aep          # Pre-made AE project
├── timeline-data.json             # Your documentary data
├── data-viz-template.aep
├── data-viz-data.json
└── INSTRUCTIONS.txt
```

---

## Motion Graphic Templates

### 1. Timeline Template

**File:** `timeline-template.aep`

**What it contains:**
- Animated timeline composition
- Text layers for years
- Expression-driven animations
- Customizable colors/fonts

**Data file:** `timeline-data.json`
```json
{
  "type": "timeline",
  "title": "Black Hole Discovery Timeline",
  "events": [
    {
      "year": 1915,
      "title": "Einstein's General Relativity",
      "description": "Predicted black holes mathematically"
    },
    {
      "year": 1971,
      "title": "Cygnus X-1",
      "description": "First black hole candidate identified"
    },
    {
      "year": 2019,
      "title": "M87 Black Hole Image",
      "description": "Event Horizon Telescope captures first image"
    }
  ],
  "duration": 10,
  "style": {
    "primaryColor": "#6366f1",
    "secondaryColor": "#8b5cf6",
    "fontSize": 48
  }
}
```

**Instructions.txt:**
```
1. Open timeline-template.aep in After Effects
2. Window → Extensions → CRTR Data Importer (or manual)
3. File → Scripts → Import CRTR Data.jsx
4. Select timeline-data.json
5. Timeline populates automatically
6. Customize colors/fonts if desired
7. Composition → Add to Render Queue
8. Or use Dynamic Link to Premiere Pro
```

---

### 2. Data Visualization Template

**File:** `data-viz-template.aep`

**What it contains:**
- Animated bar chart
- Expression-driven data binding
- Smooth transitions

**Data file:** `data-viz-data.json`
```json
{
  "type": "bar_chart",
  "title": "Black Holes Discovered by Year",
  "data": [
    { "label": "1970s", "value": 12 },
    { "label": "1980s", "value": 45 },
    { "label": "1990s", "value": 128 },
    { "label": "2000s", "value": 342 },
    { "label": "2010s", "value": 891 }
  ],
  "duration": 8,
  "animationStyle": "bars_grow_in"
}
```

---

### 3. Lower Third Template

**File:** `lower-third-template.aep`

**Data file:** `lower-third-data.json`
```json
{
  "type": "lower_third",
  "instances": [
    {
      "name": "Dr. Jane Smith",
      "title": "Astrophysicist, NASA",
      "startTime": 45,
      "duration": 5
    },
    {
      "name": "Prof. John Doe",
      "title": "Black Hole Expert, MIT",
      "startTime": 180,
      "duration": 5
    }
  ]
}
```

---

## Template Library (Pre-Made)

### Templates to Include

```
packages/api/assets/ae-templates/
├── timeline-horizontal.aep        # Horizontal timeline
├── timeline-vertical.aep          # Vertical timeline
├── bar-chart.aep                  # Animated bar chart
├── pie-chart.aep                  # Animated pie chart
├── line-graph.aep                 # Animated line graph
├── lower-third-modern.aep         # Modern lower third
├── lower-third-minimal.aep        # Minimal lower third
├── title-card-gradient.aep        # Gradient title card
├── map-animation.aep              # Animated map markers
└── text-overlay.aep               # Animated text overlay
```

**One-time creation:**
- Designer creates templates once
- Stored in repo
- Copied to export package
- Users customize with their data

---

## ExtendScript for Automation (Advanced)

### Auto-Import Data Script

**File:** `packages/api/assets/ae-scripts/import-crtr-data.jsx`

```javascript
// ExtendScript for After Effects
// Auto-imports JSON data into template

#include "json2.js"

function importCRTRData(jsonPath) {
  var file = new File(jsonPath);
  file.open("r");
  var jsonString = file.read();
  file.close();
  
  var data = JSON.parse(jsonString);
  var comp = app.project.activeItem;
  
  if (data.type === "timeline") {
    // Find text layers and populate
    for (var i = 0; i < data.events.length; i++) {
      var event = data.events[i];
      var textLayer = comp.layer("Event " + (i + 1));
      
      if (textLayer) {
        textLayer.property("Source Text").setValue(event.year + ": " + event.title);
      }
    }
  }
  
  alert("Data imported successfully!");
}

// Run
var jsonFile = File.openDialog("Select CRTR data file", "*.json");
if (jsonFile) {
  importCRTRData(jsonFile.fsName);
}
```

---

## Backend Generation Logic

### Motion Graphic Shot Processing

```typescript
// packages/api/src/services/export/motion-graphics.service.ts

export class MotionGraphicsService {
  async generateMotionGraphic(shot: Shot, exportPath: string): Promise<void> {
    const mgType = this.detectMotionGraphicType(shot.visualPrompt);
    const templateName = this.getTemplateName(mgType);
    const dataFile = await this.generateDataFile(shot, mgType);
    
    // Copy template to export folder
    await fs.copyFile(
      `assets/ae-templates/${templateName}.aep`,
      `${exportPath}/04-motion-graphics/shot-${shot.order}-template.aep`
    );
    
    // Write data file
    await fs.writeFile(
      `${exportPath}/04-motion-graphics/shot-${shot.order}-data.json`,
      JSON.stringify(dataFile, null, 2)
    );
    
    // Write instructions
    await this.generateInstructions(shot, mgType, exportPath);
  }
  
  private detectMotionGraphicType(prompt: string): MotionGraphicType {
    if (prompt.toLowerCase().includes('timeline')) return 'timeline';
    if (prompt.toLowerCase().includes('chart') || prompt.toLowerCase().includes('graph')) return 'data_viz';
    if (prompt.toLowerCase().includes('map')) return 'map';
    if (prompt.toLowerCase().includes('lower third')) return 'lower_third';
    return 'text_overlay';
  }
  
  private async generateDataFile(shot: Shot, type: MotionGraphicType): Promise<any> {
    // Use Claude to extract structured data from prompt
    const prompt = `
Extract structured data from this motion graphic description:
"${shot.visualPrompt}"

Return JSON in this format:
${this.getDataFormat(type)}
    `;
    
    const response = await this.claudeService.generate(prompt);
    return JSON.parse(response);
  }
  
  private getDataFormat(type: MotionGraphicType): string {
    const formats = {
      timeline: JSON.stringify({
        type: "timeline",
        title: "Timeline Title",
        events: [
          { year: 1915, title: "Event", description: "Details" }
        ]
      }, null, 2),
      
      data_viz: JSON.stringify({
        type: "bar_chart",
        title: "Chart Title",
        data: [
          { label: "Category", value: 100 }
        ]
      }, null, 2),
      
      // ... other formats
    };
    
    return formats[type] || '{}';
  }
}
```

---

## User Experience

### What Users Receive

**For each motion graphic shot:**

```
shot-006-timeline/
├── template.aep              # Pre-made AE project
├── data.json                 # Your documentary data
└── INSTRUCTIONS.txt
```

**INSTRUCTIONS.txt:**
```
Motion Graphic: Shot 006 - Timeline

Template: Timeline (Horizontal)
Duration: 10 seconds

Steps:
1. Open template.aep in After Effects
2. (Optional) Run Scripts → Import CRTR Data.jsx
3. (Optional) Select data.json
4. Customize:
   - Colors: Adjust "Primary Color" layer
   - Fonts: Change text layers
   - Timing: Adjust keyframes
5. Render:
   Option A: Composition → Add to Render Queue
   Option B: Use Dynamic Link to Premiere (no render needed)

Data:
- Timeline events: 1915, 1971, 2019
- Style: Blue gradient theme
- Duration: 10s

Tips:
- Keep it simple and readable
- Match documentary color scheme
- Test timing with narration
```

---

## Dynamic Link Workflow (Recommended)

### No Rendering Needed!

```
1. Open Premiere Pro
2. Import FCPXML (main timeline loads)
3. Right-click motion graphic placeholder
4. Replace with → After Effects Composition
5. Select template.aep → Choose composition
6. Composition updates live in Premiere
7. Edit in AE, see changes immediately in Premiere
```

**Benefits:**
- No rendering time
- Live updates
- Easier iteration
- Professional workflow

---

## Template Creation (One-Time Setup)

### Designer Creates Templates

**Once:** Create 10-15 common templates
- Timeline (horizontal/vertical)
- Charts (bar, pie, line)
- Lower thirds (modern, minimal)
- Title cards (various styles)
- Map animations
- Text overlays

**Store in:** `packages/api/assets/ae-templates/`

**Version control:** Include in repo (small .aep files)

**Users get:** Perfect starting point, customize to taste

---

## Summary

**After Effects Integration:**
- ✅ Pre-made templates (.aep files)
- ✅ JSON data files for customization
- ✅ ExtendScript for automation (optional)
- ✅ Dynamic Link support (live updates)
- ✅ Professional workflow

**vs Text Instructions:**
- Before: "Create a timeline from 1915-2024" (vague)
- After: Template.aep + data.json (specific, ready to use)

**User workflow:**
1. Open template in After Effects
2. Customize colors/fonts
3. Use Dynamic Link or render
4. Import to Premiere timeline
5. Done!

**Much better than DaVinci Fusion placeholders!** 🎨


