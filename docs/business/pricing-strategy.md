# CRTR Studio - Pricing & Business Model

Comprehensive pricing strategy based on realistic AI service costs.

---

## Cost Structure (Verified Pricing)

### Development Environment
**Purpose:** Fast iteration, testing, local development

| Service | Usage | Unit Cost | Total |
|---------|-------|-----------|-------|
| Claude (script) | 1 request | $0.05 | $0.05 |
| Claude (scenes) | 1 request | $0.10 | $0.10 |
| GenAIPro (audio) | 45 chunks @ $0.02 | $0.02/chunk | $0.90 |
| Google Imagen 1K | 22 images | $0.134/image | $2.95 |
| Kling Standard | 220 seconds (10s clips) | ~$0.02/second | $4.40 |
| **DEV TOTAL** | | | **$8.40** |

### Production Environment
**Purpose:** Customer-facing deliverables, maximum quality

| Service | Usage | Unit Cost | Total |
|---------|-------|-----------|-------|
| Claude (script) | 1 request | $0.05 | $0.05 |
| Claude (scenes) | 1 request | $0.10 | $0.10 |
| GenAIPro (audio) | 45 chunks @ $0.02 | $0.02/chunk | $0.90 |
| Nanobana Pro 4K | 22 images | $0.24/image | $5.28 |
| Kling O1 i2v | 440 seconds (20s clips) | $0.112/second | $49.28 |
| **PROD TOTAL** | | | **$55.61** |

**Additional Costs per Video:**
- Infrastructure (hosting, storage, CDN): ~$2.00
- Payment processing (3.5%): ~$2.30
- **All-in cost:** ~$60.00/video

---

## Customer Pricing Strategy

### Pay-Per-Video (Primary Revenue)
```
Price: $69.00/video
Cost: $60.00
Profit: $9.00 (13% margin)
Target: Occasional users, trial conversions
```

**Why $69?**
- 50-90% cheaper than competitors
- Psychological pricing (under $70)
- Sustainable profit margin
- Premium positioning vs low-quality services

### Creator Plan (Retention & Volume)
```
Price: $149/month (3 videos included)
Cost: $180 (3 × $60)
Monthly Loss: -$31
Annual Value: $1,788
Target: Regular YouTubers, educators
```

**Why subsidize?**
- Retention: Lock in recurring revenue
- Predictable usage: 3 videos = manageable
- Upsell path to Pro plan
- Lower churn than pay-per-video

### Pro Plan (Power Users)
```
Price: $299/month (8 videos included)
Cost: $480 (8 × $60)
Monthly Loss: -$181
Annual Value: $3,588
Target: Professional creators, agencies
```

**Why heavy subsidy?**
- Highest LTV customers
- Volume offsets loss (8 videos vs 1)
- Brand advocates and referrals
- Competitive moat against DIY solutions

### Free Trial
```
Price: $0 (1 video)
Cost: $60
Loss: -$60
Target: Acquisition funnel
```

**Why free trial?**
- Convert 20-30% to paid (industry standard)
- Required for SaaS conversion funnel
- Builds trust in AI quality
- Low CAC compared to ads

---

## Profit Model

### Revenue Mix (Projected)
| Plan | % of Users | Avg Revenue | Monthly Cost | Monthly Profit |
|------|-----------|-------------|--------------|----------------|
| Free Trial | 40% | $0 | $60 | -$60 |
| Pay-Per-Video | 35% | $69 | $60 | +$9 |
| Creator | 20% | $149 | $180 | -$31 |
| Pro | 5% | $299 | $480 | -$181 |

### Breakeven Analysis

**Scenario 1: 100 Active Users**
- 40 free trials: -$2,400
- 35 pay-per-video: +$315 (35 × $9)
- 20 creator: -$620 (20 × -$31)
- 5 pro: -$905 (5 × -$181)
- **Monthly: -$3,610** ❌ (not viable)

**Scenario 2: 1,000 Active Users**
- 400 free trials: -$24,000
- 350 pay-per-video: +$3,150
- 200 creator: -$6,200
- 50 pro: -$9,050
- **Monthly: -$36,100** ❌ (still losing)

**Key Insight:** Subscription plans are subsidized by pay-per-video users. Need to adjust mix or pricing.

---

## Revised Pricing (Sustainable)

### Option A: Increase Pay-Per-Video Price
```
Pay-Per-Video: $89/video (was $69)
Profit: $29/video (48% margin)

With same mix (1000 users):
- 350 pay-per-video: +$10,150 (350 × $29)
- Other plans: -$39,250
- Monthly: -$29,100 (still losing)
```

### Option B: Reduce Subscription Video Counts
```
Creator: $149/month (2 videos instead of 3)
Cost: $120
Profit: $29/month ✅

Pro: $299/month (5 videos instead of 8)
Cost: $300
Profit: -$1/month (breakeven) ✅

With revised mix (1000 users):
- Free trials: -$24,000
- 350 pay-per-video @ $69: +$3,150
- 200 creator @ $29: +$5,800
- 50 pro @ -$1: -$50
- Monthly: -$15,100 (better, still losing on free trials)
```

### Option C: Charge for Free Trial
```
Free Trial: $19 (one-time, refundable if upgrade)
Reduces cost impact: -$41 per trial
Filters serious users

With revised mix (1000 users):
- 400 trials @ -$41: -$16,400
- 350 pay-per-video @ $9: +$3,150
- 200 creator @ $29: +$5,800
- 50 pro @ -$1: -$50
- Monthly: -$7,500 (much better)
```

### Option D: Freemium with Limitations (Recommended)
```
Free Plan: 
- 1 video/month
- 720p resolution (lower quality service tier)
- Watermark on export
- Cost: ~$15 (lower tier services)
- Loss: -$15/user

Pay-Per-Video: $69 (no watermark, 4K)
Creator: $149/month (2 videos, 4K)
Pro: $299/month (5 videos, 4K, priority queue)

With revised mix (1000 users):
- 400 free @ -$15: -$6,000
- 350 pay-per-video @ $9: +$3,150
- 200 creator @ $29: +$5,800
- 50 pro @ -$1: -$50
- Monthly: +$2,900 ✅ PROFITABLE!
```

---

## Recommended Go-To-Market Strategy

### Phase 1: Launch (Months 1-3)
- **Free Plan:** 1 video/month, 720p, watermarked
- **Pay-Per-Video:** $69/video, full quality
- **Focus:** Acquire users, validate quality, build case studies
- **Goal:** 500 active users

### Phase 2: Subscriptions (Months 4-6)
- **Creator Plan:** $149/month (2 videos)
- **Pro Plan:** $299/month (5 videos)
- **Focus:** Convert power users to subscriptions
- **Goal:** 20% subscription rate

### Phase 3: Scale (Months 7-12)
- **Enterprise Plan:** Custom pricing (10+ videos/month)
- **API Access:** $0.50/minute of video generated
- **White Label:** Revenue share for resellers
- **Goal:** Profitability

---

## Competitive Positioning

| Service | Price/Video | Time | Quality | Editing Control |
|---------|-------------|------|---------|-----------------|
| **VidRush** | $150-300 | 1 hour | AI-generated | Limited |
| **Upwork Editor** | $150-500 | 3-5 days | Variable | Full |
| **Fiverr Editor** | $50-200 | 2-7 days | Variable | Full |
| **DIY (Premiere)** | $22/mo + 50hrs | Weeks | Depends on skill | Full |
| **CRTR Studio** | **$69** | **30-60 min** | **AI Max Quality** | **Timeline + DaVinci** |

### Value Proposition
- **50-90% cheaper** than traditional editing
- **100x faster** than DIY
- **Professional quality** via Kling O1 + Nanobana Pro
- **Full control** via timeline editor and DaVinci export
- **Iterative workflow** regenerate individual scenes

---

## Unit Economics (Target)

### Acquisition Costs
- Paid ads: $50-100 CAC
- Content marketing: $20-40 CAC
- Referrals: $10-20 CAC
- **Target:** $30 blended CAC

### Lifetime Value (LTV)
- Pay-per-video: $69 × 2 videos/year = $138 LTV
- Creator: $149 × 8 months avg = $1,192 LTV
- Pro: $299 × 12 months avg = $3,588 LTV
- **Blended LTV:** ~$800

### LTV:CAC Ratio
- Target: 3:1 ratio
- $800 LTV / $30 CAC = 26.6:1 ✅
- Healthy SaaS metric

### Payback Period
- Free trial cost: $15
- CAC: $30
- Total upfront cost: $45
- First paid video: $69 revenue - $60 cost = $9 profit
- Payback: $45 / $9 = 5 videos (too long)
- With creator plan: $149 - $120 = $29 profit
- Payback: $45 / $29 = 1.5 months ✅

---

## Risk Mitigation

### Price Risk (AI Costs Increase)
- **Monitor:** Track per-video costs weekly
- **Hedge:** Negotiate annual contracts with Kling/Nanobana
- **Adjust:** Price increases with 30-day notice
- **Alternative:** Switch to cheaper providers if economics break

### Demand Risk (Lower Than Expected)
- **Pivot:** Focus on enterprise/white-label
- **Reduce:** Cut free tier, increase pay-per-video
- **Bundle:** Partner with YouTube/course platforms

### Competition Risk (Cheaper Alternatives)
- **Differentiate:** Timeline editor + DaVinci export
- **Quality:** Max quality (O1 tier) vs competitors' standard
- **Speed:** Continue optimizing generation pipeline
- **Ecosystem:** Build template library, voice selection, brand kits

---

## Success Metrics

### North Star Metric
**Videos generated per month** (proxy for revenue and usage)

### Key Metrics
- Monthly Active Users (MAU)
- Conversion rate (free → paid)
- Average videos per user
- Churn rate (monthly)
- LTV:CAC ratio
- Cost per video (COGS)
- Gross margin

### Targets (Month 12)
- 5,000 MAU
- 25% conversion rate
- 3 videos/user/month
- 5% monthly churn
- 3:1 LTV:CAC
- $60 cost per video
- 15% gross margin

---

## Summary

**Sustainable Pricing Model:**
- Free: 1 video/month, 720p, watermarked (-$15 cost)
- Pay-Per-Video: $69, full quality (+$9 profit)
- Creator: $149/month (2 videos) (+$29 profit)
- Pro: $299/month (5 videos) (breakeven)

**Market Position:**
- 50-90% cheaper than competitors
- Professional quality (Kling O1 + Nanobana Pro 4K)
- 100x faster than traditional editing
- Full creative control (timeline + DaVinci export)

**Path to Profitability:**
- Phase 1: Acquire users with freemium
- Phase 2: Convert to subscriptions
- Phase 3: Scale with enterprise/API
- Target: 15% gross margin by month 12

This pricing strategy balances customer value, competitive positioning, and sustainable unit economics.


