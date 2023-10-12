import Service from "./service";

export default class AuthenticationService extends Service{
    constructor(axios){
        super('authentication', axios)
    }

    refreshToken(then, error){
        return this.axios({
            url: this.controllerName + '/refresh-token', 
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