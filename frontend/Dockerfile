# Multi-stage build for optimized frontend image

# --- Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --ignore-scripts

# Copy frontend source code and configuration
COPY . .

# Build the Vite application
RUN npm run build

# --- Production Stage ---
FROM nginx:alpine AS production

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user for security
RUN addgroup -g 1001 -S frontend-app && \
    adduser -S frontend-app -u 1001

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# Copy built files from builder
COPY --from=builder /app/dist .

# Set ownership to non-root user
RUN chown -R frontend-app:frontend-app /app

# Switch to non-root user
USER frontend-app

# Set environment variables
ENV VITE_MODE=production
ENV VITE_BACKEND_URL=https://api.fitverse.codewithxjohn.com

# Expose frontend port
EXPOSE 5005

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:5005/ || exit 1
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
