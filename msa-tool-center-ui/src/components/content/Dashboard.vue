<template>
<div>
    <div class="nav-background is-dashboard" >
        <div class="page-header-container">
            <div class="columns has-text-white">
                <div class="column" style="padding-left:20px;">
                    <table>
                        <tr>
                            <td style="padding:10px 10px 0px 30px;"><feather type="grid" size="30" class="m-r-15" style="margin-bottom: -8px"></feather></td>
                            <td><span class="is-size-5" style="font-weight: bold">Dashboard</span>
                                <i class="is-size-7" style="display: block; margin-top: -3px;">Visually track certificates and assets status</i></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="container">
        <section>
            <div class="columns dashboard-body-container">
                <div class="column is-12">
                    <div class="columns">
                        <div class="column is-4" style="margin: 50px 0px 0px 40px">
                            
                                <div class="box" style="height: 110px; background: linear-gradient(45deg, #42e5db, #5c7ae9); font-weight: 300; color: white;">
                                    <p style="font-size: 14px">ASSETS</p>
                                    <div class="columns is-pulled-left is-size-4 summary-text">
                                        <div class="column is-6">
                                            {{this.asset_total}}
                                            <span class="summary-text-category" style="font-size:14px">TOTAL</span>
                                
                                        </div>

                                        <div class="column">
                                            {{this.asset_request}}
                                            <span class="summary-text-category" style="font-size:14px">REQUEST</span>
                                        </div>

                                        <div class="column is-4" v-if="$parent.canDo('approve-assets')">
                                            {{this.asset_pending}}
                                            <span class="summary-text-category" style="font-size:14px">PENDING</span>
                                        </div>
                                    </div>

                                </div>
                                
                            <div class="box m-t-20">
                                <!-- <div class="" style="height: 200px; width: 100vh; text-align: center; display: table-cell; vertical-align: middle;">
                                    <i>No assets added yet</i>
                                </div> -->
                                <!-- <chart type="horizontalBar" v-else :height="200" :data="assetsChart" :options="assetsChartOptions"></chart> -->
                                <!-- <canvas id="planet-chart"></canvas> -->
                                <!-- <Bar></Bar> -->
                                <assetChart></assetChart>
  
                            </div>


                        </div>
                        <div class="column is-4" style="margin: 50px 0px 0px 40px">
                                    <div class="box" style="height: 110px; background: linear-gradient(45deg, #3ae591, #37b0b5); font-weight: 300; color: white;">
                                    <p style="font-size: 12px;">CERTIFICATES</p>
                                    <div class="columns is-pulled-left is-size-4 summary-text">
                                        <div class="column">
                                            {{this.cert_approved}}
                                            <span class="summary-text-category" style="font-size:14px">APPROVED</span>
                                        </div>
                                        <div class="column">
                                            {{this.cert_request}}
                                            <span class="summary-text-category" style="font-size:14px">REQUEST</span>
                                        </div>
                                        <div class="column is-4" v-if="$parent.canDo('approve-certificates')">
                                            {{this.cert_pending}}
                                            <span class="summary-text-category" style="font-size:14px">PENDING</span>
                                        </div>
                                    </div>
        
                                </div>
                            <div class="box m-t-20">
                                <certChart></certChart>
                            </div>
                        </div>

                        <div class="column is-4" style="margin: 50px 0px 0px 40px">

                            <div class="columns">
                                <div class="column is-6">
                                    <div class="box" style="height: 110px; background: linear-gradient(45deg, #f54c9f, #fe7474 40%); font-weight: 300; color: white;">
                                        <p style="font-size: 12px;">URGENT EXPIRY ALERTS</p>
          
                                        <div class="columns is-pulled-left is-size-4 summary-text">
                                            <div class="column is-6">
                                                {{this.expiry_cert}}
                                                <span class="summary-text-category" style="font-size:14px">CERTIFICATE</span>
                                            </div>
                                            <div class="column is-6">
                                                {{this.expiry_asset}}
                                                <span class="summary-text-category" style="font-size:14px">ASSET</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- <div class="column is-6">
                                    <div class="box" style="height: 110px; background: linear-gradient(45deg, rgb(222 113 189), rgb(138 99 189) 40%); font-weight: 300; color: white;">
                                        <p style="font-size: 12px;">USER LOGINS</p>
                                       
                                        <div class="columns is-pulled-left is-size-4 summary-text">
                                            <div class="column is-12">
                                                 {{this.login_count}}
                                                <span class="summary-text-category" style="font-size:14px">TODAY</span>
                                            </div>
                                        </div>
                                        <div class="circle has-text-white is-pulled-right">
                                            <feather type="user" size="80" style="margin-top: -35px; margin-left: -25px; opacity: 0.3"></feather>
                                        </div>
                                    </div>
                                </div> -->
                            </div>
                                <div class="card" style="border-radius: 10px;">
                                <header class="card-header">
                                    <p class="card-header-title">
                                        User logs
                                    </p>
                                </header>
                                <div class="card-content p-b-0">
                                    <div class="content" style="min-height: 425px">
                                        <div class="" style="height: 350px; width: 100vh; text-align: center; display: table-cell; vertical-align: middle;"
                                        v-if="!data_.length">
                                            <i>You have no activity recorded yet</i>
                                        </div>
                                        <div v-else  v-for="log in data_" v-bind:key="log.id">
                                            <div class="log-icon is-inline" :class="log.event_type">
                                                <account></account>
                                            </div>
                                            
                                            <p class="log-title is-marginless is-inline" style="padding-left:10px"><strong>{{log.name}}</strong></p>
                                            <br>
                                            <p class=" log-title is-marginless is-inline" style="padding-left:35px">{{log.email}}</p>
                                            <br>
                                            <p class=" log-title is-marginless is-inline" style="padding-left:35px">{{$moment(log.createdAt).format('MMM DD, YYYY')}}</p>
                                            
                                            <br>
                                            <br>
                                        </div>
                                        
                                        <b-loading :is-full-page="false" style="min-height: 350px" :can-cancel="false"></b-loading>
                                    </div>
                                </div>
                                <!-- <footer class="card-footer">
                                    <a href="#" class="card-footer-item">View All</a>
                                </footer> -->
                            </div>

                            </div>
                        </div>
    
                    </div>

                </div>
        </section>
    </div>
</div>
</template>


<script>
//import http from '../../http_common';
// import Chart from 'vue-bulma-chartjs'
// import AssetDetails from '../../components/modals/AssetDetails.vue'
// import AssetSoftwareDetails from '../../components/modals/AssetSoftwareDetails.vue'
import assetChart from './charts/Asset.vue'
import certChart from './charts/CertCharts.vue'
import http from '../../http_common';
//import Chart from 'chart.js'

export default {
    data() {
        return {
            asset_total: 0,
            asset_pending: 0,
            asset_request: 0,
            cert_approved: 0,
            cert_pending: 0,
            cert_request: 0,
            expiry_cert:34,
            expiry_asset:0,
            login_count:0,
            data_: []
	}
            
    },
    components: {
        assetChart,
        certChart
        //Bar,
        //BarChart,
        // AssetDetails,
        // AssetSoftwareDetails
    },
    methods:{
        loginCount() {
            var min_date = new Date();
            min_date.setDate(min_date.getDate() - 2);
            let today = new Date().toISOString().slice(0, 10)
            var post_data_date = {
                "from_date": min_date,
                "to_date": today
            }
            http.post('/events/report/login',{post_data_date})
                .then(response => {
                    this.login_count = response.data.user_login.count;
            });
        },
        assetCount() {
            let today = new Date().toISOString().slice(0, 10)
            var post_asset_date = {
                "from_date": "2021-01-01",
                "to_date": today
            }
            http.post('/assets/report',{post_asset_date})
                .then(response => {
                    this.data = response.data;
                    this.asset_total = this.data.total_number_of_asset_approved
                    this.asset_pending = this.data.total_number_of_asset_pending
                    this.asset_request = this.data.total_number_of_asset_request
                    this.expiry_asset = this.data.expiring_assets_software_this_month.count
            });
        },
        certCount() {
            let today = new Date().toISOString().slice(0, 10)
            var post_asset_date = {
                "from_date": "2021-01-01",
                "to_date": today
            }
            http.post('/certificates/report',{post_asset_date})
                .then(response => {
                    this.data = response.data;
                    this.cert_approved = this.data.total_number_of_certificate_approved
                    this.cert_pending = this.data.total_number_of_certificate_pending
                    this.cert_request = this.data.total_number_of_certificate_request
                    //console.log(this.data)
            });
        },
        fetchLogsData() {
            var min_date = new Date();
            min_date.setDate(min_date.getDate() - 2);
            let today = new Date().toISOString().slice(0, 10)
            var post_data_date = {
                "from_date": min_date,
                "to_date": today
            }
            http.post('/events/report/login',{post_data_date})
                .then(response => {
                    var data_logs;
                    data_logs = response.data.user_login.rows;
                    this.data_ = data_logs
            });
        },
    },
    mounted() {
        this.loginCount();
        this.assetCount();
        this.certCount();
        this.fetchLogsData();
    },
}

</script>

<style lang="scss" scoped>

.log-item {
    padding: 10px;
    height: 85px;

    .log-icon {
        padding: 8.5px 10px;
        height: 40px;
        width: 40px;
        border-radius: 100px;
        
        &.Add {
            background-color: rgba(45, 206, 152, 0.3);
            border: 1px solid #2DCE98;
            color: #2DCE98;
        }

        &.Delete {
            background-color: rgba(245, 60, 86, 0.3);
            border: 1px solid #F53C56;
            color: #F53C56;
        }

        &.Update {
            background-color: rgba(254, 185, 105, 0.3);
            border: 1px solid #FEB969;
            color: #FEB969;
        }

        i.feather {
            margin-bottom: -3px;
            margin-left: 1px;
        }
    }

    .log-title {
        color: #8898AA;
        padding-left: 20px;
    }

    .log-time {
        color: #8898AA;
        font-size: 11px;
    }

    .log-description {
        padding-left: 65px;
        padding-top: 5px;
        font-size: 13px;
        color: #172B4D;
    }

    .dashed {
        border-left: 2px dashed #8898AA;
        height: 40px;
        position: absolute;
        margin-left: 20px;
        margin-top: 35px;
    }
}

.strong {
    font-weight: bold;
}

.circle {
    border-radius: 50px;
    height: 50px;
    width: 50px;
    padding: 10px;
    text-align: center;
    display: table-cell;
    vertical-align: middle;

    i.feather {
        margin-bottom: -8px;
    }
}

.summary-text {
    //width: 50px;
    text-align: center;
    margin-left: 5px;
    //margin-top: 10px;
}

.summary-text-category {
    display: block;
    margin-top: -3px;
    font-size: 0.6rem;
}

.dashboard-body-container .card .card-content {
    padding: 20px;
}

.log-item {
    padding: 10px;
    height: 85px;

    .log-icon {
        padding: 8.5px 10px;
        height: 40px;
        width: 40px;
        border-radius: 100px;
        
        &.Add {
            background-color: rgba(45, 206, 152, 0.3);
            border: 1px solid #2DCE98;
            color: #2DCE98;
        }

        &.Delete {
            background-color: rgba(245, 60, 86, 0.3);
            border: 1px solid #F53C56;
            color: #F53C56;
        }

        &.Update {
            background-color: rgba(254, 185, 105, 0.3);
            border: 1px solid #FEB969;
            color: #FEB969;
        }

        i.feather {
            margin-bottom: -3px;
            margin-left: 1px;
        }
    }

    .log-title {
        color: #8898AA;
        padding-left: 20px;
    }

    .log-time {
        color: #8898AA;
        font-size: 11px;
    }

    .log-description {
        padding-left: 65px;
        padding-top: 5px;
        font-size: 13px;
        color: #172B4D;
    }

    .dashed {
        border-left: 2px dashed #8898AA;
        height: 40px;
        position: absolute;
        margin-left: 20px;
        margin-top: 35px;
    }
}

// .tag:first-child {
//     width: 90px;
// }

.cert-legend:nth-child(2) {
    width: 30px;
}

.asset-alert {
    margin-left: 10px;
    font-size: 0.6rem;
}

.log-item:last-child > .dashed {
    display: none;
}
</style>