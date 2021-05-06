<template>
    <div>
        <h1> {{ $t('title.statistics') }} </h1>
        <div class="form-row">
			<div class="form-column">
                <div class="form-block">
                    <h3> {{ $t('statistics.keyFigures') }} </h3>
                    <table class="table table--default table-references">
                        <caption class="screen-reader-text">{{ $t('statistics.legendTab') }}</caption>
                        <tbody>
                            <tr>
                                <th scope="row"> {{ $t('statistics.nbUsers') }} </th>
                                <td>{{ stats.nbUsers }}</td>
                            </tr>
                            <tr>
                                <th scope="row"> {{ $t('statistics.nbProjects') }} </th>
                                <td>{{ stats.nbProjects }}</td>
                            </tr>
                            <tr>
                                <th scope="row"> {{ $t('statistics.nbAudits') }} </th>
                                <td>{{ stats.nbAudits }}</td>
                            </tr>
                            <tr>
                                <th scope="row"> {{ $t('statistics.nbContracts') }} </th>
                                <td>{{ stats.nbContracts }}</td>
                            </tr>
                            <tr>
                                <th scope="row"> {{ $t('statistics.nbErrorMeanByPage') }} </th>
                                <td>{{ stats.meanNbErrorsPage.toFixed(1) }}</td>
                            </tr>
                            <tr>
                                <th scope="row"> {{ $t('statistics.nbErrorMeanByAudit') }} </th>
                                <td>{{ stats.meanNbErrorsAudit.toFixed(1) }}</td>
                            </tr>
                            <tr>
                                <th scope="row"> {{ $t('statistics.nbErrorMeanByProject') }} </th>
                                <td>{{ stats.meanNbErrorsProject.toFixed(1) }}</td>
                            </tr>
                            <tr>
                                <th scope="row"> Nombre moyen d'audits par projet</th>
                                <td> {{ stats.meanNbAuditsByProject.toFixed(1) }} </td>
                            </tr>
                            <tr>
                                <th scope="row"> Nombre moyen d'utilisateurs par projet</th>
                                <td> {{ stats.meanNbUsersByProject.toFixed(1) }} </td>
                            </tr>                  
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="form-column">
                <div class="form-block">
                    <div>
                        <h3> {{ $t('statistics.nbAuditByType') }} </h3>
                        <Piechart :nbPage="stats.nbPAGEAudit" :nbSite="stats.nbSITEAudit" :nbScenario="stats.nbSCENARIOAudit" :nbFile="stats.nbUPLOADAudit"></Piechart>
                    </div>
                </div>
            </div>
        </div>
        
        <h3> {{ $t('statistics.nbResourcesByPeriod') }} </h3>
        <div class="form-row">
            <div class="form-column">
                <div class="form-block">
                    <label class="label" for="dateStart"> {{ $t('statistics.dateForm.dateStart') }} </label>
                    <input
                    v-if="$i18n.locale.toLowerCase() == 'en'"
                    class="input"
                    v-bind:class="{'has-error': dateForm.dateStartError}"
                    type="text"
                    name="dateStart"
                    id="dateStart"
                    v-model="dateForm.dateStart"
                    :aria-describedby="dateForm.dateError ? 'date-error' : ''"
                    required>

                <input
                    v-else
                    class="input"
                    v-bind:class="{'has-error': dateForm.dateStartError}"
                    type="text"
                    name="dateStart"
                    id="dateStart"
                    v-model="dateForm.dateStart"
                    :aria-describedby="dateForm.dateError ? 'date-error' : ''"
                    required>
                    <p v-show="dateForm.dateStartError" id="date-error" class="info-error">{{dateForm.dateStartError}}</p>
                </div>
            </div>
            <div class="form-column">
                <div class="form-block">
                    <label class="label" for="dateEnd"> {{ $t('statistics.dateForm.dateEnd') }} </label>
                    <input
                    v-if="$i18n.locale.toLowerCase() == 'en'"
                    class="input"
                    v-bind:class="{'has-error': dateForm.dateEndError}"
                    type="text"
                    name="dateEnd"
                    id="dateEnd"
                    v-model="dateForm.dateEnd"
                    :aria-describedby="dateForm.dateError ? 'date-error' : ''"
                    required>

                <input
                    v-else
                    class="input"
                    v-bind:class="{'has-error': dateForm.dateEndError}"
                    type="text"
                    name="dateEnd"
                    id="dateEnd"
                    v-model="dateForm.dateEnd"
                    :aria-describedby="dateForm.dateError ? 'date-error' : ''"
                    required>
                    <p v-show="dateForm.dateEndError" id="date-error" class="info-error">{{dateForm.dateEndError}}</p>
                </div>
            </div>
        </div>
        <button class="btn btn--default" v-on:click="displayStats">{{ $t('action.search') }}</button>
        <p v-if="dateForm.error" id="form-error" class="info-error">{{ dateForm.error }}</p>
        <p v-if="dateForm.successMsg" id="form-success" class="info-success">{{ dateForm.successMsg }}</p>

        <div class="table-container" v-if="auditedOverPeriod.dateStart">
                <h4> {{ $t('statistics.from') }} {{ auditedOverPeriod.dateStart }} {{ $t('statistics.to') }} {{ auditedOverPeriod.dateEnd }} </h4>
				<table class="table table--default table-references">
					<caption class="screen-reader-text">{{ $t('statistics.legendTabPeriod') }}</caption>
					<thead>
					<tr>
						<th scope="col"> {{ $t('statistics.nbPages') }} </th>
						<th scope="col"> {{ $t('statistics.nbSites') }} </th>
                        <th scope="col"> {{ $t('statistics.nbScenarios') }} </th>
						<th scope="col"> {{ $t('statistics.nbFiles') }} </th>
                        <th scope="col"> {{ $t('statistics.nbErrorMeanByPage') }} </th>
					</tr>
					</thead>
					<tbody>
					<tr>
						<td class="td-title"> {{ auditedOverPeriod.nbPages }} </td>
                        <td class="td-title"> {{ auditedOverPeriod.nbSites }} </td>
                        <td class="td-title"> {{ auditedOverPeriod.nbScenarios }} </td>
                        <td class="td-title"> {{ auditedOverPeriod.nbFiles }} </td>
                        <td class="td-title"> {{ auditedOverPeriod.averagePageError.toFixed(1) }} </td>
					</tr>
					</tbody>
				</table>
			</div>

    </div>
</template>

<script>

import Piechart from "../../../components/charts/PieChart";

export default {
  components: { Piechart },
	name: 'statsTab',
	data() {
		return {
            stats: {
                nbProjects: 0,
                nbUsers: 0,
                nbAudits: 0,
                nbContracts: 0,
                meanNbErrorsPage: 0,
                meanNbErrorsProject: 0,
                meanNbErrorsAudit: 0,
                nbSITEAudit: 0,
                nbPAGEAudit: 0,
                nbSCENARIOAudit: 0,
                nbUPLOADAudit: 0,
                meanNbAuditsByProject: 0,
                meanNbUsersByProject: 0
            },
            dateForm: {
                dateStart: null,
                dateEnd: null,
                error: "",
                nameError: "",
                dateStartError: "",
                dateEndError: "",
                successMsg: ""
            },
            auditedOverPeriod: {
                dateStart: null,
                dateEnd: null,
                nbPages: 0,
                nbSites: 0,
                nbScenarios: 0,
                nbFiles: 0,
                averagePageError: 0
            }
        }
	},
	created() {
        this.loadStats();
    },
    methods: {
        loadStats(){
			this.statsService.getStats(
				stats => {
                    this.stats = stats;
                },
				err => console.error(err)
            );
        },
        checkDate() {
            let dateRegex = null;
            if(this.$i18n.locale.toLowerCase() == 'en'){
                dateRegex = /^(0[1-9]|1[012])[/](0[1-9]|[12][0-9]|3[01])[/](19|20)\d\d$/
            } else { dateRegex = /^(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/](19|20)\d\d$/ }

            if(dateRegex.test(this.dateForm.dateEnd) && dateRegex.test(this.dateForm.dateStart) ){
                return true;
            } else if( !dateRegex.test(this.dateForm.dateEnd) && !dateRegex.test(this.dateForm.dateStart) ) {
                this.dateForm.dateEndError = this.$i18n.t('statistics.dateForm.invalidDateEnd')
                this.dateForm.dateStartError = this.$i18n.t('statistics.dateForm.invalidDateStart')
                return false;
            } else  if( !dateRegex.test(this.dateForm.dateEnd) ){
                this.dateForm.dateEndError = this.$i18n.t('statistics.dateForm.invalidDateEnd')
                return false;
            }else{
                this.dateForm.dateStartError = this.$i18n.t('statistics.dateForm.invalidDateStart')
                return false;
            }
        },
        displayStats(){
            this.dateForm.error = "";
            this.dateForm.dateStartError = "";
            this.dateForm.dateEndError = "";
            this.successMsg = "";

            if (this.checkDate()) {

                let dateEnd = this.dateForm.dateEnd;
                let dateStart = this.dateForm.dateStart;
                this.auditedOverPeriod.dateStart = dateStart;
                this.auditedOverPeriod.dateEnd = dateEnd;
                if(this.$i18n.locale.toLowerCase() == 'en'){ 
                    dateEnd = this.$moment(this.dateForm.dateEnd, 'MM-DD-YYYY').format("YYYY-MM-DD")
                    dateStart = this.$moment(this.dateForm.dateStart, 'MM-DD-YYYY').format("YYYY-MM-DD")
                } else {
                    dateEnd = this.$moment(this.dateForm.dateEnd, 'DD-MM-YYYY').format("YYYY-MM-DD")
                    dateStart = this.$moment(this.dateForm.dateStart, 'DD-MM-YYYY').format("YYYY-MM-DD")
                }
                
                this.statsService.getNbPageAuditedByPeriod(
                    dateStart,
                    dateEnd,
                    resp => {
                        this.auditedOverPeriod.nbPages = resp;
                    },
                    err => console.error(err)
                );

                this.statsService.getNbSiteAuditedByPeriod(
                    dateStart,
                    dateEnd,
                    resp => {
                        this.auditedOverPeriod.nbSites = resp;
                    },
                    err => console.error(err)
                );

                this.statsService.getNbScenarioAuditedByPeriod(
                    dateStart,
                    dateEnd,
                    resp => {
                        this.auditedOverPeriod.nbScenarios = resp;
                    },
                    err => console.error(err)
                );

                this.statsService.getNbFilesAuditedByPeriod(
                    dateStart,
                    dateEnd,
                    resp => {
                        this.auditedOverPeriod.nbFiles = resp;
                    },
                    err => console.error(err)
                );

                this.statsService.getAverageNbErrorsForPageByPeriod(
                    dateStart,
                    dateEnd,
                    resp => {
                        this.auditedOverPeriod.averagePageError = resp;
                    },
                    err => console.error(err)
                ); 

                this.dateForm.dateStart = "";
                this.dateForm.dateEnd = "";

            }
        }
    }
}
</script>