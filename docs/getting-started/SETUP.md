# CRTR Studio - Setup Guide

Complete setup instructions to get the development environment running.

---

## Prerequisites

Make sure you have these installed:

- **Node.js 20 LTS** or higher
- **Yarn** (will be installed automatically via Corepack)
- **Docker** and **Docker Compose**
- **Git**

---

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
# Enable Corepack (comes with Node.js 16.10+)
corepack enable

# Install all dependencies
yarn install
```

### 2. Start Docker Services

```bash
# Start PostgreSQL and Redis
yarn docker:up

# Check they're running
docker ps
```

You should see `crtr-postgres` and `crtr-redis` running.

### 3. Setup Environment & Database

```bash
# Copy environment variables
cp packages/api/env.example packages/api/.env

# ⚠️ IMPORTANT: Add your API keys to packages/api/.env
# See API-KEYS-SETUP.md for the keys you have
# Required: FAL_API_KEY, CLAUDE_API_KEY
# Already have: PEXELS_API_KEY, GENAIPRO_API_KEY, NASA_API_KEY

# Generate Prisma client
cd packages/api
yarn db:generate

# Run migrations
yarn db:push

# (Optional) Seed with sample data
yarn db:seed
```

### 4. Start Development Servers

Open **3 separate terminals**:

**Terminal 1 - Backend API:**
```bash
yarn dev:api
```
API will run on http://localhost:3001

**Terminal 2 - BullMQ Worker (when ready):**
```bash
yarn dev:worker
```
Processes background jobs (video generation, etc.)

**Terminal 3 - Frontend:**
```bash
yarn dev:web
```
Frontend will run on http://localhost:5173

### 5. Verify It's Working

- **Frontend:** Open http://localhost:5173 - You should see the CRTR Studio home page
- **Backend:** Visit http://localhost:3001/health - Should return `{"status":"ok"}`
- **Database:** Run `yarn db:studio` - Opens Prisma Studio on http://localhost:5555

---

## Project Structure

```
crtr-studio/
├── packages/
│   ├── api/                    # Backend (Node.js + Express + Prisma)
│   │   ├── src/
│   │   │   ├── controllers/    # Route handlers
│   │   │   ├── use-cases/      # Business logic
│   │   │   ├── repositories/   # Database access
│   │   │   ├── services/       # External APIs (Kling, NASA, etc.)
│   │   │   ├── routes/         # API routes
│   │   │   ├── middleware/     # Express middleware
│   │   │   └── utils/          # Helpers
│   │   ├── prisma/
│   │   │   └── schema.prisma   # Database schema
│   │   └── package.json
│   │
│   └── web/                    # Frontend (React + Vite + Tailwind)
│       ├── src/
│       │   ├── components/     # Reusable UI components
│       │   ├── pages/          # Page components
│       │   ├── hooks/          # Custom React hooks
│       │   ├── utils/          # Helpers
│       │   ├── styles/         # Global styles
│       │   └── types/          # TypeScript types
│       └── package.json
│
├── docs/                       # Architecture & feature docs
├── docker-compose.yml          # Docker services config
└── package.json                # Root workspace config
```

---

## Development Workflow

### Backend Development

**Add a new API endpoint:**
1. Create route in `packages/api/src/routes/`
2. Create controller in `packages/api/src/controllers/`
3. Create use case in `packages/api/src/use-cases/`
4. Update `packages/api/src/routes/index.ts`

**Modify database schema:**
```bash
cd packages/api
# Edit prisma/schema.prisma
yarn db:push           # Push changes to database
yarn db:generate       # Regenerate Prisma client
```

### Frontend Development

**Add a new page:**
1. Create component in `packages/web/src/pages/`
2. Add route in `packages/web/src/App.tsx`
3. Use TanStack Query for data fetching

**Styling:**
- Use Tailwind CSS utility classes
- Dark mode colors already configured in `tailwind.config.js`
- Check `docs/design/README.md` for design system

---

## Useful Commands

### Root (run from project root)

```bash
yarn dev              # Start both API and web
yarn dev:api          # Start API only
yarn dev:web          # Start web only
yarn dev:worker       # Start BullMQ worker

yarn build            # Build all packages
yarn lint             # Lint all packages
yarn type-check       # TypeScript check all packages

yarn docker:up        # Start Docker services
yarn docker:down      # Stop Docker services
yarn docker:logs      # View Docker logs

yarn clean            # Clean all build outputs and dependencies
```

### API Commands

```bash
cd packages/api

yarn dev              # Start dev server with hot reload
yarn build            # Build for production
yarn start            # Start production server

yarn db:studio        # Open Prisma Studio (database GUI)
yarn db:migrate       # Create and run migrations
yarn db:push          # Push schema changes (dev only)
yarn db:seed          # Seed database with sample data
yarn db:generate      # Generate Prisma client
```

### Web Commands

```bash
cd packages/web

yarn dev              # Start dev server
yarn build            # Build for production
yarn preview          # Preview production build
```

---

## Environment Variables

### Backend (`packages/api/.env`)

```env
# Copy from packages/api/env.example
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://crtr:crtr_dev_password@localhost:5432/crtr_studio
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-here

# AI Services (Using fal.ai as unified provider)
FAL_API_KEY=
IMAGE_GEN_MODEL=fal-ai/flux/dev
VIDEO_GEN_MODEL=fal-ai/kling-video/v1/standard

# Other AI Services
CLAUDE_API_KEY=
GENAIPRO_API_KEY=
PEXELS_API_KEY=
NASA_API_KEY=
```

### Frontend
No environment variables needed for development (proxied through Vite).

---

## Docker Services

### PostgreSQL
- **Port:** 5432
- **User:** crtr
- **Password:** crtr_dev_password
- **Database:** crtr_studio

### Redis
- **Port:** 6379
- **Used for:** Job queues (BullMQ)

### Management

```bash
# View logs
docker-compose logs -f postgres
docker-compose logs -f redis

# Restart service
docker-compose restart postgres

# Stop all services
yarn docker:down

# Remove volumes (WARNING: deletes all data)
docker-compose down -v
```

---

## Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
cd packages/api
yarn db:generate
```

### Port already in use
```bash
# Find process using port 3001 (API)
lsof -ti:3001 | xargs kill -9

# Or port 5173 (Web)
lsof -ti:5173 | xargs kill -9
```

### Docker containers not starting
```bash
# Remove old containers
docker-compose down -v

# Rebuild and start
docker-compose up -d --build
```

### Yarn install fails
```bash
# Clear cache
yarn cache clean

# Remove node_modules
yarn clean

# Reinstall
yarn install
```

### Database connection issues
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check connection
docker exec -it crtr-postgres psql -U crtr -d crtr_studio -c "SELECT 1"
```

---

## Next Steps

### Phase 1: Authentication
1. Implement user registration/login
2. Add JWT middleware
3. Create protected routes

### Phase 2: Project Creation
1. Create project form
2. Integrate Claude API for script generation
3. Script review/edit page

### Phase 3: Scene Generation
1. Claude API for scene breakdown
2. GenAIPro API for voiceover chunks
3. Stock media integration (NASA, Pexels)
4. Nanobana/Kling for AI generation

### Phase 4: Storyboard
1. Scene grid display
2. Scene editor modal
3. Drag & drop reordering
4. Regenerate assets

### Phase 5: Video Generation
1. Kling AI integration
2. BullMQ job queue
3. Progress tracking (WebSocket/SSE)

### Phase 6: Timeline Editor
1. Multi-track timeline component
2. Video player with controls
3. Scene inspector panel
4. Scrubbing & playback

### Phase 7: Export
1. DaVinci Resolve XML generation
2. Asset packaging
3. ZIP creation
4. Download link

---

## Documentation

- **Architecture:** `docs/technical/architecture.md`
- **Workflow:** `docs/technical/workflow-summary.md`
- **Features:** `docs/features/`
- **Design System:** `docs/design/README.md`
- **Coding Rules:** `CLAUDE.md`
- **Pricing Strategy:** `docs/PRICING.md`

---

## Getting Help

- Check `docs/` folder for detailed specifications
- Review `CLAUDE.md` for coding guidelines
- See feature docs in `docs/features/` for implementation details

---

**Ready to build!** 🚀 Start with authentication and work through each phase systematically.

