<template>
<div style="overflow: visible; width: auto; height: 660px; max-height: 785px">    
    <section>
        <p class="has-text-centered has-text-white is-italic is-size-7 m-b-20">Please review and confirm all details below</p>
        <div style="height: 540px; width: 960px;">
            <new-scheduled-template :data="{ ...data }" :margin_left="'0px'" :title="data.header.a" :type="data.type"/>
        </div>

        <div class="buttons is-pulled-right m-t-20">
            <b-button type="is-danger" :loading="isBusyFalse" @click="getPng('reject')">Reject</b-button>
            <b-button type="is-success" :loading="isBusy" @click="getPng('approved')">Approve</b-button>
        </div>
    </section>
</div>
</template>

<script>
import http from '../../../http_common';
import domtoimage from 'dom-to-image'
import newScheduledTemplate from '../../templates/advisory/New'

export default {
    props: ['data', 'batch_id', 'active_client', 'category', 'title', 'type', 'locations'],
    components: {
        newScheduledTemplate
    },
    data() {
        return {
            isBusy: false,
            isBusyFalse: false,
            image: null,
        }
    },
    watch: {
        actions_taken: {
            deep: true,
            handler: function(newVal, oldVal) {  
                oldVal;
                this.data.advisory_data.actions_taken = newVal
            }
        }
    },
    created() {

    },
    computed: {
    },
    methods: {
        dateFormat(date) {
            return this.$moment(date).format('MMMM DD, YYYY');
        },
        getPng(value) {
            this.isBusy = true
            var node = document.getElementById('advisory-template')
            let that = this

            domtoimage.toBlob(node, {
                width: node.clientWidth * 1,
                height: node.clientHeight * 1,
                style: {
                    'transform': 'scale(1)',
                    'transform-origin': 'top left' 
                }
            })
            .then(function (blob) {
                let reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function() {
                    let base64 = reader.result;
                    base64;
                    if (value =='approved')
                        that.submit(base64);
                    else{
                        that.reject(base64)
                    }
                }
            })
            .catch(function (error) {
                console.error('Oops, something went wrong!', error);
            });
        },
        reject(base64) {

            const payload = {
                "base64_string_image": base64,
                "id": this.data.id,
                "action": "rejected"
            }


            let that = this;
            http.post('/advisories/approve/',payload)
            .then(function (response) {
                //console.log(response)
                that.isBusyFalse = false;

                that.$parent.close();
                that.$emit('refresh');

                that.$buefy.snackbar.open({
                    message: response.data.message,
                    type: 'is-success',
                    position: 'is-bottom-right'
                })
            })
            .catch(function (error) {
                //console.log(error)
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
            })
        
        },
        submit(b64) {
            this.isBusy = true;
            let that = this;
            
            const payload = {
                "base64_string_image": b64,
                "id": this.data.id,
                "action": "approved"
            }

            
            http.post('/advisories/approve',payload)
            .then(function (response) {
                that.isBusy = false;

                that.$parent.close();
                that.$emit('refresh');

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
                that.isBusy = false;
            })
        
        }
    }
}
</script>
<style lang="scss">
.actions-checkbox {
    .b-checkbox.checkbox {
        width: 100%;
        margin-bottom: 5px;
        align-items: end;
    }
}
</style>

<style lang="scss" scoped>

.dropdown-box {
    text-align: left;
    div, button {
        width: 350px;

        .icon {
            display: flex;
            flex: auto;
            justify-content: flex-end;
        }
    }
}
</style>