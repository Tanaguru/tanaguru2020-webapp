import Service from "./service";

export default class ElementResultService extends Service{
    constructor(axios){
        super('element-results', axios)
    }

    findPageableByTestResultId(id, sharecode, page, then, error){
        return this.axios({
            url: this.controllerName + '/by-test-result/' + id + '/' + sharecode + '?page=' + page + '&size=10',
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