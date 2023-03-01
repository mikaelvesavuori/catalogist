import { APIGatewayProxyEventV2, APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';

import { createNewCatalogist } from '../domain/entities/Catalogist';

import { Repository } from '../interfaces/Repository';
import { QueryStringParams } from '../interfaces/QueryStringParams';

import { getQueryStringParams } from '../infrastructure/frameworks/getQueryStringParams';

/**
 * @description The use-case for getting records from the repository.
 */
export async function getRecords(repo: Repository, event: APIGatewayProxyEventV2): Promise<any> {
  const catalogist = createNewCatalogist(repo);

  const params: QueryStringParams = getQueryStringParams(
    event.queryStringParameters as APIGatewayProxyEventQueryStringParameters
  );
  const { queries } = params;
  let { lifecycleStage } = params;
  if (!lifecycleStage) lifecycleStage = 'production';

  // Handle multiple records
  if (queries && queries.length > 0) {
    const recordsPromises = queries.map(async (query: string) => {
      const record = await catalogist.getRecord(lifecycleStage as string, query);
      return record[0]; // Ensure that we don't get too much nesting
    });
    return (await Promise.all(recordsPromises)).filter((record: any) => record !== undefined);
  }
  // Handle single record
  else return await catalogist.getRecord(lifecycleStage);
}
