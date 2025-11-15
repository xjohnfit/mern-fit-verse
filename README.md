# 🏋️‍♂️ MERN FitVerse

<div align="center">

![MERN FitVerse Logo](https://raw.githubusercontent.com/xjohnfit/mern-fit-verse/main/frontend/public/fit-verse-logo-no-bg.png)

**A Modern Full-Stack Social Fitness Platform**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/xjohnfit/mern-fit-verse)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/xjohnfit/mern-fit-verse)
[![License](https://img.shields.io/badge/license-ISC-orange)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-enabled-blue)](https://hub.docker.com/r/xjohnfit/mern-fit-verse)
[![Kubernetes](https://img.shields.io/badge/kubernetes-ready-green)](kubernetes/)
[![CI/CD](https://img.shields.io/badge/Jenkins-automated-orange)](Jenkinsfile)

**[Live Demo](https://fitverse-demo.com) • [Documentation](docs/) • [API Docs](docs/api.md) • [Report Bug](https://github.com/xjohnfit/mern-fit-verse/issues)**

</div>

---

## 📋 Table of Contents

- [🚀 Overview](#-overview)
- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [🏗 Architecture](#-architecture)
- [⚡ Quick Start](#-quick-start)
- [🐳 Docker Deployment](#-docker-deployment)
- [☸️ Kubernetes Deployment](#️-kubernetes-deployment)
- [🔧 Development](#-development)
- [🧪 Testing](#-testing)
- [📊 CI/CD Pipeline](#-cicd-pipeline)
- [🔒 Security](#-security)
- [📡 API Documentation](#-api-documentation)
- [🎨 Frontend Architecture](#-frontend-architecture--components)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🚀 Overview

**MERN FitVerse** is a modern, full-stack social fitness platform that combines fitness tracking with social networking features. Built with cutting-edge web technologies, it provides users with a comprehensive platform to share their fitness journey, connect with like-minded individuals, and achieve their health goals through community support and data-driven insights.

### 🎯 Mission

To create a vibrant fitness community where users can share their journey, motivate each other, and achieve their health and wellness goals through social interaction, data tracking, and personalized experiences. We believe fitness is more enjoyable and sustainable when shared with others.

### 🌟 Current Capabilities

- **🔐 Secure Authentication**: JWT-based authentication with comprehensive user validation
- **👥 Social Networking**: Follow/unfollow users, build your fitness community
- **📱 Social Feed**: Share posts, images, and fitness updates with your network
- **💬 Interactive Features**: Like, comment, and engage with community posts
- **🔔 Real-time Notifications**: Stay updated with likes, follows, and comments
- **📊 Profile Management**: Comprehensive user profiles with fitness metrics
- **🎨 Modern UI/UX**: React 19 with Tailwind CSS and Radix UI components
- **🌓 Theme Support**: Dark/light mode with system preference detection
- **📱 Responsive Design**: Optimized for all devices with mobile-first approach
- **🐳 Production Ready**: Docker containerization and Kubernetes deployment
- **⚙️ CI/CD Pipeline**: Automated Jenkins pipeline with security scanning
- **☁️ Cloud Integration**: Cloudinary for image management and optimization

---

## ✨ Features

### � Authentication & Security

- **Secure Registration/Login**: JWT-based authentication with bcrypt password hashing
- **User Validation**: Email format validation, username uniqueness, password strength requirements
- **Session Management**: HTTP-only cookies for secure token storage
- **Profile Privacy**: Secure user data protection and validation

### 👥 Social Features

- **User Profiles**: Complete profile system with photos, personal info, and fitness goals
- **Follow System**: Follow/unfollow other users to build a fitness community
- **Suggested Users**: Algorithm-based user suggestions for expanding your network
- **Profile Views**: View other users' profiles and their fitness journey

### 📱 Social Feed & Posts

- **Create Posts**: Share fitness updates, progress photos, and motivational content
- **Image Upload**: Cloudinary integration for secure image storage and optimization
- **Feed System**: Personalized feed showing posts from followed users
- **Post Interactions**: Like/unlike posts to engage with the community
- **Comments System**: Comment on posts to encourage and interact with others
- **Content Management**: Delete your own posts and comments

### 📊 User Analytics & Profiles

- **Profile Metrics**: Track height, weight, fitness goals, and personal information
- **Profile Photos**: Upload and manage profile pictures with Cloudinary
- **User Statistics**: View followers, following counts, and post engagement
- **Profile Updates**: Comprehensive profile editing with real-time validation

### 🔔 Notification System

- **Real-time Notifications**: Get notified for likes, follows, comments, and interactions
- **Notification Management**: Mark notifications as read and delete old notifications
- **Activity Tracking**: Track all social interactions and engagement

### 🏋️‍♀️ Fitness Hub (Coming Soon)

- **Workout Planning**: Personalized workout routines and exercise tracking
- **Exercise Library**: Comprehensive database with instructional content
- **Progress Analytics**: Detailed workout performance metrics and insights
- **Smart Goals**: AI-powered goal setting and achievement tracking

### 🥗 Nutrition Hub (Coming Soon)

- **Meal Planning**: Personalized nutrition plans based on fitness goals
- **Macro Tracking**: Track proteins, carbs, fats with detailed analytics
- **Food Scanner**: Barcode scanning for quick meal logging
- **Recipe Sharing**: Share healthy recipes and meal prep ideas

### 🎨 Modern User Experience

- **Responsive Design**: Mobile-first approach optimized for all devices
- **Dark/Light Themes**: System preference detection with manual toggle
- **Modern UI Components**: Built with Radix UI primitives and Tailwind CSS
- **Smooth Animations**: Enhanced UX with CSS animations and transitions
- **Toast Notifications**: Real-time feedback with Sonner toast system
- **Loading States**: Skeleton loading and proper loading indicators

---

## 🛠 Tech Stack

### Frontend Technologies

```typescript
React 19.1.1          | Modern React with concurrent features and hooks
TypeScript 5.9.3      | Static type checking and enhanced developer experience
Vite 7.1.7            | Lightning-fast build tool and dev server
Tailwind CSS 4.1.16   | Utility-first CSS framework with custom config
```

### UI/UX Libraries

```typescript
Radix UI              | Accessible, unstyled UI component primitives
@radix-ui/react-avatar     | Avatar component with fallback support
@radix-ui/react-navigation-menu | Accessible navigation menus
@radix-ui/react-slot       | Composition utilities for flexible APIs
class-variance-authority   | CVA for component variant management
```

### State Management & Routing

```typescript
Redux Toolkit 2.10.1  | Predictable state management with RTK Query
React Router 7.9.5    | Declarative client-side routing
React Redux 9.2.0     | Official React bindings for Redux
Zustand 5.0.8         | Lightweight state management solution
```

### Styling & Icons

```typescript
Lucide React 0.552.0  | Beautiful, customizable SVG icons
Sonner 2.0.7          | Toast notification system
Next Themes 0.4.6     | Perfect dark mode support with SSR
Tailwind Merge 3.3.1  | Utility function to merge Tailwind classes
clsx 2.1.1            | Utility for constructing className strings
```

### Backend Technologies

```typescript
Node.js 20+           | JavaScript runtime with latest features
Express.js 5.1.0      | Fast, unopinionated web framework
TypeScript 5.9.3      | Type-safe backend development
Mongoose 8.19.2       | Elegant MongoDB object modeling
```

### Authentication & Security

```typescript
JSON Web Tokens 9.0.2 | Secure user authentication
bcryptjs 3.0.3        | Password hashing with salt rounds
Cookie Parser 1.4.7   | Parse HTTP request cookies
CORS 2.8.5            | Cross-Origin Resource Sharing middleware
```

### File Upload & Storage

```typescript
Cloudinary 2.8.0      | Cloud-based image and video management
Multer 2.0.2          | Middleware for handling multipart/form-data
```

### Development Tools

```typescript
Nodemon 3.1.10        | Auto-restart development server
ts-node 10.9.2        | TypeScript execution environment
Concurrently 9.2.1    | Run multiple commands concurrently
ESLint 9.36.0         | JavaScript/TypeScript linting
```

### Testing & Quality

```typescript
Jest 30.2.0           | JavaScript testing framework
ts-jest 29.1.0        | TypeScript preprocessor for Jest
@types/* packages     | TypeScript type definitions
```

### DevOps & Infrastructure

```yaml
Docker                | Multi-stage containerization for production
Kubernetes            | Container orchestration with health checks
Jenkins               | Comprehensive CI/CD pipeline automation
SonarQube             | Code quality and security analysis
OWASP Dependency      | Automated vulnerability scanning
Trivy Security        | Container image security scanning
```

### Deployment & Monitoring

```yaml
Health Checks         | Comprehensive application health monitoring
Resource Management   | CPU and memory limits with proper scaling
Environment Config    | Secure environment variable management
SSL/TLS Support       | Production-ready security configurations
```

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    MERN FitVerse Architecture               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │   Client    │    │   Server    │    │  Database   │      │
│  │             │    │             │    │             │      │
│  │ React 19    │◄──►│ Express.js  │◄──►│  MongoDB    │      │
│  │ TypeScript  │    │ TypeScript  │    │  Mongoose   │      │
│  │ Redux       │    │ JWT Auth    │    │  Atlas      │      │
│  │ Tailwind    │    │ Middleware  │    │             │      │
│  │ Vite        │    │ CORS        │    │             │      │
│  └─────────────┘    └─────────────┘    └─────────────┘      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                     Infrastructure                          │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │   Docker    │    │ Kubernetes  │    │  Jenkins    │      │
│  │             │    │             │    │             │      │
│  │ Multi-stage │    │ Deployment  │    │  CI/CD      │      │
│  │ Builds      │    │ Services    │    │  Pipeline   │      │
│  │ Production  │    │ ConfigMaps  │    │  Security   │      │
│  │ Optimized   │    │ Secrets     │    │  Scanning   │      │
│  └─────────────┘    └─────────────┘    └─────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 📁 Project Structure

```
mern-fit-verse/
├── 📂 backend/                 # Express.js TypeScript backend
│   ├── 📂 config/              # Database connection configuration
│   ├── 📂 controllers/         # API route handlers and business logic
│   │   ├── authController.ts   # User authentication (login/register)
│   │   ├── userController.ts   # User profile and social features
│   │   ├── postController.ts   # Post creation, feed, likes, comments
│   │   ├── notificationController.ts # Notification management
│   │   └── healthController.ts # System health monitoring
│   ├── 📂 middlewares/         # Express middleware functions
│   │   ├── authMiddleware.ts   # JWT authentication middleware
│   │   ├── errorMiddleware.ts  # Global error handling
│   │   └── uploadMiddleware.ts # Multer file upload configuration
│   ├── 📂 models/              # MongoDB schemas with Mongoose
│   │   ├── userModel.ts        # User schema with auth methods
│   │   ├── postModel.ts        # Post schema with comments
│   │   └── notificationModel.ts # Notification system schema
│   ├── 📂 routes/              # API endpoint definitions
│   │   ├── authRoutes.ts       # Authentication routes
│   │   ├── userRoutes.ts       # User management routes
│   │   ├── postRoutes.ts       # Post and social features routes
│   │   ├── notificationRoutes.ts # Notification routes
│   │   └── healthRoutes.ts     # Health check routes
│   ├── 📂 utils/               # Helper functions and utilities
│   │   └── generateToken.ts    # JWT token generation utility
│   ├── 📂 __tests__/           # Backend test files
│   │   └── health.test.ts      # Health endpoint tests
│   └── 📄 index.ts             # Express server entry point
├── 📂 frontend/                # React TypeScript SPA
│   ├── 📂 public/              # Static assets and favicon
│   ├── 📂 src/                 # Frontend source code
│   │   ├── 📂 components/      # Reusable UI components
│   │   │   ├── 📂 ui/          # Radix UI component implementations
│   │   │   ├── Header.tsx      # Navigation with user menu
│   │   │   ├── Footer.tsx      # Site footer
│   │   │   ├── AlertModal.tsx  # Alert and confirmation modals
│   │   │   ├── PrivateRoute.tsx # Route authentication guard
│   │   │   ├── ScrollToTop.tsx # Auto-scroll utility
│   │   │   └── ThemeToggle.tsx # Dark/light mode toggle
│   │   ├── 📂 screens/         # Page components
│   │   │   ├── HomeScreen.tsx  # Landing page
│   │   │   ├── LoginScreen.tsx # Authentication form
│   │   │   ├── RegisterScreen.tsx # User registration
│   │   │   └── 📂 protected/   # Authenticated user screens
│   │   │       ├── DashboardScreen.tsx # Main social feed
│   │   │       ├── SettingsScreen.tsx # User settings
│   │   │       ├── NutritionScreen.tsx # Coming soon preview
│   │   │       ├── WorkoutScreen.tsx # Coming soon preview
│   │   │       ├── ViewUserProfile.tsx # Profile viewing
│   │   │       ├── FollowersFollowingModal.tsx # Social lists
│   │   │       └── ThemeSettingsSection.tsx # Theme config
│   │   ├── 📂 slices/          # Redux Toolkit state management
│   │   │   ├── apiSlice.ts     # RTK Query base configuration
│   │   │   ├── authSlice.ts    # Authentication state
│   │   │   ├── usersApiSlice.ts # User API calls
│   │   │   └── postsApiSlice.ts # Posts and social API calls
│   │   ├── 📂 lib/             # Utility functions
│   │   │   ├── calculateAge.ts # Age calculation utility
│   │   │   ├── formatDate.ts   # Date formatting helpers
│   │   │   ├── getInitials.ts  # Avatar initials generator
│   │   │   ├── getPasswordStrength.ts # Password validation
│   │   │   └── utils.ts        # General utilities (cn, clsx)
│   │   ├── 📂 assets/          # Static assets (images, fonts)
│   │   ├── 📄 App.tsx          # Main application component
│   │   ├── 📄 main.tsx         # React app entry point
│   │   ├── 📄 store.ts         # Redux store configuration
│   │   └── 📄 index.css        # Global styles and Tailwind imports
│   ├── 📄 components.json      # Radix UI component configuration
│   ├── 📄 package.json         # Frontend dependencies
│   ├── 📄 vite.config.ts       # Vite build configuration
│   └── � tailwind.config.js   # Tailwind CSS configuration
├── �📂 kubernetes/              # Kubernetes deployment manifests
│   ├── � deployment.yml       # Application deployment config
│   └── 📄 service.yml          # Service and networking config
├── 📄 Dockerfile               # Multi-stage production container
├── 📄 Jenkinsfile              # Complete CI/CD pipeline
├── 📄 docker-compose.yml       # Local development environment
├── 📄 jest.config.js           # Jest testing configuration
├── 📄 tsconfig.json            # TypeScript compiler configuration
├── 📄 sonar-project.properties # SonarQube analysis configuration
├── 📄 owasp-suppressions.xml   # OWASP security scan suppressions
└── 📄 package.json             # Backend dependencies and scripts
```

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** 20.x or higher
- **npm** or **yarn** package manager
- **MongoDB** database (local or cloud)
- **Git** for version control

### 1️⃣ Clone Repository

```bash
git clone https://github.com/xjohnfit/mern-fit-verse.git
cd mern-fit-verse
```

### 2️⃣ Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

**Required Environment Variables:**

```env
# Database
MONGODB_URI=mongodb://localhost:27017/fitverse
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/fitverse

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Application
NODE_ENV=development
PORT=5003
FRONTEND_URL=http://localhost:5173
```

### 3️⃣ Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend && npm install
cd ..
```

### 4️⃣ Start Development Server

```bash
# Start both frontend and backend concurrently
npm run dev

# Or start individually
npm run backend    # Backend only (http://localhost:5003)
npm run frontend   # Frontend only (http://localhost:5173)
```

### 5️⃣ Access Application

- **Frontend**: <http://localhost:5173>
- **Backend API**: <http://localhost:5003>
- **Health Check**: <http://localhost:5003/api/health>

---

## 🐳 Docker Deployment

### Using Docker Compose (Recommended for Development)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build the image
docker build -t mern-fit-verse:latest .

# Run the container
docker run -d \
  --name fitverse-app \
  -p 5003:5003 \
  -e MONGODB_URI="your-mongodb-connection-string" \
  -e JWT_SECRET="your-jwt-secret" \
  mern-fit-verse:latest
```

### Production Docker Setup

```bash
# Build production image
docker build --target production -t mern-fit-verse:prod .

# Run with production environment
docker run -d \
  --name fitverse-prod \
  -p 80:5003 \
  --restart unless-stopped \
  -e NODE_ENV=production \
  -e MONGODB_URI="$PROD_MONGODB_URI" \
  -e JWT_SECRET="$PROD_JWT_SECRET" \
  mern-fit-verse:prod
```

---

## ☸️ Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (local or cloud)
- `kubectl` configured
- Docker registry access

### 1️⃣ Create Secrets

```bash
# Create MongoDB connection secret
kubectl create secret generic mern-fit-verse-env \
  --from-literal=MONGODB_URI="your-mongodb-connection-string" \
  --from-literal=JWT_SECRET="your-jwt-secret" \
  --from-literal=NODE_ENV="production"

# Create Docker registry secret (if using private registry)
kubectl create secret docker-registry regcred \
  --docker-server=your-registry-server \
  --docker-username=your-username \
  --docker-password=your-password \
  --docker-email=your-email
```

### 2️⃣ Deploy Application

```bash
# Apply Kubernetes manifests
kubectl apply -f kubernetes/

# Check deployment status
kubectl get pods -l app=mern-fit-verse
kubectl get services

# View logs
kubectl logs -l app=mern-fit-verse -f
```

### 3️⃣ Access Application

```bash
# Port forward for local testing
kubectl port-forward service/mern-fit-verse-service 8080:80

# Or use LoadBalancer/Ingress IP (cloud deployments)
kubectl get service mern-fit-verse-service
```

---

## 🔧 Development

### Available Scripts

```bash
# Backend Development
npm run backend        # Start backend with nodemon
npm run start          # Start backend (production mode)
npm run build          # Compile TypeScript to JavaScript
npm run clean          # Remove build artifacts

# Frontend Development  
npm run frontend       # Start frontend dev server
npm run build:frontend # Build frontend for production
npm run dev            # Start both frontend and backend

# Full Application
npm run build:full     # Build both frontend and backend
npm run start:prod     # Start production build

# Utilities
npm run health-check   # Test application health endpoint
npm run lint           # Run code linting
npm run test           # Run test suites
```

### Code Style & Standards

```bash
# Frontend linting
cd frontend && npm run lint

# Auto-fix linting issues
cd frontend && npm run lint --fix

# TypeScript compilation check
npm run build
```

### Hot Reload Development

The development setup includes hot reload for both frontend and backend:

- **Frontend**: Vite HMR for instant UI updates
- **Backend**: Nodemon for automatic server restarts
- **Database**: MongoDB change streams (when implemented)

---

## 🧪 Testing

### Test Structure (Planned)

```
tests/
├── 📂 backend/
│   ├── 📂 unit/          # Unit tests for controllers, models
│   ├── 📂 integration/   # API integration tests
│   └── 📂 e2e/           # End-to-end API tests
├── 📂 frontend/
│   ├── 📂 components/    # Component unit tests
│   ├── 📂 integration/   # Feature integration tests
│   └── 📂 e2e/           # End-to-end UI tests
└── 📄 jest.config.js     # Test configuration
```

### Running Tests

```bash
# Run all tests
npm run test

# Run backend tests only
npm run test:backend

# Run frontend tests only
cd frontend && npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Setup (Future Implementation)

```bash
# Install testing dependencies
npm install --save-dev jest supertest @testing-library/react @testing-library/jest-dom
```

---

## 📊 CI/CD Pipeline

The project includes a comprehensive Jenkins pipeline with the following stages:

### Pipeline Stages

1. **🧹 Setup & Cleanup**: Workspace preparation and environment info
2. **📥 Code Checkout**: Git clone with shallow fetch optimization
3. **📦 Dependencies**: Parallel installation for frontend and backend
4. **🔍 Code Quality**: ESLint and TypeScript compilation checks
5. **🔨 Build & Test**: Parallel frontend and backend builds
6. **📊 SonarQube Analysis**: Code quality and security analysis
7. **🚪 Quality Gate**: Enforce quality standards per environment
8. **🔒 Security Scans**: OWASP and Trivy vulnerability scanning
9. **🐳 Docker Build**: Multi-stage optimized container builds
10. **🏥 Validation**: Image security scan and health checks
11. **🧽 Cleanup**: Resource management and optimization

### Pipeline Parameters

- **BUILD_TYPE**: `development` | `staging` | `production`
- **SKIP_TESTS**: Boolean flag for faster iteration
- **SKIP_SECURITY_SCANS**: Boolean flag for rapid prototyping
- **CUSTOM_TAG**: Override default image tagging

### Running Pipeline

```bash
# Trigger different build types
curl -X POST "jenkins-url/job/mern-fit-verse/buildWithParameters?BUILD_TYPE=development"
curl -X POST "jenkins-url/job/mern-fit-verse/buildWithParameters?BUILD_TYPE=production"

# Skip tests for faster builds
curl -X POST "jenkins-url/job/mern-fit-verse/buildWithParameters?BUILD_TYPE=development&SKIP_TESTS=true"
```

---

## 🔒 Security

### Authentication & Authorization

- **JWT Tokens**: Secure user authentication with configurable expiration
- **bcrypt Hashing**: Password security with salt rounds
- **HTTP-Only Cookies**: Secure token storage and CSRF protection
- **Role-Based Access**: Middleware for protected routes

### Security Measures

- **CORS Configuration**: Controlled cross-origin resource sharing
- **Input Validation**: Request sanitization and validation
- **Rate Limiting**: Protection against brute force attacks (planned)
- **Helmet.js**: Security headers and vulnerability protection (planned)

### Vulnerability Scanning

- **OWASP Dependency Check**: Automated vulnerability scanning
- **Trivy Security Scans**: Container and filesystem security analysis
- **SonarQube Integration**: Code security and quality analysis
- **Dependency Auditing**: NPM audit for known vulnerabilities

### Best Practices

- Environment variables for sensitive data
- Secrets management in Kubernetes
- Container security with non-root users
- Regular security updates and patches

---

## 📡 API Documentation

### Base URL

```
Development: http://localhost:5003/api
Production: https://your-domain.com/api
```

### 🔐 Authentication Endpoints

```http
POST /api/auth/register     # User registration with validation
POST /api/auth/login        # User authentication
POST /api/auth/logout       # User logout with cookie clearing
```

### 👤 User Management Endpoints

```http
GET  /api/users/profile                     # Get logged-in user profile (protected)
PUT  /api/users/profile                     # Update user profile with photo upload (protected)
GET  /api/users/profile/view/suggested      # Get suggested users to follow (protected)
GET  /api/users/profile/view/:username      # View specific user's profile (protected)
POST /api/users/profile/follow/:username    # Follow/unfollow a user (protected)
```

### 📱 Posts & Social Features

```http
POST   /api/posts/create                    # Create new post with image upload (protected)
DELETE /api/posts/delete/:postId            # Delete user's own post (protected)
GET    /api/posts/feed                      # Get all feed posts (protected)
GET    /api/posts/feed/followed             # Get posts from followed users only (protected)
GET    /api/posts/user/:username            # Get posts from specific user (protected)
POST   /api/posts/like/:postId              # Like/unlike a post (protected)
POST   /api/posts/comment/:postId           # Add comment to post (protected)
DELETE /api/posts/comment/:postId/:commentId # Delete comment from post (protected)
```

### 🔔 Notification System

```http
GET    /api/notifications                   # Get user notifications (protected)
DELETE /api/notifications                   # Delete all user notifications (protected)
```

### 🏥 System Health

```http
GET /api/health                             # Comprehensive health check dashboard
```

### User Registration

```http
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "dob": "1990-01-01",
  "gender": "male"
}
```

### User Login

```http
POST /api/users/auth
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Response Format

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "username": "johndoe"
    },
    "token": "jwt_token_here"
  },
  "message": "User authenticated successfully"
}
```

### Error Handling

```json
{
  "success": false,
  "message": "Invalid email or password",
  "error": "INVALID_CREDENTIALS",
  "statusCode": 401
}
```

### Health Check

```http
GET /api/health
```

**Description:** Returns a comprehensive health check dashboard with system status, uptime, and file system verification.

**Response:** HTML Dashboard Page

- **Content-Type:** `text/html`
- **Status Codes:**
  - `200 OK` - Always returns 200, check status in response content

**Features:**

- 🎯 **System Status**: Overall health status (OK/WARNING/ERROR)
- ⏱️ **Uptime**: Server uptime in human-readable format
- 🔧 **Environment**: Current Node.js environment
- 📁 **File System**: Validates frontend build files existence
  - Static path verification (`frontend/dist/`)
  - Index file verification (`frontend/dist/index.html`)
  - Asset counting and listing
- 📊 **Real-time Data**: Auto-refresh capability with current timestamp
- 🎨 **Visual Dashboard**: Modern UI with status indicators and metrics

**Status Levels:**

- **OK** (Green): All systems operational, frontend files found
- **WARNING** (Amber): System running but missing frontend build files
- **ERROR** (Red): System errors or critical issues detected

**Usage Examples:**

```bash
# Browser access - Visual dashboard
curl http://localhost:5003/api/health

# Command line testing
npm run health-check

# Docker health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:5003/api/health || exit 1
```

**Sample Information Displayed:**

- Server uptime and performance metrics
- Frontend build status and file counts
- Current working directory and paths
- Node.js version and environment variables
- Last check timestamp with refresh functionality

---

## 🎨 Frontend Architecture & Components

### 📁 Component Structure

```
src/
├── 🎯 UI Components (Radix UI Primitives)
│   ├── ui/
│   │   ├── avatar.tsx          # Profile picture component with fallbacks
│   │   ├── button.tsx          # Customizable button with variants (CVA)
│   │   ├── navigation-menu.tsx # Accessible navigation component
│   │   └── sonner.tsx          # Toast notification system
├── 🏗 Layout Components
│   ├── Header.tsx              # Navigation bar with user menu and theme toggle
│   ├── Footer.tsx              # Site footer with links and branding
│   ├── AlertModal.tsx          # System alert and notification modals
│   ├── PrivateRoute.tsx        # Authentication guard for protected routes
│   ├── ScrollToTop.tsx         # Auto-scroll to top on route changes
│   └── ThemeToggle.tsx         # Dark/light mode toggle component
```

### 📱 Screen Components

```
screens/
├── HomeScreen.tsx              # Landing page with hero section and features
├── LoginScreen.tsx             # User authentication with form validation
├── RegisterScreen.tsx          # User registration with comprehensive validation
└── protected/                  # Protected screens requiring authentication
    ├── DashboardScreen.tsx     # Social feed, suggested users, post interactions
    ├── SettingsScreen.tsx      # Comprehensive user settings and profile management
    ├── NutritionScreen.tsx     # Nutrition hub coming soon preview
    ├── WorkoutScreen.tsx       # Workout hub coming soon preview
    ├── ViewUserProfile.tsx     # View other users' profiles and posts
    ├── FollowersFollowingModal.tsx # Modal for followers/following lists
    └── ThemeSettingsSection.tsx   # Theme customization settings
```

### 🔄 State Management (Redux Toolkit + RTK Query)

```typescript
// Store Structure
{
  auth: {
    isAuthenticated: boolean,
    userInfo: {
      _id: string,
      name: string,
      username: string,
      email: string,
      photo?: string,
      followers: string[],
      following: string[],
      // ... other user fields
    } | null,
    token: string | null
  }
}

// API Slices
├── apiSlice.ts           # Base RTK Query configuration
├── authSlice.ts          # Authentication state management
├── usersApiSlice.ts      # User-related API calls
└── postsApiSlice.ts      # Posts and social features API calls
```

### 🎨 Styling & Design System

```typescript
// Tailwind Configuration
├── Utility-First CSS     # Comprehensive utility classes
├── Custom CSS Variables # Theme-aware color system
├── Component Variants   # CVA-based component styling
├── Responsive Design    # Mobile-first breakpoints
├── Dark/Light Themes    # System preference + manual toggle
└── Animation System     # Smooth transitions and micro-interactions
```

### 📚 Utility Libraries

```typescript
lib/
├── calculateAge.ts       # Age calculation from date of birth
├── formatDate.ts         # Date formatting utilities
├── getInitials.ts        # Generate user initials for avatars
├── getPasswordStrength.ts # Password strength validation
└── utils.ts              # General utility functions (cn, clsx)
```

### 🔌 Key Integrations

- **Cloudinary**: Image upload and optimization for profile pictures and posts
- **React Router**: Client-side routing with protected routes
- **Sonner**: Toast notifications for user feedback
- **Lucide React**: Consistent icon system throughout the app
- **Next Themes**: Seamless dark/light mode switching

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help make MERN FitVerse better:

### 🐛 Reporting Bugs

1. Check existing issues to avoid duplicates
2. Use the bug report template
3. Include steps to reproduce, expected behavior, and screenshots
4. Specify your environment (OS, Node version, browser)

### 💡 Suggesting Features

1. Check the roadmap and existing feature requests
2. Open an issue with the feature request template
3. Describe the problem and proposed solution
4. Include mockups or examples if applicable

### 🔧 Development Workflow

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
4. **Make** your changes with tests
5. **Commit** with conventional commit messages
6. **Push** to your branch (`git push origin feature/amazing-feature`)
7. **Create** a Pull Request

### 📝 Commit Convention

```
feat: add new workout tracking feature
fix: resolve authentication token expiration
docs: update API documentation
style: format code with prettier
refactor: reorganize component structure
test: add unit tests for user controller
chore: update dependencies
```

### 🧪 Pull Request Guidelines

- Ensure all tests pass
- Include relevant tests for new features
- Update documentation if needed
- Follow the existing code style
- Keep PRs focused and atomic

### 🏗 Development Setup for Contributors

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/mern-fit-verse.git
cd mern-fit-verse

# 2. Add upstream remote
git remote add upstream https://github.com/xjohnfit/mern-fit-verse.git

# 3. Install dependencies
npm install && cd frontend && npm install && cd ..

# 4. Create environment file
cp .env.example .env
# Edit .env with your local configuration

# 5. Start development server
npm run dev

# 6. Create feature branch
git checkout -b feature/your-feature-name

# 7. Make changes and test
npm run lint
npm run test
npm run build

# 8. Commit and push
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

### 🎯 Areas for Contribution

- **Frontend Features**: Workout tracking, nutrition logging, progress charts
- **Backend APIs**: Exercise database, workout plans, analytics
- **Testing**: Unit tests, integration tests, E2E tests
- **Documentation**: API docs, tutorials, deployment guides
- **UI/UX**: Design improvements, accessibility, mobile optimization
- **DevOps**: CI/CD improvements, monitoring, performance optimization

---

## 🚀 Roadmap

### Phase 1: Social Foundation ✅ (Completed)

- [x] **Authentication System**: Secure JWT-based auth with comprehensive validation
- [x] **User Profiles**: Complete profile management with photos and fitness metrics
- [x] **Social Networking**: Follow/unfollow system with user discovery
- [x] **Social Feed**: Post creation, image upload, likes, and comments system
- [x] **Notification System**: Real-time notifications for social interactions
- [x] **Modern UI/UX**: Responsive design with dark/light theme support
- [x] **Cloud Integration**: Cloudinary for image management and optimization
- [x] **Production Ready**: Docker containerization and Kubernetes deployment
- [x] **CI/CD Pipeline**: Comprehensive Jenkins pipeline with security scanning
- [x] **Health Monitoring**: Advanced system health checks and monitoring

### Phase 2: Fitness Tracking 🚧 (In Development)

- [ ] **Exercise Database**: Comprehensive exercise library with instructions and videos
- [ ] **Workout Planning**: Create and schedule personalized workout routines
- [ ] **Progress Tracking**: Monitor fitness metrics, sets, reps, and personal records
- [ ] **Workout Analytics**: Performance insights and progress visualization
- [ ] **Goal Setting**: Set and track fitness goals with achievement milestones
- [ ] **Workout Sharing**: Share workout routines with the community

### Phase 3: Nutrition & Wellness 📋 (Planned)

- [ ] **Nutrition Database**: Comprehensive food database with macro/micronutrients
- [ ] **Meal Planning**: Personalized meal plans based on fitness goals
- [ ] **Calorie Tracking**: Food logging with barcode scanning capability
- [ ] **Nutrition Analytics**: Detailed nutrition insights and recommendations
- [ ] **Recipe Sharing**: Community recipe sharing and meal prep guides
- [ ] **Water & Sleep Tracking**: Wellness metrics beyond nutrition

### Phase 4: Advanced Features 🎯 (Future)

- [ ] **AI-Powered Recommendations**: Personalized workout and nutrition suggestions
- [ ] **Fitness Device Integration**: Connect with popular fitness trackers and apps
- [ ] **Video Workouts**: Guided workout videos and form correction
- [ ] **Virtual Training**: Live and recorded training sessions
- [ ] **Challenges & Competitions**: Community fitness challenges and leaderboards
- [ ] **Mobile Application**: Native iOS and Android apps

### Phase 5: Scale & Enterprise 🏢 (Long-term)

- [ ] **Performance Optimization**: Advanced caching, CDN, and database optimization
- [ ] **Multi-language Support**: Internationalization for global reach
- [ ] **Premium Features**: Advanced analytics, personal trainers, custom plans
- [ ] **Enterprise Features**: Corporate wellness programs and team challenges
- [ ] **API Ecosystem**: Public APIs for third-party integrations
- [ ] **Advanced Security**: SOC2 compliance and enterprise-grade security

---

## 📞 Support & Community

### 🆘 Getting Help

- **GitHub Issues**: [Report bugs and request features](https://github.com/xjohnfit/mern-fit-verse/issues)
- **Discussions**: [Community discussions and Q&A](https://github.com/xjohnfit/mern-fit-verse/discussions)
- **Email**: [xjohnfitcodes@gmail.com](mailto:xjohnfitcodes@gmail.com)

### 🔗 Links

- **Live Demo**: [https://fitverse-demo.com](https://fitverse-demo.com)
- **Docker Hub**: [xjohnfit/mern-fit-verse](https://hub.docker.com/r/xjohnfit/mern-fit-verse)
- **Documentation**: [Project Wiki](https://github.com/xjohnfit/mern-fit-verse/wiki)

---

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

```
ISC License

Copyright (c) 2025 John Winchester

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

---

## 🙏 Acknowledgments

- **MongoDB Atlas** for database hosting
- **Vercel/Netlify** for deployment platform
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for the utility-first CSS framework
- **React Team** for the amazing frontend library
- **Express.js** for the robust backend framework
- **Open Source Community** for inspiration and contributions

---

**Built with ❤️ by [John Winchester](https://github.com/xjohnfit)**

**⭐ Star this repository if you found it helpful!**

[![GitHub stars](https://img.shields.io/github/stars/xjohnfit/mern-fit-verse?style=social)](https://github.com/xjohnfit/mern-fit-verse/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/xjohnfit/mern-fit-verse?style=social)](https://github.com/xjohnfit/mern-fit-verse/network/members)
