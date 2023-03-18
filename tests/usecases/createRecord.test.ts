import crypto from 'crypto';

import { createNewLocalRepository } from '../../src/infrastructure/repositories/LocalRepo';

import { createRecord } from '../../src/usecases/createRecord';

import { ValidationError } from '../../src/application/errors/ValidationError';
import { MissingSpecKeysError } from '../../src/application/errors/MissingSpecKeysError';
import { SizeError } from '../../src/application/errors/SizeError';

import createRecordMissingSpecField from '../../testdata/requests/createRecordMissingSpecField.json';
import createRecordMissingServiceNameField from '../../testdata/requests/createRecordMissingServiceNameField.json';
import createRecordValidFull from '../../testdata/requests/createRecordValidFull.json';
import createRecordValidBasic from '../../testdata/requests/createRecordValidBasic.json';
import createRecordValidUnknownFields from '../../testdata/requests/createRecordValidUnknownFields.json';

const repo = createNewLocalRepository();

const tooLongArray = [
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {}
];

describe('Failure cases', () => {
  describe('Validation errors', () => {
    test('It should throw a ValidationError if missing "spec" field', async () => {
      expect(
        async () => await createRecord(repo, createRecordMissingSpecField)
      ).rejects.toThrowError(ValidationError);
    });

    describe('Length errors', () => {
      test('It should throw a ValidationError if there are more than 10 items in the "api" field', async () => {
        const recordTooManyApiItems: any = JSON.parse(JSON.stringify(createRecordValidBasic));
        recordTooManyApiItems['api'] = tooLongArray;
        expect(async () => await createRecord(repo, recordTooManyApiItems)).rejects.toThrowError(
          ValidationError
        );
      });

      test('It should throw a ValidationError if there are more than 10 items in the "slo" field', async () => {
        const recordTooManySloItems: any = JSON.parse(JSON.stringify(createRecordValidBasic));
        recordTooManySloItems['slo'] = tooLongArray;
        expect(async () => await createRecord(repo, recordTooManySloItems)).rejects.toThrowError(
          ValidationError
        );
      });

      test('It should throw a ValidationError if there are more than 10 items in the "links" field', async () => {
        const recordTooManyLinkItems: any = JSON.parse(JSON.stringify(createRecordValidBasic));
        recordTooManyLinkItems['links'] = tooLongArray;
        expect(async () => await createRecord(repo, recordTooManyLinkItems)).rejects.toThrowError(
          ValidationError
        );
      });

      test('It should throw a ValidationError if there are more than 10 items in the "tags" field', async () => {
        const recordTooManyTagItems: any = JSON.parse(JSON.stringify(createRecordValidBasic));
        recordTooManyTagItems.spec.tags = tooLongArray;
        expect(async () => await createRecord(repo, recordTooManyTagItems)).rejects.toThrowError(
          ValidationError
        );
      });

      test('It should throw a ValidationError if there are more than 50 items in the "relations" field', async () => {
        const recordTooManyRelationItems: any = JSON.parse(JSON.stringify(createRecordValidBasic));
        recordTooManyRelationItems['relations'] = [];
        for (let relationsCount = 0; relationsCount <= 51; relationsCount++) {
          recordTooManyRelationItems['relations'].push({});
        }
        expect(
          async () => await createRecord(repo, recordTooManyRelationItems)
        ).rejects.toThrowError(ValidationError);
      });

      test('It should throw a ValidationError if the number of days in an SLO is less than 1', async () => {
        const input = JSON.parse(JSON.stringify(createRecordValidFull));
        input.slo[0].period = 0;
        expect(async () => await createRecord(repo, input)).rejects.toThrowError(ValidationError);
      });

      test('It should throw a ValidationError if the number of days in an SLO is more than 365', async () => {
        const input = JSON.parse(JSON.stringify(createRecordValidFull));
        input.slo[0].period = 366;
        expect(async () => await createRecord(repo, input)).rejects.toThrowError(ValidationError);
      });
    });

    describe('Type errors', () => {
      test('It should throw a ValidationError if using an unknown SLO type', async () => {
        const input = JSON.parse(JSON.stringify(createRecordValidFull));
        input.slo[0].type = 'unknown';
        expect(async () => await createRecord(repo, input)).rejects.toThrowError(ValidationError);
      });

      test('It should throw a ValidationError if using an unknown link icon', async () => {
        const input = JSON.parse(JSON.stringify(createRecordValidFull));
        input.links[0].icon = 'unknown';
        expect(async () => await createRecord(repo, input)).rejects.toThrowError(ValidationError);
      });

      test('It should throw a ValidationError if using an unknown data sensitivity level', async () => {
        const input = JSON.parse(JSON.stringify(createRecordValidFull));
        input.spec.dataSensitivity = 'unknown';
        expect(async () => await createRecord(repo, input)).rejects.toThrowError(ValidationError);
      });

      test('It should throw a ValidationError if using an unknown component kind', async () => {
        const input = JSON.parse(JSON.stringify(createRecordValidFull));
        input.spec.kind = 'unknown';
        expect(async () => await createRecord(repo, input)).rejects.toThrowError(ValidationError);
      });
    });
  });

  test('It should throw a MissingSpecKeysError if missing "name" field', async () => {
    expect(
      async () => await createRecord(repo, createRecordMissingServiceNameField)
    ).rejects.toThrowError(MissingSpecKeysError);
  });

  test('It should throw a SizeError if payload is too large', async () => {
    // Ensure we absolutely use a new instance of the imported object
    const payloadTooLarge = JSON.parse(JSON.stringify(createRecordValidBasic));

    // Create a big blob of random data
    payloadTooLarge.metadata = crypto.randomBytes(20000).toString('hex');

    expect(async () => await createRecord(repo, payloadTooLarge)).rejects.toThrowError(SizeError);
  });
});

describe('Success cases', () => {
  test('It should create a record when given a valid, basic manifest', async () => {
    const result = await createRecord(repo, createRecordValidBasic);
    expect(result).toMatchObject(createRecordValidBasic);
  });

  test('It should create a record when given a full manifest', async () => {
    const result = await createRecord(repo, createRecordValidFull);
    expect(result).toMatchObject(createRecordValidFull);
  });

  test('It should create a sanitized record which uses an incorrect SLO implementation string', async () => {
    const input = createRecordValidFull;
    // @ts-ignore
    input.slo[0].implementation = 'asdf' + '\\' + 'qwerty';
    const result = await createRecord(repo, input);
    // @ts-ignore
    expect(result.slo[0].implementation).toBe('asdfqwerty');
  });

  test('It should create a record and clean it when given a manifest with unknown fields', async () => {
    const { spec } = await createRecord(repo, createRecordValidUnknownFields);
    expect(spec).not.toHaveProperty('something');
  });

  test('It should create a record and keep a regular free-form description intact', async () => {
    const input = JSON.parse(JSON.stringify(createRecordValidFull));
    const description =
      'Markus Åhström and Wikipedia writes "asdf!#)/€" An application programming interface (@API) is a way for two or more computer programs to communicate with each other. It is a type of software interface, offering a service to other pieces of software.[1] A document or standard that describes how to build or use such a connection or interface is called an API specification. A computer system that meets this standard is said to implement or expose an API. The term API may refer either to the specification or to the implementation. In contrast to a user interface, which connects a computer to a person, an application programming interface connects computers or pieces of software to each other. It is not intended to be used directly by a person (the end user) other than a computer programmer who is incorporating it into the software. An API is often made up of different parts which act as tools or services that are available to the programmer.';
    input.spec.description = description;
    const { spec } = await createRecord(repo, input);
    expect(spec.description).toBe(description);
  });
});
