<template>
    <form @submit="formSubmit">
        <div class="modal-card" style="width: 300px">
            <header class="modal-card-head has-background-info">
                <p class="modal-card-title has-text-white is-size-5">Add Client</p>
            </header>
            <section class="modal-card-body custom">
                
                <b-field>
                    <b-input
                        type="text"
                        v-model="name"
                        placeholder="Name"
                        required>
                    </b-input>
                </b-field>

                <b-field>
                    <b-input
                        type="text"
                        v-model="description"
                        placeholder="Description">
                    </b-input>
                </b-field>
                
            </section>
            <footer class="modal-card-foot custom">
                <div class="is-pulled-right">
                    <button class="button" type="button" @click="$parent.close()">Close</button>
                    <button class="button is-info">Submit</button>
                </div>
            </footer>
        </div>
    </form>
</template>

<script>
export default {
    data() {
        return {
            name: null,
            description: null
        }
    },
    created() {
        //this.fetchClients();
    },
    methods: {
        fetchClients() {
            this.$axios
                .get('/api/clients')
                .then(response => {
                    response;
                    //console.log(response.data);
                });
        },
        formSubmit(e) {
            e.preventDefault();
            let that = this;

            this.$axios.post('/api/clients', {
                name: this.name,
                description: this.description
            })
            .then(function (response) {
                that.addPermission();
                that.$parent.close();
                that.$buefy.snackbar.open({
                    message: response.data.message,
                    type: 'is-success',
                    position: 'is-bottom-right'
                })
            })
            .catch(function (error) {
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
            });
        },
        addPermission() {
            let that = this;

            let permission_tag = this.name
                    .toLowerCase()
                    .replace(/[^\w ]+/g,'')
                    .replace(/ +/g,'-');

            const data = {
                name: 'client-'+permission_tag,
                display_name: this.description,
                description: this.name + ' Permission'
            }

            //console.log(data)

            this.$axios.post('/api/permissions', data)
            .then(function (response) {
                that.$parent.close();
                that.$buefy.snackbar.open({
                    message: response.data.message,
                    type: 'is-success',
                    position: 'is-bottom-right'
                })
            })
            .catch(function (error) {
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
            });
        }
    }
}
</script>