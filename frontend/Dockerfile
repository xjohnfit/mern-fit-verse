# Build stage for Vite frontend
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

# Production stage - just the build artifacts
FROM node:20-alpine AS production

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV VITE_MODE=production

# Expose frontend port
EXPOSE 5005

# Serve the static files using a simple http server
RUN npm install -g serve

CMD ["serve", "-s", "dist", "-l", "5005"]
