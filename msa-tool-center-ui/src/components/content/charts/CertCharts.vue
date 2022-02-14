<script>
  import { Doughnut } from 'vue-chartjs'
  import http from '../../../http_common';

  export default {
    extends: Doughnut,
    data () {
      return {
        options: {
          legend: {
            display: true
          },
          responsive: true,
          maintainAspectRatio: false
        }
      }
    },
    methods:{
      certCount() {
            let today = new Date().toISOString().slice(0, 10)
            var post_asset_date = {
                "from_date": "2021-01-01",
                "to_date": today
            }
            http.post('/certificates/report',{post_asset_date})
                .then(response => {
                    this.data = response.data;
                    this.certData(this.data);
            });
        },
      certData(data){
        this._certHigh = 0
        this._certLow = 0
        this._certMedium = 0
        this._certValid = 0

        for (let i in data) {
          for (let e in data[i]){
              if (data[i][e].priority == 'High') {
                this._certHigh = data[i][e].count
            }else if(data[i][e].priority == 'Low'){
                this._certLow = data[i][e].count
            }else if(data[i][e].priority == 'Medium'){
                this._certMedium = data[i][e].count
            }else if(data[i][e].priority == 'Valid'){
                this._certValid = data[i][e].count
            }
          }
        }

        var chartData = {
          labels: ["Low",	"Normal",	"Medium",	"High"],
          datasets: [{
              borderWidth: 2,
              borderColor: [
              'rgba(75, 192, 192, 1)', 
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(255,99,132,1)'  
              ],
              backgroundColor: [
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(153, 102, 255, 0.2)'            
              ],
              data: [this._certLow,	this._certValid,	this._certMedium,	this._certHigh]
          }]
      }
       return this.renderChart(chartData, this.options)
      },
    },
    mounted () {
      this.certCount();
    }
  }
</script>