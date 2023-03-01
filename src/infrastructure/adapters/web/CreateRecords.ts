import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';

import { createRecord } from '../../../usecases/createRecord';

import { createNewDynamoRepository } from '../../repositories/DynamoDbRepo';

/**
 * @description The controller for our service that creates new Catalogist records.
 */
export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> {
  try {
    const body =
      event?.body && typeof event?.body === 'string' ? JSON.parse(event.body) : event.body;

    const repo = createNewDynamoRepository();
    await createRecord(repo, body);

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
