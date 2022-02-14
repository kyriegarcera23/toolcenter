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
                        <p class="menu-label p-b-10" style="border-bottom: 1px solid #dadada">SCHEDULED ACTIVITY DETAILS</p>

                        <b-field horizontal label="Advisory" :label-position="labelPosition" custom-class="is-small">
                            <span class="is-size-7">{{ data.header.b }} Advisory - {{ data.header.c.join(' - ') }}</span>
                        </b-field>

                        <b-field horizontal label="Business Imapct" custom-class="is-small">
                            <span class="is-size-7">{{ data.business_impact }}</span>
                        </b-field>

                        <b-field horizontal label="Affected Site" custom-class="is-small">
                            <span class="is-size-7">{{ data.location.name }} - {{ data.site.name }}</span>
                        </b-field>

                        <b-field horizontal label="Activity Description" custom-class="is-small">
                            <span class="is-size-7">{{ data.advisory_data.activity_description }}</span>
                        </b-field>

                        <b-field horizontal label="Schedule" custom-class="is-small">
                            <span class="is-size-7">{{ data.advisory_data.schedule.string}}</span>
                        </b-field>
                        
                        <b-field horizontal label="Outage Duration" custom-class="is-small">  
                            <span class="is-size-7">{{ data.advisory_data.downtime_duration.string }}</span>
                        </b-field>

                        <b-field horizontal label="Impact Details" custom-class="is-small">
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
                        <p class="menu-label p-b-10" style="border-bottom: 1px solid #dadada">CANCELLATION DETAILS</p>

                        <b-field horizontal label="Reason" custom-class="is-small">
                                <b-input v-model="data.advisory_data.cancellation_reason" maxlength="300" type="textarea"></b-input>
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
            <button class="button is-dark" type="button" v-show="activeStep < stepsLength" @click="checkValid()">
                <feather :type="nextIcon"></feather>
            </button>
            <b-button type="is-dark" :loading="isBusy" v-show="activeStep == stepsLength" @click="submit">Generate</b-button>
        </div>
    </footer>
</div>
</template>

<script>
// Import the editor
// import domtoimage from 'dom-to-image'
import newScheduledTemplate from '../../../templates/advisory/New'
import http from '../../../../http_common';
export default {
    props: ['initial_data', 'active_client', 'category', 'title', 'type', 'locations'],
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
            date: []
        }
    },
    watch: {
    },
    created() {
        this.data = this.initial_data;
    },
    beforeDestroy() {

    },
    computed: {
    },
    methods: {
        checkValid() {
            if(this.data.advisory_data.cancellation_reason === null || this.data.advisory_data.cancellation_reason === '' ){
                this.$swal({
                    // toast: true,
                    position: 'center',
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Yes",
                    timer: 3000,
                    icon: 'warning',
                    title:'Are you sure do you want to continue without reason?'
                    }).then((isConfirm) => {
                         if(isConfirm.value === true) {
                             this.activeStep += 1;
                         }
                    })
            }else{
                this.activeStep += 1;
            }
        },
        submit() {
            this.isBusy = true;
            let that = this;
            //let confirmed = false;
            this.data.header.a = this.title;
            
            const payload = {
                "batch_id": this.data.batch_id,
                "category": "scheduled",
                "type": "cancellation",
                "header": this.data.header,
                "business_impact": this.data.business_impact,
                "location_id": this.data.location.id,
                "site_id": this.data.site.id,
                "areas": this.data.areas,
                "advisory_data": this.data.advisory_data
            }

            //console.log('submit', payload)
            
            // if(this.data.advisory_data.cancellation_reason.trim().length === 0){
            //     this.$swal({
            //         // toast: true,
            //         position: 'center',
            //         showConfirmButton: true,
            //         showCancelButton: true,
            //         confirmButtonColor: "#3085d6",
            //         confirmButtonText: "Yes",
            //         timer: 3000,
            //         icon: 'warning',
            //         title:'Are you sure do you want to continue without reason?'
            //         }).then((isConfirm) => {
            //              if(isConfirm.value === true) {
            //                  confirmed = true;
            //              }else{
            //                  confirmed = false;
            //              }
            //         })
            // }
            
            // if(confirmed){
                http.post('/advisories/add/cancellation/', payload)
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
            // }
            
        
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