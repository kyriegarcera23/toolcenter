<template>
    <div class="modal-card" style="overflow: visible; width: 950px; height: calc(100vh - 40px);">
        <header class="modal-card-head has-background-primary">
        <p class="modal-card-title has-text-white is-size-5 is-capitalized">New Asset • {{ asset_type }}
        </p>
    </header>

    <section class="modal-card-body asset-modal" style="padding-top:0px; ">
        <b-steps
            ref="steps"
            size="is-small"
            v-model="activeStep"
            :animated="true"
            :has-navigation="false"
            icon-prev="chevron-left"
            icon-next="chevron-right">

            <b-step-item label="Information" :clickable="isStepsClickable">
            <h2 class="title has-text-centered">Information</h2>

                <form ref="form0" class="formStyle"  @submit.prevent="checkValid('form0')">
                    <b-field class="is-fullwidth" grouped style="justify-content: flex-end;">
                        <b-field>
                            <p class="control">
                                <span class="button is-static">SR #</span>
                            </p>
                            <b-field>
                            <b-input name="sr_ticket" type="number" onkeydown="return event.keyCode !== 69" required v-model="info.sr_ticket" onblurcheckHtml5Validity></b-input>
                            </b-field>
                        </b-field>
                    </b-field>

                    <b-field grouped>
                        <b-field label="Host Name"  :label-position="labelPosition" expanded>
                            <b-input name="hostname" required  pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$"
                            v-model="info.hostname" onblurcheckHtml5Validity
                            ></b-input>
                        </b-field>
                        <b-field label="IP Address" :label-position="labelPosition" expanded>
                            <b-input name="ip_address" required  v-model="info.ip_address" onkeydown="return event.keyCode !== 69" pattern="^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$" placeholder="X.X.X.X"></b-input>
                        </b-field>
                    </b-field>

                    <b-field grouped>
                        <b-field label="Client" class="is-8" :label-position="labelPosition">
                            <b-select required v-model="info.client_id"  placeholder="Select Client..."
                            expanded @input="selectedClient">
                                <option
                                v-for="client in clients"
                                :value="client.id"
                                :key="client.id">
                                {{ client.name }}</option>
                            </b-select>
                        </b-field>
                        <b-field label="Location" :label-position="labelPosition" expanded>

                            <b-autocomplete
                                v-model="info.location"
                                ref="location_autocomplete"
                                :data="filteredLocationArray"
                                :open-on-focus="true"
                                placeholder="Find or add a Location"
                                icon-right="chevron-down"
                                :clearable="true"
                                @select="option => selected = option"
                                required
                                :disabled="info.client_id == '' ">
                                <template slot="footer">
                                    <a  @click="showAddLocation">
                                    <span> Add new... </span>
                                </a> 
                                </template>
                                <template slot="empty">No results for {{info.location}}</template>
                            </b-autocomplete>
                        </b-field>
                        <b-field label="Data Center" :label-position="labelPosition" >
                            <b-field>
                                <b-radio-button required v-model="info.datacenter"
                                    native-value="Production">
                                    Production
                                </b-radio-button>
                                <b-radio-button required v-model="info.datacenter"
                                    native-value="DR">
                                    DR
                                </b-radio-button>
                            </b-field>
                            </b-field>
                        </b-field>

                        <b-field grouped>
                            <b-field label="Group" :label-position="labelPosition">
                                <b-field>
                                    <b-radio-button required v-model="info.group"
                                        native-value="Systems">
                                        Systems
                                    </b-radio-button>
                                    <b-radio-button required v-model="info.group"
                                        native-value="Network">
                                        Network
                                    </b-radio-button>
                                </b-field>
                            </b-field>
                            <b-field label="Manufacturer" :label-position="labelPosition" expanded>
                                <b-input name="manufacturer" required v-model="info.manufacturer"></b-input>
                            </b-field>
                        </b-field>

                        <b-field grouped>
                            <b-field label="Model" :label-position="labelPosition">
                                <b-input name="model" required v-model="info.model" pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$"></b-input>
                            </b-field>
                            <b-field label="Service Tag / Serial" :label-position="labelPosition" expanded>
                                <b-input name="service_tag" required v-model="info.service_tag" pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$"></b-input>
                            </b-field>
                        </b-field>

                        <b-field grouped>
                            <b-field label="Vendor" :label-position="labelPosition" expanded>
                                <b-input name="vendor" required v-model="info.vendor" pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$"></b-input>
                            </b-field>
                            <b-field label="Hardware Type" :label-position="labelPosition">
                                <b-input name="hardware_type" required v-model="info.hardware_type" pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$"></b-input>
                            </b-field>
                        </b-field>

                        <b-field grouped>
                            <b-field label="Role" :label-position="labelPosition" expanded>
                                <b-input name="role" required v-model="info.role" pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$"></b-input>
                            </b-field>

                            <b-field label="Rack Slot" :label-position="labelPosition" expanded>
                                <b-input name="rack_slot" required v-model="info.rack_slot" pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$"></b-input>
                            </b-field>
                        </b-field>

                </form>
            </b-step-item>

            <b-step-item label="Application" :clickable="isStepsClickable">
                <h2 class="title has-text-centered">Application</h2>

                <form ref="form1" class="formStyle" @submit.prevent="checkValid('form1')">
                    <b-field grouped>
                        <b-field label="Criticality" :label-position="labelPosition" expanded>
                            <b-input name="criticality" required v-model="application.criticality" ></b-input>
                            <!-- pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$" -->
                        </b-field>
                        <b-field label="HA" :label-position="labelPosition">
                            <b-select name="ha" required v-model="application.ha" expanded>
                                <option value="Enabled">Enabled</option>
                                <option value="Disabled">Disabled</option>
                                <option value="N/A">N/A</option>
                            </b-select>
                        </b-field>
                    </b-field>
                    <b-field grouped>
                        <b-field label="Backup" :label-position="labelPosition" expanded>
                            <b-input name="backup" required v-model="application.backup" ></b-input>
                            <!-- pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$" -->
                        </b-field>
                        <b-field label="Backup Type" :label-position="labelPosition">
                            <b-select name="backup_type" v-model="application.backup_type" expanded>
                                <option value="Full">Full</option>
                                <option value="Incremental">Incremental</option>
                                <option value="N/A">N/A</option>
                            </b-select>
                        </b-field>
                        <b-field label="Backup Window" :label-position="labelPosition" expanded>
                            <b-select required name="backup_window" v-model="application.backup_window" expanded>
                                <option value="Daily">Daily</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                                <option value="N/A">N/A</option>
                            </b-select>
                        </b-field>
                    </b-field>
                    <b-field grouped>
                        <b-field label="Antivirus" :label-position="labelPosition" expanded>
                            <b-input name="antivirus" required v-model="application.antivirus" ></b-input>
                            <!-- pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$" -->
                        </b-field>
                        <b-field label="RSA Agent" :label-position="labelPosition" expanded>
                            <b-input name="rsa_agent" required v-model="application.rsa_agent"></b-input>
                            <!--  pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$" -->
                        </b-field>
                        <b-field label="Syslog" :label-position="labelPosition">
                            <b-field>
                                <b-radio-button required v-model="application.syslog"
                                    native-value="Yes">
                                    Yes
                                </b-radio-button>
                                <b-radio-button required v-model="application.syslog"
                                    native-value="No">
                                    No
                                </b-radio-button>
                            </b-field>
                        </b-field>
                    </b-field>

                    <b-field grouped>
                        <b-field label="RC IP" :label-position="labelPosition">
                            <b-input name="rc_ip" onkeydown="return event.keyCode !== 69" required v-model="application.rc_ip" pattern="^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$" placeholder="X.X.X.X"></b-input>
                        </b-field>
                        <b-field label="RC Username" :label-position="labelPosition" expanded>
                            <b-input name="rc_username" required v-model="application.rc_username"></b-input>
                            <!--  pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$" -->
                        </b-field>
                        <b-field label="RC Password" :label-position="labelPosition" expanded>
                            <b-input name="rc_password" required v-model="application.rc_password" ></b-input>
                            <!-- pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$" -->
                        </b-field>
                    </b-field>

                    <b-field grouped>
                        <b-field label="Service Hosted" :label-position="labelPosition" expanded>
                            <b-select name="service_hosted" v-model="application.service_hosted" expanded>
                                <option
                                    v-for="(val, index) in services_hosted"
                                    :value="val"
                                    :key="index">
                                    {{ val }}
                                </option>
                            </b-select>
                        </b-field>
                        <b-field label="Application Running" :label-position="labelPosition" expanded>
                            <b-input name="application_running" required v-model="application.application_running" ></b-input>
                            <!-- pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$" -->
                        </b-field>
                        <b-field label="Server Status" :label-position="labelPosition">
                            <b-field>
                                <b-radio-button required v-model="application.server_status"
                                    native-value="UP">
                                    UP
                                </b-radio-button>
                                <b-radio-button required v-model="application.server_status"
                                    native-value="DOWN">
                                    DOWN
                                </b-radio-button>
                            </b-field>
                        </b-field>
                    </b-field>
                </form>

            </b-step-item>

            <b-step-item label="CI Risk Score" :clickable="isStepsClickable">
                <h2 class="title has-text-centered">CI Risk Score</h2>
                <form ref="form2" class="formStyle" @submit.prevent="checkValid('form2')">
                    <b-field grouped>
                        <b-field label="Confidentiality" :label-position="labelPosition" expanded>
                            <b-field>
                                <b-radio-button required v-model="criticality.confidentiality" native-value='1'>1</b-radio-button>
                                <b-radio-button required v-model="criticality.confidentiality" native-value='2'>2</b-radio-button>
                                <b-radio-button required v-model="criticality.confidentiality" native-value='3'>3</b-radio-button>
                            </b-field>
                        </b-field>
                        <b-field label="Integrity" :label-position="labelPosition" expanded>
                            <b-field>
                                <b-radio-button required v-model="criticality.integrity" native-value='1'>1</b-radio-button>
                                <b-radio-button required v-model="criticality.integrity" native-value='2'>2</b-radio-button>
                                <b-radio-button required v-model="criticality.integrity" native-value='3'>3</b-radio-button>
                            </b-field>
                        </b-field>
                        <b-field label="Availability" :label-position="labelPosition" expanded>
                            <b-field>
                                <b-radio-button required v-model="criticality.availability" native-value='1'>1</b-radio-button>
                                <b-radio-button required v-model="criticality.availability" native-value='2'>2</b-radio-button>
                                <b-radio-button required v-model="criticality.availability" native-value='3'>3</b-radio-button>
                            </b-field>
                        </b-field>
                        <b-field label="Total" :label-position="labelPosition" expanded>
                            <b-input v-model="criticality_total" onkeydown="return event.keyCode !== 69" type="number" min="0" disabled></b-input>
                        </b-field>
                    </b-field>

                    <b-field grouped>
                        <b-field label="Weight" :label-position="labelPosition" expanded>
                            <b-field>
                                <b-radio-button required v-model="criticality.weight" native-value='1' expanded>1</b-radio-button>
                                <b-radio-button required v-model="criticality.weight" native-value='2' expanded>2</b-radio-button>
                                <b-radio-button required v-model="criticality.weight" native-value='3' expanded>3</b-radio-button>
                            </b-field>
                        </b-field>
                        <b-field label="Asset Weight Value" :label-position="labelPosition">
                            <b-input name="asset_weight_value" required v-model="asset_weight" disabled></b-input>
                        </b-field>
                        <b-field label="Category" :label-position="labelPosition">
                            <b-input name="category" required v-model="calculateCategory" disabled></b-input>
                        </b-field>
                    </b-field>
                    
                    
                </form>
            </b-step-item>

            <b-step-item label="Hardware" :clickable="isStepsClickable">
                <h2 class="title has-text-centered">Hardware</h2>
               <form ref="form3" class="formStyle" @submit.prevent="checkValid('form3')">
                    <b-field label="Operating System" :label-position="labelPosition">
                        <b-autocomplete
                            required
                            v-model="hardware.operating_system"
                            :data="filteredOperatingSystems"
                            placeholder="- Select Operating System -"
                            :open-on-focus="true"
                            icon="chevron-down"
                            icon-right
                            clearable
                            @select="option => selected = option">
                            <template slot="empty">No results found</template>
                        </b-autocomplete>
                    </b-field>

                    <b-field grouped>
                        <b-field label="CPU Model" :label-position="labelPosition" expanded>
                            <b-input name="cpu_model" required v-model="hardware.cpu_model" pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$"></b-input>
                        </b-field>
                        <b-field label="Speed" :label-position="labelPosition">
                            <b-input name="speed" onkeydown="return event.keyCode !== 69" required type="number" min="0" v-model="hardware.speed"></b-input>
                        </b-field>
                        <b-field label="HT Active" :label-position="labelPosition">
                            <b-field>
                                <b-radio-button required v-model="hardware.ht_active" native-value="True">True</b-radio-button>
                                <b-radio-button required v-model="hardware.ht_active" native-value="False">False</b-radio-button>
                            </b-field>
                        </b-field>
                    </b-field>

                    <b-field grouped>
                        <b-field label="Number CPU" :label-position="labelPosition">
                            <b-input name="number_cpu" onkeydown="return event.keyCode !== 69" required type="number" min="0" v-model="hardware.number_cpu"></b-input>
                        </b-field>
                        <b-field label="Cores per CPU" :label-position="labelPosition" expanded>
                            <b-input name="cores_per_cpu" onkeydown="return event.keyCode !== 69" required type="number" min="0" v-model="hardware.cores_per_cpu"></b-input>
                        </b-field>
                        <b-field label="Number Cores" :label-position="labelPosition">
                            <b-input name="number_cores" onkeydown="return event.keyCode !== 69" required type="number" min="0" v-model="hardware.number_cores"></b-input>
                        </b-field>
                    </b-field>

                    <b-field grouped>
                        <b-field label="Number Memory" :label-position="labelPosition" expanded>
                            <b-input name="number_memory" onkeydown="return event.keyCode !== 69" required type="number" min="0" v-model="hardware.number_memory"></b-input>
                        </b-field>
                        <b-field label="Number NICs" :label-position="labelPosition">
                            <b-input name="number_nics" onkeydown="return event.keyCode !== 69" required type="number" min="0" v-model="hardware.number_nics"></b-input>
                        </b-field>
                        <b-field label="Number HBAs" :label-position="labelPosition">
                            <b-input name="number_hbas" onkeydown="return event.keyCode !== 69" required type="number" min="0" v-model="hardware.number_hbas"></b-input>
                        </b-field>
                    </b-field>

                    <b-field grouped>
                        <b-field label="Number VMs" :label-position="labelPosition">
                            <b-input name="number_vms" onkeydown="return event.keyCode !== 69" required type="number" min="0" v-model="hardware.number_vms"></b-input>
                        </b-field>
                        <b-field label="VRAMs" :label-position="labelPosition">
                            <b-input name="vrams" onkeydown="return event.keyCode !== 69" required type="number" min="0" v-model="hardware.vrams"></b-input>
                        </b-field>
                        <b-field label="HDD" :label-position="labelPosition" expanded>    
                            <b-field>    
                                <b-field style="width:78%;margin-right:0;">
                                    <b-input type="number" onkeydown="return event.keyCode !== 69" min="1" required placeholder="Capacity" v-model="hardware.hdd"></b-input>
                                </b-field>
                                <b-field>
                                <b-select placeholder="Currency" required v-model="hdd_type">
                                    <option value="TB">TB</option>
                                    <option value="GB">GB</option>
                                </b-select>
                                </b-field>
                            </b-field>
                        </b-field>
                        <b-input type="hidden" v-model="concatHDDtype"/>
                    </b-field>

                    <b-field grouped>
                        <b-field label="Raid Type" :label-position="labelPosition">
                            <b-input name="raid_type" placeholder="N/A" required v-model="hardware.raid_type"></b-input>
                        </b-field>
                        <b-field label="Power Source Type" :label-position="labelPosition" expanded>
                            <b-input name="power_source_type" required v-model="hardware.power_source_type" ></b-input>
                            <!-- pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$" -->
                        </b-field>
                        <b-field label="Connected on Power Strip" :label-position="labelPosition" expanded>
                            <b-field>
                                <b-radio-button expanded required v-model="hardware.connected_on_power_strip"
                                    native-value="Yes">Yes</b-radio-button>
                                <b-radio-button expanded required v-model="hardware.connected_on_power_strip"
                                    native-value="No">No</b-radio-button>
                            </b-field>
                        </b-field>
                    </b-field>
                </form>
            </b-step-item>

            <b-step-item label="Maintenance" :clickable="isStepsClickable">
                <h2 class="title has-text-centered">Maintenance</h2>

                <form ref="form4" class="formStyle" @submit.prevent="checkValid('form4')">
                    <b-field label="Frequency" :label-position="labelPosition" expanded>
                        <b-field>
                            <b-radio-button expanded required v-model="maintenance.frequency" native-value="Monthly">Monthly</b-radio-button>
                            <b-radio-button expanded required v-model="maintenance.frequency" native-value="Semi-Annual">Semi-Annual</b-radio-button>
                            <b-radio-button expanded required v-model="maintenance.frequency" native-value="Annual">Annual</b-radio-button>
                            <b-radio-button expanded required v-model="maintenance.frequency" native-value="Quarterly">Quarterly</b-radio-button>
                        </b-field>
                    </b-field>
                    
                    <b-field label="Procedure" :label-position="labelPosition">
                        <b-input name="procedure" required v-model="maintenance.procedure"></b-input>
                        <!--  pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$" -->
                    </b-field>
                </form>

            </b-step-item>

            <b-step-item label="Network" :clickable="isStepsClickable">
                <h2 class="title has-text-centered">Network</h2>

                <form ref="form5" class="formStyle" @submit.prevent="checkValid('form5')">
                    <b-field label="DNS Server" :label-position="labelPosition">
                        <b-input name="dns_server" onkeydown="return event.keyCode !== 69" required v-model="network.dns_servers" pattern="^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$" placeholder="X.X.X.X"></b-input>
                    </b-field>
                    <b-field label="DHCP" :label-position="labelPosition">
                        <b-field>
                            <b-radio-button expanded required v-model="network.dhcp"
                                native-value="Enabled">Enabled</b-radio-button>
                            <b-radio-button expanded required v-model="network.dhcp"
                                native-value="Disabled">Disabled</b-radio-button>
                        </b-field>
                    </b-field>

                    <b-field label="Domain" :label-position="labelPosition">
                        <b-input name="domain" placeholder="domain.com" required v-model="network.domain" ></b-input>
                        <!-- pattern="^[A-Za-z0-9]+([\-\.]{1}[A-Za-z0-9]+)*\.[A-Za-z]{2,5}(:[0-9]{1,5})?(\/.*)?$" -->
                    </b-field>

                    <b-field label="NTP Server" :label-position="labelPosition">
                        <b-input name="ntp_server" onkeydown="return event.keyCode !== 69" required v-model="network.ntp_server" pattern="^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$" placeholder="X.X.X.X"></b-input>
                    </b-field>

                    <b-field label="Default Gateway" :label-position="labelPosition">
                        <b-input name="default_gateway" onkeydown="return event.keyCode !== 69" required v-model="network.default_gateway" pattern="^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$" placeholder="X.X.X.X"></b-input>
                    </b-field>
                    <b-field label="Network Adaptor Address" :label-position="labelPosition">
                        <b-input name="Network Adaptor Address" required type="textarea" placeholder="This field will be based on the machine."  v-model="network.network_adaptor_address"></b-input>
                        <!-- pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$" -->
                    </b-field>
                    <b-field label="Network Speed" :label-position="labelPosition">
                        <b-field>
                            <b-field>
                                <b-field>    
                                <b-input type="number" onkeydown="return event.keyCode !== 69" min="1" required placeholder="Capacity" v-model="network_speed.capacity"></b-input>
                                </b-field>
                                <p>
                                    
                                </p>
                                <p class="control">
                                    <span class="button is-static">GB</span>
                                </p>
                                <b-select placeholder="Type"  v-model="network_speed.type">
                                    <option value="Half Duplex">Half Duplex</option>
                                    <option value="Full Duplex">Full Duplex</option>
                                </b-select>
                            </b-field>
                            <b-input type="hidden" v-model="concatNetworkSpeed"></b-input>
                        </b-field>
                    </b-field>

                    <b-field label="MAC Address" :label-position="labelPosition">
                        <b-input name="mac_address" required v-model="network.mac_address" ></b-input>
                        <!-- pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$" -->
                    </b-field>
                    
                    <b-field label="Network Switch IP" :label-position="labelPosition">
                        <b-input name="network_switch_ip" onkeydown="return event.keyCode !== 69" required v-model="network.network_switch_ip" pattern="^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$" placeholder="X.X.X.X"></b-input>
                    </b-field>

                    <b-field label="Fibre Slot Port" :label-position="labelPosition">
                        <b-input required name="fibre_slot_port" v-model="network.fibre_slot_port" ></b-input>
                        <!-- pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$" -->
                    </b-field>

                    <b-field label="Network Port" :label-position="labelPosition">
                        <b-input name="network_port"  required v-model="network.network_port" ></b-input>
                        <!-- pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$" -->
                    </b-field>
                </form>

            </b-step-item>

            <b-step-item label="Warranty" :clickable="isStepsClickable">
                <h2 class="title has-text-centered">Warranty</h2>
                <form ref="form6" class="formStyle" @submit.prevent="checkValid('form6')">
                    <b-field label="Warranty Type" :label-position="labelPosition">
                        <b-field>
                            <b-radio required v-model="warranty.warranty_type"
                                native-value="Annual">
                                Annual
                            </b-radio>
                            <b-radio required v-model="warranty.warranty_type"
                                native-value="Perpetual" @input="warranty.amc_warranty = convertDate($moment().format('YYYY-MM-DD')) 
                                warranty.renewal_date = convertDate($moment().format('YYYY-MM-DD')) ">
                                Perpetual
                            </b-radio>
                        </b-field>
                    </b-field>
                    
                    <b-field grouped v-if="warranty.warranty_type == 'Annual'">
                        <b-field label="AMC Warranty" :label-position="labelPosition">
                             <b-datepicker
                                name="amc_warranty"
                                required
                                :date-formatter="dateFormatter"
                                :date-parser="dateFormatter"
                                v-model="warranty.amc_warranty"
                                icon="calendar-today" >
                            </b-datepicker>
                        </b-field>

                        <b-field label="Renewal Date" :label-position="labelPosition">
                            <b-datepicker
                                name="renewal_date"
                                required
                                :date-formatter="dateFormatter"
                                :date-parser="dateFormatter"
                                v-model="warranty.renewal_date"
                                icon="calendar-today">
                            </b-datepicker>
                        </b-field>
                    </b-field>

                    <b-field label="Support Type" :label-position="labelPosition">
                        <b-input name="support_type" required v-model="warranty.support_type" ></b-input>
                        <!-- pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$" -->
                    </b-field>

                    <b-field label="Support Contact Info" :label-position="labelPosition">
                        <b-input name="support_contact_info" required v-model="warranty.support_contact_info" ></b-input>
                        <!-- pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$" -->
                    </b-field>

                    <b-field label="Domain Integration" :label-position="labelPosition">
                        <b-field>
                            <b-radio-button required v-model="warranty.domain_integration"
                                native-value="Yes">
                                Yes
                            </b-radio-button>
                            <b-radio-button required v-model="warranty.domain_integration"
                                native-value="No">
                                No
                            </b-radio-button>
                        </b-field>
                    </b-field>

                    <b-field label="PCI Guidelines" :label-position="labelPosition">
                        <b-input name="pci_guidelines" required v-model="warranty.pci_guidelines" ></b-input>
                        <!-- pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$" -->
                    </b-field>

                    <b-field label="Remarks" :label-position="labelPosition">
                        <b-input name="remarks" required v-model="warranty.remarks" placeholder="N/A if not applicable."></b-input>
                    </b-field>
                </form>
            </b-step-item>

            <b-step-item label="Owner" :clickable="isStepsClickable">
                <h2 class="title has-text-centered">Owner</h2>

                <form ref="form7" class="formStyle" @submit.prevent="checkValid('form7')">
                    <b-field label="App Owner" :label-position="labelPosition">
                        <b-select required name="app_owner" v-model="owner.app_owner" expanded>
                            <option
                                v-for="(val, index) in owners"
                                :value="val"
                                :key="index">
                                {{ val }}
                            </option>
                        </b-select>
                    </b-field>

                    <b-field label="App Owner Contact Info" :label-position="labelPosition">
                        <b-input name="app_owner_contact_info" required v-model="owner.app_owner_contact_info" ></b-input>
                        <!-- pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$" -->
                    </b-field>

                    <b-field label="Email ID" :label-position="labelPosition">
                        <b-input name="email_id" type="email" required v-model="owner.email_id"></b-input>
                    </b-field>

                    <b-field label="System Owner" :label-position="labelPosition">
                        <b-select required name="system_owner" v-model="owner.system_owner" expanded>
                            <option
                                v-for="(val, index) in owners"
                                :value="val"
                                :key="index">
                                {{ val }}
                            </option>
                        </b-select>
                    </b-field>

                    <b-field label="Business Owner" :label-position="labelPosition">
                        <b-input name="business_owner" required v-model="owner.business_owner" ></b-input>
                        <!-- pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$" -->
                    </b-field>

                    <b-field label="Business Owner Contact Info" :label-position="labelPosition">
                        <b-input name="business_owner_contact_info" required v-model="owner.business_owner_contact_info" ></b-input>
                        <!-- pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$" -->
                    </b-field>
                </form>

            </b-step-item>

            <b-step-item label="Finish" :clickable="false">
                <p class="has-text-centered is-italic" style="margin: 20px auto 10px auto;">Please review all details below before submitting</p>
            
                <b-field grouped class="formStyle">
                    <b-tabs
                        ref="tabs"
                        type="is-toggle"
                        vertical
                        class="is-fullwidth asset-details">
                        <b-tab-item>
                            <template slot="header" width="150px">
                                <feather type="info" size="15"></feather>
                                <span style="padding-left:5px;">Information </span>
                            </template>
                                <table>
                                    <tr v-for="(i, field) in info" v-bind:key="field">
                                        <td style="text-transform: capitalize;"><strong>{{ field.replace(/_/g, ' ') }} </strong></td>
                                        <td><strong>: </strong>{{ i }}</td>
                                    </tr>
                                </table>
                        </b-tab-item>

                        <b-tab-item>
                            <template slot="header" width="150px">
                                <feather type="grid" size="15"></feather>
                                <span style="padding-left:5px;"> Application </span>
                            </template>
                            
                            <table>
                                <tr v-for="(i, field) in application" v-bind:key="field">
                                    <td style="text-transform: capitalize;"><strong>{{ field.replace(/_/g, ' ') }}</strong></td>
                                    <td><strong>: </strong>{{ i }}</td>
                                </tr>
                            </table>
                        </b-tab-item>

                        <b-tab-item>
                            <template slot="header" width="150px">
                                <feather type="alert-triangle" size="15"></feather>
                                <span style="padding-left:5px;"> Criticality </span>
                            </template>
                            
                            <table>
                                <tr v-for="(i, field) in criticality" v-bind:key="field">
                                    <td style="text-transform: capitalize;"><strong>{{ field.replace(/_/g, ' ') }}</strong></td>
                                    <td><strong>: </strong>{{ i }}</td>
                                </tr>
                            </table>
                        </b-tab-item>

                        <b-tab-item>
                            <template slot="header" width="150px">
                                <feather type="hard-drive" size="15"></feather>
                                <span style="padding-left:5px;"> Hardware </span>
                            </template>
                            
                            <table>
                                <tr v-for="(i, field) in hardware" v-bind:key="field">
                                    <td style="text-transform: capitalize;"><strong>{{ field.replace(/_/g, ' ') }}</strong></td>
                                    <td><strong>: </strong> {{ i }}</td>
                                </tr>
                            </table>
                        </b-tab-item>

                        <b-tab-item>
                            <template slot="header" width="150px">
                                <feather type="tool" size="15"></feather>
                                <span style="padding-left:5px;"> Maintenance </span>
                            </template>
                            
                            <table>
                                <tr v-for="(i, field) in maintenance" v-bind:key="field">
                                    <td style="text-transform: capitalize;"><strong>{{ field.replace(/_/g, ' ') }}</strong></td>
                                    <td><strong>: </strong> {{ i }}</td>
                                </tr>
                            </table>
                        </b-tab-item>

                        <b-tab-item>
                            <template slot="header" width="150px">
                                <feather type="wifi" size="15"></feather>
                                <span style="padding-left:5px;"> Network </span>
                            </template>
                            
                            <table>
                                <tr v-for="(i, field) in network" v-bind:key="field">
                                    <td style="text-transform: capitalize;"><strong>{{ field.replace(/_/g, ' ') }}</strong></td>
                                    <td><strong>: </strong>{{ i }}</td>
                                </tr>
                            </table>
                        </b-tab-item>
                        
                        <b-tab-item>
                            <template slot="header" width="150px">
                                <feather type="award" size="15"></feather>
                                <span style="padding-left:5px;"> Warranty </span>
                            </template>
                            
                            <table>
                                <tr>
                                    <td><strong>Warranty Type</strong></td>
                                    <td><strong>: </strong>{{ warranty['warranty_type'] }}</td>
                                </tr>
                                <tr v-if="warranty['warranty_type'] != 'Perpetual'">
                                    <td><strong>AMC Warranty</strong></td>
                                    <td><strong>: </strong>{{ $moment(warranty['amc_warranty']).format('MMM DD, YYYY') }}</td>
                                </tr>
                                <tr v-if="warranty['warranty_type'] != 'Perpetual'">
                                    <td><strong>Renewal Date</strong></td>
                                    <td><strong>: </strong>{{ $moment(warranty['renewal_date']).format('MMM DD, YYYY') }}</td>
                                </tr>
                                <tr>
                                    <td><strong>Support Type</strong></td>
                                    <td><strong>: </strong>{{ warranty['domain_integration'] }}</td>
                                </tr>
                                <tr>
                                    <td><strong>Support Contact Info</strong></td>
                                    <td><strong>: </strong>{{ warranty['support_contact_info'] }}</td>
                                </tr>
                                <tr>
                                    <td><strong>Domain Integration</strong></td>
                                    <td><strong>: </strong>{{ warranty['domain_integration'] }}</td>
                                </tr>
                                <tr>
                                    <td><strong>PCI Guidelines</strong></td>
                                    <td><strong>: </strong>{{ warranty['pci_guidelines'] }}</td>
                                </tr>
                                <tr>
                                    <td><strong>Remarks</strong></td>
                                    <td><strong>: </strong>{{ warranty['remarks'] }}</td>
                                </tr>
                            </table>
                        </b-tab-item>

                        
                        <b-tab-item>
                            <template slot="header" width="150px">
                                <feather type="user" size="15"></feather>
                                <span> Owner </span>
                            </template>
                            
                            <table>
                                <tr v-for="(i, field) in owner" v-bind:key="field">
                                    <td style="text-transform: capitalize;"><strong>{{ field.replace(/_/g, ' ') }}</strong></td>
                                    <td><strong>: </strong>{{ i }}</td>
                                </tr>
                            </table>
                        </b-tab-item>
                    </b-tabs>
                </b-field>
            
            </b-step-item>

        </b-steps>
    </section>


    <footer class="modal-card-foot custom">
        <div class="is-pulled-right">
            
            <button class="button has-text-primary" type="button" 
            v-show="activeStep > 0" @click="activeStep -= 1">
                <chevLeft ></chevLeft>
            </button>
            <button class="button has-text-primary" v-show="activeStep < stepsLength" @click="checkValid()">
                <chevRight></chevRight>
            </button>
            <b-button type="is-success" :loading="isBusy" v-show="activeStep == stepsLength"  @click="submit">Submit</b-button>
        </div>
    </footer>
    </div>
    
</template>

<script>
import http from '../../http_common';

export default {
    props:['clients','account','locations'],
    data (){
        return {
            isBusy: false,
            new_locations : [],
            //selected_client: "default",
            // patterninput  "^[-a-zA-Z0-9'!@#$%*\]\[()\-=_+{}:\";?,.\/()]+(\s+[-a-zA-Z0-9'!@#$%*\]\[()\-=_+{}:\";?,.\/()]+)*$",
            asset_type: 'physical',
            activeStep: 0,
            stepsLength: 8,
            labelPosition: '',
            isStepsClickable: false,
            services_hosted: ["Application", "Database", "Nutanix Cluster", "RSA", "Others"],
            application: {
                "criticality": "",
                "ha": "Enabled",
                "backup": "Yes",
                "backup_window": "",
                "backup_type": "Full",
                "antivirus": "",
                "rsa_agent": "",
                "syslog": "Yes",
                "rc_ip": "",
                "rc_username": "",
                "rc_password": "",
                "service_hosted": "",
                "application_running": "",
                "server_status": "UP"
            },
            operating_systems: [
                "VMWARE ESXi 7.0 GA 15843807",
                "VMWARE ESXi 6.7 Update 3 14320388",
                "VMWARE ESXi 6.7 U2 13006603",
                "VMWARE ESXi 6.7 U1 10302608",
                "VMWARE ESXi 6.7 GA 8169922",
                "VMWARE ESXi 6.5 U2C 9298722",
                "VMWARE ESXi 6.5 U2b 8935087",
                "VMWARE ESXi 6.5 U2 GA 8294253",
                "VMWARE ESXi 6.5 U1g 7967591",
                "VMWARE ESXi 6.5.0 a 4887370",
                "VMWARE ESXi 6.0 Update 3 5050593",
                "VMWARE ESXi 6.0 Update 2 3620759",
                "VMWARE ESXi 6.0 Update 1b 3380124",
                "VMWARE ESXi 6.0 U1 3029758",
                "VMWARE ESXi 6.0.0b 2809209",
                "VMWARE ESXi 6.0 GA 2494585",
                "VMWARE ESXi 5.5 U3k 9919047",
                "Windows Server 2019 Essentials",
                "Windows Server 2019 Standard",
                "Windows Server 2019 Datacenter",
                "Windows Server 2016 Essentials",
                "Windows Server 2016 Standard",
                "Windows Server 2016 Datacenter",
                "Windows Server 2012 R2 Foundation",
                "Windows Server 2012 R2 Essentials",
                "Windows Server 2012 R2 Standard",
                "Windows Server 2012 R2 Datacenter",
                "Windows Server 2012 Foundation",
                "Windows Server 2012 Essentials",
                "Windows Server 2012 Standard",
                "Windows Server 2012 Datacenter",
                "Windows MultiPoint Server 2012",
                "Windows Server 2008 R2 Foundation",
                "Windows Server 2008 R2 Standard",
                "Windows Server 2008 R2 Enterprise",
                "Windows Server 2008 R2 Datacenter",
                "Windows Server 2008 Standard",
                "Windows Server 2008 Enterprise",
                "Windows Server 2008 Datacenter",
                "Windows Server 2003 R2 Standard Edition",
                "Windows Server 2003 R2 Enterprise Edition",
                "Windows Server 2003 R2 Datacenter Edition",
                "Windows Server 2003 Standard",
                "Windows Server 2003 Enterprise",
                "Windows Server 2003 Datacenter",
                "Windows 7",
                "Windows 8",
                "Windows 10",
                "Red Hat Enterprise Linux 8",
                "Red Hat Enterprise Linux 7",
                "Red Hat Enterprise Linux 6",
                "Red Hat Enterprise Linux 5",
                "Red Hat Enterprise Linux 4",
                "Red Hat Enterprise Linux 3",
                "Red Hat Enterprise Linux 2.1",
                "Linux CentOS 4",
                "Linux CentOS 5",
                "Linux CentOS 6",
                "Linux CentOS 7",
                "Linux CentOS 8",
                "Ubuntu 20.10",
                "Ubuntu 20.04 LTS",
                "Ubuntu 19.10",
                "Ubuntu 18.04.4 LTS",
                "Ubuntu 16.04.6 LTS",
                "Ubuntu 14.04.6 LTS",
                "Ubuntu 13.10",
                "Ubuntu 12.04.5 LTS",
                "Ubuntu 11.10",
                "Ubuntu 10.04.4 LTS",
                "Ubuntu 9.10",
                "Ubuntu 8.04.4 LTS",
                "Ubuntu 6.06.2 LTS",
                "Nutanix Acropolis",
                "SUSE Linux Enterprise Desktop",
                "SUSE Linux Enterprise Server",
                "Kali Linux",
                "FreeBSD",
                "Linux Other",
                "Infoblox",
                "McAfee SIEM",
                "Appliance"
            ],
            network: {
                "dns_servers": "",
                "dhcp": "Enabled",
                "domain": "",
                "ntp_server": "",
                "default_gateway": "",
                "network_adaptor_address": "",
                "network_speed": 1,
                "mac_address": "",
                "network_switch_ip": "",
                "fibre_slot_port": "",
                "network_port": "",
            },
            hardware: {
                "operating_system": "",
                "cpu_model": "",
                "speed": "",
                "ht_active": "True",
                "number_cpu": null,
                "cores_per_cpu": null,
                "number_cores": null,
                "number_memory": null,
                "number_nics": null,
                "number_hbas": null,
                "number_vms": null,
                "vrams": null,
                "hdd": 1,
                "raid_type": "",
                "power_source_type": "",
                "connected_on_power_strip": "Yes"
            },
            maintenance: {
                "frequency": "Annual",
                "procedure": "",
            },
            critcally_category: null,
            criticality: {
                "confidentiality": null,
                "integrity": null,
                "availability": 0,
                "weight": null,
                "asset_weight_value": this.asset_weight,
                "category": 3,
                "total": ""
            },
            warranty: {
                "warranty": "N/A",
                "warranty_type": "Annual",
                "amc_warranty": null,
                "renewal_date": null,
                "support_type": "",
                "support_contact_info": "",
                "domain_integration": "Yes",
                "pci_guidelines": "",
                "remarks": ""
            },
            owner: {
                "app_owner": "",
                "app_owner_contact_info": "",
                "email_id": "",
                "system_owner": "",
                "business_owner": "",
                "business_owner_contact_info": "",
            },
            owners: ["ITAAS", "TMG-SEC", "TMG-NET-INFRA", "BAG", "SEO", "CIT-Trends", "SOC", "NOC", "TOC", "CCI", "Contact Center Group", "Service Management", "Multi-Cloud", "BSG", "ISBSG", "CSV", "Other"],
            hdd: 0,
            hdd_type: "GB",
            network_speed: {
                capacity: 1,
                type: "Half Duplex"
            },
            info: {
                "sr_ticket": "",
                "hostname": "",
                "client_id": "",
                "ip_address": "",
                "group": "Systems",
                "manufacturer": "",
                "model": "",
                "service_tag": "",
                "hardware_type": "",
                "vendor": "",
                "role": "",
                "location": "",
                "datacenter": "Production",
                "rack_slot": "",
                "created_by": this.account.User.id,
                "priority": "Valid",
                "status": 1,
            },
        }
    },
    methods: {
        selectedClient(client_id) {
            if(this.info.client_id != client_id) {
                this.info.location = ""
            }

            let client = this.clients.find(c => c.id == client_id);
            let name = client.name.toLowerCase();
            switch (name) {
                case "sap":
                    this.selected_client = "sap";
                    break;
                case "unilab":
                    this.selected_client = "unilab";
                    break;
                default:
                    this.selected_client = "default";
            }
        },
        checkValid() {
            //get form element
            // console.log(this.info.location)
            // console.log(this.$refs.steps.$children[this.activeStep])
            if(this.$refs.steps.$children[this.activeStep].$el.children[1].checkValidity()) {

                if(this.activeStep == 2){
                    if( this.criticality.integrity == null ||
                        this.criticality.confidentiality == null ||
                        this.criticality.availability == 0 ||
                        this.criticality.weight == null ){

                        this.$swal({
                            toast: true,
                            position: 'bottom-right',
                            showConfirmButton: false,
                            timer: 3000,
                            icon: 'error',
                            title:'Please fill out all required fields correctly to proceed...'
                        });
                    }
                    else {
                        this.activeStep += 1;
                    }
                }else{
                    this.activeStep += 1;
                }
            
            }else {
                    this.$swal({
                    toast: true,
                    position: 'bottom-right',
                    showConfirmButton: false,
                    timer: 3000,
                    icon: 'error',
                    title: 'Please fill out all required fields correctly to proceed...',
                    });
            }
        },
        dateFormatter(date) {
            return this.$moment(date).format('YYYY-MM-DD');
        },
        showAlert() {
        this.$swal({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000,
          icon: 'info',
          title: "A new assets has been added!"
        });
        },
        showAlertHddNetwork(val) {
            this.$swal({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            icon: 'error',
            title: "Kindly check input for " + `${val}`
            });
        },
        submit() {
            

            if(this.info.client_id) {
                this.isBusy = true;
                let that = this;        

                let arr = Object.assign({}, 
                    {
                    asset:this.info, 
                    asset_application:this.application, 
                    asset_criticality:this.criticality, 
                    asset_hardware:this.hardware, 
                    asset_maintenance:this.maintenance, 
                    asset_network:this.network, 
                    asset_owner:this.owner, 
                    asset_warranty:this.warranty})

                this.info['asset_type'] = this.asset_type
                
                
                http.post('/assets/add', arr)
                
                .then((response) => {
                    that.isBusy = false;

                    that.$parent.close();
                    response.data;
                    that.$emit('toPending', response.data);
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
            }else {
                this.activeStep = 0;
                this.$swal({
                    toast: true,
                    position: 'bottom-right',
                    showConfirmButton: false,
                    timer: 5000,
                    icon: 'error',
                    title: "It seems you didn't set a client for this asset. Please choose a client first to proceed...",
                });
            
            }
               
        },
        convertDate(val){
          var dates = new Date(val)
          return dates
        },
        showAddLocation() {
            this.$buefy.dialog.prompt({
                message: `Location`,
                inputAttrs: {
                    placeholder: 'Enter location name...',
                    maxlength: 30,
                    value: this.info.location
                },
                confirmText: 'Add',
                onConfirm: (value) => {
                    this.new_locations.push(value);
                    this.$swal({
                      toast: true,
                      position: 'bottom-right',
                      showConfirmButton: false,
                      timer: 2000,
                      icon: 'success',
                      title: value + ' has been added!',
                    })
                }
            })
        },
    },
    computed: {
        filteredLocationArray() {
            var location = []
            for (let i in this.locations){
                if (this.locations[i].Client.id == this.info.client_id){
                    // console.log(this.locations[i].name)
                    location.push(this.locations[i].name)
                }
            }
            for (let i in this.new_locations){
                location.push(this.new_locations[i])
            }

            return location
            
        },
        filteredOperatingSystems() {
            return this.operating_systems.filter((option) => {
                return option
                    .toString()
                    .toLowerCase()
                    .indexOf(this.hardware.operating_system.toLowerCase()) >= 0
            })
        },
        concatHDDtype() {
            return this.hdd + this.hdd_type
        },
        calculateCategory() {
            if(this.asset_weight >= 21) {
                return 1
           
            }else if(this.asset_weight >= 12) {
                return 2
                
            }else {
                return 3
            }
        },
        criticality_total() {
            return ((this.criticality.confidentiality || 0) * 1) + ((this.criticality.availability || 0) * 1) + ((this.criticality.integrity || 0) * 1)
            

        },
        asset_weight() {
            return (this.criticality.weight || 0) * (this.criticality_total || 0)
            
        },
        
        concatNetworkSpeed() {
            return this.network_speed.capacity + "GB " + this.network_speed.type
        },

    },
    watch:{
        asset_weight: function(val){
             this.criticality.asset_weight_value = val;
        },

        calculateCategory: function(val){
             this.criticality.category = val;
        },

        concatHDDtype: function(val){
             this.hardware.hdd = val;
        },

        concatNetworkSpeed: function(val){
             this.network.network_speed = val;
        },

        criticality_total: function(val){
             this.criticality.total = val;
        },
        

    },
}
</script>

<style scoped>
.asset-modal .label {
    font-size: .75rem;
    font-weight: 300;
}

.modal-card-foot {
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  border-top: 1px solid #dbdbdb;
}

.modal-card-foot .button:not(:last-child) {
  margin-right: 0.5em;
}

.modal-card-body.custom {
  overflow: visible;
}

.modal-card-foot.custom {
  display: block;
}

.step-item {
    outline-style:none;
}

.modal-card-foot.custom {
    padding: 15px;
}

.form {
    margin:auto;
    max-width: 650px;
}
.formStyle {
    margin-left:80px;
    margin-right:80px;
}

.steps {
    position: fixed;
    top: 70px;
    width: 820px;
    margin: auto;
}

.step-title {
    font-weight: 400 !important;
}

.step-content {
    padding: 0px;
}

.title {
    font-size: 15pt;
    margin-top: 10px;
}


.modal-card-foot.custom {
    padding: 15px;
}


.has-background-primary {
  background-color: #00d1b2 !important;
}

.asset-modal .label {
  font-size: 0.75rem;
  font-weight: 300;
}

/* modal */
.modal {
  -webkit-box-align: center;
          align-items: center;
  display: none;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
          flex-direction: column;
  -webkit-box-pack: center;
          justify-content: center;
  overflow: hidden;
  position: fixed;
  z-index: 40;
}

.modal.is-active {
  display: -webkit-box;
  display: flex;
}

.modal-background {
  background-color: rgba(10, 10, 10, 0.86);
}

.modal-content,
.modal-card {
  margin: 0 20px;
  max-height: calc(100vh - 160px);
  overflow: auto;
  position: relative;
  width: 100%;
}

@media screen and (min-width: 769px), print {
  .modal-content,
  .modal-card {
    margin: 0 auto;
    max-height: calc(100vh - 40px);
    width: 640px;
  }
}

.modal-close {
  background: none;
  height: 40px;
  position: fixed;
  right: 20px;
  top: 20px;
  width: 40px;
}

.modal-card {
  display: -webkit-box;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
          flex-direction: column;
  max-height: calc(100vh - 40px);
  overflow: hidden;
  -ms-overflow-y: visible;
}

.modal-card-head,
.modal-card-foot {
  -webkit-box-align: center;
          align-items: center;
  background-color: whitesmoke;
  display: -webkit-box;
  display: flex;
  flex-shrink: 0;
  -webkit-box-pack: start;
          justify-content: flex-start;
  padding: 20px;
  position: relative;
}

.modal-card-head {
  border-bottom: 1px solid #dbdbdb;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.modal-card-title {
  color: #363636;
  -webkit-box-flex: 1;
          flex-grow: 1;
  flex-shrink: 0;
  font-size: 1.5rem;
  line-height: 1;
}

.modal-card-foot {
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  border-top: 1px solid #dbdbdb;
}

.modal-card-foot .button:not(:last-child) {
  margin-right: 0.5em;
}

.modal-card-body {
  -webkit-overflow-scrolling: touch;
  background-color: white;
  -webkit-box-flex: 1;
          flex-grow: 1;
  flex-shrink: 1;
  overflow: auto;
  padding: 20px;
}

/* dialog */

.dialog .modal-card {
  max-width: 460px;
  width: auto;
}

.dialog .modal-card .modal-card-head {
  font-size: 1.25rem;
  font-weight: 600;
}

.dialog .modal-card .modal-card-body .field {
  margin-top: 16px;
}

.dialog .modal-card .modal-card-body.is-titleless {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.dialog .modal-card .modal-card-foot {
  -webkit-box-pack: end;
          justify-content: flex-end;
}

.dialog .modal-card .modal-card-foot .button {
  display: inline;
  min-width: 5em;
  font-weight: 600;
}

@media screen and (min-width: 769px), print {
  .dialog .modal-card {
    min-width: 320px;
  }
}

.dialog.is-small .modal-card,
.dialog.is-small .input,
.dialog.is-small .taginput .taginput-container.is-focusable,
.taginput .dialog.is-small .taginput-container.is-focusable,
.dialog.is-small .button {
  border-radius: 2px;
  font-size: 0.75rem;
}

.dialog.is-medium .modal-card,
.dialog.is-medium .input,
.dialog.is-medium .taginput .taginput-container.is-focusable,
.taginput .dialog.is-medium .taginput-container.is-focusable,
.dialog.is-medium .button {
  font-size: 1.25rem;
}

.dialog.is-large .modal-card,
.dialog.is-large .input,
.dialog.is-large .taginput .taginput-container.is-focusable,
.taginput .dialog.is-large .taginput-container.is-focusable,
.dialog.is-large .button {
  font-size: 1.5rem;
}

.dialog.has-custom-container {
  position: absolute;
}



</style>