import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';

import { getRecord } from '../../../usecases/getRecord';

import { createNewDynamoRepository } from '../../repositories/DynamoDbRepo';

/**
 * @description The controller for our service that gets Catalogist records.
 */
export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> {
  try {
    const repo = createNewDynamoRepository();
    const data = await getRecord(repo, event);

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error: any) {
    console.log('error', error);
    return {
      statusCode: error.cause?.statusCode || 500,
      body: JSON.stringify(error.message)
    };
  }
}
