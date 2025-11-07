# Comprehensive Dockerfile for MERN Spotify App
# --- Frontend Build Stage ---
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json ./
# Install patch-package globally to handle postinstall scripts
RUN npm install -g patch-package
RUN npm install
COPY frontend/ ./
# Set public environment variables for Vite build
ENV MODE=development
RUN npm run build

# --- Backend Build Stage ---
FROM node:20-alpine AS backend-build
WORKDIR /app
# Copy root package.json since backend doesn't have its own
COPY package.json package-lock.json ./
COPY tsconfig.json ./
RUN npm ci
COPY backend/ ./backend/
# Build TypeScript
RUN npm run build

# Copy frontend build to backend
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# --- Production Stage ---
FROM node:20-alpine AS production
WORKDIR /app

# Install production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built backend files
COPY --from=backend-build /app/backend ./backend/

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Set environment variables (override in Kubernetes as needed)
ENV NODE_ENV=production
ENV PORT=5003

# Expose backend port
EXPOSE 5003

# Start backend server using ts-node since it's in dependencies
CMD ["npm", "start"]