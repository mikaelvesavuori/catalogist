import { Manifest } from './Manifest';

/**
 * @description Catalogist interface.
 */
export interface Catalogist {
  createRecord(manifest: Manifest): Promise<void>;
  getRecord(key: string, query?: string): Promise<Manifest[] | Record<string, unknown>[]>;
}
