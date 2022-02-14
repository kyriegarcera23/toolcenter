<template>
    <form @submit="formSubmit">
        <div class="modal-card" style="width: 900px;">
            <header class="modal-card-head" :class="{'has-background-success' : type == 'add', 'has-background-dark' : type == 'update'}">
                <p class="modal-card-title has-text-white is-size-5">{{ type == 'add' ? 'New User' : 'Edit • ' + user_data.name }}</p>
            </header>
            <section class="modal-card-body">
                <div class="columns is-desktop">
                
                    <div class="column">
                        <b-field>
                            <b-input
                                type="text"
                                v-model="user.name"
                                placeholder="Name"
                                required>
                            </b-input>
                        </b-field>
                    </div>

                    <div class="column">
                        <b-field>
                            <b-input
                                type="email"
                                v-model="user.email"
                                placeholder="Email"
                                required>
                            </b-input>
                        </b-field>
                    </div>

                    <div class="column"> 
                        <b-autocomplete 
                            :data="roles" 
                            field="name"
                            placeholder="Select Role..." 
                            open-on-focus
                            @select="option => {selected = option; user.role = option ? option : null;
                            user.permissions = option ? option.permissions: null}"
                            required>
                            <i slot="noResult" class="is-size-6">No clients found</i>
                        </b-autocomplete>
                    </div>
                </div>
                <div class="columns">
                    <div class="column is-12">
                         <b-field grouped>
                            <b-tabs
                                
                                type="is-boxed"
                                class="tc-tabs is-fullwidth"
                                >

                                <b-tab-item href="#Permission">
                                    <template slot="header">
                                        <feather type="user" size="15"></feather>
                                        <span> Permission </span>
                                    </template>
                                    
                                    <div class="is-ancestor is-flex-wrap" v-if="permissions.length">
                                        <b-checkbox  class="is-3 box tile" v-model="user.permissions"
                                         v-for="permission in permissions" :key="permission.id"
                                            :native-value="permission.id"
                                            :disabled="user.role.permissions != null ? 
                                            (user.role.permissions.find(p => p === permission.id)
                                            ? true : false) : false">
                                            {{ permission.name }}
                                        </b-checkbox>
                                    </div>
                                 </b-tab-item>

                                <b-tab-item href="#Client">
                                    <template slot="header">
                                        <feather type="user" size="15"></feather>
                                        <span> Client </span>
                                    </template>

                                    <div class="is-ancestor is-flex-wrap" v-if="clients.length">
                                        <b-checkbox  class="is-3 box tile" v-model="user.clients"
                                         v-for="client in clients" :key="client.id"
                                            :native-value="client.id">
                                            {{ client.name }}
                                        </b-checkbox>
                                    </div>
                                    
                                 </b-tab-item>

                            </b-tabs>
                        </b-field>

                    </div>   
                </div>             
            </section>
            <footer class="modal-card-foot custom">
                <div class="is-pulled-right">
                    <button class="button" type="button" @click="$parent.close()">Close</button>
                    <b-button type="is-success" native-type="submit" :loading="isBusy" v-if="type == 'add'">Submit</b-button>
                    <b-button type="is-dark" native-type="submit" :loading="isBusy" v-else>Save</b-button>
                </div>
            </footer>
        </div>
    </form>
</template>

<script>
import http from '../../http_common';
export default {
    props: ['roles', 'permissions','type','clients','user_data'],
    data() {
        return {
            active_index: 0,
            user: {
                name: null,
                email: null,
                role: [],
                permissions: [],
                clients:[]
            },
            isBusy: false,
            newRole:[],
            newPermission:[],
            newName:'',
        }
    },
    mounted(){
        //console.log(this.user_data)
    },
    created() {
        
        
        if(this.type == 'update') {
            
            if(this.user_data.roles && this.user_data.roles.length) {
                this.active_index = this.roles.findIndex((r => r.id == this.user_data.roles[0].id));
            }
            
            this.user = {
                name: this.user_data.name,
                email: this.user_data.email,
                role: this.user_data.roles[0],
                permissions: this.user_data.all_permissions
            }
            
        } 
        this.fetchData();
    },
    methods: {
        selectRole(value, id) {
            id;

            this.active_index = this.roles.indexOf(value);
            this.user.permissions = value.permissions;
        },
        dateFormatter(date) {
            return this.$moment(date).format('YYYY-MM-DD');
        },
        fetchData() {
            // this.$axios
            //     .get('/api/clients')
            //     .then(response => {
            //         this.clients = response.data.data;
            //         this.isLoadingClients = false;
            //     });
        },
        formSubmit(e) {
            e.preventDefault();
           
            this.isBusy = true;
            let that = this;

            const new_permissions =  this.user.permissions.filter(x => !this.roles[this.active_index].permissions.includes(x))
            
            if(this.type == 'add') {

                var payload = {
                    name: this.user.name,
                    email: this.user.email,
                    role_id: this.user.role.id,
                    client_ids:this.user.clients,
                    user_permission_ids: new_permissions
                }

                http.post('/users/register',payload)
                .then(function (response) {
                    response;
                    that.isBusy = false;
                    that.$parent.close();
                    that.$emit('toUsers');
                    that.$buefy.snackbar.open({
                        message: 'A new user has been added!',
                        type: 'is-success',
                        position: 'is-bottom-right'
                    })
                })
                .catch(function (error) {
                    //console.log(error)
                    that.output = error;
                    let e = error.response.data;

                    that.$buefy.dialog.alert({
                        title: 'Oops',
                        message: `${e.message}<br> permission update.`,
                        type: 'is-danger',
                        hasIcon: true,
                        icon: 'times-circle',
                        iconPack: 'fa',
                        ariaRole: 'alertdialog',
                        ariaModal: true
                    })
                    that.isBusy = false;
                });

              
            }else {

                var updatePayload = {
                    name: this.user.name,
                    email: this.user.email,
                    role_id: this.user.role.id,
                    //client_ids:this.user.clients,
                    permission_ids: new_permissions
                }
               
                http.post('/users/update/' + this.user_data.id,updatePayload)
                .then(function (response) {
                    response;
                    that.isBusy = false;
                    // console.log('error start')
                    // let user_data = Object.assign({}, response.data.user, {all_permissions: response.data.permissions, roles: response.data.roles})
                    // that.$emit('updateUser', user_data);
                    
                })
                .catch(function (error) {
                    that.output = error;
                });
            }
            
        }
    }
}
</script>

<style scoped>

</style>