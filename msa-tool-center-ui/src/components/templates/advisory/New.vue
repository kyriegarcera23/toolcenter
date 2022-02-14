<template>
<div class="advisory-template" :class="`${type}-advisory`" id="advisory-template" :style="`margin-left: ${margin_left || '-10px'}`" style="transform: scale(0.5);transform-origin: left top;width: 1920px;">
    <table class="layout" border='0' cellpadding="0" cellspacing="0">
    <tr>
        <td class='advisory-container' valign="top">
            <table border="0" cellspacing="0" cellpadding="0" style="margin:0;padding:0;width: 100%; height: 100%">
                <tr >
                    <td class='advisory-header' colspan="3">
                        <table ellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td class='advisory-logo' align="center" style="width: 210px; max-width: 210px">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="88" viewBox="0 0 200 88">
                                        <defs>
                                            <pattern id="edc-logo" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" viewBox="0 0 200 88">
                                            <image width="200" height="88" xlink:href="data:image/png;base64,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"/>
                                            </pattern>
                                        </defs>
                                        <path id="EDC_LOGO" data-name="EDC LOGO" d="M0,0H188V88H0Z" fill="url(#edc-logo)"/>
                                    </svg>
                                        
                                </td>
                                <td class='advisory-header-title' v-if="data.category == 'scheduled'">
                                    <span class="is-uppercase">{{ title }}: </span> 
                                    <span class="is-uppercase" v-if="data.header.b">{{ data.header.b }} ADVISORY</span>
                                    <span class="has-text-danger" v-else>{{ '[ No Advisory Activity ]' }}</span>
                                    <span v-if="data.header.c.length"> – {{ data.header.c.join(" - ") }}</span>
                                    <span class="has-text-danger" v-else>{{ '[ No Affected Site ]' }}</span>
                                </td>
                                <td class='advisory-header-title' v-if="data.category == 'outage'">
                                    <span class="is-uppercase">{{ title }}: </span> 
                                    <span class="is-uppercase" v-if="data.header.b">{{ data.header.b }}</span>
                                    <span class="has-text-danger" v-else>{{ '[ No Type ]' }}</span>
                                    <span v-if="data.header.c"> – {{ data.header.c }}</span>
                                    <span class="has-text-danger" v-else-if="!data.header.c && data.header.b != 'Internet, Applications, and Network Services Unavailable'">{{ '[ No Telco Service ]' }}</span>
                                </td>
                                <td width="120px">
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr class="border_bottom">
                    <td align="right" >
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="150" height="150" viewBox="0 0 184 184">
                            <image id="Icon1" width="184" height="184" xlink:href="data:image/png;base64,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"/>
                        </svg>
                    </td>
                    <td class='business-impact' style="text-align: center; height: 146px;">
                        <span class="is-uppercase">BUSINESS IMPACT: </span>
                        <span class="is-uppercase" v-if="data.business_impact">{{ data.business_impact }}</span>
                        <span class="has-text-danger has-text-weight-semibold" v-else>{{ '[ No Business Impact ]' }}</span>
                    </td>
                    <td align="left">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="150" height="150" viewBox="0 0 185 184">
                            <image id="Icon2" width="185" height="184" xlink:href="data:image/png;base64,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"/>
                            </svg>
                    </td>
                </tr>
                <tr v-if="data.category == 'scheduled'" >
                    <td colspan="3" align="center"  valign="top" height="auto" style="padding-top: 22px; vertical-align: top;">
                        <div class="activity-details-title" marginTop="30px">ACTIVITY DETAILS</div>
                        <table class="activity-details-table" cellspacing="0" cellpadding="10px" border="1">
                            <tr>
                                <td class="activity-details-header">ACTIVITY DESCRIPTION</td>
                                <td style="background-color: white;">{{ data.advisory_data.activity_description }}</td>
                            </tr>
                            <tr>
                                <td class="activity-details-header" :class="data.category">SCHEDULE</td>
                                <td style="background-color: #E7E7E7;">{{ data.advisory_data.schedule.string }}</td>
                            </tr>
                            <tr>
                                <td class="activity-details-header">DOWNTIME DURATION</td>
                                <td style="background-color: white;">{{ data.advisory_data.downtime_duration.string }}</td>
                            </tr>
                            <tr>
                                <td class="activity-details-header">IMPACT DETAILS</td>
                                <td style="background-color: #E7E7E7;">
                                    <span>{{ data.advisory_data.affected_services.description }}</span>
                                    <ul v-if="data.advisory_data.affected_services.description.includes('following services') && data.advisory_data.affected_services.services.length">
                                        <li v-for="svc in data.advisory_data.affected_services.services" :key="svc"> 
                                            {{ svc }}
                                            <span v-if="svc == 'Applications' && data.advisory_data.affected_services.applications.length"> ({{ data.advisory_data.affected_services.applications.join(", ") }})</span>
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                            <tr v-if="type == 'completion'">
                                <td class="activity-details-header">ACTIVITY RESULT</td>
                                <td style="background-color: white;">{{ data.advisory_data.activity_result }}</td>
                            </tr>
                            <tr v-if="type == 'cancellation'">
                                <td class="activity-details-header" style="width: 200px">REASON FOR CANCELLATION</td>
                                <td style="background-color: white;">{{ data.advisory_data.cancellation_reason }}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr v-if="data.category == 'outage'" >
                    <td colspan="3" align="center"  valign="top" height="auto" style="padding-top: 22px; vertical-align: top;">
                        <div class="activity-details-title" marginTop="30px">ACTIVITY DETAILS</div>
                        <table class="activity-details-table" v-if="data.category == 'outage'" cellspacing="0" cellpadding="10px" border="1">
                            <tr>
                                <td class="activity-details-header" :class="`${data.category} ${type}`">AFFECTED SITE</td>
                                <td style="background-color: white;">
                                    <span v-if="data.advisory_data.affected_site[0]">{{ data.advisory_data.affected_site[0] }} </span>
                                    <span v-if="data.advisory_data.affected_site[1]">– {{ data.advisory_data.affected_site[1] }} </span>
                                    <span v-if="data.advisory_data.affected_site[2]">- {{ (data.advisory_data.affected_site[2]).join(", ") }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td class="activity-details-header">AFFECTED SERVICES</td>
                                <td style="background-color: #E7E7E7;">
                                    <span>{{ data.advisory_data.affected_services.description }}</span>
                                    <ul v-if="data.advisory_data.affected_services.description.includes('following services') && data.advisory_data.affected_services.services.length">
                                        <li v-for="svc in data.advisory_data.affected_services.services" :key="svc"> 
                                            {{ svc }}
                                            <span v-if="svc == 'Applications' && data.advisory_data.affected_services.applications.length"> ({{ data.advisory_data.affected_services.applications.join(", ") }})</span>
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td class="activity-details-header">OUTAGE REPORTED ON</td>
                                <td style="background-color: #E7E7E7;">{{ $moment(data.advisory_data.schedule.start).format('MMMM D, YYYY (h:mm A)') }}</td>
                            </tr>
                            <tr v-if="type == 'completion'">
                                <td class="activity-details-header">OUTAGE RESTORED ON</td>
                                <td style="background-color: #E7E7E7;">{{ $moment(data.advisory_data.schedule.end).format('MMMM D, YYYY (h:mm A)') }}</td>
                            </tr>
                            <tr v-if="type == 'completion'">
                                <td class="activity-details-header">DURATION OF INTERRUPTION</td>
                                <td style="background-color: white;">{{ data.advisory_data.interruption_duration.string }}</td>
                            </tr>
                            <tr v-if="type == 'completion'">
                                <td class="activity-details-header">ROOT CAUSE</td>
                                <td style="background-color: white;">{{ data.advisory_data.root_cause }}</td>
                            </tr>
                            <tr v-if="type != 'completion'">
                                <td class="activity-details-header">ACTIONS TO RESTORE</td>
                                <td style="background-color: white;">
                                    <ul v-if="data.advisory_data.actions_taken.length">
                                        <li v-for="action in data.advisory_data.actions_taken" :key="action"> 
                                            {{ action }}
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                            
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan="3" align="center">
                        <div class="contact-details">If you encounter any network issues, please report to the portal sdp.lopezgroup.com.ph or send e-mail to usercare@energy.com.ph</div>
                    </td>
                </tr>

            </table>
        </td>
    </tr>

    </table>
</div>
</template>

<script>
export default {
    props: ['data', 'margin_left', 'type', 'title'],
    data() {
        return {

        }
    }
}
</script>

<style lang="scss" scoped>
.advisory-template {
    background-color: white; 
    border-radius: 20px 20px 0 0;
    color: #000000;

    &.initial-advisory, &.update-advisory, &.cancellation-advisory {
        .advisory-header, 
        .activity-details-title,
        .activity-details-header {
            background-color: #000000;
            color: #E46C0A;
        }
    }

    &.completion-advisory {
        .advisory-header, 
        .activity-details-title,
        .activity-details-header {
            background-color: #0C4F26;
            color: #ffffff;
        }
    }

    table th, table td {
        vertical-align: middle;
    }

    .advisory-container{
        width: 1280px;
        height: 720px;
        font-family: Calibri, sans-serif;
        border-radius: 20px 20px 0 0;
        background-size: cover;
        background-image: url('background.png');
        background-repeat: no-repeat;
    }
    .advisory-header{
        background-color: black;
        width: 1280px;
        height: 125px;
        border-radius: 15px;
        
    }
    .advisory-header-title{
        font-size: 34px;
        font-weight: bold;
        text-align: center;
    }
    .business-impact{
        font-size: 36px;
        margin: 0;
        padding: 0;
        font-family: 'Montserrat';
        width: 1010px;
        vertical-align: middle;
    }
    .layout{
        border-collapse: collapse;
        width: 1920px;
        min-height: 1080px;
    }
    tr.border_bottom td {
        border-bottom: 3px solid black;
    }
    .activity-details-title{
        font-size: 36px;
        width: 407px;
        height: 75px;
        vertical-align: middle;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 30px;
        margin-top: 22px;
        font-weight: bold;
    }
    .activity-details-table{
        width:1280px;
        height: auto;
        border: 1;
        border-color: black;
        font-weight: bold;
        font-size: 22px;
        line-height: 1.5;

        td {
            padding: 10px;
            vertical-align: top;
        }
    }

    .activity-details-header{
        width: 285px;

        &.outage.completion {
            width: 350px;
        }
        
        font-weight: bold;
    }
    .contact-details{
        font-style: italic;
        font-size: 20px;
    }

    ul {
        padding-left: 30px;
        margin: auto;
        list-style-type: disc;
    }
}
</style>