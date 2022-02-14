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

                        <b-field horizontal label="Actions Taken" custom-class="is-small">
                            <ul style="list-style: disc;" class="m-l-10">
                                <li class="is-size-7" v-for="(value, index) in data.advisory_data.actions_taken" :key="index">
                                    {{ value }}
                                </li>
                            </ul>
                        </b-field>
                    </div>
                </div>

                <div class="columns m-t-20">
                    <div class="column is-10 is-offset-1">
                        <p class="menu-label p-b-10" style="border-bottom: 1px solid #dadada">RESTORATION DETAILS</p>

                        <b-field horizontal label="Root Cause" custom-class="is-small" class="dropdown-box">
                            <b-dropdown
                                :scrollable="true"
                                :max-height="250"
                                v-model="root_cause"
                                aria-role="list" size="is-small" expanded>
                                <button class="button is-small" type="button" slot="trigger" slot-scope="{ active }">
                                    <span>{{ root_cause }}</span>
                                    <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
                                </button>

                                <b-dropdown-item class="is-size-7" v-for="(value, index) in root_causes" :key="index" aria-role="listitem" :value="value">{{ value }}</b-dropdown-item>
                            </b-dropdown>
                        </b-field>

                        <b-field horizontal label="Outage Duration" custom-class="is-small" class="dropdown-box">  
                            <span v-if="duration.string && date" class="is-size-7">{{ duration.string }}</span>                          
                            <span v-else class="is-italic is-size-7 has-text-danger">Start and end time is the same. Please change the end time to determine interruption duration</span>
                        </b-field>

                        <b-field horizontal label="Restored On" custom-class="is-small">
                            <span class="is-size-7" v-if="date">{{ $moment(date).format('MMMM D, YYYY (h:mm A)') }}</span>
                            <span v-else class="is-italic is-size-7 has-text-danger">Select a date below to proceed</span>
                        </b-field>

                        <b-field grouped horizontal custom-class="is-small">
                            <b-datepicker size="is-small" v-model="date" inline></b-datepicker>
    
                            <b-field label="TIME" custom-class="is-small m-t-20 m-b-10 has-text-weight-light">
                                <b-timepicker hour-format="12" :default-minutes="0" size="is-small" v-model="date" inline></b-timepicker>
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
            root_causes: [
                'To be determined',
                'Power Interruption',
                'Defective Network Device',
                'Defective Telco Device',
                'Fiber Optic Cable issue',
                'Faulty Cable',
                'Unplugged Cable',
                'Low Voltage',
                'Natural Disaster',
                'Unplugged Power Cable',
                'No Network Issue Found',
                'No Historical Alarms'
            ],
            root_cause: null,
            date: null
        }
    },
    watch: {
        root_cause: {
            deep: true,
            handler: function(newVal, oldVal) {  
                oldVal;
                this.data.advisory_data.root_cause = newVal
            }
        },
        date: {
            deep: true,
            handler: function(newVal, oldVal) {
                oldVal;
                this.data.advisory_data.schedule.end = newVal
            }
        },
        duration: function(val) {
            this.data.advisory_data.interruption_duration = val


        }
    },
    created() {
        this.data = this.initial_data;
        const date = new Date();
        this.date = date;
        
        this.data.advisory_data.interruption_duration = this.duration
    },
    computed: {
        duration() {
            var start
            // start date
            if (this.data.advisory_data){
                start = this.$moment(this.data.advisory_data.schedule.start)
            }else {
                start = ''
            }
            
            var end = this.$moment(this.date) //end date

        
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

            // this.data.advisory_data.interruption_duration = {
            //     "days": days,
            //     "hours": hours,
            //     "minutes": minutes,
            //     "string": string
            // }

            if(start > end){
                this.$buefy.dialog.alert({
                    title: 'Oops',
                    message: `The start date must be later than end date.`,
                    type: 'is-danger',
                    hasIcon: true,
                    icon: 'times-circle',
                    iconPack: 'fa',
                    ariaRole: 'alertdialog',
                    ariaModal: true
                })
            }

            return {
                "days": days,
                "hours": hours,
                "minutes": minutes,
                "string": string
            };
        }
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
                "batch_id": this.data.batch_id,
                "category": "outage",
                "type": "completion",
                "header": this.data.header,
                "business_impact": this.data.business_impact,
                "location_id": this.data.location.id,
                "site_id": this.data.site.id,
                "areas": this.data.areas,
                "advisory_data": this.data.advisory_data
            }

            //console.log('submit', payload)
            
            http.post('/advisories/add/completion/',payload)
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
            });
        
        }
    }
}
</script>
<style lang="scss">
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