<template>
    <section>
        <div class="is-pulled-left m-b-10">
            <b-input placeholder="Search by domain.."
                type="search"
                icon="magnify"
                v-model="search_query"
            >
            </b-input>
        </div>
        <br>
        <br>
        <!-- <div class="is-pulled-left m-b-10" v-if="data.length">
            <b-input placeholder="Search" v-model="search_query"></b-input>
        </div> -->
        <b-table
            v-if="data.length"
            :data="filtered"
            :bordered="false"
            :hoverable="true"
            :paginated="true"
            :default-sort-direction="defaultSortDirection"
            :sort-icon="sortIcon"
            :sort-icon-size="sortIconSize"
            default-sort="id"
            aria-next-label="Next page"
            aria-previous-label="Previous page"
            aria-page-label="Page"
            aria-current-label="Current page"
            class="is-size-7">

            <template>
                <!--<b-table-column field="id" label="ID" width="60" sortable numeric>
                    {{ props.row.certificate.certificate_id }}
                </b-table-column>-->

                <b-table-column field="domain_name" label="Domain" sortable v-slot="props">
                    {{ props.row.Certificate.domain_name }}
                </b-table-column>

                <b-table-column field="issuer" label="Issuer" sortable v-slot="props">
                    {{ props.row.Certificate.issuer }}
                </b-table-column>

                <b-table-column field="client" label="Client" sortable v-slot="props">
                        {{ props.row.Client.name }}
                </b-table-column>

                <b-table-column field="created_at" label="Date Requested" sortable v-slot="props">
                        {{ props.row.createdAt | formatDate }}
                </b-table-column>

                <b-table-column field="requested_by" label="Requested By" sortable v-slot="props">
                        {{ props.row.Users.User.name }}
                </b-table-column>

                <b-table-column field="action" centered class="text-middle" width="165" v-slot="props">
                        <div class="field has-addons">
                            <p class="control is-marginless">
                                <button @click="$emit('confirmApproval', props.row, 'approved')" class="button is-success is-small">
                                <feather class="icon" type="check" size="15" stroke="white"></feather>
                                <span>Approve</span>
                                </button>
                            </p>
                            <p class="control is-marginless">
                                <button @click="$emit('confirmApproval', props.row, 'rejected')" class="button is-danger is-small">
                                <feather class="icon" type="x" size="15" stroke="white"></feather>
                                <span>Reject</span>
                                </button>
                            </p>
                        </div>
                </b-table-column>
            </template>
        </b-table>

        <div class="is-fullwidth text-center align-middle" style="min-height: 250px; margin-left:40px;" v-else>
            <i class="is-size-6">You have no pending approvals</i>
        </div>
    </section>
</template>

<script>
export default {
    props: ['data'],
    
    data() {
        return {
            search_query: '',
            isShowAll: false,
            isPaginationSimple: false,
            paginationPosition: 'bottom',
            defaultSortDirection: 'asc',
            sortIcon: 'chevron-up',
            sortIconSize: 'is-small',
            currentPage: 1,
            perPage: 10,
            awaiting_search:false,

        }
    },
    created() {
        if(this.data.length > this.perPage) {
            this.isPaginated = false;
            this.isShowAll = true;
        }
    },
    mounted(){
    },

    methods: {
    },
    computed:{
        filtered () {
            
            if(!this.search_query){
                
                return this.data;
            }else{
                let search_query = this.search_query.replace(/^\s+|\s+$/gm,'').toLowerCase();
                let filtered = null;
                
                filtered = this.data.filter(
                    data => (data.Certificate.domain_name.toLowerCase().includes(search_query)
                    ) /*&& 
                    ((data.priority == 'Low' && this.showLow ? true : false) ||
                    (data.priority == 'Medium' && this.showMedium ? true : false) ||
                    (data.priority == 'High' && this.showHigh ? true : false)
                    )*/
                    //data.issuer.toLowerCase().includes(search_query)
                );
                return filtered;
            }
        },
    }
}
</script>