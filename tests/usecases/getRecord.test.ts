import { APIGatewayProxyEvent } from 'aws-lambda';

import { createNewCatalogist } from '../../src/domain/entities/Catalogist';
import { getRecords } from '../../src/usecases/getRecords';
import { createNewLocalRepository } from '../../src/repositories/LocalRepo';

import event from '../../testdata/requests/awsEventRequest.json';
import { dataSomeotherLifecycle, dataProduction } from '../../testdata/TestDatabase';

describe('Success cases', () => {
  test('It should get all records in the "production" lifecycleStage when no additional input is given', async () => {
    const catalogist = createNewCatalogist(createNewLocalRepository());

    // lifecycleStage will fall back to "production" when we don't explicitly pass it
    const responseAllRecords = await getRecords(
      catalogist,
      event as unknown as APIGatewayProxyEvent
    );
    console.log('responseAllRecords', responseAllRecords);
    expect(responseAllRecords).toMatchObject(dataProduction);
  });

  test('It should get record by single service name when given "serviceName" query string parameter', async () => {
    const catalogist = createNewCatalogist(createNewLocalRepository());

    const query = 'my-service';
    const _event = event as any;
    _event['queryStringParameters'] = {
      serviceName: query
    };

    const record = dataProduction.filter((record: any) => {
      if (record.spec.serviceName === query) return record;
    });

    const responseSingleService = await getRecords(
      catalogist,
      _event as unknown as APIGatewayProxyEvent
    );
    expect(responseSingleService).toMatchObject(record);
  });

  test('It should get multiple records when given multiple "serviceName" query string parameters', async () => {
    const catalogist = createNewCatalogist(createNewLocalRepository());

    const _event = event as any;
    _event['queryStringParameters'] = {
      serviceName: 'my-service,my-other-service'
    };

    const responseMultipleServices = await getRecords(
      catalogist,
      _event as unknown as APIGatewayProxyEvent
    );
    expect(responseMultipleServices).toMatchObject(dataProduction.reverse()); // Seems that data is reversed so fix that
  });

  test('It should get records by lifecycleStage when given a "lifecycleStage" query string parameter', async () => {
    const catalogist = createNewCatalogist(createNewLocalRepository());

    const _event = event as any;
    _event['queryStringParameters'] = {
      lifecycleStage: 'someotherlifecycle'
    };

    const responseLifecycle = await getRecords(
      catalogist,
      _event as unknown as APIGatewayProxyEvent
    );
    expect(responseLifecycle).toMatchObject(dataSomeotherLifecycle);
  });

  test('It should get record by lifecycle stage and single service name when given "lifecycleStage" and a single "serviceName" query string parameters', async () => {
    const catalogist = createNewCatalogist(createNewLocalRepository());

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
      catalogist,
      _event as unknown as APIGatewayProxyEvent
    );
    expect(responseLifecycleSingleService).toMatchObject(record);
  });

  test('It should get records by lifecycle stage and multiple service names when given "lifecycleStage" and multiple "serviceName" query string parameters', async () => {
    const catalogist = createNewCatalogist(createNewLocalRepository());

    const _event = event as any;
    _event['queryStringParameters'] = {
      lifecycleStage: 'someotherlifecycle',
      serviceName: 'my-service,my-other-service'
    };

    const responseLifecycleMultipleServices = await getRecords(
      catalogist,
      _event as unknown as APIGatewayProxyEvent
    );
    expect(responseLifecycleMultipleServices).toMatchObject(dataSomeotherLifecycle);
  });

  /**
   * This has to be in the bottom since it will
   * contaminate and break all further responses otherwise.
   */
  test('It should return an empty array if no matches are found', async () => {
    const catalogist = createNewCatalogist(createNewLocalRepository());

    const query = 'non-existent-service';
    const _event = event as any;
    _event['queryStringParameters'] = {
      serviceName: query
    };

    // lifecycleStage will fall back to "production" when we don't explicitly pass it
    const reponseEmptyArray = await getRecords(
      catalogist,
      event as unknown as APIGatewayProxyEvent
    );
    expect(reponseEmptyArray).toEqual([]);
  });
});
