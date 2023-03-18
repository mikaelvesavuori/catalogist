import { Catalogist } from '../../interfaces/Catalogist';
import { Repository } from '../../interfaces/Repository';
import { Manifest } from '../../interfaces/Manifest';

/**
 * @description Factory function for Catalogist.
 */
export function createNewCatalogist(repo: Repository): Catalogist {
  return new CatalogistConcrete(repo);
}

/**
 * @description The concrete implementation for Catalogist.
 */
class CatalogistConcrete implements Catalogist {
  repository: Repository;

  constructor(repository: Repository) {
    this.repository = repository;
  }

  /**
   * @description Create a record.
   */
  async createRecord(manifest: Manifest): Promise<void> {
    await this.repository.updateItem(manifest);
    console.log('Created record');
  }

  /**
   * @description Get a record using the provided repository.
   */
  async getRecord(repo: string, service?: string): Promise<Manifest[] | Record<string, unknown>[]> {
    const records = await this.repository.getData(repo, service);

    if (records && records.length === 0) return records;

    return records.map((record: any) => {
      const { spec, relations, support, slo, api, metadata, links, timestamp } = record;

      // Dump fields that we only needed for the persisted record
      const fixedRecord: Manifest = {
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
