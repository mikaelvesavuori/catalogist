import { APIGatewayProxyEventV2, APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';

import { createNewCatalogist } from '../domain/entities/Catalogist';

import { Repository } from '../interfaces/Repository';

import { getQueryStringParams } from '../infrastructure/frameworks/getQueryStringParams';

/**
 * @description The use-case for getting records from the repository.
 */
export async function getRecord(repo: Repository, event: APIGatewayProxyEventV2): Promise<any> {
  const catalogist = createNewCatalogist(repo);

  const params = getQueryStringParams(
    event.queryStringParameters as APIGatewayProxyEventQueryStringParameters
  );

  return await catalogist.getRecord(params.repo, params.service);
}
