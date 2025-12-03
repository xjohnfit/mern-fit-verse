import { Request, Response } from 'express';

const apiLandingScreen = (req: Request, res: Response) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FitVerse API - Developer Portal</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            :root {
                --primary: #667eea;
                --primary-dark: #5568d3;
                --secondary: #764ba2;
                --success: #10b981;
                --warning: #f59e0b;
                --danger: #ef4444;
                --gray-50: #f9fafb;
                --gray-100: #f3f4f6;
                --gray-200: #e5e7eb;
                --gray-600: #4b5563;
                --gray-800: #1f2937;
                --gray-900: #111827;
            }
            
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                color: var(--gray-900);
                min-height: 100vh;
                overflow-x: hidden;
            }
            
            /* Navigation */
            .navbar {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                position: sticky;
                top: 0;
                z-index: 1000;
            }
            
            .nav-container {
                max-width: 1400px;
                margin: 0 auto;
                padding: 1rem 2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .logo {
                font-size: 1.5rem;
                font-weight: 700;
                background: linear-gradient(135deg, var(--primary), var(--secondary));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .nav-links {
                display: flex;
                gap: 2rem;
                list-style: none;
            }
            
            .nav-links a {
                color: var(--gray-800);
                text-decoration: none;
                font-weight: 500;
                transition: color 0.2s;
            }
            
            .nav-links a:hover {
                color: var(--primary);
            }
            
            /* Hero Section */
            .hero {
                padding: 4rem 2rem;
                text-align: center;
                color: white;
            }
            
            .hero-container {
                max-width: 900px;
                margin: 0 auto;
            }
            
            .hero h1 {
                font-size: 3.5rem;
                font-weight: 800;
                margin-bottom: 1rem;
                line-height: 1.1;
            }
            
            .hero-subtitle {
                font-size: 1.25rem;
                opacity: 0.95;
                margin-bottom: 2rem;
                line-height: 1.6;
            }
            
            .status-badge {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                background: rgba(16, 185, 129, 0.2);
                border: 2px solid var(--success);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 50px;
                font-weight: 600;
                font-size: 0.875rem;
                margin-bottom: 2rem;
            }
            
            .status-dot {
                width: 8px;
                height: 8px;
                background: var(--success);
                border-radius: 50%;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.5; transform: scale(1.1); }
            }
            
            .cta-buttons {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .btn {
                padding: 0.875rem 2rem;
                border-radius: 8px;
                font-weight: 600;
                text-decoration: none;
                transition: all 0.2s;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                border: none;
                cursor: pointer;
                font-size: 1rem;
            }
            
            .btn-primary {
                background: white;
                color: var(--primary);
            }
            
            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
            }
            
            .btn-secondary {
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: 2px solid white;
            }
            
            .btn-secondary:hover {
                background: rgba(255, 255, 255, 0.3);
            }
            
            /* Main Content */
            .container {
                max-width: 1400px;
                margin: 0 auto;
                padding: 3rem 2rem;
            }
            
            .section-header {
                text-align: center;
                margin-bottom: 3rem;
            }
            
            .section-title {
                font-size: 2rem;
                font-weight: 700;
                color: white;
                margin-bottom: 0.5rem;
            }
            
            .section-subtitle {
                font-size: 1.125rem;
                color: rgba(255, 255, 255, 0.9);
            }
            
            /* Feature Cards */
            .features-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem;
                margin-bottom: 4rem;
            }
            
            .feature-card {
                background: white;
                border-radius: 16px;
                padding: 2rem;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                transition: all 0.3s;
            }
            
            .feature-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
            }
            
            .feature-icon {
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, var(--primary), var(--secondary));
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                margin-bottom: 1rem;
            }
            
            .feature-title {
                font-size: 1.25rem;
                font-weight: 600;
                color: var(--gray-900);
                margin-bottom: 0.5rem;
            }
            
            .feature-description {
                color: var(--gray-600);
                line-height: 1.6;
            }
            
            /* Endpoints Section */
            .endpoints-section {
                background: white;
                border-radius: 16px;
                padding: 2rem;
                margin-bottom: 3rem;
            }
            
            .tabs {
                display: flex;
                gap: 1rem;
                margin-bottom: 2rem;
                border-bottom: 2px solid var(--gray-200);
                flex-wrap: wrap;
            }
            
            .tab {
                padding: 0.75rem 1.5rem;
                background: none;
                border: none;
                color: var(--gray-600);
                font-weight: 600;
                cursor: pointer;
                border-bottom: 3px solid transparent;
                transition: all 0.2s;
                margin-bottom: -2px;
            }
            
            .tab:hover {
                color: var(--primary);
            }
            
            .tab.active {
                color: var(--primary);
                border-bottom-color: var(--primary);
            }
            
            .tab-content {
                display: none;
            }
            
            .tab-content.active {
                display: block;
                animation: fadeIn 0.3s;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .endpoint-group {
                margin-bottom: 2rem;
            }
            
            .endpoint-group-title {
                font-size: 1.125rem;
                font-weight: 600;
                color: var(--gray-800);
                margin-bottom: 1rem;
                padding-bottom: 0.5rem;
                border-bottom: 2px solid var(--gray-200);
            }
            
            .endpoint-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 0.875rem;
                background: var(--gray-50);
                border-radius: 8px;
                margin-bottom: 0.5rem;
                transition: all 0.2s;
            }
            
            .endpoint-item:hover {
                background: var(--gray-100);
                transform: translateX(4px);
            }
            
            .method-badge {
                padding: 0.25rem 0.75rem;
                border-radius: 6px;
                font-weight: 700;
                font-size: 0.75rem;
                text-transform: uppercase;
                min-width: 60px;
                text-align: center;
            }
            
            .method-get { background: #dbeafe; color: #1e40af; }
            .method-post { background: #dcfce7; color: #166534; }
            .method-put { background: #fef3c7; color: #92400e; }
            .method-delete { background: #fee2e2; color: #991b1b; }
            
            .endpoint-path {
                font-family: 'Courier New', monospace;
                color: var(--gray-800);
                font-size: 0.875rem;
                flex: 1;
            }
            
            .endpoint-auth {
                font-size: 0.75rem;
                color: var(--gray-600);
                padding: 0.25rem 0.5rem;
                background: var(--gray-200);
                border-radius: 4px;
            }
            
            /* Stats Section */
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1.5rem;
                margin-bottom: 3rem;
            }
            
            .stat-card {
                background: white;
                border-radius: 12px;
                padding: 1.5rem;
                text-align: center;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            .stat-value {
                font-size: 2rem;
                font-weight: 700;
                color: var(--primary);
                margin-bottom: 0.25rem;
            }
            
            .stat-label {
                font-size: 0.875rem;
                color: var(--gray-600);
                font-weight: 500;
            }
            
            /* Footer */
            .footer {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                padding: 2rem;
                text-align: center;
                color: white;
                margin-top: 4rem;
            }
            
            .footer-links {
                display: flex;
                justify-content: center;
                gap: 2rem;
                margin-bottom: 1rem;
                flex-wrap: wrap;
            }
            
            .footer-links a {
                color: white;
                text-decoration: none;
                transition: opacity 0.2s;
            }
            
            .footer-links a:hover {
                opacity: 0.8;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .hero h1 {
                    font-size: 2.5rem;
                }
                
                .nav-links {
                    display: none;
                }
                
                .features-grid {
                    grid-template-columns: 1fr;
                }
                
                .cta-buttons {
                    flex-direction: column;
                }
            }
        </style>
    </head>
    <body>
        <nav class="navbar">
            <div class="nav-container">
                <div class="logo">🏋️‍♂️ FitVerse API</div>
                <ul class="nav-links">
                    <li><a href="#features">Features</a></li>
                    <li><a href="#endpoints">Endpoints</a></li>
                    <li><a href="/api/health">Health</a></li>
                </ul>
            </div>
        </nav>

        <section class="hero">
            <div class="hero-container">
                <div class="status-badge">
                    <span class="status-dot"></span>
                    <span>API Status: Operational</span>
                </div>
                <h1>Build Amazing Fitness Apps</h1>
                <p class="hero-subtitle">A powerful, modern REST API for social fitness platforms. Access comprehensive endpoints for authentication, social networking, nutrition tracking, and workout management.</p>
                <div class="cta-buttons">
                    <a href="https://github.com/xjohnfit/mern-fit-verse" class="btn btn-primary" target="_blank">📚 Documentation</a>
                    <a href="https://fitverse.codewithxjohn.com" class="btn btn-secondary" target="_blank">🌐 Live Demo</a>
                    <a href="/api/health" class="btn btn-secondary">💚 Health Check</a>
                </div>
            </div>
        </section>

        <div class="container">
            <div class="stats-grid">
                <div class="stat-card"><div class="stat-value">v2.0.0</div><div class="stat-label">API Version</div></div>
                <div class="stat-card"><div class="stat-value">24/7</div><div class="stat-label">Uptime</div></div>
                <div class="stat-card"><div class="stat-value">REST</div><div class="stat-label">Protocol</div></div>
                <div class="stat-card"><div class="stat-value">JWT</div><div class="stat-label">Auth</div></div>
                <div class="stat-card"><div class="stat-value">${
                    process.env.NODE_ENV || 'dev'
                }</div><div class="stat-label">Environment</div></div>
            </div>

            <div id="features" class="section-header">
                <h2 class="section-title">Core Features</h2>
                <p class="section-subtitle">Everything you need to build a complete fitness platform</p>
            </div>
            
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🔐</div>
                    <h3 class="feature-title">Secure Authentication</h3>
                    <p class="feature-description">JWT-based authentication with HTTP-only cookies, bcrypt password hashing, and session management.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">👥</div>
                    <h3 class="feature-title">Social Networking</h3>
                    <p class="feature-description">Follow system, profiles, feeds, posts with images, likes, comments, and real-time notifications.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🥗</div>
                    <h3 class="feature-title">Nutrition Tracking</h3>
                    <p class="feature-description">FatSecret API with 500k+ foods, custom categories, macro tracking, and visual analytics.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">💪</div>
                    <h3 class="feature-title">Workout Management</h3>
                    <p class="feature-description">Exercise library, workout logging, templates, folders, and progress tracking.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">💬</div>
                    <h3 class="feature-title">Real-Time Messaging</h3>
                    <p class="feature-description">Socket.IO powered messaging with online status and message persistence.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🔔</div>
                    <h3 class="feature-title">Push Notifications</h3>
                    <p class="feature-description">Real-time notifications for follows, likes, comments, and messages.</p>
                </div>
            </div>

            <div id="endpoints" class="endpoints-section">
                <div class="section-header" style="margin-bottom: 2rem;">
                    <h2 style="color: var(--gray-900);">API Endpoints</h2>
                    <p style="color: var(--gray-600);">Browse available endpoints by category</p>
                </div>
                
                <div class="tabs">
                    <button class="tab active" onclick="switchTab('auth')">🔐 Auth</button>
                    <button class="tab" onclick="switchTab('users')">👤 Users</button>
                    <button class="tab" onclick="switchTab('social')">📱 Social</button>
                    <button class="tab" onclick="switchTab('nutrition')">🥗 Nutrition</button>
                    <button class="tab" onclick="switchTab('fitness')">💪 Fitness</button>
                </div>
                
                <div id="auth-tab" class="tab-content active">
                    <div class="endpoint-group">
                        <h3 class="endpoint-group-title">Authentication</h3>
                        <div class="endpoint-item"><span class="method-badge method-post">POST</span><span class="endpoint-path">/api/auth/register</span><span class="endpoint-auth">Public</span></div>
                        <div class="endpoint-item"><span class="method-badge method-post">POST</span><span class="endpoint-path">/api/auth/login</span><span class="endpoint-auth">Public</span></div>
                        <div class="endpoint-item"><span class="method-badge method-post">POST</span><span class="endpoint-path">/api/auth/logout</span><span class="endpoint-auth">Protected</span></div>
                    </div>
                </div>
                
                <div id="users-tab" class="tab-content">
                    <div class="endpoint-group">
                        <h3 class="endpoint-group-title">User Management</h3>
                        <div class="endpoint-item"><span class="method-badge method-get">GET</span><span class="endpoint-path">/api/users/profile</span><span class="endpoint-auth">Protected</span></div>
                        <div class="endpoint-item"><span class="method-badge method-put">PUT</span><span class="endpoint-path">/api/users/profile</span><span class="endpoint-auth">Protected</span></div>
                        <div class="endpoint-item"><span class="method-badge method-post">POST</span><span class="endpoint-path">/api/users/follow/:userId</span><span class="endpoint-auth">Protected</span></div>
                    </div>
                </div>
                
                <div id="social-tab" class="tab-content">
                    <div class="endpoint-group">
                        <h3 class="endpoint-group-title">Posts & Feed</h3>
                        <div class="endpoint-item"><span class="method-badge method-get">GET</span><span class="endpoint-path">/api/posts/feed</span><span class="endpoint-auth">Protected</span></div>
                        <div class="endpoint-item"><span class="method-badge method-post">POST</span><span class="endpoint-path">/api/posts</span><span class="endpoint-auth">Protected</span></div>
                        <div class="endpoint-item"><span class="method-badge method-post">POST</span><span class="endpoint-path">/api/posts/:id/like</span><span class="endpoint-auth">Protected</span></div>
                    </div>
                    <div class="endpoint-group">
                        <h3 class="endpoint-group-title">Messaging</h3>
                        <div class="endpoint-item"><span class="method-badge method-get">GET</span><span class="endpoint-path">/api/messages</span><span class="endpoint-auth">Protected</span></div>
                        <div class="endpoint-item"><span class="method-badge method-post">POST</span><span class="endpoint-path">/api/messages</span><span class="endpoint-auth">Protected</span></div>
                    </div>
                    <div class="endpoint-group">
                        <h3 class="endpoint-group-title">Notifications</h3>
                        <div class="endpoint-item"><span class="method-badge method-get">GET</span><span class="endpoint-path">/api/notifications</span><span class="endpoint-auth">Protected</span></div>
                    </div>
                </div>
                
                <div id="nutrition-tab" class="tab-content">
                    <div class="endpoint-group">
                        <h3 class="endpoint-group-title">Nutrition Tracking</h3>
                        <div class="endpoint-item"><span class="method-badge method-get">GET</span><span class="endpoint-path">/api/nutrition/entries</span><span class="endpoint-auth">Protected</span></div>
                        <div class="endpoint-item"><span class="method-badge method-post">POST</span><span class="endpoint-path">/api/nutrition/entries</span><span class="endpoint-auth">Protected</span></div>
                    </div>
                    <div class="endpoint-group">
                        <h3 class="endpoint-group-title">FatSecret Integration</h3>
                        <div class="endpoint-item"><span class="method-badge method-get">GET</span><span class="endpoint-path">/api/fatsecret/search</span><span class="endpoint-auth">Protected</span></div>
                    </div>
                    <div class="endpoint-group">
                        <h3 class="endpoint-group-title">Custom Categories</h3>
                        <div class="endpoint-item"><span class="method-badge method-get">GET</span><span class="endpoint-path">/api/custom-categories</span><span class="endpoint-auth">Protected</span></div>
                        <div class="endpoint-item"><span class="method-badge method-post">POST</span><span class="endpoint-path">/api/custom-categories</span><span class="endpoint-auth">Protected</span></div>
                    </div>
                </div>
                
                <div id="fitness-tab" class="tab-content">
                    <div class="endpoint-group">
                        <h3 class="endpoint-group-title">Exercises</h3>
                        <div class="endpoint-item"><span class="method-badge method-get">GET</span><span class="endpoint-path">/api/exercises</span><span class="endpoint-auth">Protected</span></div>
                    </div>
                    <div class="endpoint-group">
                        <h3 class="endpoint-group-title">Workouts</h3>
                        <div class="endpoint-item"><span class="method-badge method-get">GET</span><span class="endpoint-path">/api/workouts</span><span class="endpoint-auth">Protected</span></div>
                        <div class="endpoint-item"><span class="method-badge method-post">POST</span><span class="endpoint-path">/api/workouts</span><span class="endpoint-auth">Protected</span></div>
                    </div>
                    <div class="endpoint-group">
                        <h3 class="endpoint-group-title">Workout Templates</h3>
                        <div class="endpoint-item"><span class="method-badge method-get">GET</span><span class="endpoint-path">/api/workout-templates</span><span class="endpoint-auth">Protected</span></div>
                        <div class="endpoint-item"><span class="method-badge method-get">GET</span><span class="endpoint-path">/api/workout-template-folders</span><span class="endpoint-auth">Protected</span></div>
                    </div>
                </div>
            </div>
        </div>

        <footer class="footer">
            <div class="footer-links">
                <a href="https://fitverse.codewithxjohn.com" target="_blank">Live App</a>
                <a href="https://github.com/xjohnfit/mern-fit-verse" target="_blank">GitHub</a>
                <a href="/api/health">Health Check</a>
            </div>
            <p>Built with ❤️ by <strong>John Winchester</strong></p>
            <p style="margin-top: 0.5rem; opacity: 0.8;">© ${new Date().getFullYear()} FitVerse. All rights reserved.</p>
        </footer>

        <script>
            function switchTab(tabName) {
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
                document.getElementById(tabName + '-tab').classList.add('active');
                event.target.classList.add('active');
            }
        </script>
    </body>
    </html>
    `);
};

export default apiLandingScreen;
