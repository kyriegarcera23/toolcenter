<template>
<div>
    <div class="nav-background is-page">
        <div class="page-header-container">
            <div class="columns has-text-white">
                <div class="column" style="padding-left:20px;">
                    <table>
                        <tr>
                            <td style="padding:10px 10px 0px 30px;"><feather type="database" size="30" class="m-r-15" style="margin-bottom: -8px padding-left:10px"></feather></td>
                            <td><span class="is-size-5" style="font-weight: bold">Client Management</span>
                            <i class="is-size-7" style="display: block; margin-top: -3px;">Manage Client Data and Resources</i></td>
                        </tr>
                    </table>
                </div>
                <div class="column">
                    <div class="buttons are-small is-pulled-right" style="margin-top: 10px;" v-if="changeViewToListType == true" @click="returnIndex()">
                        <router-link to="/client-management" class="button is-primary">
                            <feather class="icon" type="arrow-left" size="10"></feather>
                            <span>Go Back</span>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="columns" style="flex-wrap: wrap; margin-left:5px;" v-if="changeViewToListType == false">
            <div class="column is-3" v-for="(client_item, index) in client_items.data" :key="index">
                <div class="card client-items" style="height: 100%;" @click="viewClientItem(client_item)">
                    <header class="card-header">
                        <p class="card-header-title"><feather :type="client_item.feather_icon" style="margin-right:10px;"></feather>&nbsp;&nbsp;{{ client_item.name }}</p>
                    </header>
                    <div class="card-content" style="font-size: 14px;">
                        <div class="content">{{ client_item.description }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="columns" style="flex-wrap: wrap; margin-left:-5px;" v-if="changeViewToListType == true">
            <div class="column is-3">
                <aside class="menu">
                    <p class="menu-label">Manage List</p>
                    <ul class="menu-list">
                        <li v-for="(client_item, index) in client_items.data" :key="index">
                            <a @click="viewClientItem(client_item)">
                                <div :class="{ 'tile box is-active-list' : client_item.nav == selectedItem.nav, 'tile box' : client_item.nav != selectedItem.nav}">
                                    <feather class="icon-14" size="15" style="margin-right:5px;" :type="client_item.feather_icon"></feather>&nbsp;&nbsp;
                                    <span style="width: 90%">{{ client_item.name }}</span>
                                    <feather type="chevron-right" class="is-pulled-right icon-14" size="18"></feather>
                                </div>
                            </a>
                        </li>
                    </ul>
                </aside>
            </div>
            <div class="column is-9">
                <router-view name="pageContent" ref="pageContent" :account="account"></router-view>
            </div>
        </div>
        <b-loading :is-full-page="false" style="min-height: 350px" :active.sync="isBusy" :can-cancel="false"></b-loading>
    </div>
</div>
</template>

<script>
import imported_client_items from '../../resources/data/client_items.json'

export default {
    props:['account'],
    data() {
        return {
            client_items: imported_client_items,
            isBusy: false,
            changeViewToListType: false,
            selectedItem: []
        }
    },
    mounted() {
        this.filterClientItems();
        this.changeView();
    },
    methods: {
        filterClientItems() {
            this.client_items.data = this.client_items.data.filter(obj => {
                return obj.status == 1;
            });
        },
        viewClientItem(data, initial = false) {
            initial;
            this.changeViewToListType = true;
            this.selectedItem = data;
            this.$router.push({ name: 'client-management.'+data.nav });
        },
        changeView() {
            var current_path = this.$router.history.current.name.split('.');


            if(current_path.length > 1)
            {
                this.changeViewToListType = true;
                this.selectedItem = {
                    nav:current_path[1]
                };
            }
        },
        returnIndex() {
            this.changeViewToListType = false;
        }
    }
}
</script>

<style lang="scss" scoped>
    .icon-14 {
        width: 18px;
        height: 18px;
    }

    .client-items:hover {
        cursor: pointer;
    }
    .client-items:hover header {
        background-color:#003944;
        transition: all .2s ease-in-out;
    }
    .client-items:hover header p {
        color:#fff;
        transition: all .2s ease-in-out;
    }
    .is-active-list {
        background-color:#003944;
        color:#fff;
        transition: all .2s ease-in-out;
    }
</style>
