import Service from "./service";

export default class PageContentService extends Service{
    constructor(axios){
        super('page-contents', axios)
    }

    findByPageId(id, sharecode, then, error){
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

    findFirstByAuditId(id, sharecode, then, error){
        return this.axios({
            url: this.controllerName + '/first-by-audit/' + id + '/' + sharecode,
            method: 'get',
        })
            .then(resp => {
                then(resp.data)
            })
            .catch(err => {
                error(err);
            });
    }

    deleteScreenshotByAudit(id, then, error){
        return this.axios({
            url: this.controllerName + '/delete-screenshot-by-audit/' + id,
            method: 'put',
        })
            .then(resp => {
                then(resp.data)
            })
            .catch(err => {
                error(err);
            });
    }
}