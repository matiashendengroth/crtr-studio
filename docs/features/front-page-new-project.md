# Feature: Front Page - New Project

## Overview
The front page is where users start creating a new 15-minute documentary video.

## Target Use Case
- **Content Type**: 15-minute documentaries
- **Topics**: History, Space, Cybercrime
- **Output**: High-quality YouTube videos

## UI Components

### 1. Script Input
- Large text area for pasting pre-written script
- Placeholder: "Paste your documentary script here..."
- Support for long text (15-minute documentary scripts)
- Character counter visible
- Example note: "Paste your narration script that you've already written"

### 2. Topic Category Selector (Optional)
- Dropdown or buttons
- Options:
  - History
  - Space
  - Cybercrime
  - Other
- Used for organizing projects and asset selection

### 3. Duration Selector
- Default: 15 minutes
- Options: 10 min, 15 min, 20 min, 30 min
- Should match the script length

### 4. Video Format
- Default: YouTube (16:9, 1920x1080)
- Options: YouTube, YouTube 4K

### 5. Generate Video Button
- Large, prominent button
- Text: "Generate Video from Script"
- Disabled until script is pasted

## User Flow

```
1. User lands on front page
2. Pastes their pre-written script into text area
3. (Optional) Selects category for organization
4. Confirms duration that matches script length
5. Clicks "Generate Video from Script"
6. Redirects to generation progress page
```

## Validation Rules
- Script must be at least 500 characters (enough for documentary)
- Script should not be empty
- Duration should be selected

## What Happens After Submit
- System analyzes the script structure
- Breaks script into scenes/segments
- Begins visual generation (finding stock footage)
- Generates voiceover from script text
- User sees progress page

## Notes
- Keep it simple and focused
- Users bring their own scripts (they know how to write them best)
- System focuses on turning script into visual video
- Make it clear this is for documentaries, not short-form content
- Text area should handle large amounts of text (typical 15-min script is ~2000-3000 words)




