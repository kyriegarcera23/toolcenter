<script>
import { Bar } from 'vue-chartjs'
import http from '../../../http_common';
export default {
  extends: Bar,
  data(){
      return {
        options: {
            responsive: true,
            plugins: {
            legend: {
                position: 'top',
            }
            }
            
        }
      }
  },
  methods:{
    assetCount() {
        let today = new Date().toISOString().slice(0, 10)
        var post_asset_date = {
            "from_date": "2021-01-01",
            "to_date": today
        }
        http.post('/assets/report',{post_asset_date})
            .then(response => {
                this.value = response.data;
                this.chart_Data(this.value)
        });
    },
    chart_Data(data){
        var software_high = 0
        this._physical_high = 0
        this._virtual_high = 0
        this._network_high = 0

        this._software_low = 0
        this._physical_low = 0
        this._virtual_low = 0
        this._network_low = 0

        this._software_med = 0
        this._physical_med = 0
        this._virtual_med = 0
        this._network_med = 0

        for (let i in data.asset_high) {
            if (data.asset_high[i].asset_type == 'software') {
                software_high = data.asset_high[i].asset_count

            }else if(data.asset_high[i].asset_type == 'physical') {
                this._physical_high = data.asset_high[i].asset_count

            }else if(data.asset_high[i].asset_type == 'virtual') {
                
                this._virtual_high = data.asset_high[i].asset_count
            }else if(data.asset_high[i].asset_type == 'network') {
                
                this._network_high = data.asset_high[i].asset_count
            }
        }


        for (let i in data.asset_low) {
            if (data.asset_low[i].asset_type == 'software') {
                this._software_low = data.asset_low[i].asset_count

            }else if(data.asset_low[i].asset_type == 'physical') {
                this._physical_low = data.asset_low[i].asset_count

            }else if(data.asset_low[i].asset_type == 'virtual') {
                
                this._virtual_low = data.asset_low[i].asset_count
            }else if(data.asset_low[i].asset_type == 'network') {
                
                this._network_low = data.asset_low[i].asset_count
            }
        }

        for (let i in data.asset_normal) {
            if (data.asset_normal[i].asset_type == 'software') {
                this._software_med = data.asset_normal[i].asset_count

            }else if(data.asset_normal[i].asset_type == 'physical') {
                this._physical_med = data.asset_normal[i].asset_count

            }else if(data.asset_normal[i].asset_type == 'virtual') {
                
                this._virtual_med = data.asset_normal[i].asset_count
            }else if(data.asset_normal[i].asset_type == 'network') {
                
                this._network_med = data.asset_normal[i].asset_count
            }
        }
        
        var chart_data = {
                type:"bar",
				labels: ['Software', 'Physical', 'Network', 'Virtual'],
				datasets: [
					{
                        label:"Low",
						backgroundColor: 'rgb(201, 203, 207)',
						pointBackgroundColor: 'white',
						borderWidth: 1,
						pointBorderColor: 'rgb(201, 203, 207)',
						data: [this._software_low, this._physical_low, this._network_low, this._virtual_low, 
                              90, 0, 20, 40, 50, 70, 90, 100]
                        //software[0],physical[1],network[2],virtual[3]
					},
					{
                        label:"Normal",
						backgroundColor: '#36a2eb',
						pointBackgroundColor: 'white',
						borderWidth: 1,
						pointBorderColor: '#36a2eb',
                        borderColor:'rgb(54, 162, 235)',
						data: [this._software_med, this._physical_med, this._network_med, this._virtual_med, 
                        90, 0, 20, 40, 50, 70, 90, 100]
					},
                    {
                        label:"High",
						backgroundColor: '#f87979',
						pointBackgroundColor: 'white',
						borderWidth: 1,
						pointBorderColor: '#249EBF',
                        borderColor:'rgb(255, 99, 132)',
						data: [software_high, this._physical_high, this._network_high, this._virtual_high,
                         90, 0, 20, 40, 50, 70, 90, 100],
					}
                ]
              
        }
        return this.renderChart(chart_data, this.options)

    }
    

  },
  mounted () {
    this.assetCount();
    
  }
}
</script>