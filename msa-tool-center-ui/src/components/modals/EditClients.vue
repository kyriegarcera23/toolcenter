<template>
    <div class="modal-card" style="width: 300px;overflow: visible;">
        <header class="modal-card-head has-background-success">
            <p class="modal-card-title has-text-white is-size-5">Edit Client</p>
        </header>
        <section class="modal-card-body custom">
            <b-field
            v-bind:type="{'is-danger' : errors.name.length > 0}"
            :message="errors.name">
                <b-input
                    type="text"
                    v-model="client_name"
                    placeholder="Client Name">
                </b-input>
            </b-field>
            <b-field>
                <b-input
                    type="text"
                    v-model="client_description"
                    placeholder="Description">
                </b-input>
            </b-field>
        </section>
        <footer class="modal-card-foot custom">
            <div class="is-pulled-right">
                <button class="button" type="button" @click="$parent.close()">Close</button>
                <b-button type="is-info" @click="saveClient()" :loading="saveLoading">Save</b-button>
            </div>
        </footer>
    </div>
</template>

<script>
import http from '../../http_common';
export default {
    props: ['selectedClient'],
    data() {
        return {
            client_name: this.selectedClient.name,
            client_description: this.selectedClient.description,
            errors: {
                name: []
            },
            saveLoading: false,
            loadingSelection: false
        }
    },
    methods: {
        saveClient() {
            this.saveLoading = true;

            var inputs = {
                name: this.client_name,
                description: this.client_description
            }

            http.post('/client-management/clients/update/' +this.selectedClient.id,inputs)
            .then(response => {
                var result = {
                    metadata: response,
                    additionalDataUser: this.selectedClient.user,
                    additionalDataLocations: this.selectedClient.locations,
                    additionalDataRecipients: this.selectedClient.recipients
                };
                this.$emit('editClientsResponse', result);
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
        errorDisplay(error) {
            let __error = {
                client_id: [],
                name: []
            };

            let results = Object.assign(__error, error);

            return results;
        }
    }
}
</script>
