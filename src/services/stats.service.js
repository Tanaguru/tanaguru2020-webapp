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

    getNbPageAuditedByPeriod(dateStart, dateEnd, then, error){
        return this.axios({
            url: this.controllerName + '/nb-page-audited/' + dateStart + '/' + dateEnd + '/',
            method: 'get',
        })
        .then(resp => {
            then(resp.data)
        })
        .catch(err => {
            error(err);
        });
    }

    getNbSiteAuditedByPeriod(dateStart, dateEnd, then, error){
        return this.axios({
            url: this.controllerName + '/nb-site-audited/' + dateStart + '/' + dateEnd + '/',
            method: 'get',
        })
        .then(resp => {
            then(resp.data)
        })
        .catch(err => {
            error(err);
        });
    }

    getNbScenarioAuditedByPeriod(dateStart, dateEnd, then, error){
        return this.axios({
            url: this.controllerName + '/nb-scenario-audited/' + dateStart + '/' + dateEnd + '/',
            method: 'get',
        })
        .then(resp => {
            then(resp.data)
        })
        .catch(err => {
            error(err);
        });
    }

    getNbFilesAuditedByPeriod(dateStart, dateEnd, then, error){
        return this.axios({
            url: this.controllerName + '/nb-file-audited/' + dateStart + '/' + dateEnd + '/',
            method: 'get',
        })
        .then(resp => {
            then(resp.data)
        })
        .catch(err => {
            error(err);
        });
    }

    getAverageNbErrorsForPageByPeriod(dateStart, dateEnd, then, error){
        return this.axios({
            url: this.controllerName + '/average-page-error-period/' + dateStart + '/' + dateEnd + '/',
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