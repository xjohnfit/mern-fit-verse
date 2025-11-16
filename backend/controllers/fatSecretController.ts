import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import crypto from 'crypto';

// FatSecret API Configuration
const FATSECRET_BASE_URL = 'https://platform.fatsecret.com/rest';

// Get credentials dynamically to ensure env vars are loaded
const getCredentials = () => {
    const CONSUMER_KEY = process.env.FATSECRET_CONSUMER_KEY;
    const CONSUMER_SECRET = process.env.FATSECRET_CONSUMER_SECRET;

    if (!CONSUMER_KEY || !CONSUMER_SECRET) {
        console.error('FatSecret API credentials missing:');
        console.error('CONSUMER_KEY:', CONSUMER_KEY ? 'SET' : 'NOT SET');
        console.error('CONSUMER_SECRET:', CONSUMER_SECRET ? 'SET' : 'NOT SET');
        console.error('NODE_ENV:', process.env.NODE_ENV);
        throw new Error('FatSecret API credentials not configured');
    }

    return { CONSUMER_KEY, CONSUMER_SECRET };
};

// OAuth 1.0 signature generation for FatSecret API
const generateOAuthSignature = (
    method: string,
    url: string,
    params: Record<string, any>
): string => {
    const { CONSUMER_KEY, CONSUMER_SECRET } = getCredentials();

    // OAuth parameters
    const oauthParams = {
        oauth_consumer_key: CONSUMER_KEY,
        oauth_nonce: crypto.randomBytes(16).toString('hex'),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
        oauth_version: '1.0',
    };

    // Combine all parameters
    const allParams: Record<string, any> = { ...params, ...oauthParams };

    // Create parameter string for signature
    const paramString = Object.keys(allParams)
        .sort()
        .map(
            (key) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(
                    allParams[key]
                )}`
        )
        .join('&');

    // Create signature base string
    const signatureBaseString = [
        method.toUpperCase(),
        encodeURIComponent(url),
        encodeURIComponent(paramString),
    ].join('&');

    // Create signing key
    const signingKey = `${encodeURIComponent(CONSUMER_SECRET)}&`;

    // Generate signature
    const signature = crypto
        .createHmac('sha1', signingKey)
        .update(signatureBaseString)
        .digest('base64');

    // Return OAuth header
    return `OAuth ${Object.entries({
        ...oauthParams,
        oauth_signature: signature,
    })
        .map(([key, value]) => `${key}="${encodeURIComponent(value)}"`)
        .join(', ')}`;
};

// Make authenticated request to FatSecret API
const makeFatSecretRequest = async (
    endpoint: string,
    params: Record<string, any>
) => {
    const url = `${FATSECRET_BASE_URL}${endpoint}`;

    // Generate OAuth signature
    const authHeader = generateOAuthSignature('GET', url, params);

    // Create URL with parameters
    const urlWithParams = new URL(url);
    Object.entries(params).forEach(([key, value]) => {
        urlWithParams.searchParams.append(key, value.toString());
    });

    const response = await fetch(urlWithParams.toString(), {
        method: 'GET',
        headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(
            `FatSecret API error: ${response.status} ${response.statusText}`
        );
    }

    return response.json();
};

// Food autocomplete endpoint
export const getFoodAutocomplete = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { expression, max_results = 4, region = 'US' } = req.query;

            // Validate required parameters
            if (!expression || typeof expression !== 'string') {
                res.status(400);
                throw new Error('Expression parameter is required');
            }

            // Validate max_results
            const maxResults = Math.min(
                parseInt(max_results as string) || 4,
                10
            );

            // Make request to FatSecret API
            const data = await makeFatSecretRequest('/food/autocomplete/v2', {
                expression,
                max_results: maxResults,
                region,
                format: 'json',
            });

            // Transform response to ensure consistent array format
            let suggestions = [];
            if (data?.suggestions?.suggestion) {
                suggestions = Array.isArray(data.suggestions.suggestion)
                    ? data.suggestions.suggestion
                    : [data.suggestions.suggestion];
            }

            res.json({
                success: true,
                data: {
                    suggestions: {
                        suggestion: suggestions,
                    },
                },
            });
        } catch (error: any) {
            console.error('FatSecret API Error:', error.message);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch food suggestions',
                error:
                    process.env.NODE_ENV === 'development'
                        ? error.message
                        : 'Internal server error',
            });
        }
    }
);

// Food search endpoint (for future implementation)
export const searchFoods = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        try {
            const {
                search_expression,
                page_number = 0,
                max_results = 20,
            } = req.query;

            if (!search_expression || typeof search_expression !== 'string') {
                res.status(400);
                throw new Error('Search expression is required');
            }

            const data = await makeFatSecretRequest('/server.api', {
                method: 'foods.search.v4',
                search_expression,
                page_number: parseInt(page_number as string) || 0,
                max_results: Math.min(
                    parseInt(max_results as string) || 20,
                    50
                ),
                format: 'json',
            });

            res.json({
                success: true,
                data,
            });
        } catch (error: any) {
            console.error('FatSecret Search Error:', error.message);
            res.status(500).json({
                success: false,
                message: 'Failed to search foods',
                error:
                    process.env.NODE_ENV === 'development'
                        ? error.message
                        : 'Internal server error',
            });
        }
    }
);

// Get food details by ID (for future implementation)
export const getFoodById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { foodId } = req.params;

            if (!foodId) {
                res.status(400);
                throw new Error('Food ID is required');
            }

            const data = await makeFatSecretRequest('/server.api', {
                method: 'food.get.v5',
                food_id: foodId,
                format: 'json',
            });

            res.json({
                success: true,
                data,
            });
        } catch (error: any) {
            console.error('FatSecret Get Food Error:', error.message);
            res.status(500).json({
                success: false,
                message: 'Failed to get food details',
                error:
                    process.env.NODE_ENV === 'development'
                        ? error.message
                        : 'Internal server error',
            });
        }
    }
);

// Health check for FatSecret API integration
export const checkFatSecretHealth = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        try {
            // Check if credentials are available
            getCredentials();

            // Test with a simple autocomplete request
            await makeFatSecretRequest('/food/autocomplete/v2', {
                expression: 'apple',
                max_results: 1,
                format: 'json',
            });

            res.json({
                success: true,
                message: 'FatSecret API connection is healthy',
                timestamp: new Date().toISOString(),
            });
        } catch (error: any) {
            console.error('FatSecret Health Check Error:', error.message);
            res.status(500).json({
                success: false,
                message: 'FatSecret API connection failed',
                error:
                    process.env.NODE_ENV === 'development'
                        ? error.message
                        : 'Connection error',
            });
        }
    }
);
