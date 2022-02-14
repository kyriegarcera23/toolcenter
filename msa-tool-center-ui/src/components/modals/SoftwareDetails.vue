<template>
<div class="modal-card" style="overflow: visible;">
    <header class="modal-card-head has-background-primary">
        <p class="modal-card-title has-text-white is-size-5">{{ data.name }}</p>
    </header>
   
   <section class="modal-card-body asset-modal">
        
        <div class="asset-details" v-if="!edit">
            <table>
            <tr>
                    <td class="tdStyle">SR #</td>
                    <td style="padding-top:3px;">{{ data['sr_ticket'] }}</td>
                </tr>
                <tr>
                    <td class="tdStyle">Client</td>
                    <td style="padding-top:3px;">
                        <span v-if="data['client_id']">{{ clients.find(x => x.id == data['client_id']).name }}</span>
                    </td>
                </tr>
                <tr>
                    <td class="tdStyle">Name</td>
                    <td style="padding-top:3px;">{{ data['name'] }}</td>
                </tr>
                <tr>
                    <td class="tdStyle">Description</td>
                    <td style="padding-top:3px;">{{ data['description'] }}</td>
                </tr>
                <tr>
                    <td class="tdStyle">Quantity</td>
                    <td style="padding-top:3px;">{{ data['quantity'] }}</td>
                </tr>
                <tr>
                    <td class="tdStyle">Allocation</td>
                    <td style="padding-top:3px;">{{ data['allocation'] }}</td>
                </tr>
                <tr>
                    <td class="tdStyle">Warranty Type</td>
                    <td style="padding-top:3px;">{{ data['warranty_type'] }}</td>
                </tr>
                <tr v-if="data['warranty_type'] == 'Annual' || data['warranty_type'] == 'Annually'">
                    <td class="tdStyle">Warranty Date</td>
                    <td style="padding-top:3px;">{{ ($moment(data['warranty_date']).format('MMM DD, YYYY')) }}</td>
                </tr>
                <tr v-if="data['warranty_type'] == 'Annual' || data['warranty_type'] == 'Annually'">
                    <td class="tdStyle">Warranty Duration</td>
                    <td style="padding-top:3px;">{{ data['warranty'] }}</td>
                </tr>

            </table>
        </div>
        <form ref="form" v-else>
            <div class="columns">
                <div class="column">
                    <b-field>
                        <p class="control">
                            <span class="button is-static">SR #</span>
                        </p>
                        <b-input name="sr_ticket" v-model="info.sr_ticket" onblurcheckHtml5Validity expanded></b-input>
                    </b-field>

                    <b-field label="Name" :label-position="labelPosition" expanded>
                        <b-input name="name" required v-model="info.name" onblurcheckHtml5Validity></b-input>
                    </b-field>

                    <b-field label="Description" :label-position="labelPosition">
                        <b-input name="description" required v-model="info.description"></b-input>
                    </b-field>

                    <b-field label="Quantity" :label-position="labelPosition">
                        <b-input name="quantity" type="number" required v-model="info.quantity"></b-input>
                    </b-field>
                    <b-field label="Allocation" :label-position="labelPosition" expanded>
                        <b-input name="allocation" type="" required v-model="info.allocation"></b-input>
                    </b-field>
                    <b-field label="Client" :label-position="labelPosition" expanded>
                        <b-select required name="client_id" v-model="info.client_id" placeholder="Select Client..." expanded>
                            <option
                                v-for="client in clients"
                                :value="client.id"
                                :key="client.id">
                                {{ client.name }}
                            </option>
                        </b-select>
                    </b-field>
                </div>

                <div class="column">
                    <b-field label="Warranty Type" :label-position="labelPosition">
                        <b-field>
                            <b-radio name="warranty_type" required v-model="info.warranty_type"
                                native-value="Annual" @input="info.warranty_date = convertDate($moment().format('YYYY-MM-DD'))" 
                                >
                                Annual
                            </b-radio>
                            <b-radio name="warranty_type" required v-model="info.warranty_type"
                                native-value="Perpetual" @input="data['warranty_date'] = convertDate($moment().format('YYYY-MM-DD'))
                                data['warranty'] = 'N/A' ">
                                Perpetual
                            </b-radio>
                        </b-field>
                    </b-field>
                    <b-field v-if="info.warranty_type == 'Annual'" label="Warranty Date" :label-position="labelPosition">
                        <b-datepicker
                        expanded
                        name="warranty_date"
                        required
                        :date-formatter="dateFormatter"
                        :date-parser="dateFormatter"
                        v-model="info.warranty_date"
                        icon="calendar-today">
                        </b-datepicker>
                    </b-field>

                    <b-field v-if="info.warranty_type == 'Annual'" label="Warranty Duration" :label-position="labelPosition">
                        <b-input name="warranty" required v-model="info.warranty" placeholder="eg.) 1 Year"></b-input>
                    </b-field>
                </div>
            </div>
        </form>
    
    </section>
         <footer class="modal-card-foot custom">
        <b-button v-if="can_edit" class="is-pulled-left" style="margin-right:75%" type="is-link is-light" @click="toggleEdit"> {{ edit ? 'Cancel' : 'Edit'}} </b-button>

        <div class="buttons is-pulled-right">
            <b-button v-if="edit" :loading="isBusy" type="is-info" @click="checkValid()">Save</b-button>
            <button v-else class="button" type="button" @click="$parent.close()">Close</button>
        </div>
    </footer>
   
</div>
    
</template>

<script>
import http from '../../http_common';
export default {
     props:['data','clients','can_edit'],
    data(){
        return{
            info_fields: ['name', 'description', 'quantity', 'allocation', 'warranty_date', 'warranty', 'warranty_type'],
            isBusy: false,
            edit: false,
            labelPosition: '',
            info: {
                "sr_ticket": null,
                "name": null,
                "description": null,
                "quantity": null,
                "allocation": null,
                "client_id": null,
                "warranty_type": "Annual",
                "warranty_date": null,
                "warranty": null,
            },
        }
        
    },
    methods:{
        dateFormatter(date) {
            return this.$moment(date).format('YYYY-MM-DD');
        },
        convertDate(val){
          var dates = new Date(val)
          return dates
        },
        toggleEdit() {
            
            this.edit = !this.edit;

            if(!this.edit) {
                this.resetForm();
            }else{
                this.resetForm();
            }
        },
        resetForm() {
            const a = this.data;
            this.info = {
                "sr_ticket" : a.sr_ticket,
                "name": a.name,
                "description": a.description,
                "quantity": a.quantity,
                "allocation": a.allocation,
                "client_id": a.client_id,
                "warranty_date": a.warranty_date ? new Date(a.warranty_date) : null,
                "warranty": a.warranty,
                "warranty_type": a.warranty_type || "Annual"
            };
        },
        submit() {
            this.isBusy = true;
            let that = this;
            const formData = new FormData(this.$refs.form);
            var input = Object.fromEntries(formData)
            input.info_category = 'software'
            
            //console.log(input)
            //console.log(this.data.id)
            http.post('/assets/update/'+ this.data.id, input)
            .then((response) => {
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
            if(this.$refs.form.checkValidity()) {
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