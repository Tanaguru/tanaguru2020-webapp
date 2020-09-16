import Service from "./service";

export default class ConfigService extends Service{
    constructor(axios){
        super('config', axios)
    }

    getSessionDuration(then, error){
        return this.axios({
            url: this.controllerName + '/session-duration',
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