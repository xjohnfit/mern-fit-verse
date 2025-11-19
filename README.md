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
- [🏗 Project Structure](#-project-structure)
- [⚡ Quick Start](#-quick-start)
- [🐳 Docker Deployment](#-docker-deployment)
- [☸️ Kubernetes Deployment](#️-kubernetes-deployment)
- [🔧 Development](#-development)
- [🧪 Testing](#-testing)
- [📊 CI/CD Pipeline](#-cicd-pipeline)
- [🔒 Security](#-security)
- [📡 API Documentation](#-api-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🚀 Overview

**MERN FitVerse** is a comprehensive, production-ready social fitness platform that seamlessly combines social networking with advanced fitness and nutrition tracking. Built with cutting-edge web technologies and enterprise-grade DevOps practices, it provides users with a complete ecosystem to track their health journey, connect with a supportive community, and achieve their wellness goals through data-driven insights and social motivation.

### 🎯 Mission

To create a vibrant, inclusive fitness community where users can share their journey, motivate each other, and achieve their health and wellness goals through social interaction, comprehensive tracking tools, and personalized experiences. We believe fitness is more enjoyable and sustainable when shared with others.

### 🌟 Platform Highlights

- **🔐 Enterprise Security**: JWT-based authentication with bcrypt password hashing and HTTP-only cookies
- **👥 Social Networking**: Full-featured follow system with user discovery and community building
- **📱 Social Feed**: Rich content sharing with images, likes, comments, and real-time notifications
- **🥗 Advanced Nutrition Tracking**: FatSecret API integration with 500,000+ food database
- **🍽️ Custom Meal Categories**: Personalized meal organization with up to 3 custom categories
- **📊 Visual Analytics**: Interactive charts and progress tracking with Recharts
- **🏋️ Workout Management**: Complete exercise library and workout logging system
- **🎨 Modern UI/UX**: React 19 with Tailwind CSS 4 and accessible Radix UI components
- **🌓 Theme Support**: Seamless dark/light mode with system preference detection
- **📱 Responsive Design**: Mobile-first approach optimized for all screen sizes
- **🐳 Production Ready**: Multi-stage Docker builds and Kubernetes orchestration
- **⚙️ CI/CD Pipeline**: Automated Jenkins pipeline with SonarQube and OWASP security scanning
- **☁️ Cloud Integration**: Cloudinary for optimized image storage and delivery
- **🔍 Code Quality**: TypeScript throughout with comprehensive testing framework

---

## ✨ Features

### 🔐 Authentication & Security

- **Secure Registration/Login**: JWT-based authentication with bcrypt password hashing
- **User Validation**: 
  - Email format validation and uniqueness checks
  - Username availability verification
  - Password strength requirements
  - Date of birth and gender validation
- **Session Management**: HTTP-only cookies for secure token storage
- **Protected Routes**: Client-side route guards for authenticated access
- **Admin Middleware**: Role-based access control for admin features

### 👥 Social Features

- **Comprehensive User Profiles**: 
  - Profile photos with Cloudinary integration
  - Height, weight, and weight unit preferences (kg/lbs)
  - Fitness goals and personal information
  - Follower and following statistics
- **Follow System**: 
  - Follow/unfollow functionality
  - Follower and following lists
  - Follow notifications
- **User Discovery**: 
  - Suggested users algorithm
  - User search and profile viewing
  - Community engagement metrics

### 📱 Social Feed & Posts

- **Rich Post Creation**: 
  - Text content with optional titles
  - Image uploads via Cloudinary
  - Post editing and deletion
- **Feed System**: 
  - Personalized feed from followed users
  - Chronological post ordering
  - Infinite scroll support
- **Post Interactions**: 
  - Like/unlike functionality
  - Real-time like counts
  - Comment system with nested replies
- **Content Management**: 
  - Delete own posts and comments
  - Content ownership validation
  - Image optimization and delivery

### 🔔 Notification System

- **Real-time Notifications**: 
  - Like notifications
  - Follow notifications
  - Comment notifications
  - Other custom notification types
- **Notification Management**: 
  - Mark as read functionality
  - Batch delete operations
  - Unread notification counter
- **Activity Tracking**: Complete audit trail of social interactions

### 🥗 Nutrition Tracking (Full Feature)

#### Food Database Integration
- **FatSecret API Integration**: Access to 500,000+ verified food items
- **Smart Food Search**: 
  - Real-time autocomplete with debounced search (300ms delay)
  - Minimum 2 characters for search activation
  - Food suggestions with brand and description
- **Detailed Food Information**: 
  - Complete nutritional breakdown
  - Multiple serving size options
  - Adjustable serving quantities
  - Calories, protein, carbs, and fats per serving

#### Meal Tracking
- **Standard Meal Categories**: 
  - Breakfast
  - Lunch
  - Dinner
  - Snacks
- **Custom Meal Categories**: 
  - Create up to 3 personalized categories
  - Custom names (max 20 characters)
  - Custom colors for visual organization
  - Reorder categories via drag-and-drop
  - Delete custom categories

#### Nutrition Goals & Analytics
- **Personalized Goals**: 
  - Set daily calorie targets
  - Individual macronutrient goals (protein, carbs, fats)
  - Goals saved to user profile
- **Visual Progress Tracking**: 
  - Color-coded progress bars (green/yellow/red based on goal achievement)
  - Interactive pie chart for macro distribution
  - Real-time percentage calculations
- **Daily Totals**: 
  - Automatic calculation of consumed calories and macros
  - Goal vs. actual comparison
  - Remaining macros display

#### Historical Data Management
- **Date Navigation**: 
  - Calendar date picker
  - View any past or future date
  - Today shortcut button
- **Entry Management**: 
  - Edit serving sizes post-addition
  - Delete individual entries
  - View entries by meal category
- **Data Persistence**: All nutrition logs stored with timezone handling

### 🏋️ Workout & Exercise Features

#### Exercise Library
- **Comprehensive Database**: 
  - Exercise name and descriptions
  - Detailed instructions
  - Exercise images
  - Category-based organization
- **Exercise Management**: 
  - Create custom exercises
  - Update exercise details
  - Delete exercises
  - Search and filter by category

#### Workout Tracking
- **Workout Logging**: 
  - Freestyle or template-based workouts
  - Duration tracking (in seconds)
  - Exercise and set tracking
  - Workout notes and completion timestamps
- **Set Management**: 
  - Set number tracking
  - Weight and rep logging
  - Set completion status
  - Weight unit conversion (kg/lbs)
- **Workout History**: 
  - View all past workouts
  - Workout details with exercises and sets
  - Progress over time
- **Weight Unit Preferences**: 
  - User-specific weight unit (kg or lbs)
  - Automatic conversion for storage (all stored in lbs)
  - Display in user's preferred unit

#### Custom Categories
- **Flexible Organization**: Custom categories for exercises and meals
- **User-specific**: Each user can create their own organizational system
- **Order Management**: Reorder categories as needed

### 🎨 Modern User Experience

- **Responsive Design**: 
  - Mobile-first approach
  - Optimized for phones, tablets, and desktops
  - Touch-friendly interactions
- **Dark/Light Themes**: 
  - System preference detection
  - Manual theme toggle
  - Persistent theme selection
- **Modern UI Components**: 
  - Radix UI primitives for accessibility
  - Tailwind CSS 4 for styling
  - Custom component library
- **Animations & Transitions**: 
  - Smooth page transitions
  - Motion library integration
  - Wobble card effects
- **Loading States**: 
  - Skeleton loading screens
  - Loading indicators
  - Optimistic UI updates
- **Toast Notifications**: 
  - Sonner toast system
  - Success, error, and info messages
  - Customizable styling

### 🛡️ Admin Features

- **Admin Dashboard**: Dedicated admin screen for management tasks
- **User Management**: Admin middleware for protected admin routes
- **Content Moderation**: Tools for managing platform content

---

## 🛠 Tech Stack

### Frontend Technologies

```typescript
React 19.1.1          | Modern React with concurrent features and advanced hooks
TypeScript 5.9.3      | Static type checking for enhanced developer experience
Vite 7.1.7            | Lightning-fast build tool and dev server with HMR
Tailwind CSS 4.1.16   | Utility-first CSS framework with JIT compiler
```

### Frontend Libraries & UI

```typescript
// State Management & Data Fetching
Redux Toolkit 2.10.1  | State management with RTK Query for API calls
React Redux 9.2.0     | Official React bindings for Redux

// Routing
React Router 7.9.5    | Declarative client-side routing with loaders

// UI Components (Radix UI)
@radix-ui/react-avatar           | Accessible avatar component
@radix-ui/react-navigation-menu  | Accessible navigation menus
@radix-ui/react-slot             | Composition utilities
@radix-ui/react-tabs             | Accessible tab panels

// Styling & Utilities
class-variance-authority | Component variant management
clsx 2.1.1              | Utility for className construction
tailwind-merge 3.3.1    | Intelligent Tailwind class merging

// Icons & Animations
Lucide React 0.552.0    | Beautiful, consistent SVG icon library
Motion 12.23.24         | Powerful animation library

// Charts & Visualization
Recharts 2.15.4         | Composable charting library for data viz

// Notifications & Themes
Sonner 2.0.7            | Toast notification system
Next Themes 0.4.6       | Dark mode with SSR support

// Noise Effects
Simplex Noise 4.0.3     | Noise generation for visual effects
```

### Backend Technologies

```typescript
Node.js 20+           | JavaScript runtime with latest features
Express 5.1.0         | Fast, minimalist web framework
TypeScript 5.9.3      | Static typing for Node.js and enhanced DX
ts-node 10.9.2        | TypeScript execution engine for Node.js
Mongoose 8.19.2       | Elegant MongoDB object modeling and validation
```

### Backend Libraries & Middleware

```typescript
// Authentication & Security
jsonwebtoken 9.0.2     | JWT token generation and verification
bcryptjs 3.0.3         | Password hashing with salt rounds
cookie-parser 1.4.7    | Parse HTTP request cookies
cors 2.8.5             | Cross-Origin Resource Sharing middleware
express-async-handler  | Async error handling for Express routes

// File Upload & Storage
multer 2.0.2           | Multipart/form-data file upload handling
cloudinary 2.8.0       | Cloud-based image storage and optimization

// Development Tools
nodemon 3.1.10         | Auto-restart dev server on file changes
concurrently 9.2.1     | Run multiple npm scripts simultaneously

// Testing
jest 30.2.0            | JavaScript testing framework
ts-jest 29.1.0         | TypeScript preprocessor for Jest
@types/* packages      | TypeScript type definitions
```

### External APIs & Services

```typescript
FatSecret Platform API | Nutrition database with 500,000+ food items
Cloudinary             | Image and video management cloud service
MongoDB Atlas          | Cloud-hosted MongoDB database clusters
```

### DevOps & Infrastructure

```yaml
Docker                 | Multi-stage containerization for production builds
Docker Compose         | Local development environment orchestration
Kubernetes             | Container orchestration with auto-scaling
Jenkins                | CI/CD pipeline automation with security scanning
SonarQube              | Code quality and security vulnerability analysis
OWASP Dependency Check | Automated dependency vulnerability scanning
Trivy Security Scanner | Container image and filesystem security analysis
```

---

## 🏗 Project Structure

### Complete Directory Tree

```plaintext
mern-fit-verse/
├── 📂 backend/                           # Express.js TypeScript backend
│   ├── 📂 config/
│   │   └── dbConnection.ts               # MongoDB connection configuration
│   ├── 📂 controllers/                   # Business logic and route handlers
│   │   ├── authController.ts             # User authentication (login/register)
│   │   ├── userController.ts             # User profile, follow system
│   │   ├── postController.ts             # Post creation, feed, likes, comments
│   │   ├── notificationController.ts     # Notification management
│   │   ├── nutritionController.ts        # Nutrition entry CRUD operations
│   │   ├── fatSecretController.ts        # FatSecret API integration with OAuth
│   │   ├── customCategoryController.ts   # Custom meal categories
│   │   ├── exerciseController.ts         # Exercise library management
│   │   ├── workoutController.ts          # Workout logging and history
│   │   └── healthController.ts           # System health monitoring
│   ├── 📂 middlewares/
│   │   ├── authMiddleware.ts             # JWT authentication middleware
│   │   ├── adminMiddleware.ts            # Admin role verification
│   │   ├── errorMiddleware.ts            # Global error handling
│   │   └── uploadMiddleware.ts           # Multer file upload config
│   ├── 📂 models/                        # MongoDB schemas with Mongoose
│   │   ├── userModel.ts                  # User schema with auth methods
│   │   ├── postModel.ts                  # Post schema with comments
│   │   ├── notificationModel.ts          # Notification system schema
│   │   ├── nutritionModel.ts             # Nutrition entry schema
│   │   ├── customCategoryModel.ts        # Custom meal category schema
│   │   ├── exerciseModel.ts              # Exercise library schema
│   │   └── workoutModel.ts               # Workout logging schema
│   ├── 📂 routes/                        # API endpoint definitions
│   │   ├── authRoutes.ts                 # Auth endpoints (login, register, logout)
│   │   ├── userRoutes.ts                 # User management endpoints
│   │   ├── postRoutes.ts                 # Social feed and interaction endpoints
│   │   ├── notificationRoutes.ts         # Notification endpoints
│   │   ├── NutritionRoutes.ts            # Nutrition tracking endpoints
│   │   ├── fatSecretRoutes.ts            # FatSecret API proxy endpoints
│   │   ├── customCategoryRoutes.ts       # Custom category endpoints
│   │   ├── exercisesRoutes.ts            # Exercise library endpoints
│   │   ├── workoutRoutes.ts              # Workout tracking endpoints
│   │   └── healthRoutes.ts               # Health check endpoint
│   ├── 📂 utils/
│   │   ├── generateToken.ts              # JWT token generation utility
│   │   └── weightConversion.ts           # Weight unit conversion (kg/lbs)
│   ├── 📂 __tests__/
│   │   └── health.test.ts                # Health endpoint tests
│   └── 📄 index.ts                       # Express server entry point
├── 📂 frontend/                          # React TypeScript SPA
│   ├── 📂 public/                        # Static assets
│   │   └── fit-verse-logo-no-bg.png      # Application logo
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── 📂 common/
│   │   │   │   ├── PrivateRoute.tsx      # Authentication guard
│   │   │   │   ├── ScrollToTop.tsx       # Auto-scroll utility
│   │   │   │   └── ThemeToggle.tsx       # Dark/light mode toggle
│   │   │   ├── 📂 layout/
│   │   │   │   ├── Header.tsx            # Navigation with user menu
│   │   │   │   └── Footer.tsx            # Site footer
│   │   │   ├── 📂 modals/
│   │   │   │   └── AlertModal.tsx        # Alert and confirmation modals
│   │   │   └── 📂 ui/                    # Radix UI primitives
│   │   │       ├── avatar.tsx            # Avatar component
│   │   │       ├── button.tsx            # Button with variants
│   │   │       ├── card.tsx              # Card component
│   │   │       ├── chart.tsx             # Chart components
│   │   │       ├── input.tsx             # Input component
│   │   │       ├── navigation-menu.tsx   # Navigation menu
│   │   │       ├── sonner.tsx            # Toast notifications
│   │   │       ├── tabs.tsx              # Tab component
│   │   │       └── wobble-card.tsx       # Wobble animation card
│   │   ├── 📂 lib/                       # Utility functions
│   │   │   ├── calculateAge.ts           # Age calculation
│   │   │   ├── formatDate.ts             # Date formatting
│   │   │   ├── getInitials.ts            # Avatar initials
│   │   │   ├── getPasswordStrength.ts    # Password validation
│   │   │   ├── utils.ts                  # General utilities (cn, clsx)
│   │   │   └── weightConversion.ts       # Weight unit conversion
│   │   ├── 📂 screens/
│   │   │   ├── HomeScreen.tsx            # Landing page
│   │   │   ├── LoginScreen.tsx           # Authentication form
│   │   │   ├── RegisterScreen.tsx        # User registration
│   │   │   ├── PrivacyPolicy.tsx         # Privacy policy page
│   │   │   ├── TermsOfService.tsx        # Terms of service page
│   │   │   └── 📂 protected/             # Authenticated screens
│   │   │       ├── 📂 admin/
│   │   │       │   └── AdminScreen.tsx   # Admin dashboard
│   │   │       ├── 📂 dashboard/
│   │   │       │   ├── DashboardScreen.tsx        # Main feed
│   │   │       │   ├── components/                # Dashboard components
│   │   │       │   └── types.ts                   # Type definitions
│   │   │       ├── 📂 nutrition/
│   │   │       │   ├── NutritionScreen.tsx        # Nutrition tracking hub
│   │   │       │   ├── components/                # Nutrition components
│   │   │       │   ├── constants.ts               # Nutrition constants
│   │   │       │   └── types.ts                   # Type definitions
│   │   │       ├── 📂 profile/
│   │   │       │   └── (profile screens)          # Profile management
│   │   │       ├── 📂 settings/
│   │   │       │   └── (settings screens)         # User settings
│   │   │       └── 📂 workout/
│   │   │           ├── WorkoutScreen.tsx          # Workout hub
│   │   │           ├── StartWorkoutScreen.tsx     # Active workout
│   │   │           ├── WorkoutDetailScreen.tsx    # Workout details
│   │   │           ├── components/                # Workout components
│   │   │           └── types.ts                   # Type definitions
│   │   ├── 📂 slices/                    # Redux Toolkit state
│   │   │   ├── apiSlice.ts               # RTK Query base config
│   │   │   ├── authSlice.ts              # Auth state management
│   │   │   ├── usersApiSlice.ts          # User API endpoints
│   │   │   ├── postsApiSlice.ts          # Posts API endpoints
│   │   │   ├── nutritionApiSlice.ts      # Nutrition API endpoints
│   │   │   ├── fatSecretApiSlice.ts      # FatSecret API endpoints
│   │   │   ├── customCategoryApiSlice.ts # Custom categories API
│   │   │   ├── exerciseApiSlice.ts       # Exercise API endpoints
│   │   │   └── workoutApiSlice.ts        # Workout API endpoints
│   │   ├── 📄 App.tsx                    # Main application component
│   │   ├── 📄 main.tsx                   # React app entry point
│   │   ├── 📄 store.ts                   # Redux store configuration
│   │   └── 📄 index.css                  # Global styles
│   ├── 📄 components.json                # Radix UI configuration
│   ├── 📄 package.json                   # Frontend dependencies
│   ├── 📄 vite.config.ts                 # Vite build configuration
│   ├── 📄 tsconfig.json                  # TypeScript config
│   └── 📄 eslint.config.js               # ESLint configuration
├── 📂 kubernetes/                        # Kubernetes manifests
│   ├── 📄 deployment.yml                 # Deployment configuration
│   └── 📄 service.yml                    # Service configuration
├── 📄 Dockerfile                         # Multi-stage production build
├── 📄 docker-compose.yml                 # Local development environment
├── 📄 Jenkinsfile                        # Complete CI/CD pipeline
├── 📄 jest.config.js                     # Jest testing configuration
├── 📄 tsconfig.json                      # Root TypeScript config
├── 📄 package.json                       # Backend dependencies
├── 📄 sonar-project.properties           # SonarQube configuration
├── 📄 owasp-suppressions.xml             # Security scan suppressions
├── 📄 CONTRIBUTING.md                    # Contribution guidelines
└── 📄 README.md                          # This file
```

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** 20.x or higher
- **npm** 10.x or higher
- **MongoDB** 7.0+ (local or cloud)
- **Git** for version control

### 1️⃣ Clone Repository

```bash
git clone https://github.com/xjohnfit/mern-fit-verse.git
cd mern-fit-verse
```

### 2️⃣ Environment Setup

Create a `.env` file in the root directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/fitverse
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/fitverse

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters
JWT_EXPIRES_IN=7d

# Application Configuration
NODE_ENV=development
PORT=5003
VITE_FRONTEND_URL=http://localhost:5173

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# FatSecret API Configuration (for nutrition tracking)
FATSECRET_CONSUMER_KEY=your-fatsecret-consumer-key
FATSECRET_CONSUMER_SECRET=your-fatsecret-consumer-secret
```

**Get API Keys:**

- **Cloudinary**: [Sign up at cloudinary.com](https://cloudinary.com/users/register/free)
- **FatSecret**: [Register at platform.fatsecret.com](https://platform.fatsecret.com/api/Default.aspx?screen=rapih)

### 3️⃣ Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 4️⃣ Start Development Servers

```bash
# Option 1: Start both frontend and backend concurrently
npm run dev

# Option 2: Start individually
npm run backend    # Backend only (http://localhost:5003)
npm run frontend   # Frontend only (http://localhost:5173)
```

### 5️⃣ Access Application

- **Frontend**: <http://localhost:5173>
- **Backend API**: <http://localhost:5003/api>
- **Health Check**: <http://localhost:5003/api/health>

### 6️⃣ Create Your First Account

1. Navigate to <http://localhost:5173>
2. Click "Sign Up" and fill in your details
3. Login with your credentials
4. Start exploring the platform!

---

## 🐳 Docker Deployment

### Using Docker Compose (Recommended for Development)

```bash
# Start all services (app + MongoDB + Mongo Express)
docker-compose up -d

# View logs
docker-compose logs -f fitverse-app

# Stop services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

**Services included:**

- **fitverse-app**: Main application (port 5003)
- **mongodb**: MongoDB database (port 27017)
- **mongo-express**: Database admin UI (port 8081)

### Manual Docker Build

```bash
# Build production image
docker build -t mern-fit-verse:latest .

# Run container
docker run -d \
  --name fitverse-app \
  -p 5003:5003 \
  -e NODE_ENV=production \
  -e MONGODB_URI="your-mongodb-uri" \
  -e JWT_SECRET="your-jwt-secret" \
  -e CLOUDINARY_CLOUD_NAME="your-cloud-name" \
  -e CLOUDINARY_API_KEY="your-api-key" \
  -e CLOUDINARY_API_SECRET="your-api-secret" \
  -e FATSECRET_CONSUMER_KEY="your-consumer-key" \
  -e FATSECRET_CONSUMER_SECRET="your-consumer-secret" \
  mern-fit-verse:latest

# View logs
docker logs -f fitverse-app

# Check health
curl http://localhost:5003/api/health
```

### Docker Image Details

**Multi-stage Build Process:**

1. **Frontend Build**: Compile React app with Vite
2. **Backend Build**: Transpile TypeScript to JavaScript
3. **Production**: Minimal Node.js Alpine image with compiled assets

**Image Size**: ~350MB (optimized with multi-stage builds)

---

## ☸️ Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (local or cloud)
- `kubectl` CLI configured
- Docker registry access (Docker Hub, GCR, ECR, etc.)

### 1️⃣ Create Kubernetes Secrets

```bash
# Create application secrets
kubectl create secret generic mern-fit-verse-env \
  --from-literal=NODE_ENV=production \
  --from-literal=PORT=5003 \
  --from-literal=MONGODB_URI="your-mongodb-uri" \
  --from-literal=JWT_SECRET="your-jwt-secret" \
  --from-literal=CLOUDINARY_CLOUD_NAME="your-cloud-name" \
  --from-literal=CLOUDINARY_API_KEY="your-api-key" \
  --from-literal=CLOUDINARY_API_SECRET="your-api-secret" \
  --from-literal=FATSECRET_CONSUMER_KEY="your-consumer-key" \
  --from-literal=FATSECRET_CONSUMER_SECRET="your-consumer-secret"

# Create Docker registry secret (if using private registry)
kubectl create secret docker-registry regcred \
  --docker-server=your-registry-server \
  --docker-username=your-username \
  --docker-password=your-password \
  --docker-email=your-email
```

### 2️⃣ Deploy Application

```bash
# Deploy to Kubernetes
kubectl apply -f kubernetes/

# Verify deployment
kubectl get deployments
kubectl get pods -l app=mern-fit-verse
kubectl get services

# View logs
kubectl logs -l app=mern-fit-verse -f --tail=100
```

### 3️⃣ Access Application

```bash
# Port forward for local testing
kubectl port-forward service/mern-fit-verse-service 8080:80

# Access via browser
open http://localhost:8080

# Get external IP (LoadBalancer service)
kubectl get service mern-fit-verse-service
```

### Health Checks & Monitoring

The deployment includes:

- **Liveness Probe**: Checks if app is running (port 5003)
- **Readiness Probe**: Checks if app is ready for traffic
- **Resource Limits**: CPU and memory constraints
- **Auto-restart**: Automatic pod restart on failure

---

## 🔧 Development

### Available NPM Scripts

```bash
# Backend Development
npm run backend          # Start backend with nodemon (auto-reload)
npm run start            # Start backend (production mode)
npm run build            # Compile TypeScript to JavaScript
npm run clean            # Remove dist/ and coverage/ folders

# Frontend Development
npm run frontend         # Start frontend dev server with Vite
npm run build:frontend   # Build frontend for production
cd frontend && npm run dev:host  # Frontend with network access

# Full Stack Development
npm run dev              # Start both frontend and backend concurrently
npm run build:full       # Build both frontend and backend

# Production
npm run start:prod       # Start compiled production build

# Testing & Quality
npm run test             # Run all tests
npm run test:backend     # Run backend tests only
npm run test:watch       # Run tests in watch mode
npm run lint             # Run linting checks
npm run lint:fix         # Auto-fix linting issues

# Utilities
npm run health-check     # Test application health endpoint
```

### Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Start development server
npm run dev

# 3. Make changes and test
# Frontend: http://localhost:5173
# Backend: http://localhost:5003

# 4. Run linting and tests
npm run lint
npm run test

# 5. Build for production
npm run build:full

# 6. Commit changes
git add .
git commit -m "feat: your feature description"

# 7. Push and create pull request
git push origin feature/your-feature-name
```

### Hot Reload Features

- **Frontend**: Vite HMR for instant UI updates without page reload
- **Backend**: Nodemon automatically restarts server on file changes
- **TypeScript**: Watch mode for type checking during development

---

## 🧪 Testing

### Test Framework

- **Jest**: JavaScript testing framework
- **ts-jest**: TypeScript preprocessor for Jest
- **Supertest**: HTTP assertions for API testing (planned)

### Current Test Coverage

```bash
# Run all tests
npm run test

# Run with coverage report
npm run test -- --coverage

# Run in watch mode
npm run test:watch

# Run specific test file
npm run test backend/__tests__/health.test.ts
```

### Test Structure (Planned)

```plaintext
__tests__/
├── backend/
│   ├── unit/              # Unit tests for controllers, models, utils
│   ├── integration/       # API integration tests
│   └── e2e/               # End-to-end API tests
└── frontend/
    ├── components/        # Component unit tests
    ├── integration/       # Feature integration tests
    └── e2e/               # End-to-end UI tests with Playwright
```

### Writing Tests

```typescript
// Example unit test
describe('Health Controller', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.text).toContain('FitVerse Health Check');
  });
});
```

---

## 📊 CI/CD Pipeline

The project includes a comprehensive Jenkins pipeline with security scanning and quality checks.

### Pipeline Stages

```groovy
1. 🧹 Clean Workspace         # Fresh environment for each build
2. 📥 Checkout from Git       # Clone repository from GitHub
3. 📊 SonarQube Analysis      # Code quality and security analysis
4. 🚪 Quality Gate            # Enforce quality standards
5. 📦 Install Dependencies    # npm install for backend and frontend
6. 🔨 Build Application       # TypeScript compilation and frontend build
7. 🧪 Run Tests               # Execute test suites
8. 🔒 OWASP Scan              # Dependency vulnerability scanning
9. 🐳 Docker Build            # Build production Docker image
10. 🔍 Trivy Security Scan    # Container image security scan
11. 📤 Docker Push            # Push to Docker Hub registry
12. 🧽 Cleanup                # Clean up Docker resources
```

### Pipeline Parameters

- **BUILD_TYPE**: `development` | `staging` | `production`
- **SKIP_TESTS**: Skip test execution for faster builds
- **SKIP_SECURITY_SCANS**: Skip OWASP and Trivy scans
- **CUSTOM_TAG**: Override default Docker image tag

### Running the Pipeline

```bash
# Trigger pipeline via Jenkins UI or CLI
# Development build
jenkins-cli build "mern-fit-verse" -p BUILD_TYPE=development

# Production build with all checks
jenkins-cli build "mern-fit-verse" -p BUILD_TYPE=production
```

### Quality Gates

- **Code Coverage**: Minimum threshold enforced
- **Duplicate Code**: Maximum 3% duplication allowed
- **Code Smells**: Critical issues must be resolved
- **Security Hotspots**: No high-severity vulnerabilities
- **Maintainability**: Maintainability rating A or B

---

## 🔒 Security

### Authentication & Authorization

- **JWT Tokens**: Secure stateless authentication with configurable expiration
- **bcrypt Hashing**: Password security with 10 salt rounds
- **HTTP-Only Cookies**: XSS protection with secure cookie storage
- **Role-Based Access Control**: Admin middleware for protected routes

### Security Best Practices

```typescript
// Password hashing on user creation
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// JWT token generation with expiration
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Protected route middleware
export const protect = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ message: 'Not authorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

### Security Scanning

- **OWASP Dependency Check**: Automated vulnerability scanning for dependencies
- **Trivy Security Scanner**: Container and filesystem security analysis
- **SonarQube**: Code security vulnerability detection
- **npm audit**: Regular dependency audit checks

### Environment Security

- Never commit `.env` files to version control
- Use Kubernetes secrets for production credentials
- Rotate JWT secrets regularly
- Enable HTTPS in production
- Implement rate limiting for API endpoints (planned)

---

## 📡 API Documentation

### Base URL

```http
Development: http://localhost:5003/api
Production: https://your-domain.com/api
```

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "dob": "1990-01-15",
  "gender": "male"
}
```

**Response:**

```json
{
  "_id": "user_id",
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "admin": false
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:** Sets HTTP-only cookie with JWT token

```json
{
  "_id": "user_id",
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com"
}
```

#### Logout User

```http
POST /api/auth/logout
```

**Response:** Clears JWT cookie

### User Management Endpoints

#### Get User Profile

```http
GET /api/users/profile
Authorization: Cookie (jwt)
```

#### Update User Profile

```http
PUT /api/users/profile
Authorization: Cookie (jwt)
Content-Type: multipart/form-data

{
  "name": "John Doe",
  "height": 180,
  "weight": 75,
  "weightUnit": "kg",
  "goal": "Build muscle",
  "photo": [file]
}
```

#### Get Suggested Users

```http
GET /api/users/profile/view/suggested
Authorization: Cookie (jwt)
```

#### View User Profile

```http
GET /api/users/profile/view/:username
Authorization: Cookie (jwt)
```

#### Follow/Unfollow User

```http
POST /api/users/profile/follow/:username
Authorization: Cookie (jwt)
```

### Posts & Social Features

#### Create Post

```http
POST /api/posts/create
Authorization: Cookie (jwt)
Content-Type: multipart/form-data

{
  "content": "Just finished my workout!",
  "image": [file]  // optional
}
```

#### Get Feed Posts

```http
GET /api/posts/feed
Authorization: Cookie (jwt)
```

#### Get Followed Users' Posts

```http
GET /api/posts/feed/followed
Authorization: Cookie (jwt)
```

#### Get User Posts

```http
GET /api/posts/user/:username
Authorization: Cookie (jwt)
```

#### Like/Unlike Post

```http
POST /api/posts/like/:postId
Authorization: Cookie (jwt)
```

#### Add Comment

```http
POST /api/posts/comment/:postId
Authorization: Cookie (jwt)
Content-Type: application/json

{
  "comment": "Great work! Keep it up!"
}
```

#### Delete Comment

```http
DELETE /api/posts/comment/:postId/:commentId
Authorization: Cookie (jwt)
```

#### Delete Post

```http
DELETE /api/posts/delete/:postId
Authorization: Cookie (jwt)
```

### Notifications

#### Get Notifications

```http
GET /api/notifications
Authorization: Cookie (jwt)
```

#### Delete All Notifications

```http
DELETE /api/notifications
Authorization: Cookie (jwt)
```

### Nutrition Tracking

#### Get Daily Nutrition

```http
GET /api/nutrition?date=2024-01-15
Authorization: Cookie (jwt)
```

**Response:**

```json
{
  "entries": [
    {
      "_id": "entry_id",
      "mealCategory": "breakfast",
      "foodItem": "Oatmeal",
      "calories": 300,
      "protein": 10,
      "carbs": 54,
      "fats": 6
    }
  ],
  "totals": {
    "calories": 1850,
    "protein": 145,
    "carbs": 210,
    "fats": 62
  }
}
```

#### Add Nutrition Entry

```http
POST /api/nutrition/add
Authorization: Cookie (jwt)
Content-Type: application/json

{
  "date": "2024-01-15",
  "mealCategory": "breakfast",
  "foodItem": "Oatmeal with Berries",
  "calories": 350,
  "protein": 12,
  "carbs": 58,
  "fats": 8
}
```

#### Delete Nutrition Entry

```http
DELETE /api/nutrition/delete/:entryId
Authorization: Cookie (jwt)
```

### FatSecret Food Database

#### Food Autocomplete

```http
GET /api/fatsecret/autocomplete?expression=chicken&max_results=8
Authorization: Cookie (jwt)
```

#### Search Foods

```http
GET /api/fatsecret/search?search_expression=chicken%20breast
Authorization: Cookie (jwt)
```

#### Get Food Details

```http
GET /api/fatsecret/food/:foodId
Authorization: Cookie (jwt)
```

### Custom Meal Categories

#### Get Custom Categories

```http
GET /api/custom-categories
Authorization: Cookie (jwt)
```

#### Add Custom Category

```http
POST /api/custom-categories/add
Authorization: Cookie (jwt)
Content-Type: application/json

{
  "name": "Pre-Workout",
  "color": "#FF6B6B",
  "order": 1
}
```

#### Delete Custom Category

```http
DELETE /api/custom-categories/delete/:categoryId
Authorization: Cookie (jwt)
```

### Exercise & Workout Endpoints

#### Get All Exercises

```http
GET /api/exercises
Authorization: Cookie (jwt)
```

#### Get Exercise by ID

```http
GET /api/exercises/:id
Authorization: Cookie (jwt)
```

#### Create Workout

```http
POST /api/workouts
Authorization: Cookie (jwt)
Content-Type: application/json

{
  "workoutType": "freestyle",
  "duration": 3600,
  "exercises": [
    {
      "exerciseId": "exercise_id",
      "exerciseName": "Bench Press",
      "sets": [
        { "setNumber": 1, "weight": 100, "reps": 10, "completed": true }
      ]
    }
  ],
  "notes": "Great workout!"
}
```

#### Get User Workouts

```http
GET /api/workouts
Authorization: Cookie (jwt)
```

#### Delete Workout

```http
DELETE /api/workouts/:workoutId
Authorization: Cookie (jwt)
```

### System Health

#### Health Check

```http
GET /api/health
```

**Response:** HTML dashboard with system status

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Quick Contribution Steps

```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/mern-fit-verse.git

# 3. Create feature branch
git checkout -b feature/amazing-feature

# 4. Make changes and commit
git commit -m "feat: add amazing feature"

# 5. Push to your fork
git push origin feature/amazing-feature

# 6. Open a Pull Request
```

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
feat: add new nutrition goal tracking
fix: resolve authentication token expiration
docs: update API documentation
style: format code with prettier
refactor: reorganize component structure
test: add unit tests for nutrition controller
chore: update dependencies
```

---

## 🚀 Roadmap

### ✅ Phase 1: Social Foundation (Completed)

- [x] Authentication system with JWT
- [x] User profiles and photo uploads
- [x] Follow/unfollow system
- [x] Social feed with posts
- [x] Like and comment system
- [x] Real-time notifications
- [x] Dark/light theme support

### ✅ Phase 2: Nutrition Tracking (Completed)

- [x] FatSecret API integration
- [x] Food search with autocomplete
- [x] Daily meal tracking
- [x] Custom meal categories
- [x] Macro tracking and goals
- [x] Visual progress charts
- [x] Historical data navigation

### 🚧 Phase 3: Fitness Tracking (In Progress)

- [x] Exercise database
- [x] Workout logging
- [ ] Workout templates
- [ ] Progress tracking
- [ ] Personal records
- [ ] Workout analytics

### 📋 Phase 4: Advanced Features (Planned)

- [ ] Meal planning with AI suggestions
- [ ] Barcode scanner for quick food logging
- [ ] Recipe database and sharing
- [ ] Water and sleep tracking
- [ ] Advanced nutrition analytics
- [ ] Fitness device integration

### 🎯 Phase 5: Mobile & Scale (Future)

- [ ] React Native mobile apps
- [ ] Offline support
- [ ] Push notifications
- [ ] Multi-language support
- [ ] Premium features
- [ ] Corporate wellness programs

---

## 📞 Support & Contact

### Get Help

- **Issues**: [GitHub Issues](https://github.com/xjohnfit/mern-fit-verse/issues)
- **Discussions**: [GitHub Discussions](https://github.com/xjohnfit/mern-fit-verse/discussions)
- **Email**: xjohnfitcodes@gmail.com

### Links

- **Repository**: [github.com/xjohnfit/mern-fit-verse](https://github.com/xjohnfit/mern-fit-verse)
- **Docker Hub**: [hub.docker.com/r/xjohnfit/mern-fit-verse](https://hub.docker.com/r/xjohnfit/mern-fit-verse)

---

## 📄 License

This project is licensed under the **ISC License**.

```text
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

Special thanks to:

- **MongoDB** for the powerful database platform
- **Cloudinary** for image management services
- **FatSecret** for the comprehensive nutrition API
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for the utility-first CSS framework
- **Vercel** for hosting and deployment solutions
- **Open Source Community** for continuous inspiration

---

<div align="center">

**Built with ❤️ by [John Winchester](https://github.com/xjohnfit)**

⭐ **Star this repository if you found it helpful!**

[![GitHub stars](https://img.shields.io/github/stars/xjohnfit/mern-fit-verse?style=social)](https://github.com/xjohnfit/mern-fit-verse/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/xjohnfit/mern-fit-verse?style=social)](https://github.com/xjohnfit/mern-fit-verse/network/members)
[![GitHub watchers](https://img.shields.io/github/watchers/xjohnfit/mern-fit-verse?style=social)](https://github.com/xjohnfit/mern-fit-verse/watchers)

**[⬆ Back to Top](#-mern-fitverse)**

</div>