import { Manifest } from './Manifest';

/**
 * @description Repository interface.
 */
export interface Repository {
  getData(repo: string, service?: string): Promise<Manifest[] | Record<string, unknown>[]>;
  updateItem(manifest: Manifest): Promise<void>;
}
