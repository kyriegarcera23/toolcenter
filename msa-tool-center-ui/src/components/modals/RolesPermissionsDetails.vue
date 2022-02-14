<template>
    <form @submit="formSubmit">
        <div class="modal-card" style="width: 400px; overflow: visible;">
            <header class="modal-card-head has-background-success">
                <p class="modal-card-title has-text-white is-size-5">{{ role }}'s Permissions</p>
            </header>
            <section class="modal-card-body custom">

                <div class="field" v-for="permission in permissions" v-bind:key="permission.id">
                    <b-checkbox v-model="permissionsGroup"
                        :native-value="permission.id">
                        {{ permission.display_name }}
                    </b-checkbox>
                </div>
                <p class="content">
                    <b>Selection:</b>
                    {{ permissionsGroup }}
                </p>
                
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
    props: ['permissions', 'role'],
    data() {
        return {
            permissionsGroup: [],
            isBusy: false
        }
    },
    created() {
    },
    methods: {
        formSubmit(e) {
            e.preventDefault();
            
            this.isBusy = true;
            let that = this;

            http.post('/api/certificates', {
                domain_name: this.domain_name,
                client_name: this.client.name,
                client_id: this.client.client_id,
                add_type: this.add_type,
                valid_from: this.valid_from,
                valid_to: this.valid_to,
                issuer: this.issuer
            })
            .then(function (response) {
                that.isBusy = false;
                that.$parent.close();
                that.$emit('toPending', response.data, { name: that.client.name, client_id : that.client.client_id});
                that.$buefy.snackbar.open({
                    message: response.data.message,
                    type: 'is-success',
                    position: 'is-bottom-right'
                })
            })
            .catch(function (error) {
                that.output = error;
            });
        }
    }
}
</script>