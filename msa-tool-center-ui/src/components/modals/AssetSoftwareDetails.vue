<template>
<div class="modal-card" style="overflow: visible;">
    <header class="modal-card-head has-background-primary">
        <p class="modal-card-title has-text-white is-size-5">{{ data.name }}</p>
    </header>
    <section class="modal-card-body asset-modal">
        
        <div class="asset-details" v-if="!edit">
            <table>
            <tr>
                    <td>SR #</td>
                    <td>{{ data['sr_ticket'] }}</td>
                </tr>
                <tr>
                    <td>Client</td>
                    <td>
                        <span v-if="data['client_id']">{{ clients.find(x => x.client_id == data['client_id']).name }}</span>
                    </td>
                </tr>
                <tr>
                    <td>Name</td>
                    <td>{{ data['name'] }}</td>
                </tr>
                <tr>
                    <td>Description</td>
                    <td>{{ data['description'] }}</td>
                </tr>
                <tr>
                    <td>Quantity</td>
                    <td>{{ data['quantity'] }}</td>
                </tr>
                <tr>
                    <td>Allocation</td>
                    <td>{{ data['allocation'] }}</td>
                </tr>
                <tr>
                    <td>Warranty Type</td>
                    <td>{{ data['warranty_type'] }}</td>
                </tr>
                <tr v-if="data['warranty_type'] == 'Annual' || data['warranty_type'] == 'Annually'">
                    <td>Warranty Date</td>
                    <td>{{ ($moment(data['warranty_date']).format('MMM DD, YYYY')) }}</td>
                </tr>
                <tr v-if="data['warranty_type'] == 'Annual' || data['warranty_type'] == 'Annually'">
                    <td>Warranty Duration</td>
                    <td>{{ data['warranty'] }}</td>
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
                                :value="client.client_id"
                                :key="client.client_id">
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
                                native-value="Perpetual">
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
        <b-button v-if="can_edit" class="is-pulled-left" type="is-link" @click="toggleEdit"> {{ edit ? 'Cancel Edit' : 'Edit'}} </b-button>

        <div class="buttons is-pulled-right">
            <b-button v-if="edit" :loading="isBusy" type="is-info" @click="checkValid()">Save</b-button>
            <button v-else class="button" type="button" @click="$parent.close()">Close</button>
        </div>
    </footer>
</div>
</template>

<script>

export default {
    props: ['asset', 'id_key', 'can_edit', 'clients'],
    data() {
        return {
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
            data: {}
        }
    },
    created() {
        this.data = this.id_key == 'module_item_id' ? this.asset.software : this.asset;

        if(this.data) {
            this.resetForm();
        }
    },
    methods: {
        toggleEdit() {
            this.edit = !this.edit;

            if(!this.edit) {
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
            const id = this.asset.software_id;

            //console.log(Object.fromEntries(formData))

            this.$axios.put('/api/softwares/' + id, Object.fromEntries(formData))
                .then(function (response) {
                that.isBusy = false;
                that.$parent.close();

                //console.log(response);

                that.$emit('updateData', response.data.software, 'software', id)

                that.$buefy.snackbar.open({
                    message: response.data.message,
                    type: 'is-success',
                    position: 'is-bottom-right'
                })
            })
            .catch(function (error) {
                let e = error.response.data;
                let error_messages = '';


                Object.keys(error.errors).forEach(function(key) {
                    error_messages = error_messages + '<br>&nbsp;&nbsp;• ' + e.errors[key][0]
                });

                that.$buefy.dialog.alert({
                    title: 'Oops',
                    message: `${e.message}. Please Try Again... ${error_messages}<br>`,
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
        },
        dateFormatter(date) {
            return this.$moment(date).format('YYYY-MM-DD');
        }
    }
}
</script>

<style lang="scss" scoped>
.modal-card-body.asset-modal {
    overflow: visible;
}

.asset-details table tr {
    td:first-child {
        text-align: right;
        font-weight: 500;
        font-size: 10pt;
        color: #1f6d61;
        width: 200px;
        text-transform: uppercase;
        padding: 5px 20px 0px 0;
        border-bottom: 0.5px solid white;
    }

    td:not(:first-child) {
        padding: 5px 10px;
        height: 35px;
        border-bottom: 0.5px solid #dadada;
    }
}

form {
    margin: auto;
    max-width: 650px;
}
</style>