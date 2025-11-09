# --- Frontend Build Stage ---
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
# Install patch-package globally to handle postinstall scripts
RUN npm install -g patch-package
RUN npm ci
COPY frontend/ ./
# Set environment variables for Vite build
ENV NODE_ENV=production
# Run build with debug output
RUN npm run build --verbose

# --- Backend Build Stage ---
FROM node:20-alpine AS backend-build
WORKDIR /app

# Copy package files and TypeScript configuration
COPY package.json package-lock.json ./
COPY tsconfig.json ./
COPY scripts/ ./scripts/

# Ensure files have correct permissions
RUN chmod 644 tsconfig.json package.json package-lock.json

# Install dependencies
RUN npm ci

# Copy backend source code
COPY backend/ ./backend/

# Debug: List files to ensure everything is in place
RUN echo "=== Current working directory ===" && \
    pwd && \
    echo "=== Checking files ===" && \
    ls -la && \
    echo "=== TypeScript config exists? ===" && \
    if [ -f tsconfig.json ]; then \
    echo "✓ tsconfig.json found" && \
    echo "=== TypeScript config content ===" && \
    cat tsconfig.json && \
    echo "=== Validating TypeScript config ===" && \
    npx tsc --showConfig --project ./tsconfig.json; \
    else \
    echo "✗ tsconfig.json missing - creating minimal config" && \
    echo '{"compilerOptions":{"target":"ES2020","module":"CommonJS","outDir":"./dist","rootDir":"./"},"include":["backend/**/*.ts"]}' > tsconfig.json; \
    fi && \
    echo "=== Backend files ===" && \
    ls -la backend/

# Build TypeScript to JavaScript with multiple fallback options
RUN echo "=== Starting TypeScript build ===" && \
    (npm run build || \
    echo "npm run build failed, trying direct tsc..." && npx tsc || \
    echo "tsc failed, trying with explicit config..." && npx tsc -p ./tsconfig.json || \
    echo "All methods failed, using manual compilation..." && npx tsc --outDir ./dist --rootDir ./ backend/**/*.ts) && \
    echo "=== Build completed ==="

# Verify build output and ensure main files exist
RUN echo "=== Build output ===" && \
    ls -la dist/ && \
    ls -la dist/backend/ && \
    echo "=== Checking main files ===" && \
    test -f dist/backend/index.js && echo "✓ Main file exists" || (echo "✗ Main file missing" && exit 1)

# Copy frontend build to backend
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# --- Production Stage ---
FROM node:20-alpine AS production
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Install production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy compiled JavaScript files from build stage
COPY --from=backend-build /app/dist ./dist

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Set environment variables (override in Kubernetes as needed)
ENV NODE_ENV=production
ENV PORT=5003

# Expose backend port
EXPOSE 5003

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5003/api/health || exit 1

# Start backend server using compiled JavaScript
CMD ["npm", "run", "start:prod"]