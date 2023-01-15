import crypto from 'crypto';

import { createNewCatalogist } from '../../src/domain/entities/Catalogist';

import { createRecord } from '../../src/usecases/createRecord';

import { createNewLocalRepository } from '../../src/infrastructure/repositories/LocalRepo';

import { ValidationError } from '../../src/application/errors/ValidationError';
import { MissingSpecKeysError } from '../../src/application/errors/MissingSpecKeysError';
import { SizeError } from '../../src/application/errors/SizeError';

import createRecordMissingSpecField from '../../testdata/requests/createRecordMissingSpecField.json';
import createRecordMissingServiceNameField from '../../testdata/requests/createRecordMissingServiceNameField.json';
import createRecordValidBasic from '../../testdata/requests/createRecordValidBasic.json';
import createRecordValidUnknownFields from '../../testdata/requests/createRecordValidUnknownFields.json';

describe('Failure cases', () => {
  describe('Validation errors', () => {
    test('It should throw a ValidationError if missing "spec" field', async () => {
      const catalogist = createNewCatalogist(createNewLocalRepository());
      expect(
        async () => await createRecord(catalogist, createRecordMissingSpecField)
      ).rejects.toThrowError(ValidationError);
    });

    test('It should throw a ValidationError if there are more than 10 items in the "api" field', async () => {
      const catalogist = createNewCatalogist(createNewLocalRepository());
      const recordTooManyApiItems: any = JSON.parse(JSON.stringify(createRecordValidBasic));
      recordTooManyApiItems['api'] = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
      expect(
        async () => await createRecord(catalogist, recordTooManyApiItems)
      ).rejects.toThrowError(ValidationError);
    });

    test('It should throw a ValidationError if there are more than 10 items in the "slo" field', async () => {
      const catalogist = createNewCatalogist(createNewLocalRepository());
      const recordTooManySloItems: any = JSON.parse(JSON.stringify(createRecordValidBasic));
      recordTooManySloItems['slo'] = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
      expect(
        async () => await createRecord(catalogist, recordTooManySloItems)
      ).rejects.toThrowError(ValidationError);
    });

    test('It should throw a ValidationError if there are more than 10 items in the "links" field', async () => {
      const catalogist = createNewCatalogist(createNewLocalRepository());
      const recordTooManyLinkItems: any = JSON.parse(JSON.stringify(createRecordValidBasic));
      recordTooManyLinkItems['links'] = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
      expect(
        async () => await createRecord(catalogist, recordTooManyLinkItems)
      ).rejects.toThrowError(ValidationError);
    });

    test('It should throw a ValidationError if there are more than 10 items in the "tags" field', async () => {
      const catalogist = createNewCatalogist(createNewLocalRepository());
      const recordTooManyTagItems: any = JSON.parse(JSON.stringify(createRecordValidBasic));
      recordTooManyTagItems.spec.tags = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
      expect(
        async () => await createRecord(catalogist, recordTooManyTagItems)
      ).rejects.toThrowError(ValidationError);
    });

    test('It should throw a ValidationError if there are more than 100 items in the "relations" field', async () => {
      const catalogist = createNewCatalogist(createNewLocalRepository());
      const recordTooManyRelationItems: any = JSON.parse(JSON.stringify(createRecordValidBasic));
      recordTooManyRelationItems['relations'] = [];
      for (let relationsCount = 0; relationsCount <= 101; relationsCount++) {
        recordTooManyRelationItems['relations'].push({});
      }
      expect(
        async () => await createRecord(catalogist, recordTooManyRelationItems)
      ).rejects.toThrowError(ValidationError);
    });
  });

  test('It should throw a MissingSpecKeysError if missing "serviceName" field', async () => {
    const catalogist = createNewCatalogist(createNewLocalRepository());
    expect(
      async () => await createRecord(catalogist, createRecordMissingServiceNameField)
    ).rejects.toThrowError(MissingSpecKeysError);
  });

  test('It should throw a SizeError if payload is too large', async () => {
    const catalogist = createNewCatalogist(createNewLocalRepository());

    // Ensure we absolutely use a new instance of the imported object
    const payloadTooLarge = JSON.parse(JSON.stringify(createRecordValidBasic));

    // Create a big blob of random data
    payloadTooLarge.metadata = crypto.randomBytes(10000).toString('hex');

    expect(async () => await createRecord(catalogist, payloadTooLarge)).rejects.toThrowError(
      SizeError
    );
  });
});

describe('Success cases', () => {
  test('It should create a record when given a valid, basic manifest without providing a "lifecycleStage" value', async () => {
    const catalogist = createNewCatalogist(createNewLocalRepository());

    const payload = JSON.parse(JSON.stringify(createRecordValidBasic));
    delete payload.spec.lifecycleStage;

    expect(async () => await createRecord(catalogist, payload)).not.toThrowError();
  });

  test('It should create a record when given a valid, basic manifest with a custom "lifecycleStage" field', async () => {
    const catalogist = createNewCatalogist(createNewLocalRepository());
    expect(async () => await createRecord(catalogist, createRecordValidBasic)).not.toThrowError();
  });

  test('It should create a record and clean it when given a manifest with unknown fields', async () => {
    const catalogist = createNewCatalogist(createNewLocalRepository());
    expect(
      async () => await createRecord(catalogist, createRecordValidUnknownFields)
    ).not.toThrowError();
  });
});
