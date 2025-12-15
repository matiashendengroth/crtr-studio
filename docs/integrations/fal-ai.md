# fal.ai Integration Guide

Complete guide to using fal.ai as the unified provider for image and video generation in CRTR Studio.

---

## Why fal.ai?

**Single API aggregator** instead of integrating multiple providers:

✅ **One API integration** - Not 4-5 different services  
✅ **One API key** - Simplified auth  
✅ **Consistent errors** - Same format for all models  
✅ **Better monitoring** - Single dashboard  
✅ **Easy model switching** - Change env var, no code changes

---

## Models Used in CRTR Studio

### 1. Nano Banana Pro (Image Generation)

**Model:** [`fal-ai/nano-banana-pro`](https://fal.ai/models/fal-ai/nano-banana-pro)

**What it is:**
- Google Gemini 3 Pro Image architecture
- State-of-the-art text rendering
- Character consistency across generations

**Pricing:**
- **1K resolution:** $0.15/image
- **4K resolution:** $0.30/image
- **Bulk:** ~7 images per $1.00

**Use in CRTR:**
- Development: 1K ($0.15)
- Production: 4K ($0.30)
- Fallback when no stock media available

---

### 2. Kling O1 Image-to-Video

**Model:** [`fal-ai/kling-video/o1/image-to-video`](https://fal.ai/models/fal-ai/kling-video/o1/image-to-video)

**Pricing:** **$0.112/second**
- 5s: $0.56
- 10s: $1.12
- 20s: $2.24

**Use in CRTR:**
- First shot of AI_VIDEO scenes
- Animates from Nano Banana starting frame

---

### 3. Kling O1 Video-to-Video (Future Feature)

**Model:** [`fal-ai/kling-video/o1/video-to-video/reference`](https://fal.ai/models/fal-ai/kling-video/o1/video-to-video/reference)

**Pricing:** **$0.168/second** (50% premium)
- 5s: $0.84
- 10s: $1.68

**Use in CRTR:**
- Sequential shots within same scene
- Maintains cinematic continuity
- Preserves camera language

---

## Implementation

### Installation

```bash
cd packages/api
yarn add @fal-ai/serverless-client
```

### Configuration

```typescript
// packages/api/src/config/fal-config.ts

export const falConfig = {
  development: {
    imageModel: 'fal-ai/nano-banana-pro',
    imageResolution: '1K',
    videoModel: 'fal-ai/kling-video/o1/image-to-video',
    videoDuration: 10,
  },
  production: {
    imageModel: 'fal-ai/nano-banana-pro',
    imageResolution: '4K',
    videoModel: 'fal-ai/kling-video/o1/image-to-video',
    videoDuration: 20,
  },
};
```

### Service Implementation

```typescript
// packages/api/src/services/fal-ai/fal-client.ts

import * as fal from '@fal-ai/serverless-client';

export class FalAIService {
  constructor(apiKey: string) {
    fal.config({ credentials: apiKey });
  }

  async generateImage(prompt: string, resolution: '1K' | '4K' = '1K') {
    const result = await fal.subscribe('fal-ai/nano-banana-pro', {
      input: {
        prompt,
        resolution,
      },
    });

    return {
      imageUrl: result.images[0].url,
      cost: resolution === '4K' ? 0.30 : 0.15,
    };
  }

  async generateVideo(prompt: string, startImageUrl: string, duration: number = 10) {
    const result = await fal.subscribe('fal-ai/kling-video/o1/image-to-video', {
      input: {
        prompt,
        start_image_url: startImageUrl,
        duration,
      },
    });

    return {
      videoUrl: result.video.url,
      duration: result.video.duration,
      cost: duration * 0.112,
    };
  }
}
```

---

## Environment Variables

```env
# .env
FAL_API_KEY=your-key-from-https://fal.ai/dashboard/keys

# Model configuration
IMAGE_GEN_MODEL=fal-ai/nano-banana-pro
VIDEO_GEN_MODEL=fal-ai/kling-video/o1/image-to-video
VIDEO_TO_VIDEO_MODEL=fal-ai/kling-video/o1/video-to-video/reference
```

---

## Cost Tracking

```typescript
await CostTracker.trackGeneration(projectId, shotId, 'image', 0.30, {
  provider: 'fal_ai',
  model: 'fal-ai/nano-banana-pro',
  resolution: '4K',
});

await CostTracker.trackGeneration(projectId, shotId, 'video', 2.24, {
  provider: 'fal_ai',
  model: 'fal-ai/kling-video/o1/image-to-video',
  duration: 20,
});
```

---

## Links

- [Nano Banana Pro](https://fal.ai/models/fal-ai/nano-banana-pro)
- [Kling O1 i2v](https://fal.ai/models/fal-ai/kling-video/o1/image-to-video)
- [Kling O1 v2v](https://fal.ai/models/fal-ai/kling-video/o1/video-to-video/reference)
- [fal.ai Dashboard](https://fal.ai/dashboard)
- [fal.ai Docs](https://fal.ai/docs)

---

## Summary

**Single provider benefits:**
- ✅ 1 API key instead of 4
- ✅ Consistent error handling
- ✅ Easy model switching
- ✅ Better monitoring

**Production costs:**
- Images: $0.30 each (4K)
- Videos: $0.112/second
- Typical shot: $0.86 (image + 5s video)


