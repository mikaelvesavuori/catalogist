import { DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';

import { Repository } from '../domain/interfaces/Repository';
import { Manifest } from '../domain/interfaces/Manifest';
import { GetDataError } from '../domain/errors/GetDataError';
import { UpdateItemError } from '../domain/errors/UpdateItemError';

import { isJsonString } from '../frameworks/isJsonString';

const dynamoDb = new DynamoDBClient({
  region: process.env.REGION || 'eu-north-1'
});
const TABLE_NAME = process.env.TABLE_NAME || 'catalogist';

/**
 * @description Factory function for DynamoDB repository.
 */
export function createNewDynamoRepository(): DynamoRepository {
  return new DynamoRepository();
}

/**
 * @description Concrete implementation of DynamoDB repository.
 */
class DynamoRepository implements Repository {
  /**
   * @description Get data.
   */
  async getData(key: string, query?: string): Promise<Manifest[] | Record<string, unknown>[]> {
    try {
      const params = this.getParams(key, query);

      // @ts-ignore
      const data = await dynamoDb.send(new QueryCommand(params));

      const items = data?.Items;
      const fixedItems: Record<string, unknown>[] = [];

      if (items && typeof items === 'object' && items.length > 0) {
        items.forEach((item: any) => {
          const cleanedItem: CleanedItem = {};

          // This is a little trick we do to somewhat sort the order of properties
          const entries = Object.entries(item).reverse();

          entries.forEach((entry: any) => {
            const [_key, _val] = entry;
            const _query: any = Object.values(_val)[0];
            cleanedItem[_key] = isJsonString(_query) ? JSON.parse(_query) : _query;
          });

          fixedItems.push(cleanedItem);
        });
      }

      return fixedItems;
    } catch (error: any) {
      throw new GetDataError(error.message);
    }
  }

  /**
   * @description Create or update item.
   */
  async updateItem(manifest: Manifest): Promise<void> {
    try {
      const { spec } = manifest;
      const { lifecycleStage, serviceName } = spec;

      // Set up required fields
      const params: any = {
        TableName: TABLE_NAME,
        Item: {
          timestamp: { S: `${Date.now().toString()}` },
          lifecycleStage: { S: lifecycleStage },
          serviceName: { S: serviceName },
          spec: { S: JSON.stringify(spec) }
        }
      };

      // Add any optional fields
      if (manifest.relations) params.Item.relations = { S: JSON.stringify(manifest.relations) };
      if (manifest.support) params.Item.support = { S: JSON.stringify(manifest.support) };
      if (manifest.slo) params.Item.slo = { S: JSON.stringify(manifest.slo) };
      if (manifest.api) params.Item.api = { S: JSON.stringify(manifest.api) };
      if (manifest.metadata) params.Item.metadata = { S: JSON.stringify(manifest.metadata) };
      if (manifest.links) params.Item.links = { S: JSON.stringify(manifest.links) };

      await dynamoDb.send(new PutItemCommand(params));
    } catch (error: any) {
      throw new UpdateItemError(error.message);
    }
  }

  /**
   * @description Helper to get the right query parameters.
   */
  private getParams(lifecycleStage = 'production', serviceName?: string) {
    const keyConditionExpression = serviceName
      ? `lifecycleStage = :lifecycleStage AND serviceName = :serviceName`
      : `lifecycleStage = :lifecycleStage`;

    const expressionAttributeValues = serviceName
      ? {
          ':lifecycleStage': { S: lifecycleStage },
          ':serviceName': { S: serviceName }
        }
      : {
          ':lifecycleStage': { S: lifecycleStage }
        };

    return {
      TableName: TABLE_NAME,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues
    };
  }
}

type CleanedItem = {
  [propertyName: string]: any;
};
