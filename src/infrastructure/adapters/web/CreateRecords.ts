import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { createNewCatalogist } from '../../../domain/entities/Catalogist';
import { createRecord } from '../../../usecases/createRecord';
import { createNewDynamoRepository } from '../../repositories/DynamoDbRepo';

/**
 * @description The controller for our service that creates new Catalogist records.
 */
export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const body = event.body && typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const repo = createNewDynamoRepository();
    const catalogist = createNewCatalogist(repo);
    await createRecord(catalogist, body);

    return {
      statusCode: 204,
      body: ''
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify(error.message)
    };
  }
}
