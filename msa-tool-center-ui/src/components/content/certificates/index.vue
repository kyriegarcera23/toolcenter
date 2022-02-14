<template>
    <section>
        <div class="control has-icons-left is-pulled-left" v-if="data.length">
            <b-input  type="search" icon="magnify" v-model="search_query" placeholder="Search by domain.."></b-input>
        </div>
        <b-field grouped class="is-fullwidth is-pulled-right priority-switch-containter" v-if="data.length">
            <b-switch :rounded="false" size="is-small" v-model="states.low" @input="changePrio('low')" type="is-success">Low</b-switch>
            <b-switch :rounded="false" size="is-small" v-model="states.medium" @input="changePrio('medium')" type="is-warning">Medium</b-switch>
            <b-switch :rounded="false" size="is-small" v-model="states.high" @input="changePrio('high')" type="is-danger">High</b-switch>
            <!--<b-switch :rounded="false" v-model="isShowAll" @click.native="isPaginated = isShowAll" :disabled="data.length <= perPage">Show All</b-switch>-->
            <!-- <b-tooltip label="Download"
                type="is-dark"
                position="is-bottom"
                animated>
                <download-excel
                    :data="byPriority.length > 0 || checkAllPrio ? byPriority : filtered"
                    :fields="json_fields.certificates"
                    worksheet="My Worksheet"
                    :name="'[' + $moment().format('YYYY-MM-DD') + ']' + 'certificates.xls'">
                    <b-button type="is-link" size="is-small">
                        <feather class="icon" type="download" size="20"></feather>
                    </b-button>
                </download-excel>
            </b-tooltip> -->
            <button class="button is-small is-danger" :disabled="checkedRows.length == 0" v-if="$parent.canDo('delete-certificates')"
                @click="deleteCertificate(checkedRows, false)">
                <feather class="icon" type="trash-2" size="15"></feather> 
                <span> Delete Marked</span>
            </button>
        </b-field>
        <br><br>
        <div class="is-fullwidth text-center align-middle" style="min-height: 250px; margin-left:45%; " v-if="!isBusy && !data.length">
            <img src="/images/windy.svg" style="height: 100px; min-height: 100px; margin-bottom: 10px;"/><br>
            <i class="is-size-6">No certificates added yet</i>
        </div>

        <div class="is-fullwidth text-center align-middle" style="min-height: 250px;" v-else-if="!byPriority.length && checkAllPrio">
            <i class="is-size-6">There are no certificates with {{ states.low ? 'LOW' : states.medium ? 'MEDIUM' : 'HIGH' }} priority</i>
        </div>

        <b-table
            v-else
            :data="byPriority.length > 0 || checkAllPrio ? byPriority : filtered"
            :bordered="false"
            :hoverable="true"
            :per-page="perPage"
            :paginated="!isShowAll && data.length > perPage && !checkAllPrio"
            :current-page.sync="currentPage"
            :pagination-simple="isPaginationSimple"
            :pagination-position="paginationPosition"
            :default-sort-direction="defaultSortDirection"
            :sort-icon="sortIcon"
            :sort-icon-size="sortIconSize"
            default-sort="created_at"
            aria-next-label="Next page"
            aria-previous-label="Previous page"
            aria-page-label="Page"
            aria-current-label="Current page"
            class="is-size-7"
            checkbox-position="left"
            :checked-rows.sync="checkedRows"
            :checkable="$parent.canDo('delete-certificates')">

            <template>
                <!--<b-table-column field="id" label="ID" width="60" sortable numeric>
                    {{ props.row.certificate_id }}
                </b-table-column>-->

                <b-table-column field="domain_name" label="Domain" sortable v-slot="props">
                    {{ props.row.domain_name }}
                </b-table-column>

                <b-table-column field="issuer" label="Issuer" sortable v-slot="props">
                    {{ props.row.issuer }}
                </b-table-column>

                <b-table-column field="client" label="Client" sortable v-slot="props">
                        {{ props.row.Client.name }}
                </b-table-column>

                <b-table-column field="valid_to" label="Validity" width="95" sortable centered class="text-middle" v-slot="props">
                        {{ props.row.valid_to | formatDate('MMM DD, YYYY')}}
                </b-table-column>

                <b-table-column field="days" label="Days" sortable centered class="text-middle" width="65" numeric v-slot="props">
                    <span class="tag" :class="[props.row.priority == 'Low' ? 'is-success' : (props.row.priority == 'Medium' ? 'is-warning' : props.row.priority == 'High' ? 'is-danger' : 'is-light')]">
                        
                        {{ props.row.days }}
                    </span>
                </b-table-column>

                <b-table-column label="Status" centered class="text-middle" width="85" v-slot="props">
                    <span class="tag" :class="[props.row.valid_status == '1'? 'is-light' : 'is-danger']">
                        <feather :type="props.row.valid_status == '1'? 'check' : 'x'" size="15"></feather>&nbsp;{{ props.row.valid_status == '1' ? 'Valid' : 'Expired' }}
                    </span>
                </b-table-column>

                <b-table-column field="action" centered class="text-middle" width="85" v-if="$parent.canDo('delete-certificates')" v-slot="props">
                    <button @click="deleteCertificate(props.row)" class="button is-danger is-small">
                        <feather class="icon" type="trash-2" size="15" stroke="white"></feather>
                    </button>
                </b-table-column>
            </template>
        </b-table>
        <b-loading :is-full-page="false" style="min-height: 350px" :active.sync="loadingDelete" :can-cancel="false"></b-loading>
    </section>
</template>

<script>
 import http from '../../../http_common';
export default {
    
    props: ['data', 'hash', 'isBusy','fetch'],
    data() {
        return {
            search_query: null,
            byPriority: [],
            isPaginated: true,
            isShowAll: false,
            isPaginationSimple: false,
            paginationPosition: 'bottom',
            defaultSortDirection: 'asc',
            sortIcon: 'chevron-up',
            sortIconSize: 'is-small',
            currentPage: 1,
            perPage: 10,
            states: {
                low: false,
                medium: false,
                high: false
            },
            checkedRows: [],
            loadingDelete: false,
            json_fields: {
                'certificates': {
                    'Domain Name' : 'domain_name',
                    'Issuer' : 'issuer',
                    'Client' : 'client.name',
                    'Validity': {
                        field: 'valid_to',
                        callback: (value) => {
                            return this.$moment(value).format('MMM DD, YYYY');
                        }
                    },
                    'Expires In' : 'days',
                    'Status' : {
                        field: 'valid_status',
                        callback: (value) => {
                            return value == '1' ? 'Valid' : 'Expired';
                        }
                    },
                    'Priority' : 'priority'
                }
            },
        }
    },
    created() {
        
        if(this.data.length > this.perPage) {
            this.isPaginated = false;
            this.isShowAll = true;
        }

        if(this.$route.hash.substring(1)) {
            this.states[this.hash] = true;
            this.changePrio(this.hash)
        }
    },
    watch: {
        hash: function (newValue, oldValue) {
            newValue;
            oldValue;
            this.states[this.hash] = true;
            this.changePrio(this.hash);
        }
    },
    computed: {
        filtered () {
            
            if(!this.search_query){
                
                return this.data;
            }else{
                let search_query = this.search_query.replace(/^\s+|\s+$/gm,'').toLowerCase();
                let filtered = null;
                
                filtered = this.data.filter(
                    data => (data.domain_name.toLowerCase().includes(search_query) || 
                    data.issuer.toLowerCase().includes(search_query) ||
                    data.Client.name.includes(search_query)) /*&& 
                    ((data.priority == 'Low' && this.showLow ? true : false) ||
                    (data.priority == 'Medium' && this.showMedium ? true : false) ||
                    (data.priority == 'High' && this.showHigh ? true : false)
                    )*/
                );
                return filtered;
            }
        },
        checkAllPrio() {
            
            for(var index in this.states){
                if(this.states[index]){
                   
                    return true
                }
            }
            
            return false
        }
    },
    methods: {
        changePrio(val) {
            let that = this;
            

            Object.keys(this.states).forEach(function(key) {
                if(key != val) {
                    if(that.states[val]) {
                        that.states[key] = false;
                    }
                }
            });

            if(this.states[val]) {
                location.hash = val
                this.byPriority = this.filtered.filter(data => (data.priority.toLowerCase().includes(val)));
            }else {
                location.hash = ''
                this.byPriority = [];
            }
        },
        deleteCertificate(data, specific = true) {
            if (specific == true)
            {
                this.$buefy.dialog.confirm({
                    message: 'Do you want to delete this certificate?',
                    type: 'is-danger',
                    onConfirm: () => {
                        this.loadingDelete = true;
                        http.delete('/certificates/',{data:{ids:[data.id]}})
                        .then(response => {
                            response;
                            this.fetch();
                            this.loadingDelete = false;
                            this.$buefy.snackbar.open({
                                message: 'Certificate has been deleted.',
                                type: 'is-danger',
                                position: 'is-bottom-right'
                            });
                        });
                    }
                });
            }
            else
            {
                let arr_ids = [];

                for (var i = 0; i < data.length; i++)
                {
                    arr_ids.push(data[i].id);
                }

                this.$buefy.dialog.confirm({
                    message: 'Do you want to delete these selected '+data.length+' Certificate(s)?',
                    type: 'is-danger',
                    onConfirm: () => {
                        this.loadingDelete = true;
                         http.delete('/certificates/',{data:{ids:arr_ids}})
                        .then(response => {
                            response;
                            this.loadingDelete = false;
                            this.fetch();
                            //this.deleteCertificateFilterObj(arr_ids,false);
                            this.$buefy.snackbar.open({
                                message: 'Certificate(s) has been deleted.',
                                type: 'is-danger',
                                position: 'is-bottom-right'
                            });
                        });
                    }
                });
            }
        },
        deleteCertificateFilterObj(data,specific = true) {
            if (specific == true) {
                this.data = this.data.filter(obj => {
                    return obj.id != data.id;
                });
            } else {
                this.data = this.data.filter(obj => {
                    return data.includes(obj.id) === false;
                });
            }

            this.loadingDelete = false;
        }
    }
}
</script>
    