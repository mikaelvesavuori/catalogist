export async function handler(event) {
    if (event?.requestContext?.http?.method === 'OPTIONS')
        return handleCors();
    const API_KEY = process.env.API_KEY || '';
    if (!API_KEY)
        throw new Error('Missing API key in environment!');
    const apiKey = event.headers['Authorization'] || event.headers['authorization'] || '';
    return {
        isAuthorized: !apiKey || apiKey !== API_KEY ? false : true
    };
}
function handleCors() {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify('OK')
    };
}
//# sourceMappingURL=Authorizer.js.map