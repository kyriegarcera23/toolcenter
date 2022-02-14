<template>
  <div>
    <canvas id="planet-chart"></canvas>
  </div>
</template>

<script>
import data from '../../components/content/datachart.js'
import Chart from 'chart.js'

export default {
    data (){
        return{
            data:data
        }
    },
    mounted() {
    const ctx = document.getElementById('planet-chart');
    //console.log(this.data)
    new Chart(ctx, this.data);
  }
}
</script>