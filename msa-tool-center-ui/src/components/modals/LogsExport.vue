<template>
<div>
    <div class="modal-card export-login-logs">
        <header class="modal-card-head has-background-primary">
            <p class="modal-card-title has-text-white is-size-5 is-capitalized">Date Range</p>
        </header>
        <section class="modal-card-body">
            <b-field label="From">
                <b-datepicker
                    placeholder="Click to select..."
                    v-model="from_date">
                </b-datepicker>
            </b-field>
            <b-field label="To">
                <b-datepicker
                    placeholder="Click to select..."
                    v-model="to_date">
                </b-datepicker>
            </b-field>
        </section>
        <footer class="modal-card-foot custom">
            <div class="is-pulled-right">
                <b-button class="button is-small" type="button" @click="$parent.close()">Cancel</b-button>
                <b-button class="button is-small is-success" type="button" @click="downloadData" :loading="downloadLoading">
                    <feather class="icon" type="download" size="20"></feather>
                    <span> Download </span>
                </b-button>
            </div>
        </footer>
    </div>
</div>
</template>

<script>
import http from '../../http_common';
import { saveAs } from 'file-saver'


export default {
    // props: ['type', 'sharepoint'],
    data() {
        return {
            from_date: null,
            to_date: null,
            downloadLoading: false
        }
    },
    mounted() {
        var datetime = new Date();
        var datetimereset = new Date(datetime.setHours(0,0,0,0));
        this.from_datetime = datetimereset;
        this.to_datetime = datetimereset;
    },
    methods: {
        formatDate(value,date_format) {
            if (value != '') {
                return this.$moment(String(value)).format(date_format)
            }
            else
            {
                return '';
            }
        },
        downloadData() {
            var date_from = this.$moment(this.from_date).format('YYYY-MM-DD')
            var date_to = this.$moment(this.to_date).format('YYYY-MM-DD')
            var date_check = this.$moment(date_from).isBefore(date_to)
            
            if (date_check == false) {
                    this.checkValid();
            }else{
                var string_date = this.$moment(this.from_date).format('YYYY-M-D HH:mm:ss')
                var convert_date = new Date(string_date)
                convert_date.setHours(0,0,0,0)
                var new_date = this.$moment(convert_date).format('YYYY-M-D HH:mm:ss')
                var inputs = {
                    for:'login_logs',
                    with:'daterange',
                    from_date:new_date,
                    to_date:this.formatDate(this.to_date,'YYYY-M-D HH:mm:ss')
                }
                this.downloadLoading = true;
                if(this.$moment(this.formatDate(this.to_date,'YYYY-M-D HH:mm:ss')).isAfter(this.formatDate(this.from_date,'YYYY-M-D HH:mm:ss')))
                {
                    http.post('/events/login/user/export',inputs)
                    .then(response => {

                        var data = [];

                        for(var i = 0;i<response.data.length;i++)
                        {
                            data.push({
                                log_id: response.data[i].id,
                                visitor_ip: response.data[i].ip,
                                user_name: response.data[i].name,
                                user_email: response.data[i].email,
                                date_log: this.formatDate(response.data[i].createdAt, 'MMM DD, YYYY  hh:mm a')
                            })
                        }

                        this.exportData(data);

                    });
                }
                else
                {
                    this.downloadLoading = false;
                    this.$buefy.snackbar.open({
                        message: 'Oops! Invalid Daterange.',
                        type: 'is-danger',
                        position: 'is-bottom-right'
                    });
                }
            }
            
        },
        exportData(data) {
            //initialize worksheet
            var workbook = new this.$Excel.Workbook();

            //add worksheet
            var ws1 = workbook.addWorksheet(`Logins (${data.length})`);
            var rd1 = data;
            var rd1HeaderKeys;
            if(rd1.length > 0)
            {
                rd1HeaderKeys = Object.keys(rd1[0]); // get the key of the first object
            }
            else
            {
                rd1HeaderKeys = []; // no key available
            }
            var rd1ColumnHeader = [];
            for(var i = 0; i < rd1HeaderKeys.length; i++)
            {
                var width = (rd1HeaderKeys[i].length + 10);
                rd1ColumnHeader.push({"header" : rd1HeaderKeys[i],"key" : rd1HeaderKeys[i],"width": width});
            }
            ws1.columns = rd1ColumnHeader;
            ws1.autoFilter = {
                from: 'A1',
                to: {
                    row: 1,
                    column: rd1HeaderKeys.length
                }
            }
            ws1.addRows(rd1);
            ws1.eachRow(function(row, rowNumber) {
                if(rowNumber == 1)
                {
                    row.eachCell(function(cell, colNumber) {
                        colNumber;
                        cell.fill = {type: 'pattern', pattern: 'solid', fgColor:{argb:"005300"}};
                        cell.font = {'bold': true,color: {argb: "FFFFFF"},name: 'Verdana',size: 10};
                        cell.alignment = {vertical: 'middle', horizontal: 'center'};
                    });
                }

                if(rowNumber > 1)
                {
                    ws1.getRow(rowNumber).font = {size: 12};
                }

                row.eachCell(function(cell, colNumber) {
                    colNumber
                    cell.border = {
                        top: {style:'thin'},
                        left: {style:'thin'},
                        bottom: {style:'thin'},
                        right: {style:'thin'}
                    };
                });
            });

            //download excel file
            let that = this;
            that;
            var daterange = `${this.formatDate(this.from_datetime,'YYYY-MM-DD HH:mm')} - ${this.formatDate(this.to_datetime,'YYYY-MM-DD HH:mm')}`;
            workbook.xlsx.writeBuffer()
            .then(function(buffer) {
                saveAs(new Blob([buffer]), `[${daterange}] USER LOGS.xlsx`);
            });

            this.$parent.close();
            this.downloadLoading = false;
        },
        checkValid() {
            this.$swal({
                toast: true,
                position: 'bottom-right',
                showConfirmButton: false,
                timer: 3000,
                icon: 'error',
                title: 'Kindly check the dates. (required atleast 1 day).',
                });
            }
    }
}
</script>

<style lang="scss" scoped>
.icon-14 {
    width: 18px;
    height: 18px;
}
// .export-login-logs {
//     width: 750px;
//     overflow: visible !important;
// }
.export-login-logs {
    width: 300px;
    overflow: visible !important;
    margin-top:-215px !important;
}
.export-login-logs .modal-card {
  overflow: visible !important;
}
.export-login-logs .modal-card-body {
  overflow: visible !important;
}
.export-login-logs .datepicker {
    font-size:12px;
}
.export-login-logs .timepicker {
    font-size:12px;
}
</style>
