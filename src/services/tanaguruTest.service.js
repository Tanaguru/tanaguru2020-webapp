import Service from "./service";

export default class TestHierarchyService extends Service{
    constructor(axios){
        super('tanaguru-tests', axios)
    }

    findById(id, then, error){
        return this.axios({
            url: this.controllerName + '/' + id,
            method: 'get',
        })
        .then(resp => {
            then(resp.data)
        })
        .catch(err => {
            error(err);
        });
    }

    findAllByReference(id, then, error){
        return this.axios({
            url: this.controllerName  + "/by-reference/" + id,
            method: 'get',
        })
        .then(resp => {
            then(resp.data)
        })
        .catch(err => {
            error(err);
        });
    }

    create(test, then, error) {
        return this.axios({
            url: this.controllerName + "/",
            method: 'post',
            data: test
        })
        .then((tanaguruTest) => {
            then(tanaguruTest.data)
        })
        .catch((err) => {
            error(err)
        });
    }
}