/** @type {import('jest').Config} */
export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const roots = ['<rootDir>'];
export const testMatch = ['**/__tests__/**/*.test.ts'];
export const transform = {
    '^.+\\.ts$': [
        'ts-jest',
        {
            tsconfig: {
                types: ['jest', 'node'],
            },
        },
    ],
};
export const collectCoverageFrom = ['**/*.ts', '!**/*.d.ts', '!index.ts'];
export const coverageDirectory = 'coverage';
export const coverageReporters = ['text', 'lcov', 'html'];
export const setupFilesAfterEnv = [];
export const moduleFileExtensions = ['ts', 'js', 'json'];
export const clearMocks = true;
export const restoreMocks = true;
