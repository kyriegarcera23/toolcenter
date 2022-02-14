<template>
    <div class="modal-card" style="width: 300px;overflow: visible;">
        <header class="modal-card-head has-background-success">
            <p class="modal-card-title has-text-white is-size-5">Edit Client Recipient</p>
        </header>
        <section class="modal-card-body custom">
            <b-field
            v-bind:type="{'is-danger' : errors.client_id.length > 0}"
            :message="errors.client_id">

            <b-autocomplete 
                :data="filterClients()"
                v-model="selected_client.name"
                field="name"
                placeholder="Select client..." 
                open-on-focus
                @select="option => {selected = option; client = option}"
                required>
                <i slot="noResult" class="is-size-6">No clients found</i>
            </b-autocomplete>
                <!-- <multiselect v-model="client"
                    :loading="loadingSelection"
                    :disabled="loadingSelection"
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
            v-bind:type="{'is-danger' : errors.name.length > 0}"
            :message="errors.name">
                <b-input
                    type="text"
                    v-model="recipient_name"
                    placeholder="Recipient Name">
                </b-input>
            </b-field>
            <b-field
            v-bind:type="{'is-danger' : errors.email.length > 0}"
            :message="errors.email">
                <b-input
                    type="email"
                    v-model="recipient_email"
                    placeholder="Recipient email">
                </b-input>
            </b-field>
            <b-field>
                <b-input
                    type="text"
                    v-model="recipient_description"
                    placeholder="Description">
                </b-input>
            </b-field>
        </section>
        <footer class="modal-card-foot custom">
            <div class="is-pulled-right">
                <button class="button" type="button" @click="$parent.close()">Close</button>
                <b-button type="is-info" @click="saveRecipient()" :loading="saveLoading">Save</b-button>
            </div>
        </footer>
    </div>
</template>

<script>
import http from '../../http_common';
export default {
    props: ['selectedRecipient','account'],
    data() {
        return {
            clients: [],
            selected_client: this.selectedRecipient.Client,
            client: this.selectedRecipient.Client,
            recipient_name: this.selectedRecipient.name,
            recipient_description: this.selectedRecipient.description,
            recipient_email: this.selectedRecipient.email,
            errors: {
                client_id: [],
                name: [],
                email: []
            },
            saveLoading: false,
            loadingSelection: false
        }
    },
    mounted() {
        this.fetchClient();
    },
    methods: {
        fetchClient() {
            this.loadingSelection = true;
            http.get('/client-management/clients')
            .then(response => {
                for(var i=0;i<response.data.rows.length;i++)
                {
                    this.clients.push({
                        id: response.data.rows[i].id,
                        name: response.data.rows[i].name,
                        description: response.data.rows[i].description,
                        created_by: response.data.rows[i].created_by,
                        createdAt: response.data.rows[i].createdAt,
                        updatedAt: response.data.rows[i].updatedAt
                    });
                }
                this.loadingSelection = false;
            });
        },
        saveRecipient() {
            this.saveLoading = true;
            var selectedClient = {
                client_id: '',
                name: ''
            };
            if (this.client != {} && this.client.id != this.selectedRecipient.Client.id)
            {
                selectedClient = this.client
            }
            else if (this.client != {} && this.client.id == this.selectedRecipient.Client.id)
            {
                selectedClient = this.selectedRecipient.Client
            }
            //console.log(selectedClient)
            var inputs = {
                
                created_by: this.account.User.id,
                client_id: selectedClient.id,
                name: this.recipient_name,
                email: this.recipient_email,
                description: this.recipient_description
            }
            

            http.post('/client-management/recipients/update/'+this.selectedRecipient.id,inputs)
            .then(response => {
                var result = {
                    metadata: response,
                    additionalData: selectedClient
                };
                
                this.$emit('editClientRecipientResponse', result);
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
                name: [],
                email: []
            };

            let results = Object.assign(__error, error);

            return results;
        },
        filterClients() {
            return this.clients.filter((data) => {
                var regex = new RegExp(this.selected_client.name, "i");
                return data.name.search(regex) !== -1;
            })
        }
    }
}
</script>
