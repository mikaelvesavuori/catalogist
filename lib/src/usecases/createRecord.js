import { createNewCatalogist } from '../domain/entities/Catalogist';
import { createNewManifest } from '../domain/valueObjects/Manifest';
export async function createRecord(repo, body) {
    const catalogist = createNewCatalogist(repo);
    const manifest = createNewManifest(body);
    await catalogist.createRecord(manifest);
    return manifest;
}
//# sourceMappingURL=createRecord.js.map