// Salvaged Gemini client (from AI-Resume-Parser-3)
// Location: archives/salvaged/gemini-client.js

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_MAX_TOKENS = 2048;

const config = {
    apiKey: process.env.GOOGLE_GEMINI_API_KEY || '',
    timeout: DEFAULT_TIMEOUT,
    defaultTemperature: DEFAULT_TEMPERATURE,
    defaultMaxTokens: DEFAULT_MAX_TOKENS,
};

function isConfigured() {
    return Boolean(config.apiKey);
}

async function generateContent(prompt, options = {}) {
    if (!isConfigured()) {
        return {
            success: false,
            error: 'Gemini API key not configured',
        };
    }

    const {
        temperature = config.defaultTemperature,
        maxOutputTokens = config.defaultMaxTokens,
        timeout = config.timeout,
    } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': config.apiKey,
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }],
                    },
                ],
                generationConfig: {
                    temperature,
                    maxOutputTokens,
                },
            }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Gemini API HTTP error:', response.status, errorData);
            return {
                success: false,
                error: `Gemini API error: ${response.status} ${response.statusText}`,
                statusCode: response.status,
            };
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            return {
                success: false,
                error: 'No content in Gemini response',
            };
        }

        return {
            success: true,
            text,
        };
    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            return {
                success: false,
                error: 'Request timed out',
            };
        }

        console.error('Gemini API error:', error.message);
        return {
            success: false,
            error: error.message,
        };
    }
}

async function generateJSON(prompt, options = {}) {
    const result = await generateContent(prompt, options);

    if (!result.success) {
        return result;
    }

    try {
        const text = result.text;
        const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);

        if (!jsonMatch) {
            return {
                success: false,
                text: result.text,
                error: 'No JSON found in response',
            };
        }

        const data = JSON.parse(jsonMatch[0]);
        return {
            success: true,
            data,
            text: result.text,
        };
    } catch (parseError) {
        console.error('JSON parse error:', parseError.message);
        return {
            success: false,
            text: result.text,
            error: `Failed to parse JSON: ${parseError.message}`,
        };
    }
}

async function checkHealth() {
    if (!isConfigured()) {
        return {
            available: false,
            error: 'API key not configured',
        };
    }

    const startTime = Date.now();

    try {
        const result = await generateContent('Say "OK" if you can read this.', {
            temperature: 0,
            maxOutputTokens: 10,
            timeout: 10000,
        });

        const responseTime = Date.now() - startTime;

        if (result.success) {
            return {
                available: true,
                responseTime,
            };
        }

        return {
            available: false,
            responseTime,
            error: result.error,
        };
    } catch (error) {
        return {
            available: false,
            responseTime: Date.now() - startTime,
            error: error.message,
        };
    }
}

function configure(newConfig) {
    Object.assign(config, newConfig);
}

module.exports = {
    isConfigured,
    generateContent,
    generateJSON,
    checkHealth,
    configure,
    config,
};