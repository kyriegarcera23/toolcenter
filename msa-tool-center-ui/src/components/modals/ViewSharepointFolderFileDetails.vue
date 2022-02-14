<template>
<div>
    <div class="modal-card" style="overflow: visible; width: 500px; min-height: 300px;">
        <header class="modal-card-head has-background-primary">
            <p class="modal-card-title has-text-white is-size-5 is-capitalized">Details</p>
        </header>
        <section class="modal-card-body">
            <div class="columns" style="flex-wrap: wrap;">
                <div class="column">
                    <table class="table is-fullwidth" style="font-size:12px;">
                        <tbody>
                            <tr>
                                <td><label class="has-text-weight-semibold">File Name:</label></td>
                                <td>{{ sharepointAppFolderFile.Name }}</td>
                            </tr>
                            <tr v-if="sharepointAppFolderFileAuthor != ''">
                                <td><label class="has-text-weight-semibold">Author:</label></td>
                                <td>{{ sharepointAppFolderFileAuthor }}</td>
                            </tr>
                            <tr>
                                <td><label class="has-text-weight-semibold">Date Created:</label></td>
                                <td>{{ formatDate(sharepointAppFolderFile.TimeCreated, 'MMM DD, YYYY  hh:mm a') }}</td>
                            </tr>
                            <tr>
                                <td><label class="has-text-weight-semibold">Date Modified:</label></td>
                                <td>{{ formatDate(sharepointAppFolderFile.TimeLastModified, 'MMM DD, YYYY  hh:mm a') }}</td>
                            </tr>
                            <tr v-if="sharepointAppFolderFileLastModifyBy != ''">
                                <td><label class="has-text-weight-semibold">Last Modified By:</label></td>
                                <td>{{ sharepointAppFolderFileLastModifyBy }}</td>
                            </tr>
                            <tr>
                                <td><label class="has-text-weight-semibold">Shared Users:</label></td>
                                <td><p v-for="(sharedUser, index) in sharepointAppFolderFileSharedUsers.sharedUsers" :key="index">{{ sharedUser.userEmail }}</p></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
        <footer class="modal-card-foot custom">
            <div class="is-pulled-right">
                <button class="button" type="button" @click="$parent.close()">Close</button>
            </div>
        </footer>
    </div>
</div>
</template>

<script>
import http from '../../http_common';
    export default {
        name: 'viewSharepointFileDetails',
        data() {
            return {
                sharepointAppFolderFile: {},
                sharepointAppFolderFileAuthor: '',
                sharepointAppFolderFileLastModifyBy: '',
                sharepointAppFolderFileSharedUsers: []
            }
        },
        mounted() {
            this.sharepointAppFolderFile = this.$parent.$parent.selectedSharepointAppFolderFile;
            this.loadAllowedUsers(this.$parent.$parent.selectedSharepointAppFolderFile);
        },
        methods: {
            formatDate(value,date_format){
                if (value) {
                    return this.$moment(String(value)).format(date_format)
                }
            },
            loadAllowedUsers(sharepointFolderFile) {
                http.get(sharepointFolderFile.Properties.__deferred.uri,
                {
                    headers: {
                        Authorization: 'Bearer '+this.$parent.$parent.AccessCredentials.access_token,
                        Accept: 'application/json;odata=verbose'
                    }
                })
                .then(response => {
                    var results = response.data.d;
                    let arr = {
                        author: '',
                        sharedUsers: [{
                            "userEmail": 'n/a',
                            "inChargedEmail": 'n/a',
                            "dateTime": 'n/a'
                        }],
                        modifiedBy: ''
                    };

                    if (results.vti_x005f_shardwithdetails)
                    {
                        arr.sharedUsers = [];
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

                    if (results.vti_x005f_author)
                    {
                        var authorEmail = results.vti_x005f_author.split('|');
                        this.sharepointAppFolderFileAuthor = authorEmail[authorEmail.length-1];
                    }

                    if (results.vti_x005f_modifiedby)
                    {
                        var modifiedEmail = results.vti_x005f_modifiedby.split('|');
                        this.sharepointAppFolderFileLastModifyBy = modifiedEmail[modifiedEmail.length-1];
                    }

                    this.sharepointAppFolderFileSharedUsers = arr;
                });
            }
        }
    }
</script>
