import { Catalogist } from '../interfaces/Catalogist';

import { createNewManifest } from '../domain/valueObjects/Manifest';

/**
 * @description The use-case for creating a record.
 */
export async function createRecord(catalogist: Catalogist, body: any): Promise<void> {
  const manifest = createNewManifest(body);
  return await catalogist.createRecord(manifest);
}
