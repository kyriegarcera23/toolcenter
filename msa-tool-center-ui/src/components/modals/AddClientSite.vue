<template>
    <div class="modal-card" style="width: 300px;overflow: visible;">
        <header class="modal-card-head has-background-success">
            <p class="modal-card-title has-text-white is-size-5">Add Client Site</p>
        </header>
        <section class="modal-card-body custom">
            <b-field
            v-bind:type="{'is-danger' : errors.client_id.length > 0}"
            :message="errors.client_id">

            <b-autocomplete
                v-model="selected_client.name" 
                :data="filterClients()" 
                field="name"
                placeholder="Select client..." 
                open-on-focus
                @select="option => {client = option;}"
                required>
                
                <i slot="noResult" class="is-size-6">No clients found</i>
            </b-autocomplete>
                <!-- <multiselect v-model="client"
                    :loading="loadingSelectionClient"
                    :disabled="loadingSelectionClient || loadingSelectionLocation"
                    open-direction="bottom"
                    track-by="client_id"
                    label="name"
                    :show-labels="false"
                    placeholder="Select Client..."
                    required
                    :options="clients"
                    :allow-empty="false">
                <i slot="noResult" class="is-size-6">No clients found</i>
                </multiselect> -->
            </b-field>
            <b-field
            v-bind:type="{'is-danger' : errors.location_id.length > 0}"
            :message="errors.location_id">
                <b-autocomplete
                v-model="selected_location.name" 
                :data="filterLocations()" 
                field="name"
                placeholder="Select Location..." 
                open-on-focus
                @select="option => {selected = option; location = option}"
                required>
                
                <i slot="noResult" class="is-size-6">No clients found</i>
            </b-autocomplete>

                <!-- <multiselect v-model="location"
                    :loading="loadingSelectionLocation"
                    :disabled="loadingSelectionLocation || clientIsNotChosen"
                    open-direction="bottom"
                    track-by="location_id"
                    label="name"
                    :show-labels="false"
                    placeholder="Select Location..."
                    required
                    :options="locations"
                    :allow-empty="false">
                <i slot="noResult" class="is-size-6">No locations found</i>
                </multiselect> -->
            </b-field>
            <b-field
            v-bind:type="{'is-danger' : errors.name.length > 0}"
            :message="errors.name">
                <b-input
                    type="text"
                    v-model="site_name"
                    placeholder="Site Name">
                </b-input>
            </b-field>
            <b-field>
                <b-input
                    type="text"
                    v-model="site_description"
                    placeholder="Description">
                </b-input>
            </b-field>
        </section>
        <footer class="modal-card-foot custom">
            <div class="is-pulled-right">
                <button class="button" type="button" @click="$parent.close()">Close</button>
                <b-button type="is-info" @click="saveSite()" :loading="saveLoading">Submit</b-button>
            </div>
        </footer>
    </div>
</template>

<script>
import http from '../../http_common';
export default {
    data() {
        return {
            clients: [],
            locations: [],
            Locations: [],
            client: {},
            selected_client: {},
            location: {},
            selected_location: {},
            site_name: '',
            site_description: '',
            errors: {
                client_id: [],
                location_id: [],
                name: []
            },
            saveLoading: false,
            clientIsNotChosen: true,
            loadingSelectionClient: false,
            loadingSelectionLocation: false
        }
    },
    mounted() {
        this.fetchClient();
        this.fetchLocation();
    },
    methods: {
        fetchClient() {
            this.loadingSelectionClient = true;
            http.get('/client-management/clients')
            .then(response => {
                for(var i=0;i<response.data.rows.length;i++)
                {
                    this.clients.push({
                        client_id: response.data.rows[i].id,
                        name: response.data.rows[i].name,
                        description: response.data.rows[i].description,
                        created_by: response.data.rows[i].created_by,
                        created_at: response.data.rows[i].created_at,
                        updated_at: response.data.rows[i].updated_at
                    });
                }
                this.loadingSelectionClient = false;
            });
        },
        fetchLocation() {
            this.loadingSelectionLocation = true;
            http.get('/client-management/locations')
            .then(response => {
                this.locations = response.data.rows;
                this.Locations = this.locations;
                this.loadingSelectionLocation = false;
            });
        },
        saveSite() {
            this.saveLoading = true;
            var selectedClient = {
                client_id: '',
                name: ''
            };
            var selectedLocation = {
                location_id: '',
                name: ''
            };

            if(this.client != {})
            {
                selectedClient = this.client
            }

            if(this.location != {})
            {
                selectedLocation = this.location
            }
            
            var inputs = {
                client_id: selectedClient.client_id,
                location_id: selectedLocation.id,
                name: this.site_name,
                description: this.site_description
            }

            http.post('/client-management/sites/add',inputs)
            .then(response => {
                var result = {
                    metadata: response,
                    additionalData: selectedClient,
                    additionalData2: selectedLocation
                };
                this.$emit('addClientSiteResponse', result);
                this.saveLoading = false;
                this.$parent.close();
            })
            .catch(e => {
                switch (e.response.status) {
                    case 422:
                        this.errors = e.response.data.errors;
                        this.errors = this.errorDisplay(this.errors);
                        break;
                    default:
                        this.$buefy.snackbar.open({
                            message: 'Oops!, There is something wrong, Please try again.',
                            type: 'is-danger',
                            position: 'is-bottom-right'
                        });
                        break;
                }
                this.saveLoading = false;
            });
        },
        errorDisplay(error)
        {
            let __error = {
                client_id: [],
                location_id: [],
                name: []
            };

            let results = Object.assign(__error, error);

            return results;
        },
        filterClients() {
            return this.clients.filter((data) => {
                var regex = new RegExp(this.selected_client.name, "i");
                return data.name.search(regex) !== -1;
            })
        },
        filterLocations() {
            var client_id = this.client ? this.client.client_id : '';
            return this.Locations.filter((data) => {
                var regex = new RegExp(this.selected_location.name, "i");
                return data.name.search(regex) !== -1 && data.client_id === client_id;
            })
        }
    }
}
</script>
