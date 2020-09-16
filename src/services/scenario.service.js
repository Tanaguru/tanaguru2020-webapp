import Service from "./service";

export default class ScenarioService extends Service{
    constructor(axios){
        super('scenarios', axios)
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
        const scenarioConfiguration = {
            'name': name,
            'content' : content,
            'projectId' : projectId
        };
        return this.axios({
            url: this.controllerName + '/',
            data: scenarioConfiguration,
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