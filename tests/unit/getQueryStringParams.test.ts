import { getQueryStringParams } from '../../src/infrastructure/frameworks/getQueryStringParams';

describe('Success cases', () => {
  test('It should return an empty QueryStringParams object when given no input', () => {
    // @ts-ignore
    expect(getQueryStringParams()).toMatchObject({ repo: '', service: '' });
  });

  test('It should work when given a repo', () => {
    const data = {
      repo: 'someorg/somerepo'
    };
    expect(getQueryStringParams(data)).toMatchObject(data);
  });

  test('It should work when given both a repo name and service name ', () => {
    const data = {
      repo: 'someorg/somerepo',
      service: 'my-service'
    };
    expect(getQueryStringParams(data)).toMatchObject(data);
  });
});
