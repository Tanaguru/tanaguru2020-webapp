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
          if(this.nbPage ==0 && this.nbSite ==0 && this.nbScenario ==0 && this.nbFile ==0){
            return{
              labels: ["No data"],
              datasets: [{
                labels:'No data',
                backgroundColor: ['#D3D3D3'],
                data: [100]
              }]
            }
          }else{
            return {
                labels: [this.$i18n.t('statistics.page'),
                this.$i18n.t('statistics.site'),
                this.$i18n.t('statistics.scenario'),
                this.$i18n.t('statistics.file')],
                    datasets: [
                    {
                        label: 'Pie Chart',
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
}
</script>