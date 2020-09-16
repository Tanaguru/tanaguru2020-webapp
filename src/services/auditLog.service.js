import Service from "./service";

export default class AuditLogService extends Service{
    constructor(axios){
        super('audit-logs', axios)
    }

    findByAuditId(id, sharecode, page, size, then, error){
        return this.axios({
            url: this.controllerName + '/by-audit/' + id + '/' + sharecode + '?page=' + page + '&size=' + size,
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