import { Request, Response } from 'express';
import path from 'path';

export const healthCheck = async (req: Request, res: Response) => {
    const fs = require('fs');
    const staticPath = path.join(__dirname, '../../frontend/dist');
    const indexPath = path.resolve(
        __dirname,
        '../../frontend',
        'dist',
        'index.html'
    );

    let filesInfo: any = {};
    let healthStatus = 'OK';
    let statusColor = '#10b981'; // green

    try {
        filesInfo = {
            staticPathExists: fs.existsSync(staticPath),
            indexPathExists: fs.existsSync(indexPath),
            staticPath: staticPath,
            indexPath: indexPath,
            currentDir: __dirname,
            workingDir: process.cwd(),
        };

        if (fs.existsSync(staticPath)) {
            filesInfo.staticPathContents = fs.readdirSync(staticPath);
        }

        // Check if critical paths exist
        if (!filesInfo.staticPathExists || !filesInfo.indexPathExists) {
            healthStatus = 'WARNING';
            statusColor = '#f59e0b'; // amber
        }
    } catch (error: any) {
        filesInfo.error = error?.message || 'Unknown error';
        healthStatus = 'ERROR';
        statusColor = '#ef4444'; // red
    }

    const uptime = process.uptime();
    const uptimeFormatted = formatUptime(uptime);
    const timestamp = new Date().toISOString();

    const htmlResponse = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MERN Fit-Verse - Health Check</title>
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
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .container {
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                padding: 40px;
                max-width: 800px;
                width: 100%;
            }
            
            .header {
                text-align: center;
                margin-bottom: 40px;
            }
            
            .title {
                font-size: 2.5rem;
                font-weight: bold;
                color: #1f2937;
                margin-bottom: 10px;
            }
            
            .subtitle {
                font-size: 1.2rem;
                color: #6b7280;
            }
            
            .status-badge {
                display: inline-flex;
                align-items: center;
                padding: 12px 24px;
                border-radius: 50px;
                font-weight: 600;
                font-size: 1.1rem;
                margin: 20px 0;
                color: white;
                background-color: ${statusColor};
            }
            
            .status-dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: white;
                margin-right: 12px;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            
            .grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 24px;
                margin-top: 40px;
            }
            
            .card {
                background: #f9fafb;
                border-radius: 12px;
                padding: 24px;
                border: 1px solid #e5e7eb;
            }
            
            .card-title {
                font-size: 1.1rem;
                font-weight: 600;
                color: #374151;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
            }
            
            .card-icon {
                width: 20px;
                height: 20px;
                margin-right: 8px;
            }
            
            .metric-value {
                font-size: 2rem;
                font-weight: bold;
                color: #1f2937;
                margin-bottom: 4px;
            }
            
            .metric-label {
                font-size: 0.9rem;
                color: #6b7280;
            }
            
            .info-list {
                list-style: none;
            }
            
            .info-item {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #e5e7eb;
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
                font-size: 0.9rem;
            }
            
            .success { color: #10b981; }
            .warning { color: #f59e0b; }
            .error { color: #ef4444; }
            
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                color: #6b7280;
                font-size: 0.9rem;
            }
            
            .refresh-btn {
                background: #667eea;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 0.9rem;
                margin-top: 10px;
                transition: background-color 0.2s;
            }
            
            .refresh-btn:hover {
                background: #5a67d8;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="title">🏃‍♂️ MERN Fit-Verse</h1>
                <p class="subtitle">Application Health Check Dashboard</p>
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
                            <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"/>
                        </svg>
                        File System
                    </h3>
                    <ul class="info-list">
                        <li class="info-item">
                            <span class="info-label">Static Path</span>
                            <span class="info-value ${
                                filesInfo.staticPathExists ? 'success' : 'error'
                            }">
                                ${
                                    filesInfo.staticPathExists
                                        ? '✓ Found'
                                        : '✗ Missing'
                                }
                            </span>
                        </li>
                        <li class="info-item">
                            <span class="info-label">Index File</span>
                            <span class="info-value ${
                                filesInfo.indexPathExists ? 'success' : 'error'
                            }">
                                ${
                                    filesInfo.indexPathExists
                                        ? '✓ Found'
                                        : '✗ Missing'
                                }
                            </span>
                        </li>
                        ${
                            filesInfo.staticPathContents
                                ? `
                        <li class="info-item">
                            <span class="info-label">Files Count</span>
                            <span class="info-value">${filesInfo.staticPathContents.length}</span>
                        </li>`
                                : ''
                        }
                    </ul>
                </div>
            </div>
            
            <div class="footer">
                <p>Last checked: ${new Date(timestamp).toLocaleString()}</p>
                <button class="refresh-btn" onclick="window.location.reload()">🔄 Refresh</button>
                <p style="margin-top: 10px; font-size: 0.8rem;">
                    Server Time: ${timestamp} | Node.js ${process.version}
                </p>
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
