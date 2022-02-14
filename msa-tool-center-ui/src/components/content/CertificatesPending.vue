<template>
    <section>
        <div class="is-pulled-left m-b-10" v-if="pending.length">
            <b-input placeholder="Search" v-model="search_query"></b-input>
        </div>
        <b-table
            v-if="pending.length"
            :data="pending"
            :bordered="true"
            :hoverable="true"
            :paginated="false"
            default-sort-direction="desc"
            sort-icon="chevron-up"
            sort-icon-size="is-small"
            default-sort="days"
            aria-next-label="Next page"
            aria-previous-label="Previous page"
            aria-page-label="Page"
            aria-current-label="Current page"
            class="is-size-7">

            <template slot-scope="props">
                <!--<b-table-column field="id" label="ID" width="60" sortable numeric>
                    {{ props.row.certificate.certificate_id }}
                </b-table-column>-->

                <b-table-column field="domain_name" label="Domain" sortable>
                    {{ props.row.certificate.domain_name }}
                </b-table-column>

                <b-table-column field="issuer" label="Issuer" sortable>
                    {{ props.row.certificate.issuer }}
                </b-table-column>

                <b-table-column field="client" label="Client" sortable>
                        {{ props.row.certificate.client.name }}
                </b-table-column>

                <b-table-column field="created_at" label="Date Requested" sortable>
                        {{ props.row.created_at | formatDate }}
                </b-table-column>

                <b-table-column field="requested_by" label="Requested By" sortable>
                        {{ props.row.user.name }}
                </b-table-column>

                <b-table-column field="action" centered class="text-middle" width="165">
                        <div class="field has-addons">
                            <p class="control is-marginless">
                                <button @click="confirmApproval(props.row, 'approved')" class="button is-success is-small">
                                <feather class="icon" type="check" size="15" stroke="white"></feather>
                                <span>Approve</span>
                                </button>
                            </p>
                            <p class="control is-marginless">
                                <button @click="confirmApproval(props.row, 'rejected')" class="button is-danger is-small">
                                <feather class="icon" type="x" size="15" stroke="white"></feather>
                                <span>Reject</span>
                                </button>
                            </p>
                        </div>
                </b-table-column>
            </template>
        </b-table>

        <div class="is-fullwidth text-center align-middle" style="min-height: 250px margin-left:40px;" v-else>
            <i class="is-size-6">You have no pending approvals</i>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            pending: [],
            search_query: '',
            isBusy: true
        }
    },
    created() {
        this.fetchPending()
    },
    methods: {
        fetchPending() {
            this.$axios
            .get('/api/approvals?type=certificate')
            .then(response => {
                this.pending = response.data.data;
                this.isBusy = false;
            });
        }
    }
}
</script>

<style scoped>
.customMargin {
    padding-left: 40px;
}

</style>