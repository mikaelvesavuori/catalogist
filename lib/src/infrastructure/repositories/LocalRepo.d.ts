import { Manifest } from '../../interfaces/Manifest';
import { Repository } from '../../interfaces/Repository';
export declare function createNewLocalRepository(): LocalRepo;
declare class LocalRepo implements Repository {
    getData(repo: string, service?: string): Promise<Manifest[] | Record<string, unknown>[]>;
    updateItem(manifest: Manifest): Promise<void>;
}
export {};
