<script>
import { PolarArea } from 'vue-chartjs'

export default {
    extends: PolarArea,
    props: ['nbFailed', 'nbCantTell', 'nbUntested', 'nbPassed', 'nbInapplicable'],
    data () {
      return {
        options: {
          responsive: true,
          maintainAspectRatio: false,
              legend: {
                display: false
              },
            scale: {
                display: false
            }
        }
      }
    },
    watch: {
        chartData: function() {
            this.renderChart(this.chartData, this.options)
        }
    },
    mounted () {
      this.renderChart(this.chartData, this.options)
    },
    computed : {
        chartData(){
            return {
                labels: [this.$i18n.t("entity.audit.result.failed"), this.$i18n.t("entity.audit.result.cantTell"), this.$i18n.t("entity.audit.result.untested"), this.$i18n.t("entity.audit.result.passed"), this.$i18n.t("entity.audit.result.inapplicable")],
                    datasets: [
                    {
                        label: 'Polar Area Chart',
                        borderWidth: '0',
                        backgroundColor: [
                            '#CE0F75',
                            '#933FA7',
                            '#333333',
                            '#297F7D',
                            '#2D7393',
                            '#00508C'
                        ],
                        data: [
                            this.nbFailed, this.nbCantTell, this.nbUntested, this.nbPassed, this.nbInapplicable]
                    }
                ]
            }
        }
    }
  }
</script>
