import { APIGatewayProxyEventV2 } from 'aws-lambda';

import { getRecords } from '../../src/usecases/getRecords';

import { createNewLocalRepository } from '../../src/infrastructure/repositories/LocalRepo';

import event from '../../testdata/requests/awsEventRequest.json';
import { dataSomeotherLifecycle, dataProduction } from '../../testdata/TestDatabase';

const repo = createNewLocalRepository();

describe('Success cases', () => {
  test('It should get all records in the "production" lifecycleStage when no additional input is given', async () => {
    // lifecycleStage will fall back to "production" when we don't explicitly pass it
    const responseAllRecords = await getRecords(repo, event as unknown as APIGatewayProxyEventV2);
    expect(responseAllRecords).toMatchObject(dataProduction);
  });

  test('It should get record by single service name when given "serviceName" query string parameter', async () => {
    const query = 'my-service';
    const _event = event as any;
    _event['queryStringParameters'] = {
      serviceName: query
    };

    const record = dataProduction.filter((record: any) => {
      if (record.spec.serviceName === query) return record;
    });

    const responseSingleService = await getRecords(
      repo,
      _event as unknown as APIGatewayProxyEventV2
    );
    expect(responseSingleService).toMatchObject(record);
  });

  test('It should get multiple records when given multiple "serviceName" query string parameters', async () => {
    const _event = event as any;
    _event['queryStringParameters'] = {
      serviceName: 'my-service,my-other-service'
    };

    const responseMultipleServices = await getRecords(
      repo,
      _event as unknown as APIGatewayProxyEventV2
    );
    expect(responseMultipleServices).toMatchObject(dataProduction.reverse()); // Seems that data is reversed so fix that
  });

  test('It should get records by lifecycleStage when given a "lifecycleStage" query string parameter', async () => {
    const _event = event as any;
    _event['queryStringParameters'] = {
      lifecycleStage: 'someotherlifecycle'
    };

    const responseLifecycle = await getRecords(repo, _event as unknown as APIGatewayProxyEventV2);
    expect(responseLifecycle).toMatchObject(dataSomeotherLifecycle);
  });

  test('It should get record by lifecycle stage and single service name when given "lifecycleStage" and a single "serviceName" query string parameters', async () => {
    const query = 'my-other-service';
    const _event = event as any;
    _event['queryStringParameters'] = {
      lifecycleStage: 'someotherlifecycle',
      serviceName: query
    };

    const record = dataSomeotherLifecycle.filter((record: any) => {
      if (record.spec.serviceName === query) return record;
    });

    const responseLifecycleSingleService = await getRecords(
      repo,
      _event as unknown as APIGatewayProxyEventV2
    );
    expect(responseLifecycleSingleService).toMatchObject(record);
  });

  test('It should get records by lifecycle stage and multiple service names when given "lifecycleStage" and multiple "serviceName" query string parameters', async () => {
    const _event = event as any;
    _event['queryStringParameters'] = {
      lifecycleStage: 'someotherlifecycle',
      serviceName: 'my-service,my-other-service'
    };

    const responseLifecycleMultipleServices = await getRecords(
      repo,
      _event as unknown as APIGatewayProxyEventV2
    );
    expect(responseLifecycleMultipleServices).toMatchObject(dataSomeotherLifecycle);
  });

  /**
   * This has to be in the bottom since it will
   * contaminate and break all further responses otherwise.
   */
  test('It should return an empty array if no matches are found', async () => {
    const query = 'non-existent-service';
    const _event = event as any;
    _event['queryStringParameters'] = {
      serviceName: query
    };

    // lifecycleStage will fall back to "production" when we don't explicitly pass it
    const reponseEmptyArray = await getRecords(repo, event as unknown as APIGatewayProxyEventV2);
    expect(reponseEmptyArray).toEqual([]);
  });
});
