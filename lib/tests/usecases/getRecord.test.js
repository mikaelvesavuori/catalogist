import { describe, test, expect } from 'vitest';
import { getRecord } from '../../src/usecases/getRecord';
import { createNewLocalRepository } from '../../src/infrastructure/repositories/LocalRepo';
import awsEvent from '../../testdata/requests/awsEventRequest.json';
import { testdata } from '../../testdata/TestDatabase';
const repository = createNewLocalRepository();
const repo = 'someorg/somerepo';
describe('Success cases', () => {
    test('It should return an empty array if no match is found', async () => {
        const event = awsEvent;
        event['queryStringParameters'] = {
            repo: 'does-not-exist'
        };
        const response = await getRecord(repository, event);
        expect(response).toMatchObject([]);
    });
    test('It should get record(s) by repo name', async () => {
        const event = awsEvent;
        event['queryStringParameters'] = {
            repo
        };
        const expected = testdata.filter((record) => record.spec.repo === repo);
        const response = await getRecord(repository, event);
        expect(response).toMatchObject(expected);
    });
    test('It should get record by repo name and service name', async () => {
        const repo = 'someorg/someotherrepo';
        const service = 'my-service';
        const event = awsEvent;
        event['queryStringParameters'] = {
            repo,
            service
        };
        const record = testdata.filter((record) => record.spec.repo === repo && record.spec.name === service);
        const response = await getRecord(repository, event);
        expect(response).toMatchObject(record);
    });
});
//# sourceMappingURL=getRecord.test.js.map