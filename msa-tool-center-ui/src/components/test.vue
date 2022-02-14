<template>
<div>
<div class="nav-background is-page">
    <div class="page-header-container">
        <div class="columns has-text-white">
            <div class="column">
                <table>
                    <tr>
                        <td style="vertical-align: middle"><feather type="package" size="30" class="m-r-15" style="margin-bottom: -8px"></feather></td>
                        <td><span class="is-size-5" style="font-weight: bold">Assets Inventory</span>
                            <i class="is-size-7" style="display: block; margin-top: -3px;">View all assets warranty status</i></td>
                    </tr>
                </table>
            </div>
            <div class="column">
                <div class="buttons are-small is-pulled-right m-t-10">
                    <b-field grouped>
                        <b-field  v-if="$parent.canDo('create-assets')">
                            <p class="control">
                                <button class="button is-success" @click="addAsset(activeType)" :disabled="isLoadingClients">
                                    <feather class="icon" type="plus" size="20"></feather>
                                    <span class="is-capitalized"> New Asset </span>
                                </button>
                            </p>
                            <p class="control">
                                <b-dropdown position="is-bottom-left">
                                    <button class="button is-success" slot="trigger" :disabled="isLoadingClients">
                                        <feather class="icon" type="chevron-down" size="20"></feather>
                                    </button>

                                    <b-dropdown-item @click="addAsset('physical')">Physical</b-dropdown-item>
                                    <b-dropdown-item @click="addAsset('software')">Software</b-dropdown-item>
                                    <b-dropdown-item @click="addAsset('virtual')">Virtual Machine</b-dropdown-item>
                                    <b-dropdown-item @click="addAsset('network')">Network</b-dropdown-item>
                                </b-dropdown>
                            </p>
                        </b-field>

                        <b-field  v-if="$parent.canDo('export-assets')">

                            <p class="control">


                                <b-dropdown position="is-bottom-left">
                                    <button class="button is-light" slot="trigger">
                                        <feather class="icon" type="download" size="20"></feather>
                                        <span> Export </span>
                                        <feather class="icon" type="chevron-down" size="20"></feather>
                                    </button>

                                    <b-dropdown-item @click="exportAssetsData()">All Assets</b-dropdown-item>
                                    <b-dropdown-item @click="exportAssetsData('physical')">Physical</b-dropdown-item>
                                    <b-dropdown-item @click="exportAssetsData('software')">Software</b-dropdown-item>
                                    <b-dropdown-item @click="exportAssetsData('virtual')">Virtual Machine</b-dropdown-item>
                                    <b-dropdown-item @click="exportAssetsData('network')">Network</b-dropdown-item>
                                    <b-dropdown-item @click="exportAssetsData('hardware')">Hardware</b-dropdown-item>
                                </b-dropdown>
                            </p>

                            <!-- <p class="control">
                                <button class="button is-light" @click="exportData">
                                    <feather class="icon" type="download" size="20"></feather>
                                    <span> Export </span>
                                </button>
                            </p>

                            <p class="control">
                                <b-dropdown position="is-bottom-left">
                                    <button class="button is-light" slot="trigger">
                                        <feather class="icon" type="chevron-down" size="20"></feather>
                                    </button>

                                    <b-dropdown-item @click="exportData('physical')">Physical</b-dropdown-item>
                                    <b-dropdown-item @click="exportData('software')">Software</b-dropdown-item>
                                    <b-dropdown-item @click="exportData('virtual')">Virtual Machine</b-dropdown-item>
                                    <b-dropdown-item @click="exportData('network')">Network</b-dropdown-item>
                                </b-dropdown> -->
                        </b-field>

                    </b-field>
                    <!--<button class="button is-light">
                        <feather class="icon" type="upload" size="20"></feather>
                    </button>-->
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
            data-v-step="10"
            v-model="activeTab"
            @input="showTab">

            <b-tab-item href="#physical" type="physical">
                <template slot="header" width="150px">
                    <feather type="server" size="15"></feather> &nbsp;
                    <span> Physical </span>
                </template>

                    <!-- <b-field>
                        <b-input placeholder="Search..."
                            type="search"
                            icon="magnify"
                            v-model="search_query.physical">
                        </b-input>
                        <p class="control">
                            <button class="button is-primary" @click="search('physical')">Search</button>
                        </p>
                    </b-field> -->

                    <div class="is-pulled-left m-b-10" v-if="physical.length && !loading.physical">
                        <b-input placeholder="Search..."
                            type="search"
                            icon="magnify"
                            v-model="search_query.physical">
                        </b-input>
                    </div>

                    <div class="is-pulled-right m-b-10" v-if="$parent.canDo('delete-assets') && physical.length">
                        <button @click="deleteAsset(checkedRows.physical, 'physical', false)" class="button is-danger is-small" :disabled="checkedRows.physical.length == 0">
                            <feather class="icon" type="trash-2" size="15" stroke="white"></feather>
                            <span>Delete Marked</span>
                        </button>
                    </div>

                    <div class="is-fullwidth text-center align-middle" style="min-height: 250px;" v-if="!loading.physical && !physical.length">
                        <img src="/images/windy.svg" style="height: 100px; min-height: 100px; margin-bottom: 10px;"/><br>
                        <i class="is-size-6">No Physical Host added yet</i>
                    </div>


                    <b-table
                        v-if="!loading.physical && physical.length"
                        ref="physical-table"
                        :data="filtered_physical"
                        :bordered="false"
                        :hoverable="true"
                        :paginated="false"
                        default-sort-direction="asc"
                        sort-icon="chevron-up"
                        sort-icon-size="is-small"
                        default-sort="id"
                        aria-next-label="Next"
                        aria-previous-label="Previous"
                        aria-page-label="Page"
                        aria-current-label="Current"
                        class="is-size-7"
                        checkbox-position="left"
                        :checked-rows.sync="checkedRows.physical"
                        :checkable="$parent.canDo('delete-assets')">

                        <template slot-scope="props">
                            <b-table-column field="client" label="Client" sortable>
                                {{ props.row.client ? props.row.client.name : '' }}
                            </b-table-column>

                            <b-table-column field="hostname" label="Host" sortable>
                                {{ props.row.hostname }}
                            </b-table-column>

                            <b-table-column field="model" label="Model" sortable>
                                {{ props.row.model }}
                            </b-table-column>

                            <b-table-column field="manufacturer" label="Manufacturer" sortable>
                                {{ props.row.manufacturer }}
                            </b-table-column>

                            <b-table-column field="service_tag" label="Service Tag" sortable>
                                {{ props.row.service_tag }}
                            </b-table-column>

                            <b-table-column field="ip_address" label="IP Address" sortable>
                                {{ props.row.ip_address }}
                            </b-table-column>

                            <b-table-column field="location" label="Location" sortable>
                                {{ props.row.location }}
                            </b-table-column>

                            <b-table-column field="action" centered class="text-middle" width="120">
                                <div class="field has-addons">
                                    <p class="control is-marginless" v-if="$parent.canDo('delete-assets')">
                                        <button @click="deleteAsset(props.row, 'physical')" class="button is-danger is-small">
                                        <feather class="icon" type="trash-2" size="15" stroke="white"></feather>
                                        </button>
                                    </p>
                                    <p class="control is-marginless">
                                        <button @click="view(props.row, 'asset_id')" class="button is-primary is-small">
                                            <span>View</span>
                                            <feather class="icon" type="chevron-right" size="15" stroke="white"></feather>
                                        </button>
                                    </p>
                                </div>
                            </b-table-column>
                        </template>
                    </b-table>
            </b-tab-item>

            <b-tab-item href="#software" type="software">
                <template slot="header" width="150px">
                    <feather type="shield" size="15"></feather> &nbsp;
                    <span> Software </span>
                </template>

                    <div class="is-pulled-left m-b-10" v-if="software.length && !loading.software">
                        <b-input placeholder="Search..."
                            type="search"
                            icon="magnify"
                            v-model="search_query.software">
                        </b-input>
                    </div>

                    <div class="is-pulled-right m-b-10" v-if="$parent.canDo('delete-assets') && software.length">
                        <button @click="deleteAsset(checkedRows.software, 'software', false)" class="button is-danger is-small" :disabled="checkedRows.software.length == 0">
                            <span>Delete Marked</span>
                            <feather class="icon" type="trash-2" size="15" stroke="white"></feather>
                        </button>
                    </div>

                    <div class="is-fullwidth text-center align-middle" style="min-height: 250px;" v-if="!loading.software && !software.length">
                        <img src="/images/windy.svg" style="height: 100px; min-height: 100px; margin-bottom: 10px;"/><br>
                        <i class="is-size-6">No Software added yet</i>
                    </div>

                    <b-table
                        v-if="!loading.software && software.length"
                        ref="software-table"
                        :data="filtered_software"
                        :bordered="false"
                        :hoverable="true"
                        :paginated="false"
                        default-sort-direction="asc"
                        sort-icon="chevron-up"
                        sort-icon-size="is-small"
                        default-sort="id"
                        aria-next-label="Next"
                        aria-previous-label="Previous"
                        aria-page-label="Page"
                        aria-current-label="Current"
                        class="is-size-7"
                        checkbox-position="left"
                        :checked-rows.sync="checkedRows.software"
                        :checkable="$parent.canDo('delete-assets')">

                    <template slot-scope="props">
                        <b-table-column field="client" label="Client" sortable>
                                {{ props.row.client ? props.row.client.name : '' }}
                            </b-table-column>

                        <b-table-column field="name" label="Name" sortable>
                            {{ props.row.name }}
                        </b-table-column>

                        <b-table-column field="description" label="Description" sortable>
                            {{ props.row.description }}
                        </b-table-column>

                        <b-table-column field="quantity" label="Quantity" sortable>
                                {{ props.row.quantity }}
                        </b-table-column>

                        <b-table-column field="allocation" label="Allocation" sortable>
                                {{ props.row.allocation }}
                        </b-table-column>

                        <b-table-column field="warranty_date" label="Warranty Date" sortable>
                                {{ props.row.warranty_date | formatDate('MMM DD, YYYY') }}
                        </b-table-column>

                        <b-table-column field="warranty" label="Warranty" sortable>
                                {{ props.row.warranty }}
                        </b-table-column>

                        <b-table-column field="warranty_type" label="Warranty Type" sortable>
                                {{ props.row.warranty_type }}
                        </b-table-column>

                        <b-table-column field="action" centered class="text-middle" width="120">
                            <div class="field has-addons">
                                <p class="control is-marginless" v-if="$parent.canDo('delete-assets')">
                                    <button @click="deleteAsset(props.row, 'software')" class="button is-danger is-small">
                                    <feather class="icon" type="trash-2" size="15" stroke="white"></feather>
                                    </button>
                                </p>
                                <p class="control is-marginless">
                                    <button @click="view(props.row, 'asset_id', 'software')" class="button is-primary is-small">
                                        <span>View</span>
                                        <feather class="icon" type="chevron-right" size="15" stroke="white"></feather>
                                    </button>
                                </p>
                                
                            </div>
                        </b-table-column>
                    </template>
                </b-table>

            </b-tab-item>

            <b-tab-item href="#virtual" type="virtual">
                <template slot="header" width="150px">
                    <feather type="monitor" size="15"></feather> &nbsp;
                    <span> Virtual Machine </span>
                </template>

                    <div class="is-pulled-left m-b-10" v-if="virtual.length && !loading.virtual">
                        <b-input placeholder="Search..."
                            type="search"
                            icon="magnify"
                            v-model="search_query.virtual">
                        </b-input>
                    </div>

                    <div class="is-pulled-right m-b-10" v-if="$parent.canDo('delete-assets') && virtual.length">
                        <button @click="deleteAsset(checkedRows.virtual, 'virtual', false)" class="button is-danger is-small" :disabled="checkedRows.virtual.length == 0">
                            <span>Delete Marked</span>
                            <feather class="icon" type="trash-2" size="15" stroke="white"></feather>
                        </button>
                    </div>

                    <div class="is-fullwidth text-center align-middle" style="min-height: 250px;" v-if="!loading.virtual && !virtual.length">
                        <img src="/images/windy.svg" style="height: 100px; min-height: 100px; margin-bottom: 10px;"/><br>
                        <i class="is-size-6">No Virtual Machine added yet</i>
                    </div>

                    <b-table
                        v-if="!loading.virtual && virtual.length"
                        ref="vm-table"
                        :data="filtered_virtual"
                        :bordered="false"
                        :hoverable="true"
                        :paginated="false"
                        default-sort-direction="asc"
                        sort-icon="chevron-up"
                        sort-icon-size="is-small"
                        default-sort="id"
                        aria-next-label="Next"
                        aria-previous-label="Previous"
                        aria-page-label="Page"
                        aria-current-label="Current"
                        class="is-size-7"
                        checkbox-position="left"
                        :checked-rows.sync="checkedRows.virtual"
                        :checkable="$parent.canDo('delete-assets')">

                        <template slot-scope="props">
                            <b-table-column field="client" label="Client" sortable>
                                {{ props.row.client ? props.row.client.name : '' }}
                            </b-table-column>

                            <b-table-column field="Hostname" label="Hostname" sortable>
                                {{ props.row.hostname }}
                            </b-table-column>

                            <b-table-column field="ip_address" label="IP Address" sortable>
                                {{ props.row.ip_address }}
                            </b-table-column>

                            <b-table-column field="group" label="Host" sortable>
                                {{ props.row.group }}
                            </b-table-column>

                            <b-table-column field="role" label="Role" sortable>
                                {{ props.row.role }}
                            </b-table-column>

                            <b-table-column field="location" label="Location" sortable>
                                {{ props.row.location }}
                            </b-table-column>

                            <b-table-column field="datacenter" label="Data Center" sortable>
                                {{ props.row.datacenter }}
                            </b-table-column>

                            <b-table-column field="action" centered class="text-middle" width="120">
                                <div class="field has-addons">
                                    <p class="control is-marginless" v-if="$parent.canDo('delete-assets')">
                                        <button @click="deleteAsset(props.row, 'virtual')" class="button is-danger is-small">
                                        <feather class="icon" type="trash-2" size="15" stroke="white"></feather>
                                        </button>
                                    </p>
                                    <p class="control is-marginless">
                                        <button @click="view(props.row, 'asset_id')" class="button is-primary is-small">
                                            <span>View</span>
                                            <feather class="icon" type="chevron-right" size="15" stroke="white"></feather>
                                        </button>
                                    </p>
                                </div>
                            </b-table-column>
                        </template>
                    </b-table>
            </b-tab-item>

            <b-tab-item href="#network" type="network">
                <template slot="header" width="150px">
                    <feather type="wifi" size="15"></feather> &nbsp;
                    <span> Network </span>
                </template>

                    <div class="is-pulled-left m-b-10" v-if="network.length && !loading.network">
                        <b-input placeholder="Search..."
                            type="search"
                            icon="magnify"
                            v-model="search_query.network">
                        </b-input>
                    </div>

                    <div class="is-pulled-right m-b-10" v-if="$parent.canDo('delete-assets') && network.length">
                        <button @click="deleteAsset(checkedRows.network, 'network', false)" class="button is-danger is-small" :disabled="checkedRows.network.length == 0">
                            <span>Delete Marked</span>
                            <feather class="icon" type="trash-2" size="15" stroke="white"></feather>
                        </button>
                    </div>

                    <div class="is-fullwidth text-center align-middle" style="min-height: 250px;" v-if="!loading.network && !network.length">
                        <img src="/images/windy.svg" style="height: 100px; min-height: 100px; margin-bottom: 10px;"/><br>
                        <i class="is-size-6">No Network added yet</i>
                    </div>

                    <b-table
                        v-else
                        ref="network-table"
                        :data="filtered_network"
                        :bordered="false"
                        :hoverable="true"
                        :paginated="false"
                        default-sort-direction="asc"
                        sort-icon="chevron-up"
                        sort-icon-size="is-small"
                        default-sort="id"
                        aria-next-label="Next"
                        aria-previous-label="Previous"
                        aria-page-label="Page"
                        aria-current-label="Current"
                        class="is-size-7"
                        checkbox-position="left"
                        :checked-rows.sync="checkedRows.network"
                        :checkable="$parent.canDo('delete-assets')">

                        <template slot-scope="props">
                            <b-table-column field="client" label="Client" sortable>
                                {{ props.row.client ? props.row.client.name : '' }}
                            </b-table-column>

                            <b-table-column field="Hostname" label="Hostname" sortable>
                                {{ props.row.hostname }}
                            </b-table-column>

                            <b-table-column field="ip_address" label="IP Address" sortable>
                                {{ props.row.ip_address }}
                            </b-table-column>

                            <b-table-column field="group" label="Group" sortable>
                                {{ props.row.group }}
                            </b-table-column>

                            <b-table-column field="vendor" label="Vendor" sortable>
                                {{ props.row.vendor }}
                            </b-table-column>

                            <!--<b-table-column field="hardware_type" label="Hardware Type" sortable>
                                {{ props.row.hardware_type }}
                            </b-table-column>-->

                            <b-table-column field="role" label="Device Function" sortable>
                                {{ props.row.role }}
                            </b-table-column>

                            <b-table-column field="location" label="Location" sortable>
                                {{ props.row.location }}
                            </b-table-column>

                            <b-table-column field="datacenter" label="Data Center" sortable>
                                {{ props.row.datacenter }}
                            </b-table-column>

                            <b-table-column field="action" centered class="text-middle" width="120">
                                <div class="field has-addons">
                                    <p class="control is-marginless" v-if="$parent.canDo('delete-assets')">
                                        <button @click="deleteAsset(props.row, 'network')" class="button is-danger is-small">
                                        <feather class="icon" type="trash-2" size="15" stroke="white"></feather>
                                        </button>
                                    </p>
                                    <p class="control is-marginless">
                                        <button @click="view(props.row, 'asset_id')" class="button is-primary is-small">
                                            <span>View</span>
                                            <feather class="icon" type="chevron-right" size="15" stroke="white"></feather>
                                        </button>
                                    </p>
                                </div>
                            </b-table-column>
                        </template>
                    </b-table>

            </b-tab-item>

            <b-tab-item href="#hardware" type="hardware">
                <template slot="header" width="150px">
                    <feather type="video" size="15"></feather> &nbsp;
                    <span> Hardware </span>
                </template>

                    <div class="is-pulled-left m-b-10" v-if="hardware.length && !loading.hardware">
                        <b-input placeholder="Search..."
                            type="search"
                            icon="magnify"
                            v-model="search_query.hardware">
                        </b-input>
                    </div>

                    <div class="is-fullwidth text-center align-middle" style="min-height: 250px;" v-if="!loading.hardware && !hardware.length">
                        <img src="/images/windy.svg" style="height: 100px; min-height: 100px; margin-bottom: 10px;"/><br>
                        <i class="is-size-6">No Hardware added yet</i>
                    </div>

                    <b-table
                        v-if="!loading.hardware && hardware.length"
                        ref="hardware-table"
                        :data="filtered_hardware"
                        :bordered="false"
                        :hoverable="true"
                        :paginated="false"
                        default-sort-direction="asc"
                        sort-icon="chevron-up"
                        sort-icon-size="is-small"
                        default-sort="id"
                        aria-next-label="Next"
                        aria-previous-label="Previous"
                        aria-page-label="Page"
                        aria-current-label="Current"
                        class="is-size-7"
                        checkbox-position="left">

                    <template slot-scope="props">
                        <!--<b-table-column field="client" label="Client" sortable>
                            {{ props.row.client ? props.row.client.name : '' }}
                        </b-table-column>-->

                        <b-table-column field="vendor" label="Vendor" sortable>
                            {{ props.row.vendor }}
                        </b-table-column>

                        <b-table-column field="model_number" label="Model_Number" sortable>
                            {{ props.row.model_number }}
                        </b-table-column>

                        <b-table-column field="description" label="Description" sortable>
                            {{ props.row.description }}
                        </b-table-column>

                        <b-table-column field="serial_number" label="Serial Number" sortable width="170">
                                {{ props.row.serial_number }}
                        </b-table-column>

                        <b-table-column field="warranty_type" label="Warranty Expiration" sortable>
                                {{ props.row.warranty_type }}
                        </b-table-column>
                    </template>
                </b-table>

            </b-tab-item>

            <b-tab-item href="#pending" type="pending" v-if="checkPermission()">
                <template slot="header" width="150px">
                    <feather type="check-square" size="15"></feather> &nbsp;
                    <span> Pending </span>
                    <b-tag rounded v-if="(pending.length + pending_softwares.length)" type="is-danger" class="is-small" style="font-size: 8pt;"> {{pending.length + pending_softwares.length }} </b-tag>
                </template>

                <b-table
                    v-if="pending.length"
                    :data="pending"
                    :bordered="false"
                    :hoverable="true"
                    :paginated="false"
                    sort-icon="chevron-up"
                    sort-icon-size="is-small"
                    default-sort="approval_id"
                    aria-next-label="Next page"
                    aria-previous-label="Previous page"
                    aria-page-label="Page"
                    aria-current-label="Current page"
                    class="is-size-7">

                    <template slot-scope="props">
                        <!--<b-table-column field="id" label="ID" width="60" sortable numeric>
                            {{ props.row.certificate.certificate_id }}
                        </b-table-column>-->
                        <b-table-column field="client" label="Client" sortable>
                                {{ props.row.asset.client ? props.row.asset.client.name : '' }}
                            </b-table-column>

                        <b-table-column field="asset_type" label="Type" sortable>
                            {{ props.row.asset.asset_type }}
                        </b-table-column>

                        <b-table-column field="hostname" label="Hostname" sortable>
                            {{ props.row.asset.hostname }}
                        </b-table-column>

                        <b-table-column field="ip_address" label="IP Address" sortable>
                                {{ props.row.asset.ip_address }}
                        </b-table-column>

                        <b-table-column field="created_at" label="Date Requested" sortable>
                                {{ props.row.created_at | formatDate }}
                        </b-table-column>

                        <b-table-column field="requested_by" label="Requested By" sortable>
                                {{ props.row.user.name }}
                        </b-table-column>

                        <b-table-column field="action" centered class="text-middle" width="165">
                                <div class="field has-addons">
                                    <p class="control is-marginless">
                                        <button @click="confirmApproval(props.row, 'approved')" class="button is-success is-small">
                                        <feather class="icon" type="check" size="15" stroke="white"></feather>
                                        </button>
                                    </p>
                                    <p class="control is-marginless">
                                        <button @click="confirmApproval(props.row, 'rejected')" class="button is-danger is-small">
                                        <feather class="icon" type="x" size="15" stroke="white"></feather>
                                        </button>
                                    </p>
                                    <p class="control is-marginless">
                                        <button @click="view(props.row, 'module_item_id')" class="button is-primary is-small">
                                            <span>View</span>
                                            <feather class="icon" type="chevron-right" size="15" stroke="white"></feather>
                                        </button>
                                    </p>
                                </div>

                        </b-table-column>
                    </template>
                </b-table>

                <p class="menu-label" v-if="pending_softwares.length">Software</p>

                <b-table
                    v-if="pending_softwares.length"
                    :data="pending_softwares"
                    :bordered="false"
                    :hoverable="true"
                    :paginated="false"
                    sort-icon="chevron-up"
                    sort-icon-size="is-small"
                    default-sort="approval_id"
                    aria-next-label="Next page"
                    aria-previous-label="Previous page"
                    aria-page-label="Page"
                    aria-current-label="Current page"
                    class="is-size-7">

                    <template slot-scope="props">
                        <!--<b-table-column field="id" label="ID" width="60" sortable numeric>
                            {{ props.row.certificate.certificate_id }}
                        </b-table-column>-->

                        <b-table-column field="name" label="Name" sortable>
                            {{ props.row.software.name }}
                        </b-table-column>

                        <b-table-column field="description" label="Description" sortable>
                            {{ props.row.software.description }}
                        </b-table-column>

                        <b-table-column field="quantity" label="Quantity" sortable>
                                {{ props.row.software.quantity }}
                        </b-table-column>

                        <b-table-column field="allocation" label="Allocation" sortable>
                                {{ props.row.software.allocation }}
                        </b-table-column>

                        <b-table-column field="created_at" label="Date Requested" sortable>
                                {{ props.row.created_at | formatDate }}
                        </b-table-column>

                        <b-table-column field="requested_by" label="Requested By" sortable>
                                {{ props.row.user.name }}
                        </b-table-column>

                        <b-table-column field="action" centered class="text-middle" width="165">
                                <div class="field has-addons">
                                    <p class="control is-marginless">
                                        <button @click="confirmApproval(props.row, 'approved', 'software')" class="button is-success is-small">
                                        <feather class="icon" type="check" size="15" stroke="white"></feather>
                                        </button>
                                    </p>
                                    <p class="control is-marginless">
                                        <button @click="confirmApproval(props.row, 'rejected', 'software')" class="button is-danger is-small">
                                        <feather class="icon" type="x" size="15" stroke="white"></feather>
                                        </button>
                                    </p>
                                    <p class="control is-marginless">
                                        <button @click="view(props.row, 'module_item_id', 'software')" class="button is-primary is-small">
                                            <span>View</span>
                                            <feather class="icon" type="chevron-right" size="15" stroke="white"></feather>
                                        </button>
                                    </p>
                                </div>

                        </b-table-column>
                    </template>
                </b-table>

                <div class="is-fullwidth text-center align-middle" style="min-height: 250px;" v-if="!pending.length && !pending_softwares.length && !loading.pending">
                    <img src="/images/windy.svg" style="height: 100px; min-height: 100px; margin-bottom: 10px;"/><br>
                    <i class="is-size-6">No Pending Requests</i>
                </div>
            </b-tab-item>
        </b-tabs>
    </b-field>

    <b-loading :is-full-page="false" style="min-height: 350px" :active.sync="loading[activeType] || loadingDelete[activeType]" :can-cancel="false"></b-loading>
    <b-loading :is-full-page="false" style="min-height: 350px" :active.sync="isBusyExporting" :can-cancel="false"></b-loading>
</section>
</div>
</div>
</template>

<script>
import exampleAssetData from '../../data/assets.json'
import AddAsset from '../components/modals/AddAsset.vue'
import AssetDetails from '../components/modals/AssetDetails.vue'
import AssetSoftwareDetails from '../components/modals/AssetSoftwareDetails.vue'
import PhysicalForm from './forms/PhysicalForm.vue'
import SoftwareForm from '../components/forms/SoftwareForm.vue'
import VirtualForm from '../components/forms/VirtualForm.vue'
import NetworkForm from '../components/forms/NetworkForm.vue'
import { headers } from '../../data/excel_settings.json'
import hardwares from '../../data/hardwares.json'

import { saveAs } from 'file-saver'

export default {
    components: {
        AddAsset,
        AssetDetails,
        AssetSoftwareDetails,
        PhysicalForm,
        SoftwareForm,
        VirtualForm,
        NetworkForm
    },
    data() {
        return {
            loading: {
                physical: false,
                software: false,
                virtual: false,
                network: false,
                hardware: false,
                pending: true
            },
            search_query: {
                physical: '',
                software: '',
                virtual: '',
                network: '',
                hardware: '',
                pending: ''
            },
            activeTab: 0,
            activeType: 'physical',
            activePage: 0,
            physical: [],
            software: [],
            virtual: [],
            network: [],
            hardware: [],
            clients: [],
            isLoadingClients: true,
            forms: {
                physical: PhysicalForm,
                software: SoftwareForm,
                virtual: VirtualForm,
                network: NetworkForm
            },
            pending: [],
            pending_softwares: [],
            tabs: {
                '#physical' : 0,
                '#software' : 1,
                '#virtual' : 2,
                '#network' : 3,
                '#hardware' : 4,
                '#pending' : 5,
                
            },
            assets_api: {
                physical: '/api/assets?type=physical',
                software: '/api/softwares',
                virtual: '/api/assets?type=virtual',
                network: '/api/assets?type=network',
            },
            excel_data: [],
            asset_fields: {
                'physical' : headers.physical,
                'software' : headers.software,
                'virtual' : headers.virtual,
                'network' : headers.network,
                'hardware' : headers.hardware
            },
            sample_data: {
            // We will make a Workbook contains 2 Worksheets
            'animals': [
                {"id": 1, "name": "cat", "category": "animal"},
                {"id": 2, "name": "dog", "category": "animal"},
                {"id": 3, "name": "pig", "category": "animal"}
            ],
            'pokemons': [
                    {"id": 1, "name": "pikachu", "category": "pokemon"},
                    {"id": 2, "name": "Arbok", "category": "pokemon"},
                    {"id": 3, "name": "Eevee", "category": "pokemon"}
                ]
            },
            isBusyExporting: false,
            checkedRows: {
                physical: [],
                software: [],
                virtual: [],
                network: [],
                hardware: []
            },
            loadingDelete: {
                physical: false,
                software: false,
                virtual: false,
                network: false,
                hardware: false,
                pending: false
            }
        }
    },
    created() {
        if(location.hash) {
            this.activeTab = this.tabs[location.hash];
            if(location.hash != '#pending') {
                this.activeType = location.hash.substring(1);
            }
        }
        this.fetchClients();
        this.hardware = hardwares;
        this.fetchData(this.assets_api[this.activeType], this.activeType);
        this.$axios.all([
            axios.get('/api/approvals?type=asset'),
            axios.get('/api/approvals?type=software')
        ])
        .then(axios.spread((pendingRes, pendingSoftRes) => {
            this.pending = pendingRes.data.data;
            this.pending_softwares = pendingSoftRes.data.data;
            this.loading.pending = false;
        }));
    },
    computed: {
        filtered_physical() {
            if(!this.search_query['physical']){
                return this['physical'];
            }else{
                let search_query = this.search_query['physical'].replace(/^\s+|\s+$/gm,'').toLowerCase();
                let filtered = [];

                filtered = this['physical'].filter(
                    data => (
                    (data.client_id ? data.client.name.toLowerCase().includes(search_query) : false) ||
                    data.hostname.toLowerCase().includes(search_query) ||
                    data.ip_address.toLowerCase().includes(search_query) ||
                    data.model.toLowerCase().includes(search_query) ||
                    data.manufacturer.toLowerCase().includes(search_query) ||
                    data.service_tag.toLowerCase().includes(search_query) ||
                    data.location.toLowerCase().includes(search_query))
                );

                return filtered;
            }
        },
        filtered_software() {
            if(!this.search_query['software']){
                return this['software'];
            }else{
                let search_query = this.search_query['software'].replace(/^\s+|\s+$/gm,'').toLowerCase();
                let filtered = [];

                filtered = this['software'].filter(
                    data => (
                    (data.client_id ? data.client.name.toLowerCase().includes(search_query) : false) ||
                    data.name.toLowerCase().includes(search_query) ||
                    data.description.toLowerCase().includes(search_query) ||
                    data.quantity.toString().includes(search_query) ||
                    data.allocation.toLowerCase().includes(search_query) ||
                    (this.$moment(data.warranty_date).format('MMM DD, YYYY')).toLowerCase().includes(search_query) ||
                    data.warranty_type.toLowerCase().includes(search_query))
                );

                return filtered;
            }
        },
        filtered_hardware() {
            if(!this.search_query['hardware']){
                return this['hardware'];
            }else{
                let search_query = this.search_query['hardware'].replace(/^\s+|\s+$/gm,'').toLowerCase();
                let filtered = [];

                filtered = this['hardware'].filter(
                    data => (
                    data.vendor.toLowerCase().includes(search_query) ||
                    data.model_number.toLowerCase().includes(search_query) ||
                    data.description.toLowerCase().includes(search_query) ||
                    data.serial_number.toLowerCase().includes(search_query) ||
                    data.warranty_type.toLowerCase().includes(search_query))
                );

                return filtered;
            }
        },
        filtered_virtual() {
            if(!this.search_query['virtual']){
                return this['virtual'];
            }else{
                let search_query = this.search_query['virtual'].replace(/^\s+|\s+$/gm,'').toLowerCase();
                let filtered = [];

                filtered = this['virtual'].filter(
                    data => (
                    (data.client_id ? data.client.name.toLowerCase().includes(search_query) : false) ||
                    data.hostname.toLowerCase().includes(search_query) ||
                    data.ip_address.toLowerCase().includes(search_query) ||
                    data.group.toLowerCase().includes(search_query) ||
                    data.role.toLowerCase().includes(search_query) ||
                    data.datacenter.toLowerCase().includes(search_query) ||
                    data.location.toLowerCase().includes(search_query))
                );

                return filtered;
            }
        },
        filtered_network() {
            if(!this.search_query['network']){
                return this['network'];
            }else{
                let search_query = this.search_query['network'].replace(/^\s+|\s+$/gm,'').toLowerCase();
                let filtered = [];

                filtered = this['network'].filter(
                    data => (
                    (data.client_id ? data.client.name.toLowerCase().includes(search_query) : false) ||
                    data.hostname.toLowerCase().includes(search_query) ||
                    data.ip_address.toLowerCase().includes(search_query) ||
                    data.group.toLowerCase().includes(search_query) ||
                    data.role.toLowerCase().includes(search_query) ||
                    data.datacenter.toLowerCase().includes(search_query) ||
                    data.location.toLowerCase().includes(search_query))
                );

                return filtered;
            }
        }
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
        exportExcel(data = {}, type = 'all') {

            // if(type == 'all') {

            // }

            const fills = {
                solid: {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: {
                        argb: "32a77e"
                    }
                },
                red: {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: {
                        argb: "c0514d"
                    }
                },
                yellow: {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: {
                        argb: "ecad0e"
                    }
                },
                green: {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: {
                        argb: "76933c"
                    }
                },
                grayBorder: {
                    bottom: {style:'dotted', color: {argb:'bfbfbf'}}
                }
            };

            const ws_ppts = {
                properties: {
                    // tabColor: {
                    //     argb:'FFC0000'
                    // },
                    //defaultRowHeight: 30
                    styles: {
                        font: {
                            size: 9
                        }
                    }
                },
                styles: {
                    font: {
                        size: 9
                    }
                },
                views: [
                    {state: 'frozen', ySplit: 1, xSplit: 1}
                ]
            }

             //create a workbook
            var workbook = new this.$Excel.Workbook();

            //add worksheet
            var ws1 = workbook.addWorksheet(`${type} (${data.length})`, ws_ppts);
            var ws2 = workbook.addWorksheet('Pokemons', ws_ppts);


            ws1.columns = this.asset_fields.physical

            ws1.autoFilter = {
                from: 'A1',
                to: {
                    row: 1,
                    column: 13
                }
            }

            ws2.columns = [
                { header: 'ID', key: 'id', width: 5},
                { header: 'Name', key: 'name', width: 15},
                { header: 'Category', key: 'category', width: 10}
            ];

            ws2.getColumn(1).alignment = {horizontal: 'center'}
            ws2.getRow(1).font={size: 12, bold: true };
            ws2.getRow(1).height = 30;
            ws2.getRow(1).fill=fills.solid;
            ws2.getRow(1).alignment = { vertical: 'middle', horizontal: 'center'};


            //ws1.addRows(this.sample_data['animals']);
            ws1.addRows(data)
            ws2.addRows(this.sample_data['pokemons']);

            ws1.eachRow(function(row, rowNumber) {
                if(rowNumber > 1) {
                    ws1.getRow(rowNumber).border = fills.grayBorder;
                    ws1.getRow(rowNumber).height = 30;
                    ws1.getRow(rowNumber).font = {size: 10};
                    ws1.getRow(rowNumber).alignment = { wrapText: true, vertical: "middle" }

                    let cell = ws1.getCell('C' + rowNumber);
                    ws1.getCell('C' + rowNumber).font = {color: {argb: "FFFFFF"}}
                    //ws1.getCell('C' + rowNumber).alignment = {vertical: "middle", horizontal: "center" }
                    let priority = cell.value;
                    if(priority == "Low") {
                        cell.fill = fills.green
                    }else if(priority == "Medium"){
                        cell.fill = fills.yellow
                    }else if(priority == "High"){
                        cell.fill = fills.red
                    }
                }
            });

            ws1.getColumn("BE").alignment = {vertical: "top", wrapText: true}

            ws1.getColumn(3).alignment = {horizontal: 'center', vertical: 'middle'}
            ws1.getColumn(3).style.font = {color: {argb: "#FFFFFF"}}
            ws1.getRow(1).font={size: 10, bold: true };
            ws1.getRow(1).height = 30;
            ws1.getRow(1).fill=fills.solid;
            ws1.getRow(1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true};

            ws2.eachRow(function(row, rowNumber) {
                if(rowNumber > 1) ws2.getRow(rowNumber).height = 20; ws2.getRow(rowNumber).alignment = { wrapText: true }
            });

            let that = this;
            workbook.xlsx.writeBuffer()
            .then(function(buffer) {
                saveAs(new Blob([buffer]), '[' + that.$moment().format('YYYY-MM-DD') + ']' + `${type.toUpperCase()}.xlsx`);
            });


        },

        //ADDED BELOW CODES 18/08/2020
        exportAssetsData(type = '') {
            this.isBusyExporting = true;
            if (type == '')
            {
                this.$axios
                .get(`/api/assets?type=all_types&fetch=all&for=export_excel`)
                .then(response => {
                    this.excel_data = response.data;

                    this.exportAllData(this.excel_data)
                });
            }
            else
            {
                if(type == 'hardware') {
                    this.exportSpecificTypeData(this.hardware, type)
                }else {
                    this.$axios
                    .get(`/api/assets?type=${type}&fetch=all&for=export_excel`)
                    .then(response => {
                        this.excel_data = response.data;
                        // if (type == 'physical')
                        // {
                        //     this.excel_data = response.data;
                        // }
                        // else
                        // {
                        //     this.excel_data = response.data.data;
                        // }
                        this.exportSpecificTypeData(this.excel_data, type)
                    });
                }
                
            }
        },
        exportAllData(data) {
            const ws_ppts = {
                properties: {
                    // tabColor: {
                    //     argb:'FFC0000'
                    // },
                    //defaultRowHeight: 30
                    styles: {
                        font: {
                            size: 9
                        }
                    }
                },
                styles: {
                    font: {
                        size: 9
                    }
                },
                views: [
                    {state: 'frozen', ySplit: 1, xSplit: 0}
                ]
            };

            //initialize worksheet
            var workbook = new this.$Excel.Workbook();

            //add worksheet
            var ws1 = workbook.addWorksheet(`Physical Host (${data.physical.length})`, ws_ppts);
            var ws2 = workbook.addWorksheet(`Softwares (${data.software.length})`, ws_ppts);
            var ws3 = workbook.addWorksheet(`Virtual Machines (${data.virtual.length})`, ws_ppts);
            var ws4 = workbook.addWorksheet(`Network Machines (${data.network.length})`, ws_ppts);
            var ws5 = workbook.addWorksheet(`Hardwares (${this.hardware.length})`, ws_ppts);

            //setting up the columns and rows
            ws1.columns = this.asset_fields.physical;
            ws2.columns = this.asset_fields.software;
            ws3.columns = this.asset_fields.virtual;
            ws4.columns = this.asset_fields.network;
            ws5.columns = this.asset_fields.hardware;

            ws1.autoFilter = {
                from: 'A1',
                to: {
                    row: 1,
                    column: this.asset_fields.physical.length
                }
            }
            ws2.autoFilter = {
                from: 'A1',
                to: {
                    row: 1,
                    column: this.asset_fields.software.length
                }
            }
            ws3.autoFilter = {
                from: 'A1',
                to: {
                    row: 1,
                    column: this.asset_fields.virtual.length
                }
            }
            ws4.autoFilter = {
                from: 'A1',
                to: {
                    row: 1,
                    column: this.asset_fields.network.length
                }
            }
            ws5.autoFilter = {
                from: 'A1',
                to: {
                    row: 1,
                    column: this.asset_fields.hardware.length
                }
            }

            ws1.addRows(this.filteredObjKey(data.physical,this.asset_fields.physical));
            ws2.addRows(this.filteredObjKey(data.software,this.asset_fields.software));
            ws3.addRows(this.filteredObjKey(data.virtual,this.asset_fields.virtual));
            ws4.addRows(this.filteredObjKey(data.network,this.asset_fields.network));
            ws5.addRows(this.filteredObjKey(this.hardware,this.asset_fields.hardware));

            ws1.eachRow(function(row, rowNumber) {
                ws1.getRow(rowNumber).border = {
                    top: {style:'thin'},
                    left: {style:'thin'},
                    bottom: {style:'thin'},
                    right: {style:'thin'}
                }

                ws1.getRow(rowNumber).height = 30;
                ws1.getRow(rowNumber).alignment = {
                    vertical: 'middle',
                    horizontal: 'center',
                    wrapText: true
                };

                if(rowNumber == 1)
                {
                    ws1.getRow(rowNumber).font = {
                        name: 'Calibri',
                        size: 11,
                        bold: true
                    };

                     ws1.getRow(rowNumber).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor:{argb:'38c172'},
                        bgColor:{argb:'38c172'}
                     }
                }
                else
                {
                    ws1.getRow(rowNumber).font = {
                        name: 'Calibri',
                        size: 10
                    };
                }
            });
            ws2.eachRow(function(row, rowNumber) {
                ws2.getRow(rowNumber).border = {
                    top: {style:'thin'},
                    left: {style:'thin'},
                    bottom: {style:'thin'},
                    right: {style:'thin'}
                }

                ws2.getRow(rowNumber).height = 30;
                ws2.getRow(rowNumber).alignment = {
                    vertical: 'middle',
                    horizontal: 'center',
                    wrapText: true
                };

                if(rowNumber == 1)
                {
                    ws2.getRow(rowNumber).font = {
                        name: 'Calibri',
                        size: 11,
                        bold: true
                    };

                     ws2.getRow(rowNumber).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor:{argb:'38c172'},
                        bgColor:{argb:'38c172'}
                     }
                }
                else
                {
                    ws2.getRow(rowNumber).font = {
                        name: 'Calibri',
                        size: 10
                    };
                }
            });
            ws3.eachRow(function(row, rowNumber) {
                ws3.getRow(rowNumber).border = {
                    top: {style:'thin'},
                    left: {style:'thin'},
                    bottom: {style:'thin'},
                    right: {style:'thin'}
                }

                ws3.getRow(rowNumber).height = 30;
                ws3.getRow(rowNumber).alignment = {
                    vertical: 'middle',
                    horizontal: 'center',
                    wrapText: true
                };

                if(rowNumber == 1)
                {
                    ws3.getRow(rowNumber).font = {
                        name: 'Calibri',
                        size: 11,
                        bold: true
                    };

                     ws3.getRow(rowNumber).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor:{argb:'38c172'},
                        bgColor:{argb:'38c172'}
                     }
                }
                else
                {
                    ws3.getRow(rowNumber).font = {
                        name: 'Calibri',
                        size: 10
                    };
                }
            });
            ws4.eachRow(function(row, rowNumber) {
                ws4.getRow(rowNumber).border = {
                    top: {style:'thin'},
                    left: {style:'thin'},
                    bottom: {style:'thin'},
                    right: {style:'thin'}
                }

                ws4.getRow(rowNumber).height = 30;
                ws4.getRow(rowNumber).alignment = {
                    vertical: 'middle',
                    horizontal: 'center',
                    wrapText: true
                };

                if(rowNumber == 1)
                {
                    ws4.getRow(rowNumber).font = {
                        name: 'Calibri',
                        size: 11,
                        bold: true
                    };

                     ws4.getRow(rowNumber).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor:{argb:'38c172'},
                        bgColor:{argb:'38c172'}
                     }
                }
                else
                {
                    ws4.getRow(rowNumber).font = {
                        name: 'Calibri',
                        size: 10
                    };
                }
            });

            ws5.eachRow(function(row, rowNumber) {
                ws5.getRow(rowNumber).border = {
                    top: {style:'thin'},
                    left: {style:'thin'},
                    bottom: {style:'thin'},
                    right: {style:'thin'}
                }

                ws5.getRow(rowNumber).height = 30;
                ws5.getRow(rowNumber).alignment = {
                    vertical: 'middle',
                    horizontal: 'center',
                    wrapText: true
                };

                if(rowNumber == 1)
                {
                    ws5.getRow(rowNumber).font = {
                        name: 'Calibri',
                        size: 11,
                        bold: true
                    };

                     ws5.getRow(rowNumber).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor:{argb:'38c172'},
                        bgColor:{argb:'38c172'}
                     }
                }
                else
                {
                    ws5.getRow(rowNumber).font = {
                        name: 'Calibri',
                        size: 10
                    };
                }
            });

            //download excel file
            let that = this;
            workbook.xlsx.writeBuffer()
            .then(function(buffer) {
                saveAs(new Blob([buffer]), '[' + that.$moment().format('YYYY-MM-DD') + '] ' + `ASSETS.xlsx`);
            });

            this.isBusyExporting = false;
        },
        exportSpecificTypeData(data, type) {

            const ws_ppts = {
                properties: {
                    // tabColor: {
                    //     argb:'FFC0000'
                    // },
                    //defaultRowHeight: 30
                    styles: {
                        font: {
                            size: 9
                        }
                    }
                },
                styles: {
                    font: {
                        size: 9
                    }
                },
                views: [
                    {state: 'frozen', ySplit: 1, xSplit: 0}
                ]
            };

            //initialize worksheet
            var workbook = new this.$Excel.Workbook();

            //add worksheet
            var ws1 = workbook.addWorksheet(`${type} (${data.length})`, ws_ppts);

            //setting up the columns and rows
            switch(type)
            {
                case 'physical':
                    ws1.columns = this.asset_fields.physical;
                    ws1.autoFilter = {
                        from: 'A1',
                        to: {
                            row: 1,
                            column: this.asset_fields.physical.length
                        }
                    }
                    ws1.addRows(this.filteredObjKey(data,this.asset_fields.physical));
                    break;
                case 'software':
                    ws1.columns = this.asset_fields.software;
                    ws1.autoFilter = {
                        from: 'A1',
                        to: {
                            row: 1,
                            column: this.asset_fields.software.length
                        }
                    }
                    ws1.addRows(this.filteredObjKey(data,this.asset_fields.software));
                    break;
                case 'virtual':
                    ws1.columns = this.asset_fields.virtual;
                    ws1.autoFilter = {
                        from: 'A1',
                        to: {
                            row: 1,
                            column: this.asset_fields.virtual.length
                        }
                    }
                    ws1.addRows(this.filteredObjKey(data,this.asset_fields.virtual));
                    break;
                case 'network':
                    ws1.columns = this.asset_fields.network;
                    ws1.autoFilter = {
                        from: 'A1',
                        to: {
                            row: 1,
                            column: this.asset_fields.network.length
                        }
                    }
                    ws1.addRows(this.filteredObjKey(data,this.asset_fields.network));
                    break;
                case 'hardware':
                    ws1.columns = this.asset_fields.hardware;
                    ws1.autoFilter = {
                        from: 'A1',
                        to: {
                            row: 1,
                            column: this.asset_fields.hardware.length
                        }
                    }
                    ws1.addRows(this.filteredObjKey(data,this.asset_fields.hardware));
                    break;
                default:
                    ws1.columns = this.asset_fields.physical;
                    ws1.autoFilter = {
                        from: 'A1',
                        to: {
                            row: 1,
                            column: this.asset_fields.physical.length
                        }
                    }
                    ws1.addRows(this.filteredObjKey(data,this.asset_fields.physical));
                    break;
            }

            ws1.eachRow(function(row, rowNumber) {
                ws1.getRow(rowNumber).border = {
                    top: {style:'thin'},
                    left: {style:'thin'},
                    bottom: {style:'thin'},
                    right: {style:'thin'}
                }

                ws1.getRow(rowNumber).height = 30;
                ws1.getRow(rowNumber).alignment = {
                    vertical: 'middle',
                    horizontal: 'center',
                    wrapText: true
                };

                if(rowNumber == 1)
                {
                    ws1.getRow(rowNumber).font = {
                        name: 'Calibri',
                        size: 11,
                        bold: true
                    };

                     ws1.getRow(rowNumber).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor:{argb:'38c172'},
                        bgColor:{argb:'38c172'}
                     }
                }
                else
                {
                    ws1.getRow(rowNumber).font = {
                        name: 'Calibri',
                        size: 10
                    };
                }

            });

            //download excel file
            let that = this;
            workbook.xlsx.writeBuffer()
            .then(function(buffer) {
                saveAs(new Blob([buffer]), '[' + that.$moment().format('YYYY-MM-DD') + '] ' + `${type.toUpperCase()}.xlsx`);
            });

            this.isBusyExporting = false;
        },
        filteredObjKey(object_to_filter, object_to_base) {
            var filtered = [];
            var allowed = [];

            for (var i = 0; i < object_to_base.length; i++) {
                allowed.push(object_to_base[i].key);
            }

            for (let i = 0; i < object_to_filter.length; i++) {
                filtered.push(Object.keys(object_to_filter[i])
                .filter(key => allowed.includes(key))
                .reduce((obj, key) => {
                    obj[key] = object_to_filter[i][key];
                    return obj;
                }, {}));
            }
            return filtered;
        },
        //ADDED ABOVE CODE 18/08/2020

        checkPermission(val) {
            let check = this.$parent.canDo('approve-assets')
            return check
        },
        showTab(index) {
            let el = this.$refs.tabs.$children[index].$el.attributes;
            let tab = el.href.value;
            location.hash = tab || '';
            this.activeType = el.type.value;

            if(this.activeType != 'pending') {
               this.fetchData(this.assets_api[this.activeType], this.activeType);
            }
        },
        fetchData(url, type) {
            this.loading[this.activeType] = this[type].length ? false : true;

            this.$axios.get(url)
            .then(result => {
                this[type] = result.data.data;
                this.loading[type] = false;
            })
        },
        confirmApproval(row, status, type = 'asset') {

                let dialog = this.$buefy.dialog.confirm({
                message: `
                <i class="is-size-7" style="font-weight: light">This asset will be ${status}. Please confirm to proceed</i>
                <br/>
                <table class="confirm-table">
                    <tr>
                        <th style="width: 100px;">${ type == 'software' ? 'Name' : 'Type'}</th>
                        <td>${type == 'software' ? row.software.name : row.asset.asset_type}</td>
                    </tr>
                    <tr>
                        <th style="width: 100px;">${ type == 'software' ? 'Description' : 'Hostname'}</th>
                        <td>${type == 'software' ? row.software.description : row.asset.hostname}</td>
                    </tr>
                    <tr>
                        <th style="width: 100px;">${ type == 'software' ? 'Quantity' : 'IP Address'}</th>
                        <td>${type == 'software' ? row.software.quantity : row.asset.ip_address}</td>
                    </tr>
                    <tr>
                        <th style="width: 100px;">${ type == 'software' ? 'Allocation' : 'Issuer'}</th>
                        <td>${type == 'software' ? row.software.allocation : row.asset.role}</td>
                    </tr>
                </table>`,
                cancelText: 'Close',
                confirmText: status == 'approved' ? 'Confirm' : 'Reject',
                type: status == 'approved' ? 'is-success' : 'is-danger',
                icon: status == 'approved' ? 'comment-question' : '',
                iconPack: 'mdi',
                hasIcon: true,
                onConfirm: () => {
                    this.approvalSubmit(row, dialog, status, type);
                }
            })
        },
        approvalSubmit(data, dialog, status, type) {
                let toast_message = status == 'approved' ? 'Approving asset...'
                                                        : 'Rejecting asset' 
                const toast  = this.$buefy.toast.open(toast_message);
                let that = this;

                this.$axios.put('/api/approvals/'+data.approval_id, {
                    approval_status: status,
                    module_type: data.module_type,
                    module_item_id: data.module_item_id
                })
                .then(function (response) {
                    dialog.close();

                    if(type == 'software') {
                        that.pending_softwares = that.pending_softwares.filter(function(el){
                            return el.module_item_id != data.module_item_id;
                        });
                    }else {
                        that.pending = that.pending.filter(function(el){
                            return el.module_item_id != data.module_item_id;
                        });
                    }


                    if(status == 'approved') {
                        let asset_type = type == 'software' ? 'software' : data.asset.asset_type.split(" ")[0].toLowerCase();
                        that[asset_type].unshift(data[type])
                    }

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
                }).finish(function() {
                    toast.close();
                });
            },
        exportData(type) {
            this.$axios
                .get('/api/assets?type='+ type +'&fetch=all')
                .then(response => {
                    this.excel_data = response.data.data;
                    this.exportExcel(response.data, type)
            });
        },
        exportFinish(filename, type) {
            this.$buefy.dialog.alert({
                title: 'Download Complete',
                message: type + ' list has been successfully exported<br/>Filename: <b>' + filename + '</b><br/>',
                type: 'is-success',
                hasIcon: true,
                icon: 'check-circle',
                iconPack: 'fa',
                ariaRole: 'alertdialog',
                ariaModal: true
            })
        },
        addAsset(type) {
            let asset_type = type == 'pending' ? 'physical' : type;

            this.$buefy.modal.open({
                parent: this,
                component: this.forms[asset_type],
                hasModalCard: true,
                props: {
                    asset: exampleAssetData.data,
                    type: asset_type,
                    clients: this.clients,
                    isLoadingClients: this.isLoadingClients
                },
                canCancel: ['x'],
                customClass: 'custom-class custom-class-2',
                onCancel: function () {
                    //console.log('cancel')
                },
                events: {
                    'toPending': (value) => {
                        if(type == 'software') {
                            this.pending_softwares.unshift(value.approval);
                            this.pending_softwares[0]['software'] = value.software;
                            this.pending_softwares[0]['user'] = {name: value.user}
                        }else {
                            this.pending.unshift(value.approval);
                            this.pending[0]['asset'] = value.asset;
                            this.pending[0]['user'] = {name: value.user}
                        }

                    }
                }
            })
        },
        updateAsset(asset, type) {
            this.$buefy.modal.open({
                parent: this,
                component: AddAsset,
                hasModalCard: true,
                props: {
                    asset: asset,
                    type: type
                },
                canCancel: ['x'],
                customClass: 'custom-class custom-class-2',
                onCancel: function () {
                    //console.log('cancel')
                },
                events: {
                    'myEvent': value => {
                        //console.log(value)
                    }
                }
            })
        },
        canDo(value) {
            this.$emit('canDo', value)
        },
        view(data, id_key, type) {
            let that = this;
            this.$buefy.modal.open({
                parent: this,
                component: type == 'software' ? AssetSoftwareDetails : AssetDetails,
                hasModalCard: true,
                props: {
                    asset: data,
                    id_key: id_key,
                    can_edit: this.$parent.canDo('update-assets'),
                    clients: this.clients
                },
                customClass: 'custom-class custom-class-2',
                onCancel: function () {
                    //console.log('cancel')
                },
                events: {
                    'updateData': (data, type, id, category = null) => {
                        let asset = data;
                        let i = that[that.activeType].findIndex(a => a[type+'_id'] == id);

                        that[that.activeType][i] = asset;
                        //console.log(that[that.activeType]);
                        that.search_query[that.activeType] = that.search_query[that.activeType] == '  ' ? null : '  '
                        that.$forceUpdate();
                    }
                }
            })
        },
        deleteAsset(data, type, specific = true) {
            var route = type == 'software' ? 'softwares' : 'assets';

            if (specific == true)
            {
                var id = type == 'software' ? data.software_id : data.asset_id;

                this.$buefy.dialog.confirm({
                    message: 'Do you want to delete this asset?',
                    type: 'is-danger',
                    onConfirm: () => {
                        const toast  = this.$buefy.toast.open(`Deleting asset...`);
                        this.$axios.delete('/api/'+route+'/'+id).then(response => {
                            this.deleteAssetFilterObj(data,type);
                            this.$buefy.snackbar.open({
                                message: response.data.message,
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
                            
                        }).finally(function () {
                            // always executed. executed after request is completed
                            toast.close();
                        }); 
                    }
                });
            }
            else
            {
                let arr_ids;

                if (type == 'software') {
                    arr_ids = data.map(s => s.software_id)
                }else {
                    arr_ids = data.map(s => s.asset_id)
                }

                //console.log(arr_ids)
                let dialog_message = arr_ids.length > 1 ? 'Do you want to delete these selected '+arr_ids.length+' Assets?' 
                                                        : 'Do you want to delete this selected Asset?' 

                this.$buefy.dialog.confirm({
                    message: dialog_message,
                    type: 'is-danger',
                    onConfirm: () => {
                        const toast  = this.$buefy.toast.open(`Deleting asset...`);
                        this.$axios.delete('/api/'+route, {
                            params: {
                                'id': arr_ids
                            }
                        })
                        .then(response => {
                            this.deleteAssetFilterObj(arr_ids,type,false);
                            this.$buefy.snackbar.open({
                                message: response.data.message,
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
                            
                        }).finally(function () {
                            // always executed. executed after request is completed
                            toast.close();
                        }); 
                    }
                });
            }
        },
        deleteAssetFilterObj(data,type,specific = true) {
            var id_name = type == 'software' ? 'software_id' : 'asset_id';

            if (specific == true) {
                this[type] = this[type].filter(obj => {
                    return obj[id_name] != data[id_name];
                });
                this.checkedRows[type] = this.checkedRows[type].filter(obj => {
                    return obj[id_name] != data[id_name];
                });
            } else {
                this[type] = this[type].filter(obj => {
                    return data.includes(obj[id_name]) === false;
                });

                this.checkedRows[type] = this.checkedRows[type].filter(obj => {
                    return data.includes(obj[id_name]) === false;
                });
            }

            this.loadingDelete[type] = false;
        }
    }
}

</script>

<style lang="scss" scoped>
.b-tabs.tc-tabs .tab-content {
    margin-top: 0px;
    padding: 0px;
}

.dropdown-item:hover {
    background-color: whitesmoke;
    color: #0a0a0a;
}

.dropdown-item {
    cursor: pointer;
}
</style>
