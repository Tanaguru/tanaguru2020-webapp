import Service from "./service";

export default class StatusResultService extends Service{
    constructor(axios){
        super('status-results', axios)
    }

    findByPageAndTestHierarchy(pageId, sharecode, testHierarchyId, then, error){
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

    findMainStatusResultByAudit(auditId, sharecode, then, error){
        return this.axios({
            url: this.controllerName + "/main-result-by-audit/" + auditId +"/" + sharecode,
            method: 'get',
        })
            .then(resp => {
                then(resp.data)
            })
            .catch(err => {
                error(err);
            });
    }

    findMainStatusResultByPage(pageId, sharecode, then, error){
        return this.axios({
            url: this.controllerName + "/main-result-by-page/" + pageId +"/" + sharecode,
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