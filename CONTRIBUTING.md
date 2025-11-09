# Contributing to MERN FitVerse 🏋️‍♂️

Thank you for your interest in contributing to MERN FitVerse! This guide will help you get started with contributing to our fitness application.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contribution Guidelines](#contribution-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Convention](#commit-convention)

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it to understand the expectations for all contributors.

## 🚀 Getting Started

1. **Fork the repository** to your GitHub account
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/mern-fit-verse.git
   cd mern-fit-verse
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/xjohnfit/mern-fit-verse.git
   ```
4. **Create a new branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🛠 Development Setup

### Prerequisites
- Node.js 20.x or higher
- npm or yarn
- MongoDB (local or cloud)
- Git

### Installation
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Set up environment variables
cp env.example .env
# Edit .env with your configuration

# Start development servers
npm run dev
```

## 🤝 Contribution Guidelines

### 🐛 Bug Reports
- Use the bug report template
- Include steps to reproduce
- Provide expected vs actual behavior
- Include screenshots if applicable
- Specify environment details

### ✨ Feature Requests
- Use the feature request template
- Clearly describe the problem and solution
- Include mockups or examples if possible
- Discuss the feature in issues before implementing

### 📝 Documentation
- Fix typos and improve clarity
- Add examples and use cases
- Update API documentation for changes
- Include inline code comments

## 🔄 Pull Request Process

1. **Ensure your code follows our standards**:
   ```bash
   npm run lint
   npm run test
   npm run build
   ```

2. **Update documentation** if needed

3. **Create a descriptive PR title**:
   - `feat: add workout tracking functionality`
   - `fix: resolve authentication token expiration`
   - `docs: update API documentation`

4. **Fill out the PR template** completely

5. **Request review** from maintainers

6. **Address feedback** promptly

## 📏 Coding Standards

### TypeScript
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use proper type annotations
- Avoid `any` type unless absolutely necessary

### React
- Use functional components with hooks
- Follow React best practices
- Use proper component structure
- Implement proper error boundaries

### Backend
- Use async/await for asynchronous operations
- Implement proper error handling
- Use middleware for common functionality
- Follow RESTful API conventions

### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent component styling
- Use CSS variables for theming

## 📝 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code change that neither fixes bug nor adds feature
- `test`: Adding missing tests
- `chore`: Maintain tasks, dependency updates

### Examples
```bash
feat(auth): add password reset functionality
fix(api): resolve user profile update issue
docs(readme): update installation instructions
style(components): format button component
refactor(database): optimize user query performance
test(auth): add unit tests for login controller
chore(deps): update dependencies to latest versions
```

## 🧪 Testing Guidelines

### Unit Tests
- Write tests for all new functionality
- Maintain high test coverage (>80%)
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Integration Tests
- Test API endpoints thoroughly
- Verify database interactions
- Test authentication flows
- Check error handling scenarios

### E2E Tests
- Test critical user journeys
- Verify cross-browser compatibility
- Test responsive design
- Check accessibility features

## 🎨 UI/UX Guidelines

### Design Principles
- **Consistency**: Use established patterns
- **Accessibility**: Follow WCAG guidelines
- **Performance**: Optimize for fast loading
- **Mobile-first**: Design for mobile devices first

### Component Guidelines
- Create reusable, composable components
- Use proper TypeScript props interfaces
- Implement proper error states
- Add loading states for async operations

## 🚀 Deployment

### Staging Deployments
- All PRs are automatically deployed to staging
- Test your changes in the staging environment
- Verify functionality before requesting final review

### Production Deployments
- Only maintainers can deploy to production
- Deployments happen after PR approval and merge
- Monitor application health after deployment

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Email**: [xjohnfitcodes@gmail.com](mailto:xjohnfitcodes@gmail.com)
- **Discord**: Join our community server (link in README)

## 🏆 Recognition

Contributors will be recognized in:
- Project README.md
- Release notes for their contributions
- Annual contributor appreciation posts

Thank you for contributing to MERN FitVerse! 💪