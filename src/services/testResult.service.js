import Service from "./service";

export default class TestResultService extends Service{
    constructor(axios){
        super('test-results', axios)
    }

    findAllByPageId(id, sharecode, then, error){
        return this.axios({
            url: this.controllerName + '/by-page/' + id + '/' + sharecode,
            method: 'get',
          })
          .then(resp => {
            then(resp.data)
          })
          .catch(err => {
              error(err);
          });
    }

    findAllByTestHierarchyResult(id, sharecode, then, error){
        return this.axios({
            url: this.controllerName + '/by-test-hierarchy-result/' + id + '/' + sharecode,
            method: 'get',
        })
        .then(resp => {
            then(resp.data)
        })
        .catch(err => {
            error(err);
        });
    }

    findAllByReferenceAndPage(referenceId, pageId, sharecode, then, error){
        return this.axios({
            url: this.controllerName + '/by-reference-and-page/' + referenceId + '/' + pageId + '/' + sharecode,
            method: 'get',
        })
        .then(resp => {
            then(resp.data)
        })
        .catch(err => {
            error(err);
        });
    }
}