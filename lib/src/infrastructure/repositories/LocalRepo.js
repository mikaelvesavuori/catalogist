import { testdata } from '../../../testdata/TestDatabase';
export function createNewLocalRepository() {
    return new LocalRepo();
}
class LocalRepo {
    async getData(repo, service) {
        return testdata.filter((record) => {
            if (!service && record.spec.repo === repo)
                return record;
            if (record.spec.repo === repo && record.spec.name === service)
                return record;
        });
    }
    async updateItem(manifest) {
        console.log(JSON.stringify(manifest).substring(0, 0));
    }
}
//# sourceMappingURL=LocalRepo.js.map