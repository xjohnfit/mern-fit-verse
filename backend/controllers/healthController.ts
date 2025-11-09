import { Request, Response } from 'express';
import path from "path";


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
    } catch (error: any) {
        filesInfo.error = error?.message || 'Unknown error';
    }

    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        filesystem: filesInfo,
    });
};