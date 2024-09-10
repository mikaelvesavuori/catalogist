import { Manifest } from '../../interfaces/Manifest';
export declare function createNewManifest(payload: any): Manifest;
export declare class ManifestConstructor {
    manifest: Manifest;
    sizeThreshold: number;
    maxArrayLength: number;
    maxRelationsArrayLength: number;
    validKeys: {};
    validLaxKeys: string[];
    constructor(payload: any);
    private validatePayload;
    private validateRequiredProperties;
    private validateSize;
    private validateArrayLengths;
    private validateSloPeriods;
    private validateSloTypes;
    private validateLinkIcon;
    private validateDataSensitivity;
    private validateKind;
    private cleanPayload;
    private deleteUnknownFields;
    private cleanArrayObjects;
    private deleteUnusedFields;
    private createSanitizedPayload;
    private sanitizeObjects;
    private sanitizeLaxString;
    private sanitizeString;
    getManifest(): Manifest;
}
