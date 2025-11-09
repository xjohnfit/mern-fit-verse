#!/bin/sh
echo "Starting TypeScript build..."

# Check if tsconfig.json exists
if [ ! -f "./tsconfig.json" ]; then
    echo "Error: tsconfig.json not found in current directory"
    pwd
    ls -la
    exit 1
fi

echo "Found tsconfig.json, proceeding with build..."

# Run TypeScript compiler
npx tsc --project ./tsconfig.json

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "TypeScript compilation failed!"
    exit 1
fi

# Verify output files exist
if [ ! -f "./dist/backend/index.js" ]; then
    echo "Error: Expected output file ./dist/backend/index.js not found"
    echo "Build directory contents:"
    ls -la dist/ || echo "dist directory does not exist"
    exit 1
fi

echo "Build completed successfully!"
ls -la dist/backend/