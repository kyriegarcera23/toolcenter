<template>
<section>

    <div class="columns">
        <div class="column is-8">
            <b-loading :is-full-page="false" style="min-height: 350px" :active.sync="loading.clients" :can-cancel="false"></b-loading>

                        

            <div class="is-fullwidth text-center align-middle" style="min-height: 250px;" v-if="!clients.length && !loading.clients">
                <i class="is-size-6">You have no clients</i>
            </div>
            

            <div v-else class="tile is-ancestor is-flex-wrap">
                <b-field class="tile is-12 m-b-10" style="width: 100%;" v-if="clients.length && !loading.clients">
                    <b-input placeholder="Search" v-model="search_query.clients"></b-input>
                </b-field>

                <article class="tile box is-4 media" style="width: calc(95%/3)" v-for="client in filtered_clients" :key="client.client_id" @click="viewClient(client)">
                    <figure class="media-left">
                        <p class="image is-64x64">
                        <img src="https://bulma.io/images/placeholders/64x64.png">
                        </p>
                    </figure>
                    <div class="media-content">
                        <div class="content">
                        <div>
                            <strong class="is-size-6">{{ client.name }}</strong>
                        </div>
                        <div class="is-size-7">{{ client.description }}</div>
                        <div style="font-size: 0.6rem; margin-top: 5px;">{{ client.recipients.length }} recipient</div>
                        </div>
                    </div>
                    <div class="media-right" v-if="$emit('canDo', 'delete-clients')">
                        <button class="delete" @click="deleteClient(client)"></button>
                    </div>
                </article>
            </div>
        </div>
        
        <div class="column is-4" v-show="active_client.name">
            <div class="box">
                <b-field horizontal label="Name">
                    <span>{{ active_client.name }}</span>
                </b-field>
                <b-field horizontal label="Description">
                    <span>{{ active_client.description }}</span>
                </b-field>

                <b-field horizontal v-if="active_client && active_client.updated_at">
                    <span class="is-italic is-pulled-right is-size-7"> Last updated:  {{ active_client.updated_at | fromNow }} </span>
                </b-field>
            </div>

            <!-- <div class="m-b-10" v-if="recipients.length && !loading.recipients">
                <b-input placeholder="Search" v-model="search_query.recipients"></b-input>
            </div> -->

            <p class="menu-label">
                RECIPIENTS
            </p>

            <div class="is-fullwidth text-center align-middle" style="min-height: 250px;" v-if="!active_client.recipients.length">
                <i class="is-size-7">This client has no recipients</i>
            </div>

            <div class="tile box is-marginless m-b-5 is-clickable" style="padding: 15px;"
                v-for="recipient in active_client.recipients" :key="recipient.recipient_id"
                @click="deleteRecipient(recipient)">
                <div class="is-inline" style="width: 100%">
                    <span class="is-block is-size-6">{{ recipient.email }}</span>
                    <span class="is-block is-size-7">{{ recipient.name }}</span>
                </div>
                <feather type="x" class="is-pulled-right" style="vertical-align: middle; display: inherit;"></feather>
            </div>
        </div>
    </div>
</section>
</template>

<script>
export default {
    data() {
        return {
            active_client: {
                client_id: null,
                description: null,
                name: null,
                updated_at: null,
                recipients: []
            },
            loading: {
                clients: true
            },
            clients: [],
            form_data: {},
            search_query: {
                clients: null,
                recipients: null
            }
        }
    },
    computed: {
        filtered_clients () {
            if(!this.search_query.clients){
                return this.clients;
            }else{
                let search_query = this.search_query.clients.replace(/^\s+|\s+$/gm,'').toLowerCase();
                let filtered = null;
                filtered = this.clients.filter(
                    data => (data.name.toLowerCase().includes(search_query) || 
                    data.description.toLowerCase().includes(search_query) || 
                    data.user.name.toLowerCase().includes(search_query)) 
                );
                return filtered;
            }
        }
    },
    created() {
        this.$axios
        .get('/api/clients')
        .then(response => {
            this.clients = response.data.data;
            this.loading.clients = false;
        });
    },
    methods: {
        viewClient(client) {
            this.active_client = client;
        },
        viewRecipient(recipient) {
            this.active_recipient = recipient;
        },
        deleteClient(client) {
            let that = this;
            this.$buefy.dialog.confirm({
                message: `Are you sure you want to delete this client?<br/><b>Name:</b> ${client.name}<br/><b>Description:</b> ${client.description}`,
                type: 'is-danger',
                confirmText: 'Delete Client',
                hasIcon: true,
                onConfirm: () => {
                    const toast  = that.$buefy.toast.open(`Deleting client...`);
                    that.$axios.delete('/api/clients/'+client.client_id)
                    .then(response => {
                        that.$buefy.snackbar.open({
                            message: response.data.message,
                            type: 'is-success',
                            position: 'is-bottom-right'
                        });
                        
                        that.clients = that.clients.filter(obj => {
                            return obj.client_id != client.client_id;
                        });
                    }).catch(function (error) {
                        let e = error.response.data;

                        that.$buefy.dialog.alert({
                            title: 'Oops',
                            message: `${e.message}`,
                            type: 'is-danger',
                            hasIcon: true,
                            icon: 'times-circle',
                            iconPack: 'fa',
                            ariaRole: 'alertdialog',
                            ariaModal: true
                        })
                        
                    }).finally(function () {
                        // always executed. executed after request is completed
                        toast.close();
                    }); 
                }
            });
        },
        deleteRecipient(recipient) {
            let that = this;
            this.$buefy.dialog.confirm({
                message: `Are you sure you want to delete this recipient?<br/><b>Name:</b> ${recipient.name}<br/><b>Email:</b> ${recipient.email}`,
                type: 'is-danger',
                confirmText: 'Delete Recipient',
                hasIcon: true,
                onConfirm: () => {
                    const toast  = that.$buefy.toast.open(`Deleting recipient...`);
                    that.$axios.delete('/api/recipients/'+recipient.recipient_id)
                    .then(response => {
                        that.$buefy.snackbar.open({
                            message: response.data.message,
                            type: 'is-success',
                            position: 'is-bottom-right'
                        });
                        
                        that.active_client.recipients = that.active_client.recipients.filter(obj => {
                            return obj.recipient_id != recipient.recipient_id;
                        });
                    }).catch(function (error) {
                        let e = error.response.data;

                        that.$buefy.dialog.alert({
                            title: 'Oops',
                            message: `${e.message}`,
                            type: 'is-danger',
                            hasIcon: true,
                            icon: 'times-circle',
                            iconPack: 'fa',
                            ariaRole: 'alertdialog',
                            ariaModal: true
                        })
                        
                    }).finally(function () {
                        // always executed. executed after request is completed
                        toast.close();
                    }); 
                }
            });
        }
    }
}
</script>
