<template>
<div class='ubp-template' id="digest-template" style="transform: scale(0.6); margin-left: -10px; transform-origin: top left;">
    <table class='main-table' width='100%' cellpadding='0' cellspacing='0' border='0'>
        <tr>
            <td colSpan='4' style='padding: 0 30px;'>
                <hr style='border-bottom: 5px solid #BFBFBF; width: 100%;' />
            </td>
        </tr>
        <tr>
            <td align='right' style='padding: 0 20px; vertical-align: middle;' colSpan='2'>
                <img id='client-logo' style='height: 55px; width: 203.9px; margin-top: -10px;' src='/images/UBP-white.png' />
            </td>
            <td
                style='vertical-align: middle; font-size: 35.6pt; font-family: Tw Cen MT Condensed; font-weight: 900; color: #F7931E;'>
                BRANCH NETWORK DAILY UPDATE</td>
            <td width='250px' style='vertical-align: middle;'>
                <div class='date'>{{ $moment(data.date).format("DDMMMYYYY") }}</div>
            </td>
        </tr>
        <tr>
            <td colSpan='4' style='padding: 0 30px;'>
                <hr style='border-bottom: 5px solid #BFBFBF; width: 100%;' />
            </td>
        </tr>
    </table>
    <table width='100%' class='telco-table'>
        <tr>
            <td width='400px' style='vertical-align: top; padding-top: 15px;'>
                <table class="telco-details">
                    <tr v-for="(telco, name) in data.telcos" :key="name">
                        <td>
                            <div class='circle circle-value'>{{ telco.percentage }}%</div>
                        </td>
                        <td class='telco-col'>
                            <div class='telco-name'> {{ name }} </div>
                            <div class='telco-remarks'>
                                <span v-if="telco.down">
                                    ({{ telco.down }} OUT OF {{ telco.total }} LINKS ARE DOWN)
                                </span> 
                                <span v-else>
                                    (ALL {{ telco.total }} LINKS ARE UP)
                                </span>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
            <td style='vertical-align: top; padding-top: 15px; padding-right: 50px;'>
                <table width='100%' class="details-table">
                    <tr>
                        <td colSpan='2' style='border-bottom: 5px solid #BFBFBF;'>
                            <div class='summary-icon'></div>
                            <div class='summary-title'>BRANCH STATUS</div>
                        </td>
                    </tr>
                    <tr style='font-weight: 900; color: white; font-size: 16pt;'>
                        <td style='height: 50px; vertical-align: middle;'>
                            <span v-if="data.status.branch.up">
                                <img src='/images/upicon.png' class='status-icon up' /> {{ data.status.branch.up }} BRANCHES
                            </span>
                        </td>
                        <td style='height: 50px; vertical-align: middle;'>
                            <span v-if="data.status.branch.down">
                                <img src='/images/downicon.png' class='status-icon down' /> {{ data.status.branch.down }} BRANCHES
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan='2' style='border-bottom: 5px solid #BFBFBF; padding-top: 10px;'>
                            <div class='summary-icon'></div>
                            <div class='summary-title'>ATM STATUS</div>
                        </td>
                    </tr>
                    <tr style='font-weight: 900; color: white; font-size: 16pt;'>
                        <td style='height: 50px; vertical-align: middle;'>
                            <span v-if="data.status.atm.up">
                                <img src='/images/upicon.png' class='status-icon up' /> {{ data.status.atm.up }} BRANCHES
                            </span>
                        </td>
                        <td style='height: 50px; vertical-align: middle;'>
                            <span v-if="data.status.atm.down">
                                <img src='/images/downicon.png' class='status-icon down' /> {{ data.status.atm.down }} BRANCHES
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan='2' style='border-bottom: 5px solid #BFBFBF; padding-top: 10px;'>
                            <div class='summary-icon'></div>
                            <div class='summary-title'>SUMMARY</div>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan='2'>
                            <div class='summary-details'>
                                <span v-html="data.html"></span>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td colSpan='2'>
                <div style='text-align: center; font-family: Calibri; font-size: 12pt; color: white; padding: 20px;'>PREPARED BY <img
                        src='/images/trendslogo.png' style='height: 20px; margin: 0px 5px -3px 5px;' /> OPERATIONS CENTER</div>
            </td>
        </tr>
    </table>
</div>
</template>

<script>
export default {
    props: ['data'],
    data: function () {
        return {
        }
    },
    created() {

    },
    watch: {

    },
    methods: {
    }
}

</script>

<style lang="css" >

</style>



<style lang="scss">


.ubp-template{
color: #f7931e;
width: 1280px;
background: url('/images/phmap.png');
background-position: center center;
background-repeat: no-repeat;
background-size: 1240px;
background-color: #312F2F;
border-radius: 30px; 

hr {
    margin-block-start: 0.5em;
    margin-block-end: 0.5em;
    margin-inline-start: auto;
    margin-inline-end: auto;
    overflow: hidden;
    border-style: inset;
    border-width: 1px;
}

.date-bg img{
    height: 70px;
}

.details-table {
    border-collapse: separate;
    border-spacing: 2px;
}

.date{
    font-family: Bahnschrift SemiCondensed;
    font-weight: 600;
    font-size: 20pt;
    color: white;
    letter-spacing: 1px;
    text-transform: uppercase;
}

.main-table,.telco-table{
    position: relative;
    z-index: 1;
    padding: 0 30px;
    width: 1280px;
    border-collapse: separate !important;
}

.main-table{
    padding-top: 30px;
}

.telco-table{
    font-family: Bahnschrift SemiCondensed;
    padding-left: 90px;
}

.client-logo{
    margin-top: -5px;
}

.circle{
    width: 100px;
    height: 100px;
    border-radius: 200px;
    border: 10px solid #B45210;
    background-color: #F3A671;
    text-align: center;
    display: table-cell;
    vertical-align: middle;
}

.circle-value{
    font-weight: 600;
    font-size: 22pt;
    padding-top: 5px;
    color: #6A310A;
}

.telco-col{
    padding-left: 20px;
}

.telco-name{
    font-weight: 900;
    font-size: 24pt;
    letter-spacing: 1.6pt;
    color: #F7931E;
    text-transform: uppercase;
}

.telco-remarks{
    font-size: 13pt;
    color: white;
    font-family: Trebuchet MS;
    text-transform: uppercase;
}

.telco-details {
    border-collapse: separate;
    border-spacing: 2px; 

    td{
        vertical-align: middle;
    }
}

.summary-icon{
    display: inline-block;
    padding-right: 15px;
}

.summary-title{
    display: inline-block;
    font-size:20pt;
}

.summary-details{
    h3 {
        color: #f7931e !important;
        text-transform: uppercase;
        font-size: 20pt;
        font-weight: 700;
        margin-top: 10px;
    }

    ul {
        list-style-type: disc;
        margin-bottom: 10px;
        font-size: 13pt;
        color: white;

        li {
            word-break: break-word;
            margin-inline-start: 40px;
        }
    }
}



.status-icon{
    width:30px;
    padding-right:10px;
}

.status-icon.up{
    margin-bottom: -2px;
}

.status-icon.down{
    margin-bottom:-5px;
}
}


</style>