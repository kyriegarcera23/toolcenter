<template>
    <div class="modal-card" style="width: 300px;overflow: visible;">
        <header class="modal-card-head has-background-success">
            <p class="modal-card-title has-text-white is-size-5">Edit Client Area</p>
        </header>
        <section class="modal-card-body custom">
            <b-field
            v-bind:type="{'is-danger' : errors.client_id.length > 0}"
            :message="errors.client_id">
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
            </b-field>
            
            
            <b-field
            v-bind:type="{'is-danger' : errors.site_id.length > 0}"
            :message="errors.site_id">
            <b-autocomplete 
                :data="filterSites()"
                v-model="selected_site.name"
                field="name"
                placeholder="Select Sites..." 
                open-on-focus
                @select="option => {selected = option; site = option}"
                required>
                
                <i slot="noResult" class="is-size-6">No clients found</i>
            </b-autocomplete>
            </b-field>
            <b-field
            v-bind:type="{'is-danger' : errors.name.length > 0}"
            :message="errors.name">
                <b-input
                    type="text"
                    v-model="area_name"
                    placeholder="Area Name">
                </b-input>
            </b-field>
            <b-field>
                <b-input
                    type="text"
                    v-model="area_description"
                    placeholder="Description">
                </b-input>
            </b-field>
        </section>
        <footer class="modal-card-foot custom">
            <div class="is-pulled-right">
                <button class="button" type="button" @click="$parent.close()">Close</button>
                <b-button type="is-info" @click="saveArea()" :loading="saveLoading">Submit</b-button>
            </div>
        </footer>
    </div>
</template>

<script>
import http from '../../http_common';
export default {
    props: ['selectedArea','selectedLocation'],
    data() {
        return {
            clients: [],
            locations: [],
            Locations: [],
            sites: [],
            Sites: [],
            client: {},
            selected_client: {},
            location: {},
            selected_location: {},
            site: this.selectedArea.Site,
            selected_site: this.selectedArea.Site,
            area_name: this.selectedArea.name,
            area_description: this.selectedArea.description,
            errors: {
                client_id: [],
                location_id: [],
                site_id: [],
                name: []
            },
            saveLoading: false,
            clientIsNotChosen: true,
            locationIsNotChosen: true,
            loadingSelectionClient: false,
            loadingSelectionLocation: false,
            loadingSelectionSite: false
        }
    },
    mounted() {
        this.fetchClient();
        this.fetchLocation();
        this.fetchSite();

        if (this.selectedArea.client == this.client)
        {
            this.clientIsNotChosen = false;
        }

        if (this.selectedArea.location == this.location)
        {
            this.locationIsNotChosen = false;
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

                    if(this.selectedLocation.client_id == response.data.rows[i].id)
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

                    if(this.selectedArea.Site.location_id == response.data.rows[i].id)
                    {
                        this.location = response.data.rows[i];
                        this.selected_location = this.location;
                    }
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
        fetchSite() {
            this.loadingSelectionSite = true;
            http.get('/client-management/sites')
            .then(response => {
                for(var i=0;i<response.data.rows.length;i++)
                {
                    this.sites.push({
                        location_id: response.data.rows[i].location_id,
                        createdAt: response.data.rows[i].createdAt,
                        description: response.data.rows[i].description,
                        site_id: response.data.rows[i].id,
                        name: response.data.rows[i].name,
                        updatedAt: response.data.rows[i].updatedAt
                    });
                }
                this.Sites = this.sites;

                if(this.sites.length > 0)
                {
                    this.sites = this.Sites.filter(option => {
                        return this.locations.location_id === option.location_id
                    });
                }

                this.loadingSelectionSite = false;
            });
        },
        saveArea() {
            this.saveLoading = true;
            var selectedClient = {
                client_id: '',
                name: ''
            };
            var selectedLocation = {
                location_id: '',
                name: ''
            };
            var selectedSite = {
                site_id: '',
                name: ''
            };
            

            if (this.client != {} && this.client != this.selectedArea.client)
            {
                
                selectedClient = this.client
            }
            else if (this.client != {} && this.client == this.selectedArea.client)
            {
                selectedClient = this.selectedArea.client
            }

            if(this.location != {} && this.location != this.selectedArea.name)
            {
                
                selectedLocation = this.location
            }
            else if (this.location != {} && this.location == this.selectedArea.name)
            {
                selectedLocation = this.selectedArea.location
            }

            if(this.site != {} && this.site != this.selectedArea.Site.name)
            {
                selectedSite = this.site
            }
            else if (this.site != {} && this.site == this.selectedArea.Site.name)
            {
                selectedSite = this.selectedArea.site
            }
            var inputs = {
                site_id: selectedSite.site_id ? selectedSite.site_id : selectedSite.id,
                name: this.area_name,
                description: this.area_description
            }

            http.post('/client-management/areas/update/'+this.selectedArea.id, inputs)
            .then(response => {
                var result = {
                    metadata: response,
                    additionalData: selectedClient,
                    additionalData2: selectedLocation,
                    additionalData3: selectedSite
                };
                this.$emit('editClientAreaResponse', result);
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
            var client_id;
            if(this.client)
            {
                client_id = this.client.id ? this.client.id : this.client.client_id;
            }
            else
            {
                client_id = ''
            }

            var location_name = this.location ? this.location.name : '';

            return this.Locations.filter((data) => {
                var regex = new RegExp(location_name, "i");
                return data.name.search(regex) !== -1 && data.client_id == client_id;
            })
        },
        filterSites() {
            var location_id;
            if(this.location)
            {
                location_id = this.location.id ? this.location.id : this.location.location_id;
            }
            else
            {
                location_id = ''
            }

            var site_name = this.site ? this.site.name : '';

            return this.Sites.filter((data) => {
                var regex = new RegExp(site_name, "i");
                return data.name.search(regex) !== -1 && data.location_id == location_id;
            })
        }
    }
}
</script>
