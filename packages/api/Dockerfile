# Multi-stage Dockerfile for CRTR Studio API

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Enable Corepack for Yarn Berry
RUN corepack enable

# Copy workspace files
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY packages/api/package.json ./packages/api/

# Install dependencies
RUN yarn install --immutable

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Enable Corepack
RUN corepack enable

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/api/node_modules ./packages/api/node_modules

# Copy source
COPY packages/api ./packages/api
COPY tsconfig.base.json ./

# Generate Prisma client
WORKDIR /app/packages/api
RUN yarn db:generate

# Build TypeScript
RUN yarn build

# Stage 3: Production
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

# Enable Corepack
RUN corepack enable

# Copy necessary files
COPY --from=builder /app/packages/api/dist ./dist
COPY --from=builder /app/packages/api/node_modules ./node_modules
COPY --from=builder /app/packages/api/prisma ./prisma
COPY --from=builder /app/packages/api/package.json ./

# Expose port
EXPOSE 3001

# Run migrations and start server
CMD ["sh", "-c", "yarn db:push && node dist/index.js"]

# Stage 4: Development
FROM node:20-alpine AS development
WORKDIR /app

# Enable Corepack
RUN corepack enable

# Copy workspace files
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY packages/api/package.json ./packages/api/

# Install dependencies
RUN yarn install

# Copy source
COPY packages/api ./packages/api
COPY tsconfig.base.json ./

# Generate Prisma client
WORKDIR /app/packages/api
RUN yarn db:generate

# Expose port
EXPOSE 3001

# Start dev server
CMD ["yarn", "dev"]



