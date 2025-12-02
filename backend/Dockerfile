# Multi-stage build for optimized backend API image

# --- Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and TypeScript configuration
COPY package.json package-lock.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --ignore-scripts

# Copy backend source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# --- Production Stage ---
FROM node:20-alpine AS production

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Copy necessary runtime files
COPY --from=builder /app/config ./config

# Set ownership to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5004

# Expose backend API port
EXPOSE 5004

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:5004/api/health || exit 1

# Start the backend API
CMD ["node", "dist/index.js"]