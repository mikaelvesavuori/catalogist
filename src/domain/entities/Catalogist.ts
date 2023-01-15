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
  repo: Repository;

  constructor(repo: Repository) {
    this.repo = repo;
  }

  /**
   * @description Create a record.
   * Primary (hash) key is "serviceName" field.
   * Sort (range) key is "lifecycleStage" field.
   */
  async createRecord(manifest: Manifest): Promise<void> {
    await this.repo.updateItem(manifest);
    console.log('Created record');
  }

  /**
   * @description Get a record using the provided repository.
   */
  async getRecord(key: string, query?: string): Promise<Manifest[] | Record<string, unknown>[]> {
    const records = await this.repo.getData(key, query);
    if (records && records.length === 0) return records;
    else {
      return records.map((record: any) => {
        const { spec, relations, support, slo, api, metadata, links, timestamp } = record;

        // Dump fields that we only needed for the persisted record
        const fixedRecord: Manifest = {
          spec,
          relations,
          support,
          slo,
          api,
          metadata,
          links,
          timestamp
        };

        return fixedRecord;
      });
    }
  }
}
