import { DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { GetDataError } from '../../application/errors/GetDataError';
import { UpdateItemError } from '../../application/errors/UpdateItemError';
import { isJsonString } from '../frameworks/isJsonString';
const dynamoDb = new DynamoDBClient({ region: process.env.REGION || '' });
const TABLE_NAME = process.env.TABLE_NAME || '';
export function createNewDynamoRepository() {
    return new DynamoRepository();
}
class DynamoRepository {
    async getData(repo, service) {
        try {
            const params = this.getParams(repo, service);
            const data = await dynamoDb.send(new QueryCommand(params));
            const items = data?.Items;
            if (!items)
                return [];
            const fixedItems = [];
            if (items && typeof items === 'object' && items.length > 0) {
                items.forEach((item) => {
                    const cleanedItem = {};
                    const entries = Object.entries(item).reverse();
                    entries.forEach((entry) => {
                        const [_key, _val] = entry;
                        const _query = Object.values(_val)[0];
                        cleanedItem[_key] = isJsonString(_query) ? JSON.parse(_query) : _query;
                    });
                    fixedItems.push(cleanedItem);
                });
            }
            return fixedItems;
        }
        catch (error) {
            throw new GetDataError(error.message);
        }
    }
    async updateItem(manifest) {
        try {
            const { spec } = manifest;
            const { repo, name } = spec;
            const params = {
                TableName: TABLE_NAME,
                Item: {
                    pk: { S: repo },
                    sk: { S: name },
                    spec: { S: JSON.stringify(spec) },
                    timestamp: { S: `${Date.now().toString()}` }
                }
            };
            if (manifest.relations)
                params.Item.relations = { S: JSON.stringify(manifest.relations) };
            if (manifest.support)
                params.Item.support = { S: JSON.stringify(manifest.support) };
            if (manifest.slo)
                params.Item.slo = { S: JSON.stringify(manifest.slo) };
            if (manifest.api)
                params.Item.api = { S: JSON.stringify(manifest.api) };
            if (manifest.metadata)
                params.Item.metadata = { S: JSON.stringify(manifest.metadata) };
            if (manifest.links)
                params.Item.links = { S: JSON.stringify(manifest.links) };
            await dynamoDb.send(new PutItemCommand(params));
        }
        catch (error) {
            throw new UpdateItemError(error.message);
        }
    }
    getParams(repo, service) {
        const keyConditionExpression = service ? `pk = :pk AND sk = :sk` : `pk = :pk`;
        const expressionAttributeValues = service
            ? {
                ':pk': { S: repo },
                ':sk': { S: service }
            }
            : {
                ':pk': { S: repo }
            };
        return {
            TableName: TABLE_NAME,
            KeyConditionExpression: keyConditionExpression,
            ExpressionAttributeValues: expressionAttributeValues
        };
    }
}
//# sourceMappingURL=DynamoDbRepo.js.map