import { createRecord } from '../../../usecases/createRecord';
import { createNewDynamoRepository } from '../../repositories/DynamoDbRepo';
export async function handler(event) {
    try {
        const body = event?.body && typeof event?.body === 'string' ? JSON.parse(event.body) : event.body;
        const repo = createNewDynamoRepository();
        await createRecord(repo, body);
        return {
            statusCode: 204,
            body: ''
        };
    }
    catch (error) {
        return {
            statusCode: error.cause?.statusCode || 500,
            body: JSON.stringify(error.message)
        };
    }
}
//# sourceMappingURL=CreateRecord.js.map