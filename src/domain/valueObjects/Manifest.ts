import { Manifest } from '../../interfaces/Manifest';

import { SizeError } from '../../application/errors/SizeError';
import { MissingSpecKeysError } from '../../application/errors/MissingSpecKeysError';
import { ValidationError } from '../../application/errors/ValidationError';

/**
 * @description Factory utility to create new Manifest value object.
 */
export function createNewManifest(payload: any): Manifest {
  const manifest = new ManifestConstructor(payload);
  return manifest.getManifest();
}

/**
 * @description Manifest value object.
 */
export class ManifestConstructor {
  manifest: Manifest;
  sizeThreshold = 10000;
  maxArrayLength = 10;
  maxRelationsArrayLength = 100;

  constructor(payload: any) {
    this.validatePayload(payload);
    const cleanedPayload = this.cleanPayload(payload);
    this.manifest = cleanedPayload;
  }

  /**
   * @description Do basic field validation of the incoming data object.
   */
  private validatePayload(body: Manifest | Record<string, unknown>): void {
    const payload: any = body;

    // Ensure that we follow some meaningful max size cap
    const stringifiedLength = JSON.stringify(payload).length;
    if (stringifiedLength >= this.sizeThreshold) throw new SizeError('Object too large!');

    if (!payload.hasOwnProperty('spec'))
      throw new ValidationError('Payload is missing required field "spec"!');

    if (payload.relations && payload.relations.length > this.maxRelationsArrayLength)
      throw new ValidationError('Payload has too many items in "relations" array!');
    if (payload.spec.tags && payload.spec.tags.length > this.maxArrayLength)
      throw new ValidationError('Payload has too many items in "tags" array!');
    if (payload.api && payload.api.length > this.maxArrayLength)
      throw new ValidationError('Payload has too many items in "api" array!');
    if (payload.slo && payload.slo.length > this.maxArrayLength)
      throw new ValidationError('Payload has too many items in "slo" array!');
    if (payload.links && payload.links.length > this.maxArrayLength)
      throw new ValidationError('Payload has too many items in "links" array!');
  }

  /**
   * @description Get a list of valid keys for the input validation.
   * Some keys have user-defined key names, so we skip those.
   */
  private getValidKeys() {
    const validKeys: any = {
      base: ['spec', 'relations', 'support', 'slo', 'api', 'metadata', 'links'],
      spec: [
        'serviceName',
        'serviceType',
        'lifecycleStage',
        'version',
        'description',
        'responsible',
        'team',
        'system',
        'domain',
        'dataSensitivity',
        'tags'
      ],
      slo: ['description', 'level', 'percentile', 'maxLatency'],
      links: ['title', 'url', 'icon']
    };

    return validKeys;
  }

  /**
   * @description Sanitize the incoming payload.
   */
  private cleanPayload(payload: any): Manifest {
    const validKeys = this.getValidKeys();

    // Coerce the payload into a new object that does not include anything that is not serializable
    let cleanedPayload = JSON.parse(JSON.stringify(payload));

    // Check for missing required keys
    if (!cleanedPayload.spec['serviceName'])
      throw new MissingSpecKeysError('Missing required key: serviceName!');

    // Remove any unknown keys/fields from base and `spec` fields
    cleanedPayload = this.deleteUnknownFields(payload, validKeys['base']);
    cleanedPayload = this.deleteUnknownFields(payload, validKeys['spec'], 'spec');

    // Check and clean objects in arrays
    if (cleanedPayload.slo && cleanedPayload.slo.length > 0)
      cleanedPayload = this.cleanArrayObjects(cleanedPayload, validKeys['slo'], 'slo');
    if (cleanedPayload.links && cleanedPayload.links.length > 0)
      cleanedPayload = this.cleanArrayObjects(cleanedPayload, validKeys['links'], 'links');

    // Check and delete potentially useless fields
    cleanedPayload = this.deleteUnusedFields(cleanedPayload, [
      'api',
      'links',
      'slo',
      'support',
      'metadata'
    ]);

    // Use fallback value if missing "lifecycleStage" key
    if (!cleanedPayload.spec['lifecycleStage']) {
      console.log(
        "Payload was missing an explicit lifecycleStage key, so it will fall back to using 'production' as its value"
      );
      cleanedPayload.spec['lifecycleStage'] = 'production';
    }

    // Sanitize the payload (max lengths, allow only certain characters...)
    const sanitizedPayload = this.createSanitizedPayload(cleanedPayload);

    return sanitizedPayload;
  }

  /**
   * @description Deletes unknown fields.
   */
  private deleteUnknownFields(payload: any, validKeys: string[], fieldName?: string) {
    if (fieldName) {
      Object.keys(payload[fieldName]).forEach((key: string) => {
        if (!validKeys.includes(key)) delete payload[fieldName][key];
      });
    } else {
      Object.keys(payload).forEach((key: string) => {
        if (!validKeys.includes(key)) delete payload[key];
      });
    }

    return payload;
  }

  /**
   * @description Clean objects in array.
   */
  private cleanArrayObjects(payload: any, validKeys: string[], fieldName: string) {
    payload[fieldName].forEach((link: Record<string, unknown>, index: number) => {
      Object.keys(link).forEach((key: string) => {
        if (!validKeys.includes(key)) delete payload[fieldName][index][key];
      });
    });

    return payload;
  }

  /**
   * @description Deletes useless fields.
   */
  private deleteUnusedFields(payload: any, fieldNames: string[]) {
    fieldNames.forEach((fieldName: string) => {
      const val = payload[fieldName] ? JSON.stringify(payload[fieldName]) : undefined;
      if (val && (val === '[]' || val === '{}' || val === '[{}]')) delete payload[fieldName];
    });

    return payload;
  }

  /**
   * @description Create a sanitized payload from a previously "cleaned" payload.
   */
  private createSanitizedPayload(payload: any) {
    const cleanedPayload: any = {};

    Object.keys(payload).forEach((keyName: string) => {
      // "Relations" is just a simple array so use it as-is after sanitizing
      if (keyName === 'relations')
        cleanedPayload[keyName] = payload[keyName].map((item: string) => this.sanitizeString(item));
      // Loop the sanitizer if it's an array
      else
        Array.isArray(payload[keyName])
          ? (cleanedPayload[keyName] = payload[keyName].map((innerObject: any) =>
              this.sanitizeObjects(innerObject)
            ))
          : (cleanedPayload[keyName] = this.sanitizeObjects(payload[keyName]));
    });

    return cleanedPayload;
  }

  /**
   * @description Utility to sanitize objects in payload.
   */
  private sanitizeObjects(item: any) {
    const sanitizedObject: any = {};

    Object.keys(item).forEach((objKey: string, index: number) => {
      const sanitizedKey = this.sanitizeString(objKey);
      const sanitizedValue = (() => {
        const value = Object.values(item)[index];
        if (Array.isArray(value))
          return value.map((arrValue: string) => this.sanitizeString(arrValue, true));
        else return this.sanitizeString(value as string, true);
      })();
      sanitizedObject[sanitizedKey] = sanitizedValue;
    });

    return sanitizedObject;
  }

  /**
   * @description String sanitizer utility to cap length and allow only certain characters.
   * @see https://stackoverflow.com/questions/23187013/is-there-a-better-way-to-sanitize-input-with-javascript
   */
  private sanitizeString(str: string, isValue = false) {
    const maxLength = isValue ? 500 : 50;
    const regexKeys = new RegExp(/[^a-z0-9@åäöøáéíóúñü\-_]/gim);
    const regexValues = new RegExp(/[^a-z0-9()\[\]\/\:åäöøáéíóúñü\.\s\-_]/gim);

    return (isValue ? str.replace(regexValues, '') : str.replace(regexKeys, ''))
      .trim()
      .substring(0, maxLength);
  }

  /**
   * @description Expose the manifest data.
   */
  public getManifest(): Manifest {
    return this.manifest;
  }
}
