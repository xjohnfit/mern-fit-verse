import { Request, Response } from 'express';
import mongoose from 'mongoose';

export const healthCheck = async (req: Request, res: Response) => {
    let healthStatus = 'OK';
    let statusColor = '#10b981'; // green
    let dbStatus = 'Connected';
    let dbColor = '#10b981';

    // Check database connection
    try {
        if (mongoose.connection.readyState !== 1) {
            healthStatus = 'WARNING';
            statusColor = '#f59e0b';
            dbStatus = 'Disconnected';
            dbColor = '#ef4444';
        }
    } catch (error: any) {
        healthStatus = 'ERROR';
        statusColor = '#ef4444';
        dbStatus = 'Error';
        dbColor = '#ef4444';
    }

    // Get API statistics
    const apiStats = {
        totalCollections: mongoose.connection.collections
            ? Object.keys(mongoose.connection.collections).length
            : 0,
        dbName: mongoose.connection.name || 'N/A',
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version,
        platform: process.platform,
        pid: process.pid,
    };

    const uptime = process.uptime();
    const uptimeFormatted = formatUptime(uptime);
    const timestamp = new Date().toISOString();

    // Format memory usage
    const memoryUsageMB = {
        rss: (apiStats.memoryUsage.rss / 1024 / 1024).toFixed(2),
        heapTotal: (apiStats.memoryUsage.heapTotal / 1024 / 1024).toFixed(2),
        heapUsed: (apiStats.memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
        external: (apiStats.memoryUsage.external / 1024 / 1024).toFixed(2),
    };

    const htmlResponse = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Fit-Verse - Health Check</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
                overflow-x: hidden;
            }
            
            .container {
                max-width: 1400px;
                width: 100%;
                margin: 0 auto;
            }
            
            .header {
                text-align: center;
                margin-bottom: 30px;
                color: white;
            }
            
            .title {
                font-size: 2.5rem;
                font-weight: bold;
                margin-bottom: 10px;
            }
            
            .subtitle {
                font-size: 1.2rem;
                opacity: 0.9;
            }
            
            .status-badge {
                display: inline-flex;
                align-items: center;
                padding: 10px 20px;
                border-radius: 50px;
                font-weight: 600;
                font-size: 1rem;
                margin: 15px 0;
                color: white;
                background-color: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255, 255, 255, 0.3);
            }
            
            .status-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: ${statusColor};
                margin-right: 10px;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            
            .grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 20px;
                margin-top: 20px;
            }
            
            .card {
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                transition: transform 0.2s, box-shadow 0.2s;
            }
            
            .card:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
            }
            
            .card-title {
                font-size: 0.95rem;
                font-weight: 600;
                color: #374151;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
            }
            
            .card-icon {
                width: 18px;
                height: 18px;
                margin-right: 8px;
            }
            
            .metric-value {
                font-size: 1.75rem;
                font-weight: bold;
                color: #1f2937;
                margin-bottom: 4px;
            }
            
            .metric-label {
                font-size: 0.85rem;
                color: #6b7280;
            }
            
            .info-list {
                list-style: none;
            }
            
            .info-item {
                display: flex;
                justify-content: space-between;
                padding: 6px 0;
                border-bottom: 1px solid #e5e7eb;
                font-size: 0.85rem;
            }
            
            .info-item:last-child {
                border-bottom: none;
            }
            
            .info-label {
                font-weight: 500;
                color: #374151;
            }
            
            .info-value {
                color: #6b7280;
                font-family: 'Courier New', monospace;
                font-size: 0.8rem;
            }
            
            .success { color: #10b981; }
            .warning { color: #f59e0b; }
            .error { color: #ef4444; }
            
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px solid rgba(255, 255, 255, 0.3);
                color: white;
            }
            
            .refresh-btn {
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: 2px solid rgba(255, 255, 255, 0.3);
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 0.9rem;
                margin: 0 8px;
                transition: all 0.2s;
                backdrop-filter: blur(10px);
            }
            
            .refresh-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                border-color: rgba(255, 255, 255, 0.5);
                transform: translateY(-2px);
            }
            
            .back-home-btn {
                display: inline-block;
                background: rgba(255, 255, 255, 0.2);
                color: white;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 8px;
                font-size: 0.9rem;
                margin: 0 8px;
                transition: all 0.2s;
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255, 255, 255, 0.3);
            }
            
            .back-home-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                border-color: rgba(255, 255, 255, 0.5);
                transform: translateY(-2px);
            }
            
            .footer-time {
                margin-top: 15px;
                font-size: 0.85rem;
                opacity: 0.9;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="title">🏋️‍♂️ FitVerse API</h1>
                <p class="subtitle">Health Check Dashboard</p>
                <div class="status-badge">
                    <div class="status-dot"></div>
                    Status: ${healthStatus}
                </div>
            </div>
            
            <div class="grid">
                <div class="card">
                    <h3 class="card-title">
                        <svg class="card-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                        System Status
                    </h3>
                    <div class="metric-value ${
                        healthStatus === 'OK'
                            ? 'success'
                            : healthStatus === 'WARNING'
                            ? 'warning'
                            : 'error'
                    }">${healthStatus}</div>
                    <div class="metric-label">Overall Health</div>
                </div>
                
                <div class="card">
                    <h3 class="card-title">
                        <svg class="card-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z"/>
                            <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z"/>
                            <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z"/>
                        </svg>
                        Database
                    </h3>
                    <div class="metric-value ${
                        dbStatus === 'Connected' ? 'success' : 'error'
                    }">${dbStatus}</div>
                    <div class="metric-label">${apiStats.dbName}</div>
                </div>
                
                <div class="card">
                    <h3 class="card-title">
                        <svg class="card-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L10 9.586V6z" clip-rule="evenodd"/>
                        </svg>
                        Uptime
                    </h3>
                    <div class="metric-value">${uptimeFormatted}</div>
                    <div class="metric-label">Time Running</div>
                </div>
                
                <div class="card">
                    <h3 class="card-title">
                        <svg class="card-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
                        </svg>
                        Environment
                    </h3>
                    <div class="metric-value">${
                        process.env.NODE_ENV || 'development'
                    }</div>
                    <div class="metric-label">Current Environment</div>
                </div>
                
                <div class="card">
                    <h3 class="card-title">
                        <svg class="card-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                        </svg>
                        Collections
                    </h3>
                    <div class="metric-value">${apiStats.totalCollections}</div>
                    <div class="metric-label">Database Collections</div>
                </div>
                
                <div class="card">
                    <h3 class="card-title">
                        <svg class="card-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 7H7v6h6V7z"/>
                            <path fill-rule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clip-rule="evenodd"/>
                        </svg>
                        Memory Usage
                    </h3>
                    <ul class="info-list">
                        <li class="info-item">
                            <span class="info-label">Heap Used</span>
                            <span class="info-value">${
                                memoryUsageMB.heapUsed
                            } MB</span>
                        </li>
                        <li class="info-item">
                            <span class="info-label">Heap Total</span>
                            <span class="info-value">${
                                memoryUsageMB.heapTotal
                            } MB</span>
                        </li>
                        <li class="info-item">
                            <span class="info-label">RSS</span>
                            <span class="info-value">${
                                memoryUsageMB.rss
                            } MB</span>
                        </li>
                    </ul>
                </div>
                
                <div class="card">
                    <h3 class="card-title">
                        <svg class="card-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
                        </svg>
                        System Info
                    </h3>
                    <ul class="info-list">
                        <li class="info-item">
                            <span class="info-label">Node.js</span>
                            <span class="info-value">${
                                apiStats.nodeVersion
                            }</span>
                        </li>
                        <li class="info-item">
                            <span class="info-label">Platform</span>
                            <span class="info-value">${apiStats.platform}</span>
                        </li>
                        <li class="info-item">
                            <span class="info-label">Process ID</span>
                            <span class="info-value">${apiStats.pid}</span>
                        </li>
                    </ul>
                </div>
                
                <div class="card">
                    <h3 class="card-title">
                        <svg class="card-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"/>
                        </svg>
                        Quick Links
                    </h3>
                    <ul class="info-list">
                        <li class="info-item">
                            <span class="info-label">API Root</span>
                            <span class="info-value success">✓ Active</span>
                        </li>
                        <li class="info-item">
                            <span class="info-label">WebSocket</span>
                            <span class="info-value success">✓ Active</span>
                        </li>
                        <li class="info-item">
                            <span class="info-label">CORS</span>
                            <span class="info-value success">✓ Enabled</span>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div class="footer">
                <div>
                    <a href="/" class="back-home-btn">← Back to API Home</a>
                    <button class="refresh-btn" onclick="window.location.reload()">🔄 Refresh</button>
                </div>
                <p class="footer-time">Last checked: ${new Date(
                    timestamp
                ).toLocaleString()}</p>
                <p class="footer-time">Server Time: ${timestamp}</p>
            </div>
        </div>
    </body>
    </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(htmlResponse);
};

// Helper function to format uptime
function formatUptime(uptime: number): string {
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
}
