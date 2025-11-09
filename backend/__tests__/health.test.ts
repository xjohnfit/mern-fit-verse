import { Request, Response } from 'express';
import { healthCheck } from '../controllers/healthController';
import fs from 'fs';
import path from 'path';

// Mock fs module
jest.mock('fs');
jest.mock('path');

const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedPath = path as jest.Mocked<typeof path>;

describe('Health Controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;
    let mockSend: jest.Mock;
    let mockSetHeader: jest.Mock;

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Create mock functions
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnThis();
        mockSend = jest.fn();
        mockSetHeader = jest.fn();

        // Setup mock request
        mockRequest = {};

        // Setup mock response
        mockResponse = {
            json: mockJson,
            status: mockStatus,
            send: mockSend,
            setHeader: mockSetHeader,
        };

        // Mock process.uptime and process.cwd
        jest.spyOn(process, 'uptime').mockReturnValue(3661); // 1 hour, 1 minute, 1 second
        jest.spyOn(process, 'cwd').mockReturnValue('/app');

        // Mock Date
        jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(
            '2023-01-01T00:00:00.000Z'
        );
        jest.spyOn(Date.prototype, 'toLocaleString').mockReturnValue(
            '1/1/2023, 12:00:00 AM'
        );
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('healthCheck', () => {
        it('should return health status with OK when all files exist', async () => {
            // Arrange
            const staticPath = '/app/frontend/dist';
            const indexPath = '/app/frontend/dist/index.html';

            mockedPath.join.mockReturnValue(staticPath);
            mockedPath.resolve.mockReturnValue(indexPath);
            mockedFs.existsSync.mockReturnValue(true);
            mockedFs.readdirSync.mockReturnValue([
                'index.html',
                'assets',
            ] as any);

            // Act
            await healthCheck(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockSetHeader).toHaveBeenCalledWith(
                'Content-Type',
                'text/html'
            );
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockSend).toHaveBeenCalled();

            const htmlResponse = mockSend.mock.calls[0][0];
            expect(htmlResponse).toContain('Status: OK');
            expect(htmlResponse).toContain('✓ Found'); // Static path exists
            expect(htmlResponse).toContain('Files Count');
        });

        it('should return WARNING status when static path does not exist', async () => {
            // Arrange
            const staticPath = '/app/frontend/dist';
            const indexPath = '/app/frontend/dist/index.html';

            mockedPath.join.mockReturnValue(staticPath);
            mockedPath.resolve.mockReturnValue(indexPath);
            mockedFs.existsSync.mockImplementation((path) => {
                if (path === staticPath) return false;
                if (path === indexPath) return true;
                return false;
            });

            // Act
            await healthCheck(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockStatus).toHaveBeenCalledWith(200);
            const htmlResponse = mockSend.mock.calls[0][0];
            expect(htmlResponse).toContain('Status: WARNING');
            expect(htmlResponse).toContain('✗ Missing'); // Static path missing
        });

        it('should return WARNING status when index path does not exist', async () => {
            // Arrange
            const staticPath = '/app/frontend/dist';
            const indexPath = '/app/frontend/dist/index.html';

            mockedPath.join.mockReturnValue(staticPath);
            mockedPath.resolve.mockReturnValue(indexPath);
            mockedFs.existsSync.mockImplementation((path) => {
                if (path === staticPath) return true;
                if (path === indexPath) return false;
                return false;
            });
            mockedFs.readdirSync.mockReturnValue(['assets'] as any);

            // Act
            await healthCheck(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockStatus).toHaveBeenCalledWith(200);
            const htmlResponse = mockSend.mock.calls[0][0];
            expect(htmlResponse).toContain('Status: WARNING');
        });

        it('should return ERROR status when fs operations throw an error', async () => {
            // Arrange
            mockedPath.join.mockReturnValue('/app/frontend/dist');
            mockedPath.resolve.mockReturnValue('/app/frontend/dist/index.html');
            mockedFs.existsSync.mockImplementation(() => {
                throw new Error('File system error');
            });

            // Act
            await healthCheck(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockStatus).toHaveBeenCalledWith(200);
            const htmlResponse = mockSend.mock.calls[0][0];
            expect(htmlResponse).toContain('Status: ERROR');
            expect(htmlResponse).toContain(
                '<div class="metric-value error">ERROR</div>'
            );
        });

        it('should format uptime correctly for different durations', async () => {
            // Arrange - Test different uptime values
            const testCases = [
                { uptime: 30, expected: '30s' },
                { uptime: 90, expected: '1m 30s' },
                { uptime: 3661, expected: '1h 1m 1s' },
                { uptime: 90061, expected: '1d 1h 1m' },
            ];

            mockedPath.join.mockReturnValue('/app/frontend/dist');
            mockedPath.resolve.mockReturnValue('/app/frontend/dist/index.html');
            mockedFs.existsSync.mockReturnValue(true);
            mockedFs.readdirSync.mockReturnValue([] as any);

            for (const testCase of testCases) {
                jest.spyOn(process, 'uptime').mockReturnValue(testCase.uptime);

                // Act
                await healthCheck(
                    mockRequest as Request,
                    mockResponse as Response
                );

                // Assert
                const htmlResponse =
                    mockSend.mock.calls[mockSend.mock.calls.length - 1][0];
                expect(htmlResponse).toContain(
                    `<div class="metric-value">${testCase.expected}</div>`
                );
            }
        });

        it('should include system information in response', async () => {
            // Arrange
            mockedPath.join.mockReturnValue('/app/frontend/dist');
            mockedPath.resolve.mockReturnValue('/app/frontend/dist/index.html');
            mockedFs.existsSync.mockReturnValue(true);
            mockedFs.readdirSync.mockReturnValue(['index.html'] as any);

            // Mock process.version
            Object.defineProperty(process, 'version', {
                value: 'v18.17.0',
                configurable: true,
            });

            // Act
            await healthCheck(mockRequest as Request, mockResponse as Response);

            // Assert
            const htmlResponse = mockSend.mock.calls[0][0];
            expect(htmlResponse).toContain('Node.js v18.17.0');
            expect(htmlResponse).toContain('2023-01-01T00:00:00.000Z');
            expect(htmlResponse).toContain('1/1/2023, 12:00:00 AM');
        });

        it('should handle file system operations correctly', async () => {
            // Arrange
            const staticPath = '/app/frontend/dist';
            const indexPath = '/app/frontend/dist/index.html';

            mockedPath.join.mockReturnValue(staticPath);
            mockedPath.resolve.mockReturnValue(indexPath);
            mockedFs.existsSync.mockReturnValue(true);
            mockedFs.readdirSync.mockReturnValue([
                'index.html',
                'assets',
                'favicon.ico',
            ] as any);

            // Act
            await healthCheck(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockedPath.join).toHaveBeenCalledWith(
                expect.any(String),
                '../../frontend/dist'
            );
            expect(mockedPath.resolve).toHaveBeenCalledWith(
                expect.any(String),
                '../../frontend',
                'dist',
                'index.html'
            );
            expect(mockedFs.existsSync).toHaveBeenCalledWith(staticPath);
            expect(mockedFs.existsSync).toHaveBeenCalledWith(indexPath);
            expect(mockedFs.readdirSync).toHaveBeenCalledWith(staticPath);
        });
    });
});
