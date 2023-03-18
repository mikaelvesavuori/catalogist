import { Manifest } from '../../interfaces/Manifest';
import { Repository } from '../../interfaces/Repository';

import { testdata } from '../../../testdata/TestDatabase';

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
  async getData(repo: string, service?: string): Promise<Manifest[] | Record<string, unknown>[]> {
    return testdata.filter((record: any) => {
      if (!service && record.spec.repo === repo) return record;
      if (record.spec.repo === repo && record.spec.name === service) return record;
    });
  }

  async updateItem(manifest: Manifest): Promise<void> {
    console.log(JSON.stringify(manifest).substring(0, 0));
  }
}
