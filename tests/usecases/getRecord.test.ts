import { APIGatewayProxyEventV2 } from 'aws-lambda';

import { getRecord } from '../../src/usecases/getRecord';

import { createNewLocalRepository } from '../../src/infrastructure/repositories/LocalRepo';

import awsEvent from '../../testdata/requests/awsEventRequest.json';
import { testdata } from '../../testdata/TestDatabase';

const repository = createNewLocalRepository();

const repo = 'someorg/somerepo';

describe('Success cases', () => {
  test('It should return an empty array if no match is found', async () => {
    const event = awsEvent as any;
    event['queryStringParameters'] = {
      repo: 'does-not-exist'
    };

    const response = await getRecord(repository, event as unknown as APIGatewayProxyEventV2);
    expect(response).toMatchObject([]);
  });

  test('It should get record(s) by repo name', async () => {
    const event = awsEvent as any;
    event['queryStringParameters'] = {
      repo
    };

    const expected = testdata.filter((record: any) => record.spec.repo === repo);

    const response = await getRecord(repository, event as unknown as APIGatewayProxyEventV2);
    expect(response).toMatchObject(expected);
  });

  test('It should get record by repo name and service name', async () => {
    const repo = 'someorg/someotherrepo';
    const service = 'my-service';
    const event = awsEvent as any;
    event['queryStringParameters'] = {
      repo,
      service
    };

    const record = testdata.filter(
      (record: any) => record.spec.repo === repo && record.spec.name === service
    );

    const response = await getRecord(repository, event as unknown as APIGatewayProxyEventV2);
    expect(response).toMatchObject(record);
  });
});
