<template>
<div>
<div class="nav-background is-page">
    <div class="page-header-container">
        <div class="columns has-text-white">
            <div class="column" style="padding-left:20px;">
                <table>
                    <tr>
                        <td style="padding:10px 10px 0px 30px;"><feather type="file-text" size="30" class="m-r-15" style="margin-bottom: -8px"></feather></td>
                        <td><span class="is-size-5" style="font-weight: bold">Certificates</span>
                            <i class="is-size-7" style="display: block; margin-top: -3px;">View all certificate status and pending approvals</i></td>
                    </tr>
                </table>
            </div>
            <div class="column">
                <div class="buttons are-small is-pulled-right" style="margin-top: 10px;">
                    <button class="button is-success" v-if="$parent.canDo('create-certificates')"
                        @click="certificateModal()">
                        <feather class="icon" type="plus" size="20"></feather> 
                        <span> New Certificate</span>
                    </button>
                    <button class="button is-info" v-if="$parent.canDo('create-clients')"
                        @click="clientModal()">
                        <feather class="icon" type="plus" size="20"></feather>
                        <span> New Client</span>
                    </button>
                    <button class="button is-primary" v-if="$parent.canDo('create-recipients')"
                        @click="recipientModal()">
                        <feather class="icon" type="user-plus" size="20"></feather>
                        <span> New Recipient</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="container">
    <router-view name="pageContent"
        ref="pageContent"
        :hash="hash"
        :data="tableData"
        :isBusy="isBusy"
        :fetch="fetchData"
        @canDo="canDo"
        @confirmApproval="confirmApproval"></router-view>
    <b-loading :is-full-page="false" style="min-height: 350px" :active.sync="isBusy" :can-cancel="false"></b-loading>
</div>
</div>

</template>

 <script>
 import http from '../../http_common';
 import AddCertificate from '../../components/modals/AddCertificate.vue'
 import AddClient from '../../components/modals/AddClient.vue'
 import AddRecipient from '../../components/modals/AddRecipient.vue'

    export default {
        props: ['prio', 'currentPath','account'],
        data() {
            const data = [];
            data;

            return {
                activeTab: 0,
                tabs: {
                    '' : 0,
                    '#pending' : 1
                },
                search_query: '',
                filters: {
                    id: '',
                    first_name: '',
                    last_name: '',
                    status: ''
                },
                pending: [],
                data: [],
                byPriority: [],
                loading: true,
                isBusy: true,
                status_message: null,
                isPaginated: true,
                isShowAll: false,
                isPaginationSimple: false,
                paginationPosition: 'bottom',
                defaultSortDirection: 'asc',
                sortIcon: 'chevron-up',
                sortIconSize: 'is-small',
                currentPage: 1,
                perPage: 10,
                states: {
                    low: false,
                    medium: false,
                    high: false
                },
                hash: null
            }
        },
        created() {
            this.hash = this.$route.hash.substring(1);

            this.fetchData();
        },
        computed: {
            tableData() {
                return this.currentPath.includes('pending') ? this.pending : this.data
            }
        },
        methods: {
            showTab(index) {
                let tab = this.$refs.tabs.$children[index].$el.attributes.href.value;
                location.hash = tab || ''
            },
            canDo(val) {
                return this.$parent.canDo(val);
            },
            fetchData() {
                http
                    .get('/certificates')
                    .then(response => {
                        this.data = response.data.rows;
                        
                        
                        // if(this.hash && this.hash != 'pending') {
                        //     this.states[this.hash] = true;
                        //     this.$refs.pageContent.changePrio(this.hash);
                        // }
                    });
                http
                    .get('/certificates/approvals/list')
                    .then(response => {
                        this.pending = response.data.rows;
                        this.isBusy = false;
                    });
            },
            confirmApproval(row, status) {
                let dialog = this.$buefy.dialog.confirm({
                    message: `
                    <i class="is-size-7" style="font-weight: light">This certificate will be ${status}. Please confirm to proceed</i>
                    <br/>
                    <table class="confirm-table">
                        <tr>
                            <th>Domain: </th> 
                            <td>${row.Certificate.domain_name}</td>
                        </tr>
                        <tr>
                            <th>Client: </th>
                            <td>${row.Client.name}</td>
                        </tr>
                        <tr>
                            <th>Issuer: </th> 
                            <td>${row.Certificate.issuer}</td>
                        </tr>
                    </table>`,
                    cancelText: 'Close',
                    confirmText: status == 'approved' ? 'Confirm' : 'Reject',
                    type: status == 'approved' ? 'is-success' : 'is-danger',
                    icon: status == 'approved' ? 'comment-question' : '',
                    iconPack: 'mdi',
                    hasIcon: true,
                    onConfirm: () => {
                        this.approvalSubmit(row, dialog, status);
                    }
                })
            },
            approvalSubmit(row, dialog,status) { 
                let that = this;
                var checkStatus = status =='approved' ? 2 : 3;

                http.post('/certificates/approvals/update',{
                    status: checkStatus,
                    ids : [row.id]
                })
                .then(function (response) {
                    response;
                    dialog.close();
                    
                    that.$buefy.snackbar.open({
                        message: 'The certificate has been ' + status + ' now.',
                        type: 'is-success',
                        position: 'is-bottom-right'
                    })
                    that.fetchData();
                })
                .catch(function (error) {
                    that.output = error;
                    let e = error.response;

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
            },
            certificateModal() {
                this.$buefy.modal.open({
                    parent: this,
                    component: AddCertificate,
                    hasModalCard: true,
                    customClass: 'custom-class custom-class-2',
                    canCancel: ['x'],
                    props:{
                        account: this.account
                    },
                    events: {
                        'toPending': (value) => {
                            value;
                            this.fetchData();
                        }
                    }
                })
            },
            clientModal() {
                this.$buefy.modal.open({
                    parent: this,
                    component: AddClient,
                    hasModalCard: true,
                    customClass: 'custom-class custom-class-2',
                    canCancel: ['x']
                })
            },
            recipientModal() {
                this.$buefy.modal.open({
                    parent: this,
                    component: AddRecipient,
                    hasModalCard: true,
                    customClass: 'custom-class custom-class-2',
                    canCancel: ['x']
                })
            }
        }
    }
</script>

<style scoped lang="scss">
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