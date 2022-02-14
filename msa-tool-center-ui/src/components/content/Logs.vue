<template>
<div>
    <div class="nav-background is-page">
        <div class="page-header-container">
            <div class="columns has-text-white">
                <div class="column" style="padding-left:20px;">
                    <table>
                        <tr>
                            <td style="padding:10px 10px 0px 30px;"><feather type="list" size="30" class="m-r-15" style="margin-bottom: -8px"></feather></td>
                            <td><span class="is-size-5" style="font-weight: bold">Logs</span>
                            <i class="is-size-7" style="display: block; margin-top: -3px;">View activities and events that occur in MICTS Tool Center</i></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="container" style="margin-left:20px;">
        <div class="columns" style="flex-wrap: wrap">
            <div class="column">
                <b-tabs v-model="activeTab">
                    <b-tab-item label="Activity Logs">
                        <div class="columns" style="flex-wrap: wrap">
                            <div class="column is-4">
                                <b-input placeholder="Search..."
                                    type="search"
                                    icon="magnify"
                                    v-model="searchUserLogs"
                                >
                                </b-input>
                            </div>
                            <div class="column"></div>
                            <div class="column">
                                <b-button type="is-small is-info" style="float:right;" @click="refreshUserLogs">Refresh</b-button>
                            </div>
                            <div class="column is-12">
                                <b-table
                                v-if="user_logs.length"
                                :data ="user_logs"
                                paginated
                                backend-pagination
                                :total="userlogsTotal"
                                :per-page="userlogsperPage"
                                :loading="loading"

                                @page-change="onUserLogsPageChange"
                                aria-next-label="Next page"
                                aria-previous-label="Previous page"
                                aria-page-label="Page"
                                aria-current-label="Current page"
                                :pagination-simple="isPaginationSimple"
                                :pagination-position="paginationPosition"

                                backend-sorting
                                :sort-icon="sortIcon"
                                :sort-icon-size="sortIconSize"
                                :default-sort-direction="defaultSortDirection"
                                :default-sort="[UserLogsSortField, UserLogsSortOrder]"
                                @sort="onUserLogsSort"
                                >

                                    <b-table-column field="id" label="id" v-slot="props" :sortable="false">
                                        {{ props.row.id}}
                                    </b-table-column>
                                    <b-table-column field="subject" label="subject" v-slot="props" :sortable="false">
                                        {{ props.row.subject}}
                                    </b-table-column>
                                    <b-table-column field="user" label="user" v-slot="props" :sortable="false">
                                        {{ props.row.user.email}}
                                    </b-table-column>
                                    <b-table-column field="createdAt" label="date log" v-slot="props" :sortable="true">
                                        {{ formatDate(props.row.createdAt, 'MMM DD, YYYY  hh:mm a') }}
                                    </b-table-column>
                                    <b-table-column field="metadata" label="" v-slot="props" :sortable="false">
                                        <b-button size="is-small" @click="openUserLogsMetadata(props.row)">view details</b-button>
                                    </b-table-column>
                                </b-table>
                            </div>
                        </div>
                    </b-tab-item>

                    <b-tab-item label="Login Logs">
                        <div class="columns" style="flex-wrap: wrap">
                            <div class="column is-4">
                                <b-input placeholder="Search..."
                                    type="search"
                                    icon="magnify"
                                    v-model="searchUserLogins"
                                >
                                </b-input>
                            </div>
                            <div class="column">
                                <b-button type="is-info is-pulled-right" @click="refreshUserLogins">Refresh</b-button>
                                <!-- <b-button type="is-small is-success is-pulled-right" style="margin-right:5px;" @click="exportUserLogins">
                                    Export
                                </b-button> -->

                                <b-dropdown >
                                    <button  class="button is-success" slot="trigger" >
                                        <span> Export </span>
                                        <feather class="icon" type="chevron-down" size="20"></feather>
                                    </button>

                                    <b-dropdown-item @click="exportUserLogins('today')">Today</b-dropdown-item>
                                    <b-dropdown-item @click="exportUserLogins('range')">Date range</b-dropdown-item>
                                </b-dropdown>

                            </div>
                            <div class="column is-12">
                                <b-table
                                v-if="user_logins.length"
                                :data ="user_logins"
                                paginated
                                backend-pagination
                                :total="userloginsTotal"
                                :per-page="userloginsperPage"
                                :loading="loading"

                                @page-change="onUserLoginsPageChange"
                                aria-next-label="Next page"
                                aria-previous-label="Previous page"
                                aria-page-label="Page"
                                aria-current-label="Current page"
                                :pagination-simple="isPaginationSimple"
                                :pagination-position="paginationPosition"

                                backend-sorting
                                :sort-icon="sortIcon"
                                :sort-icon-size="sortIconSize"
                                :default-sort-direction="defaultSortDirection"
                                :default-sort="[UserLoginsSortField, UserLoginsSortOrder]"
                                @sort="onUserLoginsSort"
                                >

                                    <b-table-column field="id" label="id" v-slot="props" :sortable="false">
                                        {{ props.row.id}}
                                    </b-table-column>
                                    <b-table-column field="subject" label="visitor ip" v-slot="props" :sortable="false">
                                        {{ props.row.ip}}
                                    </b-table-column>
                                    <b-table-column field="user" label="name" v-slot="props" :sortable="false">
                                        {{ props.row.name}}
                                    </b-table-column>
                                    <b-table-column field="user" label="email" v-slot="props" :sortable="false">
                                        {{ props.row.email}}
                                    </b-table-column>
                                    <b-table-column field="createdAt" label="date log" v-slot="props" :sortable="true">
                                        {{ formatDate(props.row.createdAt, 'MMM DD, YYYY  hh:mm a') }}
                                    </b-table-column>
                                </b-table>
                            </div>
                        </div>
                    </b-tab-item>
                </b-tabs>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import http from '../../http_common';
import LogsViewer from '../modals/LogsViewer.vue';
import LogsExport from '../modals/LogsExport.vue';
import { saveAs } from 'file-saver'

export default {
    data() {
        return {
            activeTab: 0,

            set_from_date: new Date(),
            set_to_date: new Date(),

            awaiting_search: false,
            loading: false,
            isPaginated: true,
            isShowAll: false,
            isPaginationSimple: false,
            paginationPosition: 'bottom',
            defaultSortDirection: 'asc',
            sortIcon: 'chevron-up',
            sortIconSize: 'is-small',

            //for userlogs table data
            user_logs: [],
            searchUserLogs:'',
            UserLogsSortField: 'createdAt', //default sort field
            UserLogsSortOrder: 'desc', //default soft order
            userlogsPage:0,
            userlogsTotal:0,
            userlogsperPage:20,

            //for userlogins table data
            user_logins: [],
            searchUserLogins:'',
            UserLoginsSortField: 'createdAt', //default sort field
            UserLoginsSortOrder: 'desc', //default soft order
            userloginsPage:0,
            userloginsTotal:0,
            userloginsperPage:20
        }
    },
    mounted() {
        this.UserLogs();
        this.UserLogins();
    },
    methods: {
        formatDate(value,date_format){
            if (value) {
                return this.$moment(String(value)).format(date_format)
            }
        },
        UserLogs() {
            this.loading = true
            var params = [
                `page=${this.userlogsPage}`,
                `limit=${this.userlogsperPage}`,
                `search=${this.searchUserLogs}`,
                `sortField=${this.UserLogsSortField}`,
                `sortOrder=${this.UserLogsSortOrder}`,
            ].join('&')
            http.get('/events/logs?'+ params)
                .then(response => {
                    this.loading = false
                    this.user_logs = []

                    let currentTotal = response.data.count;
                    
                    //console.log(response.data.count / this.userlogsperPage);
                    if (response.data.count / this.userlogsperPage > 1000) {
                        currentTotal = this.userlogsperPage * 1000
                    }
                    
                    this.userlogsTotal = currentTotal
                    response.data.rows.forEach((item) => {
                        this.user_logs.push(item)
                    })
                
                    
            }).catch(e =>{
                e;
                this.loading = false
        
            })
        },
        onUserLogsPageChange(page){
            this.userlogsPage = page <= 1 ? 0 : (page * this.userlogsperPage) - this.userlogsperPage;
            this.UserLogs();
        },
        onUserLogsSort(field, order) {
            this.UserLogsSortField = field;
            this.UserLogsSortOrder = order;
            this.UserLogs();
        },
        openUserLogsMetadata(obj) {
            this.$buefy.modal.open({
                parent: this,
                component: LogsViewer,
                hasModalCard: true,
                canCancel: ['x'],
                customClass: 'custom-class custom-class-2',
                props: {
                    obj: obj
                }
            });
        },
        refreshUserLogs() {
            this.UserLogs();
        },

        UserLogins() {
            this.loading = true
            var params = [
                `page=${this.userloginsPage}`,
                `limit=${this.userloginsperPage}`,
                `search=${this.searchUserLogins}`,
                `sortField=${this.UserLoginsSortField}`,
                `sortOrder=${this.UserLoginsSortOrder}`,
            ].join('&')
            http.get('/events/logins?'+ params)
                .then(response => {
                    this.loading = false
                    this.user_logins = []

                    let currentTotal = response.data.count;
                    
                    
                    if (response.data.count / this.userloginsperPage > 1000) {

                        currentTotal = this.userloginsperPage * 1000
                    }
                    
                    this.userloginsTotal = currentTotal
                    response.data.rows.forEach((item) => {
                        this.user_logins.push(item)
                    })
                
                    
            }).catch(e =>{
                e;
                this.loading = false
        
            })
        },
        onUserLoginsPageChange(page){
            this.userloginsPage = page <= 1 ? 0 : (page * this.userloginsperPage) - this.userloginsperPage;
            this.UserLogins();
        },
        onUserLoginsSort(field, order) {
            this.UserLoginsSortField = field;
            this.UserLoginsSortOrder = order;
            this.UserLogins();
        },
        refreshUserLogins() {
            this.UserLogins();
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
            var daterange = `${this.$moment(this.set_from_date,'YYYY-MM-DD HH:mm')}`;
            workbook.xlsx.writeBuffer()
            .then(function(buffer) {
                saveAs(new Blob([buffer]), `[${daterange}] USER LOGS.xlsx`);
            });

            //this.$parent.close();
            this.downloadLoading = false;
        },
        exportUserLogins(value) {
            if (value == 'range'){
                this.$buefy.modal.open({
                    parent: this,
                    component: LogsExport,
                    hasModalCard: true,
                    canCancel: ['x'],
                    customClass: 'custom-class custom-class-2'
                });
            }else{
                var string_date = this.$moment(this.from_date).format('YYYY-M-D HH:mm:ss')
                var convert_date = new Date(string_date)
                convert_date.setHours(0,0,0,0)
                var new_date = this.$moment(convert_date).format('YYYY-M-D HH:mm:ss')
                var inputs = {
                    for:'login_logs',
                    with:'daterange',
                    from_date:new_date,
                    to_date:this.$moment(this.set_to_date).format('MMM DD, YYYY HH:mm:ss')
                   
                }
                console.log(inputs)
                this.downloadLoading = true;
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

            })
            }
        }
    },
    
    watch: {
        searchUserLogs:function (){
            this.userlogsPage = 0
            if (!this.awaiting_search){
             setTimeout(() => {
                    this.UserLogs();
                    this.awaiting_search = false;
                }, 2000); // 2 sec delay
            }
            this.awaiting_search = true;
        },
        searchUserLogins:function (){
            this.userloginsPage = 0
            if (!this.awaiting_search){
             setTimeout(() => {
                    this.UserLogins();
                    this.awaiting_search = false;
                }, 2000); // 2 sec delay
            }
            this.awaiting_search = true;
        }
    }
}
</script>
<style scoped>
.dropdown {
    margin-left:75%
}
</style>