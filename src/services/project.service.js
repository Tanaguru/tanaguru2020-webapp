import Service from "./service";

export default class ProjectService extends Service{
    constructor(axios){
        super('projects', axios)
    }

    create(name, domain, contractId, then, error){
        const project = {
            'name' : name,
            'domain' : domain,
            'contractId' : contractId,
        };

          return this.axios({
            url: this.controllerName + "/",
            method: 'post',
            data: project
        })
        .then((project) => {then(project.data)})
        .catch(err => {error(err)});
    }

    findByContractId(id, then, error){
        return this.axios({
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

    findByAuditId(id, sharecode, then, error){
        return this.axios({
            url: this.controllerName + '/by-audit/' + id + '/' + sharecode,
            method: 'get',
        })
        .then(resp => {
            then(resp.data)
        })
        .catch(err => {
            error(err)
        })
    }

    findAuthoritiesByProjectId(id, then, error){
        return this.axios({
            url: this.controllerName + '/' + id + '/authorities',
            method: 'get',
        })
            .then(resp => {
                then(resp.data)
            })
            .catch(err => {
                error(err)
            })
    }

    findMyProjects(page, size, search, then, error){
        return this.axios({
            url: this.controllerName + '/my-projects' + '?page=' + page + '&size=' + size + '&search=' + search,
            method: 'get',
        })
            .then(resp => {
                then(resp.data)
            })
            .catch(err => {
                error(err);
            });
    }

    findMySharedProjects(page, size, search, then, error){
        return this.axios({
            url: this.controllerName + '/my-shared-projects' + '?page=' + page + '&size=' + size + '&search=' + search,
            method: 'get',
        })
            .then(resp => {
                then(resp.data)
            })
            .catch(err => {
                error(err);
            });
    }

    findMemberOfNotOwner(page, size, search, then, error){
        return this.axios({
            url: this.controllerName + '/member-of' + '?page=' + page + '&size=' + size + '&search=' + search,
            method: 'get',
        })
            .then(resp => {
                then(resp.data)
            })
            .catch(err => {
                error(err);
            });
    }

    removeMember(id, projectId, then, error){
        const user = {
            'id' : id,
        };

        return this.axios({
            url: this.controllerName + "/" + projectId + "/remove-member/" + id,
            method: 'put',
            data: user
        })
        .then((user) => {then(user.data)})
        .catch((err) => {error(err)});
    }

    addMember(id, projectId, then, error){
        const user = {
            'id' : id,
        };

        return this.axios({
            url: this.controllerName + "/" + projectId + "/add-member/" + id,
            method: 'put',
            data: user
        })
        .then((user) => {then(user.data)})
        .catch((err) => {error(err)});
    }

    promoteMember(id, role, projectId, then, error){
        const user = {
            'id' : id,
            'role' : role,
        };

        return this.axios({
            url: this.controllerName + "/" + projectId + "/promote-member/" +id + '/to/' + role,
            method: 'put',
            data: user
        })
        .then((user) => {then(user.data)})
        .catch((err) => {error(err)});
    }


}
