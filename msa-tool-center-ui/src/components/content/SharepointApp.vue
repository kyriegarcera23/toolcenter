<template>
<div class="nav-background is-page">
    <div class="page-header-container">
        <div class="columns has-text-white">
            <div class="column" style="padding-left:20px;">
                <table>
                    <tr>
                        <td style="padding:10px 10px 0px 30px;"><feather type="share-2" size="30" class="m-r-15" style="margin-bottom: -8px"></feather></td>
                        <td><span class="is-size-5" style="font-weight: bold">SharePoint Group | {{ this.SharePointGroup.group_name }}</span>
                        <i class="is-size-7" style="display: block; margin-top: -3px;">View your groups and modify your files from Microsoft SharePoint</i></td>
                    </tr>
                </table>
            </div>
            <div class="column">
                <div class="buttons are-small is-pulled-right" style="margin: 30px 5px 0px 0px;">
                    <router-link to="/sharepoint" class="button is-primary">
                        <feather class="icon" type="arrow-left" size="10"></feather>
                        <span>Go Back</span>
                    </router-link>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="columns" style="flex-wrap: wrap;margin-top:20px;">
                <div class="column is-3" id="directories" v-if="SharepointMainFolders.length > 0">
                    <aside class="menu">
                        <p class="menu-label">Sharepoint Directories</p>
                        <ul class="menu-list" style="font-size:14px;">
                            <li v-for="(SharepointMainFolder, index) in SharepointMainFolders" :key="index" v-on:click="loadSharepointFolders(AccessCredentials,SharepointMainFolder)" >
                                <a :class="{ 'is-active' : SharepointMainFolder.Name == selectedSharepointMainFolder.Name}">
                                    <feather class="icon-14" type="folder" size="10"></feather>&nbsp;&nbsp;&nbsp;
                                    {{ SharepointMainFolder.Name }}
                                    <span class="is-info is-small is-pulled-right" @click="removeDirectory(SharepointMainFolder)" v-if="(SharepointMainFolders.length > 1 && SharepointMainFolder.Name == selectedSharepointMainFolder.Name)"><feather class="icon-10" type="x"></feather></span>
                                </a>
                            </li>
                        </ul>
                    </aside>
                </div>
                <div class="column is-9 sharepointTable" v-if="JSON.stringify(selectedSharepointMainFolder) != '{}' && isBusy == false">
                    <div class="columns" style="flex-wrap: wrap">
                        <div class="column is-12">
                            <!-- <div class="buttons are-small is-pulled-left">
                                <button class="button is-info"><feather class="icon-14" type="upload-cloud" size="10"></feather>&nbsp;Upload Files</button>
                                <button class="button is-danger"><feather class="icon-14" type="trash" size="10"></feather>&nbsp;Delete Marked Items</button>
                            </div> -->
                            <div class="is-pulled-right m-b-10">
                                <b-input placeholder="Search..."
                                type="search"
                                icon="magnify"
                                v-model="search_query">
                                </b-input>
                            </div>
                        </div>
                        <div class="column is-12" style="margin-top:-20px;">
                            <nav class="breadcrumb is-left is-size-7" id="sharepointBreadCrumb" aria-label="breadcrumbs">
                                <ul>
                                    <li>
                                        <a v-on:click="loadSharepointFolders(AccessCredentials,selectedSharepointMainFolder)">{{ selectedSharepointMainFolder.Name }}</a>
                                    </li>
                                    <li v-for="(Subfolder, index) in Subfolders" :key="index" :class="{ 'is-active':index==Subfolders.length-1 }">
                                        <a v-on:click="loadSharepointFolders(AccessCredentials,Subfolder,false,true)">{{ Subfolder.Name }}</a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        <div class="column is-12">
                            <b-table
                            :data="SharepointFoldersFilesData()"
                            :hoverable="true"
                            :paginated="isPaginated"
                            :per-page="perPage"
                            :current-page.sync="currentPage"
                            :pagination-simple="isPaginationSimple"
                            :pagination-position="paginationPosition"
                            :default-sort-direction="defaultSortDirection"
                            :sort-icon="sortIcon"
                            :sort-icon-size="sortIconSize"
                            aria-next-label="Next page"
                            aria-previous-label="Previous page"
                            aria-page-label="Page"
                            aria-current-label="Current page"
                            class="is-size-7 sp-table"
                            v-if="isBusyForLoadFoldersFiles == false && (SharepointFoldersFiles.length > 0 || InitialSharepointFoldersFiles.length > 0)">

                                <template>
                                    <b-table-column field="Name" label=" " sortable width="30" v-slot="props">
                                        <img v-if="props.row.Type == 'Folder'" src="/images/folder.svg" alt="folder-icon" class="sp-icon">
                                        <img v-if="props.row.Type == 'File'" :src="getIcon(props.row.Name)" alt="file-icon" class="sp-icon">
                                    </b-table-column>
                                    <b-table-column field="Name" label="Name" sortable v-slot="props">
                                        <p v-if="props.row.Type == 'Folder'"><a class="has-text-dark sp-name" v-on:click="loadSharepointFolders(AccessCredentials,props.row,true)">{{ props.row.Name }}</a></p>
                                        <span class="has-text-grey-light" v-if="props.row.Type == 'Folder' && IndicatorPath == true">{{ serverPath(props.row.ServerRelativeUrl) }}</span>
                                        <p v-if="props.row.Type == 'File' && (props.row.LinkingUrl == '' || props.row.LinkingUrl == null)"><a class="has-text-dark sp-name" :href="SharepointBaseURL.split('/sites')[0]+props.row.ServerRelativeUrl" target="_blank">{{ props.row.Name }}</a></p>
                                        <p v-if="props.row.Type == 'File' && (props.row.LinkingUrl != '' && props.row.LinkingUrl != null)"><a class="has-text-dark sp-name" :href="props.row.LinkingUrl" target="_blank">{{ props.row.Name }}</a></p>
                                    </b-table-column>
                                    <b-table-column field="TimeCreated" label="Date Created" sortable v-slot="props">
                                        <p class="has-text-dark">{{ formatDate(props.row.TimeCreated, 'MMM DD, YYYY  hh:mm a') }}</p>
                                    </b-table-column>
                                    <b-table-column field="TimeLastModified" label="Date Modified" sortable v-slot="props">
                                        <p class="has-text-dark">{{ formatDate(props.row.TimeLastModified, 'MMM DD, YYYY  hh:mm a') }}</p>
                                    </b-table-column>
                                    <b-table-column label="  " v-slot="props">
                                        <b-dropdown aria-role="list" position="is-bottom-left" v-if="props.row.Type == 'File'">
                                            <b-button class="more-button has-text-grey" type="is-light" size="is-small" slot="trigger">
                                                <feather type="more-vertical" size="16"></feather>
                                            </b-button>
                                            <b-dropdown-item aria-role="listitem" v-on:click="viewSharepointFolderFileDetails(props.row)">Details</b-dropdown-item>
                                            <b-dropdown-item aria-role="listitem" v-on:click="downloadSharepointFile(props.row)">Download</b-dropdown-item>
                                            <!-- <b-dropdown-item aria-role="listitem" v-on:click="downloadSharepointFolder(props.row)" v-if="props.row.Type == 'Folder'">Download</b-dropdown-item> -->
                                        </b-dropdown>
                                        <b-dropdown aria-role="list" position="is-bottom-left" v-if="props.row.Type == 'Folder'">
                                            <b-button class="more-button has-text-grey" type="is-light" size="is-small" slot="trigger">
                                                <feather type="more-vertical" size="16"></feather>
                                            </b-button>
                                            <b-dropdown-item aria-role="listitem" v-on:click="createShortcut(props.row)">Create Shortcut</b-dropdown-item>
                                        </b-dropdown>
                                    </b-table-column>
                                </template>
                            </b-table>
                            <div class="is-fullwidth text-center align-middle" style="min-height: 250px;" v-if="isBusyForLoadFoldersFiles == false && (SharepointFoldersFiles.length == 0 || InitialSharepointFoldersFiles.length == 0 || ItemsLength == 0)">
                                <img src="/images/windy.svg" style="height: 100px; min-height: 100px; margin-bottom: 10px;"/><br>
                                <i class="is-size-6">No data entry.</i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <b-loading :is-full-page="false" style="min-height: 350px" :active.sync="isBusy" :can-cancel="false"></b-loading>
        <b-loading :is-full-page="false" style="min-height: 350px" :active.sync="isBusyForLoadFoldersFiles" :can-cancel="false"></b-loading>
        <b-loading :is-full-page="false" style="min-height: 350px" :active.sync="isBusyForViewAndDownload" :can-cancel="false"></b-loading>
    </div>
</div>
</template>

<script>
import viewSharepointFolderFileDetails from '../modals/ViewSharepointFolderFileDetails.vue'
import http from '../../http_common';

export default {
    props: ['account'],
    data() {
        return {
            AccessCredentials: {},
            SharepointMainFolders: [],
            SharepointFolders: [],
            SharepointFiles: [],
            SharepointFoldersFiles: [],
            InitialSharepointFoldersFiles: [],
            selectedSharepointMainFolder: {},
            selectedSharepointAppFolderFile: {},
            Subfolders: [],
            SharepointBaseURL: 'https://tthiholdings.sharepoint.com/sites',
            SharePointGroup: {},
            isBusy: false,
            isBusyForViewAndDownload: false,
            isBusyForLoadFoldersFiles: false,
            search_query: '',
            loadFilesFromMainFolder: false,
            AllFolders: [],
            AllFiles: [],
            IndicatorPath: false,
            ItemsLength: 0,
            isLoadSharepointFoldersFiles: false,
            //b-table
            isPaginated: true,
            isPaginationSimple: false,
            paginationPosition: 'bottom',
            defaultSortDirection: 'asc',
            sortIcon: 'arrow-up',
            sortIconSize: 'is-small',
            currentPage: 1,
            perPage: 20
        }
    },
    watch: {
        search_query: function () {
            if(this.search_query != '')
            {
                if(this.isLoadSharepointFoldersFiles == false)
                {
                    this.loadSharepointFoldersAndFilesExpanded(this.AccessCredentials,this.selectedSharepointMainFolder);
                    this.isLoadSharepointFoldersFiles = true;
                }
                this.IndicatorPath = true;
            }
            else
            {
                this.IndicatorPath = false;
            }
        }
    },
    mounted() {
        this.loadSharepointGroup(this.$route.params.id);

        //Load Access Credentials Every 3 Hours
        setInterval(() => {
            this.loadSharepointGroup(this.$route.params.id);
        },10800000);
    },
    methods: {
        formatDate(value,date_format){
            if (value) {
                return this.$moment(String(value)).format(date_format)
            }
        },
        serverPath(text) {
            return text.split(this.SharePointGroup.site_name).pop();
        },
        loadSharepointGroup(id) {
            this.isBusy = true;
            http.get(`/sharepoint/${id}`)
            .then(response => {
                this.SharePointGroup = response.data;

                //Check permission first
                // console.log(this.SharePointGroup.group_name.replace(/\s+/g, '-').toLowerCase());
                // if (this.$parent.canDo('view-sharepoint-group-'+this.SharePointGroup.group_name.replace(/\s+/g, '-').toLowerCase()) || this.$parent.canDo('view-sharepoint-all-group'))
                // {
                //     this.initializeSharepointAccess(this.SharePointGroup);
                // }
                // else
                // {
                //     this.isBusy = false;
                //     this.$buefy.snackbar.open({
                //         message: "Oops! You don't have persmissionss to access this file.",
                //         type: 'is-danger',
                //         position: 'is-bottom-right'
                //     });
                //     setTimeout(() => {
                //         this.$router.push('../../sharepoint');
                //     },2000);
                // }
                this.initializeSharepointAccess(this.SharePointGroup);
            })
            .catch(e => {
                e;
                this.isBusy = false;
                this.$buefy.snackbar.open({
                    message: "Oops! The Group has not found in our record.",
                    type: 'is-danger',
                    position: 'is-bottom-right'
                });
                setTimeout(() => {
                    this.$router.push('../../sharepoint');
                },2000);
            });
        },
        initializeSharepointAccess(SharePointGroup) {
            http.post(`/sharepoint/accesstoken`,{
                site_name: SharePointGroup.site_name,
                group_description: SharePointGroup.group_description,
                tenant_id: SharePointGroup.tenant_id,
                client_id: SharePointGroup.client_id,
                client_secret: SharePointGroup.client_secret,
                resource: SharePointGroup.resource
            })
            .then(response => {
                this.AccessCredentials = response.data;
                this.loadSharepointMainFolders(this.AccessCredentials);
                this.$buefy.snackbar.open({
                    message: `${SharePointGroup.group_name} load successfully.`,
                    type: 'is-success',
                    position: 'is-bottom-right'
                });
            })
            .catch(e => {
                e;
                this.isBusy = false;
                this.$buefy.snackbar.open({
                    message: "Oops! Invalid Sharepoint Credentials.",
                    type: 'is-danger',
                    position: 'is-bottom-right'
                });
                setTimeout(() => {
                    this.$router.push('../../sharepoint');
                },2000);
            });
        },
        loadSharepointMainFolders(AccessCredentials) {
            AccessCredentials;
            let directories = JSON.parse(this.SharePointGroup.directories);
            for (var i=0;i<directories.length;i++)
            {
                this.SharepointMainFolders.push({
                    Name: directories[i].directory_name,
                    TimeCreated: '',
                    TimeLastModified: '',
                    Folders: {
                        __deferred: {
                            uri: `${this.SharepointBaseURL}/${this.SharePointGroup.site_name}/_api/Web/GetFolderByServerRelativePath(decodedurl='/sites/${this.SharePointGroup.site_name}${directories[i].directory_link}')/Folders`
                        }
                    },
                    Files: {
                        __deferred: {
                            uri: `${this.SharepointBaseURL}/${this.SharePointGroup.site_name}/_api/Web/GetFolderByServerRelativePath(decodedurl='/sites/${this.SharePointGroup.site_name}${directories[i].directory_link}')/Files`
                        }
                    },
                    Properties: {
                        __deferred: {
                            uri: `${this.SharepointBaseURL}/${this.SharePointGroup.site_name}/_api/Web/GetFolderByServerRelativePath(decodedurl='/sites/${this.SharePointGroup.site_name}${directories[i].directory_link}')/Propertise`
                        }
                    },
                    LinkingUrl: '',
                    ServerRelativeUrl: `/sites/${this.SharePointGroup.site_name}/${directories[i].directory_link}`,
                    Type:'Folder'
                });
            }

            this.isBusy = false;
            this.loadFilesFromMainFolder = true;
        },
        loadSharepointFolders(AccessCredentials,SharepointFolder = {},clickedOnTable = false,clickedOnBreadCrumnb = false) {
            this.isLoadSharepointFoldersFiles = false;
            this.isBusyForLoadFoldersFiles = true;
            var uri = '';
            this.search_query = '';
            

            if (clickedOnTable === true)
            {
                uri = SharepointFolder.Folders.__deferred.uri;
                this.Subfolders.push(SharepointFolder);
            }
            else if (clickedOnBreadCrumnb === true)
            {
                uri = SharepointFolder.Folders.__deferred.uri;
                var newSubFolders = [];
                for(var i=0;i<this.Subfolders.length;i++)
                {
                    newSubFolders.push(this.Subfolders[i]);
                    if(this.Subfolders[i].Name == SharepointFolder.Name)
                    {
                        break;
                    }
                }
                this.Subfolders = newSubFolders;
            }
            else
            {
                this.Subfolders = [];
                this.selectedSharepointMainFolder = SharepointFolder;
                uri = SharepointFolder.Folders.__deferred.uri;
            }

            http.get(uri,
            {
                headers: {
                    Authorization: 'Bearer '+AccessCredentials.access_token,
                    Accept: 'application/json;odata=verbose'
                }
            })
            .then(async response => {
                this.SharepointFolders = response.data.d.results;
                // var results = response.data.d.results;
                // this.SharepointFolders = [];
                // for (var i=0;i<results.length;i++)
                // {
                //     if (results[i].ItemCount != 0)
                //     {
                //         this.SharepointFolders.push(results[i]);
                //     }
                // }

                if (clickedOnTable === true || clickedOnBreadCrumnb === true)
                {
                    this.loadSharepointFiles(AccessCredentials,SharepointFolder,true);
                }
                else
                {
                    this.loadSharepointFiles(AccessCredentials,SharepointFolder);
                }
            })
            .catch(e => {
                this.isBusyForLoadFoldersFiles = false;
                this.$buefy.snackbar.open({
                    message: e,
                    type: 'is-danger',
                    position: 'is-bottom-right'
                });
            });
        },
        loadSharepointFiles(AccessCredentials,SharepointFolder = {},clickedOnTableBreadCrumb = false) {
            
            var uri = '';uri;

            if (clickedOnTableBreadCrumb === true || this.loadFilesFromMainFolder === true)
            {
                uri = SharepointFolder.Files.__deferred.uri;
            }
            else
            {
                uri = `${this.SharepointBaseURL}/${this.SharePointGroup.site_name}/_api/Web/GetFolderByServerRelativePath(decodedurl='/sites/${this.SharePointGroup.site_name}/${this.selectedSharepointMainFolder.Name}')/Files`;
            }

            http.get(SharepointFolder.Files.__deferred.uri,
            {
                headers: {
                    Authorization: 'Bearer '+AccessCredentials.access_token,
                    Accept: 'application/json;odata=verbose'
                }
            })
            .then(response => {
                this.SharepointFiles = response.data.d.results;
                // var results = await response.data.d.results;
                // this.SharepointFiles = [];
                // for (var i = 0; i<results.length; i++)
                // {
                //     if (await this.isAllowedUser(results[i]) === true)
                //     {
                //         this.SharepointFiles.push(results[i]);
                //     }
                // }
                this.mergeFolderAndFile(this.SharepointFolders,this.SharepointFiles,true);
            })
            .catch(e => {
                this.isBusyForLoadFoldersFiles = false;
                this.$buefy.snackbar.open({
                    message: e,
                    type: 'is-danger',
                    position: 'is-bottom-right'
                });
            });
        },
        mergeFolderAndFile(SharepointFolders,SharepointFiles,initial = false) {
            
            this.SharepointFoldersFiles = [];
            var i;
            for(i=0;i<SharepointFolders.length;i++)
            {
                this.SharepointFoldersFiles.push({
                    Name: SharepointFolders[i].Name,
                    TimeCreated: SharepointFolders[i].TimeCreated,
                    TimeLastModified: SharepointFolders[i].TimeLastModified,
                    Folders: {
                        __deferred: {
                            uri: SharepointFolders[i].Folders.__deferred.uri
                        }
                    },
                    Files: {
                        __deferred: {
                            uri: SharepointFolders[i].Files.__deferred.uri
                        }
                    },
                    Properties: {
                        __deferred: {
                            uri: SharepointFolders[i].Properties.__deferred.uri
                        }
                    },
                    LinkingUrl: SharepointFolders[i].LinkingUrl,
                    ServerRelativeUrl: SharepointFolders[i].ServerRelativeUrl,
                    Type:'Folder'
                });
            }

            for(i=0;i<SharepointFiles.length;i++)
            {
                this.SharepointFoldersFiles.push({
                    Name: SharepointFiles[i].Name,
                    TimeCreated: SharepointFiles[i].TimeCreated,
                    TimeLastModified: SharepointFiles[i].TimeLastModified,
                    Folders: {
                        __deferred: {
                            uri: ''
                        }
                    },
                    Files: {
                        __deferred: {
                            uri: ''
                        }
                    },
                    Properties: {
                        __deferred: {
                            uri: SharepointFiles[i].Properties.__deferred.uri
                        }
                    },
                    LinkingUrl: SharepointFiles[i].LinkingUrl,
                    ServerRelativeUrl: SharepointFiles[i].ServerRelativeUrl,
                    Type:'File'
                });
            }

            if(initial == true)
            {
                this.InitialSharepointFoldersFiles = this.SharepointFoldersFiles;
            }

            setTimeout(()=>{
                this.isBusyForLoadFoldersFiles = false;
                this.loadFilesFromMainFolder = false;
            },1000);
        },
        downloadSharepointFile(sharepointFile) {
            this.isBusyForViewAndDownload = true;
            http({
                url: `${this.SharepointBaseURL}/${this.SharePointGroup.site_name}/_api/Web/GetFileByServerRelativeUrl('${sharepointFile.ServerRelativeUrl}')/$value`,
                method: 'GET',
                responseType: 'blob', // important
                headers: {
                    Authorization: 'Bearer '+this.AccessCredentials.access_token
                }
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                var a = document.createElement("a");
                a.href = url;
                a.download = sharepointFile.Name;
                a.click();
                this.isBusyForViewAndDownload = false;
            })
            .catch(e => {
                this.isBusyForViewAndDownload = false;
                this.$buefy.snackbar.open({
                    message: e,
                    type: 'is-danger',
                    position: 'is-bottom-right'
                });
            });
        },
        downloadSharepointFolder(SharepointFolder) {
            this.isBusyForViewAndDownload = true;

            http.get(SharepointFolder.Files.__deferred.uri,
            {
                headers: {
                    Authorization: 'Bearer '+this.AccessCredentials.access_token,
                    Accept: 'application/json;odata=verbose'
                }
            })
            .then(response => {
                let sharepointFilesInside = response.data.d.results;
                for (var i = 0;i<sharepointFilesInside.length;i++)
                {
                    this.downloadSharepointFile(sharepointFilesInside[i]);
                }
                this.isBusyForViewAndDownload = false;
            })
            .catch(e => {
                this.isBusyForViewAndDownload = false;
                this.$buefy.snackbar.open({
                    message: e,
                    type: 'is-danger',
                    position: 'is-bottom-right'
                });
            });
        },
        viewSharepointFolderFileDetails(sharepointFolderFile) {
            
            this.selectedSharepointAppFolderFile = sharepointFolderFile;
            this.$buefy.modal.open({
                parent: this,
                component: viewSharepointFolderFileDetails,
                hasModalCard: true,
                canCancel: ['x'],
                customClass: 'custom-class custom-class-2',
                onCancel: function () {
                    // console.log('cancel');
                }
            });
        },
        isAllowedUser(sharepointFolderFile) {
            
            let isAllowed = false; // default to false
            let sharepointAppFolderFileAuthor = '';
            let arr = {
                author: '',
                sharedUsers: [],
                modifiedBy: ''
            };

            return http.get(sharepointFolderFile.Properties.__deferred.uri,
            {
                headers: {
                    Authorization: 'Bearer '+this.AccessCredentials.access_token,
                    Accept: 'application/json;odata=verbose'
                }
            })
            .then(response => {
                var results = response.data.d;

                // REARRANGE THE JSON RESPONSE
                if(results.vti_x005f_shardwithdetails)
                {
                    var obj = JSON.parse(results.vti_x005f_shardwithdetails);
                    for(var item in obj) {
                        var sharedEmail = item.split('|');
                        arr.sharedUsers.push({
                            "userEmail": sharedEmail[sharedEmail.length - 1],
                            "inChargedEmail": obj[item].LoginName,
                            "dateTime": obj[item].DateTime
                        });
                    }
                }
                else
                {
                    arr.sharedUsers = [{
                        "userEmail": 'n/a',
                        "inChargedEmail": 'n/a',
                        "dateTime": 'n/a'
                    }];
                }

                if(results.vti_x005f_author)
                {
                    var authorEmail = results.vti_x005f_author.split('|');
                    sharepointAppFolderFileAuthor = authorEmail[authorEmail.length-1];
                }
                //END

                // DETERMINE IF FOLDER OR FILE CAN ACCESS BY THE USER
                if (sharepointAppFolderFileAuthor == this.account.email || this.$parent.canDo('modify-sharepoint-all-files') == true) // checked the author matched the current user email
                {
                    isAllowed = true;
                }
                else // else checked the shared users email matched the current user email
                {
                    for(var i = 0;i<arr.sharedUsers.length;i++)
                    {
                        if (arr.sharedUsers[i].userEmail == this.account.email)
                        {
                            isAllowed = true;
                            break;
                        }
                    }
                }
                // END
                return isAllowed;
            });
        },
        getIcon(name) {
            
            var file_name = name.split('.');
            var file_type = file_name[file_name.length-1].toLowerCase();
            let img = '';
            let extension = {
                word: ['doc','dot','wbk','docx','docm','dotx','dotm','docb'],
                excel: ['xls','xlt','xlm','xlsx','xlsm','xltx','xltm','xlsb','xlam','xll','xlw'],
                powerpoint: ['ppt','pot','pps','pptx','pptm','potx','potm','ppam','ppsx','sldx','sldm'],
                pdf: ['pdf'],
                onenote: ['one'],
                text: ['txt']
            };

            if(extension.word.includes(file_type))
            {
                img = 'docx';
            }
            else if(extension.excel.includes(file_type))
            {
                img = 'xlsx';
            }
            else if(extension.powerpoint.includes(file_type))
            {
                img = 'pptx';
            }
            else if(extension.pdf.includes(file_type))
            {
                img = 'pdf';
            }
            else if(extension.onenote.includes(file_type))
            {
                img = 'one';
            }
            else if(extension.text.includes(file_type))
            {
                img = 'txt';
            }
            else
            {
                img = 'document';
            }

            return `/images/${img}.svg`;

        },
        uploadSharepointFile(sharepointFile) {
            console.log(sharepointFile);
        },
        SharepointFoldersFilesData() {

            var folderfiles;

            if(this.search_query != '')
            {
                folderfiles = this.SharepointFoldersFiles.filter(obj => {
                    let word = this.search_query.replace(/^\s+|\s+$/gm,'').toLowerCase();
                    let name = obj.Name.toLowerCase();
                    return name.includes(word);
                });
            }
            else
            {
                folderfiles = this.InitialSharepointFoldersFiles;
            }

            this.ItemsLength = folderfiles.length;
            return folderfiles;
        },
        loadSharepointFoldersAndFilesExpanded(AccessCredentials,SpecificFolder) {
            //reset first
            this.AllFolders = [];
            this.AllFiles = [];
            this.isBusyForLoadFoldersFiles = true;
            SpecificFolder;
            var ServerRelativeUrlPath = SpecificFolder.ServerRelativeUrl.split(this.SharePointGroup.site_name+'/').pop();
            ServerRelativeUrlPath = ServerRelativeUrlPath.substring(1);
            var uri = `${this.SharepointBaseURL}/${this.SharePointGroup.site_name}/_api/Web/GetFolderByServerRelativeUrl('${ServerRelativeUrlPath}')?$expand=Folders,Files`;

            http.get(uri,
            {
                headers: {
                    Authorization: 'Bearer '+AccessCredentials.access_token,
                    Accept: 'application/json;odata=verbose'
                }
            })
            .then(response => {
                this.digDeeper(response.data.d,true);
            })
            .catch(e => {
                console.log(e);
            });
        },
        digDeeper(data, initial = false) {
            initial;
            //checking initial permission
            // if(initial == true)
            // {
            //     data.Folders.results = data.Folders.results.filter(obj => {
            //         return this.filterFolderPermissions(obj);
            //     });
            // }

            //catch all folders
            if(data.Folders.results.length>0)
            {
                for(let i=0;i<data.Folders.results.length;i++)
                {
                    var uri = `${this.SharepointBaseURL}/${this.SharePointGroup.site_name}/_api/Web/GetFolderByServerRelativeUrl('${data.Folders.results[i].ServerRelativeUrl}')?$expand=Folders,Files`;
                    http.get(uri,
                    {
                        headers: {
                            Authorization: 'Bearer '+this.AccessCredentials.access_token,
                            Accept: 'application/json;odata=verbose'
                        }
                    })
                    .then(response => {
                        this.AllFolders.push(data.Folders.results[i]);
                        this.digDeeper(response.data.d);
                    })
                    .catch(e => {
                        console.log(e);
                    });
                }
            }

            //catch all files
            if(data.Files.results.length>0)
            {
                for(let i=0;i<data.Files.results.length;i++)
                {
                    this.AllFiles.push(data.Files.results[i]);
                }
            }

            //remove duplicates
            const seenFolder = new Set();
            this.AllFolders = this.AllFolders.filter(el => {
                const duplicateFolder = seenFolder.has(el.UniqueId);
                seenFolder.add(el.UniqueId);
                return !duplicateFolder;
            });

            const seenFile = new Set();
            this.AllFiles = this.AllFiles.filter(el => {
                const duplicateFile = seenFile.has(el.UniqueId);
                seenFile.add(el.UniqueId);
                return !duplicateFile;
            });
            //end remove duplicates

            //merge the file and folders
            this.mergeFolderAndFile(this.AllFolders,this.AllFiles);
        },
        createShortcut(folder) {
            this.isBusyForViewAndDownload = true;
            var isDuplicate = false;

            for (var i = 0;i<this.SharepointMainFolders.length;i++)
            {
                if (this.SharepointMainFolders[i].ServerRelativeUrl == folder.ServerRelativeUrl)
                {
                    isDuplicate = true;
                }
            }

            if (isDuplicate!=true)
            {
                let directories = JSON.parse(this.SharePointGroup.directories);
                directories.push({
                    "directory_id":(this.SharepointMainFolders.length + 1),
                    "directory_name":folder.Name,
                    "directory_link":folder.ServerRelativeUrl.split(this.SharePointGroup.site_name+'/').pop(),
                    "on_update":false
                });

                http.post(`/sharepoint/${this.SharePointGroup.id}`,{
                    group_name: this.SharePointGroup.group_name,
                    site_name: this.SharePointGroup.site_name,
                    group_description: this.SharePointGroup.group_description,
                    tenant_id: this.SharePointGroup.tenant_id,
                    client_id: this.SharePointGroup.client_id,
                    client_secret: this.SharePointGroup.client_secret,
                    resource: this.SharePointGroup.resource,
                    directories: JSON.stringify(directories)
                })
                .then(response => {
                    response;
                    this.SharePointGroup.directories = JSON.stringify(directories);
                    this.SharepointMainFolders.push({
                        Name: folder.Name,
                        TimeCreated: folder.TimeCreated,
                        TimeLastModified: folder.TimeLastModified,
                        Folders: folder.Folders,
                        Files: folder.Files,
                        Properties:  folder.Properties,
                        LinkingUrl: folder.LinkingUrl,
                        ServerRelativeUrl: folder.ServerRelativeUrl,
                        Type: folder.Type
                    });
                    this.$buefy.snackbar.open({
                        message: `${folder.Name} shortcut is created successfully.`,
                        type: 'is-success',
                        position: 'is-bottom-right'
                    });
                    this.isBusyForViewAndDownload = false;
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
                this.$buefy.snackbar.open({
                    message: `Ops!, This shortcut is already existing.`,
                    type: 'is-danger',
                    position: 'is-bottom-right'
                });
                this.isBusyForViewAndDownload = false;
            }
        },
        removeDirectory(folder) {
            this.$buefy.dialog.confirm({
                message: 'Do you want to remove this direcory <strong>'+folder.Name+'</strong>?',
                type: 'is-danger',
                onConfirm: () => {
                    this.isBusyForViewAndDownload = true;
                    let directories = JSON.parse(this.SharePointGroup.directories);
                    directories = directories.filter(obj => {
                        return obj.directory_link != folder.ServerRelativeUrl.split(this.SharePointGroup.site_name+'/').pop();
                    });

                    http.post(`/sharepoint/${this.SharePointGroup.id}`,{
                        group_name: this.SharePointGroup.group_name,
                        site_name: this.SharePointGroup.site_name,
                        group_description: this.SharePointGroup.group_description,
                        tenant_id: this.SharePointGroup.tenant_id,
                        client_id: this.SharePointGroup.client_id,
                        client_secret: this.SharePointGroup.client_secret,
                        resource: this.SharePointGroup.resource,
                        directories: JSON.stringify(directories)
                    })
                    .then(response => {
                        response;
                        this.SharePointGroup.directories = JSON.stringify(directories);
                        this.removeDirectoryFilter(folder);
                    });
                }
            });
        },
        removeDirectoryFilter(folder) {
            this.SharepointMainFolders = this.SharepointMainFolders.filter(obj => {
                return obj.ServerRelativeUrl != folder.ServerRelativeUrl;
            });
            this.$buefy.snackbar.open({
                message: `${folder.Name} shortcut has been remove.`,
                type: 'is-danger',
                position: 'is-bottom-right'
            });
            this.isBusyForViewAndDownload = false;
        }
    }
}
</script>

<style lang="scss" scoped>
.icon-14 {
    width: 18px;
    height: 18px;
}

.icon-10 {
    width: 13px;
    height: 13px;
}

a.fileFolderName:hover {
    text-decoration: underline;
}

.sp-icon {
    width:20px;
    height:20px;
}

.sp-name:hover {
    text-decoration: underline;
}

.sp-table {
    margin-top:-20px;
}

#directories .menu-list a.is-active {
    background-color: #ececec;
    color: #363636;
}
</style>