import { Manifest } from './Manifest';

/**
 * @description Catalogist interface.
 */
export interface Catalogist {
  createRecord(manifest: Manifest): Promise<void>;
  getRecord(repo: string, service?: string): Promise<Manifest[] | Record<string, unknown>[]>;
}
