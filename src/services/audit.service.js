import Service from "./service";

export default class AuditService extends Service{
    constructor(axios){
        super('audits', axios)
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

    findByProjectId(id, then, error){
        return this.axios({
            url: this.controllerName + '/by-project/' + id,
            method: 'get',
          })
          .then(resp => {
            then(resp.data)
          })
          .catch(err => {
              error(err);
          });
    }

    findByProjectIdAndTypePaginated(id, type, page, size, sortBy, isAsc, then, error){
        return this.axios({
            url: this.controllerName + '/by-project-and-type-paginated/' + id + '/' + type
            + '?&page=' + page + '&size=' + size + '&sortBy=' + sortBy + '&isAsc=' + isAsc,
            method: 'get',
          })
          .then(resp => {
            then(resp.data)
          })
          .catch(err => {
              error(err);
          });
    }

    start(name, references, mainReference, projectId, type, parameters, then, error){
        const auditConfiguration = {
            'name': name,
            'references' : references,
            'mainReference' : mainReference,
            'projectId' : projectId,
            'type' : type,
            'parameters' : parameters
        };
        return this.axios({
            url: this.controllerName + '/start',
            data: auditConfiguration,
            method: 'post',
          })
          .then(resp => {
            then(resp.data)
          })
          .catch(err => {
              error(err);
          });
    }

    stop(id, then, error){
        return this.axios({
            url: this.controllerName + '/' + id + '/stop',
            method: 'post',
        })
            .then(resp => {
                then(resp.data)
            })
            .catch(err => {
                error(err);
            });
    }

    demo(url, then, error){
        return this.axios({
            url: this.controllerName + '/demo',
            data: {
                "url" : url
            },
            method: 'post',
        })
            .then(resp => {
                then(resp.data)
            })
            .catch(err => {
                error(err);
            });
    }

    findLastByProject(projectId, then, error){
        return this.axios({
            url: this.controllerName + '/last-by-project/' + projectId,
            method: 'get',
        })
            .then(resp => {
                then(resp.data)
            })
            .catch(err => {
                error(err);
            });
    }

    findLastByProjectAndType(projectId, type, then, error){
        return this.axios({
            url: this.controllerName + '/last-by-project/' + projectId + '/' + type,
            method: 'get',
        })
        .then(resp => {
            then(resp.data)
        })
        .catch(err => {
            error(err);
        });
    }

    hasScreenshotsById(id, shareCode, then, error){
        return this.axios({
            url: this.controllerName + '/' + id+ '/has-screenshot/' + shareCode,
            method: 'get',
        })
        .then(resp => {
            then(resp.data);
        })
        .catch(err => {
            error(err);
        })
    }
}
