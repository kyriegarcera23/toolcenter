<template>
<div>
    <div class="nav-background is-page">
        <div class="page-header-container">
            <div class="columns has-text-white">
                <div class="column" style="padding-left:20px;">
                    <table>
                        <tr>
                            <td style="padding:10px 10px 0px 30px;"><feather type="book-open" size="30" class="m-r-15" style="margin-bottom: -8px"></feather></td>
                            <td><span class="is-size-5" style="font-weight: bold">Knowledge Base</span>
                            <i class="is-size-7" style="display: block; margin-top: -3px;">View Files and Folders from SharePoint</i></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="columns" style="flex-wrap: wrap" v-if="isBusy == false">
            <div class="column is-12" style="margin-left:20px">
                <div class="is-pulled-left m-b-10">
                    <b-input placeholder="Search..."
                        type="search"
                        icon="magnify"
                        v-model="search_query">
                    </b-input>
                </div>
            </div>
            <br>
            <div class="column is-12 sharepointTable" style="margin-left:20px">
                <nav class="breadcrumb is-left is-size-7" id="sharepointBreadCrumb" aria-label="breadcrumbs">
                    <ul>
                        <li>
                            <a v-on:click="loadSharepointFolders(AccessCredentials)">Root Folder</a>
                        </li>
                        <li v-for="(Subfolder, index) in Subfolders" :key="index" :class="{ 'is-active':index==Subfolders.length-1 }">
                            <a v-on:click="loadSharepointFolders(AccessCredentials,Subfolder,false,true)">{{ Subfolder.Name }}</a>
                        </li>
                    </ul>
                </nav>
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
                class="is-size-7"
                v-if="isBusyForLoadFoldersFiles == false && SharepointFoldersFiles.length > 0">

                    <template>
                        <b-table-column field="Name" label=" " sortable width="30" v-slot="props">
                            <img v-if="props.row.Type == 'Folder'" src="/images/folder.svg" alt="folder-icon" class="sp-icon">
                            <img v-if="props.row.Type == 'File'" :src="getIcon(props.row.Name)" alt="file-icon" class="sp-icon">
                        </b-table-column>
                        <b-table-column field="Name" label="Name" sortable width="500" v-slot="props">
                            <a class="sp-name has-text-dark" v-if="props.row.Type == 'Folder'" v-on:click="loadSharepointFolders(AccessCredentials,props.row,true)">{{ props.row.Name }}</a>
                            <a class="sp-name has-text-dark" v-if="props.row.Type == 'File' && isPDF(props.row.Name) == true" v-on:click="viewSharepointApp(props.row)">{{ props.row.Name }}</a>
                            <a class="sp-name has-text-dark" v-if="props.row.Type == 'File' && isPDF(props.row.Name) == false" v-on:click="downloadSharepointFile(props.row)">{{ props.row.Name }}</a>
                        </b-table-column>
                        <b-table-column field="TimeCreated" label="Created At" sortable width="185" v-slot="props">
                            {{ formatDate(props.row.TimeCreated, 'MMM DD, YYYY  hh:mm a') }}
                        </b-table-column>
                        <b-table-column field="TimeLastModified" label="Modified At" sortable width="185" v-slot="props">
                            {{ formatDate(props.row.TimeLastModified, 'MMM DD, YYYY  hh:mm a') }}
                        </b-table-column>
                        <b-table-column label="   " width="100" v-slot="props">
                            <!-- <button v-if="props.row.Type == 'File'" :disabled="isPDF(props.row.Name) == false" class="button is-primary is-small" v-on:click="viewSharepointApp(props.row)"><feather class="icon-14" type="eye" size="15"></feather></button> -->
                            <button v-if="props.row.Type == 'File' && $parent.canDo('dl-knowledgebase-file')" class="button is-light is-small" v-on:click="downloadSharepointFile(props.row)"><feather class="icon-14" type="download" size="15"></feather></button>
                        </b-table-column>
                    </template>
                </b-table>
                <div class="is-fullwidth text-center align-middle"  style="min-height: 250px; margin-left:45%;" v-if="isBusyForLoadFoldersFiles == false && SharepointFoldersFiles.length == 0">
                    <img src="/images/windy.svg" style="height: 100px; min-height: 100px; margin-bottom: 10px;"/><br>
                    <i class="is-size-6">No data entry.</i>
                </div>
            </div>
        </div>
        <b-loading :is-full-page="false" style="min-height: 350px" :active.sync="isBusy" :can-cancel="false"></b-loading>
        <b-loading :is-full-page="false" style="min-height: 350px" :active.sync="isBusyForLoadFoldersFiles" :can-cancel="false"></b-loading>
        <b-loading :is-full-page="false" style="min-height: 350px" :active.sync="isBusyForViewAndDownload" :can-cancel="false"></b-loading>
        <div class="is-fullwidth text-center align-middle" style="min-height: 250px;" v-if="!$parent.canDo('read-knowledgebase')">
            <img src="/images/windy.svg" style="height: 100px; min-height: 100px; margin-bottom: 10px;"/><br>
            <i class="is-size-6">Oops! You don't have permission to read this content.</i>
        </div>
    </div>
</div>
</template>

<script>
import viewSharepointAppFile from '../modals/ViewSharepointFile.vue';
import http from '../../http_common';

export default {
    name: 'knowledgebase',
    data() {
        return {
            AccessCredentials: {},
            SharepointFolders: [],
            SharepointFiles: [],
            SharepointFoldersFiles: [],
            selectedSharepointAppFile: {},
            Subfolders: [],
            SharepointBaseURL: 'https://tthiholdings.sharepoint.com/sites',
            SharePointGroup: 'MICTS_Service_Operations',
            SpecificFolderToGet: 'Internal/Service Operations/Common Folder/knowledgebase',
            isBusy: false,
            isBusyForViewAndDownload: false,
            isBusyForLoadFoldersFiles: false,
            search_query: '',
            //b-table
            isPaginated: true,
            isPaginationSimple: false,
            paginationPosition: 'bottom',
            defaultSortDirection: 'asc',
            sortIcon: 'arrow-up',
            sortIconSize: 'is-small',
            currentPage: 1,
            perPage: 18
        }
    },
    mounted() {
        this.initializeSharepointAccess();

        //Load Access Credentials Every 3 Hours
        setInterval(() => {
            this.initializeSharepointAccess();
        },10800000);
    },
    methods: {
        formatDate(value,date_format){
            if (value) {
                return this.$moment(String(value)).format(date_format)
            }
        },
        initializeSharepointAccess: async function() {
            this.isBusy = true;

            http.get(`/knowledgebase`)
            .then(response => {
                console.log(response)
                this.AccessCredentials = response.data;
                this.loadSharepointFolders(response.data);
                this.isBusy = false;
            })
            .catch(e => {
                console.log(e);
            });
        },
        loadSharepointFolders: async function(AccessCredentials,SharepointFolder = {},clickedOnTable = false,clickedOnBreadCrumnb = false) {
            this.isBusyForLoadFoldersFiles = true;
            var uri = '';

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
                uri = `${this.SharepointBaseURL}/${this.SharePointGroup}/_api/Web/GetFolderByServerRelativePath(decodedurl='/sites/${this.SharePointGroup}/${this.SpecificFolderToGet}')/Folders`;
            }

            http.get(uri,
            {
                headers: {
                    Authorization: 'Bearer '+AccessCredentials.access_token,
                    Accept: 'application/json;odata=verbose'
                }
            })
            .then(response => {
                if (clickedOnTable === true || clickedOnBreadCrumnb === true)
                {
                    this.SharepointFolders = response.data.d.results;
                    this.loadSharepointFiles(AccessCredentials,SharepointFolder,true);
                }
                else
                {
                    var results = response.data.d.results;
                    this.SharepointFolders = results.filter(obj => {
                        return this.filterFolderPermissions(obj);
                    });
                    this.loadSharepointFiles(AccessCredentials);
                }
            })
            .catch(e => {
                //console.log(e);
                this.$buefy.snackbar.open({
                    message: e,
                    type: 'is-danger',
                    position: 'is-bottom-right'
                });
            });
        },
        filterFolderPermissions(Folder)
        {
            if(this.$parent.canDo('view-knowledgebase-folder-'+Folder.Name.replace(/\s+/g, '-').toLowerCase()) || this.$parent.canDo('view-knowledgebase-all-folder'))
            {
                return true;
            }
            else
            {
                return false;
            }
        },
        loadSharepointFiles: async function(AccessCredentials,SharepointFolder = {},clickedOnTableBreadCrumb = false) {
            var uri = '';

            if (clickedOnTableBreadCrumb === true)
            {
                uri = SharepointFolder.Files.__deferred.uri;
            }
            else
            {
                uri = `${this.SharepointBaseURL}/${this.SharePointGroup}/_api/Web/GetFolderByServerRelativePath(decodedurl='/sites/${this.SharePointGroup}/${this.SpecificFolderToGet}')/Files`;
            }

            http.get(uri,
            {
                headers: {
                    Authorization: 'Bearer '+AccessCredentials.access_token,
                    Accept: 'application/json;odata=verbose'
                }
            })
            .then(response => {
                this.SharepointFiles = response.data.d.results;
                var SharePointFilesPDFOnly = this.SharepointFiles.filter(obj => {
                    return this.isPDF(obj.Name);
                });

                this.mergeFolderAndFile(this.SharepointFolders,SharePointFilesPDFOnly);
            })
            .catch(e => {
                //console.log(e);
                this.$buefy.snackbar.open({
                    message: e,
                    type: 'is-danger',
                    position: 'is-bottom-right'
                });
            });
        },
        mergeFolderAndFile (SharepointFolders,SharepointFiles) {
            this.SharepointFoldersFiles = [];

            for(var i=0;i<SharepointFolders.length;i++)
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
                    ServerRelativeUrl: SharepointFiles[i].ServerRelativeUrl,
                    Type:'File'
                });
            }

            this.isBusyForLoadFoldersFiles = false;
            this.search_query = '';
        },
        viewSharepointApp(sharepointFile) {
            this.isBusyForViewAndDownload = true;
            this.selectedSharepointAppFile = sharepointFile;
            http({
                url: `${this.SharepointBaseURL}/${this.SharePointGroup}/_api/Web/GetFileByServerRelativeUrl('${sharepointFile.ServerRelativeUrl}')/$value`,
                method: 'GET',
                responseType: 'blob', // important
                headers: {
                    Authorization: 'Bearer '+this.AccessCredentials.access_token
                }
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}));
                this.sharepointBlobUrl = url;

                this.$buefy.modal.open({
                    parent: this,
                    component: viewSharepointAppFile,
                    width: '100%',
                    hasModalCard: true,
                    canCancel: ['escape', 'x'],
                    customClass: 'custom-class custom-class-2'
                });

                this.isBusyForViewAndDownload = false;
            });
        },
        downloadSharepointFile(sharepointFile) {
            this.isBusyForViewAndDownload = true;
            this.selectedSharepointAppFile = sharepointFile;
            if(this.$parent.canDo('dl-knowledgebase-file'))
            {
                http({
                url: `${this.SharepointBaseURL}/${this.SharePointGroup}/_api/Web/GetFileByServerRelativeUrl('${sharepointFile.ServerRelativeUrl}')/$value`,
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
                });
            }
            else
            {
                this.$buefy.snackbar.open({
                    message: `Ops, You don't have permission to download this file.`,
                    type: 'is-success',
                    position: 'is-bottom-right'
                });
                this.isBusyForViewAndDownload = false;
            }
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
        isPDF(name) {
            var file_name = name.split('.');
            var file_type = file_name[file_name.length-1].toLowerCase();

            if(file_type == 'pdf')
            {
                return true;
            }
            else
            {
                return false;
            }
        },
        SharepointFoldersFilesData() {
            return this.SharepointFoldersFiles.filter(obj => {
                let word = this.search_query.replace(/^\s+|\s+$/gm,'').toLowerCase();
                let name = obj.Name.toLowerCase();
                return name.includes(word);
            });
        }
    }
}
</script>


<style lang="scss" scoped>
.icon-14 {
    width: 15px;
    height: 15px;
}

nav#sharepointBreadCrumb {
    margin-bottom: 7px;
}

.sharepointTable {
    margin-top:-28px;
}

.sp-icon {
    width:20px;
    height:20px;
}

.sp-name:hover {
    text-decoration: underline;
}
</style>