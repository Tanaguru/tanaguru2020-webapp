import Service from "./service";

export default class UserService extends Service{
    EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS'
    USERNAME_ALREADY_EXISTS = 'USERNAME_ALREADY_EXISTS'

    constructor(axios){
        super('users', axios)
    }

    me(then, error){
        return this.axios({
            url: '/users/me',
            method: 'GET'
          })
          .then(user => {then(user.data)})
          .catch(err => {error(err)})
    }

    create(username, email, password, appRole, enabled, createContract, then, error){
        const user = {
            'username' : username,
            'email' : email,
            'password' : password,
            'enabled' : enabled,
            'appRole' : appRole
        };

        this.axios({
            url: this.controllerName + "/" + "?create-contract=" + createContract,
            method: 'post',
            data: user
        })
        .then((user) => {then(user.data)})
        .catch((err) => {error(err)});
    }

    promoteById(id, appRole, then, error){
        const user = {
            'appRole' : appRole
        };

        return this.axios({
            url: this.controllerName + "/promote/" + id,
            method: 'put',
            data: user
        })
        .then(user => {then(user.data)})
        .catch(err => {error(err);});
    }

    modifyUser(
        id,
        username,
        email,
        appRole,
        enabled,
        accountNonLocked,
        then,
        error
    ){
        const user = {
            'id' : id,
            'username' : username,
            'email' : email,
            'appRole' : appRole,
            'enabled' : enabled,
            'accountNonLocked' : accountNonLocked
        };

        return this.axios({
            url: this.controllerName + "/",
            method: 'put',
            data: user
        })
        .then((user) => {then(user.data)})
        .catch((err) => {error(err)});
    }

    modifyMe(
        username,
        email,
        appRole,
        enabled,
        then,
        error
    ){
        const user = {
            'username' : username,
            'email' : email,
            'appRole' : appRole,
            'enabled' : enabled
        };

        return this.axios({
            url: this.controllerName + "/me",
            method: 'put',
            data: user
        })
        .then((response) => {then(response.data.user, response.data.token)})
        .catch((err) => {error(err)});
    }

    forgotPassword(email, then, error){
        return this.axios({
            url: this.controllerName + "/forgot-password",
            method: 'put',
            data: {
                'email': email
            }
        })
            .then(() => {then()})
            .catch((err) => {error(err)})
    }

    changePassword(password, userId, token, then, error){
        let body = {
            'userId': userId,
            'token': token,
            'password': password
        };

        return this.axios({
            url: this.controllerName + "/change-password",
            method: 'put',
            data: body
        })
        .then((user) => {then(user.data)})
        .catch((err) => {error(err)})
    }

    findAllByProject(id, then, error){
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


    findAllByContractPaginated(id, page, size, then, error){
        this.axios({
            url: this.controllerName + '/by-contract-paginated/' + id + '?page=' + page + '&size=' + size,
            method: 'get',
          })
          .then(resp => {
            then(resp.data)
          })
          .catch(err => {
              error(err);
          });
    }

    findAllByContract(id, then, error){
        this.axios({
            url: this.controllerName + '/by-contract/' + id,
            method: 'get',
          })
          .then(resp => {
            then(resp.data)
          })
          .catch(err => {
              error(err);
          });
    }

    findAllPaginated(page, size, sortBy, isAsc, usernameOrEmail, then, error){
        this.axios({
            url: this.controllerName + '/paginated' + '?page=' + page
            + '&size=' + size
            + '&sortBy=' + sortBy
            + '&isAsc=' + isAsc
            + '&usernameOrEmail=' + usernameOrEmail,
            method: 'get',
          })
          .then(resp => {
            then(resp.data)
          })
          .catch(err => {
              error(err);
          });
    }

    generateToken(user_id, expiration, then, error){
        return this.axios({
            url: this.controllerName + '/token/' + user_id + '/' + expiration,
            method: 'get',
        })
        .then(resp => {
            then(resp.data)
        })
        .catch(err => {
            error(err);
        });
    }

    getTokenExpiration(user_id, then, error){
        return this.axios({
            url: this.controllerName + '/token-expiration/' + user_id,
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
