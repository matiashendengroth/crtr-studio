# API Keys Setup - SECURE

**⚠️ SECURITY WARNING:** Never commit API keys to git!

---

## Your API Keys (Add to .env)

Copy `packages/api/env.example` to `packages/api/.env` and add these keys:

### 1. Pexels API
```env
PEXELS_API_KEY=wXui3Y2DMyOTd52E7PGBFqV83ji0YtV0kULl30xXjqj38Q5TCxtwwpwQ
```
- Free tier: 200 requests/hour
- Source: https://www.pexels.com/api

### 2. GenAIPro API (Voiceover)
```env
GENAIPRO_API_KEY=eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDIyMkFBQSIsImtpZCI6Imluc18ydmlCa3pCZzdVUUJ4eW9FTHh4WmN4Q1FWc0MiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwczovL2dlbmFpcHJvLnZuIiwiZXhwIjoxNzczMTU2OTYyLCJpYXQiOjE3NjUzODA5NjIsImlzcyI6Imh0dHBzOi8vY2xlcmsuZ2VuYWlwcm8udm4iLCJqdGkiOiI5NDQ4YjEyMmQwNjM0NmFjMDEzZSIsIm5iZiI6MTc2NTM4MDk1NywicHVibGljX21ldGFkYXRhIjp7ImNoYXRncHRfYWNjb3VudF9pZCI6IjBmZTkyOTI4LTdlOGUtNDAyMC1iMzE4LTJlNjFjYzE5MzljOSIsInJvbGUiOiJ1c2VyIiwidXNlcl9kYl9pZCI6ImYzMGM1NTViLTA0ZWItNDg4MC1hMjZhLTFiMDQ5ZDA5ZGUxOSJ9LCJzdWIiOiJ1c2VyXzM2Q2tHZHRSOVE5NWM2ZE5lajJ0aWl4Rkg4TyIsInVzZXJuYW1lIjoibWF0dGFpc2Nvb2wifQ.XMYDBLVgrY63CqKaMAO3io7nDAn3Q-EW6OA83FpZ0b9SAqp5wzAXj7mtqKFOkTCT1GN2fT7tIm11fruRG_LNvH__jmB34zW3Uk2jnJkLjr2nSk_pvUCOBCH5Nqlp9vqHBr-2zIYOOGOuxF4ZsCgi1n6WS5R0R4CO-PqkN36EOF-nBTxa_lNsviLTa28UnJ6HTc6_qBvNFMQkpQ_nmvFLYGD252BTeHVkUfbttYMcJ0f1L3xlr_mJtIExcXXe6BZapUJqLbnkCrjT8tduocQ1BX7iQTgN5QC8G_uax9pvj44MHC7EqXHC-3HkjebAzs2WkdMlNskTyY3f-N_cKUcSLw
```
- JWT token format
- Source: https://genaipro.vn
- Documentation: https://genaipro.vn/docs-api

### 3. NASA API
```env
NASA_API_KEY=Oaq6H6xStyaFoXT2WbTj2fSXJbJ1VH3RduPwL9Py
```
- Source: https://api.nasa.gov
- Optional: API works without key, but key increases rate limits

### 4. fal.ai API (Get Your Own)
```env
FAL_API_KEY=your-fal-api-key-here
```
- Get from: https://fal.ai/dashboard/keys
- **Required** for image/video generation
- Pro tier recommended (pay-per-use)

### 5. Claude API (Get Your Own)
```env
CLAUDE_API_KEY=sk-ant-your-key-here
```
- Get from: https://console.anthropic.com
- **Required** for script generation and orchestration
- Recommended: API tier (not free tier)

---

## Complete .env File Template

```env
# Environment
NODE_ENV=development

# Server
PORT=3001
API_URL=http://localhost:3001

# Database
DATABASE_URL=postgresql://crtr:crtr_dev_password@localhost:5432/crtr_studio

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# AI Services Configuration
FAL_API_KEY=your-fal-api-key-here
IMAGE_GEN_MODEL=fal-ai/nano-banana-pro
VIDEO_GEN_MODEL=fal-ai/kling-video/o1/image-to-video
VIDEO_TO_VIDEO_MODEL=fal-ai/kling-video/o1/video-to-video/reference

# Video Settings
VIDEO_CLIP_LENGTH=10
VIDEO_RESOLUTION=1K

# Other AI API Keys
CLAUDE_API_KEY=sk-ant-your-key-here
GENAIPRO_API_KEY=eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDIyMkFBQSIsImtpZCI6Imluc18ydmlCa3pCZzdVUUJ4eW9FTHh4WmN4Q1FWc0MiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwczovL2dlbmFpcHJvLnZuIiwiZXhwIjoxNzczMTU2OTYyLCJpYXQiOjE3NjUzODA5NjIsImlzcyI6Imh0dHBzOi8vY2xlcmsuZ2VuYWlwcm8udm4iLCJqdGkiOiI5NDQ4YjEyMmQwNjM0NmFjMDEzZSIsIm5iZiI6MTc2NTM4MDk1NywicHVibGljX21ldGFkYXRhIjp7ImNoYXRncHRfYWNjb3VudF9pZCI6IjBmZTkyOTI4LTdlOGUtNDAyMC1iMzE4LTJlNjFjYzE5MzljOSIsInJvbGUiOiJ1c2VyIiwidXNlcl9kYl9pZCI6ImYzMGM1NTViLTA0ZWItNDg4MC1hMjZhLTFiMDQ5ZDA5ZGUxOSJ9LCJzdWIiOiJ1c2VyXzM2Q2tHZHRSOVE5NWM2ZE5lajJ0aWl4Rkg4TyIsInVzZXJuYW1lIjoibWF0dGFpc2Nvb2wifQ.XMYDBLVgrY63CqKaMAO3io7nDAn3Q-EW6OA83FpZ0b9SAqp5wzAXj7mtqKFOkTCT1GN2fT7tIm11fruRG_LNvH__jmB34zW3Uk2jnJkLjr2nSk_pvUCOBCH5Nqlp9vqHBr-2zIYOOGOuxF4ZsCgi1n6WS5R0R4CO-PqkN36EOF-nBTxa_lNsviLTa28UnJ6HTc6_qBvNFMQkpQ_nmvFLYGD252BTeHVkUfbttYMcJ0f1L3xlr_mJtIExcXXe6BZapUJqLbnkCrjT8tduocQ1BX7iQTgN5QC8G_uax9pvj44MHC7EqXHC-3HkjebAzs2WkdMlNskTyY3f-N_cKUcSLw
PEXELS_API_KEY=wXui3Y2DMyOTd52E7PGBFqV83ji0YtV0kULl30xXjqj38Q5TCxtwwpwQ
NASA_API_KEY=Oaq6H6xStyaFoXT2WbTj2fSXJbJ1VH3RduPwL9Py

# File Storage (S3-compatible)
S3_ENDPOINT=
S3_BUCKET=crtr-studio
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_REGION=us-east-1

# Cost Tracking
TRACK_COSTS=true
DEV_MODE=true

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## Setup Steps

1. **Copy template:**
```bash
cd packages/api
cp env.example .env
```

2. **Add your keys** (listed above)

3. **Get missing keys:**
   - fal.ai: https://fal.ai/dashboard/keys
   - Claude: https://console.anthropic.com

4. **Verify:**
```bash
# Check all keys are set
cat .env | grep "API_KEY="
```

---

## Security Checklist

- ✅ `.env` is in `.gitignore`
- ✅ Never commit `.env` file
- ✅ Use separate keys for dev/staging/prod
- ✅ Rotate keys periodically
- ✅ Use environment variables in production hosting (Railway, Render, etc.)
- ✅ Never log API keys in console

---

## Testing API Keys

```bash
cd packages/api

# Start server
yarn dev

# Test endpoints will verify keys are working
curl http://localhost:3001/health
```

---

## Production Deployment

**Railway/Render:**
- Add environment variables in dashboard
- DO NOT commit `.env.production` to git
- Use platform's secret management

**GitHub Actions:**
- Store keys as GitHub Secrets
- Reference as: `${{ secrets.FAL_API_KEY }}`

---

**All API keys are now documented and ready to use!** 🔐


