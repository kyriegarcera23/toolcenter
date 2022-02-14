<template>
<div>
<div class="nav-background is-page">
    <div class="page-header-container">
        <div class="columns has-text-white">
            <div class="column" style="padding-left:20px;">
                <table>
                    <tr>
                        <td style="padding:10px 10px 0px 30px;"><feather type="layers" size="30" class="m-r-15" style="margin-bottom: -8px"></feather></td>
                        <td><span class="is-size-5" style="font-weight: bold">Users & Permissions</span>
                            <i class="is-size-7" style="display: block; margin-top: -3px;">Manage system users, roles, and permissions</i></td>
                    </tr>
                </table>
            </div>
            <div class="column">
                <div class="buttons are-small is-pulled-right" style="margin-top: 10px;" v-if="$parent.canDo('create-users')">
                    <button class="button is-success" @click="addUser">
                        <feather class="icon" type="plus" size="20"></feather> 
                        <span> Add User</span>
                    </button>
                    <!-- <button class="button is-light">
                        <feather class="icon" type="download" size="20"></feather>
                    </button>
                    <button class="button is-light">
                        <feather class="icon" type="upload" size="20"></feather>
                    </button> -->
                </div>
            </div>
        </div>
    </div>
</div>
<div class="container">
    <section style="margin-top: -30px">
        <b-field grouped>
            <b-tabs
                ref="tabs"
                type="is-boxed"
                class="tc-tabs is-fullwidth"
                v-model="activeTab"
                @input="showTab">
                <b-tab-item href="#users" v-if="$parent.canDo('read-users')">
                    <template slot="header" width="150px">
                        <feather type="user" size="15"></feather>
                        <span> Users </span>
                    </template>
                            
                        <b-loading :is-full-page="false" style="min-height: 350px" active.sync="loading.user || loading.roles || loading.permissions" :can-cancel="false"></b-loading>

                        

                        <div class="is-fullwidth text-center align-middle" style="min-height: 250px;" v-if="!data.users.length && !loading.users">
                            <i class="is-size-6">You have no users</i>
                        </div>
                       

                        <div v-else class="tile is-ancestor is-flex-wrap">
                            <b-field class="tile is-12 m-b-10" style="width: 100%; padding-bottom:10px;" v-if="data.users.length && !loading.users">
                                <b-input placeholder="Search" v-model="search_query.users"></b-input>
                            </b-field>
                            
                            <article class="tile box is-4 media" style="width: calc(96%/3)" v-for="(user, key) in (filtered_users || [])" :key="key">
                                <figure class="media-left">
                                    <p class="image is-64x64">
                                        <img v-if="user.roles.length && avatars[user.roles[0].name]" :src="'/images/' + avatars[user.roles[0].name] + '.png'">
                                        <img v-else :src="'/images/avatar-boy-2.png'">
                                    </p>
                                </figure>
                                <div class="media-content">
                                    <div class="content">
                                    <p>
                                        <strong class="is-size-6">{{ user.name }}</strong>
                                        <br><span class="is-size-7">{{ user.email }}</span>
                                        <br><b-tag type="is-primary" v-if="user.roles.length">{{ user.roles[0].name || '' }} </b-tag>
                                    </p>
                                    </div>
                                </div>
                                <div class="media-right">
                                    <!-- <button class="delete"></button> -->
                                    <b-dropdown aria-role="list" position="is-bottom-left">
                                        <b-button class="more-button has-text-grey" type="is-light" size="is-small" slot="trigger">
                                            <feather type="more-vertical" size="16"></feather>
                                        </b-button>

                                        <b-dropdown-item aria-role="listitem" @click="resetPassword(user.email)" v-if="$parent.canDo('update-users')">Reset Password</b-dropdown-item>
                                        <b-dropdown-item aria-role="listitem" @click="viewUser(user)" v-if="$parent.canDo('update-users')">View & Edit</b-dropdown-item>
                                        <b-dropdown-item aria-role="listitem" @click="deleteUser(user)" v-if="$parent.canDo('delete-users')">Delete User</b-dropdown-item>
                                    </b-dropdown>
                                </div>
                            </article>
                        </div>
                </b-tab-item>

                <b-tab-item href="#roles-permissions" v-if="$parent.canDo('read-roles') || $parent.canDo('read-permissions')">
                    <template slot="header" width="150px">
                        <feather type="lock" size="15"></feather>
                        <span> Roles & Permissions </span>
                    </template>

                        <div class="columns is-desktop">
                            <div class="column is-3">
                                <div class="tile">
                                    <h3 class="title is-size-5" style="width: 90%; margin: 5px 0px">{{ is_add ? 'Create New Role' : 'Roles' }}</h3>
                                    <div v-if="$parent.canDo('create-roles')">
                                        <b-button v-if="!is_add" @click="toggleAddForm(true)" class="is-pulled-right m-b-10" style="margin-bottom:5px!important;" type="is-link">
                                            <feather type="plus" size="12" ></feather>
                                        </b-button>

                                        <b-button v-else @click="toggleAddForm(false)" class="is-pulled-right m-b-5" style="margin-bottom:5px!important;" type="is-primary">
                                            <feather type="x" size="12"></feather>
                                        </b-button>
                                    </div>
                                </div>
                                <div class="tile box" style="padding: 15px; margin-bottom:5px" v-show="!is_add"
                                    v-for="(role, key) in data.roles" :key="key"
                                    @click="viewRole(key)" 
                                    :class="{'has-background-primary has-text-white' : key == active_role}">
                                    <span style="width: 90%">{{ role.name }}</span>
                                    <feather type="chevron-right" class="is-pulled-right"></feather>
                                </div>
                                <div class="tile box" v-if="is_add">
                                    <i>Please fill in all fields and check all necessary permissions for this role</i>
                                </div>
                            </div>
                            
                            <div class="column is-9">
                                <form ref="addRoleForm" v-show="is_add" @submit.prevent="addRole(active_role)">
                                    <div class="box" >
                                        <b-field horizontal label="Code">
                                            <span>{{ slug }}</span>
                                        </b-field>
                                        <b-field horizontal label="Display Name">
                                            <b-input name="display_name" validation-message="Please enter a display name" v-model="new_display_name" required expanded></b-input>
                                        </b-field>
                                        <b-field horizontal label="Description" style="margin-right: 0.75rem">
                                            <b-input name="description" validation-message="Please enter a short description" v-model="new_description" required expanded></b-input>
                                        </b-field>
                                    </div>

                                    <h3 class="title is-size-5 m-b-0">Select Permissions</h3>
                                    
                                    <div class="tile is-ancestor is-flex-wrap" v-if="!loading.permissions && data.permissions.length">
                                        <b-checkbox  class="tile is-4 box" style="width: 31%" v-model="new_permissions" v-for="(permission, key) in data.permissions" :key="key"
                                            :native-value="permission.id">
                                            {{ permission.name }}
                                        </b-checkbox>
                                        
                                        <b-button  v-if="$parent.canDo('create-permissions')" class="tile is-4 box is-block" type="is-success" style="width: 31%; height: inherit; min-height: 60px;" outlined @click="addPermission">
                                            <feather type="chevron-right" class="is-pulled-right"></feather> New Permission
                                        </b-button>
                                    </div>

                                    <div class="is-fullwidth text-center align-middle" style="min-height: 250px;" v-else>
                                        <i class="is-size-6">You have no user permissions</i>
                                    </div>

                                    <div class="buttons is-pulled-right" v-if="$parent.canDo('create-roles')">
                                        <b-button native-type="submit"
                                            type="is-success">
                                            Submit
                                        </b-button>
                                    </div>
                                </form>
                                <form ref="roleForm" v-show="!is_add" @submit.prevent="updateRole(active_role)">
                                    <div class="box">
                                        <b-field horizontal label="Code">
                                            <span>{{ form_data.name }}</span>
                                        </b-field>
                                        <b-field horizontal label="Display Name">
                                            <b-input ref="newName" name="form_data_display_name" validation-message="Please enter a display name" v-model="form_data.name" required expanded></b-input>
                                        </b-field>
                                        <b-field horizontal label="Description">
                                            <b-input name="form_data_description" validation-message="Please enter a short description" v-model="form_data.description" required expanded></b-input>
                                        </b-field>

                                        <b-field horizontal v-if="data.roles.length && data.roles[active_role]">
                                            <span class="is-italic is-pulled-right is-size-7"> Last updated:  {{ data.roles[active_role].updated_at | fromNow }} </span>
                                        </b-field>
                                    </div>



                                    <h3 class="title is-size-5 m-b-0">Permissions</h3>
                                    
                                    <div class="tile is-ancestor is-flex-wrap" v-if="!loading.permissions && data.permissions.length">
                                        
                                        <b-checkbox  class="tile is-4 box" style="width: 31%" v-model="form_data.permissions" v-for="permission in data.permissions" :key="permission.id"
                                            :native-value="permission.id">
                                            {{ permission.name }}
                                            <span v-if="$parent.canDo('delete-permissions')" class="tag is-danger is-light" style="position: absolute; top: 0; right: 0px;  text-align:right;"
                                             @dblclick="removePermission(permission.id)" 
                                             >x</span>
                                        </b-checkbox>
                                        
                                        <b-button v-if="$parent.canDo('create-permissions')" class="tile is-4 box is-block" type="is-success" style="width: 31%; height: inherit; min-height: 60px;" outlined @click="addPermission">
                                            <feather type="chevron-right" class="is-pulled-right"></feather> New Permission
                                        </b-button>
                                    </div>

                                    <div class="is-fullwidth text-center align-middle" style="min-height: 250px;" v-else>
                                        <i class="is-size-6">You have no user permissions</i>
                                    </div>

                                    <div class="buttons is-pulled-right m-t-20" v-if="$parent.canDo('update-roles')">
                                        <!--<b-button @click="deleteRole(active_role)"
                                            type="is-danger">
                                            Delete
                                        </b-button>-->
                                        <b-button native-type="submit"
                                            to="/expo"
                                            type="is-dark">Save</b-button>
                                    </div>
                                </form>
                            </div>
                        </div>


                        
                </b-tab-item>
            </b-tabs>
        </b-field>
    </section>
</div>
</div>
</template>

<script>
 import http from '../../http_common';
//import BootstrapTable from 'bootstrap-table/dist/bootstrap-table-vue.esm.js'
import RolesPermissionsDetails from '../../components/modals/RolesPermissionsDetails.vue'
import AddUser from '../../components/modals/AddUser.vue'
import AddPermission from '../../components/modals/AddPermission.vue';
import ViewPermissions from '../../components/modals/ViewEditPermissions.vue';

export default {
    props:['account'],
    // components: {
    //     BootstrapTable
    // },
    data () {
        return {
            toggle: true,
            activeTab: 0,
            is_add: false,
            isBusy: true,
            active_role: 0,
            loading: {
                users: true,
                roles: true,
                permissions: true
            },
            avatars: {
                superadministrator: 'avatar-boy-1',
                administrator: 'avatar-boy-1',
                user: 'avatar-boy-2'
            },
            search_query: {
                users: null,
                roles: null,
                permissions: null
            },
            data: {
                users: [],
                roles: [],
                permissions: []
            },
            options: {
                users: {
                    search: true,
                    showColumns: true,
                    classes: 'table is-narrow is-hoverable is-bordered'
                }
            },
            form_data: {
                name: null,
                description: null,
                display_name: null,
                permissions: []
            },
            //New Role Data
            new_display_name: null,
            new_description: null,
            new_permissions: [],
            tabs: {
                '#users' : 0,
                '#roles-permissions' : 1,
            }
        }
    },
    created() {
        this.isBusy = false;
        this.fetchData();
        
        if(location.hash) {
            this.activeTab = this.tabs[location.hash];
        }
    },
    computed: {
        filtered_users () {
            if(!this.search_query.users){
                return this.data.users;
            }else{
                let search_query = this.search_query.users.replace(/^\s+|\s+$/gm,'').toLowerCase();
                let filtered = null;
                filtered = this.data.users.filter(
                    data => (data.name.toLowerCase().includes(search_query) || 
                    data.email.toLowerCase().includes(search_query) ||
                    data.createdAt.toLowerCase().includes(search_query) 
                ));
                return filtered;
            }
        },
        filtered_roles () {
            if(!this.search_query.roles){
                return this.data.roles;
            }else{
                let search_query = this.search_query.roles.replace(/^\s+|\s+$/gm,'').toLowerCase();
                let filtered = null;
                filtered = this.data.roles.filter(
                    data => (data.name.toLowerCase().includes(search_query) || 
                    data.display_name.toLowerCase().includes(search_query) ||
                    data.description.toLowerCase().includes(search_query)
                ));
                return filtered;
            }
        },
        slug() {
            var slug = this.convertToSlug(this.new_display_name || '');
            return slug;    
        }
    },
    methods: {
        addUser() {
            this.$buefy.modal.open({
                parent: this,
                component: AddUser,
                
                props: {
                    permissions: this.data.permissions,
                    roles: this.data.roles,
                    type: 'add',
                    clients: this.client,
                    accounts: this.account.User,
                    user_data: '',
                },
                hasModalCard: true,
                customClass: 'custom-class custom-class-2',
                canCancel: ['x'],
                events: {
                    'toUsers': () => {
                        this.fetchData('updateUser')
                    }
                }
            })
        },
        resetPassword(email) {
          //console.log(email)
            this.isBusy = true;
            let that = this;
            
            http.post('/users/reset-password', {
                "email": email
            })
            .then(function (response) {
                that.isBusy = false;
                
                that.$buefy.dialog.alert({
                    title: 'Hooray',
                    message: `${response.data.message}`,
                    type: 'is-success',
                    hasIcon: true,
                    icon: 'check-circle',
                    iconPack: 'fa',
                    ariaRole: 'alertdialog',
                    ariaModal: true
                })
            })
            .catch(function (error) {
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
                that.isBusy = false;
            });
        },

        removePermission(id){
            this.isBusy = true;
            let that = this;
            that
            this.$buefy.dialog.confirm({
                message: `Remove this permissions?`,
                type: 'is-danger',
                confirmText: 'Confirm',
                hasIcon: true,
                onConfirm: () => {
                    id;
                    //console.log(this.form_data)
                   

                    var deletePayload = {
                        name: this.form_data.name,
                        description: this.form_data.description
                    }
                   
                    http
                    .delete('/permissions/' + id, deletePayload)
                    .then(response => {
                       response
                       that.fetchData('updatePermissions')
                       that.$buefy.snackbar.open({
                            message: 'Successfully removed!',
                            type: 'is-success',
                            position: 'is-bottom-right'
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
                        
                    })
                }
            });
           
        },

        deleteUser(user) {
            this.isBusy = true;
            let that = this;
            this.$buefy.dialog.confirm({
                message: `Are you sure you want to delete this user?<br/><b>Name:</b> ${user.name}<br/><b>Email:</b> ${user.email}<br/><b>Role:</b> ${user.roles[0].name}`,
                type: 'is-danger',
                confirmText: 'Delete User',
                hasIcon: true,
                onConfirm: () => {
                    const toast  = this.$buefy.toast.open(`Deleting user...`);
                    http.delete('/users/'+ user.id)
                    .then(response => {
                        that.$buefy.snackbar.open({
                            message: response.data.message,
                            type: 'is-success',
                            position: 'is-bottom-right'
                        });
                        that.data.users = that.data.users.filter(obj => {
                            return obj.id != user.id;
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
                        that.isBusy = false;
                    }); 
                }
            });
        },
        viewUser(user_data) {
            this.$buefy.modal.open({
                parent: this,
                component: ViewPermissions,
                props: {
                    roles: this.data.roles,
                    permissions: this.data.permissions,
                    type: 'update',
                    clients: this.client,
                    accounts: this.account.User,
                    user_data: user_data,
                    
                },
                hasModalCard: true,
                customClass: 'custom-class custom-class-2',
                canCancel: ['x'],
                events: {
                    'updateUser': () => {
                        this.fetchData('updateUser')
                    }
                }
            })
        },
        toggleAddForm(show) {
            if(show) {
                this.new_display_name = ''
                this.new_description = ''
                this.new_permissions = []
            }

            this.is_add = !this.is_add; 
        },
        convertToSlug(text) {
            this.new_name = text
                    .toLowerCase()
                    .replace(/[^\w ]+/g,'')
                    .replace(/ +/g,'-');
            return this.new_name;
        },
        showTab(index) {
            //let tabID = this.$refs.tabs.$children.length/1+index;
            let tab = this.$refs.tabs.$children[index].$el.attributes.href.value;
            location.hash = tab || '';
        },
        fetchData(action='default') {
            if (action == 'updateUser' || action =='default'){
                http
                .get('/users')
                .then(response => {
                    var usersArr = [];

                    for (let i in response.data.rows){
                        response.data.rows[i].User.roles = [response.data.rows[i].Role]
                        
                        var permissionArr = []
                        for (let j in response.data.rows[i].Role.Permissions){
                            if(response.data.rows[i].Role.Permissions[j])
                            {
                                permissionArr.push(response.data.rows[i].Role.Permissions[j].id)
                            }
                        }

                        for (let k in response.data.rows[i].User.Permissions){
                            permissionArr.push(response.data.rows[i].User.Permissions[k].id)

                        }

                        response.data.rows[i].User.all_permissions = permissionArr;

                        usersArr.push(response.data.rows[i].User)
                    }
                    this.data.users = usersArr
                    this.loading.users = false;
                });
            }

            if (action=='updateRoles' || action =='default'){

                http
                .get('/roles')
                .then(response => {
                    var dataArr = response.data

                    for (let i in dataArr){
                        var permissionArr =[]

                        for (let e in dataArr[i].RolePermissions){
                            if(dataArr[i].RolePermissions[e].Permission)
                            {
                                permissionArr.push(dataArr[i].RolePermissions[e].Permission.id)
                            }
                        }

                        dataArr[i].permissions = permissionArr
                        delete dataArr[i].RolePermissions
                        this.data.roles.push(dataArr[i])

                    }
                    
                    let data = this.data.roles[this.active_role];
                    this.loading.roles = false;

                    this.form_data = {
                        display_name: data.name,
                        name: data.name,
                        description: data.description,
                        permissions: data.permissions
                    };

                   
                });

            }
            
            if (action=='updatePermissions' || action =='default'){
                http
                .get('/permissions')
                .then(response => {
                    this.data.permissions = response.data;
                    this.loading.permissions = false;
                });

            }

             if (action =='default'){
                 http
                .get('/client-management/clients')
                .then(response => {
                    this.client = response.data.rows;
                    
                });

             }

            
            
        },
        
        updateRole(index) {
            let that = this;
            index;
            
            var addPayload = {
                name: this.form_data.name,
                description: this.form_data.description
            }

            http
                .post('/roles/update/' + this.data.roles[index].id, addPayload)
                .then(response => {
                    this.data.roles[index] = response.data;
                    this.data.roles[index].permissions = this.form_data.permissions;
                });

            var updatePayload = {
                role_id: this.data.roles[index].id,
                permission_ids: this.form_data.permissions
            }
            http
                .post('/roles/role-permission/update', updatePayload)
                .then(response => {
                
               
                    that.$buefy.snackbar.open({
                            message: response.data.message,
                            type: 'is-success',
                            position: 'is-bottom-right'
                    });

                //this.fetchData('updateRoles')
                });
        },
        addRole(role_id) {
            let that = this;
            let data = {
                name: this.slug,
                description: this.new_description,
            };
            var rolePayload = {
                role_id: this.data.roles[role_id].id,
                permission_ids: this.new_permissions
            }
            http
                .post('/roles/add', data)
            .then(response => {
                let last_index = this.data.roles.length;
                this.active_role = last_index;
                this.data.roles.push(response.data);
                this.data.roles[last_index].permissions = this.new_permissions;
                this.new_display_name = null
                this.new_description = null
                this.new_permissions = []

            })

             http
                .post('/roles/role-permission/update', rolePayload)
                .then(response => {
                    that.$buefy.snackbar.open({
                            message: response.data.message,
                            type: 'is-success',
                            position: 'is-bottom-right'
                    });
                });
        },
        addPermission(event) {
            event;
            this.$buefy.modal.open({
                parent: this,
                component: AddPermission,
                props: {
                    permissions: this.data.permissions,
                },
                hasModalCard: true,
                customClass: 'custom-class custom-class-2',
                canCancel: ['x'],
                events: {
                    'toPermissions': () => {
                       this.fetchData('updatePermissions')
                    }
                }
            })
        },
        viewRole(index) {
            this.active_role = index;
            let data = this.data.roles[index];
            this.form_data = {
                display_name: data.display_name,
                name: data.name,
                description: data.description,
                permissions: data.permissions
            };
        },
        viewPermissions(data) {
            this.$buefy.modal.open({
                parent: this,
                component: RolesPermissionsDetails,
                props: {
                    permissions: data.permissions,
                    role: data.display_name
                },
                hasModalCard: true,
                customClass: 'custom-class custom-class-2',
                canCancel: ['x'],
                events: {
                    'toPending': (value, permissions) => {
                        value;
                        permissions;
                    }
                }
            })
        },
        deleteRole(index) {            
            if(this.data.roles.length >= 1) {
                this.data.roles.splice(index, 1);
                this.viewRole(0);
            }else {
                this.data.roles = [];
                this.form_data = {
                    display_name: null,
                    name: null,
                    description: null,
                    permissions: []
                };
            }
            // this.$axios
            //     .post('/api/roles', data)
            // .then(response => {

            // });
        }
    }
}
</script>

<style lang="scss">
article {
  display: block;
}

.tile {
  -webkit-box-align: stretch;
          align-items: stretch;
  display: block;
  flex-basis: 0;
  -webkit-box-flex: 1;
          flex-grow: 1;
  flex-shrink: 1;
  min-height: -webkit-min-content;
  min-height: -moz-min-content;
  min-height: min-content;
}



.tile.is-ancestor {
  margin-left: -0.75rem;
  margin-right: -0.75rem;
  margin-top: -0.75rem;
}

.is-flex-wrap {
  flex-wrap: wrap;
  margin-right: 150px;;
}


.nav-background {
  background-color: #003944;
  z-index: -1;
  -webkit-transition: all 200ms ease-in;
  transition: all 200ms ease-in;
  margin: -60px -30px -30px -30px;
}

.nav-background.is-dashboard {
  height: 115px;
}

.nav-background.is-dashboard ~ .container {
  margin-top: -80px;
}

.nav-background.is-dashboard .page-header-container {
  padding: 50px 30px 10px 30px;
  height: 50px;
}

.nav-background.is-page {
  height: 120px;
  margin-bottom: 30px;
}

.nav-background.is-page .page-header-container {
  padding: 55px 30px 10px 30px;
  height: 120px;
}


.tc-tabs .tabs.is-toggle a {
    background-color: white;
}

.b-tabs.tc-tabs .tab-content {
    margin-top: 20px;
}

.tc-tabs .tabs {
    &.is-boxed ul {
        border-top-width: 0;
        border-bottom-width: 0;
    }
    

    &.is-boxed a {
        border: 1px solid #dbdbdb;
        border-radius: 0 0 10px 10px;
        margin-top: -1px;
        color: #003944;
        -webkit-transition: all 200ms ease-in;
        transition: all 200ms ease-in;
        background-color: white;
    }

    &.is-boxed li.is-active a {
        background-color: white;
        border-color: #dbdbdb;
        border-bottom-color: #dbdbdb !important;
        background-color: #003944;
        color: white;
    }
}

.tc-tabs .tabs a {
    margin-bottom: 0px;
}

.tc-tabs .tabs .tab-content {
    padding: 0px;
}

.more-button {
    border-radius: 100px !important;
    padding: 0;
    width: 30px;
    height: 30px;
}

.tile.is-flex-wrap .tile {
  margin: 5px;
}

.bg-login main.main-body {
    margin-left: 0px;
    margin-top: -30px;
    display: table-cell;
    vertical-align: middle;
    padding: 0px;
  }

</style>