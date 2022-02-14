<template>
<div>

    <div class="nav-background is-page">
        <div class="page-header-container is-6">
            <div class="columns has-text-white">
                <div class="column" style="padding-left:20px;">
                    <table>
                        <tr>
                            <td style="padding:10px 10px 0px 30px;"><feather type="flag" size="30" class="m-r-15" style="margin-bottom: -8px"></feather></td>
                            <td><span class="is-size-5" style="font-weight: bold">Advisory Generator</span>
                                <i class="is-size-7" style="display: block; margin-top: -3px;">Generate advisories using ready-made templates</i></td>
                        </tr>
                    </table>
                </div>
                <div class="column">
                    <div class="buttons are-small is-pulled-right m-t-10">
                        <b-field grouped>

                            <!-- <b-field>
                                <p class="control">
                                    <b-dropdown position="is-bottom-left">
                                        <button class="button is-success" slot="trigger">
                                            <span> Client : &nbsp;</span>
                                            <span> EDC </span>
                                            <feather class="icon" type="chevron-down" size="20"></feather>
                                        </button>
                                        <b-dropdown-item @click="active_client = 'EDC'">EDC</b-dropdown-item>
                                        <b-dropdown-item @click="active_client = 'UBP'">UBP</b-dropdown-item>
                                        <b-dropdown-item @click="active_client = 'FPH'">FPH</b-dropdown-item>
                                    </b-dropdown>
                                </p>
                            </b-field> -->

                        </b-field>
                    </div>
                </div>
            </div>
        </div>
    </div>

<div class="container">
    <router-view name="advisoryContent"
        ref="advisoryContent"
        :isBusy="isBusy"
        @setBusy="setBusy"
        @canDo="canDo"
        @hasRole="hasRole"
        @openAdvisoryForm="openAdvisoryForm"
        :scheduled="scheduled"
        :outages="outages"
        @fetchOutages="fetchOutages"
        @fetchScheduled="fetchScheduled"
        @viewAdvisory="viewAdvisory"></router-view>
    <b-loading :is-full-page="false" style="min-height: 350px" :active.sync="isBusy" :can-cancel="false"></b-loading>
</div>
</div>

</template>



 <script>

import http from '../../http_common';

import OutageInitialForm from '../forms/advisory/outage/Initial'
import OutageUpdateForm from '../forms/advisory/outage/Update'
import OutageRestorationForm from '../forms/advisory/outage/Restoration'

import ScheduledInitialForm from '../forms/advisory/scheduled/Initial'
import ScheduledCancellationForm from '../forms/advisory/scheduled/Cancellation'
import ScheduledCompletionForm from '../forms/advisory/scheduled/Completion'
import ViewAdvisoryModal from '../modals/ViewAdvisory'


    export default {
        props: ['currentPath', 'user'],
        data() {
            return {
                isBusy: true,
                active_client: 'EDC',
                forms: {
                    scheduled: {
                        initial: ScheduledInitialForm,
                        cancellation: ScheduledCancellationForm,
                        completion: ScheduledCompletionForm
                    },
                    outage: {
                        initial: OutageInitialForm,
                        update: OutageUpdateForm,
                        completion: OutageRestorationForm
                    }
                },
                titles: {
                    scheduled: {
                        initial: 'Scheduled Activity',
                        update: 'Scheduled Activity Update',
                        completion: 'Completion Notification',
                        cancellation: 'Scheduled Activity Cancellation',
                    },
                    outage: {
                        initial: 'Service Outage Advisory',
                        update: 'Service Outage Update',
                        completion: 'Service Restoration Advisory'
                    }
                },
                locations: [],
                outages: [],
                scheduled: []
            }
        },
        created() {
            this.fetchLocations()
        },
        computed: {
        },
        methods: {
            fetchLocations() {
                http.get('/advisories/locations')
                .then(response => {
                    this.locations = response.data.rows.filter((row)=> {
                        return row.client_id == 7
                    })
        
                    this.isBusy = false;
                });
            },
            fetchOutages() {
                http.get('/advisories/list/outage')
                .then(response => {
                    var outage = [];
                    for (let i in response.data){
                        delete response.data[i].id
                        outage.push(response.data[i])
                        
                    }
                    this.outages = outage;
                    this.isBusy = false;
                });
            },
            fetchScheduled() {
                http.get('/advisories/list/scheduled')
                .then(response => {
                    var schedule = [];
                    for (let i in response.data){
                        delete response.data[i].id
                        schedule.push(response.data[i])
                        
                    }
                    this.scheduled = schedule;
                    this.isBusy = false;
                });
            },
            openAdvisoryForm(ad) {
                var category = ad[0]
                var type = ad[1]
                //console.log(this.locations)
                this.$buefy.modal.open({
                    
                    parent: this,
                    component: this.forms[category][type],
                    hasModalCard: true,
                    props: {
                        batch_id: ad[2],
                        active_client: this.active_client,
                        category: category,
                        title: this.titles[category][type],
                        type: type,
                        locations: this.locations,
                        initial_data: ad[3]
                    },
                    canCancel: ['x'],
                    customClass: 'custom-class custom-class-2',
                    onCancel: function () {
                        //console.log('cancel')
                    },
                    events: {
                        'refresh': (value) => {
                            value;
                            if(category == 'scheduled') {
                                this.fetchScheduled()
                            }else{
                                this.fetchOutages()
                            }
                        }
                    }
                })
            },
            viewAdvisory(data) {
                this.$buefy.modal.open({
                    parent: this,
                    component: ViewAdvisoryModal,
                    hasModalCard: false,
                    props: {
                        data: data
                    },
                    canCancel: ['x'],
                    customClass: 'custom-class custom-class-2',
                    onCancel: function () {

                    },
                    events: {
                        'refresh': (value) => {
                            value;

                        }
                    }
                })
            },
            setBusy(val) {
                this.isBusy = val;
            },
            canDo(val) {
                return this.$parent.canDo(val);
            },
            hasRole(val) {
                return this.$parent.hasRole(val);
            }
        }
    }
</script>

<style scoped>
.nav-background {
  background-color: #003944;
  z-index: -1;
  -webkit-transition: all 200ms ease-in;
  transition: all 200ms ease-in;
  margin: -60px -30px -30px -30px;
}

.nav-background.is-dashboard {
  height: 150px;
}

.nav-background.is-dashboard ~ .container {
  margin-top: -80px;
}

.nav-background.is-dashboard .page-header-container {
  padding: 50px 30px 10px 30px;
  height: 50px;
}

.nav-background.is-page {
  height: 120px;
  margin-bottom: 30px;
}

.nav-background.is-page .page-header-container {
  padding: 55px 30px 10px 30px;
  height: 120px;
}
</style>