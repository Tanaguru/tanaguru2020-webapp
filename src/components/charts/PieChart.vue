<script>
import { Doughnut } from 'vue-chartjs';

export default {
  extends: Doughnut,
  props: ['nbPage','nbSite','nbFile','nbScenario'],
  data () {
      return {
        options: {
          responsive: false,
          maintainAspectRatio: true
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
                labels: [this.$i18n.t('statistics.page'),
                this.$i18n.t('statistics.site'),
                this.$i18n.t('statistics.scenario'),
                this.$i18n.t('statistics.file')],
                    datasets: [
                    {
                        label: 'Polar Area Chart',
                        borderWidth: '0',
                        backgroundColor: [
                            '#CE0F75',
                            '#933FA7',
                            '#333333',
                            '#297F7D'
                        ],
                        data: [
                            this.nbPage, this.nbSite, this.nbScenario, this.nbFile]
                    }
                ]
            }
        }
    }
}
</script>