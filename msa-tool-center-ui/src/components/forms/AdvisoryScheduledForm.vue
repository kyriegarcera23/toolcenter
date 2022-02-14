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

                
                <section v-if="category == 'scheduled'">
                    <div class="columns m-t-20">
                        <div class="column is-8 is-offset-2">
                            <p class="menu-label p-b-10" style="border-bottom: 1px solid #dadada">HEADER</p>
                            <b-field horizontal label="Activity" :label-position="labelPosition" custom-class="is-small">
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
                                    <b-autocomplete
                                        size="is-small"
                                        custom-class="is-small"
                                        v-model="location"
                                        ref="location_autocomplete"
                                        :data="filteredLocations"
                                        :open-on-focus="true"
                                        placeholder="Select a Location"
                                        :clearable="true"
                                        field="name"
                                        @select="option => { selected = option }">
                                        <template slot-scope="props">
                                            <span class="is-size-7">{{ props.option.name }}</span>
                                        </template>
                                        <template slot="empty">No results for {{header.c}}</template>
                                    </b-autocomplete> 
                                </div>
                                <b-taginput
                                    style="width: 100%; min-height: 30px;"
                                    class="small-taginput"
                                    size="is-small"
                                    v-model="sites"
                                    :data="filteredLocations.filter(l => !sites.some(s => s.name.includes(l.name)))"
                                    autocomplete
                                    :open-on-focus="true"
                                    field="name"
                                    icon="label"
                                    placeholder="Site"
                                    @typing="getFilteredLocations"
                                    @add="addSite"
                                    @remove="removeSite">
                                    <template slot-scope="props">
                                        <span class="is-size-7">{{ props.option.name }}</span>
                                    </template>
                                    <template slot="empty">
                                        <span class="is-size-7">No site locations found with this keyword</span>
                                    </template>
                                </b-taginput>
                            </b-field>

                            <b-field horizontal label="Business Impact" custom-class="is-small" class="dropdown-box">
                                <b-dropdown
                                    :scrollable="true"
                                    :max-height="250"
                                    v-model="business_impact"
                                    aria-role="list" size="is-small" expanded>
                                    <button class="button is-ghost is-small" type="button" slot="trigger" slot-scope="{ active }">
                                        <span>{{ business_impact }}</span>
                                        <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
                                    </button>

                                    <b-dropdown-item class="is-size-7" v-for="(value, index) in business_impacts" :key="index" aria-role="listitem" :value="value">{{ value }}</b-dropdown-item>
                                </b-dropdown>
                            </b-field>
                        </div>
                    </div>

                    <div class="columns m-t-20">
                        <div class="column is-10 is-offset-1">
                            <p class="menu-label p-b-10" style="border-bottom: 1px solid #dadada">ACTIVITY DETAILS</p>

                            <b-field horizontal label="Description" custom-class="is-small" class="dropdown-box">
                                <b-dropdown v-if="header.b"
                                    :scrollable="true"
                                    :max-height="250"
                                    v-model="advisory_data.activity_description"
                                    aria-role="list" size="is-small" expanded>
                                    <button class="button is-ghost is-small" type="button" slot="trigger" slot-scope="{ active }">
                                        <span>{{ advisory_data.activity_description }}</span>
                                        <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
                                    </button>

                                    <b-dropdown-item class="is-size-7" v-for="(value, index) in activity_descriptions[header.b]" :key="index" aria-role="listitem" :value="value">{{ value }}</b-dropdown-item>
                                </b-dropdown>
                                <span v-else class="is-italic is-size-7 has-text-danger">Select an activity type first</span>
                            </b-field>

                            <b-field horizontal label="Result" custom-class="is-small" class="dropdown-box" v-if="type == 'completion'">
                                <b-dropdown
                                    :scrollable="true"
                                    :max-height="250"
                                    v-model="advisory_data.activity_result"
                                    aria-role="list" size="is-small" expanded>
                                    <button class="button is-ghost is-small" type="button" slot="trigger" slot-scope="{ active }">
                                        <span>{{ advisory_data.activity_result }}</span>
                                        <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
                                    </button>

                                    <b-dropdown-item class="is-size-7" v-for="(value, index) in activity_results" :key="index" aria-role="listitem" :value="value">{{ value }}</b-dropdown-item>
                                </b-dropdown>
                            </b-field>

                            <b-field horizontal label="Schedule" custom-class="is-small">
                                <span class="is-size-7" v-if="date[0]">{{ advisory_data.schedule.string }}</span>
                                <span v-else class="is-italic is-size-7 has-text-danger">Select a date below to proceed</span>
                            </b-field>

                            <b-field grouped horizontal custom-class="is-small">
                                <b-datepicker range size="is-small" v-model="date" inline></b-datepicker>
        
                                <b-field label="START" custom-class="is-small m-t-20 m-b-10 has-text-weight-light">
                                    <b-field :label='date[0] ? dateFormat(date[0]) : ""' custom-class="is-small has-text-primary has-text-weight-medium">
                                        <b-timepicker hour-format="12" :default-minutes="0" size="is-small" v-model="date[0]" inline></b-timepicker>
                                    </b-field>
                                </b-field>
                                <b-field label="END" custom-class="is-small m-t-20 m-b-10 has-text-weight-light">
                                    <b-field :label='date[1] ? dateFormat(date[1]) : ""' custom-class="is-small has-text-primary has-text-weight-medium">
                                        <b-timepicker hour-format="12" :focusable="false" :default-minutes="0" size="is-small" v-model="date[1]" inline></b-timepicker>
                                    </b-field>
                                </b-field>
                            </b-field>

                            <b-field horizontal label="Downtime Duration" custom-class="is-small" class="dropdown-box">                            
                                <b-dropdown v-if="duration.string"
                                    :scrollable="true"
                                    :max-height="250"
                                    v-model="advisory_data.downtime_duration.string"
                                    aria-role="list" size="is-small" expanded>
                                    <button class="button is-ghost is-small" type="button" slot="trigger" slot-scope="{ active }">
                                        <span>{{ advisory_data.downtime_duration.string }}</span>
                                        <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
                                    </button>

                                    <b-dropdown-item class="is-size-7" v-for="(value, index) in [duration.string,'Degraded internet connectivity during peak hours']" :key="index" aria-role="listitem" :value="value">{{ value }}</b-dropdown-item>
                                </b-dropdown>
                                <span v-else class="is-italic is-size-7 has-text-danger">Start and end time is the same. Please change the end time to determine downtime duration</span>
                            </b-field>

                            <b-field horizontal label="Impact Details" custom-class="is-small">
                                <b-field style="display: grid">
                                    <b-radio v-model="advisory_data.impact_details" v-for="(impact, index) in impacts" :key="index"
                                        size="is-small"
                                        class="impact-radio"
                                        :native-value="impact">
                                        <span>{{ impact }}</span>
                                    </b-radio>
                                </b-field>
                            </b-field>

                            <b-field horizontal custom-class="is-small m-l-10">                            
                                <b-field label="SERVICES :" style="display: inline-block" custom-class="is-small is-text-weight-light" class="column is-paddingless ">
                                    <b-checkbox v-for="(value, index) in services" :key="index" v-model="advisory_data.impact_services"
                                    size="is-small"
                                    class="column"
                                    :disabled="!advisory_data.impact_details.includes('The following services wil be affected:')"
                                        :native-value="value">
                                        {{ value.split(' ')[0] }}
                                    </b-checkbox>
                                </b-field>
                            </b-field>

                            <b-field horizontal custom-class="is-small m-l-40">                            
                                <b-field label="Applications :" custom-class="is-small is-text-weight-light" style="display: inline-block" class="column is-paddingless ">
                                    <b-checkbox v-for="(value, index) in applications" :key="index" v-model="advisory_data.applications"
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
                </section> 

                <section v-if="category == 'outage'">
                    <div class="columns m-t-20">
                        <div class="column is-8 is-offset-2">
                            <p class="menu-label p-b-10" style="border-bottom: 1px solid #dadada">HEADER</p>
                            <b-field :label-position="labelPosition" custom-class="is-small">
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

                            <b-field horizontal label="Telco Service" custom-class="is-small" class="dropdown-box">
                                <b-dropdown :disabled="header.b == 'Internet, Applications, and Network Services Unavailable'"
                                    :scrollable="true"
                                    :max-height="250"
                                    v-model="header.c"
                                    aria-role="list" size="is-small" expanded>
                                    <button class="button is-ghost is-small" type="button" slot="trigger" slot-scope="{ active }">
                                        <span>{{ header.c }}</span>
                                        <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
                                    </button>

                                    <b-dropdown-item class="is-size-7" v-for="(value, index) in telcos[header.b]" :key="index" aria-role="listitem" :value="value">{{ value }}</b-dropdown-item>
                                </b-dropdown>
                            </b-field>

                            <b-field horizontal label="Business Impact" custom-class="is-small" class="dropdown-box">
                                <b-dropdown
                                    :scrollable="true"
                                    :max-height="250"
                                    v-model="business_impact"
                                    aria-role="list" size="is-small" expanded>
                                    <button class="button is-ghost is-small" type="button" slot="trigger" slot-scope="{ active }">
                                        <span>{{ business_impact }}</span>
                                        <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
                                    </button>

                                    <b-dropdown-item class="is-size-7" v-for="(value, index) in business_impacts" :key="index" aria-role="listitem" :value="value">{{ value }}</b-dropdown-item>
                                </b-dropdown>
                            </b-field>
                        </div>
                    </div>

                    <div class="columns m-t-20">
                        <div class="column is-10 is-offset-1">
                            <p class="menu-label p-b-10" style="border-bottom: 1px solid #dadada">SERVICE OUTAGE DETAILS</p>

                            <b-field horizontal label="Affected Site" :label-position="labelPosition" expanded custom-class="is-small" class="site-field-group">

                                <div class="control" style="width: 150px;">
                                    <b-autocomplete
                                        size="is-small"
                                        custom-class="is-small"
                                        v-model="location"
                                        ref="location_autocomplete"
                                        :data="filteredLocations"
                                        :open-on-focus="true"
                                        placeholder="Select a Location"
                                        :clearable="true"
                                        field="name"
                                        @select="option => { selected = option }">
                                        <template slot-scope="props">
                                            <span class="is-size-7">{{ props.option.name }}</span>
                                        </template>
                                        <template slot="empty">No results for {{location}}</template>
                                    </b-autocomplete> 
                                </div>
                                <b-autocomplete
                                    size="is-small"
                                    custom-class="is-small"
                                    v-model="sites"
                                    ref="location_autocomplete"
                                    :data="filteredLocations"
                                    :open-on-focus="true"
                                    placeholder="Select Site..."
                                    :clearable="true"
                                    field="name"
                                    @select="option => { selected = option }">
                                    <template slot-scope="props">
                                        <span class="is-size-7">{{ props.option.name }}</span>
                                    </template>
                                    <template slot="empty">No results for {{sites}}</template>
                                </b-autocomplete> 
                            </b-field>

                            <b-field horizontal :label-position="labelPosition" expanded custom-class="is-small">
                                <b-taginput
                                    size="is-small"
                                    v-model="areas"
                                    :data="filteredLocations.filter(l => !areas.some(s => s.name.includes(l.name)))"
                                    autocomplete
                                    :open-on-focus="true"
                                    field="name"
                                    icon="label"
                                    placeholder="Area"
                                    @typing="getFilteredLocations"
                                    @add="addSite"
                                    @remove="removeSite">
                                    <template slot-scope="props">
                                        <span class="is-size-7">{{ props.option.name }}</span>
                                    </template>
                                    <template slot="empty">
                                        <span class="is-size-7">No site locations found with this keyword</span>
                                    </template>
                                </b-taginput>
                            </b-field>

                            <b-field horizontal label="Result" custom-class="is-small" class="dropdown-box" v-if="type == 'completion'">
                                <b-dropdown
                                    :scrollable="true"
                                    :max-height="250"
                                    v-model="advisory_data.activity_result"
                                    aria-role="list" size="is-small" expanded>
                                    <button class="button is-ghost is-small" type="button" slot="trigger" slot-scope="{ active }">
                                        <span>{{ advisory_data.activity_result }}</span>
                                        <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
                                    </button>

                                    <b-dropdown-item class="is-size-7" v-for="(value, index) in activity_results" :key="index" aria-role="listitem" :value="value">{{ value }}</b-dropdown-item>
                                </b-dropdown>
                            </b-field>

                            <b-field horizontal label="Schedule" custom-class="is-small">
                                <span class="is-size-7" v-if="date[0]">{{ advisory_data.schedule.string }}</span>
                                <span v-else class="is-italic is-size-7 has-text-danger">Select a date below to proceed</span>
                            </b-field>

                            <b-field grouped horizontal custom-class="is-small">
                                <b-datepicker range size="is-small" v-model="date" inline></b-datepicker>
        
                                <b-field label="START" custom-class="is-small m-t-20 m-b-10 has-text-weight-light">
                                    <b-field :label='date[0] ? dateFormat(date[0]) : ""' custom-class="is-small has-text-primary has-text-weight-medium">
                                        <b-timepicker hour-format="12" :default-minutes="0" size="is-small" v-model="date[0]" inline></b-timepicker>
                                    </b-field>
                                </b-field>
                                <b-field label="END" custom-class="is-small m-t-20 m-b-10 has-text-weight-light">
                                    <b-field :label='date[1] ? dateFormat(date[1]) : ""' custom-class="is-small has-text-primary has-text-weight-medium">
                                        <b-timepicker hour-format="12" :focusable="false" :default-minutes="0" size="is-small" v-model="date[1]" inline></b-timepicker>
                                    </b-field>
                                </b-field>
                            </b-field>

                            <b-field horizontal label="Downtime Duration" custom-class="is-small" class="dropdown-box">                            
                                <b-dropdown v-if="duration.string"
                                    :scrollable="true"
                                    :max-height="250"
                                    v-model="advisory_data.downtime_duration.string"
                                    aria-role="list" size="is-small" expanded>
                                    <button class="button is-ghost is-small" type="button" slot="trigger" slot-scope="{ active }">
                                        <span>{{ advisory_data.downtime_duration.string }}</span>
                                        <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
                                    </button>

                                    <b-dropdown-item class="is-size-7" v-for="(value, index) in [duration.string,'Degraded internet connectivity during peak hours']" :key="index" aria-role="listitem" :value="value">{{ value }}</b-dropdown-item>
                                </b-dropdown>
                                <span v-else class="is-italic is-size-7 has-text-danger">Start and end time is the same. Please change the end time to determine downtime duration</span>
                            </b-field>

                            <b-field horizontal label="Impact Details" custom-class="is-small">
                                <b-field style="display: grid">
                                    <b-radio v-model="advisory_data.impact_details" v-for="(impact, index) in impacts" :key="index"
                                        size="is-small"
                                        class="impact-radio"
                                        :native-value="impact">
                                        <span>{{ impact }}</span>
                                    </b-radio>
                                </b-field>
                            </b-field>

                            <b-field horizontal custom-class="is-small m-l-10">                            
                                <b-field label="SERVICES :" style="display: inline-block" custom-class="is-small is-text-weight-light" class="column is-paddingless ">
                                    <b-checkbox v-for="(value, index) in services" :key="index" v-model="advisory_data.impact_services"
                                    size="is-small"
                                    class="column"
                                    :disabled="!advisory_data.impact_details.includes('The following services wil be affected:')"
                                        :native-value="value">
                                        {{ value.split(' ')[0] }}
                                    </b-checkbox>
                                </b-field>
                            </b-field>

                            <b-field horizontal custom-class="is-small m-l-40">                            
                                <b-field label="Applications :" custom-class="is-small is-text-weight-light" style="display: inline-block" class="column is-paddingless ">
                                    <b-checkbox v-for="(value, index) in applications" :key="index" v-model="advisory_data.applications"
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
                </section>    
                
            </b-step-item>

            <b-step-item label="Review" :clickable="isStepsClickable">
                <p class="has-text-centered is-italic is-size-7" style="margin: 0px auto 20px auto;">Please review and confirm all details below</p>
                <div style="height: 0; width: 0;">
                    <new-scheduled-template :data="{ category: category, type: type, header: header, business_impact: business_impact, advisory_data: advisory_data}"/>
                </div>
                <section class="is-paddingless" v-if="image">
                    <!-- <div id="advisory-template"> -->
                        <img :src="image" style="width: 100%; height: auto;"/>
                    <!-- </div> -->
                </section>
            </b-step-item>
        </b-steps>
    </section>
    <footer class="modal-card-foot custom">
        <div class="is-pulled-right">
            
            <button class="button is-dark" type="button" v-show="activeStep > 0" @click="activeStep -= 1">
                <feather :type="prevIcon"></feather>
            </button>
            <button class="button is-dark" type="button" v-show="activeStep < stepsLength" @click="activeStep += 1">
                <feather :type="nextIcon"></feather>
            </button>
            <b-button type="is-dark" :loading="isBusy" v-show="activeStep == stepsLength" @click="getPng">Generate</b-button>
        </div>
    </footer>
</div>
</template>

<script>
// Import the editor
import domtoimage from 'dom-to-image'
import newScheduledTemplate from './../templates/advisory/New'

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
            location: null,
            sites: [],
            areas: [],
            business_impact: null,
            header: {
                a: this.title,
                b: null,
                c: null
            },
            advisory_data: {
                activity_description: null,
                schedule: {
                    start: null,
                    end: null,
                    string: null
                },
                downtime_duration: this.duration || {},
                impact_details: '',
                impact_services: [],
                applications: []
            },
            scheduleFormatted: null,
            image: null,
            date: [],
            time: []
        }
    },
    watch: {
        date: {
            deep: true,
            handler: function(newVal, oldVal) {  
                
                var start = this.$moment(newVal[0]).format('MMMM DD, YYYY'),
                    end = this.$moment(newVal[1]).format('MMMM DD, YYYY'),
                    string;

                if(start != end) {
                    
                    start = this.$moment(newVal[0]).format('MMMM DD, YYYY (hh:mm A)')
                    end = this.$moment(newVal[1]).format('MMMM DD, YYYY (hh:mm A)')

                    string = `${start} – ${end}`
                }else {
                    var startTime = this.$moment(newVal[0]).format('hh:mm A')
                    var endTime = this.$moment(newVal[1]).format('hh:mm A')
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
        //this.date = [date, date];
        this.advisory_data.applications = this.applications;
        this.advisory_data.impact_services = this.services
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

            return {
                "days": days,
                "hours": hours,
                "minutes": minutes,
                "string": string
            };
        },
        isApplicationsChecked() {
           return !(this.advisory_data.impact_services.includes('Applications') && this.advisory_data.impact_details.includes('following services'))
        },
    },
    methods: {
        addSite(item) {
            this.header.c.push(item.name)
        },
        removeSite(item) {
            
            this.header.c = this.header.c.filter(site => site != item.name)
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
        getPng() {
            this.isBusy = true
            var node = document.getElementById('advisory-template')
            let that = this

            domtoimage.toBlob(node, {
                width: node.clientWidth * 1,
                height: node.clientHeight * 1,
                style: {
                    'transform': 'scale(1)',
                    'transform-origin': 'top left' 
                }
            })
            .then(function (blob) {
                let reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function() {
                    let base64 = reader.result;
                    that.image = base64;
                    that.isBusy = false;
                    //that.submit(base64, blob);
                }
            })
            .catch(function (error) {
                console.error('Oops, something went wrong!', error);
            });
        },
        /*getPng() {
            this.isBusy = true
            var node = document.getElementById('advisory-template')
            let that = this

            domtoimage.toPng(node, {
                width: node.clientWidth * 1,
                height: node.clientHeight * 1,
                style: {
                    'transform': 'scale(1)',
                    'transform-origin': 'top left' 
                }
            })
            .then(function (dataUrl) {
                var img = new Image();
                img.src = dataUrl;
                that.image = img
                that.isBusy = false;
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
            });
        },*/
        submit(base64, blob) {
            this.isBusy = true;
            let that = this;
            
            const advisory_data = {
                "date" : this.date,
                "insight": this.html,
                "telcos" : this.telcos,
                "status" : this.status
            }

            const data = {
                "advisory_data" : JSON.stringify(advisory_data),
                "file": blob,
                "base64_string": base64,
                "remarks": `${this.email.subject} ${this.$moment(this.date).format("YYYYMMDD")}`,
                "is_draft": 0,
                "month": this.$moment(this.date).month() +1,
                "day": this.$moment(this.date).date(),
                "year": this.$moment(this.date).year(),
                "digest_time": "4:00PM",
                "digest_type": "technical",
                "client_id": 5
            }
            
            const formData = new FormData()
            for ( const key in data ) {
                formData.append(key, data[key]);
            }
            
            this.$axios.post('/api/dailydigests', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(function (response) {
                that.isBusy = false;

                that.$parent.close();

                that.$buefy.dialog.alert({
                    title: 'Hooray',
                    message: `${response.data.message}<br><br>Sent at:  <b>${that.email.recipient}</b><br>Subject:  <i>${data.remarks}</i><br>`,
                    type: 'is-success',
                    hasIcon: true,
                    icon: 'times-check',
                    iconPack: 'fa',
                    ariaRole: 'alertdialog',
                    ariaModal: true
                })
            })
            .catch(function (error) {
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