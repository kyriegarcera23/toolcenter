<template>
    <div class="modal-card" style="overflow: visible; width: 850px; height: calc(100vh - 40px);">
    <header class="modal-card-head has-background-primary">
        <p class="modal-card-title has-text-white is-size-5">{{ this.data.vendor}}</p> 
    </header>

    <section class="modal-card-body">
         <b-field grouped>
             <b-tabs
                ref="tabs"
                type="is-boxed"
                vertical
                class="is-fullwidth asset-details"
                @input="changeTab">
                <b-tab-item name="gizmo">
                            <template slot="header" width="150px">
                                <feather type="hard-drive" size="15"></feather>
                                <span style="padding-left:5px;"> Hardware </span>
                            </template>

                            <form ref="hardware_form" @submit.prevent="checkValid()">
                                <input style="margin-bottom:5px;" type="hidden" value="gizmo" name="info_category"/>
                                 <table :class="{'edit-details' : edit.hardware}">
                                    <tr v-for="(i, field) in data" v-bind:key="field">
                                    
                                        <td class="tdStyle" v-if="field != 'id' && field != 'asset_id' && field != 'createdAt' && field != 'updatedAt'">{{ field.replace(/_/g, ' ') }}</td>
                                        <td v-if="(edit.hardware) && (field != 'id' && field != 'asset_id' && field != 'createdAt' && field != 'updatedAt')">
                                            <b-field expanded>
                                                <b-input style="margin-bottom:5px;" :name="field" required v-model="data[field]" onblurcheckHtml5Validity></b-input>
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
    props:['data','can_edit'],
    data (){
        return {
            active_tab: 'hardware',
            edit: {
                hardware: false,
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
            // if (this.active_tab == 'hardware'){
            //     input.created_by = this.account.User.id
            // }
            console.log(input)
            console.log(this.data.id)
            http.post('/assets/update/'+ this.data.id, input)
            .then((response) => {
                console.log('response')
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