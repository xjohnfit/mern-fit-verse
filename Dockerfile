# --- Frontend Build Stage ---
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install -g patch-package
RUN npm ci
COPY frontend/ ./
ENV NODE_ENV=production
RUN npm run build --verbose

# --- Backend Build Stage ---
FROM node:20-alpine AS backend-build
WORKDIR /app

# Copy package files and TypeScript configuration
COPY package.json package-lock.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy backend source code
COPY backend/ ./backend/

# Build TypeScript to JavaScript
RUN npm run build

# --- Production Stage ---
FROM node:20-alpine AS production
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Install production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy backend dist
COPY --from=backend-build /app/dist ./dist

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5003

# Expose backend port
EXPOSE 5003

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5003/api/health || exit 1

# Start the application (directly run the compiled JavaScript)
CMD ["node", "dist/backend/index.js"]
