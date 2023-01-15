import { isJsonString } from '../../src/infrastructure/frameworks/isJsonString';

describe('Success cases', () => {
  test('It should return a "false" boolean value when given a string', () => {
    expect(isJsonString('asdf')).toBe(false);
  });

  test('It should return a "true" boolean value when given an stringified object', () => {
    expect(isJsonString('{"asdf":123}')).toBe(true);
  });
});
