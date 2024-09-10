import { Repository } from '../../interfaces/Repository';
import { Manifest } from '../../interfaces/Manifest';
export declare function createNewDynamoRepository(): DynamoRepository;
declare class DynamoRepository implements Repository {
    getData(repo: string, service?: string): Promise<Manifest[] | Record<string, unknown>[]>;
    updateItem(manifest: Manifest): Promise<void>;
    private getParams;
}
export {};
