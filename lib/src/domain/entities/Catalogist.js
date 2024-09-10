export function createNewCatalogist(repo) {
    return new CatalogistConcrete(repo);
}
class CatalogistConcrete {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async createRecord(manifest) {
        await this.repository.updateItem(manifest);
        console.log('Created record');
    }
    async getRecord(repo, service) {
        const records = await this.repository.getData(repo, service);
        if (records && records.length === 0)
            return records;
        return records.map((record) => {
            const { spec, relations, support, slo, api, metadata, links, timestamp } = record;
            const fixedRecord = {
                spec,
                relations,
                support,
                api,
                slo,
                links,
                metadata,
                timestamp
            };
            return fixedRecord;
        });
    }
}
//# sourceMappingURL=Catalogist.js.map