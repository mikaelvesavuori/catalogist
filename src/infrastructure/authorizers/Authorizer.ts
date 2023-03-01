import { APIGatewayProxyEventV2 } from 'aws-lambda';

/**
 * @description The authorizer controller.
 */
export async function handler(event: APIGatewayProxyEventV2): Promise<any> {
  if (event?.requestContext?.http?.method === 'OPTIONS') return handleCors();

  const API_KEY = process.env.API_KEY || '';
  if (!API_KEY) throw new Error('Missing API key in environment!');

  const apiKey = event.headers['Authorization'] || event.headers['authorization'] || '';

  return {
    isAuthorized: !apiKey || apiKey !== API_KEY ? false : true
  };
}

/**
 * @description CORS handler.
 */
function handleCors() {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify('OK')
  };
}
