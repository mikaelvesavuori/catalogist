import { SizeError } from '../../application/errors/SizeError';
import { MissingSpecKeysError } from '../../application/errors/MissingSpecKeysError';
import { ValidationError } from '../../application/errors/ValidationError';
export function createNewManifest(payload) {
    const manifest = new ManifestConstructor(payload);
    return manifest.getManifest();
}
export class ManifestConstructor {
    manifest;
    sizeThreshold = 20000;
    maxArrayLength = 20;
    maxRelationsArrayLength = 50;
    validKeys = {};
    validLaxKeys = [];
    constructor(payload) {
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
        this.validatePayload(payload);
        const cleanedPayload = this.cleanPayload(payload);
        this.manifest = cleanedPayload;
    }
    validatePayload(body) {
        const payload = body;
        this.validateRequiredProperties(payload);
        this.validateSize(payload);
        this.validateArrayLengths(payload);
        this.validateSloPeriods(payload.slo);
        this.validateSloTypes(payload.slo);
        this.validateLinkIcon(payload.links);
        this.validateDataSensitivity(payload.spec.dataSensitivity);
        this.validateKind(payload.spec.kind);
    }
    validateRequiredProperties(payload) {
        if (!payload.hasOwnProperty('spec'))
            throw new ValidationError('Payload is missing required field "spec"!');
    }
    validateSize(payload) {
        const stringifiedLength = JSON.stringify(payload).length;
        if (stringifiedLength >= this.sizeThreshold)
            throw new SizeError('Object too large!');
    }
    validateArrayLengths(payload) {
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
    validateSloPeriods(slos) {
        if (slos && slos.length > 0)
            slos.forEach((slo) => {
                if (slo.period < 1 || slo.period > 365)
                    throw new ValidationError('SLO period is out of bounds, it must be between 1 and 365 days!');
            });
    }
    validateSloTypes(slos) {
        const validValues = ['latency', 'availability', 'correctness', 'other'];
        if (slos && slos.length > 0)
            slos.forEach((slo) => {
                if (validValues.includes(slo.type))
                    return;
                throw new ValidationError('Invalid "type" value received! It must be one of: "latency", "availability", "correctness" or "other".');
            });
    }
    validateLinkIcon(links) {
        const validValues = ['web', 'api', 'service', 'documentation', 'task', 'dashboard', 'other'];
        if (links && links.length > 0)
            links.forEach((link) => {
                if (!link.icon || validValues.includes(link.icon))
                    return;
                throw new ValidationError('Invalid "icon" value received! It must be one of: "web", "api", "service", "documentation", "task", "dashboard" or "other".');
            });
    }
    validateDataSensitivity(input) {
        const validValues = ['public', 'internal', 'secret', 'other'];
        if (!input || validValues.includes(input))
            return;
        throw new ValidationError('Invalid "dataSensitivity" value received! It must be one of: "public", "internal", "secret" or "other".');
    }
    validateKind(input) {
        const validValues = ['service', 'api', 'component', 'cots', 'product', 'external', 'other'];
        if (!input || validValues.includes(input))
            return;
        throw new ValidationError('Invalid "kind" value received! It must be one of: "service", "api", "component", "cots", "product", "external" or "other".');
    }
    cleanPayload(payload) {
        const validKeys = this.validKeys;
        let cleanedPayload = JSON.parse(JSON.stringify(payload));
        if (!cleanedPayload.spec['name'])
            throw new MissingSpecKeysError('Missing required key: name!');
        cleanedPayload = this.deleteUnknownFields(payload, validKeys['base']);
        cleanedPayload = this.deleteUnknownFields(payload, validKeys['spec'], 'spec');
        if (cleanedPayload.slo && cleanedPayload.slo.length > 0)
            cleanedPayload = this.cleanArrayObjects(cleanedPayload, validKeys['slo'], 'slo');
        if (cleanedPayload.links && cleanedPayload.links.length > 0)
            cleanedPayload = this.cleanArrayObjects(cleanedPayload, validKeys['links'], 'links');
        cleanedPayload = this.deleteUnusedFields(cleanedPayload, [
            'api',
            'links',
            'slo',
            'support',
            'metadata'
        ]);
        const sanitizedPayload = this.createSanitizedPayload(cleanedPayload);
        return sanitizedPayload;
    }
    deleteUnknownFields(payload, validKeys, fieldName) {
        if (fieldName) {
            Object.keys(payload[fieldName]).forEach((key) => {
                if (!validKeys.includes(key))
                    delete payload[fieldName][key];
            });
        }
        else {
            Object.keys(payload).forEach((key) => {
                if (!validKeys.includes(key))
                    delete payload[key];
            });
        }
        return payload;
    }
    cleanArrayObjects(payload, validKeys, fieldName) {
        payload[fieldName].forEach((link, index) => {
            Object.keys(link).forEach((key) => {
                if (!validKeys.includes(key))
                    delete payload[fieldName][index][key];
            });
        });
        return payload;
    }
    deleteUnusedFields(payload, fieldNames) {
        fieldNames.forEach((fieldName) => {
            const val = payload[fieldName] ? JSON.stringify(payload[fieldName]) : undefined;
            if (val && (val === '[]' || val === '{}' || val === '[{}]'))
                delete payload[fieldName];
        });
        return payload;
    }
    createSanitizedPayload(payload) {
        const cleanedPayload = {};
        Object.keys(payload).forEach((keyName) => {
            if (keyName === 'relations')
                cleanedPayload[keyName] = payload[keyName].map((item) => this.sanitizeString(item));
            else
                Array.isArray(payload[keyName])
                    ? (cleanedPayload[keyName] = payload[keyName].map((innerObject) => this.sanitizeObjects(innerObject)))
                    : (cleanedPayload[keyName] = this.sanitizeObjects(payload[keyName]));
        });
        return cleanedPayload;
    }
    sanitizeObjects(item) {
        const sanitizedObject = {};
        const laxKeys = this.validLaxKeys;
        Object.keys(item).forEach((objKey, index) => {
            const sanitizedKey = this.sanitizeString(objKey);
            const sanitizedValue = (() => {
                const value = Object.values(item)[index];
                if (laxKeys.includes(sanitizedKey.toString()))
                    return this.sanitizeLaxString(value);
                if (Array.isArray(value))
                    return value.map((arrValue) => this.sanitizeString(arrValue, true));
                else
                    return this.sanitizeString(value, true);
            })();
            sanitizedObject[sanitizedKey] = sanitizedValue;
        });
        return sanitizedObject;
    }
    sanitizeLaxString(value) {
        const regexValues = new RegExp(/\\/gim);
        return value.replace(regexValues, '').trim().substring(0, 1500);
    }
    sanitizeString(value, isValue = false) {
        if (typeof value === 'number')
            return value;
        const maxLength = isValue ? 500 : 50;
        const regexKeys = new RegExp(/[^a-z0-9@åäöøáéíóúñü\-_]/gim);
        const regexValues = new RegExp(/[^a-z0-9()\[\]\/\:åäöøáéíóúñü\.\s\-_]/gim);
        return (isValue ? value.replace(regexValues, '') : value.replace(regexKeys, ''))
            .trim()
            .substring(0, maxLength);
    }
    getManifest() {
        return this.manifest;
    }
}
//# sourceMappingURL=Manifest.js.map