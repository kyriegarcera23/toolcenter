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
                        <p class="menu-label p-b-10" style="border-bottom: 1px solid #dadada">SERVICE OUTAGE DETAILS</p>

                        <b-field horizontal label="Advisory" :label-position="labelPosition" custom-class="is-small">
                            <span class="is-size-7">{{ data.header.b }} - {{ data.header.c }}</span>
                        </b-field>

                        <b-field horizontal label="Business Imapct" custom-class="is-small">
                            <span class="is-size-7">{{ data.business_impact }}</span>
                        </b-field>

                        <b-field horizontal label="Affected Site" custom-class="is-small">
                            <span class="is-size-7">{{ data.advisory_data.affected_site.join(" - ") }}</span>
                        </b-field>

                        <b-field horizontal label="Reported On" custom-class="is-small">
                            <span class="is-size-7">{{ $moment(data.advisory_data.schedule.start).format('MMMM D, YYYY (h:mm A)') }}</span>
                        </b-field>

                        <b-field horizontal label="Affected Services" custom-class="is-small">
                            <span class="is-size-7">{{ data.advisory_data.affected_services.description }}</span>
                        </b-field>

                        <b-field horizontal custom-class="is-small" v-if="data.advisory_data.affected_services.services">
                            <ul style="list-style: disc;" class="m-l-30">
                                <li class="is-size-7" v-for="(value, index) in data.advisory_data.affected_services.services" :key="index">
                                    {{ value }}
                                    <span v-if="value == 'Applications' && data.advisory_data.affected_services.applications.length"> ({{ data.advisory_data.affected_services.applications.join(", ") }})</span>
                                </li>
                            </ul>
                        </b-field>
                    </div>
                </div>

                <div class="columns m-t-20">
                    <div class="column is-10 is-offset-1">
                        <p class="menu-label p-b-10" style="border-bottom: 1px solid #dadada">ACTIONS TAKEN</p>

                        <b-field horizontal label="Telco Related" custom-class="is-small is-text-weight-light">                            
                            <b-field custom-class="is-small" id="application" class="column is-paddingless actions-checkbox p-t-5">
                                <b-checkbox v-for="(value, index) in actions.telco" :key="index" v-model="actions_taken"
                                size="is-small"
                                    :native-value="value">
                                    {{ value }}
                                </b-checkbox>
                            </b-field>
                        </b-field>

                        <b-field horizontal label="Power Related" custom-class="is-small is-text-weight-light">                            
                            <b-field custom-class="is-small" id="application" class="column is-paddingless actions-checkbox p-t-5">
                                <b-checkbox v-for="(value, index) in actions.power" :key="index" v-model="actions_taken"
                                size="is-small"
                                    :native-value="value">
                                    {{ value }}
                                </b-checkbox>
                            </b-field>
                        </b-field>

                        <b-field horizontal label="Network Device" custom-class="is-small is-text-weight-light">                            
                            <b-field custom-class="is-small" id="application" class="column is-paddingless actions-checkbox p-t-5">
                                <b-checkbox v-for="(value, index) in actions.network_device" :key="index" v-model="actions_taken"
                                size="is-small"
                                    :native-value="value">
                                    {{ value }}
                                </b-checkbox>
                            </b-field>
                        </b-field>

                        <b-field horizontal label="Voice Link Related" custom-class="is-small is-text-weight-light">                            
                            <b-field custom-class="is-small" id="application" class="column is-paddingless actions-checkbox p-t-5">
                                <b-checkbox v-for="(value, index) in actions.voice_link" :key="index" v-model="actions_taken"
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
                <div style="height: 0; width: 0;">
                    <new-scheduled-template :data="{ ...data }" :title="title" :type="type"/>
                </div>
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
            <b-button type="is-dark" :loading="isBusy" v-show="activeStep == stepsLength" @click="submit">Generate</b-button>
        </div>
    </footer>
</div>
</template>

<script>
import newScheduledTemplate from '../../../templates/advisory/New'
import http from '../../../../http_common';
export default {
    props: ['initial_data', 'batch_id', 'active_client', 'category', 'title', 'type', 'locations'],
    components: {
        newScheduledTemplate
    },
    data() {
        return {
            data: {},
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
            actions_taken: []
        }
    },
    watch: {
        actions_taken: {
            deep: true,
            handler: function(newVal, oldVal) {  
                oldVal;
                this.data.advisory_data.actions_taken = newVal
            }
        }
    },
    created() {
        this.data = this.initial_data;
        const date = new Date();
        date;
        this.actions_taken = this.data.advisory_data.actions_taken
    },
    computed: {
    },
    methods: {
        dateFormat(date) {
            return this.$moment(date).format('MMMM DD, YYYY');
        },
        submit() {
            this.isBusy = true;
            let that = this;

            this.data.header.a = this.title;
            
            const payload = {
                "category": 'outage',
                "type": 'update',
                "header": this.data.header,
                "business_impact": this.data.business_impact,
                "location_id": this.data.location.id,
                "site_id": this.data.site.id,
                "areas": this.data.areas,
                "advisory_data": this.data.advisory_data
            }

            //console.log('submit', payload)
            
           http.post('/advisories/add/update/'+this.data.batch_id, payload)
            .then(function (response) {
                that.isBusy = false;

                that.$parent.close();

                that.$emit('refresh');

                that.$buefy.snackbar.open({
                    message: response.data.message,
                    type: 'is-success',
                    position: 'is-bottom-right'
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
            })
        
        }
    }
}
</script>
<style lang="scss">
#application .field.has-addons {
    display: inline-block !important;
}

.actions-checkbox {
    .b-checkbox.checkbox {
        width: 100%;
        margin-bottom: 5px;
        align-items: end;
    }
}
</style>

<style lang="scss" scoped>

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