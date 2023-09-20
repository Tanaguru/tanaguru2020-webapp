import Service from "./service";

export default class PageService extends Service{
    constructor(axios){
        super('pages', axios)
    }

    findById(id, sharecode, then, error){
        return this.axios({
            url: this.controllerName + "/" + id + '/' + sharecode, 
            method: 'get',
          })
          .then(resp => {
            then(resp.data)
          })
          .catch(err => {
              error(err);
          });
    }

    findByAuditId(id, sharecode, page, size, then, error){
        return this.axios({
            url: this.controllerName + '/by-audit-paginated/' + id + '/' + sharecode + '?page=' + page + '&size=' + size,
            method: 'get',
          })
          .then(resp => {
            then(resp.data)
          })
          .catch(err => {
              error(err);
          });
    }

    findByAuditIdSorted(id, sharecode, page, size, sortBy, isAsc, then, error){
      return this.axios({
          url: this.controllerName + '/by-audit-paginated/' + id + '/' + sharecode + '?page=' + page + '&size=' + size
          + '&sortBy=' + sortBy + '&isAsc=' + isAsc,
          method: 'get',
        })
        .then(resp => {
          then(resp.data)
        })
        .catch(err => {
            error(err);
        });
    }

    findByAuditIdAndName(id, name, sharecode, page, size, then, error){
      return this.axios({
          url: this.controllerName + '/by-audit-paginated/' + id + '/' + sharecode + '?page=' + page + '&size=' + size
          +'&name=' + name,
          method: 'get',
        })
        .then(resp => {
          then(resp.data)
        })
        .catch(err => {
            error(err);
        });
    }

    pageByAudit(auditId, shareCode, then, error){
      return this.axios({
          url: this.controllerName + '/by-audit/'+ auditId + '/' + shareCode,
          method: 'get'
      })
      .then(resp => {
          then(resp.data)
      })
      .catch(err => {
          error(err);
      });
    }
}