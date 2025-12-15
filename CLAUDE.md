Tailwind & Styling
Tailwind v4 utilities only; class order: layout→spacing→typography→colors→effects
Use shared PageHeader for top-of-page titles; keep page shells on bg-surface-subtle, rounded-3xl, p-6
Prefer design tokens (bg-surface-subtle, border-border-default, text-neutral-\*, gradients) over hardcoded values
Check index.css for available colors and keep it standardized
Use clsx when conditionals (2+ conditions or complex logic)
Prefer design tokens (w-80 h-32) over arbitrary values (w-[342px])
Always go mobile-first (text-xl sm:text-2xl lg:text-3xl)
Add one line comment short sentence on top of each file to explain that code's function
ALWAYS check styles/classNames.ts BEFORE writing inline styles - use existing constants (BUTTON, CARD, BADGE, etc.)
If a style pattern repeats 3+ times, extract to classNames.ts as a constant
Video player controls should use consistent styling (play/pause buttons, scrubber, timeline)

Components
ALWAYS search existing components in src/components/ BEFORE creating new ones
Reuse Button, Input, Textarea, Badge, Card for consistent UI patterns; no ad-hoc styling
icons/\*\*\*Icons.tsx use currentColor
Button component for action buttons (primary, secondary/grey, danger variants)
BackButton component for navigation back buttons with ChevronLeft icon
VideoPlayer component for all video playback (preview, timeline, scene review)
SceneCard component for storyboard grid display
TimelineTrack component for multi-track timeline editor
ProgressBar component for generation progress displays
Badge component for shot type indicators (AI Video, Image Effect, Motion Graphic)
Modal/Dialog via useModal hook for editing scenes, confirming actions
ConfirmDialog/AlertDialog via useConfirmDialog/useAlertDialog hooks instead of window.confirm()/alert()
If similar UI repeats 2+ times across pages, extract reusable sub-component
For dropdowns/popovers, use useDropdownState hook for click-outside handling
Keep components under 300 lines - extract sub-components if exceeded
Timeline editor components should be modular (Track, Clip, Playhead, Scrubber)

Route Guards & Authentication
Use ProtectedRoute for all authenticated pages
Use PublicRoute for landing page, pricing, about pages
Pattern: <ProtectedRoute><DashboardPage /></ProtectedRoute>
All project-related routes require authentication
Redirect unauthenticated users to login page
Use useAuth hook to access user session and auth state

User Access & Permissions
All users have same access level (no role-based restrictions)
Each user can:
- Create unlimited projects
- Access all their own projects
- Edit/delete their own projects only
- Export projects to DaVinci Resolve
- Manage their account settings

Sign-Up Flow:
- Public signup available via /signup
- Email/password or OAuth (Google, GitHub)
- Email verification required
- Free tier: 3 projects/month
- Pro tier: Unlimited projects

Project, Scene & Shot Patterns
Projects are user-scoped (each user owns their projects)
Only project owners can edit/delete projects (checked via userId === currentUserId)
Projects have status: DRAFT, GENERATING, COMPLETE, EXPORTED
Scenes are sequences/locations (e.g., "Explaining Black Holes") - typically 20-30 seconds
Shots are individual camera angles within scenes - typically 3-7 seconds each
Flexible shot count: Claude determines 1-5 shots per scene based on narrative needs
Shot types: AI_VIDEO (50%), IMAGE_EFFECT (30%), MOTION_GRAPHIC (20%)
Shot angles: WIDE, MEDIUM, CLOSE_UP, EXTREME_CLOSE_UP, DETAIL, B_ROLL, etc.
Each scene generates voiceover chunk separately (not entire script at once)
Scene cards show all shots within that scene
ShotCard component shows shot type, angle, source (stock vs AI), and cost
Use SceneEditor modal for editing scenes and their shots
Shot sequencing tracked via previousShotId for v2v continuity

Asset Priority & Shot Orchestration
Claude orchestrates asset strategy for each shot with this priority:
1. STOCK_VIDEO: Pexels Video API, NASA Video Library (FREE, authentic, instant)
2. STOCK_IMAGE: Pexels, NASA, Hubble, ESA + Ken Burns/pan/zoom effects (FREE)
3. MOTION_GRAPHIC: Placeholder with instructions for user to create (data viz, timelines, maps)
4. AI_VIDEO: fal.ai Nano Banana Pro + Kling O1 ONLY when no real footage exists (last resort)

Shot Type Rules (Distribution Target: 50/30/20)
AI_VIDEO (50% of shots): fal.ai Kling O1 i2v with starting frame
  - First shot in scene: i2v ($0.112/s)
  - Sequential shots: v2v for continuity ($0.168/s) - future feature
  - Use when: No real footage exists, conceptual visualizations, impossible shots
IMAGE_EFFECT (30% of shots): Stock first, AI fallback
  - Stock media: FREE (Pexels, NASA, Hubble) - prioritize this
  - AI fallback: fal.ai Nano Banana Pro 4K ($0.30) only if no stock match
  - Claude evaluates relevance (>70% match required for stock)
  - Effects applied in export: Ken Burns, pan, zoom, parallax
MOTION_GRAPHIC (20% of shots): User creates in After Effects
  - Export After Effects project templates with composition instructions
  - Include JSON data files for data visualizations
  - Best for: Data visualizations, timelines, maps, infographics, text overlays, lower thirds

Shot Angle Guidance
WIDE/EXTREME_WIDE: Establishing shots, context, landscapes (often stock available)
MEDIUM: Main action, dialogue, key moments (mix of stock and AI)
CLOSE_UP/EXTREME_CLOSE_UP: Details, emotion, specific focus (often AI or stock images)
B_ROLL: Supporting footage, cutaways (prioritize stock footage)
DETAIL: Macro shots, object focus (stock images with zoom)

Intelligent Orchestration
Claude determines shot count per scene (1-5 shots, flexible)
Multi-shot scenes only where narrative benefits
Stock footage prioritized (80-90% of shots aim for free stock)
AI generation only when necessary (10-20% of shots)
User maintains full creative control - CRTR packages, user edits
See docs/technical/intelligent-orchestration.md for complete logic

Data Fetching & State
TanStack Query for all fetching/caching - no custom loading/error logic, no global state
ALL query hooks MUST validate API responses with Zod schemas using .safeParse()
Pattern: Define schema → validate response → throw ZodError on failure → return validated data
Export types from schemas using z.infer<typeof Schema> (single source of truth)
Use apiClient for all API calls
Map errors through extractApiError
Mutations for create/update/delete in hooks/mutations/
Queries for reads in hooks/queries/
Use useMutationFactory with createMutationFn for consistent error handling and automatic query invalidation
Define staleTime as constants (e.g., const FIVE_MINUTES = 5 * 60 * 1000)
Server state → TanStack Query, UI state → React Context (only when needed)
No Redux/Zustand

Error Handling & Logging
NEVER use console.error or console.warn directly - use centralized error logger from utils/errorLogger.ts
Use category-specific loggers: logApiValidationError, logMutationError, logQueryError, logAuthError, logComponentError
Pattern: logXxxError(message, error, context, metadata) where metadata is optional object with relevant data
API validation failures: logApiValidationError('Invalid response', validation.error, 'functionName', { responseData })
Mutation errors: logMutationError('Failed to update', error, 'hookName', { id, payload })
Query errors: logQueryError('Failed to fetch', error, 'queryName', { params })
Auth errors: logAuthError('Login failed', error, 'componentName', { email })
Component errors: logComponentError('Render error', error, 'ErrorBoundary', { errorInfo })
ErrorBoundary uses logComponentError for all caught errors
Always provide context (function/hook/component name) and relevant metadata for debugging
In development, logs include full details; in production, logs can be sent to external services

Validation & Forms
Use Zod for all validation
Validate with .safeParse()
Never use useState + onChange
Always use <form> + onSubmit + FormData
Inputs must have name attribute
Use defaultValue for prefilled fields
Use useModalForm for modal create/update logic

Code Organization
Keep logic out of pages by extracting feature hooks to hooks/pages/ (e.g., useClientsContent, useLibraryContent)
Pages should be <250 lines - extract sub-components to page/components/ directory if exceeded
Components must be <300 lines - extract focused sub-components if exceeded
Complex state (5+ useState calls) indicates need for extraction to custom hook
Loading states use neutral text style (text-neutral-500)
AppSuspense should remain the root wrapper for lazy routes
Extract computation logic to custom hooks with useMemo
Use useItemList for modal state + CRUD handlers in list components
Use useSearch and usePagination for search/filter/pagination patterns
Keep components small and focused (single responsibility)
Extract utility functions to utils/ (dateUtils, notificationUtils, etc.) instead of inline
Create domain-specific utility files for repeated logic patterns
Prefer functional patterns over classes (except React components)
TypeScript Patterns
Use interface for component props (extendable with extends)
Use type for unions, utilities, transforms (not extendable)
Avoid any - use unknown and narrow with type guards if needed
Props interface comment goes ABOVE interface, not inline
Export types from Zod schemas: export type Recipe = z.infer<typeof RecipeSchema>

Adding New Features Checklist
When adding new pages or features, ALWAYS remember to:
Add route definitions to main.tsx (with proper lazy loading and route guards)
Add translation keys to BOTH locales: src/i18n/locales/en/ and src/i18n/locales/no/
Update constants/routes.ts if adding new route paths
Use role-based route guards (ClinicOnlyRoute, CreatorOnlyRoute, OrgOnlyRoute) when applicable
Test that all user-facing text uses i18n translations (useTranslation hook)

General Rules
No dead code or empty TODOs (TODOs waiting for backend are acceptable with clear comment)
NEVER create files speculatively "for future use" - only create when immediately needed
When replacing/refactoring components or hooks, DELETE the old unused files immediately
Before creating new hooks/components, verify the feature is actively being used
Periodically audit for unused files (search for imports to verify usage)
Keep layout/position utilities inline; move visual styles into components
No new libraries unless approved
Always explicitly ask before making backend changes
Code must be clean, readable, and maintainable
Ask before guessing if unsure
ALWAYS search existing components/hooks/utils before creating new ones
When refactoring, remove unused imports and dead code
When implementing a new feature, ALWAYS include clear testing instructions in your response to the user (step-by-step guide for manual testing, not code)
CRITICAL: When adding new fields to an API request/response, trace the ENTIRE data flow from frontend → controller → use case → repository to ensure every layer passes the new fields correctly. Check: (1) Frontend mutation/query sends the fields, (2) Backend DTO validates the fields, (3) Controller passes fields to use case, (4) Use case uses the fields in business logic. Add comprehensive logging at each layer to verify data flow during testing.

Backend Security Architecture
All API requests require valid JWT token in Authorization header
User ID extracted from JWT and verified on every request
Controllers validate userId from JWT matches resource ownership before mutations
Projects are user-scoped: WHERE project.userId = authenticatedUserId
Scenes belong to projects: validate project ownership before scene operations
Pattern: Controller → verify JWT → check resource ownership → execute operation
API keys for external services (Kling, Nanobana, GenAIPro) stored in environment variables, NEVER exposed to frontend
Frontend sends: projectId, sceneId for operations
Backend validates: user owns project before allowing any operations
Webhooks from AI services (Kling video complete) verify signature before processing

Deployment & Monorepo Structure
Project is a Yarn Berry workspace monorepo with modular packages
Root node_modules contains shared dependencies, workspace packages use PnP (Plug'n'Play)
Docker Compose for local development (api + postgres + redis)
Separate Dockerfiles for web and api packages
GitHub Actions workflow handles CI/CD: test → build → deploy
Web frontend: Deploy to Vercel/Netlify (automatic from main branch)
API backend: Deploy to Railway/Render/Fly.io (containerized)
Prisma migrations run automatically on deployment (migrate deploy)
Environment variables managed per environment (dev, staging, prod)
API services require proper API keys: KLING_API_KEY, NANOBANA_API_KEY, GENAIPRO_API_KEY, CLAUDE_API_KEY
Never commit .env files or API keys to git
Use separate database instances for dev/staging/prod
Redis for job queues (video generation, voiceover chunks)

AI Service Integration Patterns
All AI service calls go through backend services layer (never from frontend)
Use BullMQ job queues for long-running AI generations (video, images, voiceover)
Poll-based status checks for async operations (Kling video generation takes 30-60s)
Store webhook signatures for AI service callbacks (verify authenticity)
Implement retry logic with exponential backoff for failed generations
Cache generated assets (starting frames, videos) with CDN URLs
Pattern: Frontend → API endpoint → Queue job → Poll status → Webhook callback → Update DB → Notify frontend
Log all AI service costs per generation for billing analytics
Rate limit API calls to prevent quota exhaustion
Fallback strategies if service fails (retry, use alternative, mark for manual review)

AI Service Provider: fal.ai (Unified)
Use fal.ai for all image and video generation (simplifies integration)
Development: Fast iteration, low cost (~$7.65/project)
- fal.ai FLUX/dev ($0.10/image)
- fal.ai Kling Standard (~$0.02/second)
- 10-second clips for faster testing
Production: Maximum quality for customers (~$52.53/project)
- fal.ai FLUX/pro ($0.20/image)
- fal.ai Kling O1 i2v ($0.112/second)
- 20-second clips for professional quality
NEVER hardcode model selection - use environment-based configuration
Single FalAIService client handles all image/video generation
Benefits: 1 API key, consistent errors, easier monitoring, 75% less code
Always track costs per generation with CostTracker.trackGeneration()
See docs/technical/fal-ai-integration.md for complete implementation guide

Voiceover Generation Strategy
NEVER generate entire script voiceover in one API call
Generate per-scene chunks using GenAIPro API
Each scene has its own audioUrl stored separately
Benefits: easier editing, faster regeneration, better error handling
Pattern: For each scene → genAIPro.generate(scene.narration) → store scene.audioUrl
User can regenerate individual scene voiceover without affecting others
Timeline assembles all scene audio chunks in sequence
Export includes separate audio files per scene + combined narration track

Video Generation Workflow
Scene generation has three paths based on shotType:
1. AI_VIDEO: Nanobana (frame) → Kling (video) → store videoUrl
2. IMAGE_EFFECT: 
   a. Try stock media first (NASA/Pexels/Hubble API search)
   b. Claude evaluates relevance (>70% match required)
   c. Use stock if good match found (save $0.24, often higher quality)
   d. Fall back to Nanobana Pro 4K if no match
   e. Apply effect metadata → export as image
3. MOTION_GRAPHIC: Store description only → export as instruction file
Queue video generations 3-5 concurrent to avoid overwhelming APIs
Track generation status: QUEUED → GENERATING → COMPLETE → FAILED
Allow regeneration with same/edited prompt (different seed for variations)
Store generation metadata (prompt, seed, duration, cost, source) for debugging
Track image source: 'nasa' | 'pexels' | 'hubble' | 'ai_generated' in database
Implement automatic quality validation before marking complete
Progress tracking: emit real-time updates via WebSocket or SSE

Stock Media Integration
All stock media APIs are free (NASA, Pexels, Hubble, ESA)
Use StockMediaSelector.findStockMedia() before AI generation
Claude-based relevance scoring ensures quality matches
Store attribution metadata for ESA images (NASA/Pexels are public domain)
See docs/technical/stock-media-integration.md for complete implementation

Timeline Editor Implementation
Multi-track architecture: video, narration, music, graphics
Each track is a separate component (modular, reusable)
Video track shows scene clips with thumbnails and duration
Narration track shows waveform visualization of combined audio
Support zoom in/out for precision editing (10s to full timeline view)
Playhead syncs across all tracks
Scrubbing updates video preview in real-time
Click scene clip → opens Scene Inspector panel with regeneration options
Undo/redo stack tracks all timeline modifications
Auto-save every 30 seconds to prevent data loss

Export to Premiere Pro
Generate FCPXML project file compatible with Premiere Pro (and Final Cut Pro)
Export folder structure: stock-videos/, stock-images/, ai-generated/, motion-graphics/, audio/
Include metadata.json with shot information, sources, and costs
Generate README.txt with Premiere import instructions
For AI_VIDEO shots: export MP4 files (H.264, 1920x1080, 30fps)
For IMAGE_EFFECT shots: export high-res images (JPEG/PNG) with effect metadata + attribution if required
For MOTION_GRAPHIC shots: export After Effects project templates (.aep) with composition instructions and data files
Include README with stock media attributions (ESA requires attribution, NASA/Pexels do not)
Audio: export individual scene WAV files + combined narration track
Compress as ZIP file for download
Track export success/failure for analytics
