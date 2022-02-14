<template>
<div>
    <div class="card" style="overflow: visible;">
        <header class="modal-card-head has-background-info">
            <p class="modal-card-title has-text-white is-size-5 is-capitalized">Manage Areas</p>
            <div class="is-pulled-right">
                <button class="button is-success is-small" type="button" @click="addArea()" style="margin-right:10px;"><plus></plus> Area</button>
                <button class="button is-danger is-small" type="button" @click="deleteMultiArea()" :disabled="checkedRows.length == 0">Bulk <deleteOutline></deleteOutline></button>
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
                    checkable
                    aria-next-label="Next page"
                    aria-previous-label="Previous page"
                    aria-page-label="Page"
                    aria-current-label="Current page"
                    class="is-size-7"
                    v-if="items.length != 0"
                    >

                        <template >
                            <b-table-column field="name" label="Area" sortable v-slot="props">
                                {{ props.row.name }}
                            </b-table-column>
                            <b-table-column field="description" label="Description" sortable v-slot="props">
                                {{ props.row.description }}
                            </b-table-column>
                            <b-table-column field="name" label="Site" sortable v-slot="props">
                                {{ props.row.Site.name }}
                            </b-table-column>
                            <b-table-column field="name" label="Location" sortable v-slot="props">
                                {{ getLocation(props.row.Site.location_id).name }}
                            </b-table-column>
                            <b-table-column field="name" label="Client" sortable v-slot="props">
                                {{ getClient(getLocation(props.row.Site.location_id).client_id).name }}
                            </b-table-column>
                            <b-table-column label=" Actions" v-slot="props">
                                <div class="field has-addons">
                                    <p class="control is-marginless">
                                        <button @click="editArea(props.row)" class="button is-light is-small">Edit</button>
                                    </p>
                                    <p class="control is-marginless">
                                        <button @click="deleteSpecArea(props.row)" class="button is-danger is-small">
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
import AddClientArea from '../../components/modals/AddClientArea.vue'
import EditClientArea from '../../components/modals/EditClientArea.vue'

export default {
    data() {
        return {
            items: [],
            search_query: '',
            selectedClientName: {},
            clients: [],
            client_name: '',
            locations:[],
            newLocationName:'',
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
        this.fetchLocation();
        
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
            http.get('/client-management/areas')
            .then(response => {
                this.items = response.data.rows;

                this.isBusyItems = false;
            });
        },
        fetchLocation() {
            this.isBusyItems = true;
            http.get('/client-management/locations')
            .then(response => {
                this.locations = response.data.rows;
                this.isBusyItems = false;
            });
        },
        itemsData() {
            return this.items.filter(obj => {
                let word = this.search_query.replace(/^\s+|\s+$/gm,'').toLowerCase();
                let name = obj.name.toLowerCase();

                return name.includes(word);
            });
        },
        addArea() {
            this.$buefy.modal.open({
                parent: this,
                component: AddClientArea,
                hasModalCard: true,
                customClass: 'custom-class custom-class-2',
                canCancel: ['x'],
                events: {
                    'addClientAreaResponse': value => {
                        var new_item = value.metadata.data;
                        new_item.Site = value.additionalData3;
                        this.items.unshift(new_item);
                        this.$buefy.snackbar.open({
                            message: 'Area has been added.',
                            type: 'is-success',
                            position: 'is-bottom-right'
                        });
                    }
                }
            })
        },
        editArea(area) {
            let that = this;
            this.$buefy.modal.open({
                parent: this,
                component: EditClientArea,
                props: {
                    'selectedArea': area,
                    'selectedLocation': that.getLocation(area.Site.location_id ? area.Site.location_id : area.Site.id)
                },
                hasModalCard: true,
                customClass: 'custom-class custom-class-2',
                canCancel: ['x'],
                events: {
                    'editClientAreaResponse': value => {
                        var new_item = value.metadata.data;
                        new_item.Site = value.additionalData3;

                        this.items.map(item => {
                            if(item.id == new_item.id)
                            {
                                item.name = new_item.name
                                item.description = new_item.description
                                item.Site = new_item.Site
                            }
                        });

                        this.$buefy.snackbar.open({
                            message: 'Area has been updated.',
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
        deleteSpecArea(area) {
            this.$buefy.dialog.confirm({
                message: 'Do you want to delete this area?',
                type: 'is-danger',
                onConfirm: () => {
                    this.isBusyItems = true;
                    http.delete('/client-management/areas/'+area.id)
                    .then(response => {
                        response
                        this.deleteSpecAreaFilterObject(area);
                        this.$buefy.snackbar.open({
                            message: 'Item has been deleted.',
                            type: 'is-danger',
                            position: 'is-bottom-right'
                        });
                    });
                }
            });
        },
        deleteSpecAreaFilterObject(area) {
            this.items = this.items.filter(obj => {
                return obj.id != area.id;
            });
            this.isBusyItems = false;
        },
        deleteMultiArea() {
            let area_ids = [];
            for (var i = 0; i < this.checkedRows.length; i++)
            {
                area_ids.push(this.checkedRows[i].id);
            }
            this.$buefy.dialog.confirm({
                message: 'Do you want to delete these areas?',
                type: 'is-danger',
                onConfirm: () => {
                    this.isBusyItems = true;
                    http.delete('/client-management/areas',{data:{ids:area_ids}})
                    .then(response => {
                        response
                        this.deleteMultiAreaFilterObject(area_ids);
                        this.$buefy.snackbar.open({
                            message: 'Item(s) have been deleted.',
                            type: 'is-danger',
                            position: 'is-bottom-right'
                        });
                    });
                }
            });
        },
        deleteMultiAreaFilterObject(area_ids) {
            this.items = this.items.filter(obj => {
                return area_ids.includes(obj.id) === false;
            });
            this.isBusyItems = false;
        },
        getClient(client_id) {
            var client = this.clients.filter((data) => { return data.id == client_id})
            return client.length > 0 ? client[0]: '';
        },
        getLocation(location_id) {
            var location = this.locations.filter((data) => { return data.id == location_id})
            return location.length > 0 ? location[0] : '';
        }
    }
}
</script>

<style scoped>
.material-design-icon__svg {
    padding-top:5px;
}
</style>