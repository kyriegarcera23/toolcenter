<template>
    <form @submit="formSubmit">
        <div class="modal-card" style="width: 400px; overflow: visible;">
            <header class="modal-card-head has-background-success">
                <p class="modal-card-title has-text-white is-size-5">New Permission</p>
            </header>
            <section class="modal-card-body custom">

                <b-field>
                    <b-input
                        type="text"
                        v-model="display_name"
                        placeholder="Display Name"
                        required>
                    </b-input>
                </b-field>

    
                <!-- :code_slug="slug" -->
                
                <b-field>
                    <b-input
                        type="textarea"
                        v-model="description"
                        placeholder="Description"
                        required>
                    </b-input>
                </b-field>
                
            </section>
            <footer class="modal-card-foot custom">
                <div class="is-pulled-right">
                    <button class="button" type="button" @click="$parent.close()">Close</button>
                    <b-button type="is-success" native-type="submit" :loading="isBusy">Submit</b-button>
                </div>
            </footer>
        </div>
    </form>
</template>

<script>
import http from '../../http_common';
export default {
    data() {
        return {
            name: null,
            display_name: null,
            description: null,
            issuer: null,
            isBusy: false
        }
    },
    created() {

    },
    computed: {
        // slug() {
        //     var slug = this.convertToSlug(this.display_name || '');
        //     this.name = slug;
        //     return slug;    
        // }
    },
    methods: {
        convertToSlug(text) {
            this.name = text
                    .toLowerCase()
                    .replace(/[^\w ]+/g,'')
                    .replace(/ +/g,'-');
            return this.name;
        },
        formSubmit(e) {
            e.preventDefault();
            
            this.isBusy = true;
            let that = this;
            const data = {
                name: this.display_name,
                description: this.description
            }

            http.post('/permissions/add', data)
            .then(function (response) {
                response;
                that.isBusy = false;
                that.$parent.close();
                that.$emit('toPermissions');
                that.$buefy.snackbar.open({
                    message: 'A new permission has been added!',
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
            });
        }
    }
}
</script>