import { Manifest } from '../domain/interfaces/Manifest';
import { Repository } from '../domain/interfaces/Repository';

import { dataSomeotherLifecycle, dataProduction } from '../../testdata/TestDatabase';

/**
 * @description Factory function for local repository.
 */
export function createNewLocalRepository(): LocalRepo {
  return new LocalRepo();
}

/**
 * @description The local repo acts as a simple mock for testing and similar purposes.
 */
class LocalRepo implements Repository {
  async getData(key: string, query?: string): Promise<Manifest[] | Record<string, unknown>[]> {
    // Fake all records in non-production ("someotherlifecycle") lifecycleStage
    if (key !== 'production' && !query) return dataSomeotherLifecycle;

    // Fake single record from non-production ("someotherlifecycle") lifecycleStage
    if (key !== 'production' && query)
      return dataSomeotherLifecycle.filter((record: any) => {
        if (record.spec.serviceName === query) return record;
      });

    // Fake single record
    if (key === 'production' && query)
      return dataProduction.filter((record: any) => {
        if (record.spec.serviceName === query) return record;
      });

    // Fake all records in "production" lifecycleStage
    return dataProduction;
  }

  async updateItem(manifest: Manifest): Promise<void> {
    console.log(JSON.stringify(manifest).substring(0, 0));
  }
}
