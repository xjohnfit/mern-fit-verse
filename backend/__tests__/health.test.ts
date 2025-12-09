import { describe, it, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import express, { Express } from 'express';
import healthRoutes from '../routes/healthRoutes';

describe('Health Check Endpoint', () => {
    let app: Express;

    beforeAll(() => {
        app = express();
        app.use('/api/health', healthRoutes);
    });

    describe('GET /api/health', () => {
        it('should return 200 status code', async () => {
            const response = await request(app).get('/api/health');
            expect(response.status).toBe(200);
        });

        it('should return HTML content type', async () => {
            const response = await request(app).get('/api/health');
            expect(response.type).toBe('text/html');
        });

        it('should contain health check HTML', async () => {
            const response = await request(app).get('/api/health');
            expect(response.text).toContain('Health Check');
        });

        it('should respond within acceptable time', async () => {
            const startTime = Date.now();
            await request(app).get('/api/health');
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
        });
    });
});
