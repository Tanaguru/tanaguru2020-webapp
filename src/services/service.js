export default class Service{
    constructor(controllerName, axios){
        this.controllerName = controllerName;
        this.axios = axios;
    }

    findById(id, then, error){
        return this.axios({
            url: this.controllerName + "/" + id, 
            method: 'get',
          })
          .then(resp => {
            then(resp.data)
          })
          .catch(err => {
              error(err);
          });
    }

    findAll(then, error){
        return this.axios({
            url: this.controllerName + '/', 
            method: 'get',
          })
          .then(resp => {
            then(resp.data)
          })
          .catch(err => {
              error(err);
          });
    }

    delete(id, then, error){
        return this.axios({
        url: this.controllerName + "/" + id, 
        method: 'delete',
      })
      .then(resp => {
        then()
      })
      .catch(err => {
          error(err);
      });
    }
}