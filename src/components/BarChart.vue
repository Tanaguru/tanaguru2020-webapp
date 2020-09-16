<script>
import { Bar } from "vue-chartjs";

export default {
    extends: Bar,
    props: ['labels', 'data'],
    data () {
      return {
        options: {
          responsive: true,
		  maintainAspectRatio: false,
		  legend: {
            display: false
          },
        }
      }
    },
    mounted () {
      this.renderChart(this.chartData, this.options)
    },
    watch: {
        chartData: function() {
            this.renderChart(this.chartData, this.options)
        }
    },
    computed: {
        chartData(){
            return {
                labels: this.labels,
                datasets: [
                    {
                        label: "Nombre d'anomalies par thème",
                        backgroundColor: "#CE0F75",
                        barThickness: 20,
                        data: this.data
                    }
                ]
            }
        }
    }
  }
</script>
