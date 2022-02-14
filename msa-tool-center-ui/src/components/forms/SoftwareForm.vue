<template>
    <div class="modal-card" style="overflow: visible;">
    <header class="modal-card-head has-background-primary">
        <p class="modal-card-title has-text-white is-size-5 is-capitalized">New Asset • {{ asset_type }}
        </p>
    </header>
    
    <section class="modal-card-body asset-modal">
        <form ref="form">
            <div class="columns">

                <div class="column">
                    <b-field>
                        <p class="control">
                            <span class="button is-static">SR #</span>
                        </p>
                        <b-field>
                        <b-input required type="number" onkeydown="return event.keyCode !== 69"  name="sr_ticket" v-model="info.sr_ticket" onblurcheckHtml5Validity expanded></b-input>
                        </b-field>
                    </b-field>

                    <b-field label="Name" :label-position="labelPosition" expanded>
                        <b-input name="name" required v-model="info.name" onblurcheckHtml5Validity pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$"></b-input>
                    </b-field>

                    <b-field label="Description" :label-position="labelPosition">
                        <b-input name="description" required v-model="info.description" pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$"></b-input>
                    </b-field>

                    <b-field label="Quantity" :label-position="labelPosition">
                        <b-input name="quantity" onkeydown="return event.keyCode !== 69" type="number" required v-model="info.quantity"></b-input>
                    </b-field>
                    <b-field label="Allocation" :label-position="labelPosition" expanded>
                        <b-input name="allocation" type="" required v-model="info.allocation" pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$"></b-input>
                    </b-field>

                    <b-field label="Client" :label-position="labelPosition" expanded>
                        <b-select required v-model="info.client_id" placeholder="Select Client..." expanded>
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
                                native-value="Annual">
                                Annual
                            </b-radio>
                            <b-radio name="warranty_type" required v-model="info.warranty_type"
                                native-value="Perpetual"  @input="info.warranty_date = convertDate($moment().format('YYYY-MM-DD'))  
                                info.warranty = 'N/A' ">
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
                        <b-field>
                        <b-input type="number"  onkeydown="return event.keyCode !== 69" name="warranty" required v-model="info.warranty" placeholder="# of year" pattern="^[-a-zA-Z0-9!#%$*.\\\-()]+(\s+[-a-zA-Z0-9!#%$*.\\\-()]+)*$"></b-input>
                        </b-field>
                        <p class="control">
                                <span class="button is-static"> Year</span>
                        </p>
                    </b-field>
                </div>
            </div>
        </form>
    </section>

    <footer class="modal-card-foot custom">
        <div class="is-pulled-right">
            <b-button type="is-success" :loading="isBusy" @click="checkValid">Submit</b-button>
        </div>
    </footer>
</div>
</template>

<script>
import http from '../../http_common';
export default {
    props:['clients','account'],
    data (){
        return {
            asset_type: 'Software License',
            
            isBusy: false,
            labelPosition: '',
            activeStep: 0,
            stepsLength: 8,
            isStepsClickable: true,
            type_asset:{"asset_type": 'software'},
            info: {
                "sr_ticket": null,
                "name": null,
                "client_id": null,
                "description": null,
                "quantity": null,
                "allocation": null,
                "warranty_date": null,
                "warranty": null,
                "warranty_type": "Annual",
                "created_by": this.account.User.id,
                "priority": "Valid",
                "status": "1"
            }
        }
    },
    methods:{
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
        submit() {
            if(this.info.client_id) {
                this.isBusy = true;
                let that = this;
                
                let arr = {asset:this.type_asset,asset_software:this.info}
                
                http.post('/assets/add', arr)
                .then( (response) => {
                    that.isBusy = false;
                    response.data;
                    that.$parent.close();
                    that.$emit('toPending', response.data);
                    
                    this.$swal({
                      toast: true,
                      position: 'bottom-right',
                      showConfirmButton: false,
                      timer: 2000,
                      icon: 'success',
                      title: response.data.message,
                      })
                    that.isBusy = false;
                    })
          
                .catch( (error) =>{
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
        checkValid() {
            //check form validity
            if(this.$refs.form.checkValidity()) {
                this.submit();
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
        convertDate(val){
          var dates = new Date(val)
          return dates
        }
    },
    
}
   
</script>


<style scoped>
.modal-card-foot.custom {
    padding: 15px;
}
.modal-card-body.asset-modal {
    overflow: visible;
}

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