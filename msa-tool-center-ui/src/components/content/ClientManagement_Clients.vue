<template>
<div>
    <div class="card" style="overflow: visible;">
        <header class="modal-card-head has-background-info">
            <p class="modal-card-title has-text-white is-size-5 is-capitalized">Manage Clients</p>
            <div class="is-pulled-right">
                <button class="button is-success is-small" type="button" @click="addClient()" style="margin-right:10px;"><plus></plus> Client</button>
                <button class="button is-danger is-small" type="button" @click="deleteMultiClient()" :disabled="checkedRows.length == 0">Bulk <deleteOutline></deleteOutline></button>
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
                    :is-row-checkable="(row) => restrictedRowIds.includes(row.id) === false"
                    checkable
                    aria-next-label="Next page"
                    aria-previous-label="Previous page"
                    aria-page-label="Page"
                    aria-current-label="Current page"
                    class="is-size-7"
                    v-if="items.length != 0"
                    >

                        <template>
                            <b-table-column field="name" label="Client" sortable v-slot="props">
                                {{ props.row.name }}
                            </b-table-column>
                            <b-table-column field="description" label="Description" sortable  v-slot="props">
                                {{ props.row.description }}
                            </b-table-column>
                            <!-- <b-table-column field="name" label="Date Created" sortable width="30">
                                {{ formatDate(props.row.created_at, 'MMM DD, YYYY  hh:mm a') }}
                            </b-table-column> -->
                            <b-table-column  label="Action" v-slot="props">
                                <div class="field has-addons">
                                    <p class="control is-marginless">
                                        <button @click="editClient(props.row)" class="button is-light is-small">Edit</button>
                                    </p>
                                    <p class="control is-marginless">
                                        <button @click="deleteSpecClient(props.row)" class="button is-danger is-small" :disabled="props.row.Recipients.length > 0">
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
import AddClients from '../../components/modals/AddClients.vue'
import EditClients from '../../components/modals/EditClients.vue'

export default {
    data() {
        return {
            items: [],
            search_query: '',
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
            checkboxPosition: 'left'
        }
    },
    mounted() {
        this.fetchItems();
    },
    methods: {
        formatDate(value,date_format){
            if (value) {
                return this.$moment(String(value)).format(date_format)
            }
        },
        fetchItems() {
            this.isBusyItems = true;
            http.get('/client-management/clients')
            .then(response => {
                this.items = response.data.rows;
                this.findRestrictedRowIds();
                this.isBusyItems = false;
            });
        },
        itemsData() {
            return this.items.filter(obj => {
                
                let word = this.search_query.replace(/^\s+|\s+$/gm,'').toLowerCase();
                let name = obj.name.toLowerCase();
                let description = obj.description.toLowerCase();

                return name.includes(word) || description.includes(word);
            });
        },
        addClient() {
            this.$buefy.modal.open({
                parent: this,
                component: AddClients,
                hasModalCard: true,
                customClass: 'custom-class custom-class-2',
                canCancel: ['x'],
                
                events: {
                    'addClientsResponse': value => {
                        //console.log(value)
                        var new_item = value.metadata.data;
                        
                        //new_item.user = value.additionalDataUser;
                        //new_item.locations = value.additionalDataLocations;
                        new_item.Recipients = [];
                        //console.log(new_item)
                        this.items.unshift(new_item);
                        //console.log(new_item)
                        this.$buefy.snackbar.open({
                            message: 'Client has been added.',
                            type: 'is-success',
                            position: 'is-bottom-right'
                        });
                    }
                }
            })
        },
        editClient(client) {
            this.$buefy.modal.open({
                parent: this,
                component: EditClients,
                props: {
                    'selectedClient': client
                },
                hasModalCard: true,
                customClass: 'custom-class custom-class-2',
                canCancel: ['x'],
                events: {
                    'editClientsResponse': value => {
                        var new_item = value.metadata.data;
                        new_item.user = value.additionalDataUser;
                        new_item.locations = value.additionalDataLocations;
                        new_item.recipients = value.additionalDataRecipients;

                        this.items.map(item => {
                            if(item.id == new_item.id)
                            {
                                for (let key in new_item) {
                                    item[key] = new_item[key];
                                }
                            }
                        });

                        this.$buefy.snackbar.open({
                            message: 'Client has been updated.',
                            type: 'is-success',
                            position: 'is-bottom-right'
                        });
                    }
                }
            })
        },
        deleteSpecClient(client) {
            this.$buefy.dialog.confirm({
                message: 'Do you want to delete this client?',
                type: 'is-danger',
                onConfirm: () => {
                    this.isBusyItems = true;
                    http.delete('/client-management/clients/'+client.id)
                    .then(response => {
                        response;
                        this.deleteSpecClientFilterObject(client);
                        this.$buefy.snackbar.open({
                            message: 'Item has been deleted.',
                            type: 'is-danger',
                            position: 'is-bottom-right'
                        });
                    });
                }
            });
        },
        deleteSpecClientFilterObject(client) {
            this.items = this.items.filter(obj => {
                return obj.id != client.id;
            });
            this.isBusyItems = false;
        },
        deleteMultiClient() {
            let ids = [];
            for (var i = 0; i < this.checkedRows.length; i++)
            {
                ids.push(this.checkedRows[i].id);
            }
            
            this.$buefy.dialog.confirm({
                message: 'Do you want to delete these clients?',
                type: 'is-danger',
                onConfirm: () => {
                    this.isBusyItems = true;
                    http.delete('/client-management/clients/',{data:{ids:ids}})
                    .then(response => {
                        response;
                        this.deleteMultiClientFilterObject(ids);
                        this.$buefy.snackbar.open({
                            message: 'Item(s) have been deleted.',
                            type: 'is-danger',
                            position: 'is-bottom-right'
                        });
                    });
                }
            });
        },
        deleteMultiClientFilterObject(ids) {
            this.items = this.items.filter(obj => {
                return ids.includes(obj.id) === false;
            });
            this.isBusyItems = false;
        },
        findRestrictedRowIds() {
            for (var i = 0; i < this.items.length; i++)
            {
                if (this.items[i].Recipients.length > 0 || this.items[i].Recipients.length > 0)
                {
                    this.restrictedRowIds.push(this.items[i].id);
                }
            }
        }
    }
}
</script>

<style scoped>
.material-design-icon__svg {
    padding-top:5px;
}
</style>