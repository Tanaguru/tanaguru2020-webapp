import Service from "./service";

export default class AuditParametersService extends Service{
    constructor(axios){
        super('audit-parameters', axios)
    }

    findByAuditId(id, sharecode, then, error){
        return this.axios({
            url: this.controllerName + '/by-audit/' + id + '/' + sharecode, 
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