<template>
<div>
    <section style="margin-top:50px;">
        <div class="columns">
            <div class="column is-3" style="margin-left:20px">
                <div class="column is-12 is-paddingless" style="height: 75px; text-align: center; margin-bottom: 15px;">
                    <img :src="'/images/' + active_client + '.png'" style="max-height: 75px; width: auto; padding: 0px 10px"/>
                </div>
                <div class="tile box is-marginless m-b-5" style="padding: 15px;margin-bottom:5px!important;"
                    v-for="(client, key) in clients" :key="key"
                    @click="loadDigestData(client.code)"
                    :class="{'has-background-dark has-text-white' : client.code == active_client}">
                    <span style="width: 90%">{{ client.code }}</span>
                    <feather type="chevron-right" class="is-pulled-right"></feather>
                </div>
            </div>
            <div class="column is-auto">
                <div class="is-pulled-left">
                    <b-input placeholder="Search by created by.."
                        type="search"
                        icon="magnify"
                        v-model="searchDigest"
                        >
                    </b-input>
                </div>

                <div v-if="$parent.$parent.canDo('create-daily-digest')" class="is-pulled-right m-b-10">
                    <button class="button is-info is-small" @click="$emit('addDigest', active_client)">
                        <plus></plus>
                        <span> Create Digest</span>
                    </button>
                </div>

                <b-table
                    style="margin-top:50px;"
                    v-if="digest_data.length"
                    :data ="digest_data"
                    paginated
                    backend-pagination
                    :total="digestTotal"
                    :per-page="digestperPage"
                    :loading="loading"
                    
                    @page-change="onDigestPageChange"
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
                    :default-sort="[DigestSortField, DigestSortOrder]"
                    @sort="onDigestSort"
                
                    >

                        <b-table-column field="digest_date" label="Digest Date" sortable v-slot="props">
                            <span class="tag is-gray">
                                {{ $moment(props.row.digest_date).format("DD MMM YYYY")}}
                            </span>
                        </b-table-column>

                        <b-table-column field="model_number" label="Created By" :sortable="false" v-slot="props" >
                            {{ props.row.Users.User.name}}
                        </b-table-column>

                        <b-table-column field="createdAt" label="Time Generated" sortable v-slot="props">
                            {{ $moment(props.row.createdAt).format("DD MMM YYYY @ LT") }}
                        </b-table-column>

                        <b-table-column field="is_draft" label="Status" sortable v-slot="props">
                            <span class="tag" :class="[props.row.is_draft == '1'? 'is-light' : 'is-success']">
                                {{ props.row.is_draft == '1' ? 'Draft' : 'Sent' }}
                            </span>
                        </b-table-column>

                        <b-table-column field="action" centered class="text-middle" :sortable="false" width="70px" v-slot="props">
                            <button class="button is-dark is-small" @click="$emit('viewDigest', props.row)">
                                <span>View</span>
                                <feather class="icon" type="chevron-right" size="15" stroke="white"></feather>
                            </button>
                        </b-table-column>
                </b-table>
            </div>
        </div>
    </section>
</div>

</template>


<script>
import http from '../../../http_common';

export default {
    data() {
        return {
            active_client: this.$route.params.active_client || 'EWB',
            clients: [
                {
                    code: "EWB",
                    description: "Eastwest Bank",
                    category: "SOC"
                },
                {
                    code: "IL",
                    description: "Insular Life",
                    category: "SOC"
                },
                {
                    code: "BOC",
                    description: "Bank of Commerce",
                    category: "SOC"
                },
                {
                    code: "DBP",
                    description: "Development Bank of PH",
                    category: "SOC"
                }
            ],

            awaiting_search: false,
            loading: false,
            isPaginated: true,
            isShowAll: false,
            isPaginationSimple: false,
            paginationPosition: 'bottom',
            defaultSortDirection: 'asc',
            sortIcon: 'chevron-up',
            sortIconSize: 'is-small',

            digest_data: [],
            searchDigest:'',
            DigestSortField: 'createdAt',
            DigestSortOrder: 'desc',
            digestPage:0,
            digestTotal:0,
            digestperPage:10,
        }
    },
    methods: {
        loadDigestData(code) {
           this.active_client = code;
           this.loading = true;
            var params = [
                `page=${this.digestPage}`,
                `limit=${this.digestperPage}`,
                `search=${this.searchDigest}`,
                `sortField=${this.DigestSortField}`,
                `sortOrder=${this.DigestSortOrder}`,
                `digest_client=${this.active_client}`,
            ].join('&')
            http.get('/dailydigests?'+ params)
                .then(response => {
                    
                    this.digest_data = []

                    let currentTotal = response.data.count;
                    
                    
                    if (response.data.count / this.digestperPage > 1000) {

                        currentTotal = this.digestperPage * 1000
                    }
                    
                    this.digestTotal = currentTotal
                    response.data.rows.forEach((item) => {
                        this.digest_data.push(item)
                    })
                
                    this.loading = false;
            });
        },
        onDigestPageChange(page){
            this.digestPage = page <= 1 ? 0 : (page * this.digestperPage) - this.digestperPage;
            this.loadDigestData(this.active_client);
        },
        onDigestSort(field, order) {
            this.DigestSortField = field;
            this.DigestSortOrder = order;
            this.loadDigestData(this.active_client);
        },
        
    },
    mounted() {
        this.loadDigestData(this.active_client);
    },
    watch: {
        searchDigest:function (){
            this.digestPage = 0
            if (!this.awaiting_search){
             setTimeout(() => {
                    this.loadDigestData(this.active_client);
                    this.awaiting_search = false;
                }, 2000); // 2 sec delay
            }
            this.awaiting_search = true;
        }
    }
}
</script>


<style scoped>

</style>