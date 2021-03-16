import Service from "./service";

export default class TestHierarchyService extends Service{
    constructor(axios){
        super('test-hierarchies', axios)
    }

    findAllByTestSetId(id, then, error){
        return this.axios({
            url: this.controllerName + "/by-test-set/" + id,
            method: 'get',
          })
          .then(resp => {
            then(resp.data)
          })
          .catch(err => {
              error(err);
          });
    }

    findAllReferenceByAudit(id, sharecode, then, error){
        return this.axios({
            url: this.controllerName  + "/by-audit/" + id + '/' + sharecode,
            method: 'get',
        })
            .then(resp => {
                then(resp.data)
            })
            .catch(err => {
                error(err);
            });
    }

    findAllReferencesNotDeleted(then, error){
        return this.axios({
            url: this.controllerName  + "/references-not-deleted",
            method: 'get',
        })
            .then(resp => {
                then(resp.data)
            })
            .catch(err => {
                error(err);
            });
    }

    findAllReferences(page, size, then, error){
        return this.axios({
            url: this.controllerName  + "/references" + '?page=' + page + '&size=' + size,
            method: 'get',
        })
            .then(resp => {
                then(resp.data)
            })
            .catch(err => {
                error(err);
            });
    }

    findAllByTestAndReference(testId, referenceId, then, error){
        return this.axios({
            url: this.controllerName  + "/by-test-and-reference/" + testId + '/' + referenceId,
            method: 'get',
        })
            .then(resp => {
                then(resp.data)
            })
            .catch(err => {
                error(err);
            });
    }

    findByParent(parentId, then, error){
        return this.axios({
            url: this.controllerName + "/by-parent/" + parentId,
            method: 'get',
        })
        .then(resp => {
            then(resp.data)
        })
        .catch(err => {
            error(err);
        });
    }

    create(testHierarchy, then, error) {
        return this.axios({
            url: this.controllerName + "/",
            method: 'post',
            data: testHierarchy
        })
        .then((testHierarchy) => {
            then(testHierarchy.data)
        })
        .catch((err) => {
            error(err)
        });
    }

    addTest(testHierarchyId, tanaguruTestId, then, error){
        return this.axios({
            url: this.controllerName + '/' + testHierarchyId + '/add-test/' + tanaguruTestId,
            method: 'put'
        })
        .then((testHierarchy) => {
            then(testHierarchy.data)
        })
        .catch((err) => {
            error(err)
        });
    }

    addTestList(testHierarchyId, tanaguruTestList, then, error){
        return this.axios({
            url: this.controllerName + '/' + testHierarchyId + '/add-test-list',
            method: 'put',
            data: tanaguruTestList
        })
            .then((testHierarchy) => {
                then(testHierarchy.data)
            })
            .catch((err) => {
                error(err)
            });
    }

    deleteReference(referenceId, then, error){
        return this.axios({
            url: this.controllerName + "/reference/" + referenceId,
            method: 'delete',
        })
        .then(resp => {
            then()
        })
        .catch(err => {
            error(err);
        });
    }
}
