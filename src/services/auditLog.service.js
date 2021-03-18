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

    findByAuditIdFiltered(id, sharecode, page, size, asc, levels, then, error){
        
        var levelsData = [];
        levels.forEach(element => levelsData.push('&levels='+element));
        levelsData = levelsData.join("");

        return this.axios({
            url: this.controllerName + '/by-audit-filtered/' + id + '/' + sharecode + '?page=' + page + '&size=' + size + '&asc=' + asc
            + levelsData,
            method: 'get',
          })
          .then(resp => {
            then(resp.data)
          })
          .catch(err => {
              error(err);
          });
    }

    getLogLevels(then, error){
        return this.axios({
            url: this.controllerName + '/levels',
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