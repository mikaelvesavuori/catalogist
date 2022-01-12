import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';

import { Catalogist } from '../domain/interfaces/Catalogist';
import { QueryStringParams } from '../domain/interfaces/QueryStringParams';
import { getQueryStringParams } from '../frameworks/getQueryStringParams';

/**
 * @description The use-case for getting records from the repository.
 */
export async function getRecords(
  catalogist: Catalogist,
  event: APIGatewayProxyEvent
): Promise<any> {
  const params: QueryStringParams = getQueryStringParams(
    event.queryStringParameters as APIGatewayProxyEventQueryStringParameters
  );
  const { queries } = params;
  let { lifecycleStage } = params;
  if (!lifecycleStage) lifecycleStage = 'production'; // Set a fallback for the primary key

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
