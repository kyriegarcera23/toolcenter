<template>
<div class="modal-card advisory-form" style="overflow: visible; width: 970px; height: calc(100vh - 40px); max-height: 785px">
    <header class="modal-card-head has-background-dark">
        <p class="modal-card-title has-text-white is-uppercase" style="font-weight: 700; font-size: 0.75rem;letter-spacing: 2px;">{{ title }}: {{ active_client }}</p>
    </header>
    
    <section style="padding-top:10px; padding-top:10px;" class="modal-card-body" @submit.prevent="test()">
        <b-steps
            ref="steps"
            size="is-small"
            v-model="activeStep"
            :animated="isAnimated"
            :has-navigation="hasNavigation"
            :icon-prev="prevIcon"
            :icon-next="nextIcon">
            <b-step-item label="Details" :clickable="isStepsClickable">

   
                <div class="columns m-t-20">
                    <div class="column is-8 is-offset-2">
                        <p class="menu-label p-b-10" style="border-bottom: 1px solid #dadada">HEADER</p>
                        <form ref="form0" class="formStyle"  @submit.prevent="checkValid('form0')"> 
                        <b-field horizontal label="Advisory Activity" :label-position="labelPosition" custom-class="is-small">
                            <b-field>
                                <b-radio-button required v-model="header.b" size="is-small" type="is-dark" 
                                    native-value="Network" @click.native="checkTypeChanged('Network')">
                                    Network
                                </b-radio-button>
                                <b-radio-button required v-model="header.b" size="is-small" type="is-dark" 
                                    native-value="Telco" @click.native="checkTypeChanged('Telco')">
                                    Telco
                                </b-radio-button>
                                <b-radio-button required v-model="header.b" size="is-small" type="is-dark" 
                                    native-value="Power Maintenance" @click.native="checkTypeChanged('Power Maintenance')">
                                    Power Maintenance 
                                </b-radio-button>
                            </b-field>
                        </b-field>

                        <b-field horizontal label="Affected Site" :label-position="labelPosition" expanded custom-class="is-small" class="site-field-group">

                            <div class="control" style="width: 150px;">
                                <b-autocomplete v-if="header.b"
                                    size="is-small"
                                    custom-class="is-small"
                                    v-model="location"
                                    ref="location_autocomplete"
                                    :data="locations"
                                    :open-on-focus="true"
                                    placeholder="Select a Location"
                                    :clearable="true"
                                    field="name"
                                    required
                                    @input="locationChanged"
                                    @select="option => { selected = option;
                                    location_id = option ? option.id : null;
                                     filteredSites = option ? option.site : [] }">
                                    <template slot-scope="props">
                                        <span class="is-size-7">{{ props.option.name }}</span>
                                    </template>
                                    <template slot="empty">No location for this keyword</template>
                                </b-autocomplete> 
                                <span v-else class="is-italic is-size-7 has-text-danger">Select advisory activity</span>
                            </div>
                            <b-autocomplete v-if="location"
                                size="is-small"
                                custom-class="is-small"
                                v-model="site"
                                ref="location_autocomplete"
                                :data="filteredSites"
                                :open-on-focus="true"
                                placeholder="Select Site..."
                                :clearable="true"
                                field="name"
                                required
                                @input="siteChanged"
                                @select="option => { 
                                    selected = option; 
                                    site_id = option ? option.id : null;
                                }">
                                <template slot-scope="props">
                                    <span class="is-size-7">{{ props.option.name }}</span>
                                </template>
                                <template slot="empty">No sites for this keyword</template>
                            </b-autocomplete> 
                            <span v-else class="is-italic is-size-7 has-text-danger">Select location first</span>
                        </b-field>

                        <b-field horizontal label="Business Impact" custom-class="is-small" class="dropdown-box">
                            <b-dropdown
                                :scrollable="true"
                                :max-height="250"
                                v-if="site"
                                v-model="business_impact"
                                aria-role="list" size="is-small" expanded>
                                <button class="button  is-small" type="button" slot="trigger" slot-scope="{ active }">
                                    <span>{{ business_impact }}</span>
                                    <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
                                </button>

                                <b-dropdown-item class="is-size-7" v-for="(value, index) in business_impacts" :key="index"  aria-role="listitem" :value="value">{{ value }}</b-dropdown-item>
                            </b-dropdown>
                            <span v-else class="is-italic is-size-7 has-text-danger">Select site first</span>
                        </b-field>
                        </form>
                    </div>
                </div>

                <div class="columns m-t-20">
                    <div class="column is-10 is-offset-1">
                        <p class="menu-label p-b-10" style="border-bottom: 1px solid #dadada">ACTIVITY DETAILS</p>
                        <form ref="form1" class="formStyle"  @submit.prevent="checkValid('form1')">
                        <b-field horizontal label="Description"  custom-class="is-small" class="dropdown-box">
                            <b-dropdown  v-if="header.b"
                                :scrollable="true"
                                :max-height="250"
                                
                                v-model="advisory_data.activity_description"
                                aria-role="list" size="is-small" expanded>
                                <button class="button is-small" type="button" slot="trigger" slot-scope="{ active }">
                                    <span>{{ advisory_data.activity_description }}</span>
                                    <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
                                </button>

                                <b-dropdown-item class="is-size-7" v-for="(value, index) in activity_descriptions[header.b]" :key="index"  aria-role="listitem"  :value="value">{{ value }}</b-dropdown-item>
                            </b-dropdown>
                            <span v-else class="is-italic is-size-7 has-text-danger">Select an advisory activity above first</span>
                        </b-field>

                        <b-field horizontal label="Schedule" custom-class="is-small">
                            <span class="is-size-7" v-if="date[0]">{{ advisory_data.schedule.string }}</span>
                            <span v-else class="is-italic is-size-7 has-text-danger">Select a date below to proceed</span>
                        </b-field>

                        <b-field grouped horizontal custom-class="is-small">
                            <b-datepicker range size="is-small" required v-model="date" inline></b-datepicker>
                            
                            <b-field label="START" custom-class="is-small m-t-20 m-b-10 has-text-weight-light">
                                <b-field :label='date[0] ? dateFormat(date[0]) : ""' custom-class="is-small has-text-primary has-text-weight-medium">
                                    <b-timepicker hour-format="12" :default-minutes="0" size="is-small" v-model="date[0]" inline></b-timepicker>
                                </b-field>
                            </b-field>
                            <b-field label="END" custom-class="is-small m-t-20 m-b-10 has-text-weight-light">
                                <b-field  :label='date[1] ? dateFormat(date[1]) : ""' custom-class="is-small has-text-primary has-text-weight-medium">
                                    <b-timepicker hour-format="12" :focusable="false" :default-minutes="0" size="is-small" v-model="date[1]" inline></b-timepicker>
                                </b-field>
                            </b-field>
                            
                        </b-field>
                        
                        <!-- <span  style="margin-left:250px;" class="is-italic is-size-7 has-text-danger">{{invalidTime}}</span> -->
                        <b-field horizontal label="Downtime Duration" custom-class="is-small" class="dropdown-box">                            
                            <b-dropdown v-if="duration.string"
                                :scrollable="true"
                                :max-height="250"
                                required
                                v-model="advisory_data.downtime_duration.string"
                                aria-role="list" size="is-small" expanded>
                                <button class="button is-small" type="button" slot="trigger" slot-scope="{ active }">
                                    <span>{{ advisory_data.downtime_duration.string }}</span>
                                    <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
                                </button>

                                <b-dropdown-item class="is-size-7" v-for="(value, index) in [duration.string,'Degraded internet connectivity during peak hours']" :key="index" aria-role="listitem" :value="value">{{ value }}</b-dropdown-item>
                            </b-dropdown>
                            <span v-else class="is-italic is-size-7 has-text-danger">Start and end time is the same. Please change the end time to determine downtime duration</span>
                        </b-field>


                        <b-field horizontal label="Impact Details" custom-class="is-small">
                            <b-field id="impact">
                                <b-radio v-model="advisory_data.affected_services.description" v-for="(impact, index) in impacts" :key="index"
                                    size="is-small"
                                    class="impact-radio"
                                    required
                                    :native-value="impact">
                                    <span>{{ impact }}</span>
                                </b-radio>
                            </b-field>
                        </b-field>

                        <b-field horizontal custom-class="is-small m-l-10">                            
                            <b-field label="SERVICES :" style="display: inline-block" custom-class="is-small is-text-weight-light" class="column is-paddingless ">
                                <b-checkbox v-for="(value, index) in services" :key="index" v-model="advisory_data.affected_services.services"
                                size="is-small"
                                class="column"
                                required
                                :disabled="!advisory_data.affected_services.description.includes('The following services wil be affected:')"
                                    :native-value="value">
                                    {{ value.split(' ')[0] }}
                                </b-checkbox>
                            </b-field>
                        </b-field>

                        <b-field horizontal custom-class="is-small m-l-40">                            
                            <b-field label="Applications :" id="application" custom-class="is-small is-text-weight-light" class="column is-paddingless ">
                                <b-checkbox v-for="(value, index) in applications" :key="index" v-model="advisory_data.affected_services.applications"
                                size="is-small"
                                required
                                class="column" style="min-width: 30%"
                                :disabled="isApplicationsChecked"
                                    :native-value="value">
                                    {{ value }}
                                </b-checkbox>
                            </b-field>
                        </b-field>
                    </form>  
                    </div>
                </div>      
                
            </b-step-item>

            <b-step-item label="Review" :clickable="isStepsClickable">
                <p class="has-text-centered is-italic is-size-7" style="margin: 0px auto 20px auto;">Please review and confirm all details below</p>
                <div style="height: 0; width: 0;">
                    <new-scheduled-template :data="{ category: category, type: type, header: header, business_impact: business_impact, advisory_data: advisory_data}" :type="type" :title="title"/>
                </div>
            </b-step-item>
        </b-steps>
    </section>
    <footer class="modal-card-foot custom">
        <div class="is-pulled-right">
            
            <button class="button is-dark" type="button" v-show="activeStep > 0" @click="activeStep -= 1">
                <feather :type="prevIcon"></feather>
            </button>
            <button class="button is-dark" type="button" v-show="activeStep < stepsLength" @click="checkValid()">
                <feather :type="nextIcon"></feather>
            </button>
            <b-button type="is-dark" :loading="isBusy" v-show="activeStep == stepsLength" @click="submit">Generate</b-button>
        </div>
    </footer>
</div>
</template>

<script>
import http from '../../../../http_common';
// Import the editor
// import domtoimage from 'dom-to-image'
import newScheduledTemplate from '../../../../components/templates/advisory/New'

export default {
    props: ['active_client', 'category', 'title', 'type', 'locations'],
    components: {
        newScheduledTemplate
    },
    data() {
        return {
            invalidTime:'',
            isBusy: false,
            labelPosition: '',
            activeStep: 0,
            isAnimated: true,
            hasNavigation: false,
            customNavigation: false,
            prevIcon: 'chevron-left',
            nextIcon: 'chevron-right',
            isStepsClickable: true,
            errors: null,
            stepsLength: 1,
            email: {
                recipient: '',
                subject: `[MICTS][UBP][REPORTS & UPDATES][CONFIDENTIAL][LOW] NOC Daily Digest`
            },
            telcos: {
                'Telco Link Down': [
                    'Bayan MPLS',
                    'PLDT MPLS',
                    'Sky Direct',
                    'Globe Direct',
                    'WifiCity',
                    'PLDT Direct',
                ],
                'Voice Link Down': [
                    'Globe Voice Link',
                    'PLDT Voice Link'
                ]
            },
            business_impacts: [
                'Network Services Unavailable',
                'Network Services Degraded',
                'Voice Services Unavailable',
                'Application Inaccessible',
                'No Network Services Affected',
                'No Incoming Trunk Line Calls'
            ],
            activity_descriptions: {
                Telco: ['PLDT Maintenance Activities', 'SKY Maintenance Activities', 'BAYAN Maintenance Activities', 'GLOBE Maintenance Activities', 'WIFICITY Maintenance Activities'],
                Network: ['Network Device Upgrade', 'Network Maintenance', 'Network Infrastructure Migration'],
                "Power Maintenance": ['Power Maintenance']
            },
            impacts: [
                'Network services will be routed to the remaining available link',
                'ESS will be inaccessible',
                'Incoming trunkline calls will be unavailable',
                'No incoming and outgoing calls',
                'No impact on users',
                'The following services wil be affected:',
            ],
            impacts_applications: [],
            activity_results: [
                'Network device upgrade was successful',
                'Power maintenance has been completed',
                'Cabling activity has been completed',
                'Transfer of Telco equipment has been completed',
                'Network infrastructure migration was successful',
                'Application/s is/are now accessible'
            ],
            applications: [
                'Google Application', 'DSP', 'ESS', 'Kissflow', 'LIMS', 'CMMS Printing DocuShare', 'OTRS', 'SAP ECC DEV', 'SAP Fiori QAS', 'EWP', '2x Applications (HRIS, Payroll, etc.)'
            ],
            services: [
                'Internet Services', 'Applications', 'VOIP Services', 'Telepresence Services', 'Printing Services'
            ],
            filteredLocations: this.locations,
            filteredSites: [],
            location: null,
            site: null,
            areas: [],
            business_impact: null,
            header: {
                a: this.title,
                b: null,
                c: []
            },
            advisory_data: {
                affected_site: [null, null, []],
                activity_description: null,
                affected_services: {
                    description: '',
                    services: [],
                    applications: []
                },
                schedule: {
                    start: null,
                    end: null,
                    string: null
                },
                downtime_duration: this.duration || {},
                activity_result: null,
                cancellation_reason: null
            },
            location_id: null,
            site_id: null,
            date: []
        }
    },
    watch: {
        date: {
            deep: true,
            handler: function(newVal, oldVal) {  
                oldVal;
                
                var start = this.$moment(newVal[0]).format('MMMM DD, YYYY'),
                    end = this.$moment(newVal[1]).format('MMMM DD, YYYY'),
                    string;

                if(start != end) {
                    
                    start = this.$moment(newVal[0]).format('MMMM DD, YYYY (h:mm A)')
                    end = this.$moment(newVal[1]).format('MMMM DD, YYYY (h:mm A)')

                    string = `${start} – ${end}`
                }else {
                    var startTime = this.$moment(newVal[0]).format('h:mm A')
                    var endTime = this.$moment(newVal[1]).format('h:mm A')
                    string = `${start} (${startTime} - ${endTime})`
                }

                this.advisory_data.downtime_duration.string = ""
                this.advisory_data.schedule = {
                    start: newVal[0],
                    end: newVal[1],
                    string: string
                }
            }
        }
    },
    created() {
        const date = new Date();
        date;
        //this.date = [date, date];
        this.advisory_data.affected_services.applications = this.applications;
        this.advisory_data.affected_services.services = this.services
        this.filteredLocations = this.locations
    },
    beforeDestroy() {

    },
    computed: {
        duration() {
            
            //var startTime = this.$moment(this.time[0] || this.date).format('h:mm a');
            //var endTime = this.$moment(this.time[1] || this.date).format('h:mm a');
            var start = this.$moment(this.date[0], 'YYYY-MM-DD') // start date
            var end = this.$moment(this.date[this.date.length-1], 'YYYY-MM-DD') //end date
            

            //start = this.$moment(start + ' ' + startTime)
            //end = this.$moment(start + ' ' + endTime)

            var string = ""
            
            var duration = this.$moment.duration(end.diff(start));
            var days = duration.days();
            var hours = duration.hours();
            var minutes = duration.minutes();

            if(days)
                string += days + (days>1 ? ' days ' : ' day ')

            if(hours)
                string += hours + (hours>1 ? ' hours ' : ' hour ')

            if(minutes)
                string += minutes + (minutes>1 ? ' minutes ' : ' minute ')

            

            this.checkHours(hours)

            return {
                
                "days": days,
                "hours": hours,
                "minutes": minutes,
                "string": string
            };

            
        },
        isApplicationsChecked() {
           return !(this.advisory_data.affected_services.services.includes('Applications') && this.advisory_data.affected_services.description.includes('following services'))
        },
    },
    methods: {
        checkValid() {


                 if(!this.$refs.steps.$children[this.activeStep].$el.children[0].children[0].children[1].checkValidity() || this.advisory_data.activity_description == null ||
                 this.advisory_data.schedule.string == null  || this.advisory_data.affected_services.description == '' || this.advisory_data.affected_services.services.length === 0){
                     
                      this.$swal({
                                    toast: true,
                                    position: 'bottom-right',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    icon: 'error',
                                    title:'Please fill out all required fields correctly to proceed...'
                                    });
                         
                
                }else{

                    if(this.date[0] >= this.date[1]){

                                    this.$swal({
                                    toast: true,
                                    position: 'bottom-right',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    icon: 'error',
                                    title:'Invalid time' 
                                    });      
                     }else{

                        if(this.advisory_data.downtime_duration.string == ''){
                                this.$swal({
                                    toast: true,
                                    position: 'bottom-right',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    icon: 'error',
                                    title:'Please fill out all required fields correctly to proceed...'
                                    });
                        }else{

                             if(this.advisory_data.affected_services.services.includes("Applications") && this.advisory_data.affected_services.applications.length === 0 ){
                                this.$swal({
                                            toast: true,
                                            position: 'bottom-right',
                                            showConfirmButton: false,
                                            timer: 3000,
                                            icon: 'error',
                                            title:'Please select one or more application'
                                            });
                                
                            }else{
                                    this.activeStep += 1;
                            }
                        }
                    

                   
                }
            }
            
            
        },
        siteChanged(site) {
            this.advisory_data.affected_site[1] = site
            this.header.c[1] = site
        },
        locationChanged(location) {
            this.site = null
            this.advisory_data.affected_site[0] = location
            this.header.c[0] = location

            if(!location) {
                this.filteredSites = []
            }
        },
        getFilteredLocations(text) {
            this.filteredLocations = this.locations.filter(option => {
                return (
                    option.name.toString().toLowerCase()
                        .indexOf(text.toLowerCase()) >= 0)
            })
        },
        checkTypeChanged(type) {
            if(type != this.header.b) {
                this.advisory_data.activity_description = this.activity_descriptions[type].length == 1 ? this.activity_descriptions[type][0] : null
            }
        },
        dateFormat(date) {
            return this.$moment(date).format('MMMM DD, YYYY');
        },
        submit() {
            this.isBusy = true;
            let that = this;
            
            //console.log(this.location_id, this.site_id)

            if(!this.advisory_data.affected_services.description.includes('following services')) {
                this.advisory_data.affected_services.services = [],
                this.advisory_data.affected_services.applications = []
            }

            const payload = {
                "client_id": 7,
                "category": "scheduled",
                "type": "initial",
                "header": this.header,
                "business_impact": this.business_impact,
                "location_id": this.location_id,
                "site_id": this.site_id,
                "areas": this.areas,
                "advisory_data": this.advisory_data
            }

            //console.log('submit', payload)
            
            http.post('/advisories/add/initial', payload).then(function (response) {
                response;
                that.isBusy = false;

                that.$parent.close();
                that.$emit('refresh');

                that.$buefy.snackbar.open({
                    message: 'Initial notification has been queued for approval!',
                    type: 'is-success',
                    position: 'is-bottom-right'
                })
            }).catch(function (error) {
                let e = error.response.data;

                that.$buefy.dialog.alert({
                    title: 'Oops',
                    message: `${e.message}<br>`,
                    type: 'is-danger',
                    hasIcon: true,
                    icon: 'times-circle',
                    iconPack: 'fa',
                    ariaRole: 'alertdialog',
                    ariaModal: true
                })
                that.isBusy = false;
            });
        },
        checkHours(hours){
            if(hours <= 0){
                // this.invalidTime = '** Invalid Time!! **'
                this.invalidTime = 'invalid';
                // this.$buefy.dialog.alert({
                //                 title: 'Oops',
                //                 message: "Invalid Time",
                //                 type: 'is-danger',
                //                 hasIcon: true,
                //                 icon: 'times-circle',
                //                 iconPack: 'fa',
                //                 ariaRole: 'alertdialog',
                //                 ariaModal: true
                // });
            }else if(hours > 0){
                this.invalidTime = ''
            }else if(hours == 0){
                this.invalidTime = ''
            }
        }
    }
}
</script>

<style lang="scss">

#impact .field.has-addons {
    display: grid !important;
}

#application .field.has-addons {
    display: inline-block !important;
}

.modal-card-body.custom {
  overflow: visible;
}

.modal-card-foot.custom {
  display: block;
}

.modal-card-foot.custom {
    padding: 15px;
}

.advisory-form {
    .field-label {
        min-width: 125px;
    }

    .impact-radio {
        line-height: 2.8;
    }
}

.site-field-group {
    .field-body > .field:first-child {
        flex: none;
    }
}

.small-taginput > .taginput-container{
    min-height: 30px;
}

</style>

<style lang="scss" scoped>
form {
    margin: auto;
    max-width: 650px;
}


.dropdown-box {
    text-align: left;
    div, button {
        width: 350px;

        .icon {
            display: flex;
            flex: auto;
            justify-content: flex-end;
        }
    }
}
</style>

