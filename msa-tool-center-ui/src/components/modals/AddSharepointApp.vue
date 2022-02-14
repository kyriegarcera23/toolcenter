<template>
<div>
    <div class="modal-card" style="overflow: visible; width: 700px;height: calc(100vh - 40px);">
        <header class="modal-card-head has-background-success">
            <p class="modal-card-title has-text-white is-size-5 is-capitalized">Register SharePoint Group</p>
        </header>
        <section class="modal-card-body">
            <b-tabs v-model="activeTab" expanded>
                <b-tab-item label="Group Credentials">
                    <b-field>
                        <b-input type="text" placeholder="Group Name" v-model="sharepointAppData.group_name" id="group_name" required></b-input>
                    </b-field>
                    <b-field>
                        <b-input type="text" placeholder="Site Name" v-model="sharepointAppData.site_name" id="site_name" required></b-input>
                    </b-field>
                    <b-field>
                        <b-input v-bind:class="{'is-danger' : errors.group_description}" type="textarea" placeholder="e.g. Group Description" v-model="sharepointAppData.group_description" id="group_description"  maxlength="190"></b-input>
                    </b-field>
                    <b-field >
                        <b-input type="text" placeholder="Tenant Id - ex. format ('XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX') " v-model="sharepointAppData.tenant_id" id="tenant_id" pattern="^([a-zA-Z0-9]{8})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{12})$" required></b-input>
                    </b-field>
                    <b-field >
                        <b-input type="text" placeholder="Client Id - ex. format ('XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX') " v-model="sharepointAppData.client_id" id="client_id" pattern="^([a-zA-Z0-9]{8})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{12})$" required></b-input>
                    </b-field>
                    <b-field >
                        <b-input type="text" placeholder="Client Secret" v-model="sharepointAppData.client_secret" id="client_secret" required></b-input>
                    </b-field>
                    <b-field >
                        <b-input type="text" placeholder="Resource - ex. format ('XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX') "  v-model="sharepointAppData.resource" id="resource" pattern="^([a-zA-Z0-9]{8})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{12})$" required></b-input>
                    </b-field>
                </b-tab-item>
                <b-tab-item label="SharePoint Directories">
                    <table id="directoryTable" class="table is-hoverable is-fullwidth" style="font-size:12px;">
                        <thead>
                            <tr>
                                <th>Diretory Name</th>
                                <th>Directory Link</th>
                                <th>&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(sharepointDirectory, index) in sharepointDirectories" :key="index">
                                <td>
                                    <p v-if="sharepointDirectory.on_update === false"><feather class="icon-14" type="folder"></feather>&nbsp;&nbsp;{{ sharepointDirectory.directory_name }}</p>
                                    <b-field v-if="sharepointDirectory.on_update === true">
                                        <b-input size="is-small" placeholder="Enter Name" v-model="sharepointDirectory.directory_name"></b-input>
                                    </b-field>
                                </td>
                                <td>
                                    <p v-if="sharepointDirectory.on_update === false" class="has-text-info">{{ sharepointDirectory.directory_link }}</p>
                                    <b-field v-if="sharepointDirectory.on_update === true">
                                        <b-input size="is-small" placeholder="Enter Link" v-model="sharepointDirectory.directory_link"></b-input>
                                    </b-field>
                                </td>
                                <td>
                                    <button class="button is-info is-small" v-if="sharepointDirectory.on_update === false && itemIsBeingUpdate === false" @click="editDirectory(sharepointDirectory)"><edit></edit></button>
                                    <button class="button is-danger is-small" v-if="sharepointDirectory.on_update === false && itemIsBeingUpdate === false" @click="deleteDirectory(sharepointDirectory.directory_id)"><stop></stop></button>
                                    <button class="button is-success is-small" v-if="sharepointDirectory.on_update === true" @click="updateDirectory(sharepointDirectory)" :disabled="sharepointDirectory.directory_name == '' || sharepointDirectory.directory_link == ''"><checkCircleOutline></checkCircleOutline></button>
                                    <button class="button is-danger is-small" v-if="sharepointDirectory.on_update === true" @click="cancelUpdateDirectory()"><feather class="icon-14 " type="x-square"></feather></button>
                                </td>
                            </tr>
                            <tr v-if="itemIsBeingUpdate === false">
                                <td>
                                    <b-field>
                                        <b-input size="is-small" placeholder="Enter Name" v-model="toAddDirectories.directory_name"></b-input>
                                    </b-field>
                                </td>
                                <td>
                                    <b-field>
                                        <b-input size="is-small" placeholder="Enter Link" v-model="toAddDirectories.directory_link"></b-input>
                                    </b-field>
                                </td>
                                <td><button class="button is-success is-small" @click="addDirectories(toAddDirectories)"><feather class="icon-14 " type="plus-circle"></feather></button></td>
                            </tr>
                        </tbody>
                    </table>
                </b-tab-item>
            </b-tabs>
        </section>

        <footer class="modal-card-foot custom">
            <div class="is-pulled-right">
                <button class="button is-success" type="submit" @click="saveSharepointApp()">Save</button>
            </div>
        </footer>
    </div>
</div>
</template>

<script>
import http from '../../http_common';

    export default {
        // props: ['type', 'sharepoint'],
        data() {
            return {
                activeTab: 0,
                sharepointAppData: {
                    group_name: '',
                    site_name: '',
                    group_description: '',
                    tenant_id: '',
                    client_id: '',
                    client_secret: '',
                    resource: ''
                },
                errors: {},
                toAddDirectories: {
                    directory_name: '',
                    directory_link: ''
                },
                SharepointDirectories: [],
                sharepointDirectories: [
                    {
                        directory_id: 1,
                        directory_name: 'Shared Documents',
                        directory_link: '/Shared Documents',
                        on_update: false
                    }
                ],
                itemIsBeingUpdate: false
            }
        },
        mounted() {
            this.SharepointDirectories = this.sharepointDirectories;
        },
        methods: {
            addDirectories(toAddDirectories) {
                let s = {
                    status: true,
                    message: ''
                };

                if(toAddDirectories.directory_name == '' || toAddDirectories.directory_link == '')
                {
                    s.status = false;
                    s.message = 'Invalid Input.';
                }

                if(this.isNotDuplicateEntry(toAddDirectories) == false)
                {
                    s.status = false;
                    s.message += '<br>Duplicate Entry.';
                }

                if (s.status)
                {
                    let new_id;
                    if(this.sharepointDirectories.length != 0)
                    {
                        new_id = parseInt(this.sharepointDirectories[this.sharepointDirectories.length-1].directory_id)+1;
                    }
                    else
                    {
                        new_id = 1;
                    }

                    this.sharepointDirectories.push(
                        {
                            directory_id: new_id,
                            directory_name: toAddDirectories.directory_name,
                            directory_link: toAddDirectories.directory_link,
                            on_update: false
                        }
                    );

                    this.toAddDirectories.directory_name = '';
                    this.toAddDirectories.directory_link = '';
                    this.SharepointDirectories = this.sharepointDirectories;
                }
                else
                {
                    this.$buefy.dialog.alert({
                        title: 'Oops',
                        message: s.message,
                        type: 'is-danger',
                        hasIcon: true,
                        icon: 'times-circle',
                        iconPack: 'fa',
                        ariaRole: 'alertdialog',
                        ariaModal: true
                    });
                }
            },
            deleteDirectory(id) {
                this.sharepointDirectories = this.sharepointDirectories.filter(obj => {
                    return obj.directory_id != id;
                });

                this.SharepointDirectories = this.sharepointDirectories;
            },
            editDirectory(directory) {
                this.itemIsBeingUpdate = true;
                let obj_arr = [];
                for(var i=0;i<this.sharepointDirectories.length;i++)
                {
                    if(this.sharepointDirectories[i].directory_id == directory.directory_id)
                    {
                        obj_arr.push({
                            directory_id: this.sharepointDirectories[i].directory_id,
                            directory_name: this.sharepointDirectories[i].directory_name,
                            directory_link: this.sharepointDirectories[i].directory_link,
                            on_update: true
                        })
                    }
                    else
                    {
                        obj_arr.push(this.sharepointDirectories[i]);
                    }
                }

                this.sharepointDirectories = obj_arr;
                this.toAddDirectories.directory_name = '';
                this.toAddDirectories.directory_link = '';
            },
            updateDirectory(directory) {
                let obj_arr = [];
                let s = {
                    status: true,
                    message: ''
                };

                if(directory.directory_name == '' && directory.directory_link == '')
                {
                    s.status = false;
                    s.message = 'Invalid Input.';
                }

                if(this.isNotDuplicateEntry(directory) == false)
                {
                    s.status = false;
                    s.message += '<br>Duplicate Entry.';
                }

                if(s.status)
                {
                    for(var i=0;i<this.sharepointDirectories.length;i++)
                    {
                        if(this.sharepointDirectories[i].directory_id == directory.directory_id)
                        {
                            obj_arr.push({
                                directory_id: directory.directory_id,
                                directory_name: directory.directory_name,
                                directory_link: directory.directory_link,
                                on_update: false
                            })
                        }
                        else
                        {
                            obj_arr.push(this.sharepointDirectories[i]);
                        }
                    }

                    this.sharepointDirectories = obj_arr;
                    this.itemIsBeingUpdate = false;
                    this.toAddDirectories.directory_name = '';
                    this.toAddDirectories.directory_link = '';
                    this.SharepointDirectories = this.sharepointDirectories;
                }
                else
                {
                    this.$buefy.dialog.alert({
                        title: 'Oops',
                        message: s.message,
                        type: 'is-danger',
                        hasIcon: true,
                        icon: 'times-circle',
                        iconPack: 'fa',
                        ariaRole: 'alertdialog',
                        ariaModal: true
                    });
                }
            },
            cancelUpdateDirectory() {
                this.itemIsBeingUpdate = false;
                this.toAddDirectories.directory_name = '';
                this.toAddDirectories.directory_link = '';
                this.sharepointDirectories = this.SharepointDirectories;
            },
            isNotDuplicateEntry(directory) {
                let isNotDuplicateEntry = true;

                for(var i=0;i<this.sharepointDirectories.length;i++)
                {
                    if(this.sharepointDirectories[i].directory_name == directory.directory_name
                    && this.sharepointDirectories[i].directory_id != directory.directory_id)
                    {
                        isNotDuplicateEntry = false;
                        break;
                    }

                    if(this.sharepointDirectories[i].directory_link == directory.directory_link
                    && this.sharepointDirectories[i].directory_id != directory.directory_id)
                    {
                        isNotDuplicateEntry = false;
                        break;
                    }
                }

                return isNotDuplicateEntry;
            },
            saveSharepointApp: async function() {
                let s = {
                    status: true,
                    message: ''
                };

            
                if (this.sharepointAppData.group_name == '' || 
                    this.sharepointAppData.site_name == '' ||
                    this.sharepointAppData.tenant_id == '' ||
                    this.sharepointAppData.client_id == '' ||
                    this.sharepointAppData.client_secret == '' ||
                    this.sharepointAppData.resource == '') {
                    
                    this.$swal({
                    toast: true,
                    position: 'bottom-right',
                    showConfirmButton: false,
                    timer: 3000,
                    icon: 'error',
                    title: 'Please fill out all required fields correctly to proceed...',
                    });

                }
                else
                {

                    const pattern = /^([a-zA-Z0-9]{8})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{12})$/;

                    if(!pattern.test(this.sharepointAppData.tenant_id) || !pattern.test(this.sharepointAppData.client_id) || !pattern.test(this.sharepointAppData.resource)){
                        
                        this.$swal({
                        toast: true,
                        position: 'bottom-right',
                        showConfirmButton: false,
                        timer: 3000,
                        icon: 'error',
                        title: 'Please match the requested format...',
                        });

                    }else{

                        if(this.sharepointDirectories.length<1)
                        {
                            s.status = false;
                            s.message = 'Invalid SharePoint Directories';
                        }
                        
                        
                        
                        if (s.status)
                        {
                            http.post(`/sharepoint`,{
                                group_name: this.sharepointAppData.group_name,
                                site_name: this.sharepointAppData.site_name,
                                group_description: this.sharepointAppData.group_description,
                                tenant_id: this.sharepointAppData.tenant_id,
                                client_id: this.sharepointAppData.client_id,
                                client_secret: this.sharepointAppData.client_secret,
                                resource: this.sharepointAppData.resource,
                                directories: JSON.stringify(this.sharepointDirectories)
                            })
                            .then(response => {
                                this.$parent.close();
                                this.$emit('saveSharepointAppResponse', response);
                            
                            })
                            .catch(e => {
                                switch (e.response.status) {
                                    case 422:
                                        this.errors = e.response.data.errors;
                                        break;
                                    default:
                                        this.$buefy.snackbar.open({
                                            message: 'Oops!, There is something wrong, Please try again.',
                                            type: 'is-danger',
                                            position: 'is-bottom-right'
                                        });
                                        break;
                                }
                            });
                        }
                        else
                        {
                            this.activeTab = 1;
                            this.$buefy.dialog.alert({
                                title: 'Oops',
                                message: s.message,
                                type: 'is-danger',
                                hasIcon: true,
                                icon: 'times-circle',
                                iconPack: 'fa',
                                ariaRole: 'alertdialog',
                                ariaModal: true
                            });
                        }
                    }

                    
                }

                
            }
        }
    }
</script>

<style lang="scss" scoped>
.icon-14 {
    width: 18px;
    height: 18px;
}

.material-design-icon__svg{
    margin-top: 2px;
}
</style>
