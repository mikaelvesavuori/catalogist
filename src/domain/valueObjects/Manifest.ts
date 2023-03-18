import { LinkItem, Manifest, SloItem } from '../../interfaces/Manifest';

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
  sizeThreshold = 20000;
  maxArrayLength = 20;
  maxRelationsArrayLength = 50;
  validKeys = {};
  validLaxKeys: string[] = [];

  constructor(payload: any) {
    // Setup
    this.validKeys = {
      base: ['spec', 'relations', 'support', 'api', 'slo', 'links', 'metadata'],
      spec: [
        'repo',
        'name',
        'description',
        'kind',
        'lifecycleStage',
        'version',
        'responsible',
        'team',
        'system',
        'domain',
        'dataSensitivity',
        'tags'
      ],
      api: ['name', 'schemaPath'],
      slo: ['description', 'type', 'implementation', 'target', 'period'],
      links: ['title', 'url', 'icon']
    };
    this.validLaxKeys = ['description', 'implementation'];

    // Conduct activities
    this.validatePayload(payload);
    const cleanedPayload = this.cleanPayload(payload);
    this.manifest = cleanedPayload;
  }

  /**
   * @description Do basic field validation of the incoming data object.
   */
  private validatePayload(body: Manifest | Record<string, unknown>): void {
    const payload: Record<string, any> = body;

    this.validateRequiredProperties(payload);
    this.validateSize(payload);
    this.validateArrayLengths(payload);
    this.validateSloPeriods(payload.slo);
    this.validateSloTypes(payload.slo);
    this.validateLinkIcon(payload.links);
    this.validateDataSensitivity(payload.spec.dataSensitivity);
    this.validateKind(payload.spec.kind);
  }

  /**
   * @description Validate required properties.
   */
  private validateRequiredProperties(payload: Record<string, any>) {
    if (!payload.hasOwnProperty('spec'))
      throw new ValidationError('Payload is missing required field "spec"!');
  }

  /**
   * @description Ensure that we follow some meaningful max size cap.
   */
  private validateSize(payload: Record<string, any>) {
    const stringifiedLength = JSON.stringify(payload).length;
    if (stringifiedLength >= this.sizeThreshold) throw new SizeError('Object too large!');
  }

  /**
   * @description Validate array lengths.
   */
  private validateArrayLengths(payload: Record<string, any>) {
    if (payload?.relations?.length > this.maxRelationsArrayLength)
      throw new ValidationError('Payload has too many items in "relations" array!');
    if (payload?.spec?.tags?.length > this.maxArrayLength)
      throw new ValidationError('Payload has too many items in "tags" array!');
    if (payload?.api?.length > this.maxArrayLength)
      throw new ValidationError('Payload has too many items in "api" array!');
    if (payload?.slo?.length > this.maxArrayLength)
      throw new ValidationError('Payload has too many items in "slo" array!');
    if (payload?.links?.length > this.maxArrayLength)
      throw new ValidationError('Payload has too many items in "links" array!');
  }

  /**
   * @description Validate that SLOs have a valid period set.
   */
  private validateSloPeriods(slos: SloItem[]) {
    if (slos && slos.length > 0)
      slos.forEach((slo: SloItem) => {
        if (slo.period < 1 || slo.period > 365)
          throw new ValidationError(
            'SLO period is out of bounds, it must be between 1 and 365 days!'
          );
      });
  }

  /**
   * @description Validate the SLO types.
   */
  private validateSloTypes(slos: SloItem[]) {
    const validValues = ['latency', 'availability', 'correctness', 'other'];

    if (slos && slos.length > 0)
      slos.forEach((slo: SloItem) => {
        if (validValues.includes(slo.type)) return;
        throw new ValidationError(
          'Invalid "type" value received! It must be one of: "latency", "availability", "correctness" or "other".'
        );
      });
  }

  /**
   * @description Validate the link icon input.
   */
  private validateLinkIcon(links: LinkItem[]) {
    const validValues = ['web', 'api', 'service', 'documentation', 'task', 'dashboard', 'other'];

    if (links && links.length > 0)
      links.forEach((link: LinkItem) => {
        if (!link.icon || validValues.includes(link.icon)) return;
        throw new ValidationError(
          'Invalid "icon" value received! It must be one of: "web", "api", "service", "documentation", "task", "dashboard" or "other".'
        );
      });
  }

  /**
   * @description Validate the data sensitivity input.
   */
  private validateDataSensitivity(input: string) {
    const validValues = ['public', 'internal', 'secret', 'other'];
    if (!input || validValues.includes(input)) return;
    throw new ValidationError(
      'Invalid "dataSensitivity" value received! It must be one of: "public", "internal", "secret" or "other".'
    );
  }

  /**
   * @description Validate the (component) kind input.
   */
  private validateKind(input: string) {
    const validValues = ['service', 'api', 'component', 'cots', 'product', 'external', 'other'];
    if (!input || validValues.includes(input)) return;
    throw new ValidationError(
      'Invalid "kind" value received! It must be one of: "service", "api", "component", "cots", "product", "external" or "other".'
    );
  }

  /**
   * @description Sanitize the incoming payload.
   */
  private cleanPayload(payload: any): Manifest {
    const validKeys: Record<string, any> = this.validKeys;

    // Coerce the payload into a new object that does not include anything that is not serializable
    let cleanedPayload = JSON.parse(JSON.stringify(payload));

    // Check for missing required keys
    if (!cleanedPayload.spec['name']) throw new MissingSpecKeysError('Missing required key: name!');

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
    const laxKeys = this.validLaxKeys;

    Object.keys(item).forEach((objKey: string, index: number) => {
      const sanitizedKey = this.sanitizeString(objKey);
      const sanitizedValue = (() => {
        const value = Object.values(item)[index] as unknown as string | number;

        if (laxKeys.includes(sanitizedKey.toString()))
          return this.sanitizeLaxString(value as string);

        if (Array.isArray(value))
          return value.map((arrValue: string) => this.sanitizeString(arrValue, true));
        else return this.sanitizeString(value, true);
      })();
      sanitizedObject[sanitizedKey] = sanitizedValue;
    });

    return sanitizedObject;
  }

  /**
   * @description Does a special, less harsh treatment for strings.
   */
  private sanitizeLaxString(value: string) {
    const regexValues = new RegExp(/\\/gim); // Remove possibility of escaping
    return value.replace(regexValues, '').trim().substring(0, 1500);
  }

  /**
   * @description String sanitizer utility to cap length and allow only certain characters.
   * @see https://stackoverflow.com/questions/23187013/is-there-a-better-way-to-sanitize-input-with-javascript
   */
  private sanitizeString(value: string | number, isValue = false) {
    if (typeof value === 'number') return value;
    const maxLength = isValue ? 500 : 50;

    const regexKeys = new RegExp(/[^a-z0-9@åäöøáéíóúñü\-_]/gim);
    const regexValues = new RegExp(/[^a-z0-9()\[\]\/\:åäöøáéíóúñü\.\s\-_]/gim);

    return (isValue ? value.replace(regexValues, '') : value.replace(regexKeys, ''))
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
