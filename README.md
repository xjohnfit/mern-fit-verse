# 🏋️‍♂️ MERN FitVerse

<div align="center">

![MERN FitVerse Logo](https://raw.githubusercontent.com/xjohnfit/mern-fit-verse/main/frontend/public/fit-verse-logo-no-bg.png)

**A Modern Full-Stack Fitness Application**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/xjohnfit/mern-fit-verse)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/xjohnfit/mern-fit-verse)
[![License](https://img.shields.io/badge/license-ISC-orange)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-enabled-blue)](https://hub.docker.com/r/xjohnfit/mern-fit-verse)
[![Kubernetes](https://img.shields.io/badge/kubernetes-ready-green)](kubernetes/)

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
- [🎨 Frontend Components](#-frontend-components)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🚀 Overview

**MERN FitVerse** is a comprehensive, full-stack fitness application built with modern web technologies. It provides users with an intuitive platform to manage their fitness journey, track workouts, monitor progress, and achieve their health goals.

### 🎯 Mission
To democratize fitness tracking by providing a user-friendly, feature-rich platform that helps individuals achieve their health and wellness goals through data-driven insights and personalized experiences.

### 🌟 Key Highlights
- **Full-Stack TypeScript**: End-to-end type safety and developer experience
- **Modern UI/UX**: Built with React 19, Tailwind CSS, and Radix UI components
- **Secure Authentication**: JWT-based auth with bcrypt password hashing
- **Production Ready**: Docker containerization and Kubernetes deployment
- **CI/CD Optimized**: Comprehensive Jenkins pipeline with security scanning
- **Responsive Design**: Mobile-first approach with dark/light theme support

---

## ✨ Features

### 👤 User Management
- **User Registration & Authentication**: Secure signup/login with JWT tokens
- **Profile Management**: Comprehensive user profiles with personal metrics
- **Privacy Controls**: Secure password hashing and data protection
- **Session Management**: Persistent login state with token refresh

### 🏋️‍♀️ Fitness Tracking (In Development)
- **Workout Planning**: Create and schedule personalized workout routines
- **Exercise Library**: Comprehensive database of exercises with instructions
- **Progress Tracking**: Monitor fitness metrics and achievements over time
- **Goal Setting**: Set and track fitness goals with visual progress indicators

### 📊 Analytics & Insights (Planned)
- **Performance Analytics**: Detailed workout analysis and progress reports
- **Nutrition Tracking**: Food diary and calorie monitoring
- **Health Metrics**: Weight, body measurements, and fitness assessments
- **Data Visualization**: Charts and graphs for progress visualization

### 🎨 User Experience
- **Modern Design**: Clean, intuitive interface with smooth animations
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Customizable theme with system preference detection
- **Accessibility**: WCAG compliant with keyboard navigation support

---

## 🛠 Tech Stack

### Frontend
```
React 19.1.1          | Modern React with concurrent features
TypeScript 5.9.3      | Static type checking and enhanced DX
Vite 7.1.7            | Fast build tool and dev server
Tailwind CSS 4.1.16   | Utility-first CSS framework
Radix UI              | Accessible, unstyled UI primitives
Redux Toolkit 2.10.1  | State management with RTK Query
React Router 7.9.5    | Client-side routing and navigation
Lucide React          | Beautiful, customizable icons
Sonner                | Toast notifications
Zustand 5.0.8         | Lightweight state management
```

### Backend
```
Node.js 20+           | JavaScript runtime environment
Express.js 5.1.0      | Fast, unopinionated web framework
TypeScript 5.9.3      | Type-safe backend development
MongoDB 8.19.2        | NoSQL database with Mongoose ODM
JWT                   | JSON Web Token authentication
bcrypt                | Password hashing and security
CORS                  | Cross-Origin Resource Sharing
```

### DevOps & Tools
```
Docker                | Containerization and deployment
Kubernetes            | Container orchestration
Jenkins               | CI/CD pipeline automation
SonarQube            | Code quality and security analysis
OWASP Dependency     | Security vulnerability scanning
Trivy                | Container image security scanning
ESLint               | Code linting and formatting
```

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    MERN FitVerse Architecture                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Client    │    │   Server    │    │  Database   │     │
│  │             │    │             │    │             │     │
│  │ React 19    │◄──►│ Express.js  │◄──►│  MongoDB    │     │
│  │ TypeScript  │    │ TypeScript  │    │  Mongoose   │     │
│  │ Redux       │    │ JWT Auth    │    │  Atlas      │     │
│  │ Tailwind    │    │ Middleware  │    │             │     │
│  │ Vite        │    │ CORS        │    │             │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                     Infrastructure                          │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Docker    │    │ Kubernetes  │    │  Jenkins    │     │
│  │             │    │             │    │             │     │
│  │ Multi-stage │    │ Deployment  │    │  CI/CD      │     │
│  │ Builds      │    │ Services    │    │  Pipeline   │     │
│  │ Production  │    │ ConfigMaps  │    │  Security   │     │
│  │ Optimized   │    │ Secrets     │    │  Scanning   │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### 📁 Project Structure
```
mern-fit-verse/
├── 📂 backend/                 # Express.js TypeScript backend
│   ├── 📂 config/             # Database and app configuration
│   ├── 📂 controllers/        # Route handlers and business logic
│   ├── 📂 middlewares/        # Authentication and error handling
│   ├── 📂 models/             # MongoDB schemas and models
│   ├── 📂 routes/             # API route definitions
│   ├── 📂 utils/              # Helper functions and utilities
│   └── 📄 index.ts           # Main server entry point
├── 📂 frontend/               # React TypeScript frontend
│   ├── 📂 public/            # Static assets and favicon
│   ├── 📂 src/               # Source code
│   │   ├── 📂 components/    # Reusable UI components
│   │   ├── 📂 screens/       # Page components and routes
│   │   ├── 📂 slices/        # Redux state management
│   │   ├── 📂 lib/           # Utility functions
│   │   └── 📂 assets/        # Images, fonts, icons
│   └── 📄 package.json      # Frontend dependencies
├── 📂 kubernetes/            # K8s deployment manifests
├── 📂 docs/                  # Documentation files
├── 📄 Dockerfile            # Multi-stage container build
├── 📄 Jenkinsfile           # CI/CD pipeline configuration
├── 📄 docker-compose.yml    # Local development setup
└── 📄 package.json          # Backend dependencies and scripts
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
JWT_EXPIRES_IN=7d

# Application
NODE_ENV=development
PORT=5003
FRONTEND_URL=http://localhost:5173

# Optional: Email service (for notifications)
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
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
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5003
- **Health Check**: http://localhost:5003/api/health

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
npm run start         # Start backend (production mode)
npm run build         # Compile TypeScript to JavaScript
npm run clean         # Remove build artifacts

# Frontend Development  
npm run frontend      # Start frontend dev server
npm run build:frontend # Build frontend for production
npm run dev           # Start both frontend and backend

# Full Application
npm run build:full    # Build both frontend and backend
npm run start:prod    # Start production build

# Utilities
npm run health-check  # Test application health endpoint
npm run lint          # Run code linting
npm run test          # Run test suites
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
│   └── 📂 e2e/          # End-to-end API tests
├── 📂 frontend/
│   ├── 📂 components/    # Component unit tests
│   ├── 📂 integration/   # Feature integration tests
│   └── 📂 e2e/          # End-to-end UI tests
└── 📄 jest.config.js    # Test configuration
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

### Authentication Endpoints
```http
POST /api/users/register    # User registration
POST /api/users/auth        # User login
POST /api/users/logout      # User logout
GET  /api/users/profile     # Get user profile (protected)
PUT  /api/users/profile     # Update user profile (protected)
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

Response:
{
  "status": "OK",
  "timestamp": "2025-11-09T10:30:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "filesystem": {
    "staticPathExists": true,
    "indexPathExists": true
  }
}
```

---

## 🎨 Frontend Components

### Component Architecture
```
components/
├── 🎯 UI Components (Radix UI based)
│   ├── Button          # Customizable button variants
│   ├── Avatar          # User profile pictures
│   ├── NavigationMenu  # Header navigation
│   └── Sonner          # Toast notifications
├── 📄 Layout Components
│   ├── Header          # Navigation and user menu
│   ├── Footer          # Site footer with links
│   └── AlertModal      # System notifications
└── 🔒 Utility Components
    └── PrivateRoute    # Protected route wrapper
```

### Screen Components
```
screens/
├── HomeScreen          # Landing page with features
├── LoginScreen         # User authentication
├── RegisterScreen      # User registration
└── dashboard/
    ├── DashboardScreen # Main user dashboard
    └── ProfileScreen   # User profile management
```

### State Management
```typescript
// Redux Store Structure
{
  auth: {
    isAuthenticated: boolean,
    userInfo: User | null,
    loading: boolean,
    error: string | null
  },
  // Future state slices
  workouts: { /* workout data */ },
  nutrition: { /* nutrition tracking */ },
  progress: { /* fitness progress */ }
}
```

### Styling System
- **Tailwind CSS**: Utility-first CSS framework
- **CSS Variables**: Theme customization and dark mode
- **Component Variants**: Consistent design system with CVA
- **Responsive Design**: Mobile-first responsive breakpoints

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

### Phase 1: Foundation (Current)
- [x] User authentication and authorization
- [x] Basic user profile management
- [x] Responsive UI with modern design
- [x] Docker containerization
- [x] CI/CD pipeline with Jenkins
- [x] Production deployment setup

### Phase 2: Core Features (Next)
- [ ] Exercise database and library
- [ ] Workout planning and scheduling
- [ ] Progress tracking and metrics
- [ ] Basic nutrition logging
- [ ] Data visualization and charts

### Phase 3: Advanced Features
- [ ] Social features and community
- [ ] AI-powered workout recommendations
- [ ] Nutrition analysis and suggestions
- [ ] Integration with fitness devices
- [ ] Mobile app development

### Phase 4: Scale & Optimize
- [ ] Performance optimization
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Premium features
- [ ] Enterprise features

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

<div align="center">

**Built with ❤️ by [John Winchester](https://github.com/xjohnfit)**

**⭐ Star this repository if you found it helpful!**

[![GitHub stars](https://img.shields.io/github/stars/xjohnfit/mern-fit-verse?style=social)](https://github.com/xjohnfit/mern-fit-verse/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/xjohnfit/mern-fit-verse?style=social)](https://github.com/xjohnfit/mern-fit-verse/network/members)

</div>
