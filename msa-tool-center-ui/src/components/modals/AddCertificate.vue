<template>
    <form @submit="formSubmit">
        <div class="modal-card" style="width: 400px; overflow: visible;">
            <header class="modal-card-head has-background-success">
                <p class="modal-card-title has-text-white is-size-5">New Domain</p>
            </header>
            <section class="modal-card-body custom">

                <b-field>
                    <b-input
                        type="text"
                        v-model="domain_name"
                        placeholder="Domain.com"
                        pattern="^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$"
                        required>
                    </b-input>
                </b-field>

                <transition name="slideDown" tag="input" mode="out-in">
                    <b-field v-if="add_type == 'manual'">
                        <b-datepicker
                            name="valid_from"
                            required
                            :date-parser="dateFormatter"
                            v-model="valid_from"
                            placeholder="Valid From"
                            icon="calendar-today">
                        </b-datepicker>
                        <p class="control">
                            <b-datepicker
                                name="valid_to"
                                required
                                :date-parser="dateFormatter"
                                v-model="valid_to"
                                placeholder="Valid To"
                                icon="calendar-today"
                                extended>
                            </b-datepicker>
                        </p>
                    </b-field>
                </transition>

                <transition name="slideDown">
                    <b-field v-if="add_type == 'manual'">
                        <b-input
                            type="text"
                            v-model="issuer"
                            placeholder="Issuer"
                            required>
                        </b-input>
                    </b-field>
                </transition>

                 <b-autocomplete
                placeholder="Select Client..." 
                :data="clients"
                field="name"
                open-on-focus
                @select="option => {selected = option; client = option ? option : null}"
                >
            </b-autocomplete>
               
                
            </section>
            <footer class="modal-card-foot custom">
                <div class="is-pulled-right">
                    <button class="button" type="button" @click="$parent.close()">Close</button> 
                    <b-button type="is-success" native-type="submit" :disabled="client== null">Submit</b-button>
                </div>

                <b-field class="is-pulled-left">
                    <b-radio v-model="add_type"
                        name="add_type"
                        size="is-small"
                        native-value="auto" @input="valid_from= null, valid_to=null">
                        Auto
                    </b-radio>
                    <b-radio v-model="add_type"
                        name="add_type"
                        size="is-small"
                        native-value="manual">
                        Manual
                    </b-radio>
                </b-field>
            </footer>
        </div>
    </form>
</template>

<script>
 import http from '../../http_common';
export default {
    props:['account'],
    data() {
        return {
            clients: [],
            add_type: 'auto',
            client: null,
            isLoadingClients: true,
            domain_name: null,
            issuer: null,
            valid_from: null,
            valid_to: null,
            valid_status: null,
            isBusy: false
        }
    },
    created() {
        this.fetchClients();
        //console.log(this.account)
    },
    methods: {
        dateFormatter(date) {
            return this.$moment(date).format('YYYY-MM-DD');
        },
        fetchClients() {
            http
                .get('/certificates/clients')
                .then(response => {
                    this.clients = response.data.rows;
                    this.isLoadingClients = false;
                });
        },
        saveData(){
            let that = this;
            http.post('/certificates/add', {
                domain_name: this.domain_name,
                client_name: this.client.name,
                client_id: this.client.id,
                add_type: this.add_type,
                valid_from: this.valid_from,
                valid_to: this.valid_to,
                issuer: this.issuer,
                created_by: this.account.User.id,
            })
            .then(function (response) {
                that.isBusy = false;
                that.$parent.close();
                that.$emit('toPending', response.data);
                that.$buefy.snackbar.open({
                    message: response.data.message,
                    type: 'is-success',
                    position: 'is-bottom-right'
                })
            })
            .catch(function (error) {
                error
                //console.log(error)
                // let e = error.response.data;
                // let error_messages = '';


                // Object.keys(e.errors).forEach(function(key) {
                //     error_messages = error_messages + '<br>&nbsp;&nbsp;• ' + e.errors[key][0]
                // });

                that.$buefy.dialog.alert({
                    title: 'Oops',
                    message: 'Please provide right value.',
                    type: 'is-danger',
                    hasIcon: true,
                    icon: 'times-circle',
                    iconPack: 'fa',
                    ariaRole: 'alertdialog',
                    ariaModal: true
                })
                that.isBusy = false;
            });

        },
        formSubmit(e) {
            e.preventDefault();
            
            this.isBusy = true;
            
            if (this.valid_from == null && this.valid_to == null){
                this.saveData();
            }else {
                var date_from = this.$moment(this.valid_from).format('YYYY-MM-DD')
                var date_to = this.$moment(this.valid_to).format('YYYY-MM-DD')
                var date_check = this.$moment(date_from).isBefore(date_to)

                if (date_check == false) {
                    this.checkValid();
                }else{
                    this.saveData();
                }
            }

        },
        checkValid() {
            this.$swal({
                toast: true,
                position: 'bottom-right',
                showConfirmButton: false,
                timer: 3000,
                icon: 'error',
                title: 'Kindly check the dates. required atleast 1 day.',
                });
            }
        
    }
}
</script>

<style scoped>
.multiselect * {
    box-sizing: border-box;
}

.multiselect{
    text-align: left;
    color: #35495e;
}
.multi{
    min-height: 40px;
    display: block;
    padding: 8px 40px 0 8px;
    border-radius: 5px;
    border: 1px solid #e8e8e8;
    background: #fff;
    font-size: 14px;
}
</style>