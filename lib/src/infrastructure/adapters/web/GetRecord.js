import { getRecord } from '../../../usecases/getRecord';
import { createNewDynamoRepository } from '../../repositories/DynamoDbRepo';
export async function handler(event) {
    try {
        const repo = createNewDynamoRepository();
        const data = await getRecord(repo, event);
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    }
    catch (error) {
        console.log('error', error);
        return {
            statusCode: error.cause?.statusCode || 500,
            body: JSON.stringify(error.message)
        };
    }
}
//# sourceMappingURL=GetRecord.js.map