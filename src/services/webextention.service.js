import Service from "./service";

export default class WebextentionService extends Service{
    constructor(axios){
        super('webextention', axios)
    }

    getWebextentionVersion(then, error){
        return this.axios({
            url: this.controllerName + '/' +'version',
            method: 'get',
        })
        .then(resp => {
            then(resp.data)
        })
        .catch(err => {
            error(err);
        });
    }

    createWebextentionVersion(testHierarchyId, version, then, error){
        const data = {
            'testHierarchyId' : testHierarchyId,
            'version' : version
        }

        return this.axios({
            url: this.controllerName + '/' +'version',
            method: 'post',
            data: data
        })
        .then(resp => {
            then(resp.data)
        })
        .catch(err => {
            error(err);
        });
    }

}