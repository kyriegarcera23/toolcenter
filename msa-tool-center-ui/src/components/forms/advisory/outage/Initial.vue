<template>
<div class="modal-card advisory-form" style="overflow: visible; width: 970px; height: calc(100vh - 40px); max-height: 785px">
    <header class="modal-card-head has-background-dark">
        <p class="modal-card-title has-text-white is-uppercase" style="font-weight: 700; font-size: 0.75rem;letter-spacing: 2px;">{{ title }}: {{ active_client }}</p>
    </header>
    
    <section class="modal-card-body is-paddingless p-t-20 p-b-20">
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
                        
                        <b-field :label-position="labelPosition"  custom-class="is-small">
                            <b-field style="justify-content: center">
                                <b-radio-button required v-model="header.b" size="is-small" type="is-dark" 
                                    native-value="Telco Link Down" @input="header.c = null">
                                    Telco Link Down
                                </b-radio-button>
                                <b-radio-button required v-model="header.b" size="is-small" type="is-dark" 
                                    native-value="Voice Link Down" @input="header.c = null">
                                    Voice Link Down
                                </b-radio-button>
                                <b-radio-button required v-model="header.b" size="is-small" type="is-dark" 
                                    native-value="Internet, Applications, and Network Services Unavailable" @input="header.c = null">
                                    Internet, Applications, & Network Services Unavailable
                                </b-radio-button>
                            </b-field>
                        </b-field>

                        <b-field horizontal label="Service" custom-class="is-small" class="dropdown-box">
                            <b-dropdown :disabled="header.b == 'Internet, Applications, and Network Services Unavailable'"
                                v-if="header.b"
                                :scrollable="true"
                                :max-height="250"
                                required
                                v-model="header.c"
                                aria-role="list" size="is-small" expanded>
                                <button class="button is-small" type="button" slot="trigger" slot-scope="{ active }">
                                    <span>{{ header.c }}</span>
                                    <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
                                </button>

                                <b-dropdown-item class="is-size-7" v-for="(value, index) in telcos[header.b]" :key="index" aria-role="listitem" :value="value">{{ value }}</b-dropdown-item>
                            </b-dropdown>
                            <span v-else class="is-italic is-size-7 has-text-danger">Select an activity above first</span>
                        </b-field>

                        <b-field horizontal label="Business Impact" custom-class="is-small" class="dropdown-box">
                            <b-dropdown
                                v-if="header.b == 'Internet, Applications, and Network Services Unavailable' ? true : header.c "
                                :scrollable="true"
                                :max-height="250"
                                required
                                v-model="business_impact"
                                aria-role="list" size="is-small" expanded>
                                <button class="button is-small" type="button" slot="trigger" slot-scope="{ active }">
                                    <span>{{ business_impact }}</span>
                                    <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
                                </button>

                                <b-dropdown-item class="is-size-7" v-for="(value, index) in business_impacts" :key="index" aria-role="listitem" :value="value">{{ value }}</b-dropdown-item>
                            </b-dropdown>
                            <span v-else class="is-italic is-size-7 has-text-danger">Select service first</span>
                        </b-field>
                       
                    </div>
                </div>

                <div class="columns m-t-20">
                    <div class="column is-10 is-offset-1">
                        <p class="menu-label p-b-10" style="border-bottom: 1px solid #dadada">SERVICE OUTAGE DETAILS</p>

                        <b-field horizontal label="Affected Site" :label-position="labelPosition" expanded custom-class="is-small" class="site-field-group">

                            <div class="control" style="width: 150px;">
                                <b-autocomplete v-if="business_impact"
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
                                <span v-else class="is-italic is-size-7 has-text-danger">Select business impact first</span>
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
                                @input="siteChanged"
                                @select="option => { 
                                    selected = option; 
                                    site_id = option ? option.id : null;
                                    getAreas(option != null ? option.id : null)
                                }">
                                <template slot-scope="props">
                                    <span class="is-size-7">{{ props.option.name }}</span>
                                </template>
                                <template slot="empty">No sites for this keyword</template>
                            </b-autocomplete> 
                            <span v-else class="is-italic is-size-7 has-text-danger">Select location first</span>
                        </b-field>

                        <b-field horizontal :label-position="labelPosition" expanded custom-class="is-small">
                            <b-taginput
                                size="is-small"
                                v-model="areas"
                                :data="filteredAreas.filter(l => !areas.some(s => s.name.includes(l.name)))"
                                autocomplete
                                :open-on-focus="true"
                                field="name"
                                icon="label"
                                placeholder="Area"
                                @typing="getFilteredAreas"
                                @add="addArea"
                                @remove="removeArea">
                                <template slot-scope="props">
                                    <span class="is-size-7">{{ props.option.name }}</span>
                                </template>
                                <template slot="empty">
                                    <span class="is-size-7">No available areas</span>
                                </template>
                            </b-taginput>
                        </b-field>

                        <b-field horizontal label="Reported On" custom-class="is-small">
                            <span class="is-size-7" v-if="advisory_data.schedule.start">{{ $moment(advisory_data.schedule.start).format('MMMM D, YYYY (h:mm A)') }}</span>
                            <span v-else class="is-italic is-size-7 has-text-danger">Select a date below to proceed</span>
                        </b-field>

                        <b-field grouped horizontal custom-class="is-small">
                            <b-datepicker size="is-small" v-model="advisory_data.schedule.start" inline></b-datepicker>
    
                            <b-field label="TIME" custom-class="is-small m-t-20 m-b-10 has-text-weight-light">
                                <b-timepicker hour-format="12" :default-minutes="0" size="is-small" v-model="advisory_data.schedule.start" inline></b-timepicker>
                            </b-field>
                        </b-field>

                        <b-field horizontal label="Affected Services" custom-class="is-small">
                            <b-field id="affected">
                                <b-radio v-model="advisory_data.affected_services.description" v-for="(impact, index) in impacts" :key="index"
                                    size="is-small"
                                    class="impact-radio"
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
                                class="column" style="min-width: 30%"
                                :disabled="isApplicationsChecked"
                                    :native-value="value">
                                    {{ value }}
                                </b-checkbox>
                            </b-field>
                        </b-field>
                        
                    </div>
                </div>

                <div class="columns m-t-20">
                    <div class="column is-10 is-offset-1">
                        <p class="menu-label p-b-10" style="border-bottom: 1px solid #dadada">ACTIONS TAKEN</p>
                        
                        <b-field horizontal label="Telco Related" custom-class="is-small is-text-weight-light">                            
                            <b-field custom-class="is-small" id="application" class="column is-paddingless actions-checkbox p-t-5">
                                <b-checkbox v-for="(value, index) in actions.telco" :key="index" v-model="advisory_data.actions_taken"
                                size="is-small"
                                    :native-value="value">
                                    {{ value }}
                                </b-checkbox>
                            </b-field>
                        </b-field>

                        <b-field horizontal label="Power Related" custom-class="is-small is-text-weight-light">                            
                            <b-field custom-class="is-small" id="application" class="column is-paddingless actions-checkbox p-t-5">
                                <b-checkbox v-for="(value, index) in actions.power" :key="index" v-model="advisory_data.actions_taken"
                                size="is-small"
                                    :native-value="value">
                                    {{ value }}
                                </b-checkbox>
                            </b-field>
                        </b-field>

                        <b-field horizontal label="Network Device" custom-class="is-small is-text-weight-light">                            
                            <b-field custom-class="is-small" id="application" class="column is-paddingless actions-checkbox p-t-5">
                                <b-checkbox v-for="(value, index) in actions.network_device" :key="index" v-model="advisory_data.actions_taken"
                                size="is-small"
                                    :native-value="value">
                                    {{ value }}
                                </b-checkbox>
                            </b-field>
                        </b-field>

                        <b-field horizontal label="Voice Link Related" custom-class="is-small is-text-weight-light">                            
                            <b-field custom-class="is-small" id="application" class="column is-paddingless actions-checkbox p-t-5">
                                <b-checkbox v-for="(value, index) in actions.voice_link" :key="index" v-model="advisory_data.actions_taken"
                                size="is-small"
                                    :native-value="value">
                                    {{ value }}
                                </b-checkbox>
                            </b-field>
                        </b-field>
                    </div>
                </div>
                
            </b-step-item>

            <b-step-item label="Review" :clickable="isStepsClickable">
                <p class="has-text-centered is-italic is-size-7" style="margin: 0px auto 20px auto;">Please review and confirm all details below</p>
                <div style="height: 0; width: 0;" v-if="activeStep == 1">
                    <new-scheduled-template :data="{ category: category, header: header, business_impact: business_impact, location: location, site: site, areas: areas, advisory_data: advisory_data}" :title="title" :type="type"/>
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
import newScheduledTemplate from '../../../../components/templates/advisory/New'

export default {
    props: ['active_client', 'category', 'title', 'type', 'locations'],
    components: {
        newScheduledTemplate
    },
    data() {
        return {
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
            impacts: [
                'Network services will be routed to the remaining available link',
                'ESS will be inaccessible',
                'Incoming trunkline calls will be unavailable',
                'No incoming and outgoing calls',
                'No impact on users',
                'The following services wil be affected:',
            ],
            applications: [
                'Google Application', 
                'DSP', 
                'ESS', 
                'Kissflow', 
                'LIMS', 
                'CMMS Printing DocuShare', 
                'OTRS', 
                'SAP ECC DEV', 
                'SAP Fiori QAS', 
                'EWP', 
                '2x Applications (HRIS, Payroll, etc.)'
            ],
            services: [
                'Internet Services', 
                'Applications', 
                'VOIP Services', 
                'Telepresence Services', 
                'Printing Services'
            ],
            actions: {
                telco: [
                    'Coordinated with Trends onsite engineer and facilities management, and determined the cause of outage.',
                    'Ongoing coordination with Trends onsite engineer and facilities management for checking and to determine the cause of outage',
                    'Reported to Telco for checking and immediate restoration',
                    'Reported to Telco and Redlink for checking and immediate restoration',
                    'Ongoing coordination with Telco for immediate restoration and to determine the cause of outage',
                    'Network services are routed to remaining available link',
                    'Coordinated with Telco for immediate restoration and to determine the cause of the outage',
                    'Device was monitored up prior to onsite checking',
                    'Per Telco, no adjustments were made from their end',
                    'Requested access pass for Trends onsite engineer to check the device',
                    "Ongoing request for Trends onsite engineer's access pass to check the status of the devices",
                    "Requested access pass for Telco field engineer to check the device",
                    "Ongoing request for Telco field engineer's access pass to check the status of the devices",
                    "Requested an update from Telco regarding the link's status",
                    "Re-spliced affected Fiber Optic Cable"
                ],
                power: [
                    "Coordinated with Trends onsite engineer and facilities management, and determined the cause of outage.",
                    "Ongoing coordination with Trends onsite engineer and facilities management for checking and to determine the cause of outage",
                    "Confirmed with site contact that the area/s is/are not affected by power outage",
                    "Confirmed with site contact that the area/s is/are affected by power outage",
                    "Ongoing coordination with site contact if the area/s is/are affected by power outage",
                    "Confirmed with 3rd party that the area/s is/are not affected by power outage",
                    "Confirmed with 3rdparty that the area/s is/are affected by power outage",
                    "Ongoing coordination with 3rd party if the area/s is/are affected by power outage",
                    "Requested access pass for Trends onsite engineer to check the device",
                    "Ongoing request for Trends onsite engineer's access pass to check the status of the devices"
                ],
                network_device: [
                    "Coordinated with Trends onsite engineer and facilities management, and determined the cause of outage.",
                    "Ongoing coordination with Trends onsite engineer and facilities management for checking and to determine the cause of outage",
                    "Device was monitored unstable",
                    "Device was monitored up prior to onsite checking",
                    "Device was rebooted",
                    "Requested access pass for Trends onsite engineer to check the device",
                    "Ongoing request for Trends onsite engineer's access pass to check the status of the devices",
                ],
                voice_link: [
                    "Coordinated with Trends onsite engineer and facilities management, and determined the cause of outage.",
                    "Ongoing coordination with Trends onsite engineer and facilities management for checking and to determine the cause of outage",
                    "Coordinated with Telco for immediate restoration and to determine the cause of the outage",
                    "Requested access pass for Trends onsite engineer to check the device",
                    "Ongoing request for Trends onsite engineer's access pass to check the status of the devices",
                    "Requested access pass for Telco field engineer to check the device",
                    "Ongoing request for Telco field engineer's access pass to check the status of the devices",
                    "Re-spliced affected Fiber Optic Cable",
                    "Requested an update from Telco regarding the link's status"
                ]
            },
            filteredLocations: this.locations,
            filteredSites: [],
            filteredAreas: [],
            location: null,
            site: null,
            areas: [],
            business_impact: null,
            header: {
                a: this.title,
                b: null,
                c: null
            },
            advisory_data: {
                affected_site: [null, null, []],
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
                interruption_duration: this.duration || {},
                root_cause: null,
                actions_taken: []
            },
            location_id: null,
            site_id: null
        }
    },
    watch: {
        
    },
    created() {
        const date = new Date();
        this.advisory_data.schedule.start = date;
        this.advisory_data.affected_services.applications = this.applications;
        this.advisory_data.affected_services.services = this.services
        this.filteredLocations = this.locations
    },
    beforeDestroy() {

    },
    computed: {
        isApplicationsChecked() {
           return !(this.advisory_data.affected_services.services.includes('Applications') && this.advisory_data.affected_services.description.includes('following services'))
        },
    },
    methods: {
        checkValid() {
                // console.log()
                // console.log(this.advisory_data.actions_taken)
                // let haystack = ["12345", "hello", "world"];
                // let needle = ["world", "banana"];

                // let result = needle.some(i => haystack.includes(i));
                 if(this.header.b == null || this.business_impact == null || this.location == null || this.advisory_data.affected_services.description.length == 0 || this.advisory_data.affected_services.services.length === 0){
                
                      this.$swal({
                                    toast: true,
                                    position: 'bottom-right',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    icon: 'error',
                                    title:'Please fill out all required fields correctly to proceed...'
                                    });
                         
                
                }else{

                    if(this.header.b  == 'Internet, Applications, and Network Services Unavailable'){
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
                                    // this.activeStep += 1;
                                    // if(this.actions.telco.some(t => this.advisory_data.actions_taken.includes(t)) && 
                                    // this.actions.power.some(p => this.advisory_data.actions_taken.includes(p)) &&
                                    // this.actions.network_device.some(n => this.advisory_data.actions_taken.includes(n)) && 
                                    // this.actions.voice_link.some(v => this.advisory_data.actions_taken.includes(v))){
                                    if(this.advisory_data.actions_taken.length === 0){
                                        
                                        this.$swal({
                                            toast: true,
                                            position: 'bottom-right',
                                            showConfirmButton: false,
                                            timer: 3000,
                                            icon: 'error',
                                            title:'Please choose one or more per category'
                                            });
                                    }else{
                                        this.activeStep += 1;
                                    } 
                                }
                      
                    }else{
                        if(this.header.c == null){
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
                                    if(this.advisory_data.actions_taken.length === 0){
                                        
                                        this.$swal({
                                            toast: true,
                                            position: 'bottom-right',
                                            showConfirmButton: false,
                                            timer: 3000,
                                            icon: 'error',
                                            title:'Please choose one or more per category'
                                            });
                                    }else{
                                        this.activeStep += 1;
                                    } 
                                    // if(this.actions.telco.some(t => this.advisory_data.actions_taken.includes(t)) && 
                                    // this.actions.power.some(p => this.advisory_data.actions_taken.includes(p)) &&
                                    // this.actions.network_device.some(n => this.advisory_data.actions_taken.includes(n)) && 
                                    // this.actions.voice_link.some(v => this.advisory_data.actions_taken.includes(v))){
                                    //     this.activeStep += 1;
                                    // }else{
                                    //     this.$swal({
                                    //         toast: true,
                                    //         position: 'bottom-right',
                                    //         showConfirmButton: false,
                                    //         timer: 3000,
                                    //         icon: 'error',
                                    //         title:'Please choose one or more per category'
                                    //         });
                                    // } 
                                }
                        }
                    }
        
                    
                }

            
            
        },
        getAreas(site_id) {
            
            if(site_id) {
                http.get('/advisories/areas/')
                .then(response => {
                    this.filteredAreas = response.data.rows.filter((row)=> {
                        return row.site_id == site_id
                    })
                });
            }
        },
        siteChanged(site) {
            this.areas = []
            this.advisory_data.affected_site[2] = []
            this.advisory_data.affected_site[1] = site

            if(!site) {
                this.filteredAreas = []
            }
        },
        locationChanged(location) {
            this.areas = []
            this.site = null
            this.advisory_data.affected_site[2] = []
            this.advisory_data.affected_site[0] = location

            if(!location) {
                this.filteredSites = []
                this.filteredAreas = []
            }
        },
        addArea(item) {
            this.advisory_data.affected_site[2].push(item.name)
        },
        removeArea(item) {
            this.advisory_data.affected_site[2] = this.areas.filter(area => area != item.name)
        },
        getFilteredAreas(text) {
            this.filteredAreas = this.areas.filter(option => {
                return (
                    option.name.toString().toLowerCase()
                        .indexOf(text.toLowerCase()) >= 0)
            })
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
                "category": "outage",
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
        }
    }
}
</script>

<style lang="scss">
#affected .field.has-addons {
    display: grid !important;
}

#application .field.has-addons {
    display: inline-block !important;
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