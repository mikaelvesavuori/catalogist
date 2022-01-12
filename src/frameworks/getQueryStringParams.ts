import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';

import { QueryStringParams } from '../domain/interfaces/QueryStringParams';

import { UnknownKeyError } from '../domain/errors/UnknownKeyError';

/**
 * @description Get query string parameters from call.
 */
export function getQueryStringParams(
  queryStringParameters: APIGatewayProxyEventQueryStringParameters | Record<string, unknown>
): QueryStringParams {
  const queryStringParams: any = { queries: [] };
  if (!queryStringParameters) return queryStringParams;

  const keys = Object.keys(queryStringParameters);

  keys.forEach((key: any) => {
    if (key !== 'serviceName' && key !== 'lifecycleStage')
      throw new UnknownKeyError('Unknown key!');

    const value: any = queryStringParameters[key];

    if (key === 'lifecycleStage') queryStringParams['lifecycleStage'] = value;
    if (key === 'serviceName') queryStringParams['queries'] = value.split(',');
  });

  return queryStringParams;
}
