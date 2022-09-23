import Service from "./service";

export default class TestHierarchyResultService extends Service{
    constructor(axios){
        super('test-hierarchy-results', axios)
    }

    findByPageAndTestHierarchy(pageId, testHierarchyId, sharecode, then, error){
        return this.axios({
            url: this.controllerName + "/by-page-and-test-hierarchy/" + pageId +"/" + testHierarchyId + "/" + sharecode,
            method: 'get',
          })
          .then(resp => {
            then(resp.data)
          })
          .catch(err => {
              error(err);
          });
    }

    findReducedChildrenTestHierarchyResultByAudit(testHierarchyId, auditId, sharecode, then, error){
        return this.axios({
            url: this.controllerName + "/reduced-children-test-hierarchy-result-by-audit/" + testHierarchyId + '/' + auditId +"/" + sharecode,
            method: 'get',
        })
            .then(resp => {
                then(resp.data)
            })
            .catch(err => {
                error(err);
            });
    }

    findReducedTestHierarchyResultByAudit(testHierarchyId, auditId, sharecode, then, error){
        return this.axios({
            url: this.controllerName + "/reduced-test-hierarchy-result-by-audit/" + testHierarchyId + '/' + auditId +"/" + sharecode,
            method: 'get',
        })
            .then(resp => {
                then(resp.data)
            })
            .catch(err => {
                error(err);
            });
    }


    findByParent(parentId, sharecode, then, error){
        return this.axios({
            url: this.controllerName + "/by-parent/" + parentId +"/" + sharecode,
            method: 'get',
        })
            .then(resp => {
                then(resp.data)
            })
            .catch(err => {
                error(err);
            });
    }

    getSynthesisByAuditAndTestHierarchy(auditId, referenceId, sharecode, page, size, then, error){
        return this.axios({
            url: this.controllerName + "/synthesis-by-audit-and-test-hierarchy/" + auditId + "/" + referenceId + "/" + sharecode + '?page=' + page + '&size=' + size,
            method: 'get',
        })
        .then(resp => {
            then(resp.data)
        })
        .catch(err => {
            error(err)
        })
    }

    getGlobalTestResultForPages(auditId, referenceId, sharecode,then, error){
        return this.axios({
            url: this.controllerName + "/global-test-status-by-audit-and-test-hierarchy/" + auditId + "/" + referenceId + "/" + sharecode,
            method: 'get',
        })
        .then(resp => {
            then(resp.data)
        })
        .catch(err => {
            error(err)
        })
    }

    exportCsvSynthesisAuditResults(auditId, referenceId, sharecode, then, error){
        return this.axios({
            url: this.controllerName + "/csv-export/" + auditId +"/" + referenceId + "/" + sharecode,
            method: 'get',
            responseType: 'blob'
          })
          .then(resp => {
            then(resp.data)
          })
          .catch(err => {
              error(err);
          });
    }
}