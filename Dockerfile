# Multi-stage Dockerfile for Google Cloud Run
# Stage 1: Build Frontend and Dependencies
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies (including devDependencies needed for vite build)
RUN npm ci

# Copy application source
COPY . .

# Build the client distribution (outputs to /app/dist)
RUN npm run build

# Stage 2: Production Container
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
# Google Cloud Run provides PORT=8080 by default
ENV PORT=8080

COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built frontend assets and server file
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/tsconfig.json ./

EXPOSE 8080

# Start server.ts using tsx (respects process.env.PORT)
CMD ["npm", "start"]
