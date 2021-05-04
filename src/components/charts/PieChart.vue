<script>
import { Doughnut, mixins } from 'vue-chartjs'

export default {
 extends: Doughnut,
  props: ["data","labels"],
  mixins: [ mixins.reactiveData ],
  data() {
    return {
      chartData: {
        labels: this.labels,
        datasets: [
          {
            label: "Data One",
            backgroundColor: ["#f87979","#f87979","#f87979","#f87979"],
            data: this.data
          }
        ]
      }, 
      options: {responsive: true, maintainAspectRatio: false }
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
};
</script>