<template>
    <div class="modal-card" style="width: 300px;overflow: visible;">
        <header class="modal-card-head has-background-success">
            <p class="modal-card-title has-text-white is-size-5">Add Clients</p>
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
                <b-button type="is-info" @click="saveClient()" :loading="saveLoading">Submit</b-button>
            </div>
        </footer>
    </div>
</template>

<script>
import http from '../../http_common';
export default {

    data() {
        return {
            client_name: '',
            client_description: '',
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
            var validInput = true;

            var inputs = {
                name: this.client_name,
                description: this.client_description
            }

            if (this.client_name == '')
            {
                this.errors.name = ['The name field is required'];
                validInput = false;
            }
            this.errorDisplay(this.errors);

            if (validInput === true) //front end validation
            {
                http.post('/client-management/clients/add',inputs)
                .then(response => {
                    var result = {
                        metadata: response
                    };
                    this.$emit('addClientsResponse', result);
                    this.saveLoading = false;
                    this.$parent.close();
                })
                .catch(e => { //back end validation
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
            }
            else
            {
                this.saveLoading = false;
            }
        },
        errorDisplay(error) {
            let __error = {
                name: []
            };

            let results = Object.assign(__error, error);

            return results;
        }
    }
}
</script>
