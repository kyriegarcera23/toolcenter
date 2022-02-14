<template>
<div>
    <div class="nav-background is-page">
        <div class="page-header-container">
            <div class="columns has-text-white">
                <div class="column" style="padding-left:20px;">
                    <table>
                        <tr>
                            <td style="padding:10px 10px 0px 30px;"><feather type="share-2" size="30" class="m-r-15" style="margin-bottom: -8px"></feather></td>
                            <td><span class="is-size-5" style="font-weight: bold">SharePoint Group</span>
                            <i class="is-size-7" style="display: block; margin-top: -3px;">View your groups and modify your files from Microsoft SharePoint</i></td>
                        </tr>
                    </table>
                </div>
                <div class="column">
                    <div class="buttons are-small is-pulled-right" style="margin: 30px 5px 0px 0px;">
                        <button class="button is-success" v-on:click="addSharepointApp" v-if="$parent.canDo('create-sharepoint-group')">
                            <plus></plus>
                            <span>New Group</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
   

   
    <div class="container">
        <div class="columns" style="flex-wrap: wrap; margin-left:5px;">
                <div class="column is-4">
                    <b-input placeholder="Search..."
                        type="search"
                        icon="magnify"
                        v-model="searchSharePoint"
                        >
                    </b-input>
                </div>
            </div>
        <div class="columns" style="flex-wrap: wrap; margin-left:5px;">
            
            <div class="column is-4" v-for="(sharepointApp, index) in filteredSharepointApps" :key="index">
                <div class="card ">
                    <div class="card-content">
                        <div class="media">
                            <div class="media-left">
                                <figure class="image is-48x48">
                                <img src="/images/ms_sharepoint_logo_48x48.png" alt="Placeholder image">
                                </figure>
                            </div>
                            <div class="media-content">
                                <p class="title is-6">{{ sharepointApp.group_name }}</p>
                                <p class="subtitle is-7">{{ formatDate(sharepointApp.updated_at, 'MMM DD, YYYY  hh:mm a') }}</p>
                            </div>
                            <div class="media-right">
                                <b-dropdown aria-role="list" position="is-bottom-left" v-if="$parent.canDo('update-sharepoint-group') || $parent.canDo('delete-sharepoint-group')">
                                    <b-button class="more-button has-text-grey" type="is-light" size="is-small" slot="trigger">
                                        <feather type="more-vertical" size="16"></feather>
                                    </b-button>
                                    <b-dropdown-item aria-role="listitem" v-on:click="viewSharepointApp(sharepointApp)">View Group</b-dropdown-item>
                                    <b-dropdown-item aria-role="listitem" v-on:click="editSharepointApp(sharepointApp)" v-if="$parent.canDo('update-sharepoint-group') || $parent.canDo('update-sharepoint-group-directories')">Edit</b-dropdown-item>
                                    <b-dropdown-item aria-role="listitem" v-on:click="deleteSharepointApp(sharepointApp)" v-if="$parent.canDo('delete-sharepoint-group')">Delete</b-dropdown-item>
                                </b-dropdown>
                            </div>
                        </div>
                        <div class="content" style="font-size:14px;word-wrap: break-word;">
                            {{ sharepointApp.group_description }}
                            <!-- <button style="margin:30px 0px 0px 110px;" class="button is-primary is-small" v-on:click="viewSharepointApp(sharepointApp)">View Group</button> -->
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <b-loading :is-full-page="false" style="min-height: 350px" :active.sync="isBusy" :can-cancel="false"></b-loading>
    </div>
</div>
</template>

<script>
import http from '../../http_common';
import AddSharepointApp from '../modals/AddSharepointApp.vue'
import EditSharepointApp from '../modals/EditSharepointApp.vue'

    export default {
        props: ['account'],
        data() {
            return {
                sharepointApps: [],
                selectedSharepointApp: {},
                isBusy: true,
                isRegisterNewAppModalActive: false,
                searchSharePoint:'',
                filteredSharepointApps: [],
                awaiting_search: false
            }
        },
        mounted() {
            this.fetchSharepoint();
        },
        watch: {
            searchSharePoint:function (){
                // console.log()

                // console.log(this.searchSharePoint);
                // this.digestPage = 0
                // if (!this.awaiting_search){
                // setTimeout(() => {
                //         this.fetchSharepoint(this.active_client);
                //         this.awaiting_search = false;
                //     }, 2000); // 2 sec delay
                // }
                // this.awaiting_search = true;
                if(this.searchSharePoint == ''){
                    this.filteredSharepointApps = this.sharepointApps;
                }else{
                    this.filteredSharepointApps = this.sharepointApps.filter(s => s.group_name.toLowerCase().includes(this.searchSharePoint))
                }
                
            }
        },
        methods: {
            formatDate(value,date_format){
                if (value) {
                    return this.$moment(String(value)).format(date_format)
                }
            },
            fetchSharepoint: async function() {
                http
                    .get('/sharepoint')
                    .then(response => {
                        let results = response.data.rows;
                        
                        this.sharepointApps = results.filter(obj => {
                            return this.$parent.canDo('view-sharepoint-group-'+obj.group_name.replace(/\s+/g, '-').toLowerCase()) || this.$parent.canDo('view-sharepoint-all-group');
                        });
                        this.filteredSharepointApps = this.sharepointApps;
                        this.isBusy = false;
                    });
            },
            addSharepointApp: async function() {
                this.$buefy.modal.open({
                    parent: this,
                    component: AddSharepointApp,
                    hasModalCard: true,
                    canCancel: ['x'],
                    customClass: 'custom-class custom-class-2',
                    onCancel: function () {
                        // console.log('cancel');
                    },
                    events: {
                        'saveSharepointAppResponse': value => {
                            this.sharepointApps.unshift(value.data);
                            this.$buefy.snackbar.open({
                                message: 'App has been added.',
                                type: 'is-success',
                                position: 'is-bottom-right'
                            });
                        }
                    }
                });
            },
            deleteSharepointApp: async function(sharepointApp) {
                this.$buefy.dialog.confirm({
                    message: 'Do you want to delete the app <strong>'+sharepointApp.group_name+'</strong>?',
                    type: 'is-danger',
                    onConfirm: () => {
                        this.isBusy = true;

                        http
                            .delete(`/sharepoint`, {data: {ids: [sharepointApp.id]}})
                            .then(response => {

                                this.deleteSharepointAppFilterObject(sharepointApp);

                                this.$buefy.snackbar.open({
                                    message: response.data.message,
                                    type: 'is-success',
                                    position: 'is-bottom-right'
                                });
                                this.isBusy = false;
                            });
                    }
                });
            },
            deleteSharepointAppFilterObject(sharepointApp) {
                this.sharepointApps = this.sharepointApps.filter(obj => {
                    return obj.id != sharepointApp.id;
                });
            },
            editSharepointApp: async function(sharepointApp) {
                this.selectedSharepointApp = sharepointApp;

                this.$buefy.modal.open({
                    parent: this,
                    component: EditSharepointApp,
                    props: {
                        'parent': this.$parent
                    },
                    hasModalCard: true,
                    canCancel: ['x'],
                    customClass: 'custom-class custom-class-2',
                    onCancel: () => {
                        // console.log('cancel');
                        this.fetchSharepoint(); //refresh data
                    },
                    events: {
                        'updateSharepointAppResponse': value => {
                            this.sharepointApps.map(sharepointApp => {
                                if(sharepointApp.id == value.data.id)
                                {
                                    for (let key in value.data) {
                                        sharepointApp[key] = value.data[key];
                                    }
                                }
                            });

                            this.$buefy.snackbar.open({
                                message: 'Group has been updated.',
                                type: 'is-success',
                                position: 'is-bottom-right'
                            });
                        }
                    }
                });
            },
            viewSharepointApp(sharepointApp) {

                this.$router.push(`sharepoint/app/${sharepointApp.id}`);
            }
        }
    }
</script>

<style lang="scss" scoped>
.material-design-icon__svg{
    margin-top: 1px;
}
.custom-card {
    height: 265px;
    max-height: 265px;
}
</style>
