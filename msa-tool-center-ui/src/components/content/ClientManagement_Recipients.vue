<template>
<div>
    <div class="card" style="overflow: visible;">
        <header class="modal-card-head has-background-info">
            <p class="modal-card-title has-text-white is-size-5 is-capitalized">Manage Recipients</p>
            <div class="is-pulled-right">
                <button class="button is-success is-small" type="button" @click="addRecipient()" style="margin-right:10px;"><plus></plus> Recipients</button>
                <button class="button is-danger is-small" type="button" @click="deleteMultiRecipient()" :disabled="checkedRows.length == 0">Bulk <deleteOutline></deleteOutline></button>
            </div>
        </header>
        <section class="card-body">
            <div class="columns" style="flex-wrap: wrap;padding:10px;">
                <div class="column is-12">
                    <div class="is-pulled-left m-b-10" v-if="items.length != 0">
                        <b-input placeholder="Search..."
                            type="search"
                            icon="magnify"
                            v-model="search_query">
                        </b-input>
                    </div>
                    <!-- <div class="is-pulled-right" v-if="items.length != 0">
                        <b-field>
                            <b-autocomplete
                                v-model="client_name"
                                placeholder="Filter by Client"
                                field="name"
                                @select="option => selectedClientName = option"
                                :keep-first="keepFirst"
                                :open-on-focus="openOnFocus"
                                :data="filteredDataObj"
                                :clearable="clearable"
                                :loading="loadingSelection"
                            >
                            </b-autocomplete>
                            <p class="control">
                                <span class="button is-static"><feather type="filter" size="18"></feather></span>
                            </p>
                        </b-field>
                    </div> -->
                </div>
                <div class="column is-12">
                    <b-table
                    :data="itemsData()"
                    :hoverable="true"
                    :paginated="isPaginated"
                    :per-page="perPage"
                    :current-page.sync="currentPage"
                    :pagination-simple="isPaginationSimple"
                    :pagination-position="paginationPosition"
                    :default-sort-direction="defaultSortDirection"
                    :sort-icon="sortIcon"
                    :sort-icon-size="sortIconSize"
                    :checkbox-position="checkboxPosition"
                    :checked-rows.sync="checkedRows"
                    :is-row-checkable="(row) => restrictedRowIds.includes(row.recipient_id) === false"
                    checkable
                    aria-next-label="Next page"
                    aria-previous-label="Previous page"
                    aria-page-label="Page"
                    aria-current-label="Current page"
                    class="is-size-7"
                    v-if="items.length != 0"
                    >

                        <template>
                            <b-table-column field="name" label="Name" sortable v-slot="props">
                                {{ props.row.name }}
                            </b-table-column>
                            <b-table-column field="email" label="Email" sortable  v-slot="props">
                                {{ props.row.email }}
                            </b-table-column>
                            <b-table-column field="description" label="Description" sortable  v-slot="props">
                                {{ props.row.description }}
                            </b-table-column>
                            <b-table-column field="name" label="Client Name" sortable  v-slot="props">
                                {{ props.row.Client.name }}
                            </b-table-column>
                            <!-- <b-table-column field="name" label="Date Created" sortable width="30">
                                {{ formatDate(props.row.created_at, 'MMM DD, YYYY  hh:mm a') }}
                            </b-table-column> -->
                            <b-table-column label="Actions"  v-slot="props">
                                <div class="field has-addons">
                                    <p class="control is-marginless">
                                        <button @click="editRecipient(props.row)" class="button is-light is-small">Edit</button>
                                    </p>
                                    <p class="control is-marginless">
                                        <button @click="deleteSpecRecipient(props.row)" class="button is-danger is-small">
                                            <feather type="trash-2" size="18"></feather>
                                        </button>
                                    </p>
                                </div>
                            </b-table-column>
                        </template>
                    </b-table>
                    <b-loading :is-full-page="false" style="min-height: 350px" :active.sync="isBusyItems" :can-cancel="false"></b-loading>
                    <div class="is-fullwidth text-center align-middle" style="min-height: 300px;margin-top:-100px;" v-if="isBusyItems == false && items.length == 0">
                        <img src="/images/windy.svg" style="height: 100px; min-height: 100px; margin-bottom: 10px;"/><br>
                        <i class="is-size-6">No data entry.</i>
                    </div>
                </div>
            </div>
        </section>
    </div>
</div>
</template>

<script>
import http from '../../http_common';
import AddClientRecipient from '../../components/modals/AddClientRecipient.vue'
import EditClientRecipient from '../../components/modals/EditClientRecipient.vue'

export default {
    props: ['account'],
    data() {
        return {
            items: [],
            search_query: '',
            selectedClientName: {},
            clients: [],
            client_name: '',
            checkedRows: [],
            restrictedRowIds: [],
            isBusyItems: false,
            //b-table
            isPaginated: true,
            isPaginationSimple: false,
            paginationPosition: 'bottom',
            defaultSortDirection: 'asc',
            sortIcon: 'arrow-up',
            sortIconSize: 'is-small',
            currentPage: 1,
            perPage: 10,
            checkboxPosition: 'left',
            //dynamic selection settings
            keepFirst: false,
            openOnFocus: true,
            clearable: true,
            loadingSelection: false
        }
    },
    mounted() {
        this.fetchItems();
        this.fetchClient();
    },
    computed: {
        filteredDataObj() {
            return this.clients.filter(option => {
                return (
                    option.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.client_name.toLowerCase()) >= 0
                )
            })
        }
    },
    methods: {
        formatDate(value,date_format){
            if (value) {
                return this.$moment(String(value)).format(date_format)
            }
        },
        fetchItems() {
            this.isBusyItems = true;
            http.get('/client-management/recipients')
            .then(response => {
                this.items = response.data.rows;
                // this.findRestrictedRowIds();
                this.isBusyItems = false;
            });
        },
        itemsData() {
            return this.items.filter(obj => {
                let word = this.search_query.replace(/^\s+|\s+$/gm,'').toLowerCase();
                let name = obj.name.toLowerCase();
                let client_name = obj.Client.name.toLowerCase();

                if (this.selectedClientName === null || typeof this.selectedClientName.client_id === 'undefined')
                {
                    return name.includes(word) || client_name.includes(word);
                }
                else
                {
                    return (name.includes(word) || client_name.includes(word)) && this.selectedClientName.client_id == obj.client_id;
                }
            });
        },
        addRecipient() {
            this.$buefy.modal.open({
                parent: this,
                component: AddClientRecipient,
                hasModalCard: true,
                customClass: 'custom-class custom-class-2',
                canCancel: ['x'],
                props: {account : this.account},
                events: {
                    'addClientRecipientResponse': value => {
                        
                        var new_item = value.metadata.data;
                        new_item.client = value.additionalData;
                        this.fetchItems();
                        //this.items.unshift(new_item);
                        this.$buefy.snackbar.open({
                            message: 'Recipient has been added.',
                            type: 'is-success',
                            position: 'is-bottom-right'
                        });
                    }
                }
            })
        },
        editRecipient(recipient) {
            this.$buefy.modal.open({
                parent: this,
                component: EditClientRecipient,
                props: {
                    'selectedRecipient': recipient,
                    account:this.account
                },
                hasModalCard: true,
                customClass: 'custom-class custom-class-2',
                canCancel: ['x'],
                events: {
                    'editClientRecipientResponse': value => {
                        var new_item = value.metadata.data;
                        new_item.client = value.additionalData;
                       


                        this.items.map(item => {
                            if(item.id == new_item.id)
                            {
                                item.Client = new_item.client
                                item.name = new_item.name
                                item.email = new_item.email
                                item.description = new_item.description
                                item.client_id = new_item.client_id
                                // for (let key in new_item) {
                                //     item[key] = new_item[key];
                                // }
                            }
                        });

                        this.$buefy.snackbar.open({
                            message: 'Recipient has been updated.',
                            type: 'is-success',
                            position: 'is-bottom-right'
                        });
                    }
                }
            })
        },
        fetchClient() {
            this.loadingSelection = true;
            http.get('/client-management/clients')
            .then(response => {
                this.clients = response.data.rows;
                this.loadingSelection = false;
            });
        },
        deleteSpecRecipient(recipient) {
            this.$buefy.dialog.confirm({
                message: 'Do you want to delete this recipient?',
                type: 'is-danger',
                onConfirm: () => {
                    this.isBusyItems = true;
                    http.delete('/client-management/recipients/'+recipient.id)
                    .then(response => {
                        response
                        this.deleteSpecRecipientFilterObject(recipient);
                        this.$buefy.snackbar.open({
                            message: 'Item has been deleted.',
                            type: 'is-danger',
                            position: 'is-bottom-right'
                        });
                    });
                }
            });
        },
        deleteSpecRecipientFilterObject(recipient) {
            this.items = this.items.filter(obj => {
                return obj.id != recipient.id;
            });
            this.isBusyItems = false;
        },
        deleteMultiRecipient() {
            let recipient_ids = [];
            for (var i = 0; i < this.checkedRows.length; i++)
            {
                recipient_ids.push(this.checkedRows[i].id);
            }
            this.$buefy.dialog.confirm({
                message: 'Do you want to delete these recipient?',
                type: 'is-danger',
                onConfirm: () => {
                    this.isBusyItems = true;
                    http.delete('/client-management/recipients/',{data:{ids:recipient_ids}})
                    .then(response => {
                        response
                        this.deleteMultiRecipientFilterObject(recipient_ids);
                        this.$buefy.snackbar.open({
                            message: 'Item(s) have been deleted.',
                            type: 'is-danger',
                            position: 'is-bottom-right'
                        });
                    });
                }
            });
        },
        deleteMultiRecipientFilterObject(recipient_ids) {
            this.items = this.items.filter(obj => {
                return recipient_ids.includes(obj.id) === false;
            });
            this.isBusyItems = false;
        },
        // findRestrictedRowIds() {
        //     for (var i = 0; i < this.items.length; i++)
        //     {
        //         if (this.items[i].area.length > 0)
        //         {
        //             this.restrictedRowIds.push(this.items[i].recipient_id);
        //         }
        //     }
        // }
    }
}
</script>

<style scoped>
.material-design-icon__svg {
    padding-top:5px;
}
</style>