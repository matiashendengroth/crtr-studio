# CRTR Studio - UI/UX Design Documentation

Complete design specifications for CRTR Studio's dark-themed documentary video platform.

---

## 📐 Design Files

### **Core Pages**
1. **[Front Page Design](./front-page-design.md)**
   - Landing page with hero, features, pricing
   - Dark mode conversion from Lovable.dev
   - Removed templates section, minimized footer
   - Clean, modern aesthetic

2. **[Storyboard Page Design](./storyboard-page-design.md)**
   - Scene grid with preview thumbnails
   - Section navigator sidebar
   - Shot type badges and status indicators
   - Scene editor modal
   - Inspired by LTX Studio

3. **[Timeline Editor Design](./timeline-editor-design.md)**
   - Multi-track video timeline
   - Video preview player
   - Scene inspector panel
   - Export workflow
   - Professional editing interface

---

## 🎨 Design System

### **Color Palette (Dark Mode)**

```css
/* Base */
--background: #0a0a0a;        /* Almost black */
--surface: #151515;           /* Cards, panels */
--surface-elevated: #1f1f1f;  /* Modals, popovers */
--border: #2a2a2a;            /* Subtle borders */

/* Text */
--text-primary: #ffffff;      /* Main text */
--text-secondary: #a0a0a0;    /* Muted text */
--text-muted: #666666;        /* Disabled text */

/* Accent */
--accent-primary: #6366f1;    /* Indigo - CTA buttons */
--accent-hover: #4f46e5;      /* Hover state */
--accent-glow: rgba(99, 102, 241, 0.15); /* Shadow effect */

/* Shot Types */
--shot-ai-video: #6366f1;        /* Indigo */
--shot-image-effect: #8b5cf6;    /* Purple */
--shot-motion-graphic: #ec4899;  /* Pink */

/* Status */
--status-pending: #f59e0b;    /* Amber */
--status-generating: #3b82f6;  /* Blue */
--status-complete: #22c55e;   /* Green */
--status-failed: #ef4444;     /* Red */
```

---

## 📏 Spacing & Layout

```css
/* Spacing Scale */
--space-xs: 0.25rem;  /* 4px */
--space-sm: 0.5rem;   /* 8px */
--space-md: 1rem;     /* 16px */
--space-lg: 1.5rem;   /* 24px */
--space-xl: 2rem;     /* 32px */
--space-2xl: 3rem;    /* 48px */
--space-3xl: 4rem;    /* 64px */

/* Border Radius */
--radius-sm: 0.5rem;   /* 8px */
--radius-md: 0.75rem;  /* 12px */
--radius-lg: 1rem;     /* 16px */
--radius-xl: 1.5rem;   /* 24px */
--radius-full: 9999px; /* Fully rounded */

/* Shadows */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.5);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.3);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.4);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.5);
--shadow-accent: 0 0 30px rgba(99, 102, 241, 0.3);
```

---

## 🔤 Typography

```css
/* Font Family */
font-family: 
  'Inter', 
  -apple-system, 
  BlinkMacSystemFont, 
  'Segoe UI', 
  sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
--text-6xl: 3.75rem;   /* 60px */
--text-7xl: 4.5rem;    /* 72px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

---

## 🧩 Component Library

### **Buttons**

```tsx
// Primary Button
<button className="
  px-6 py-3 rounded-xl
  bg-gradient-to-r from-indigo-600 to-purple-600
  hover:from-indigo-500 hover:to-purple-500
  text-white font-medium
  shadow-lg shadow-accent-glow
  transition-all duration-200
  hover:scale-105
">
  Primary Action
</button>

// Secondary Button
<button className="
  px-6 py-3 rounded-xl
  border border-border
  bg-surface-elevated
  text-primary font-medium
  hover:bg-surface
  hover:border-accent-primary
  transition-all duration-200
">
  Secondary Action
</button>

// Ghost Button
<button className="
  px-4 py-2 rounded-lg
  text-secondary hover:text-primary
  hover:bg-surface-elevated
  transition-all duration-200
">
  Ghost Action
</button>

// Icon Button
<button className="
  p-2 rounded-lg
  text-secondary hover:text-primary
  hover:bg-surface-elevated
  transition-all duration-200
">
  <Icon size={20} />
</button>
```

### **Cards**

```tsx
// Feature Card
<div className="
  p-6 rounded-xl
  bg-surface border border-border
  hover:border-accent-primary
  hover:shadow-xl hover:shadow-accent-glow
  transition-all duration-300
">
  {/* Content */}
</div>

// Scene Card
<div className="
  rounded-xl overflow-hidden
  bg-surface border border-border
  hover:shadow-xl hover:shadow-accent-glow
  transition-all duration-300
">
  {/* Header, Image, Content, Actions */}
</div>
```

### **Badges**

```tsx
// Shot Type Badge
<div className="
  inline-flex items-center gap-1.5
  px-2 py-1 rounded-md
  bg-gradient-to-r from-indigo-600 to-blue-600
  text-xs font-medium text-white
">
  🎬 AI Video
</div>

// Status Badge
<div className="
  inline-flex items-center gap-1.5
  px-2 py-1 rounded-md
  bg-green-500/10
  text-xs font-medium text-green-500
">
  ✓ Complete
</div>
```

### **Inputs**

```tsx
// Text Input
<input 
  type="text"
  className="
    w-full px-4 py-3 rounded-xl
    bg-surface border border-border
    text-primary placeholder:text-secondary
    focus:border-accent-primary
    focus:ring-2 focus:ring-accent-primary/20
    transition-all duration-200
  "
  placeholder="Enter text..."
/>

// Textarea
<textarea 
  rows={4}
  className="
    w-full px-4 py-3 rounded-xl
    bg-surface border border-border
    text-primary placeholder:text-secondary
    focus:border-accent-primary
    focus:ring-2 focus:ring-accent-primary/20
    transition-all duration-200
  "
  placeholder="Enter text..."
/>

// Slider
<input 
  type="range"
  className="w-full accent-accent-primary"
/>
```

### **Modals**

```tsx
<Dialog className="
  max-w-2xl w-full
  bg-surface-elevated rounded-2xl
  border border-border
  shadow-2xl
">
  {/* Header */}
  <div className="
    flex items-center justify-between
    p-6 border-b border-border
  ">
    <h2 className="text-xl font-semibold text-primary">
      Modal Title
    </h2>
    <button className="
      p-2 rounded-lg
      text-secondary hover:text-primary
      hover:bg-surface
    ">
      <X size={20} />
    </button>
  </div>
  
  {/* Content */}
  <div className="p-6">
    {/* Modal content */}
  </div>
  
  {/* Footer */}
  <div className="
    flex items-center justify-end gap-3
    p-6 border-t border-border
  ">
    <button>Cancel</button>
    <button>Confirm</button>
  </div>
</Dialog>
```

---

## 🎭 Animations

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* Gradient Shift */
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Usage */
.animate-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out;
}

.gradient-animate {
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
/* Base styles apply to mobile (< 640px) */

@media (min-width: 640px) {  /* sm */
  /* Tablets */
}

@media (min-width: 768px) {  /* md */
  /* Small laptops */
}

@media (min-width: 1024px) { /* lg */
  /* Desktop */
}

@media (min-width: 1280px) { /* xl */
  /* Large desktop */
}

@media (min-width: 1536px) { /* 2xl */
  /* Extra large screens */
}
```

### **Responsive Patterns**

**Navigation:**
- Desktop: Horizontal nav with links
- Mobile: Hamburger menu, slide-in drawer

**Scene Grid:**
- Desktop: 4 columns
- Tablet: 3 columns
- Mobile: 2 columns or 1 column

**Timeline:**
- Desktop: Full multi-track with panels
- Tablet: Collapsible panels
- Mobile: Bottom sheet timeline

---

## ♿ Accessibility

### **Checklist**
- [ ] ARIA labels on all interactive elements
- [ ] Keyboard navigation (Tab, Shift+Tab, Enter, Escape)
- [ ] Focus visible states (ring-2 ring-accent-primary)
- [ ] Color contrast WCAG AA compliant (4.5:1 minimum)
- [ ] Alt text on all images
- [ ] Screen reader announcements for dynamic content
- [ ] Reduced motion support (@media (prefers-reduced-motion))
- [ ] Skip to main content link
- [ ] Logical heading hierarchy (h1 → h2 → h3)

### **Keyboard Navigation**

```tsx
// Trap focus in modals
useFocusTrap(modalRef);

// Handle keyboard shortcuts
useKeyboardShortcut('Space', () => togglePlayPause());
useKeyboardShortcut('Escape', () => closeModal());
useKeyboardShortcut(['Meta', 'S'], () => saveProject());
```

---

## 🎬 Design Inspiration Sources

1. **Lovable.dev** - Front page layout and structure
2. **LTX Studio** - Storyboard and timeline interfaces
3. **DaVinci Resolve** - Professional timeline editor
4. **Premiere Pro** - Video editing patterns
5. **Linear** - Modern dark UI and interactions
6. **Vercel** - Clean gradients and shadows
7. **Raycast** - Keyboard-first interactions

---

## 🛠️ Implementation Tools

### **Frontend Stack**
- **React 18** - Component library
- **Tailwind CSS v4** - Styling
- **Framer Motion** - Animations (optional)
- **Radix UI** - Accessible primitives
- **Lucide React** - Icon library
- **React Player** - Video playback
- **WaveSurfer.js** - Audio waveforms

### **Design Tokens**
```ts
// src/styles/tokens.ts
export const colors = {
  background: '#0a0a0a',
  surface: '#151515',
  // ... all colors
};

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  // ... all spacing
};

export const typography = {
  fontFamily: 'Inter, sans-serif',
  // ... all typography
};
```

---

## 📋 Design Checklist

### **Before Implementation**
- [ ] Review all design files
- [ ] Confirm color palette with brand
- [ ] Test color contrast ratios
- [ ] Verify responsive breakpoints
- [ ] Create component inventory

### **During Implementation**
- [ ] Build design system first
- [ ] Create reusable components
- [ ] Test on multiple devices
- [ ] Implement keyboard shortcuts
- [ ] Add loading states
- [ ] Add error states
- [ ] Add empty states

### **After Implementation**
- [ ] Accessibility audit
- [ ] Performance testing
- [ ] Cross-browser testing
- [ ] User testing
- [ ] Design QA review

---

## 🚀 Next Steps

1. **Setup Design System**
   - Install Tailwind CSS v4
   - Configure design tokens
   - Create base components

2. **Build Core Components**
   - Button, Input, Card, Badge
   - Modal, Dropdown, Tooltip
   - Navigation, Footer

3. **Implement Pages**
   - Front page (landing)
   - Storyboard page
   - Timeline editor

4. **Polish & Refine**
   - Animations and transitions
   - Loading and error states
   - Responsive adjustments
   - Accessibility improvements

---

## 📞 Design Questions?

Refer to individual design docs for detailed specifications:
- **[Front Page](./front-page-design.md)** - Landing page design
- **[Storyboard](./storyboard-page-design.md)** - Scene review interface
- **[Timeline](./timeline-editor-design.md)** - Video editing interface

All designs follow dark mode, modern aesthetic, and professional video editing patterns.

