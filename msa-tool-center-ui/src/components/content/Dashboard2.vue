<template>
<div>
<div class="columns">
    <div class="column">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">
              Select Reports
            </p>
          </header>
            <div class="box">
              <draggable :list="arrSelection" group="tasks" :invertSwap="true" :invertedSwapThreshold="0.4" :animation="300">
                
                    <span v-for="element in arrSelection" :key="element.name">
                      
                      <span class="tag is-success is-large" style="margin:0px 5px 5px 0px;" >{{element.name}}</span>
                    </span>
                
              </draggable>
            </div>
        </div>
    </div>
</div>

<div class="columns">
    <div class="column">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            Drop Here
          </p>
        </header>
        <div class="box">
          <draggable  :list="arrInProgress" group="tasks" :invertSwap="true" :invertedSwapThreshold="0.4" :animation="300">
            <div v-for="element in arrInProgress" :key="element.name">
              <div v-if="element.name == 'Asset Inventory'">
                <div class="is-pulled-right m-b-10">
                    <b-input placeholder="Search..."
                        type="search"
                        icon="magnify"
                      >
                    </b-input>
                  </div>
                  <br>
                  <br>
                <p v-for="asset in assets" :key="asset.name">{{asset.name}}
                      <GChart 
                      type="ColumnChart"
                      :data="chartData"
                      :options="chartOptions"
                    />
                    </p>
                
              </div>

            <div v-if="element.name == 'Daily Digest'">
              <p v-for="dg in dailydigest" :key="dg.name">{{dg.name}} 
                <GChart 
                type="ColumnChart"
                :data="chartData"
                :options="chartOptions"
              />
                  </p>
            </div>
              
            </div>
          </draggable>
        </div>
      </div>
    </div>
</div>


</div>

</template>


<script>
import draggable from 'vuedraggable';
import { GChart } from 'vue-google-charts'
export default {
  components: {
 
   draggable,
    GChart
  },
  data() {
    return {
      newTask: "",
      assets:[
        {name: "Pysical Reports"},
        {name: "Software Reports"},
        {name: "Virtual Reports"},
        {name: "Network Reports"},
      ],
      dailydigest:[
        {name: "EWB Reports"},
        {name: "IL Reports"},
        {name: "BOC Reports"},
        {name: "UBP Reports"},
        {name: "DBP Reports"},
      ],
      arrSelection: [
        {name: "Asset Inventory"},
        {name: "Daily Digest"},
        {name: "Advisory Generator"},
        {name: "Cert Monitoring"},
        {name: "Knowledge Base"},
        {name: "SharePoint Group"},
        {name: "Client Management"},
      ],
      arrInProgress:[],
      arrTested:[],
      arrDone:[],
      chartData: [
        ['Year', 'Sales', 'Expenses', 'Profit'],
        ['2014', 1000, 400, 200],
        ['2015', 1170, 460, 250],
        ['2016', 660, 1120, 300],
        ['2017', 1030, 540, 350]
      ],
      chartOptions: {
        chart: {
          title: 'Company Performance',
          subtitle: 'Sales, Expenses, and Profit: 2014-2017',
        }
      },
    }
    
  },
  methods:{
    add(){
      if(this.newTask){
        this.arrBackLog.push({name: this.newTask});
        this.newTask ="";
      }
    }

  } 
}
</script>


<style>
.flex {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
}

.item {
  position: relative;
  margin-right: 55px;
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 350px;
  max-width: 350px;
  min-height: 350px;
}

.file {
  background-color: rgb(160, 156, 156);
}
</style>
