<template>
<div>
    <div class="nav-background is-dashboard"  >
        <div class="page-header-container">
            <div class="columns has-text-white">
                <div class="column" style="padding-left:20px;">
                    <table>
                        <tr>
                            <td style="padding:10px 10px 0px 30px;"><pulse class="iconProps"></pulse></td>
                            <td><span class="is-size-5" style="font-weight: bold">Daily Digest</span>
                            <i class="is-size-7" style="display: block; margin-top: -3px;">Generate and view all daily digests</i></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="container"  style="margin: 0 auto 0 auto;">
        <router-view ref="digestChild" @viewDigest="viewDigest" @addDigest="addDigest" ></router-view>
    </div>
</div>

</template>


<script>

import EWBForm from '../forms/EWBForm.vue'
import ILForm from '../forms/ILForm.vue'
import BOCForm from '../forms/BOCForm.vue'
import DBPForm from '../forms/DBPForm.vue'
import UBPForm from '../forms/UBPForm.vue'
export default {
    props: ['account'],
    data() {
        return {
          clients_form: {
                'EWB' : EWBForm,
                'IL': ILForm,
                'UBP': UBPForm,
                'BOC': BOCForm,
                'DBP' : DBPForm
              }
          }
    },
    methods: {
      viewDigest(row) {
            this.$buefy.modal.open(
                `<p class="image">
                    <img src="${row.base64_string_image}">
                </p>`
            );
        },
        addDigest(client) {
                let that = this;
                this.$buefy.modal.open({
                    parent: this,
                    component: this.clients_form[client],
                    hasModalCard: true,
                    fullScreen: false,
                    canCancel:['x'],
                    props: {
                        data: client,
                        user: this.account.User
                    },
                    customClass: `${client.toLowerCase()}-add-digest`,
                    onCancel: function () {
                        //console.log('cancel')
                    },
                    events: {
                        'create-digest': (value) => {
                            that.$refs.digestChild.loadDigestData(value)
                            
                            

                        }
                    }
                })
            },
    }
}
</script>


<style scoped>
.nav-background {
  background-color: #003944;
  z-index: -1;
  -webkit-transition: all 200ms ease-in;
  transition: all 200ms ease-in;
  margin: -60px -30px -30px -30px;
}

.nav-background.is-dashboard {
  height: 115px;
}

.nav-background.is-dashboard ~ .container {
  margin-top: -80px;
}

.nav-background.is-dashboard .page-header-container {
  padding: 50px 30px 10px 30px;
  height: 50px;
}

.nav-background.is-page {
  height: 120px;
  margin-bottom: 30px;
}

.nav-background.is-page .page-header-container {
  padding: 55px 30px 10px 30px;
  height: 120px;
}
</style>