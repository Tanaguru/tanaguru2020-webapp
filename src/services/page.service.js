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
}