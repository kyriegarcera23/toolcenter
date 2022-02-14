<template>
<div>
    <div class="nav-background is-dashboard"  >
        <div class="page-header-container">
            <div class="columns has-text-white">
                <div class="column" style="padding-left:20px;">
                    <table>
                        <tr>
                            <td style="padding:10px 10px 0px 30px;"><feather type="package" size="30" class="m-r-15" style="margin-bottom: -8px"></feather></td>
                            <td><span class="is-size-5" style="font-weight: bold">Assets Inventory</span>
                                <i class="is-size-7" style="display: block; margin-top: -3px;">View all assets warranty status</i></td>
                        </tr>
                    </table>
                </div>

                <!-- buttons -->
                <div class="column" style="padding-top:20px">
                  <div class="buttons are-small is-pulled-right m-t-10">
                    <b-field grouped>
                        <b-field v-if="$parent.canDo('create-assets')">
                            <p class="control">
                                <button class="button is-success"  @click="addAsset(activeType)"  >
                                    <plus></plus>
                                    <span>New Asset </span>
                                </button>
                            </p>
                            <p class="control">
                                <b-dropdown position="is-bottom-left">
                                    <button class="button is-success" slot="trigger" >
                                        <feather class="icon" type="chevron-down" size="20"></feather>
                                    </button>

                                    <b-dropdown-item @click="addAsset('physical')">Physical</b-dropdown-item>
                                    <b-dropdown-item @click="addAsset('software')">Software</b-dropdown-item>
                                    <b-dropdown-item @click="addAsset('virtual')">Virtual Machine</b-dropdown-item>
                                    <b-dropdown-item @click="addAsset('network')">Network</b-dropdown-item>
                                    <b-dropdown-item @click="addAsset('hardware')">Hardware</b-dropdown-item>
                                </b-dropdown>
                            </p>
                        </b-field>

                        <b-field  >
                            <p class="control">
                                <b-dropdown position="is-bottom-left">
                                    <button class="button is-light" slot="trigger">
                                        <downloadOut></downloadOut>
                                        <span> Export Report</span>
                                        <feather class="icon" type="chevron-down" size="20"></feather>
                                    </button>
                                    <b-dropdown-item @click="exportAssets('all')">All Assets</b-dropdown-item>
                                    <b-dropdown-item  @click="exportAssets('physical')">Physical</b-dropdown-item>
                                    <b-dropdown-item  @click="exportAssets('software')">Software</b-dropdown-item>
                                    <b-dropdown-item  @click="exportAssets('virtual')">Virtual Machine</b-dropdown-item>
                                    <b-dropdown-item  @click="exportAssets('network')">Network</b-dropdown-item>
                                    <b-dropdown-item  @click="exportAssets('hardware')">Hardware</b-dropdown-item>
                                </b-dropdown>
                            </p>
                        </b-field>
                      </b-field>
                  </div>
                </div>



            </div>
        </div>
    </div>

    <!-- table -->

<div class="container" style="margin-top: 30px; margin-left:0px; background-color:white ">
  <section>
      
      <b-field style="font-size:14px;" grouped>
          <b-tabs
              ref="tabs"
              type="is-boxed"
              class="tc-tabs is-fullwidth"
              data-v-step="10"
              v-model="activeTab"
              @input="showTab">
              

              <b-tab-item href="#physical" type="physical" >
                  <template slot="header" width="150px">
                      <server></server>
                      <span style="padding-left:5px;"> Physical </span>
                  </template>

                      <div class="is-pulled-left m-b-10">
                          <b-input placeholder="Search manufacturer.."
                              type="search"
                              v-model="searchPhysical"
                            >
                          </b-input>
                      </div>
                        <!-- v-model="searchPhysical" -->
                      <div class="is-pulled-right m-b-10" 
                      v-if="$parent.canDo('delete-assets') && asset_physical.length">
                          <button class="button is-danger is-small" 
                          @click="deleteAsset(checkedRows.physical, 'physical', false)"
                          :disabled="checkedRows.physical.length == 0"
                          >
                              <span>Delete Marked</span>
                              <deleteOutline></deleteOutline>
                          </button>
                      </div>

                        <div class="is-pulled-right m-b-5">
                           <a href="./template/AssetInventory.xlsx" class="button is-success is-small" style="margin-right:5px;" download>
                              <span>Download Template</span>
                              <downloadOut></downloadOut>
                          </a>
                      </div>
                      <div class="is-pulled-right m-b-5">
                           <button class="button is-primary is-small" style="margin-right:5px;">
                              <span>Import File</span>
                              <fileDocument></fileDocument>
                          </button>
                      </div>

                    <br>
                    <br>
                    <br>
                  
                     

                      <div class="is-fullwidth text-center align-middle" style="min-height: 250px; margin-left:45%;" v-if="!loading.physical && !asset_physical.length">
                        <img src="/images/windy.svg" style="height: 100px; min-height: 100px; margin-bottom: 10px;"/><br>
                        <i class="is-size-6">No Physical Host added yet</i>
                    </div>

                       <b-table
                                v-if="asset_physical.length"
                                :data ="asset_physical"
                                paginated
                                backend-pagination
                                :total="physicalTotal"
                                :per-page="physicalperPage"
                                :loading="loading"

                                :checked-rows.sync="checkedRows.physical"
                                :checkbox-position="checkboxPosition"
                                :checkable="$parent.canDo('delete-assets')"

                                @page-change="onPhysicalPageChange"
                                aria-next-label="Next page"
                                aria-previous-label="Previous page"
                                aria-page-label="Page"
                                aria-current-label="Current page"
                                :pagination-simple="isPaginationSimple"
                                :pagination-position="paginationPosition"

                                backend-sorting
                                :sort-icon="sortIcon"
                                :sort-icon-size="sortIconSize"
                                :default-sort-direction="defaultSortDirection"
                                :default-sort="[PhysicalSortField, PhysicalSortOrder]"
                                @sort="onPhysicalSort"
                                >

                                <b-table-column field="client_name" label="Client" v-slot="props" :sortable="false">
                                    {{ props.row.Client.name}}
                                </b-table-column>

                                <b-table-column field="hostname" label="Host" sortable v-slot="props" width="150">
                                    {{ props.row.hostname}}
                                </b-table-column>

                                <b-table-column field="model" label="Model" sortable v-slot="props">
                                    {{ props.row.model}}
                                </b-table-column>

                                <b-table-column field="manufacturer" label="Manufacturer" sortable v-slot="props">
                                    {{ props.row.manufacturer}}
                                </b-table-column>

                                <b-table-column field="service_tag" label="Service Tag" sortable v-slot="props">
                                    {{ props.row.service_tag}}
                                </b-table-column>

                                <b-table-column field="ip_address" label="Ip Address" sortable v-slot="props">
                                    {{ props.row.ip_address}}
                                </b-table-column>

                                <b-table-column field="location" label="Location" sortable v-slot="props">
                                    {{ props.row.location}}
                                </b-table-column>

                                <b-table-column field="action"  v-slot="props" centered class="text-middle" width="120">
                                <div class="field has-addons">
                                    <p class="control is-marginless" v-if="$parent.canDo('delete-assets')">
                                        <button @click="deleteAsset(props.row, 'physical')" class="button is-danger is-small">
                                        <deleteOutline></deleteOutline>
                                        </button>
                                    </p>
                                    <p class="control is-marginless">
                                        <button @click="viewAsset('physical',props.row)" class="button is-primary is-small">
                                            <span>View</span>
                                            <feather class="icon" type="chevron-right" size="15" stroke="white"></feather>
                                        </button>
                                    </p>
                                </div>
                                </b-table-column>
                    </b-table>
              </b-tab-item>

              <b-tab-item href="#software" type="software"  >
                  <template slot="header" width="150px">
                      <shield></shield> 
                      <span style="padding-left:5px;"> Software </span>
                  </template>

                      <div class="is-pulled-left m-b-10">
                          <b-input placeholder="Search by name.."
                              type="search"
                              v-model="searchSoftware"
                            >
                          </b-input>
                      </div>

                      <div class="is-pulled-right m-b-10" 
                      v-if="$parent.canDo('delete-assets') && asset_software.length">
                          <button class="button is-danger is-small" 
                          @click="deleteAsset(checkedRows.software, 'software', false)"
                          :disabled="checkedRows.software.length == 0"
                          >
                              <span>Delete Marked</span>
                              <deleteOutline></deleteOutline>
                          </button>
                      </div>

                      <div class="is-pulled-right m-b-5">
                           <a href="./template/AssetInventory.xlsx" class="button is-success is-small" style="margin-right:5px;" download>
                              <span>Download Template</span>
                              <downloadOut></downloadOut>
                          </a>
                      </div>
                      <div class="is-pulled-right m-b-5">
                           <button class="button is-primary is-small" style="margin-right:5px;">
                              <span>Import File</span>
                              <fileDocument></fileDocument>
                          </button>
                      </div>

                    <br>
                    <br>
                    <br>
                
                      <div class="is-fullwidth text-center align-middle" style="min-height: 250px; margin-left:45%;" v-if="!loading.software && !asset_software.length">
                        <img src="/images/windy.svg" style="height: 100px; min-height: 100px; margin-bottom: 10px;"/><br>
                        <i class="is-size-6">No Software added yet</i>
                    </div>
                     
                     <b-table 
                                v-if="asset_software.length"
                                :data ="asset_software"
                                paginated
                                backend-pagination
                                :total="softwareTotal"
                                :per-page="softwareperPage"
                                :loading="loading"

                                :checked-rows.sync="checkedRows.software"
                                :checkbox-position="checkboxPosition"
                                :checkable="$parent.canDo('delete-assets')"

                                @page-change="onSoftwarePageChange"
                                aria-next-label="Next page"
                                aria-previous-label="Previous page"
                                aria-page-label="Page"
                                aria-current-label="Current page"
                                :pagination-simple="isPaginationSimple"
                                :pagination-position="paginationPosition"

                                backend-sorting
                                :sort-icon="sortIcon"
                                :sort-icon-size="sortIconSize"
                                :default-sort-direction="defaultSortDirection"
                                :default-sort="[SoftwareSortField, SoftwareSortOrder]"
                                @sort="onSoftwareSort"
                                
                                >

                                <b-table-column field="client_name" label="Client"  v-slot="props" :sortable="false">
                                    {{ props.row.Client.name}}
                                </b-table-column>

                                <b-table-column  field="name" label="Name" v-slot="props" width="150">
                                    {{ props.row.name}}
                                </b-table-column>

                                <b-table-column field="description" label="Description" v-slot="props" width="150" sortable >
                                   {{ props.row.description}}
                                </b-table-column>

                                <b-table-column field="quantity" label="Quantity" v-slot="props" sortable >
                                   {{ props.row.quantity}}
                                </b-table-column>

                                <b-table-column field="allocation" label="Allocation" v-slot="props" sortable >
                                    {{ props.row.allocation}}
                                </b-table-column>

                                <b-table-column field="warranty" label="Warranty" v-slot="props" sortable >
                                    {{ props.row.warranty}}
                                </b-table-column>

                                <b-table-column field="warranty_date" label="Date" v-slot="props" sortable >
                                    {{ props.row.warranty_date }}
                                   <!-- {{ $moment(props.row.warranty_date).format('MMM DD, YYYY')}} -->
                                </b-table-column>

                                <b-table-column field="warranty_type" label="Type" v-slot="props" sortable >
                                   {{ props.row.warranty_type}}
                                </b-table-column>

                                <b-table-column field="action"  v-slot="props" centered class="text-middle" width="120">
                                <div class="field has-addons">
                                    <p class="control is-marginless" v-if="$parent.canDo('delete-assets')">
                                        <button @click="deleteAsset(props.row, 'software')" class="button is-danger is-small">
                                        <deleteOutline></deleteOutline>
                                        </button>
                                    </p>
                                    <p class="control is-marginless">
                                        <button @click="viewAsset('software',props.row)" class="button is-primary is-small">
                                            <span>View</span>
                                            <feather class="icon" type="chevron-right" size="15" stroke="white"></feather>
                                        </button>
                                    </p>
                                </div>
                                </b-table-column>
                    </b-table>

              </b-tab-item>

              <b-tab-item href="#virtual" type="virtual"  >
                  <template slot="header" width="150px">
                      <monitor></monitor> 
                      <span style="padding-left:5px;"> Virtual Machine </span>
                  </template>

                      <div class="is-pulled-left m-b-10" >
                          <b-input placeholder="Search by hostname.."
                              type="search"
                              v-model="searchVirtual"
                              >
                          </b-input>
                      </div>

                      <div class="is-pulled-right m-b-5" 
                      v-if="$parent.canDo('delete-assets') && asset_virtual.length">
                          <button class="button is-danger is-small" 
                          @click="deleteAsset(checkedRows.virtual, 'virtual', false)"
                          :disabled="checkedRows.virtual.length == 0"
                          >
                              <span>Delete Marked</span>
                              <deleteOutline></deleteOutline>
                          </button>
                      </div>

                       <div class="is-pulled-right m-b-5">
                           <a href="./template/AssetInventory.xlsx" class="button is-success is-small" style="margin-right:5px;" download>
                              <span>Download Template</span>
                              <downloadOut></downloadOut>
                          </a>
                      </div>
                      <div class="is-pulled-right m-b-5">
                           <button class="button is-primary is-small" style="margin-right:5px;">
                              <span>Import File</span>
                              <fileDocument></fileDocument>
                          </button>
                      </div>
                    <br>
                    <br>
                    <br>
                  

                       <div class="is-fullwidth text-center align-middle" style="min-height: 250px; margin-left:45%;" v-if="!loading.virtual && !asset_virtual.length">
                        <img src="/images/windy.svg" style="height: 100px; min-height: 100px; margin-bottom: 10px;"/><br>
                        <i class="is-size-6">No Virtual Machine added yet</i>
                    </div>
                        
                       
                      <b-table
                                v-if="asset_virtual.length"
                                :data ="asset_virtual"
                                paginated
                                backend-pagination
                                :total="virtualTotal"
                                :per-page="virtualperPage"
                                :loading="loading"

                                :checked-rows.sync="checkedRows.virtual"
                                :checkbox-position="checkboxPosition"
                                :checkable="$parent.canDo('delete-assets')"
                                
                                @page-change="onVirtualPageChange"
                                aria-next-label="Next page"
                                aria-previous-label="Previous page"
                                aria-page-label="Page"
                                aria-current-label="Current page"
                                :pagination-simple="isPaginationSimple"
                                :pagination-position="paginationPosition"

                               backend-sorting
                                :sort-icon="sortIcon"
                                :sort-icon-size="sortIconSize"
                                :default-sort-direction="defaultSortDirection"
                                :default-sort="[VirtualSortField, VirtualSortOrder]"
                                @sort="onVirtualSort"
                               
                                >

                                <b-table-column field="client_name" label="Client" v-slot="props" :sortable="false">
                                    {{ props.row.Client.name}}
                                </b-table-column>

                                <b-table-column field="hostname" label="Hostname" sortable v-slot="props" width="150">
                                    {{ props.row.hostname}}
                                </b-table-column>

                                <b-table-column field="ip_address" label="IP Address" sortable v-slot="props">
                                    {{ props.row.ip_address}}
                                </b-table-column>

                                <b-table-column field="group" label="Host" sortable v-slot="props" width="150">
                                  {{ props.row.group}}
                                </b-table-column>

                                <b-table-column field="role" label="Role" sortable v-slot="props">
                                  {{ props.row.role}}
                                </b-table-column>

                                <b-table-column field="location" label="Location" sortable v-slot="props">
                                    {{ props.row.location}}
                                </b-table-column>

                                <b-table-column field="data_center" label="Data Center" sortable v-slot="props">
                                   {{ props.row.datacenter}}
                                </b-table-column>

                                <b-table-column field="action"  v-slot="props" centered class="text-middle" width="120">
                                <div class="field has-addons">
                                    <p class="control is-marginless" v-if="$parent.canDo('delete-assets')">
                                        <button @click="deleteAsset(props.row, 'virtual')" class="button is-danger is-small">
                                        <deleteOutline></deleteOutline>
                                        </button>
                                    </p>
                                    <p class="control is-marginless">
                                        <button @click="viewAsset('virtual',props.row)" class="button is-primary is-small">
                                            <span>View</span>
                                            <feather class="icon" type="chevron-right" size="15" stroke="white"></feather>
                                        </button>
                                    </p>
                                </div>
                                </b-table-column>
                    </b-table>
              </b-tab-item>

              <b-tab-item href="#network" type="network">
                  <template slot="header" width="150px">
                      <wifi></wifi>
                      <span style="padding-left:5px;"> Network </span>
                  </template>

                      <div class="is-pulled-left m-b-10">
                          <b-input placeholder="Search by hostname.."
                              type="search"
                              
                              v-model="searchNetwork"
                              >
                          </b-input>
                          <!-- icon="magnify" -->
                      </div>

                      <div class="is-pulled-right m-b-10" 
                      v-if="$parent.canDo('delete-assets') && asset_network.length">
                          <button class="button is-danger is-small" 
                          @click="deleteAsset(checkedRows.network, 'network', false)"
                          :disabled="checkedRows.network.length == 0"
                          >
                              <span>Delete Marked</span>
                              <deleteOutline></deleteOutline>
                          </button>
                      </div>

                      <div class="is-pulled-right m-b-5">
                           <a href="./template/AssetInventory.xlsx" class="button is-success is-small" style="margin-right:5px;" download>
                              <span>Download Template</span>
                              <downloadOut></downloadOut>
                          </a>
                      </div>
                      <div class="is-pulled-right m-b-5">
                           <button class="button is-primary is-small" style="margin-right:5px;">
                              <span>Import File</span>
                              <fileDocument></fileDocument>
                          </button>
                      </div>

                    <br>
                    <br>
                    <br>

                      <div class="is-fullwidth text-center align-middle" style="min-height: 250px; margin-left:45%" v-if="!loading.network && !asset_network.length">
                        <img src="/images/windy.svg" style="height: 100px; min-height: 100px; margin-bottom: 10px;"/><br>
                        <i class="is-size-6">No Network added yet</i>
                    </div>

                    
                      <b-table
                                v-if="asset_network.length"
                                :data ="asset_network"
                                paginated
                                backend-pagination
                                :total="networkTotal"
                                :per-page="networkperPage"
                                :loading="loading"

                                :checked-rows.sync="checkedRows.network"
                                :checkbox-position="checkboxPosition"
                                :checkable="$parent.canDo('delete-assets')"
                                
                                @page-change="onNetworkPageChange"
                                aria-next-label="Next page"
                                aria-previous-label="Previous page"
                                aria-page-label="Page"
                                aria-current-label="Current page"
                                :pagination-simple="isPaginationSimple"
                                :pagination-position="paginationPosition"

                                backend-sorting
                                :sort-icon="sortIcon"
                                :sort-icon-size="sortIconSize"
                                :default-sort-direction="defaultSortDirection"
                                :default-sort="[NetworkSortField, NetworkSortOrder]"
                                @sort="onNetworkSort"
                           
                                >

                                <b-table-column field="client_name" label="Client" v-slot="props" :sortable="false">
                                    {{ props.row.Client.name}}
                                </b-table-column>

                                <b-table-column field="hostname" label="Hostname" sortable v-slot="props" width="150">
                                    {{ props.row.hostname}}
                                </b-table-column>

                                <b-table-column field="ip_address" label="Ip Address" sortable v-slot="props">
                                    {{ props.row.ip_address}}
                                </b-table-column>

                                <b-table-column field="group" label="Group" sortable v-slot="props">
                                    {{ props.row.group}}
                                </b-table-column>

                                <b-table-column field="vendor" label="Vendor" sortable v-slot="props">
                                    {{ props.row.service_tag}}
                                </b-table-column>

                                <b-table-column field="role" label="Device Function" sortable v-slot="props">
                                    {{ props.row.role}}
                                </b-table-column>

                                <b-table-column field="location" label="Location" sortable v-slot="props">
                                    {{ props.row.location}}
                                </b-table-column>

                                 <b-table-column field="location" label="Data Center" sortable v-slot="props">
                                    {{ props.row.datacenter}}
                                </b-table-column>

                                 <b-table-column field="action"  v-slot="props" centered class="text-middle" width="120">
                                <div class="field has-addons">
                                    <p class="control is-marginless" v-if="$parent.canDo('delete-assets')">
                                        <button @click="deleteAsset(props.row, 'network')" class="button is-danger is-small">
                                        <deleteOutline></deleteOutline>
                                        </button>
                                    </p>
                                    <p class="control is-marginless">
                                        <button @click="viewAsset('virtual',props.row)" class="button is-primary is-small">
                                            <span>View</span>
                                            <feather class="icon" type="chevron-right" size="15" stroke="white"></feather>
                                        </button>
                                    </p>
                                </div>
                                </b-table-column>
                    </b-table>

              </b-tab-item>

              <b-tab-item href="#hardware" type="hardware">
                  <template slot="header" width="150px">
                      <desktop></desktop>
                      <span style="padding-left:5px;"> Hardware </span>
                  </template>

                      <div class="is-pulled-left m-b-10" >
                          <b-input placeholder="Search by model#.."
                              type="search"
                              v-model="searchHardware"
                              >
                          </b-input>
                      </div>

                      <div class="is-fullwidth text-center align-middle" style="min-height: 250px; margin-left:45%;" v-if="!loading.hardware && !asset_hardware.length">
                        <img src="/images/windy.svg" style="height: 100px; min-height: 100px; margin-bottom: 10px;"/><br>
                        <i class="is-size-6">No Hardware added yet</i>
                    </div>
                    <br>
                    <br>
                    <br>
                    
                     <b-table
                                v-if="asset_hardware.length"
                                :data ="asset_hardware"
                                paginated
                                backend-pagination
                                :total="hardwareTotal"
                                :per-page="hardwareperPage"
                                :loading="loading"
                                
                                @page-change="onHardwarePageChange"
                                aria-next-label="Next page"
                                aria-previous-label="Previous page"
                                aria-page-label="Page"
                                aria-current-label="Current page"
                                :pagination-simple="isPaginationSimple"
                                :pagination-position="paginationPosition"

                                backend-sorting
                                :sort-icon="sortIcon"
                                :sort-icon-size="sortIconSize"
                                :default-sort-direction="defaultSortDirection"
                                :default-sort="[HardwareSortField, HardwareSortOrder]"
                                @sort="onHardwareSort"
                           
                                >

                                <b-table-column field="vendor" label="Vendor" v-slot="props" :sortable="false">
                                    {{ props.row.vendor}}
                                </b-table-column>

                                <b-table-column field="model_number" label="Model #" sortable v-slot="props">
                                    {{ props.row.model_number}}
                                </b-table-column>

                                <b-table-column field="description" label="Description" sortable v-slot="props">
                                    {{ props.row.description}}
                                </b-table-column>

                                <b-table-column field="serial_number" label="Serial #" sortable v-slot="props">
                                    {{ props.row.serial_number}}
                                </b-table-column>

                                <b-table-column field="warranty_type" label="Warranty Expiration" sortable v-slot="props">
                                    {{ props.row.warranty_type}}
                                </b-table-column>

                                 <b-table-column field="action"  v-slot="props" centered class="text-middle" width="120">
                                <div class="field has-addons">
                                    <p class="control is-marginless" v-if="$parent.canDo('delete-assets')">
                                        <button @click="deleteAsset(props.row, 'hardware')" class="button is-danger is-small">
                                        <deleteOutline></deleteOutline>
                                        </button>
                                    </p>
                                    <p class="control is-marginless">
                                        <button @click="viewAsset('hardware',props.row)" class="button is-primary is-small">
                                            <span>View</span>
                                            <feather class="icon" type="chevron-right" size="15" stroke="white"></feather>
                                        </button>
                                    </p>
                                </div>
                                </b-table-column>
                     </b-table>

              </b-tab-item>

              <b-tab-item href="#pending" type="pending" :visible="$parent.canDo('approve-assets')">
                  <template slot="header" width="150px">
                      <checkSquare></checkSquare>
                      <span style="padding-left:5px; padding-right:10px; "> Pending </span>
                       <b-tag rounded v-if="pendingTotalCount > 0" type="is-danger" 
                       class="is-small" style="font-size: 8pt;"> 
                       {{pendingTotalCount}} </b-tag>
                
                  </template>

                  <div class="is-pulled-left m-b-10">
                          <b-input placeholder="Search by email.."
                              type="search"
                              v-model="searchPending"
                            >
                          </b-input>
                      </div>
                      <br>
                      <br>

                  <b-table 
                                v-if="asset_Pending.length"
                                :data ="asset_Pending"
                                paginated
                                backend-pagination
                                :total="pendingTotal"
                                :per-page="pendingperPage"
                                :loading="loading"

                                @page-change="onPendingPageChange"
                                aria-next-label="Next page"
                                aria-previous-label="Previous page"
                                aria-page-label="Page"
                                aria-current-label="Current page"
                                :pagination-simple="isPaginationSimple"
                                :pagination-position="paginationPosition"
                                
                                >

                                <b-table-column field="client" label="Client" v-slot="props"  >
                                    {{ props.row.Client.name}}
                                </b-table-column>

                                <b-table-column field="sr_ticket" label="SR Ticket" v-slot="props" sortable>
                                    {{ props.row.Asset.sr_ticket}}
                                </b-table-column>

                                <b-table-column field="created_at" label="Date Requested" v-slot="props" sortable >
                                    {{ $moment(props.row.Asset.createdAt).format('MMM DD, YYYY')}}
                                </b-table-column>

                                <b-table-column field="requested_by" label="Requested By" v-slot="props" sortable >
                                   {{ props.row.Users.User.email}}
                                </b-table-column>

                                <b-table-column field="action" centered class="text-middle"  v-slot="props" width="165">
                                    <div class="field has-addons ">
                                        <p class="control is-marginless">
                                            <button @click="confirmApproval(props.row, 'approved')" class="button is-success is-small">
                                            <checkCircleOutline></checkCircleOutline>
                                            </button>
                                        </p>
                                        <p class="control is-marginless">
                                            <button @click="confirmApproval(props.row, 'rejected')" class="button is-danger is-small">
                                            <closeCircleOutline></closeCircleOutline>
                                            </button>
                                        </p>
                                        <p class="control is-marginless">
                                            <button @click="viewPendingAsset(props.row)" class="button is-primary is-small">
                                            <span>View</span>
                                            <feather class="icon" type="chevron-right" size="15" stroke="white"></feather>
                                        </button>
                                        </p>
                                    </div>

                                </b-table-column>
                    </b-table>

                  <!-- <div class="is-fullwidth text-center align-middle" style="min-height: 250px;" >
                      <img src="/images/windy.svg" style="height: 100px; min-height: 100px; margin-bottom: 10px;"/><br>
                      <i class="is-size-6">No Pending Requests</i>
                  </div> -->
              </b-tab-item>
          </b-tabs>
      </b-field>

      <!-- <b-loading :is-full-page="false" style="min-height: 350px" :active.sync="loading[activeType] || loadingDelete[activeType]" :can-cancel="false"></b-loading> -->
      <!-- <b-loading :is-full-page="false" style="min-height: 350px" :active.sync="isBusyExporting" :can-cancel="false"></b-loading> -->
  </section>
</div>

</div>

</template>


<script>
import http from '../../http_common';
import asset_excel from '../../resources/data/asset_excel.json';

// import Physicalform from '@/components/forms/PhysicalForm'

export default {
    props: ['account'],
    data(){
        return {
            
            checkboxPosition: 'left',
            checkedRows: {
                physical: [],
                software: [],
                virtual: [],
                network: [],
                hardware: []
            },
            //search
            awaiting_search:false,

            loading: false,

            //table data

            isPaginated: true,
            isShowAll: false,
            isPaginationSimple: false,
            paginationPosition: 'bottom',
            defaultSortDirection: 'asc',
            sortIcon: 'chevron-up',
            sortIconSize: 'is-small',

            searchPending:'',


            //for physical table data
            asset_physical: [],
            searchPhysical:'',
            PhysicalSortField: 'createdAt', //default sort field
            PhysicalSortOrder: 'desc', //default soft order
            physicalPage:0,
            physicalTotal:0,
            physicalperPage:10,
            
            //for software table data
            asset_software: [],
            searchSoftware:'',
            SoftwareSortField: 'createdAt',
            SoftwareSortOrder: 'desc',
            softwarePage:0,
            softwareTotal:0,
            softwareperPage:10,

            //for virtual table data
            asset_virtual: [],
            searchVirtual:'',
            VirtualSortField: 'createdAt',
            VirtualSortOrder: 'desc',
            virtualPage:0,
            virtualTotal:0,
            virtualperPage:10,

            //for network table data
            asset_network: [],
            searchNetwork:'',
            NetworkSortField: 'createdAt',
            NetworkSortOrder: 'desc',
            networkPage:0,
            networkTotal:0,
            networkperPage:10,

            //for hardware table data
            asset_hardware: [],
            searchHardware:'',
            HardwareSortField: 'createdAt',
            HardwareSortOrder: 'desc',
            hardwarePage:0,
            hardwareTotal:0,
            hardwareperPage:10,

            asset_Pending: [],
            pendingPage:0,
            pendingTotal:0,
            pendingperPage:10,
            pendingTotalCount: 0,

            clients: [],
            locations: [],
            activeTab: 0,
            activeType: 'physical',
            isLoadingClients: true,
            tabs: {
                '#physical' : 0,
                '#software' : 1,
                '#virtual' : 2,
                '#network' : 3,
                '#hardware' : 4,
                '#pending' : 5,
            },
            search_query: {
                physical: '',
                software: '',
                virtual: '',
                network: '',
                hardware: '',
                pending: ''
            },
            forms: {
                physical: () => import("@/components/forms/PhysicalForm"),
                software: () => import("@/components/forms/SoftwareForm"),
                network: () => import("@/components/forms/NetworkForm"),
                virtual: () => import("@/components/forms/VmForm"),
                hardware: () => import("@/components/forms/Hardwareform")
            },
            modals: {
                physical: () => import("@/components/modals/AssetDetails"),
                software: () => import("@/components/modals/SoftwareDetails"),
                network: () => import("@/components/modals/AssetDetails"),
                virtual: () => import("@/components/modals/AssetDetails"),
                hardware: () => import("@/components/modals/HardwareDetails")
            },
        }
    },
    mounted() {
        this.fetchClients();
        this.fetchLocations();
        this.assetPhysical();
        this.assetSoftware();
        this.assetNetwork();
        this.assetHardware();
        this.assetVm();
        this.assetPending();
    },
    methods: {
        //functions of physical
        assetPhysical() {
            this.loading = true
            var params = [
                
                `asset_type=physical`,
                `page=${this.physicalPage}`,
                `limit=${this.physicalperPage}`,
                `search=${this.searchPhysical}`,
                `sortField=${this.PhysicalSortField}`,
                `sortOrder=${this.PhysicalSortOrder}`,
            ].join('&')
            http.get('/assets?'+ params)
                .then(response => {
                    this.loading = false
                    this.asset_physical = []

                    let currentTotal = response.data.count;
                    
                    if (response.data.count / this.physicalperPage > 1000) {

                        currentTotal = this.physicalperPage * 1000
                        
                    }
                    
                    this.physicalTotal = currentTotal
                    
                    response.data.rows.forEach((item) => {
                        this.asset_physical.push(item)
                    })
                
                    
            }).catch(e =>{
                e;
                this.loading = false
        
            })
        },
        onPhysicalPageChange(page){
            this.physicalPage = page <= 1 ? 0 : (page * this.physicalperPage) - this.physicalperPage;
            this.assetPhysical();
        },
        onPhysicalSort(field, order) {
            this.PhysicalSortField = field;
            this.PhysicalSortOrder = order;
            this.assetPhysical();
        },
        
        //functions of software
        assetSoftware() {
            this.loading = true
            var params = [
                `page=${this.softwarePage}`,
                `limit=${this.softwareperPage}`,
                `search=${this.searchSoftware}`,
                `sortField=${this.SoftwareSortField}`,
                `sortOrder=${this.SoftwareSortOrder}`,
            ].join('&')
            http.get('/assets/softwares?'+ params)
                .then(response => {
                    //console.log(response);
                    this.asset_software = []

                    let currentTotal = response.data.count;
                    
                    if (response.data.count / this.softwareperPage > 1000) {

                        currentTotal = this.softwareperPage * 1000
                    }
                    this.softwareTotal = currentTotal
                    response.data.rows.forEach((item) => {
                        this.asset_software.push(item)      
                    })

                    var soft = this.asset_software
                    //console.log(soft)
                    for(var i=1; i < soft.length; i++){
                        if (soft[i]['warranty_type'] == 'Annual'){
                            soft[i]['warranty_date'] = this.$moment(soft[i]['warranty_date']).format('MMM DD, YYYY')
                        }

                        if (soft[i]['warranty_type'] == 'Annual'){
                            console.log(soft[i])
                        }
                    }
                    
                    
                    
                    
                    this.loading = false

            }).catch(e =>{
                e;
                this.loading = false
        
            })
            
        },
        onSoftwareSort(field, order) {
            this.SoftwareSortField = field;
            this.SoftwareSortOrder = order;
            this.assetSoftware();
        },
        onSoftwarePageChange(page){
            this.softwarePage = page <= 1 ? 0 : (page * this.softwareperPage) - this.softwareperPage;
            this.assetSoftware();
        },

        //functions of network
        assetNetwork() {
            this.loading = true
            var params = [
                `asset_type=network`,
                `page=${this.networkPage}`,
                `limit=${this.networkperPage}`,
                `search=${this.searchNetwork}`,
                `sortField=${this.NetworkSortField}`,
                `sortOrder=${this.NetworkSortOrder}`
            ].join('&')
            http.get('/assets?'+ params)
                .then(response => {
                    this.asset_network = []

                    let currentTotal = response.data.count;
                    
                    if (response.data.count / this.networkperPage > 1000) {

                        currentTotal = this.networkperPage * 1000
                    }
                    
                    this.networkTotal = currentTotal
                    response.data.rows.forEach((item) => {
                        this.asset_network.push(item)
                    })
                    
                    this.loading = false

            }).catch(e =>{
                e;
                this.loading = false
        
            })
            
        },
        onNetworkSort(field, order) {
            this.NetworkSortField = field;
            this.NetworkSortOrder = order;
            this.assetNetwork();
        },
        onNetworkPageChange(page){
            this.networkPage = page <= 1 ? 0 : (page * this.networkperPage) - this.networkperPage;
            this.assetNetwork();
        },
        
        //functions of virtual
        assetVm() {
            this.loading = true
            var params = [
                `asset_type=virtual`,
                `page=${this.virtualPage}`,
                `limit=${this.virtualperPage}`,
                `search=${this.searchVirtual}`,
                `sortField=${this.VirtualSortField}`,
                `sortOrder=${this.VirtualSortOrder}`
            ].join('&')
            http.get('/assets?'+ params)
                .then(response => {
                    this.asset_virtual = []

                    let currentTotal = response.data.count;
                    
                    if (response.data.count / this.virtualperPage > 1000) {

                        currentTotal = this.virtualperPage * 1000
                    }
                    
                    this.virtualTotal = currentTotal
                    response.data.rows.forEach((item) => {
                        this.asset_virtual.push(item)
                    })
                    
                    this.loading = false

            }).catch(e =>{
                e;
                this.loading = false
        
            })
        },
        onVirtualSort(field, order) {
            this.VirtualSortField = field;
            this.VirtualSortOrder = order;
            this.assetVm();
        },
        onVirtualPageChange(page){
            this.virtualPage = page <= 1 ? 0 : (page * this.virtualperPage) - this.virtualperPage;
            this.assetVm();
        },

        //functions of hardware
        assetHardware() {
            var params = [
                `page=${this.hardwarePage}`,
                `limit=${this.hardwareperPage}`,
                `search=${this.searchHardware}`,
                `sortField=${this.HardwareSortField}`,
                `sortOrder=${this.HardwareSortOrder}`,
            ].join('&')
            http.get('/assets/hardwares?'+ params)
                .then(response => {
                    this.asset_hardware = []

                    let currentTotal = response.data.count;
                    
                    
                    if (response.data.count / this.hardwareperPage > 1000) {

                        currentTotal = this.hardwareperPage * 1000
                    }
                    
                    this.hardwareTotal = currentTotal
                    response.data.rows.forEach((item) => {
                        this.asset_hardware.push(item)
                    })
                
                    this.loading = false
            });
        },
        onHardwarePageChange(page){
            this.hardwarePage = page <= 1 ? 0 : (page * this.hardwareperPage) - this.hardwareperPage;
            this.assetHardware();
        },
        onHardwareSort(field, order) {
            this.HardwareSortField = field;
            this.HardwareSortOrder = order;
            this.assetHardware();
        },

        //functions of pending
        assetPending() {
            
            this.loading = true
            var params = [
                `page=${this.pendingPage}`,
                `limit=${this.pendingperPage}`,
            ].join('&')
            http.get('/assets/approvals/list?' + params)
                .then(response => {
                    this.asset_Pending = []
                    
                    let currentTotal = response.data.count;
                    this.pendingTotalCount = currentTotal;
                    
                    if (response.data.count / this.pendingperPage > 1000) {

                        currentTotal = this.pendingperPage * 1000
                    }
                    
                    this.pendingTotal = currentTotal
                    response.data.rows.forEach((item) => {
                        this.asset_Pending.push(item)
                    })
                    
                    this.loading = false

            }).catch(e =>{
                e;
                this.loading = false
        
            })

        },
        onPendingPageChange(page){
            this.pendingPage = page <= 1 ? 0 : (page * this.pendingperPage) - this.pendingperPage;
            this.assetPending();
        },

        fetchClients() {
            http.get('/assets/clients')
                .then(response => {
                    this.clients = response.data.rows;
            });
        },
        fetchLocations() {
            http.get('/assets/locations?limit=1000')
                .then(response => {
                    this.locations = response.data.rows;
            });
        },

        showTab(index) {
            let el = this.$refs.tabs.$children[index].$el.attributes;
            let tab = el.href.value;
            location.hash = tab || '';
            this.activeType = el.type.value;

            // if(this.activeType != 'pending') {
            //    this.fetchData(this.assets_api[this.activeType], this.activeType);
            // }
        },
        addAsset(type){
            
            let asset_type = type == 'pending' ? 'physical' : type;
            // console.log(asset_type)
            // if(asset_type == 'hardware'){
            //     asset_type;
            // }else{
            this.$buefy.modal.open({
                parent: this,
                component: this.forms[asset_type],
                hasModalCard: true,
                canCancel:['x'],
                props: {
                    // asset: exampleAssetData.data,
                    type: asset_type,
                    clients: this.clients,
                    account: this.account,
                    locations: this.locations
                    // isLoadingClients: this.isLoadingClients
                },
                // customClass: 'custom-class custom-class-2',

                events: {
                    'toPending': (value) => {
                        // if(type == 'software') {
                        //     this.pending_softwares.unshift(value.approval);
                        //     this.pending_softwares[0]['software'] = value.software;
                        //     this.pending_softwares[0]['user'] = {name: value.user}
                        // }else {
                        //     this.pending.unshift(value.approval);
                        //     this.pending[0]['asset'] = value.asset;
                        //     this.pending[0]['user'] = {name: value.user}
                        // }
                        switch(asset_type) {
                            case 'physical':
                                this.assetPhysical();
                                break;

                            case 'virtual':
                                this.assetVm();
                                break;

                            case 'software':
                                this.assetSoftware();
                                break;

                            case 'network':
                                this.assetNetwork();
                                break;
    
                        }
                        
                        this.assetPending();
                        return value;
                    }
                }
            })
            
        },
        async viewPendingAsset(data) {
            let type;
            
            if (data.Asset.asset_type){
                type = data.Asset.asset_type
            }else{
                type = 'software'
            }
            let pendingdata = await http.get('/assets/'+ type + 's/' + data.Asset.id)
            .then(response => {
                return response.data
            });


            this.$buefy.modal.open({
                parent: this,
                component: this.modals[type],
                hasModalCard: true,
                
                props: {
                    account:this.account,
                    type:type,
                    clients: this.clients,
                    data: pendingdata,
                    can_edit: false,
                },
                customClass: 'custom-class custom-class-2',
                onCancel: function () {
                },
                
            })
            

        },
        viewAsset(type,data) {
            this.$buefy.modal.open({
                parent: this,
                component: this.modals[type],
                hasModalCard: true,
                
                props: {
                    account:this.account,
                    type:type,
                    clients: this.clients,
                    data: data,
                    can_edit: this.$parent.canDo('update-assets'),
                },
                customClass: 'custom-class custom-class-2',
                onCancel: function () {
                },
                events: {
                    'updatedAsset': (value) => {
                        value;
                        if (type == 'physical') {this.assetPhysical();}
                        else if (type == 'virtual') {this.assetVm();}
                        else if (type == 'network') {this.assetNetwork();}
                        else if (type == 'software') {this.assetSoftware();}
                        this.assetPending();
                    }
                }
            })
            

        },
        deleteAsset(data, type, specific = true) {
            let that = this;
            if (specific == true)
            {

                this.$buefy.dialog.confirm({
                message: 'Do you want to delete this asset?',
                type: 'is-danger',
                
                onConfirm: () => {
                http.delete('/assets/'+ type+'s/'+ data.id)
                .then((response) => {
                    response.data;
                    if (type == 'physical') {this.assetPhysical();}
                    else if (type == 'virtual') {this.assetVm();}
                    else if (type == 'network') {this.assetNetwork();}
                    else if (type == 'software') {this.assetSoftware();}
                    else if (type == 'hardware') {this.assetHardware();}
                   
                    this.$swal({
                    toast: true,
                    position: 'bottom-right',
                    showConfirmButton: false,
                    timer: 2000,
                    icon: 'success',
                    title: response.data.message,
                    })

                })
                .catch((error) => {
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
            }
            else
            {
                var input = []
                for (let i in data){
                    input.push(data[i].id)
                }
                this.$buefy.dialog.confirm({
                    message: "Do you want to delete these asssets?",
                    type: 'is-danger',
                    onConfirm: () => {
                        
                    http.delete('/assets/'+ type+'s',{data:{ids:input}})
                    .then((response) => {
                        response.data;
                        if (type == 'physical') {this.assetPhysical();}
                        else if (type == 'virtual') {this.assetVm();}
                        else if (type == 'network') {this.assetNetwork();}
                        else if (type == 'software') {this.assetSoftware();}
                        this.checkedRows.physical = []
                        this.$swal({
                        toast: true,
                        position: 'bottom-right',
                        showConfirmButton: false,
                        timer: 2000,
                        icon: 'success',
                        title: response.data.message,
                        })

                    })
                }
            })
        }
        },
        confirmApproval(data,status){
            this.$buefy.dialog.confirm({
                message: `
                <i class="is-size-7" style="font-weight: light">This asset will be ${status}. Please confirm to proceed</i>
                <br/>
                <br/>
                <br/>
                <table class="confirm-table">
                    <tr>
                    <th style="width: 100px;">Client</th>
                        <td>${ data.Client.name}</td>
                    </tr>

                    <tr>
                    <th style="width: 100px;">SR Ticket</th>
                        <td>${ data.Asset.sr_ticket}</td>
                    </tr>

                    <tr>
                    <th style="width: 100px;">Date Requested</th>
                        <td>${ this.$moment(data.Asset.createdAt).format('MMM DD, YYYY')}</td>
                    </tr>
                    <tr>
                    <tr>
                    <th style="width: 100px;">Requested By</th>
                        <td>${ data.Users.User.email}</td>
                </tr>
                
                </table>`,
                cancelText: 'Close',
                confirmText: status == 'approved' ? 'Confirm' : 'Reject',
                type: status == 'approved' ? 'is-success' : 'is-danger',
                icon: status == 'approved' ? 'comment-question' : '',
                iconPack: 'mdi',
                hasIcon: true,
                onConfirm: () => {
                    this.approvalSubmit(data,status);
                }
            })
        },
        approvalSubmit(data,status) {
            status = status == 'approved' ? 2 : 3;
            http.post(`/assets/approvals/update`,{status:status, ids: [data.id]})
            .then((response) => {
                this.$swal({
                    toast: true,
                    position: 'bottom-right',
                    showConfirmButton: false,
                    timer: 2000,
                    icon: 'success',
                    title: response.data.message
                })
                this.assetPending();
                this.assetPhysical();
                this.assetSoftware();
                this.assetNetwork();
                this.assetVm();
            })
            .catch((err) => {
                err.message
            })
        },

        // Related function for exports
        async exportAssets(type) {
            this.loading = true;
            const physical = await http.get('/assets?asset_type=physical')
            .then(res => { return res.data.rows });
            const software = await http.get('/assets/softwares')
            .then(res => { return res.data.rows });
            const virtual = await http.get('/assets?asset_type=virtual')
            .then(res => { return res.data.rows });
            const network = await http.get('/assets?asset_type=network')
            .then(res => { return res.data.rows });
            const hardware = await http.get('/assets/hardwares')
            .then(res => { return res.data.rows });

            const all_assets = {physical,software,virtual,network,hardware};
            this.exportAllAssets(type, all_assets);
        },
        exportAllAssets(type, data) {
            var workbook = new this.$Excel.Workbook();

            if(type == 'all' || type == 'physical')
            {
                var ws1 = workbook.addWorksheet('Physical');
                // excel setting for ws1
                var physicals = this.reinitializeArrObject(asset_excel.physical, data.physical);
                var rd1HeaderKeys = physicals.length > 0 ? Object.keys(physicals[0]) : [];
                var rd1ColumnHeader = [];
                for (let i in rd1HeaderKeys) {
                    rd1ColumnHeader.push({header: this.stringArrange(rd1HeaderKeys[i]), key: rd1HeaderKeys[i]});
                }
                ws1.columns = rd1ColumnHeader;
                ws1.autoFilter = {
                    from: 'A1',
                    to: {
                        row: 1,
                        column: rd1HeaderKeys.length
                    }
                }
                ws1.addRows(physicals);
                ws1.eachRow(function(row, rowNumber) {
                    if(rowNumber == 1)
                    {
                        row.eachCell(function(cell, colNumber) {
                            colNumber
                            cell.fill = {type: 'pattern', pattern: 'solid', fgColor:{argb:"005300"}};
                            cell.font = {'bold': true,color: {argb: "FFFFFF"},name: 'Verdana',size: 10};
                            cell.alignment = {vertical: 'middle', horizontal: 'center'};
                        });
                    }

                    if(rowNumber > 1)
                    {
                        ws1.getRow(rowNumber).font = {size: 11};
                    }

                    row.eachCell(function(cell, colNumber) {
                        colNumber
                        cell.border = {
                            top: {style:'thin'},
                            left: {style:'thin'},
                            bottom: {style:'thin'},
                            right: {style:'thin'}
                        };
                    });
                });
            }

            if(type == 'all' || type == 'software')
            {
                var ws2 = workbook.addWorksheet('Software');
                // excel setting for ws2
                var softwares = this.reinitializeArrObject(asset_excel.software, data.software);
                var rd2HeaderKeys = softwares.length > 0 ? Object.keys(softwares[0]) : [];
                var rd2ColumnHeader = [];
                for (let i in rd2HeaderKeys) {
                    rd2ColumnHeader.push({header: this.stringArrange(rd2HeaderKeys[i]), key: rd2HeaderKeys[i]});
                }
                ws2.columns = rd2ColumnHeader;
                ws2.autoFilter = {
                    from: 'A1',
                    to: {
                        row: 1,
                        column: rd2HeaderKeys.length
                    }
                }
                ws2.addRows(softwares);
                ws2.eachRow(function(row, rowNumber) {
                    if(rowNumber == 1)
                    {
                        row.eachCell(function(cell, colNumber) {
                            colNumber
                            cell.fill = {type: 'pattern', pattern: 'solid', fgColor:{argb:"005300"}};
                            cell.font = {'bold': true,color: {argb: "FFFFFF"},name: 'Verdana',size: 10};
                            cell.alignment = {vertical: 'middle', horizontal: 'center'};
                        });
                    }

                    if(rowNumber > 1)
                    {
                        ws2.getRow(rowNumber).font = {size: 11};
                    }

                    row.eachCell(function(cell, colNumber) {
                        colNumber
                        cell.border = {
                            top: {style:'thin'},
                            left: {style:'thin'},
                            bottom: {style:'thin'},
                            right: {style:'thin'}
                        };
                    });
                });
            }

            if(type == 'all' || type == 'virtual')
            {
                var ws3 = workbook.addWorksheet('Virtual');
                // excel setting for ws3
                var virtuals = this.reinitializeArrObject(asset_excel.virtual, data.virtual);
                var rd3HeaderKeys = virtuals.length > 0 ? Object.keys(virtuals[0]) : [];
                var rd3ColumnHeader = [];
                for (let i in rd3HeaderKeys) {
                    rd3ColumnHeader.push({header: this.stringArrange(rd3HeaderKeys[i]), key: rd3HeaderKeys[i]});
                }
                ws3.columns = rd3ColumnHeader;
                ws3.autoFilter = {
                    from: 'A1',
                    to: {
                        row: 1,
                        column: rd3HeaderKeys.length
                    }
                }
                ws3.addRows(virtuals);
                ws3.eachRow(function(row, rowNumber) {
                    if(rowNumber == 1)
                    {
                        row.eachCell(function(cell, colNumber) {
                            colNumber
                            cell.fill = {type: 'pattern', pattern: 'solid', fgColor:{argb:"005300"}};
                            cell.font = {'bold': true,color: {argb: "FFFFFF"},name: 'Verdana',size: 10};
                            cell.alignment = {vertical: 'middle', horizontal: 'center'};
                        });
                    }

                    if(rowNumber > 1)
                    {
                        ws3.getRow(rowNumber).font = {size: 11};
                    }

                    row.eachCell(function(cell, colNumber) {
                        colNumber
                        cell.border = {
                            top: {style:'thin'},
                            left: {style:'thin'},
                            bottom: {style:'thin'},
                            right: {style:'thin'}
                        };
                    });
                });
            }

            if(type == 'all' || type == 'network')
            {
                var ws4 = workbook.addWorksheet('Network');
                // excel setting for ws4
                var networks = this.reinitializeArrObject(asset_excel.network, data.network);
                var rd4HeaderKeys = networks.length > 0 ? Object.keys(networks[0]) : [];
                var rd4ColumnHeader = [];
                for (let i in rd4HeaderKeys) {
                    rd4ColumnHeader.push({header: this.stringArrange(rd4HeaderKeys[i]), key: rd4HeaderKeys[i]});
                }
                ws4.columns = rd4ColumnHeader;
                ws4.autoFilter = {
                    from: 'A1',
                    to: {
                        row: 1,
                        column: rd4HeaderKeys.length
                    }
                }
                ws4.addRows(networks);
                ws4.eachRow(function(row, rowNumber) {
                    if(rowNumber == 1)
                    {
                        row.eachCell(function(cell, colNumber) {
                            colNumber
                            cell.fill = {type: 'pattern', pattern: 'solid', fgColor:{argb:"005300"}};
                            cell.font = {'bold': true,color: {argb: "FFFFFF"},name: 'Verdana',size: 10};
                            cell.alignment = {vertical: 'middle', horizontal: 'center'};
                        });
                    }

                    if(rowNumber > 1)
                    {
                        ws4.getRow(rowNumber).font = {size: 11};
                    }

                    row.eachCell(function(cell, colNumber) {
                        colNumber
                        cell.border = {
                            top: {style:'thin'},
                            left: {style:'thin'},
                            bottom: {style:'thin'},
                            right: {style:'thin'}
                        };
                    });
                });
            }

            if(type == 'all' || type == 'hardware')
            {
                var ws5 = workbook.addWorksheet('Hardware');
                // excel setting for ws5
                var hardwares = this.reinitializeArrObject(asset_excel.hardware, data.hardware);
                var rd5HeaderKeys = hardwares.length > 0 ? Object.keys(hardwares[0]) : [];
                var rd5ColumnHeader = [];
                for (let i in rd5HeaderKeys) {
                    rd5ColumnHeader.push({header: this.stringArrange(rd5HeaderKeys[i]), key: rd5HeaderKeys[i]});
                }
                ws5.columns = rd5ColumnHeader;
                ws5.autoFilter = {
                    from: 'A1',
                    to: {
                        row: 1,
                        column: rd5HeaderKeys.length
                    }
                }
                ws5.addRows(hardwares);
                ws5.eachRow(function(row, rowNumber) {
                    if(rowNumber == 1)
                    {
                        row.eachCell(function(cell, colNumber) {
                            colNumber
                            cell.fill = {type: 'pattern', pattern: 'solid', fgColor:{argb:"005300"}};
                            cell.font = {'bold': true,color: {argb: "FFFFFF"},name: 'Verdana',size: 10};
                            cell.alignment = {vertical: 'middle', horizontal: 'center'};
                        });
                    }

                    if(rowNumber > 1)
                    {
                        ws5.getRow(rowNumber).font = {size: 11};
                    }

                    row.eachCell(function(cell, colNumber) {
                        colNumber
                        cell.border = {
                            top: {style:'thin'},
                            left: {style:'thin'},
                            bottom: {style:'thin'},
                            right: {style:'thin'}
                        };
                    });
                });
            }

            // generate report
            workbook.xlsx.writeBuffer()
            .then((buffer) => {
                this.$saveAs(new Blob([buffer]), `[${this.$moment().format('YYYY-DD-MM')}][${type.toUpperCase()}][ASSETS].xlsx`);
                this.loading = false;
            });
        },
        reinitializeArrObject(excel, data) {
            const objs = [];

            for (let j in data)
            {
                //console.log(data)
                let obj = {};

                for (let i in excel)
                
                {
                    
                    if(data[j][excel[i].key])
                    {
                        obj[excel[i].header] = data[j][excel[i].key];
                    }
                    else
                    {
                        
                        var key = excel[i].key.split('.');
                        obj[excel[i].header] = data[j][key[0]][key[1]];
                    }
                }

                objs.push(obj);
            }

            return objs;
        },
        stringArrange(string) {
            var capitalize = string.charAt(0).toUpperCase() + string.slice(1);
            return capitalize.replace(/_/g," ");
        }
        // End
    },
    watch:{
        searchPhysical:function (){
            this.physicalPage = 0
            if (!this.awaiting_search){
             setTimeout(() => {
                    this.assetPhysical();
                    this.awaiting_search = false;
                }, 2000); // 2 sec delay
            }
            this.awaiting_search = true;
        },
        searchPending:function (){
            this.pendingPage = 0
            if (!this.awaiting_search){
             setTimeout(() => {
                    this.assetPending();
                    this.awaiting_search = false;
                }, 2000); // 2 sec delay
            }
            this.awaiting_search = true;
        },
        searchSoftware:function (){
            this.softwarePage = 0
            if (!this.awaiting_search){
             setTimeout(() => {
                    this.assetSoftware();
                    this.awaiting_search = false;
                }, 2000); // 2 sec delay
            }
            this.awaiting_search = true;
        },
        searchVirtual:function (){
            this.virtualPage = 0
            if (!this.awaiting_search){
             setTimeout(() => {
                    this.assetVm();
                    this.awaiting_search = false;
                }, 2000); // 2 sec delay
            }
            this.awaiting_search = true;
        },

        searchNetwork:function (){
            this.networkPage = 0
            if (!this.awaiting_search){
             setTimeout(() => {
                    this.assetNetwork();
                    this.awaiting_search = false;
                }, 2000); // 2 sec delay
            }
            this.awaiting_search = true;
        },
        searchHardware:function (){
            this.hardwarePage = 0
            if (!this.awaiting_search){
             setTimeout(() => {
                    this.assetHardware();
                    this.awaiting_search = false;
                }, 2000); // 2 sec delay
            }
            this.awaiting_search = true;
        }
    }
}
   
</script>


<style scoped>

.confirm-table {
  min-width: 300px;
}

.confirm-table th,
.confirm-table td {
  padding: 5px;
}

.confirm-table th {
  text-align: right !important;
  width: 70px;
}


.tab-content {
    padding-top:0px; 
    margin-top:10px;
}

.tabs ul {
    border-bottom-style: none;
}


.b-tabs .tabs {
    background-color: white;
    border-color: #dbdbdb;
    border-bottom-color: #dbdbdb !important;
    background-color: #003944;
    color: white;
}


.plus-icon{
  padding-top: 5px;
}

.file-download-outline-icon{
  padding-top: 5px;

}

.file-document-outline-icon{
  padding-top: 5px;
}


.dropdown-item:hover {
    background-color: whitesmoke;
    color: #0a0a0a;
}

.dropdown-item {
    cursor: pointer;
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
</style>