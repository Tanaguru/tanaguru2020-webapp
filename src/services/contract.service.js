import Service from "./service";

export default class ContractService extends Service{
    constructor(axios){
        super('contracts', axios)
    }

    findMine(then, error){
        return this.axios({
            url: this.controllerName + '/me', 
            method: 'get',
          })
          .then(resp => {
            then(resp.data)
          })
          .catch(err => {
              error(err);
          });
    }

    findOwned(then, error){
        return this.axios({
            url: this.controllerName + '/owned', 
            method: 'get',
          })
          .then(resp => {
            then(resp.data)
          })
          .catch(err => {
              error(err);
        });
    }

    findMemberOf(then, error){
        return this.axios({
            url: this.controllerName + '/member-of', 
            method: 'get',
          })
          .then(resp => {
            then(resp.data)
          })
          .catch(err => {
              error(err);
        });
    }

    findByUserId(id, then, error){
        return this.axios({
            url: this.controllerName + '/by-user/' + id, 
            method: 'get',
          })
          .then(resp => {
            then(resp.data)
          })
          .catch(err => {
              error(err);
          });
    }

    create(name, dateEnd, ownerId, restrictDomain, then, error){
        const contract = {
            'auditLimit': 0,
            'dateEnd' : dateEnd,
            'name' : name,
            'ownerId' : ownerId,
            'restrictDomain' : restrictDomain
        };

        return this.axios({
            url: this.controllerName + "/", 
            method: 'post',
            data: contract
        })
        .then((resp) => {then(resp.data)})
        .catch((err) => {error(err)});
    }

    modifyById(id, name, dateEnd, ownerId, then, error ){
        const contract = {
            'id' : id,
            'name' : name,
            'dateEnd' : dateEnd,
            'ownerId': ownerId
        };

        return this.axios({
            url: this.controllerName + "/" + id, 
            method: 'put',
            data: contract
        })
        .then((resp) => {then(resp.data)})
        .catch((err) => {error(err.error)});
    }

    removeMember(id, contractId, then, error){
        return this.axios({
            url: this.controllerName + "/" + contractId + "/remove-member/" + id,
            method: 'put'
        })
        .then((resp) => {then(resp.data)})
        .catch((err) => {
            error(err.error)});
    }

    addMember(id, contractId, then, error){
        return this.axios({
            url: this.controllerName + "/" + contractId + "/add-member/" + id,
            method: 'put',
        })
        .then((resp) => {then(resp.data)})
        .catch((err) => {error(err.error)});
    }

    promoteMember(id, role, contractId, then, error){
        return this.axios({
            url: this.controllerName + "/" + contractId + "/promote-member/" +id + '/to/' + role,
            method: 'put'
        })
        .then((resp) => {then(resp.data)})
        .catch((err) => {error(err.error)});
    }

    findAuthoritiesByContractId(id, then, error){
        return this.axios({
            url: this.controllerName + "/contracts/" + id + "/authorities",
            method: 'get',
        })
        .then(resp => {then(resp.data)})
        .catch(err => {error(err);});
    }
}