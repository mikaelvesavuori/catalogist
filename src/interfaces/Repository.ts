import { Manifest } from './Manifest';

/**
 * @description Repository interface.
 */
export interface Repository {
  getData(key: string, query?: string): Promise<Manifest[] | Record<string, unknown>[]>;
  updateItem(manifest: Manifest): Promise<void>;
}
