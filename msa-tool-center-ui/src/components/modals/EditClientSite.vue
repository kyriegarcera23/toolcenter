<template>
    <div class="modal-card" style="width: 300px;overflow: visible;">
        <header class="modal-card-head has-background-success">
            <p class="modal-card-title has-text-white is-size-5">Edit Client Site</p>
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
                @select="option => {selected = option; client = option}"
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
                :data="filterLocations()"
                v-model="location.name" 
                field="name"
                placeholder="Select Location..." 
                open-on-focus
                @select="option => {selected = option; location = option}"
                required>
                
                <i slot="noResult" class="is-size-6">No clients found</i>
            </b-autocomplete>
            </b-field>
            <b-field
            v-bind:type="{'is-danger' : errors.name.length > 0}"
            :message="errors.name">
                <b-input
                    type="text"
                    v-model="site_name"
                    placeholder="Site Name" required>
                </b-input>
            </b-field>
            <b-field>
                <b-input
                    type="text"
                    v-model="site_description"
                    placeholder="Description" required>
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
    props: ['selectedSite'],
    data() {
        return {
            clients: [],
            locations: [],
            Locations: [],
            client: {},
            selected_client: {},
            location: this.selectedSite.Location,
            site_name: this.selectedSite.name,
            site_description: this.selectedSite.description,
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
        if (this.selectedSite.client == this.client)
        {
            this.clientIsNotChosen = false;
        }
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

                    if(this.selectedSite.Location.client_id == response.data.rows[i].id)
                    {
                        this.client = response.data.rows[i];
                        this.selected_client = this.client;
                    }
                }
                this.loadingSelectionClient = false;
            });
        },
        fetchLocation() {
            this.loadingSelectionLocation = true;
            http.get('/client-management/locations')
            .then(response => {
                for(var i=0;i<response.data.rows.length;i++)
                {
                    this.locations.push({
                        client_id: response.data.rows[i].client_id,
                        created_at: response.data.rows[i].created_at,
                        description: response.data.rows[i].description,
                        location_id: response.data.rows[i].id,
                        name: response.data.rows[i].name,
                        updated_at: response.data.rows[i].updated_at
                    });
                }
                this.Locations = this.locations;

                if(this.locations.length > 0)
                {
                    this.locations = this.Locations.filter(option => {
                        return this.clients.client_id === option.client_id
                    });
                }

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
            

            if (this.client != {} && this.client != this.selectedSite.client)
            {
                selectedClient = this.client
            }
            else if (this.client != {} && this.client == this.selectedSite.client)
            {
                selectedClient = this.selectedSite.client
            }

            if(this.location != {} && this.location != this.selectedSite.Location.name)
            {
                selectedLocation = this.location
            }
            else if (this.location != {} && this.location == this.selectedSite.Location.name)
            {
                selectedLocation = this.selectedSite.location
            }
            var inputs = {
                location_id: selectedLocation.client_id,
                name: this.site_name,
                description: this.site_description
            }
            //console.log(inputs)

            http.post('/client-management/sites/update/'+this.selectedSite.id,inputs)
            .then(response => {
                var result = {
                    metadata: response,
                    additionalData: selectedClient,
                    additionalData2: selectedLocation,
                    additionalData3: this.selectedSite.area
                };
                this.$emit('editClientSiteResponse', result);
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
                
                this.$buefy.snackbar.open({
                    message: 'Oops!, There is something wrong, Please try again.',
                    type: 'is-danger',
                    position: 'is-bottom-right'
                });
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
            var client_id;
            if(this.client)
            {
                client_id = this.client.id ? this.client.id : this.client.client_id;
            }
            else
            {
                client_id = ''
            }

            return this.Locations.filter((data) => {
                var regex = new RegExp(this.location.name, "i");
                return data.name.search(regex) !== -1 && data.client_id == client_id
            })
        }
    }
}
</script>
