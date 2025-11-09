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
WORKDIR /app/backend
COPY package.json package-lock.json ../
COPY backend/package.json backend/package-lock.json ./
COPY backend/ ./
COPY tsconfig.json ./
RUN npm ci
RUN npm run build

# --- Production Stage ---
FROM node:20-alpine AS production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy backend dist
COPY --from=backend-build /app/backend/dist ./dist

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

ENV NODE_ENV=production
ENV PORT=5003

EXPOSE 5003
CMD ["npm", "run", "start:prod"]
