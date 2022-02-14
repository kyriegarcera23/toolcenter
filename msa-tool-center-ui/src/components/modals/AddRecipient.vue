<template>
    <form @submit="formSubmit">
        <div class="modal-card" style="width: 300px; overflow: visible;">
            <header class="modal-card-head has-background-primary">
                <p class="modal-card-title has-text-white is-size-5">New Recipient</p>
            </header>
            <section class="modal-card-body custom">
                
                <b-field>
                    <multiselect v-model="client" :loading="isLoadingClients" :disabled="isLoadingClients" open-direction="bottom" track-by="client_id" label="name" :show-labels="false" placeholder="Select Client..." required :options="clients" :allow-empty="false">
                    <i slot="noResult" class="is-size-6">No clients found</i>
                    </multiselect>
                </b-field>

                <b-field>
                    <b-input
                        type="text"
                        v-model="name"
                        placeholder="Name"
                        required>
                    </b-input>
                </b-field>

                <b-field>
                    <b-input
                        type="email"
                        v-model="email"
                        placeholder="Email"
                        required>
                    </b-input>
                </b-field>

                <b-field>
                    <b-input
                        type="text"
                        v-model="description"
                        placeholder="Description">
                    </b-input>
                </b-field>                        
                
            </section>
            <footer class="modal-card-foot custom">
                <div class="is-pulled-right">
                    <button class="button" type="button" @click="$parent.close()">Close</button>
                    <b-button type="is-primary" native-type="submit" :loading="isBusy">Submit</b-button>
                </div>
            </footer>
        </div>
    </form>
</template>

<script>
export default {
    data() {
        return {
            clients: [],
            client: null,
            isLoadingClients: true,
            name: null,
            email: null,
            description: null,
            isBusy: false
        }
    },
    created() {
        this.fetchClients();
    },
    methods: {
        fetchClients() {
            this.$axios
                .get('/api/clients')
                .then(response => {
                    this.clients = response.data.data;
                    this.isLoadingClients = false;
                });
        },
        formSubmit(e) {
            e.preventDefault();
            
            this.isBusy = true;
            let that = this;

            this.$axios.post('/api/recipients', {
                name: this.name,
                //client_name: this.client.name,
                email: this.email,
                description: this.description,
                client_id: this.client.client_id
            })
            .then(function (response) {
                that.isBusy = false;
                that.$parent.close();
                that.$buefy.snackbar.open({
                    message: response.data.message,
                    type: 'is-success',
                    position: 'is-bottom-right'
                })
            })
            .catch(function (error) {
                that.output = error;
                let e = error.response.data;

                that.$buefy.dialog.alert({
                    title: 'Oops',
                    message: `${e.message}<br>`,
                    type: 'is-danger',
                    hasIcon: true,
                    icon: 'times-circle',
                    iconPack: 'fa',
                    ariaRole: 'alertdialog',
                    ariaModal: true
                })
                that.isBusy = false;
            });
        }
    }
}
</script>