# 🏋️‍♂️ MERN FitVerse

<div align="center">

<img src="frontend/public/fit-verse-logo-no-bg.png" alt="MERN FitVerse Logo" width="250">

**A Modern Full-Stack Social Fitness Platform with Microservices Architecture**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/xjohnfit/mern-fit-verse)
[![Version](https://img.shields.io/badge/version-2.0.0-blue)](https://github.com/xjohnfit/mern-fit-verse)
[![License](https://img.shields.io/badge/license-ISC-orange)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-enabled-blue)](https://hub.docker.com/r/xjohnfit)
[![Kubernetes](https://img.shields.io/badge/kubernetes-ready-green)](kubernetes/)
[![CI/CD](https://img.shields.io/badge/Jenkins-automated-orange)](Jenkinsfile)

**[Live Demo](https://fitverse.codewithxjohn.com) • [API Documentation](#-api-documentation) • [Report Bug](https://github.com/xjohnfit/mern-fit-verse/issues) • [Request Feature](https://github.com/xjohnfit/mern-fit-verse/issues)**

</div>

---

## 📋 Table of Contents

- [🚀 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🏗️ Architecture](#️-architecture)
- [🛠 Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚡ Quick Start](#-quick-start)
- [🐳 Docker Deployment](#-docker-deployment)
- [☸️ Kubernetes Deployment](#️-kubernetes-deployment)
- [🔧 Development Workflow](#-development-workflow)
- [🧪 Testing](#-testing)
- [📊 CI/CD Pipeline](#-cicd-pipeline)
- [🔒 Security](#-security)
- [📡 API Documentation](#-api-documentation)
- [🤝 Contributing](#-contributing)
- [🚀 Roadmap](#-roadmap)
- [📄 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)

---

## 🚀 Overview

**MERN FitVerse** is a production-ready, enterprise-grade social fitness platform that combines social networking with comprehensive fitness and nutrition tracking. Built with modern microservices architecture, it enables independent deployment and scaling of frontend and backend services while maintaining seamless integration.

### 🎯 Mission

To create a vibrant, inclusive fitness community where users can share their journey, motivate each other, and achieve their health and wellness goals through social interaction, comprehensive tracking tools, and personalized experiences.

### 🌟 What Makes FitVerse Different

- **🏗️ Microservices Architecture**: Independently deployable frontend and backend services
- **🔐 Enterprise Security**: JWT authentication, bcrypt hashing, HTTP-only cookies, CORS protection
- **👥 Social-First Design**: Built-in follow system, real-time feed, instant notifications
- **🥗 Advanced Nutrition**: Integration with FatSecret API (500,000+ foods), custom meal categories
- **🏋️ Comprehensive Fitness**: Exercise library, workout logging, progress tracking
- **📊 Data-Driven Insights**: Visual analytics with interactive charts and historical data
- **🎨 Modern UX**: React 19, Tailwind CSS 4, Radix UI, dark/light themes
- **📱 Responsive Design**: Mobile-first approach optimized for all devices
- **☁️ Cloud-Native**: Docker, Kubernetes, automated CI/CD with Jenkins
- **🔍 Quality Assurance**: SonarQube analysis, OWASP scanning, Trivy security checks

---

## ✨ Key Features

### 🔐 Authentication & Security

- **Secure Authentication**: JWT-based auth with bcrypt password hashing (10 salt rounds)
- **Session Management**: HTTP-only cookies prevent XSS attacks
- **User Validation**: Email uniqueness, username availability, password strength requirements
- **Protected Routes**: Client-side guards and server-side middleware
- **Role-Based Access**: Admin middleware for privileged operations

### 👥 Social Features

- **User Profiles**: 
  - Cloudinary-powered profile photos
  - Height, weight preferences (kg/lbs conversion)
  - Fitness goals and bio
  - Follower/following statistics
  
- **Follow System**: 
  - Follow/unfollow functionality
  - Follower and following lists with pagination
  - Real-time follow notifications
  
- **User Discovery**: 
  - Suggested users algorithm
  - Search functionality
  - Profile viewing and statistics

### 📱 Social Feed & Interaction

- **Content Sharing**: 
  - Create posts with text and images (Cloudinary integration)
  - Image optimization and CDN delivery
  - Post editing and deletion
  
- **Engagement**: 
  - Like/unlike posts with instant feedback
  - Comment system with nested replies
  - Real-time like and comment notifications
  
- **Feed Types**: 
  - Personalized feed (followed users + own posts)
  - Global feed (all public posts)
  - User-specific feeds (profile posts)

### 🔔 Real-Time Notifications

- **Notification Types**: 
  - Follow notifications
  - Post likes
  - Comments on posts
  - New message indicators
  
- **Features**: 
  - Real-time Socket.IO integration
  - Bell icon with unread count badge
  - Notification persistence
  - Batch deletion
  - Auto-refresh on new notifications

### 💬 Real-Time Messaging

- **Socket.IO Implementation**: 
  - Instant message delivery
  - Online/offline user status
  - Typing indicators (planned)
  - Message persistence in MongoDB
  
- **Features**: 
  - One-on-one conversations
  - Message history
  - User search and discovery
  - Conversation list with last message preview

### 🥗 Nutrition Tracking

#### Food Database Integration
- **FatSecret API**: Access to 500,000+ verified food items
- **Smart Search**: 
  - Real-time autocomplete (300ms debounce)
  - Minimum 2 characters activation
  - Brand and description details
  
- **Detailed Information**: 
  - Complete nutritional breakdown
  - Multiple serving sizes
  - Adjustable quantities
  - Calories, protein, carbs, fats per serving

#### Meal Tracking
- **Standard Categories**: Breakfast, Lunch, Dinner, Snacks
- **Custom Categories**: 
  - Create up to 3 personalized categories
  - Custom names (max 20 characters)
  - Custom colors for organization
  - Drag-and-drop reordering
  - Delete custom categories
  
- **Daily Logging**: 
  - Add/remove entries per category
  - Calorie and macro totals per meal
  - Daily summaries

#### Nutrition Goals & Analytics
- **Goal Setting**: 
  - Customizable daily calorie targets
  - Macro goals (protein, carbs, fats)
  - Weight goals (gain/lose/maintain)
  
- **Visual Analytics**: 
  - Interactive Recharts visualizations
  - Daily progress bars
  - Weekly trend graphs
  - Macro distribution pie charts
  
- **Historical Data**: 
  - Navigate previous dates
  - View weekly/monthly patterns
  - Compare daily intake

### 🏋️ Workout & Exercise Features

#### Exercise Library
- **Comprehensive Database**: 
  - 50+ pre-loaded exercises
  - Exercise descriptions and instructions
  - Category-based organization (Cardio, Strength, Flexibility)
  - Exercise images (Cloudinary integration)
  
- **Exercise Details**: 
  - Muscle groups targeted
  - Difficulty levels
  - Equipment requirements

#### Workout Logging
- **Workout Creation**: 
  - Create custom workouts
  - Add multiple exercises
  - Track sets, reps, weight
  - Add notes and comments
  
- **Workout History**: 
  - View past workouts
  - Track progress over time
  - Filter by date range
  - Exercise-specific history

#### Workout Templates (In Progress)
- **Template Creation**: Save frequently used workouts
- **Template Folders**: Organize templates by category
- **Quick Start**: Start workouts from templates
- **Template Sharing**: Share templates with community (planned)

### 🎨 Modern User Experience

- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Dark/Light Themes**: 
  - System preference detection
  - Manual toggle in header
  - Persistent theme selection
  - Smooth transitions
  
- **Modern UI Components**: 
  - Radix UI primitives for accessibility
  - Custom component library
  - Consistent design system
  
- **Animations**: 
  - Motion library integration
  - Page transitions
  - Micro-interactions
  - Loading states with skeletons
  
- **Toast Notifications**: 
  - Sonner toast system
  - Success/error/info variants
  - Auto-dismiss with customizable duration

### 🛡️ Admin Features

- **Admin Dashboard**: Dedicated admin screen
- **User Management**: Admin middleware protection
- **Content Moderation**: Tools for platform management
- **Analytics**: User statistics and platform metrics (planned)

---

## 🏗️ Architecture

### Microservices Architecture

FitVerse uses a modern microservices architecture that separates concerns and enables independent deployment:

```
┌─────────────────────────────────────────────────────────────┐
│                         Load Balancer                       │
│                    (NGINX / K8s Ingress)                    │
└─────────────────────┬───────────────────────┬───────────────┘
                      │                       │
         ┌────────────▼────────────┐ ┌───────▼──────────┐
         │   Frontend Service      │ │  Backend API     │
         │   (React SPA)           │ │  (Express.js)    │
         │   Port: 5173            │ │  Port: 5004      │
         │   Docker: xjohnfit/     │ │  Docker: xjohnfit│
         │   fitverse-frontend     │ │  /fitverse-api   │
         └────────────┬────────────┘ └───────┬──────────┘
                      │                      │
                      │                      │
         ┌────────────▼──────────────────────▼──────────┐
         │          External Services                   │
         ├──────────────────────────────────────────────┤
         │  • MongoDB Atlas (Database)                  │
         │  • Cloudinary (Image Storage)                │
         │  • FatSecret API (Nutrition Data)            │
         │  • Socket.IO (Real-time Communication)       │
         └──────────────────────────────────────────────┘
```

### Service Separation Benefits

1. **Independent Deployment**: 
   - Frontend and backend can be deployed separately
   - Zero-downtime deployments
   - Rollback individual services

2. **Scalability**: 
   - Scale frontend and backend independently
   - Horizontal scaling with Kubernetes
   - Efficient resource allocation

3. **Technology Flexibility**: 
   - Update React version without affecting backend
   - Migrate to different frontend framework
   - Replace backend components independently

4. **Development Workflow**: 
   - Separate CI/CD pipelines
   - Independent testing
   - Parallel team development

---

## 🛠 Tech Stack

### Frontend Technologies

```typescript
React 19.1.1          | Modern React with concurrent features
TypeScript 5.9.3      | Static typing for enhanced DX
Vite 7.1.7            | Lightning-fast build tool and HMR
Tailwind CSS 4.1.16   | Utility-first CSS with JIT
```

### Frontend Libraries

```typescript
// State Management
Redux Toolkit 2.10.1  | State management + RTK Query
React Redux 9.2.0     | React bindings for Redux

// Routing
React Router 7.9.5    | Client-side routing

// UI Components
Radix UI              | Accessible component primitives
Lucide React 0.552.0  | Beautiful icon library
Motion 12.23.24       | Animation library
Recharts 2.15.4       | Data visualization

// Real-time
Socket.IO Client 4.x  | WebSocket communication

// Utilities
Sonner 2.0.7          | Toast notifications
Next Themes 0.4.6     | Theme management
```

### Backend Technologies

```typescript
Node.js 20+           | JavaScript runtime
Express 5.1.0         | Web framework
TypeScript 5.9.3      | Static typing
Mongoose 8.19.2       | MongoDB ODM
Socket.IO 4.x         | Real-time engine
```

### Backend Libraries

```typescript
// Authentication
jsonwebtoken 9.0.2    | JWT generation
bcryptjs 3.0.3        | Password hashing
cookie-parser 1.4.7   | Cookie parsing

// File Upload
cloudinary 2.8.0      | Image management

// Development
nodemon 3.1.10        | Auto-restart dev server
concurrently 9.2.1    | Run multiple scripts
```

### External Services

```typescript
MongoDB Atlas         | Cloud database hosting
Cloudinary            | Image CDN and optimization
FatSecret Platform API| Nutrition database (500k+ foods)
```

### DevOps & Infrastructure

```yaml
Docker                | Containerization
Docker Compose        | Local multi-container orchestration
Kubernetes            | Container orchestration
Jenkins               | CI/CD automation
SonarQube             | Code quality analysis
OWASP Dependency Check| Vulnerability scanning
Trivy Scanner         | Container security scanning
```

---

## 📁 Project Structure

```
mern-fit-verse/
├── 📂 backend/                           # Express.js API Service
│   ├── 📂 config/
│   │   ├── cloudinary.ts                 # Cloudinary SDK configuration
│   │   ├── dbConnection.ts               # MongoDB connection
│   │   └── socket.io.ts                  # Socket.IO server setup
│   ├── 📂 controllers/
│   │   ├── authController.ts             # Authentication logic
│   │   ├── userController.ts             # User management
│   │   ├── postController.ts             # Social feed operations
│   │   ├── messageController.ts          # Real-time messaging
│   │   ├── notificationController.ts     # Notification management
│   │   ├── nutritionController.ts        # Nutrition CRUD
│   │   ├── fatSecretController.ts        # FatSecret API proxy
│   │   ├── customCategoryController.ts   # Custom meal categories
│   │   ├── exerciseController.ts         # Exercise library
│   │   ├── workoutController.ts          # Workout logging
│   │   ├── workoutTemplateController.ts  # Workout templates
│   │   └── healthController.ts           # Health checks
│   ├── 📂 middlewares/
│   │   ├── authMiddleware.ts             # JWT verification
│   │   ├── adminMiddleware.ts            # Admin authorization
│   │   └── errorMiddleware.ts            # Error handling
│   ├── 📂 models/
│   │   ├── userModel.ts                  # User schema
│   │   ├── postModel.ts                  # Post schema
│   │   ├── messageModel.ts               # Message schema
│   │   ├── notificationModel.ts          # Notification schema
│   │   ├── nutritionModel.ts             # Nutrition entry schema
│   │   ├── customCategoryModel.ts        # Custom category schema
│   │   ├── exerciseModel.ts              # Exercise schema
│   │   ├── workoutModel.ts               # Workout schema
│   │   └── workoutTemplateModel.ts       # Template schema
│   ├── 📂 routes/
│   │   ├── authRoutes.ts                 # Auth endpoints
│   │   ├── userRoutes.ts                 # User endpoints
│   │   ├── postRoutes.ts                 # Post endpoints
│   │   ├── messageRoutes.ts              # Message endpoints
│   │   ├── notificationRoutes.ts         # Notification endpoints
│   │   ├── nutritionRoutes.ts            # Nutrition endpoints
│   │   ├── fatSecretRoutes.ts            # FatSecret proxy
│   │   ├── customCategoryRoutes.ts       # Category endpoints
│   │   ├── exercisesRoutes.ts            # Exercise endpoints
│   │   ├── workoutRoutes.ts              # Workout endpoints
│   │   ├── workoutTemplateRoutes.ts      # Template endpoints
│   │   └── healthRoutes.ts               # Health endpoint
│   ├── 📂 utils/
│   │   ├── generateToken.ts              # JWT helper
│   │   └── weightConversion.ts           # Unit conversion
│   ├── 📂 __tests__/
│   │   └── health.test.ts                # Jest tests
│   ├── 📂 kubernetes/
│   │   ├── deployment.yml                # K8s deployment
│   │   └── service.yml                   # K8s service
│   ├── .dockerignore
│   ├── .env.development                  # Dev environment vars
│   ├── .env.production                   # Prod environment vars
│   ├── .env.example                      # Environment template
│   ├── Dockerfile                        # Multi-stage build
│   ├── docker-compose.yml                # Local development
│   ├── Jenkinsfile                       # Backend CI/CD pipeline
│   ├── jest.config.js                    # Jest configuration
│   ├── tsconfig.json                     # TypeScript config
│   ├── package.json                      # Dependencies
│   ├── sonar-project.properties          # SonarQube config
│   ├── owasp-suppressions.xml            # OWASP suppressions
│   ├── index.ts                          # Express server entry
│   ├── README.md                         # Backend documentation
│   └── SOCKETIO_IMPLEMENTATION.md        # Socket.IO docs
│
├── 📂 frontend/                          # React SPA Service
│   ├── 📂 public/
│   │   └── fit-verse-logo-no-bg.png      # App logo
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── 📂 common/
│   │   │   │   ├── PrivateRoute.tsx      # Auth guard
│   │   │   │   ├── ScrollToTop.tsx       # Scroll utility
│   │   │   │   ├── ThemeToggle.tsx       # Theme switcher
│   │   │   │   └── NotificationBell.tsx  # Notification icon
│   │   │   ├── 📂 layout/
│   │   │   │   ├── Header.tsx            # Navigation header
│   │   │   │   └── Footer.tsx            # Site footer
│   │   │   ├── 📂 modals/
│   │   │   │   └── AlertModal.tsx        # Alert dialogs
│   │   │   └── 📂 ui/                    # Radix UI components
│   │   │       ├── avatar.tsx
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── chart.tsx
│   │   │       ├── input.tsx
│   │   │       ├── navigation-menu.tsx
│   │   │       ├── sonner.tsx
│   │   │       ├── tabs.tsx
│   │   │       └── wobble-card.tsx
│   │   ├── 📂 hooks/
│   │   │   ├── useSocket.ts              # Socket.IO hook
│   │   │   └── useNotifications.ts       # Notification hook
│   │   ├── 📂 lib/
│   │   │   ├── calculateAge.ts           # Age calculation
│   │   │   ├── cacheBuster.ts            # Image cache busting
│   │   │   ├── formatDate.ts             # Date formatting
│   │   │   ├── getInitials.ts            # Avatar initials
│   │   │   ├── getPasswordStrength.ts    # Password validation
│   │   │   ├── utils.ts                  # Utility functions
│   │   │   └── weightConversion.ts       # Weight conversion
│   │   ├── 📂 screens/
│   │   │   ├── HomeScreen.tsx            # Landing page
│   │   │   ├── LoginScreen.tsx           # Login form
│   │   │   ├── RegisterScreen.tsx        # Registration form
│   │   │   ├── PrivacyPolicy.tsx         # Privacy policy
│   │   │   ├── TermsOfService.tsx        # Terms of service
│   │   │   └── 📂 protected/             # Auth-required screens
│   │   │       ├── 📂 admin/
│   │   │       │   └── AdminScreen.tsx
│   │   │       ├── 📂 dashboard/
│   │   │       │   ├── DashboardScreen.tsx
│   │   │       │   ├── components/
│   │   │       │   └── types.ts
│   │   │       ├── 📂 messages/
│   │   │       │   ├── MessagesScreen.tsx
│   │   │       │   └── components/
│   │   │       ├── 📂 nutrition/
│   │   │       │   ├── NutritionScreen.tsx
│   │   │       │   ├── components/
│   │   │       │   ├── constants.ts
│   │   │       │   └── types.ts
│   │   │       ├── 📂 profile/
│   │   │       │   └── (profile screens)
│   │   │       ├── 📂 settings/
│   │   │       │   └── (settings screens)
│   │   │       └── 📂 workout/
│   │   │           ├── WorkoutScreen.tsx
│   │   │           ├── StartWorkoutScreen.tsx
│   │   │           ├── WorkoutDetailScreen.tsx
│   │   │           ├── components/
│   │   │           └── types.ts
│   │   ├── 📂 slices/
│   │   │   ├── apiSlice.ts               # RTK Query base
│   │   │   ├── authSlice.ts              # Auth state
│   │   │   ├── usersApiSlice.ts          # User API
│   │   │   ├── postsApiSlice.ts          # Posts API
│   │   │   ├── messageApiSlice.ts        # Messages API
│   │   │   ├── notificationApiSlice.ts   # Notifications API
│   │   │   ├── nutritionApiSlice.ts      # Nutrition API
│   │   │   ├── fatSecretApiSlice.ts      # FatSecret API
│   │   │   ├── customCategoryApiSlice.ts # Categories API
│   │   │   ├── exerciseApiSlice.ts       # Exercises API
│   │   │   ├── workoutApiSlice.ts        # Workouts API
│   │   │   └── workoutTemplateApiSlice.ts# Templates API
│   │   ├── App.tsx                       # Root component
│   │   ├── main.tsx                      # React entry
│   │   ├── store.ts                      # Redux store
│   │   └── index.css                     # Global styles
│   ├── .env                              # Dev environment
│   ├── .env.production                   # Prod environment
│   ├── .env.example                      # Environment template
│   ├── components.json                   # Radix UI config
│   ├── Dockerfile                        # Multi-stage build
│   ├── docker-compose.yml                # Local development
│   ├── Jenkinsfile                       # Frontend CI/CD
│   ├── vite.config.ts                    # Vite config
│   ├── tsconfig.json                     # TypeScript config
│   ├── eslint.config.js                  # ESLint config
│   ├── tailwind.config.js                # Tailwind config
│   ├── package.json                      # Dependencies
│   └── README.md                         # Frontend docs
│
├── 📂 mobile/                            # React Native app (Future)
├── .gitignore                            # Git ignore rules
├── CONTRIBUTING.md                       # Contribution guidelines
├── README.md                             # This file
├── SOCKETIO_IMPLEMENTATION.md            # Real-time docs
└── todo.txt                              # Development tasks
```

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** 20.x or higher
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)
- **Git**

### 1️⃣ Clone Repository

```bash
git clone https://github.com/xjohnfit/mern-fit-verse.git
cd mern-fit-verse
```

### 2️⃣ Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.development

# Edit .env.development with your configuration
nano .env.development
```

**Required Environment Variables:**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/fitverse
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/fitverse

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=7d

# Application
NODE_ENV=development
PORT=5004
FRONTEND_URL=http://localhost:5173

# Cloudinary (for images)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# FatSecret (for nutrition)
FATSECRET_CONSUMER_KEY=your-consumer-key
FATSECRET_CONSUMER_SECRET=your-consumer-secret
```

**Get API Keys:**
- **Cloudinary**: [Sign up at cloudinary.com](https://cloudinary.com/users/register/free)
- **FatSecret**: [Register at platform.fatsecret.com](https://platform.fatsecret.com/api/Default.aspx?screen=rapih)

```bash
# Start backend server
npm run dev
# Backend runs on http://localhost:5004
```

### 3️⃣ Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Required Environment Variables:**
```env
VITE_MODE=development
VITE_BACKEND_URL=http://localhost:5004
```

```bash
# Start frontend development server
npm run dev
# Frontend runs on http://localhost:5173
```

### 4️⃣ Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5004/api
- **Health Check**: http://localhost:5004/api/health

### 5️⃣ Create Your First Account

1. Navigate to http://localhost:5173
2. Click "Sign Up"
3. Fill in your details
4. Login and explore!

---

## 🐳 Docker Deployment

### Backend Service

```bash
cd backend

# Build image
docker build -t xjohnfit/fitverse-api:latest .

# Run container
docker run -d \
  --name fitverse-api \
  -p 5004:5004 \
  --env-file .env.production \
  xjohnfit/fitverse-api:latest

# View logs
docker logs -f fitverse-api
```

### Frontend Service

```bash
cd frontend

# Build image
docker build -t xjohnfit/fitverse-frontend:latest .

# Run container
docker run -d \
  --name fitverse-frontend \
  -p 5173:80 \
  --env-file .env.production \
  xjohnfit/fitverse-frontend:latest

# View logs
docker logs -f fitverse-frontend
```

### Docker Compose (Local Development)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Clean slate
docker-compose down -v
```

---

## ☸️ Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (local or cloud)
- kubectl configured
- Docker images pushed to registry

### Backend Deployment

```bash
cd backend/kubernetes

# Create secrets
kubectl create secret generic fitverse-api-secrets \
  --from-literal=MONGODB_URI="your-mongodb-uri" \
  --from-literal=JWT_SECRET="your-jwt-secret" \
  --from-literal=CLOUDINARY_CLOUD_NAME="your-cloud-name" \
  --from-literal=CLOUDINARY_API_KEY="your-api-key" \
  --from-literal=CLOUDINARY_API_SECRET="your-api-secret" \
  --from-literal=FATSECRET_CONSUMER_KEY="your-consumer-key" \
  --from-literal=FATSECRET_CONSUMER_SECRET="your-consumer-secret"

# Deploy backend
kubectl apply -f deployment.yml
kubectl apply -f service.yml

# Verify
kubectl get pods
kubectl get svc
```

### Frontend Deployment

```bash
cd frontend/kubernetes

# Create config
kubectl create configmap fitverse-frontend-config \
  --from-literal=VITE_BACKEND_URL="https://api.fitverse.codewithxjohn.com"

# Deploy frontend
kubectl apply -f deployment.yml
kubectl apply -f service.yml

# Verify
kubectl get pods
kubectl get svc
```

### Ingress Configuration

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: fitverse-ingress
spec:
  rules:
  - host: fitverse.codewithxjohn.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: fitverse-frontend
            port:
              number: 80
  - host: api.fitverse.codewithxjohn.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: fitverse-api
            port:
              number: 5004
```

---

## 🔧 Development Workflow

### Backend Development

```bash
cd backend

# Development mode (auto-reload)
npm run dev

# Run tests
npm run test

# Run linter
npm run lint

# Build for production
npm run build

# Start production build
npm run start
```

### Frontend Development

```bash
cd frontend

# Development mode (HMR)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Full Stack Development

From project root:

```bash
# Start both services concurrently
npm run dev

# Build both services
npm run build:full
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm run test

# Run with coverage
npm run test -- --coverage

# Watch mode
npm run test:watch

# Specific test file
npm run test health.test.ts
```

### Frontend Tests (Planned)

```bash
cd frontend

# Run component tests
npm run test

# Run E2E tests
npm run test:e2e
```

---

## 📊 CI/CD Pipeline

Both backend and frontend have separate Jenkins pipelines for independent deployment.

### Backend Pipeline ([backend/Jenkinsfile](backend/Jenkinsfile))

```groovy
Stages:
1. Clean Workspace
2. Checkout from Git
3. Install Dependencies
4. Lint Code
5. Run Tests
6. Build TypeScript
7. SonarQube Analysis
8. Quality Gate
9. OWASP Dependency Check
10. Docker Build
11. Trivy Security Scan
12. Push to Docker Hub
13. Update Kubernetes Deployment
14. Cleanup
```

### Frontend Pipeline ([frontend/Jenkinsfile](frontend/Jenkinsfile))

```groovy
Stages:
1. Clean Workspace
2. Checkout from Git
3. Install Dependencies
4. Lint Code
5. Build with Vite
6. SonarQube Analysis
7. Quality Gate
8. Docker Build
9. Trivy Security Scan
10. Push to Docker Hub
11. Update Kubernetes Deployment
12. Cleanup
```

### Running Pipelines

```bash
# Trigger backend pipeline
curl -X POST http://jenkins-server/job/fitverse-backend/build

# Trigger frontend pipeline
curl -X POST http://jenkins-server/job/fitverse-frontend/build
```

---

## 🔒 Security

### Authentication

- **JWT Tokens**: 7-day expiration, configurable
- **HTTP-Only Cookies**: XSS protection
- **bcrypt Hashing**: 10 salt rounds
- **Password Requirements**: Minimum 8 characters, mixed case, numbers

### Authorization

- **Protected Routes**: JWT verification middleware
- **Admin Middleware**: Role-based access control
- **CORS Configuration**: Whitelisted origins

### Security Scanning

- **OWASP Dependency Check**: Automated vulnerability scanning
- **Trivy**: Container and filesystem security analysis
- **SonarQube**: Code security analysis
- **npm audit**: Regular dependency audits

### Best Practices

- Never commit `.env` files
- Use Kubernetes secrets in production
- Rotate JWT secrets regularly
- Enable HTTPS in production
- Implement rate limiting (planned)

---

## 📡 API Documentation

### Base URLs

```
Development: http://localhost:5004/api
Production: https://api.fitverse.codewithxjohn.com/api
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

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Logout User
```http
POST /api/auth/logout
Authorization: Cookie (jwt)
```

### User Endpoints

#### Get User Profile
```http
GET /api/users/profile
Authorization: Cookie (jwt)
```

#### Update User Profile
```http
PUT /api/users/profile
Authorization: Cookie (jwt)
Content-Type: application/json

{
  "name": "John Doe",
  "bio": "Fitness enthusiast"
}
```

#### Follow User
```http
POST /api/users/follow/:userId
Authorization: Cookie (jwt)
```

For complete API documentation, see [Backend README](backend/README.md#-api-documentation).

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Quick Start

```bash
# Fork repository
# Clone your fork
git clone https://github.com/YOUR_USERNAME/mern-fit-verse.git

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and commit
git commit -m "feat: add amazing feature"

# Push to your fork
git push origin feature/amazing-feature

# Open Pull Request
```

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: restructure code
test: add tests
chore: update dependencies
```

---

## 🚀 Roadmap

### ✅ Phase 1: Social Foundation (Completed)
- [x] JWT authentication
- [x] User profiles with photos
- [x] Follow/unfollow system
- [x] Social feed with posts
- [x] Like and comment system
- [x] Real-time notifications
- [x] Dark/light themes

### ✅ Phase 2: Nutrition Tracking (Completed)
- [x] FatSecret API integration
- [x] Food search and autocomplete
- [x] Daily meal tracking
- [x] Custom meal categories
- [x] Macro tracking and goals
- [x] Visual analytics with charts
- [x] Historical data navigation

### ✅ Phase 3: Real-Time Features (Completed)
- [x] Socket.IO implementation
- [x] Real-time messaging
- [x] Online/offline status
- [x] Message persistence
- [x] Conversation history

### 🚧 Phase 4: Fitness Tracking (In Progress)
- [x] Exercise library
- [x] Workout logging
- [x] Workout templates
- [ ] Progress tracking
- [ ] Personal records
- [ ] Workout analytics

### 📋 Phase 5: Advanced Features (Planned)
- [ ] AI meal suggestions
- [ ] Barcode scanner
- [ ] Recipe database
- [ ] Water tracking
- [ ] Sleep tracking
- [ ] Fitness device integration

### 🎯 Phase 6: Mobile & Scale (Future)
- [ ] React Native mobile apps
- [ ] Offline support
- [ ] Push notifications
- [ ] Multi-language support
- [ ] Premium features
- [ ] Corporate wellness programs

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/xjohnfit/mern-fit-verse/issues)
- **Discussions**: [GitHub Discussions](https://github.com/xjohnfit/mern-fit-verse/discussions)
- **Email**: [xjohnfitcodes@gmail.com](mailto:xjohnfitcodes@gmail.com)
- **Portfolio**: [codewithxjohn.com](https://codewithxjohn.com)

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
- **The Open Source Community** for continuous inspiration

---

<div align="center">

**Built with ❤️ by [John Winchester](https://github.com/xjohnfit)**

⭐ **Star this repository if you found it helpful!**

[![GitHub stars](https://img.shields.io/github/stars/xjohnfit/mern-fit-verse?style=social)](https://github.com/xjohnfit/mern-fit-verse/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/xjohnfit/mern-fit-verse?style=social)](https://github.com/xjohnfit/mern-fit-verse/network/members)
[![GitHub watchers](https://img.shields.io/github/watchers/xjohnfit/mern-fit-verse?style=social)](https://github.com/xjohnfit/mern-fit-verse/watchers)

**[⬆ Back to Top](#-mern-fitverse)**

</div>