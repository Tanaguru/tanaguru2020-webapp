<template>
    <div>
        <h1> Statistiques </h1>
        <div>
            Nombre d'utilisateurs : {{ stats.nbUsers }}
        </div>

        <div>
            Nombre de projets : {{ stats.nbProjects }}
        </div>

        <div>
            Nombre d'erreur moyen par page : {{ stats.meanNbErrorsPage }}
        </div>

        <div>
            Nombre d'erreur moyen par audit : {{ stats.meanNbErrorsAudit }}
        </div>

        <div>
            Nombre d'erreur moyen par projet : {{ stats.meanNbErrorsProject }}
        </div>

        Site : {{ stats.nbSITEAudit }}
        Page : {{ stats.nbPAGEAudit }}
        Scenario : {{ stats.nbSCENARIOAudit }}
        Upload : {{ stats.nbUPLOADAudit }}

        <!--<div>
            <Piechart :data="data" :labels="labels"></Piechart>
        </div>-->
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
                meanNbErrorsPage: 0,
                meanNbErrorsProject: 0,
                meanNbErrorsAudit: 0,
                nbSITEAudit: 0,
                nbPAGEAudit: 0,
                nbSCENARIOAudit: 0,
                nbUPLOADAudit: 0
            },
            data: [1,1,1,1],
            labels: ["Site","Page","Scenario","Fichier"]
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
                    this.data = [this.stats.nbSITEAudit, this.stats.nbPAGEAudit, this.stats.nbSCENARIOAudit, this.stats.nbUPLOADAudit];
				},
				err => console.error(err)
            );
        }
    }
}
</script>