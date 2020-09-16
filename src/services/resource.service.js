import Service from "./service";

export default class ResourceService extends Service{
    constructor(axios){
        super('resources', axios)
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

    create(name, projectId, content, then, error){
        const resourceConfiguration = {
            'name': name,
            'content' : content,
            'projectId' : projectId
        };
        return this.axios({
            url: this.controllerName + '/',
            data: resourceConfiguration,
            method: 'post',
          })
          .then(resp => {
            then(resp.data)
          })
          .catch(err => {
              error(err);
          });
    }
}