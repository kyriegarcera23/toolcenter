<template>
    <section>

        <div class="column is-12 advisory-left-container">
            <div class="has-text-centered" style="margin: 15px auto; font-size: 15px; font-family: Gotham Medium;">COMPLETED ADVISORIES</div>
            <div class="control has-icons-left m-b-10 is-fullwidth" style="margin: 0px 30px 0px 30px">
                <input class="input" type="text" v-model="search_query" placeholder="Search by location ..">
                <span class="icon is-small is-left">
                    <feather type="search" size="20"></feather>
                </span>
            </div>

            <div class="advisory-list-container">
                <div class="advisory-container" style="margin: auto;">

                    <p class="menu-label p-b-10" style="border-bottom: 1px solid #dadada">SCHEDULED ACTIVITIES</p>
                    
                    <article class="is-4 media advisory-item" style="width: 100%" v-for="s in filteredScheduled" :key="s.id" @click="viewAdvisory(s.advisory)">
                        <figure class="media-left">
                            <div class="advisory-icon" :class="`advisory-${s.advisory.type}`">
                                <feather type="watch" size="30" style="margin-bottom: -8px"></feather>
                            </div>
                        </figure>
                        <div class="media-content advisory-content">
                            <div class="content">
                                <p style="line-height: 1.1; margin-bottom: 0; padding-top: 10px; padding-right: 20px; font-family: Segoe UI;">
                                    <strong class="is-size-6">{{ s.advisory.location.name }} - {{ s.advisory.site.name }}</strong>
                                    <br><span class="is-size-8">{{ s.advisory.header.a }} | {{ s.advisory.business_impact }}</span>
                                    <br><span class="is-size-8">{{ s.advisory.advisory_data.activity_description }}</span>
                                    
                                    <br><span class="is-size-9 is-italic">Comlpeted on: {{ $moment(s.advisory.approved_at).format('MMM DD, YYYY') }}</span>
                                    <b-tag type="is-gray is-size-8 is-pulled-right" style="margin-top: -5px;">{{ s.advisory.header.b }}</b-tag>
                                </p>
                                
                            </div>
                        </div>
                    </article>

                    <p class="menu-label m-t-30 p-b-10" style="border-bottom: 1px solid #dadada">SERVICE OUTAGES</p>

                    <article class="is-4 media advisory-item" style="width: 100%" v-for="o in filteredOutages" :key="o.id" @click="viewAdvisory(o.advisory)">
                        <figure class="media-left">
                            <div class="advisory-icon" :class="`advisory-${o.advisory.type}`">
                                <feather type="wifi" size="30" style="margin-bottom: -8px"></feather>
                            </div>
                        </figure>
                        <div class="media-content advisory-content">
                            <div class="content">
                                <p style="line-height: 1.1; margin-bottom: 0; padding-top: 10px; padding-right: 20px; font-family: Segoe UI;">
                                    <strong class="is-size-6" v-if="o.advisory.areas.length">{{ o.advisory.location.name }} - {{ o.advisory.advisory_data.affected_site[2].join(', ')}}</strong>
                                    <strong class="is-size-6" v-else>{{ o.advisory.location.name }} - {{ o.advisory.site.name }}</strong>
                                    <br><span class="is-size-8">{{ o.advisory.header.a }} | {{ o.advisory.business_impact }}</span>
                                    <br><span class="is-size-8">{{ o.advisory.header.b }}</span>
                                    <br><span class="is-size-9 is-italic">Completed on: {{ $moment(o.started_at).format('MMM D, YYYY h:mm A') }}</span>
                                    <b-tag type="is-gray is-size-8 is-pulled-right" style="margin-top: -5px" v-if="!o.advisory.header.b.includes('Internet, Applications')">{{ o.advisory.header.c }}</b-tag>
                                </p>
                                
                            </div>
                        </div>
                    </article>

                    
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import http from '../../../http_common';
export default {
    props: ['data', 'isBusy'],
    data() {
        return {
            search_query: null,
            scheduled: [],
            outages: []
        }
    },
    created() {
        this.fetchAdvisories()
    },
    watch: {
    },
    computed: {
        filteredScheduled() {
            if(!this.search_query){
                return this.scheduled;
            }else{
                let search_query = this.search_query.replace(/^\s+|\s+$/gm,'').toLowerCase();
                let filtered = null;
                let prio = null;
                prio;
                filtered = this.scheduled.filter(
                    data => (data.advisory.header.b.toLowerCase().includes(search_query)) || 
                    (data.advisory.header.a.toLowerCase().includes(search_query)) ||
                    (data.advisory.category.toLowerCase().includes(search_query)) ||
                    (data.advisory.type.toLowerCase().includes(search_query)) ||
                    (data.advisory.business_impact.toLowerCase().includes(search_query)) ||
                    (data.advisory.location.name.toLowerCase().includes(search_query)) ||
                    (data.advisory.site.name.toLowerCase().includes(search_query))
                    /*((data.priority == 'Low' && this.showLow ? true : false) ||
                    (data.priority == 'Medium' && this.showMedium ? true : false) ||
                    (data.priority == 'High' && this.showHigh ? true : false)
                    )*/
                );
                //console.log(filtered)
                return filtered;
            }
        },
        filteredOutages() {
            if(!this.search_query){
                return this.outages;
            }else{
                let search_query = this.search_query.replace(/^\s+|\s+$/gm,'').toLowerCase();
                let filtered = null;
                let prio = null;
                prio;
                filtered = this.outages.filter(
                    data => (data.advisory.header.b.toLowerCase().includes(search_query)) ||
                    (data.advisory.header.a.toLowerCase().includes(search_query)) || 
                    (data.advisory.category.toLowerCase().includes(search_query)) ||
                    (data.advisory.type.toLowerCase().includes(search_query)) ||
                    (data.advisory.business_impact.toLowerCase().includes(search_query)) ||
                    ((data.advisory.header.c || '').toLowerCase().includes(search_query)) ||
                    (data.advisory.location.name.toLowerCase().includes(search_query)) ||
                    (data.advisory.site.name.toLowerCase().includes(search_query))
                    /*((data.priority == 'Low' && this.showLow ? true : false) ||
                    (data.priority == 'Medium' && this.showMedium ? true : false) ||
                    (data.priority == 'High' && this.showHigh ? true : false)
                    )*/
                );
                return filtered;
            }
        },
    },
    methods: {
        viewAdvisory(advisory) {
            this.$emit('viewAdvisory', advisory)
        },
        fetchAdvisories() {
            http.get('/advisories/list/completed/scheduled')
            .then(response => {
                this.scheduled = response.data;
                this.isBusy = false;
                
            });
            http.get('/advisories/list/completed/outage')
            .then(response => {
                this.outages = response.data;
                this.isBusy = false;
            });
        },
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
    margin: 10px auto;
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
    