<template>
    <section>

        <div class="column is-12 advisory-left-container">
            <div class="has-text-centered" style="margin: 15px auto; font-size: 15px; font-family: Gotham Medium;">PENDING APPROVAL</div>
            <div class="control has-icons-left m-b-10 is-fullwidth" style="margin: 0px 30px 0px 30px">
                <input class="input" type="text" v-model="search_query" placeholder="Search by client ..">
                <span class="icon is-small is-left">
                    <feather type="search" size="20"></feather>
                </span>
            </div>

            <div class="advisory-list-container">
                <div class="advisory-container" style="margin: auto;" >
                    <span v-if="pending.length">
                    <article class="is-4 media advisory-item" @click="openApprove(p)"  style="width: 100%" v-for="p in filteredPending" :key="p.id">

                        <figure class="media-left">
                            <div class="advisory-icon" :class="`advisory-${p.type}`">
                                <feather :type="p.category == 'outage' ? 'wifi-off' : 'watch'" size="30" style="margin-bottom: -8px"></feather>
                            </div>
                        </figure>
                        <div class="media-content advisory-content">
                            <div class="content" v-if="p.category == 'outage'">
                                <p style="line-height: 1.1; margin-bottom: 0; padding-top: 10px; padding-right: 20px; font-family: Segoe UI;">
                                    <strong class="is-size-6" v-if="p.areas">{{ p.location.name }} - {{ p.advisory_data.affected_site[2].join(', ')}}</strong>
                                    <strong class="is-size-6" v-else>{{ p.location.name }} - {{ p.site.name }}</strong>
                                    <br><span class="is-size-8">{{ p.header.a }} | {{ p.business_impact }}</span>
                                    <br><span class="is-size-8">{{ p.header.b }}</span>
                                    <br><span class="is-size-9 is-italic">Created on : {{$moment(p.createdat).format('MMM D, YYYY h:mm A')}} |  {{ p.created_by }}</span>
                                    <b-tag type="is-gray is-size-8 is-pulled-right" style="margin-top: -5px" v-if="!p.header.b.includes('Internet, Applications')">{{ p.header.c }}</b-tag>
                                </p>
                                <!-- Created on: {{ $moment(p.started_at).format('MMM D, YYYY h:mm A') }} -->
                            </div>

                            <div class="content" v-else>
                                <p style="line-height: 1.1; margin-bottom: 0; padding-top: 10px; padding-right: 20px; font-family: Segoe UI;">
                                    <strong class="is-size-6">{{ p.location.name }}</strong>
                                    <br><span class="is-size-8">{{ p.header.a }} | {{ p.business_impact }}</span>
                                    <br><span class="is-size-8">{{ p.advisory_data.activity_description }}</span>
                                    <br><span class="is-size-9 is-italic">Created on : {{$moment(p.createdat).format('MMM D, YYYY h:mm A')}} |  {{ p.created_by }}</span>
                                    <b-tag type="is-gray is-size-8 is-pulled-right" style="margin-top: -5px">{{ p.header.b }}</b-tag>
                                    
                                </p>
                                <!-- {{ $moment(p.createdAt).format('MMMM D, YYYY h:mm A') }} -->
                               
                                
                            </div>
                        </div>
                        
                    </article>
                    </span>
                    <span class="has-text-centered" v-else>
                        <p class="menu-label m-t-50 p-b-10">Nothing to show</p>
                    </span>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import http from '../../../http_common';
import ApproveAdvisory from '../../../components/forms/advisory/ApproveAdvisory'
export default {
    props: ['data', 'isBusy'],
    data() {
        return {
            pending: [],
            search_query: null,
        }
    },
    created() {
        this.fetchPending()
    },
    watch: {
    },
    computed: {
        filteredPending(){
            if(!this.search_query){
                return this.pending;
            }else{
                let search_query = this.search_query.replace(/^\s+|\s+$/gm,'').toLowerCase();
                let filtered = null;
                let prio = null;
                prio;
                filtered = this.pending.filter(
                    data => (data.location.name.toLowerCase().includes(search_query))
                    /*((data.priority == 'Low' && this.showLow ? true : false) ||
                    (data.priority == 'Medium' && this.showMedium ? true : false) ||
                    (data.priority == 'High' && this.showHigh ? true : false)
                    )*/
                );
                //console.log(filtered)
                return filtered;

            }

        },
    },
    methods: {
        fetchPending() {
            http.get('/advisories/list/pending/all')
            .then(response => {
                this.pending = response.data;
                //console.log(this.pending)
                this.isBusy = false;
            });
        },
        
        openApprove(data) {
            this.$buefy.modal.open({
                parent: this,
                component: ApproveAdvisory,
                hasModalCard: false,
                props: {
                    data: data
                },
                canCancel: ['x'],
                customClass: 'custom-class custom-class-2',
                onCancel: function () {
                },
                events: {
                    'refresh': (value) => {
                        value;
                        this.fetchPending();

                    }
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>

.advisory-list-container {
    padding: 10px 30px;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: #43727b;
    }
}

.advisory-item {
    height: 90px;
    width: 100%;
    margin: 10px auto 15px auto;
    border-radius: 10px;
    background-color: #fff;
    border-top: 0px;
    box-shadow: 0px 3px 6px #2c28281c;
    
    &.media {
        padding-top: 0;
    }

    .advisory-icon {
        background-color: #BADC58;
        border-radius: 5px 0 0 5px;
        width: 90px !important;
        flex: none;
        color: white;
        padding: 31px;

        &.advisory-initial {
            background-color: #F9CA24;
        }

        &.advisory-update {
            background-color: #22A6B3;
        }

        &.advisory-cancellation {
            background-color: #F53C56;
        }
    }

    .advisory-content {
        border-radius: 0 5px 5px 0;
    }

    &:last-child {
        margin-bottom: 20px;
    }
}

.advisory-header {
    box-shadow: 0px 3px 6px #2c28281c;
    border-radius: 10px;

    .new-advisory-button {
        font-size: 12px;
        font-weight: bold;
        color: #172b4d;
        height: 42px;
        border-radius: 0 0 10px 10px;
        border: 0px;
        margin-top: -6px;
        text-align: right;
        width: 100%;
        align-items: center;
        justify-content: flex-end;
    }
}

.is-size-8 {
    font-size: 0.70rem
}

.is-size-9 {
    font-size: 0.65rem
}
</style>
    