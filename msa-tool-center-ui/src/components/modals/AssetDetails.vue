<template>
    <div class="modal-card" style="overflow: visible; width: 850px; height: calc(100vh - 40px);">
    <header class="modal-card-head has-background-primary">
        <p class="modal-card-title has-text-white is-size-5">{{ this.data.hostname}}</p> 
    </header>
    <section class="modal-card-body">
        <b-field grouped>
                    <b-tabs
                        ref="tabs"
                        type="is-boxed"
                        vertical
                        class="is-fullwidth asset-details"
                        @input="changeTab">

                        <b-tab-item name="information">
                            <template slot="header" width="150px">
                                <feather type="info" size="15"></feather>
                                <span style="padding-left:5px;"> Informations </span>
                            </template>

                            <form ref="information_form" @submit.prevent="checkValid()">
                                <input style="margin-bottom:5px;" type="hidden" value="information" name="info_category"/>

                                <table :class="{'edit-details' : edit.information}" >
                                    <tr>
                                        <td class="tdStyle">SR #</td>
                                        <td v-if="edit.information">
                                            <b-field expanded>
                                                <b-input style="margin-bottom:5px;" name="sr_ticket" required v-model="data['sr_ticket']" onblurcheckHtml5Validity></b-input>
                                            </b-field>
                                        </td>
                                        <td v-else style="padding-top:3px;">
                                            {{ data['sr_ticket']}}
                                        </td>
                                    </tr>                                    
                                    <tr>
                                        <td class="tdStyle">Client</td>
                                        <td v-if="edit.information">
                                            <b-select style="margin-bottom:5px;" required name="client_id" v-model="data['client_id']" placeholder="Select Client..." expanded>
                                                <option
                                                    v-for="client in clients"
                                                    :value="client.id"
                                                    :key="client.id">
                                                    {{ client.name }}
                                                </option>
                                            </b-select>
                                        </td>
                                        <td v-else style="padding-top:3px;">
                                            <span  v-if="this.clients">{{ this.clients[1].name }}</span>
                                        </td>
                                      
                                    </tr>
                                    
                                    <tr  v-for="field_name in info_fields[type]" v-bind:key="field_name">
                                        <td class="tdStyle"  v-if="type == 'network'">{{ field_name == 'role' ? 'Device Function' : field_name.replace(/_/g, ' ') }}</td>
                                        <td class="tdStyle"  v-else-if="type == 'virtual'">{{ field_name.replace(/_/g, ' ') }}</td>
                                        <!-- field_name == 'group' ? 'host' :  -->
                                        <td class="tdStyle"  v-else>{{ field_name.replace(/_/g, ' ') }}</td>
                                        <td v-if="edit.information">
                                            <b-field expanded>
                                                <b-input style="margin-bottom:5px;" :name="field_name" required v-model="data[field_name]" onblurcheckHtml5Validity></b-input>
                                            </b-field>
                                        </td>
                                        <td v-else style="padding-top:3px;">{{ data[field_name] }}</td>
                                       
                                    </tr>

                                   
                                </table>
                            </form>

                        </b-tab-item>

                        <b-tab-item name="application" v-if="data.AssetApplication">
                            <template slot="header" width="150px">
                                <feather type="grid" size="15"></feather>
                                <span style="padding-left:5px;"> Application </span>
                            </template>

                            <form ref="application_form">
                            <input type="hidden" value="application" name="info_category"/>

                            <table :class="{'edit-details' : edit.application}">
                                <tr v-for="(i, field) in data.AssetApplication" v-bind:key="field" >

                                    <td class="tdStyle" v-if="field != 'id' && field != 'asset_id' && field != 'createdAt' && field != 'updatedAt'">{{ field.replace(/_/g, ' ') }}</td>
                                    <td v-if="(edit.application) && (field != 'id' && field != 'asset_id' && field != 'createdAt' && field != 'updatedAt')">
                                        <b-field expanded>
                                            <b-input style="margin-bottom:5px;" :name="field" required v-model="data.AssetApplication[field]" onblurcheckHtml5Validity></b-input>
                                        </b-field>
                                    </td>
                                   <td v-else style="white-space:pre-wrap; padding-top:3px;">
                                       
                                       <p v-if="field != 'id' && field != 'asset_id' && field != 'createdAt' && field != 'updatedAt'">{{ i }} </p>
                                    </td>
                                </tr>
                            </table>
                            </form>

                        </b-tab-item>

                        <b-tab-item name="criticality" v-if="data.AssetCriticality">
                            <template slot="header" width="150px">
                                <feather type="alert-triangle" size="15"></feather>
                                <span style="padding-left:5px;"> CI Risk Score </span>
                            </template>

                            <form ref="criticality_form">
                                <input type="hidden" value="criticality" name="info_category"/>
                                
                                <table :class="{'edit-details' : edit.criticality}">
                                    <tr v-for="(i, field) in data.AssetCriticality" v-bind:key="field">
                                        <td v-if="field != 'id' && field != 'asset_id' && field != 'createdAt' && field != 'updatedAt'" class="tdStyle">{{ field.replace(/_/g, ' ') }}</td>
                                        <td v-if="(edit.criticality) && (field != 'id' && field != 'asset_id' && field != 'createdAt' && field != 'updatedAt')">
                                            <b-field expanded>
                                                <b-input style="margin-bottom:5px;" :type="inputs.criticality[field]" :name="field" required v-model="data.AssetCriticality[field]" onblurcheckHtml5Validity></b-input>
                                            </b-field>
                                        </td>
                                        <td v-else style="margin-bottom:5px; padding-top:3px;">
                                            <p  v-if="field != 'id' && field != 'asset_id' && field != 'createdAt' && field != 'updatedAt'">{{ i }}</p>
                                        </td>
                                    
                                    </tr>
                                </table>
                            </form>

                            
                        </b-tab-item>

                         <b-tab-item name="hardware" v-if="data.AssetHardware">
                            <template slot="header" width="150px">
                                    <feather type="hard-drive" size="15"></feather>
                                    <span style="padding-left:5px;"> Hardware </span>
                            </template>

                            <form ref="hardware_form">
                                <input type="hidden" value="hardware" name="info_category"/>

                                <table :class="{'edit-details' : edit.hardware}">
                                    <tr v-for="(i, field) in data.AssetHardware" v-bind:key="field">
                                        <td class="tdStyle" v-if="field != 'id' && field != 'asset_id' && field != 'createdAt' && field != 'updatedAt'">{{ field.replace(/_/g, ' ') }}</td>
                                        <td v-if="(edit.hardware) && (field != 'id' && field != 'asset_id' && field != 'createdAt' && field != 'updatedAt')">
                                            <b-field expanded>
                                                <b-input style="margin-bottom:5px;" :name="field" required v-model="data.AssetHardware[field]" onblurcheckHtml5Validity></b-input>
                                            </b-field>
                                        </td>
                                        <td v-else style="white-space:pre-wrap; padding-top:3px;">
                                            <p v-if="field != 'id' && field != 'asset_id' && field != 'createdAt' && field != 'updatedAt'">{{ i }} </p>
                                        </td>
                                    </tr>
                                </table>
                            </form>

                        </b-tab-item>

                        
                         <b-tab-item name="virtual" v-if="data.AssetVirtual">
                            <template slot="header" width="150px">
                                    <feather type="hard-drive" size="15"></feather>
                                    <span style="padding-left:5px;"> Hardware </span>
                            </template>

                            <form ref="virtual_form">
                                <input type="hidden" value="virtual" name="info_category"/>

                                <table :class="{'edit-details' : edit.virtual}">
                                   
                                    <tr v-for="(i, field) in data.AssetVirtual" v-bind:key="field">
                                        <td class="tdStyle" v-if="field != 'id' && field != 'asset_id' && field != 'createdAt' && field != 'updatedAt'">{{ field.replace(/_/g, ' ') }}</td>
                                        <td v-if="(edit.virtual) && (field != 'id' && field != 'asset_id' && field != 'createdAt' && field != 'updatedAt')">
                                            <b-field expanded>
                                                <b-input style="margin-bottom:5px;" :name="field" required v-model="data.AssetVirtual[field]" onblurcheckHtml5Validity></b-input>
                                            </b-field>
                                        </td>
                                        <td v-else style="white-space:pre-wrap; padding-top:3px;">
                                            <p v-if="field != 'id' && field != 'asset_id' && field != 'createdAt' && field != 'updatedAt'">{{ i }} </p>
                                        </td>
                                    </tr>
                                </table>
                            </form>

                        

                        
                        
                        </b-tab-item>
                        


                        <b-tab-item name="maintenance" v-if="data.AssetMaintenance">
                            <template slot="header" width="150px">
                                <feather type="tool" size="15"></feather>
                                <span style="padding-left:5px;"> Maintenance </span>
                            </template>

                            <form ref="maintenance_form">
                            <input type="hidden" value="maintenance" name="info_category"/>
                            
                                <table :class="{'edit-details' : edit.maintenance}">
                                    <tr v-for="(i, field) in data.AssetMaintenance" v-bind:key="field">
                                        <td class="tdStyle" v-if="field != 'id' && field != 'asset_id' && field != 'createdAt' && field != 'updatedAt'">{{ field.replace(/_/g, ' ') }}</td>
                                        <td v-if="(edit.maintenance) && (field != 'id' && field != 'asset_id' && field != 'createdAt' && field != 'updatedAt')">
                                            <b-field expanded>
                                                <b-input style="margin-bottom:5px;" :name="field" required v-model="data.AssetMaintenance[field]" onblurcheckHtml5Validity></b-input>
                                            </b-field>
                                        </td>
                                        <td v-else style="white-space:pre-wrap; padding-top:3px;">
                                            <p v-if="field != 'id' && field != 'asset_id' && field != 'createdAt' && field != 'updatedAt'">{{ i }} </p>
                                        </td>
                                        
                                    </tr>
                                </table>
                            </form>

                         
                        </b-tab-item>

                        <b-tab-item name="network" v-if="data.AssetNetwork">
                            <template slot="header" width="150px">
                                <feather type="wifi" size="15"></feather>
                                <span style="padding-left:5px;"> Network </span>
                            </template>

                            <form ref="network_form">
                            <input type="hidden" value="network" name="info_category"/>

                            <table :class="{'edit-details' : edit.network}">
                                <tr v-for="(i, field) in data.AssetNetwork" v-bind:key="field">
                                    <td class="tdStyle" v-if="field != 'id' && field != 'asset_id' && field != 'createdAt' && field != 'updatedAt'">{{ field.replace(/_/g, ' ') }}</td>
                                    <td v-if="(edit.network) && (field != 'id' && field != 'asset_id' && field != 'createdAt' && field != 'updatedAt')">
                                        <b-field expanded>
                                            <b-input style="margin-bottom:5px;" :type="inputs.network[field]" :name="field" required v-model="data.AssetNetwork[field]" onblurcheckHtml5Validity></b-input>
                                        </b-field>
                                    </td>
                                    <td v-else style="white-space:pre-wrap; padding-top:3px;">
                                        <p v-if="field != 'id' && field != 'asset_id' && field != 'createdAt' && field != 'updatedAt'">{{ i }} </p>
                                    </td>
                                
                                </tr>
                            </table>
                            </form>

                           
                        </b-tab-item>

                        <b-tab-item name="warranty" v-if="data.AssetWarranty">
                            <template slot="header" width="150px">
                                <feather type="award" size="15"></feather>
                                <span style="padding-left:5px;"> Warranty </span>
                            </template>

                             <form ref="warranty_form">
                            <input type="hidden" value="warranty" name="info_category"/>

                            <table :class="{'edit-details' : edit.warranty}">
                                <tr>
                                    <td class="tdStyle">Warranty Type</td>
                                    <td>
                                        <b-field v-if="edit.warranty">
                                            <b-radio name="warranty_type" required v-model="data.AssetWarranty['warranty_type']"
                                                native-value="Annual" @input="data.AssetWarranty['amc_warranty'] = convertDate($moment().format('YYYY-MM-DD'))
                                                data.AssetWarranty['renewal_date'] = convertDate($moment().format('YYYY-MM-DD'))" >
                                                Annual
                                            </b-radio>
                                            <b-radio name="warranty_type" required v-model="data.AssetWarranty['warranty_type']"
                                                native-value="Perpetual" @input="data.AssetWarranty['amc_warranty'] = convertDate($moment().format('YYYY-MM-DD'))
                                                data.AssetWarranty['renewal_date'] = convertDate($moment().format('YYYY-MM-DD')) ">
                                                Perpetual
                                            </b-radio>
                                        </b-field>

                                        <span v-else>{{ data.AssetWarranty['warranty_type'] }}</span>

                                       
                                    </td>
                                </tr>
                                <tr v-if="data.AssetWarranty['warranty_type'] != 'Perpetual'">
                                    <td class="tdStyle">AMC Warranty</td>
                                    <td>
                                        
                                        <b-datepicker
                                            v-if="edit.warranty"
                                            name="amc_warranty"
                                            required
                                            :date-formatter="dateFormatter"
                                            :date-parser="dateFormatter"
                                            v-model="data.AssetWarranty['amc_warranty']"
                                            icon="calendar-today">
                                        </b-datepicker>
                                        

                                        <span v-else>{{ ($moment(data.AssetWarranty['amc_warranty']).format('MMM DD, YYYY')) }}</span>

                                       
                                    </td>
                                </tr>
                                <tr v-if="data.AssetWarranty['warranty_type'] != 'Perpetual'">
                                    <td class="tdStyle">Renewal Date</td>
                                    <td>
                                        <b-datepicker
                                           v-if="edit.warranty"
                                            name="renewal_date"
                                            required
                                            :date-formatter="dateFormatter"
                                            :date-parser="dateFormatter"
                                            v-model="data.AssetWarranty['renewal_date']"
                                            icon="calendar-today">
                                        </b-datepicker>
                                         <span v-else>{{ ($moment(data.AssetWarranty['renewal_date']).format('MMM DD, YYYY')) }}</span>

                                       
                                    </td>
                                </tr>
                                <tr>
                                    <td class="tdStyle">Support Type</td>
                                    <td>
                                        <b-input v-if="edit.warranty" name="support_type" required v-model="data.AssetWarranty['support_type']" onblurcheckHtml5Validity></b-input>

                                        <span v-else>{{ data.AssetWarranty['domain_integration'] }}</span>
                                 
                                    </td>
                                </tr>
                                <tr>
                                    <td class="tdStyle">Support Contact Info</td>
                                    <td>
                                        <b-input v-if="edit.warranty"  name="support_contact_info" required v-model="data.AssetWarranty['support_contact_info']" onblurcheckHtml5Validity></b-input>

                                        <span v-else>{{ data.AssetWarranty['support_contact_info'] }}</span>
                                       
                                    </td>
                                </tr>
                                <tr>
                                    <td class="tdStyle">Domain Integration</td>
                                    <td>
                                        <b-input v-if="edit.warranty" name="domain_integration" required v-model="data.AssetWarranty['domain_integration']" onblurcheckHtml5Validity></b-input>

                                        <span v-else>{{ data.AssetWarranty['domain_integration'] }}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="tdStyle">PCI Guidelines</td>
                                    <td>
                                        <b-input v-if="edit.warranty" name="pci_guidelines" required v-model="data.AssetWarranty['pci_guidelines']" onblurcheckHtml5Validity></b-input>

                                        <span v-else>{{ data.AssetWarranty['pci_guidelines'] }}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="tdStyle">Remarks</td>
                                    <td>
                                        <b-input  v-if="edit.warranty" name="remarks" required v-model="data.AssetWarranty['remarks']" onblurcheckHtml5Validity></b-input>

                                        <span v-else>{{ data.AssetWarranty['remarks'] }}</span>
                                       
                                    </td>
                                </tr>
                            </table>
                            </form>

                        </b-tab-item>
                        
                        
                        <b-tab-item name="owner" v-if="data.AssetOwner">
                            <template slot="header" width="150px">
                                <feather type="user" size="15"></feather>
                                <span style="padding-left:5px;"> Owner </span>
                            </template>

                            <form ref="owner_form">
                                <input type="hidden" value="owner" name="info_category"/>
                                
                                <table :class="{'edit-details' : edit.owner}">
                                    <tr v-for="(i, field) in data.AssetOwner" v-bind:key="field">
                                        <td class="tdStyle" v-if="field != 'id' && field != 'asset_id' && field != 'createdAt' && field != 'updatedAt'">{{ field.replace(/_/g, ' ') }}</td>
                                        <td  v-if="(edit.owner) && (field != 'id' && field != 'asset_id' && field != 'createdAt' && field != 'updatedAt')">
                                            <b-field expanded>
                                                <b-input style="margin-bottom:5px;" :name="field" required v-model="data.AssetOwner[field]" onblurcheckHtml5Validity></b-input>
                                            </b-field>
                                        </td>
                                        <td v-else style="white-space:pre-wrap; padding-top:3px;">
                                            <p v-if="field != 'id' && field != 'asset_id' && field != 'createdAt' && field != 'updatedAt'">{{ i }} </p>
                                        </td>
                                  
                                    </tr>
                                </table>
                            </form>

                           
                        </b-tab-item>

                            
                    </b-tabs>
        </b-field>
        
    </section>
    <footer class="modal-card-foot custom">
        
        <b-button v-if="can_edit" 
        class="is-pulled-left" style="margin-right:82%" type="is-link is-light"
        @click="edit[active_tab] = !edit[active_tab]">
        {{ edit[active_tab] ? 'Cancel' : 'Edit'}} 
        </b-button>

        <div class="buttons is-pulled-right">
            <b-button  v-if="edit[active_tab]" type="is-info" @click="checkValid()">Save</b-button>
             <b-button  v-else  class="button" type="is-error" @click="$parent.close()">Close</b-button>
        </div>
    </footer>
</div>
</template>
<script>
import http from '../../http_common';

export default {
    props:['data','clients','type','can_edit','account'],
    data (){
        return {
            active_tab: 'information',
            edit: {
                information: false,
                application: false,
                criticality: false,
                hardware: false,
                maintenance: false,
                network: false,
                warranty: false,
                owner: false,
                virtual: false
            },
            info_fields: {
                physical: ['hostname', 'ip_address', 'group', 'manufacturer', 'model', 'service_tag', 'hardware_type', 'vendor', 'role', 'location', 'datacenter', 'rack_slot'],
                software: [],
                virtual: ['hostname', 'ip_address', 'group', 'hardware_type', 'vendor','role', 'location', 'datacenter','rack_slot'],
                network: ['hostname', 'ip_address', 'group', 'hardware_type', 'vendor', 'role', 'location', 'datacenter', 'rack_slot']
            },
            inputs: {
                information : {
                    physical: {
                        hostname: 'text',
                        ip_address: 'text',
                        group: 'text',
                        manufacturer: 'text',
                        model: 'text',
                        service_tag: 'text',
                        hardware_type: 'text',
                        vendor: 'text',
                        role: 'text',
                        location: 'text',
                        datacenter: 'text',
                        rack_slot: 'text'
                    },
                    virtual: {
                        hostname: 'text',
                        ip_address: 'text',
                        group: 'text',
                        hardware_type: 'text',
                        vendor: 'text',
                        role: 'text',
                        location: 'text',
                        datacenter: 'text',
                        rack_slot: 'text',
                        operating_system: 'text'
                    },
                    network: {
                        hostname: 'text',
                        ip_address: 'text',
                        group: 'text',
                        hardware_type: 'text',
                        vendor: 'text',
                        role: 'text',
                        location: 'text',
                        datacenter: 'text',
                        rack_slot: 'text'
                    }
                },
                application: {
                    criticality: 'text',
                    ha: 'text',
                    backup: 'text',
                    backup_window: 'text',
                    backup_type: 'text',
                    antivirus: 'text',
                    rsa_agent: 'text',
                    syslog: 'text',
                    rc_ip: 'text',
                    rc_username: 'text',
                    rc_password: 'text',
                    service_hosted: 'text',
                    application_running: 'text',
                    server_status: 'text' //up or down
                },
                criticality: {
                    confidentiality: 'number',
                    integrity: 'number',
                    availability: 'number',
                    weight: 'number',
                    asset_weight_value: 'number',
                    category: 'number'
                },
                hardware: {
                    physical: {
                        operating_system: 'text',
                        cpu_model: 'text',
                        speed: 'number',
                        ht_active: 'text', // true or false
                        cores_per_cpu: 'number',
                        number_cores: 'number',
                        number_cpu: 'number',
                        number_memory: 'number',
                        number_nics: 'number',
                        number_hbas: 'number',
                        number_vms: 'number',
                        vrams: 'number',
                        hdd: 'number',
                        raid_type: 'text',
                        power_source_type: 'text', //static
                        connected_on_power_strip: 'text' //static
                    },
                    virtual: {
                        operating_system: 'text',
                        vcpu: 'number',
                        vsockets: 'number',
                        vcores: 'number',
                        vrams: 'number',
                        vrams_mb: 'number',
                        vdisk: 'number',
                        vnetwork: 'text'
                    }
                },
                maintenance: {
                    monthly: 'text', //Annually, Monthly, Daily, Weekly
                    procedure: 'text'
                },
                network: {
                    dns_servers: 'text', //static
                    dhcp: 'text', //disabled enabled
                    domain: 'text',
                    ntp_server: 'text',
                    default_gateway: 'text',
                    network_adaptor_address: 'textarea',
                    network_speed: 'text',
                    mac_address: 'text',
                    network_switch_ip: 'text',
                    fibre_slot_port: 'text',
                    network_port: 'text'
                },
                warranty: {
                    //warranty: 'text',
                    warranty_type: 'option',
                    amc_warranty: 'date',
                    renewal_date: 'date',
                    support_type: 'text',
                    support_contact_info: 'text',
                    domain_integration: 'text',//yes or no
                    pci_guidelines: 'text',
                    remarks: 'text'
                },
                owner: {
                    app_owner: 'text',
                    app_owner_contact_info: 'text',
                    email_id: 'email',
                    system_owner: 'text',
                    business_owner: 'text',
                    business_owner_contact_info: 'text'
                }
            },

        }
    },
    methods:{
        changeTab() {
            let tab = this.$refs.tabs.activeItem.$attrs.name || 'information'

            this.edit[this.active_tab] = false;
            this.active_tab = tab;       
        },
         dateFormatter(date) {
            return this.$moment(date).format('YYYY-MM-DD');
        },
        convertDate(val){
          var dates = new Date(val)
          return dates
        },
        submit() {
            this.isBusy = true;
            let that = this;
            const formData = new FormData(this.$refs[this.active_tab + '_form']);
            var input = Object.fromEntries(formData)
            if (this.active_tab == 'information'){
                input.created_by = this.account.User.id
            }
            // console.log(input)
            http.post('/assets/update/'+ this.data.id, input)
            .then((response) => {
                console.log(response)
                    that.isBusy = false;

                    that.$parent.close();
                    response.data;
                    that.$emit('updatedAsset', response.data);
                    //info
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
                    let error_messages = '';
                    let dialog_message = '';

                    if(e.errors) {
                        Object.keys(e.errors).forEach(function(key) {
                            error_messages = error_messages + '<br>&nbsp;&nbsp;• ' + e.errors[key][0]
                        });
                        dialog_message = `${e.message}.Please Try Again... ${error_messages}<br>`
                    }else {
                        dialog_message = e.message
                    }
                    

                    this.$swal({
                      toast: true,
                      position: 'bottom-right',
                      showConfirmButton: false,
                      timer: 3000,
                      icon: 'error',
                      title: dialog_message,
                      })
                    that.isBusy = false;
                    });

                
        
        },
        checkValid() {
            //check form validity
            if(this.$refs[this.active_tab + '_form'].checkValidity()) {
                this.submit();
            }else {
                this.$buefy.dialog.alert({
                    title: 'Oops',
                    message: 'Please fill out all required fields correctly to proceed...',
                    type: 'is-danger',
                    hasIcon: true,
                    icon: 'times-circle',
                    iconPack: 'fa',
                    ariaRole: 'alertdialog',
                    ariaModal: true
                })
            }
        }
    },
    created(){
        if (this.data.AssetWarranty == null) {
            this.data.AssetWarranty == null
        }else{
            this.data.AssetWarranty['amc_warranty'] = new Date (this.data.AssetWarranty['amc_warranty'])
            this.data.AssetWarranty['renewal_date'] = new Date (this.data.AssetWarranty['renewal_date'])
       }
    },
    mounted(){
        console.log(this.data)
    }
}
</script>

<style scoped>


.buttonEdit {
    background-color: #fff;
    border-color: #dbdbdb;
    border-width: 1px;
    color: #363636;
    cursor: pointer;
    -webkit-box-pack: center;
    justify-content: center;
    padding: calc(.5em - 1px) 1em;
    text-align: center;
    white-space: nowrap;
}
.buttonEdit:hover {
    border-color: #b5b5b5;
    color: #363636;
}

.asset-details table.edit-details{
    width: 100%; 
    padding-top: 12px;
    padding: 5px;
    border-bottom: 0.5px solid white !important;

}
.tdStyle {
    text-align: right;
    font-weight: 500;
    font-size: 10pt;
    color: #1f6d61;
    width: 200px;
    text-transform: uppercase;
    padding: 5px 20px 0px 0;
    border-bottom: 0.5px solid white;
}

.has-background-primary {
  background-color: #00d1b2 !important;
}

</style>