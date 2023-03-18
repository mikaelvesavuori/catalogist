import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';

import { QueryStringParams } from '../../interfaces/QueryStringParams';

/**
 * @description Get cleaned query string parameters from call.
 */
export function getQueryStringParams(
  queryStringParameters: APIGatewayProxyEventQueryStringParameters | Record<string, unknown>
): QueryStringParams {
  return {
    repo: (queryStringParameters?.['repo'] as string) || '',
    service: (queryStringParameters?.['service'] as string) || ''
  };
}
