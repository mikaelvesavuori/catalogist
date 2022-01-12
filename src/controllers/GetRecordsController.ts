import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { createNewCatalogist } from '../domain/entities/Catalogist';
import { getRecords } from '../usecases/getRecords';
import { createNewDynamoRepository } from '../repositories/DynamoDbRepo';

/**
 * @description The controller for our service that gets Catalogist records.
 */
export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const repo = createNewDynamoRepository();
    const catalogist = createNewCatalogist(repo);
    const data = await getRecords(catalogist, event);

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify(error.message)
    };
  }
}
