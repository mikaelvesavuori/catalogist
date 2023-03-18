import { createNewCatalogist } from '../domain/entities/Catalogist';
import { createNewManifest } from '../domain/valueObjects/Manifest';
import { Manifest } from '../interfaces/Manifest';

import { Repository } from '../interfaces/Repository';

/**
 * @description The use-case for creating a record.
 */
export async function createRecord(repo: Repository, body: any): Promise<Manifest> {
  const catalogist = createNewCatalogist(repo);
  const manifest = createNewManifest(body);
  await catalogist.createRecord(manifest);
  return manifest;
}
