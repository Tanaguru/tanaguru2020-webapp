import Service from "./service";

export default class StatsService extends Service{

    constructor(axios){
        super('stats', axios)
    }

    getStats(then, error){
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

}