import { UnknownKeyError } from '../../src/domain/errors/UnknownKeyError';

import { getQueryStringParams } from '../../src/frameworks/getQueryStringParams';

const validResponse = { queries: ['my-service'], lifecycleStage: 'production' };

describe('Failure cases', () => {
  test('It should throw an UnknownKeyError when given an unknown key', () => {
    const data = {
      asdf: 123
    };
    expect(() => getQueryStringParams(data)).toThrowError(UnknownKeyError);
  });
});

describe('Success cases', () => {
  test('It should return an empty array when given no input', () => {
    // @ts-ignore
    expect(getQueryStringParams()).toMatchObject({ queries: [] });
  });

  test('It should return an array when given the serviceName as key', () => {
    const data = {
      serviceName: 'my-service',
      lifecycleStage: 'some-stage'
    };
    expect(getQueryStringParams(data)).toMatchObject({
      queries: ['my-service'],
      lifecycleStage: 'some-stage'
    });
  });

  test('It should set the lifecycleStage to "some-stage" when lifecycleStage is provided', () => {
    const data = {
      serviceName: 'my-service',
      lifecycleStage: 'some-stage'
    };
    expect(getQueryStringParams(data)).toMatchObject({
      queries: ['my-service'],
      lifecycleStage: 'some-stage'
    });
  });

  test('It should set the lifecycleStage to "production" when lifecycleStage is missing', () => {
    const data = {
      lifecycleStage: 'production',
      serviceName: 'my-service'
    };
    expect(getQueryStringParams(data)).toMatchObject(validResponse);
  });
});
