# CRTR Studio - Front Page Design

**Inspired by:** Lovable.dev (converted to dark mode)  
**Changes:** Dark theme, removed "Discover templates", minimized footer

---

## Color Scheme (Dark Mode)

```css
/* Base Colors */
--background: #0a0a0a;           /* Almost black */
--surface: #151515;              /* Slightly lighter */
--surface-elevated: #1f1f1f;     /* Cards, modals */
--border: #2a2a2a;               /* Subtle borders */

/* Text */
--text-primary: #ffffff;         /* Main text */
--text-secondary: #a0a0a0;       /* Muted text */
--text-muted: #666666;           /* Disabled text */

/* Accent */
--accent-primary: #6366f1;       /* Indigo - primary actions */
--accent-hover: #4f46e5;         /* Darker indigo on hover */
--accent-glow: rgba(99, 102, 241, 0.15); /* Glow effect */

/* Status */
--success: #22c55e;
--warning: #f59e0b;
--error: #ef4444;
```

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  Navigation Bar (sticky)                                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Hero Section                                           │
│  - Headline                                             │
│  - Subtitle                                             │
│  - CTA Buttons                                          │
│  - Visual/Demo                                          │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  How It Works Section                                   │
│  - 4 steps visualization                                │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Features Section                                       │
│  - 3 column grid                                        │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Pricing Section                                        │
│  - Free, Pro, Enterprise tiers                          │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  Footer (minimized)                                     │
└─────────────────────────────────────────────────────────┘
```

---

## 1. Navigation Bar

### **Desktop**
```
┌──────────────────────────────────────────────────────────┐
│  [Logo]    Features   Pricing   Docs      [Login] [Sign Up] │
└──────────────────────────────────────────────────────────┘
```

**Specifications:**
- Height: `64px`
- Background: `rgba(10, 10, 10, 0.8)` with backdrop blur
- Border bottom: `1px solid var(--border)`
- Position: `sticky top-0` with `z-index: 50`
- Logo: White text "CRTR Studio" with gradient accent
- Links: `text-sm font-medium text-secondary hover:text-primary`
- Login button: `ghost` variant (transparent)
- Sign Up button: `primary` variant (accent gradient)

### **Mobile**
- Hamburger menu (right side)
- Logo (left side)
- Menu slides in from right

---

## 2. Hero Section

```
┌────────────────────────────────────────────────────────┐
│                                                         │
│             Turn Your Ideas Into                        │
│         Professional Documentaries                      │
│                                                         │
│       AI-powered video generation in 30 minutes         │
│                                                         │
│     [Start Creating →]    [Watch Demo]                 │
│                                                         │
│     ┌─────────────────────────────────┐               │
│     │                                  │               │
│     │   Video Preview / Demo           │               │
│     │   (looping example documentary)  │               │
│     │                                  │               │
│     └─────────────────────────────────┘               │
│                                                         │
└────────────────────────────────────────────────────────┘
```

**Specifications:**

### **Background**
- Dark gradient: `linear-gradient(180deg, #0a0a0a 0%, #151515 100%)`
- Subtle grain texture overlay (opacity: 0.05)
- Animated gradient glow behind video preview

### **Headline**
- Font: `text-5xl md:text-7xl font-bold`
- Color: `text-primary`
- "Professional Documentaries" has gradient: `bg-gradient-to-r from-indigo-400 to-purple-400`
- Line height: `leading-tight`
- Letter spacing: `-0.02em`

### **Subtitle**
- Font: `text-xl md:text-2xl font-normal`
- Color: `text-secondary`
- Margin top: `mt-6`

### **CTA Buttons**
```tsx
// Primary button
<button className="
  px-8 py-4 rounded-xl
  bg-gradient-to-r from-indigo-600 to-purple-600
  hover:from-indigo-500 hover:to-purple-500
  text-white font-medium text-lg
  shadow-lg shadow-indigo-500/50
  transition-all duration-200
  hover:scale-105
">
  Start Creating →
</button>

// Secondary button
<button className="
  px-8 py-4 rounded-xl
  border border-border
  text-primary font-medium text-lg
  hover:bg-surface-elevated
  transition-all duration-200
">
  Watch Demo
</button>
```

### **Video Preview**
- Max width: `900px`
- Aspect ratio: `16:9`
- Border radius: `24px`
- Border: `1px solid var(--border)`
- Box shadow: `0 20px 60px rgba(99, 102, 241, 0.3)`
- Auto-playing looped demo video
- Subtle hover effect: scale up 1.02

---

## 3. How It Works Section

```
┌──────────────────────────────────────────────────────┐
│                  How It Works                         │
│         Create professional documentaries in 4 steps  │
│                                                       │
│  ┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐      │
│  │  1   │ →  │  2   │ →  │  3   │ →  │  4   │      │
│  │Topic │    │Script│    │Story │    │Export│      │
│  └──────┘    └──────┘    └──────┘    └──────┘      │
│                                                       │
└──────────────────────────────────────────────────────┘
```

**Specifications:**

### **Section Header**
- Title: `text-4xl font-bold text-primary`
- Subtitle: `text-xl text-secondary`
- Text align: `center`
- Max width: `800px` centered

### **Step Cards**
```tsx
<div className="
  group relative
  p-8 rounded-2xl
  bg-surface border border-border
  hover:border-accent-primary
  transition-all duration-300
  hover:shadow-2xl hover:shadow-accent-glow
">
  {/* Step Number */}
  <div className="
    w-12 h-12 rounded-full
    bg-gradient-to-br from-indigo-600 to-purple-600
    flex items-center justify-center
    text-2xl font-bold text-white
    mb-6
  ">
    1
  </div>
  
  {/* Icon */}
  <div className="text-5xl mb-4">🎯</div>
  
  {/* Title */}
  <h3 className="text-xl font-semibold text-primary mb-2">
    Enter Topic
  </h3>
  
  {/* Description */}
  <p className="text-secondary text-base">
    Provide your documentary topic and key points.
    AI generates a complete script.
  </p>
</div>
```

**4 Steps:**
1. **Enter Topic** 🎯
   - "Provide your documentary topic and key points. AI generates a complete script."
   
2. **Review Script** 📝
   - "Edit and refine the AI-generated script. Approve scenes before video generation."
   
3. **Generate Video** 🎬
   - "AI creates videos, voiceovers, and visuals. Track progress in real-time."
   
4. **Export & Polish** 🚀
   - "Export to DaVinci Resolve for final color grading and finishing touches."

---

## 4. Features Section

```
┌──────────────────────────────────────────────────────┐
│                                                       │
│              Why Choose CRTR Studio                   │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Feature  │  │ Feature  │  │ Feature  │          │
│  │    1     │  │    2     │  │    3     │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Feature  │  │ Feature  │  │ Feature  │          │
│  │    4     │  │    5     │  │    6     │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                       │
└──────────────────────────────────────────────────────┘
```

**Features Grid:**
- 3 columns on desktop, 2 on tablet, 1 on mobile
- Gap: `gap-8`

**Feature Cards:**

```tsx
<div className="
  p-6 rounded-xl
  bg-surface border border-border
  hover:border-accent-primary
  transition-all duration-200
">
  {/* Icon */}
  <div className="
    w-14 h-14 rounded-lg
    bg-gradient-to-br from-indigo-600/20 to-purple-600/20
    flex items-center justify-center
    text-3xl
    mb-4
  ">
    ⚡
  </div>
  
  {/* Title */}
  <h3 className="text-lg font-semibold text-primary mb-2">
    Lightning Fast
  </h3>
  
  {/* Description */}
  <p className="text-secondary text-sm">
    Generate 15-minute documentaries in under 30 minutes.
    100x faster than traditional production.
  </p>
</div>
```

**6 Features:**

1. **⚡ Lightning Fast**
   - "Generate 15-minute documentaries in under 30 minutes. 100x faster than traditional production."

2. **💰 Cost Effective**
   - "Starting at $7.50 per documentary. 50x cheaper than traditional video production."

3. **🎨 Full Control**
   - "Review and edit scenes before generation. Regenerate individual shots in seconds."

4. **🎙️ Professional Voice**
   - "AI-generated narration with documentary-quality voice acting. Per-scene audio editing."

5. **🎬 Smart Mix**
   - "Intelligent blend of AI video, images, and motion graphics for optimal quality and cost."

6. **🚀 Pro Workflow**
   - "Export to DaVinci Resolve for professional color grading and final polish."

---

## 5. Pricing Section

```
┌──────────────────────────────────────────────────────┐
│                   Pricing                             │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │   Free   │  │   Pro    │  │Enterprise│          │
│  │   $0     │  │  $29/mo  │  │  Custom  │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                       │
└──────────────────────────────────────────────────────┘
```

**Pricing Cards:**

```tsx
// Pro tier (featured)
<div className="
  relative
  p-8 rounded-2xl
  bg-gradient-to-br from-indigo-600/10 to-purple-600/10
  border-2 border-accent-primary
  shadow-2xl shadow-accent-glow
">
  {/* Badge */}
  <div className="
    absolute -top-4 left-1/2 -translate-x-1/2
    px-4 py-1 rounded-full
    bg-gradient-to-r from-indigo-600 to-purple-600
    text-white text-sm font-medium
  ">
    Most Popular
  </div>
  
  {/* Content */}
  <h3 className="text-2xl font-bold text-primary mb-2">Pro</h3>
  <div className="mb-6">
    <span className="text-5xl font-bold text-primary">$29</span>
    <span className="text-secondary">/month</span>
  </div>
  
  {/* Features */}
  <ul className="space-y-3 mb-8">
    <li className="flex items-center text-secondary">
      <span className="text-green-500 mr-2">✓</span>
      Unlimited projects
    </li>
    {/* ... more features */}
  </ul>
  
  {/* CTA */}
  <button className="
    w-full py-3 rounded-xl
    bg-gradient-to-r from-indigo-600 to-purple-600
    text-white font-medium
    hover:from-indigo-500 hover:to-purple-500
    transition-all duration-200
  ">
    Start Free Trial
  </button>
</div>
```

**Three Tiers:**

### **Free**
- $0/month
- 3 projects per month
- 15-minute documentaries
- Standard quality (1080p)
- Community support
- Watermark on exports

### **Pro** (Featured)
- $29/month
- Unlimited projects
- Up to 30-minute documentaries
- 4K quality available
- Priority generation queue
- Priority support
- No watermark
- Advanced editing features

### **Enterprise**
- Custom pricing
- Unlimited everything
- Custom documentary lengths
- API access
- Dedicated support
- Custom integrations
- Team collaboration
- White-label options

---

## 6. Footer (Minimized)

```
┌──────────────────────────────────────────────────────┐
│                                                       │
│  CRTR Studio                                          │
│                                                       │
│  Docs  •  Pricing  •  Support  •  Privacy  •  Terms  │
│                                                       │
│  © 2024 CRTR Studio. All rights reserved.            │
│                                                       │
└──────────────────────────────────────────────────────┘
```

**Specifications:**
- Background: `var(--surface)`
- Border top: `1px solid var(--border)`
- Padding: `py-8 px-6`
- Text: `text-sm text-secondary`
- Links: `hover:text-primary transition-colors`
- Logo: Same as header, smaller
- Single row of links separated by `•`
- Copyright centered below links
- No social media icons
- No newsletter signup
- No extensive sitemap

---

## Responsive Breakpoints

```css
/* Mobile First */
sm: 640px   /* Tablets */
md: 768px   /* Small laptops */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

**Mobile Adjustments:**
- Hero headline: Reduce to `text-4xl`
- Stack CTA buttons vertically
- Video preview: Full width with padding
- How It Works: Stack steps vertically with connecting lines
- Features: Single column
- Pricing: Single column, swipe horizontally
- Navigation: Hamburger menu

---

## Animations

### **Page Load**
```tsx
// Fade in from bottom
className="animate-in fade-in slide-in-from-bottom-4 duration-700"
```

### **Scroll Reveals**
```tsx
// Use Intersection Observer
const fadeInOnScroll = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}
```

### **Hover Effects**
- Cards: `scale-105` on hover
- Buttons: `shadow-lg` expands
- Links: `text-primary` color shift

### **Gradient Animation**
```css
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.gradient-animate {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}
```

---

## Typography

**Font Stack:**
```css
font-family: 
  'Inter', 
  -apple-system, 
  BlinkMacSystemFont, 
  'Segoe UI', 
  sans-serif;
```

**Font Weights:**
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700

**Sizes:**
- Hero headline: `text-5xl md:text-7xl` (48px → 72px)
- Section titles: `text-4xl` (36px)
- Subsection titles: `text-2xl` (24px)
- Card titles: `text-lg` (18px)
- Body: `text-base` (16px)
- Small: `text-sm` (14px)
- Tiny: `text-xs` (12px)

---

## Accessibility

- [ ] ARIA labels on all interactive elements
- [ ] Keyboard navigation support
- [ ] Focus visible states (ring-2 ring-accent-primary)
- [ ] Color contrast WCAG AA compliant
- [ ] Alt text on all images
- [ ] Screen reader friendly
- [ ] Reduced motion support

---

## Implementation Notes

### **Key Changes from Lovable.dev:**
1. ✅ Converted to dark mode (all colors inverted)
2. ✅ Removed "Discover templates" section
3. ✅ Minimized footer (single row, essential links only)
4. ✅ Maintained clean, modern aesthetic
5. ✅ Added gradient accents for visual interest
6. ✅ Focus on documentary-specific features

### **Tailwind Classes to Use:**
- `bg-background` instead of `bg-white`
- `text-primary` instead of `text-gray-900`
- `border-border` instead of `border-gray-200`
- Dark mode gradient overlays
- Subtle shadows with color accents

### **Components to Build:**
- `<Navbar />` - Sticky navigation
- `<Hero />` - Hero section with CTA
- `<HowItWorks />` - 4-step process
- `<Features />` - Feature grid
- `<Pricing />` - Pricing cards
- `<Footer />` - Minimized footer
- `<Button />` - Primary, secondary, ghost variants
- `<Card />` - Feature/step cards

---

This design maintains the clean, modern feel of Lovable.dev while adapting it for CRTR Studio's documentary focus and dark mode aesthetic.



