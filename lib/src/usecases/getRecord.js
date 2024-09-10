import { createNewCatalogist } from '../domain/entities/Catalogist';
import { getQueryStringParams } from '../infrastructure/frameworks/getQueryStringParams';
export async function getRecord(repo, event) {
    const catalogist = createNewCatalogist(repo);
    const params = getQueryStringParams(event.queryStringParameters);
    return await catalogist.getRecord(params.repo, params.service);
}
//# sourceMappingURL=getRecord.js.map