<template>
    <section>

        <div class="columns is-marginless has-text-centered">
            
            <div class="column is-4 is-offset-1 has-text-centered" style="min-width: fit-content;">
                <div class="advisory-header" style="max-width: 400px; margin: auto;">
                    <scheduled-activity-image :width="'100%'"/>
                    <button class="button new-advisory-button text-right" @click="openForm('scheduled', 'initial')">
                        <span>NEW SCHEDULED ACTIVITY</span>
                        <feather type="chevron-right" size="16" style="margin-top: -2px; margin-left: 20px;"></feather>
                    </button>
                </div>
                
                <div style="font-size: 0.85rem; padding: 20px 30px 5px 30px; color: #8898AA; font-family: Segoe UI Semibold;">ONGOING SCHEDULED ACTIVITIES</div>

                <div class="advisory-container" style="margin: auto;">
                    <span v-if="scheduled.length">
                        <article class="is-4 media advisory-item" style="width: 100%" v-for="s in scheduled" :key="s.id">
                            
                            <figure class="media-left" @click="viewAdvisory(s.advisory)">
                                <div class="advisory-icon" :class="`advisory-${s.advisory.type}`">
                                    <feather type="watch" size="30" style="margin-bottom: -8px"></feather>
                                </div>
                            </figure>
                            <div class="media-content advisory-content" @click="viewAdvisory(s.advisory)">
                                <div class="content">
                                    <p style="line-height: 1.1; margin-bottom: 0; padding-top: 10px; font-family: Segoe UI;">
                                        <strong class="is-size-6">{{ s.advisory.location.name }}</strong>
                                        <br><span class="is-size-8">{{ s.advisory.header.a }} | {{ s.advisory.business_impact }}</span>
                                        <br><span class="is-size-8">{{ s.advisory.advisory_data.activity_description }}</span>
                                        <br><span class="is-size-9 is-italic">Created on: {{ $moment(s.advisory.createdAt).format('MMM D, YYYY h:mm A') }}</span>
                                        <b-tag type="is-gray is-size-8 is-pulled-right" style="margin-right: -30px;">{{ s.advisory.header.b }}</b-tag>
                                    </p>
                                    
                                </div>
                            </div>
                            <div class="media-right" style="margin-left: 0px; padding: 10px;">
                                <!-- <button class="delete"></button> -->
                                <b-dropdown aria-role="list" position="is-bottom-left" v-if="s.advisory.approved_at">
                                    <b-button class="more-button has-text-grey" type="is-white" size="is-small" slot="trigger">
                                        <feather type="more-vertical" size="16" style="margin-bottom: -4px"></feather>
                                    </b-button>

                                    <b-dropdown-item aria-role="listitem" class="is-size-7 has-text-success" @click="openForm('scheduled', 'completion', s.id, s.advisory)">Create Completion</b-dropdown-item>
                                    <b-dropdown-item aria-role="listitem" class="is-size-7 has-text-danger" @click="openForm('scheduled', 'cancellation', s.id, s.advisory)">Cancel Activity</b-dropdown-item>
                                </b-dropdown>

                                <b-button v-else class="more-button has-text-danger" type="is-white" size="is-small" slot="trigger">
                                    <b-tooltip label="Not yet Approved" position="is-left" size="is-small" type="is-danger">
                                        <feather type="alert-octagon" size="16" style="margin-top: 4px"></feather>
                                    </b-tooltip>
                                </b-button>
                            </div>
                        </article>

                    </span>
                    <span class="has-text-centered" v-else>
                        <p class="menu-label m-t-50 p-b-10">Nothing to show</p>
                    </span>
                </div>
            </div>

            <div class="column is-4 is-offset-1 has-text-centered" style="min-width: fit-content;">
                <div class="advisory-header" style="max-width: 400px; margin: auto;">
                    <unplanned-outage-image :width="'100%'"/>
                    <button class="button new-advisory-button text-right" @click="openForm('outage', 'initial')">
                        <span>NEW OUTAGE ADVISORY</span>
                        <feather type="chevron-right" size="16" style="margin-top: -2px; margin-left: 20px;"></feather>
                    </button>
                </div>

                <div style="font-size: 0.85rem; padding: 20px 30px 5px 30px; color: #8898AA; font-family: Segoe UI Semibold;">ONGOING OUTAGES</div>

                <div class="advisory-container" style="margin: auto;">
                    <span v-if="outages.length">
                        <article class="is-4 media advisory-item" style="width: 100%" v-for="o in outages" :key="o.id">
                            <figure class="media-left" @click="viewAdvisory(o.advisory)">
                                <div class="advisory-icon" :class="`advisory-${o.advisory.type}`">
                                    <feather type="wifi-off" size="30" style="margin-bottom: -8px"></feather>
                                </div>
                            </figure>
                            <div class="media-content advisory-content" @click="viewAdvisory(o.advisory)">
                                <div class="content">
                                    <p style="line-height: 1.1; margin-bottom: 0; padding-top: 10px; font-family: Segoe UI;">
                                        <strong class="is-size-6" v-if="o.advisory.areas">{{ (`${o.advisory.location.name } - ${ o.advisory.advisory_data.affected_site[2].join(', ')}`) | truncate(30, '...') }}</strong>
                                        <strong class="is-size-7" v-else>{{ o.advisory.location.name }} - {{ o.advisory.site.name }}</strong>
                                        <br><span class="is-size-8">{{ o.advisory.header.a }} | {{ o.advisory.business_impact }}</span>
                                        <br><span class="is-size-8">{{ o.advisory.header.b }}</span>
                                        <br><span class="is-size-9 is-italic">Created on: {{ $moment(o.advisory.createdAt).format('MMM D, YYYY h:mm A') }}</span>
                                        <b-tag type="is-gray is-size-8 is-pulled-right" style="margin-right: -30px;" v-if="!o.advisory.header.b.includes('Internet, Applications')">{{ o.advisory.header.c }}</b-tag>
                                    </p>
                                    
                                </div>
                            </div>
                            <div class="media-right" style="margin-left: 0px; padding: 10px;">
                                <!-- <button class="delete"></button> -->
                                <b-dropdown aria-role="list" position="is-bottom-left" v-if="o.advisory.approved_at">
                                    <b-button class="more-button has-text-grey" type="is-white" size="is-small" slot="trigger">
                                        <feather type="more-vertical" size="16" style="margin-bottom: -4px"></feather>
                                    </b-button>

                                    <b-dropdown-item aria-role="listitem" class="is-size-7 has-text-info" @click="openForm('outage', 'update', o.id, o.advisory)">Create Update</b-dropdown-item>
                                    <b-dropdown-item aria-role="listitem" class="is-size-7 has-text-success" @click="openForm('outage', 'completion', o.id, o.advisory)">Create Restoration</b-dropdown-item>
                                </b-dropdown>

                                
                                <b-button v-else class="more-button has-text-danger" type="is-white" size="is-small" slot="trigger">
                                    <b-tooltip label="Not yet Approved" position="is-left" size="is-small" type="is-danger">
                                        <feather type="alert-octagon" size="16" style="margin-top: 4px"></feather>
                                    </b-tooltip>
                                </b-button>
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
import ScheduledActivityImage from '../../../components/Svg/ScheduledActivityImage'
import UnplannedOutageImage from '../../../components/Svg/UnplannedOutageImage'
export default {
    props: ['isBusy', 'active_client', 'outages', 'scheduled'],
    data() {
        return {
            search_query: null,
            data: []
        }
    },
    components: {
        "scheduled-activity-image": ScheduledActivityImage,
        "unplanned-outage-image": UnplannedOutageImage
    },
    created() {
        this.$emit('fetchScheduled');
        this.$emit('fetchOutages');
    },
    filters: {
        truncate: function (text, length, suffix) {
            return text.substring(0, length) + suffix;
        },
    },
    watch: {
    },
    computed: {
        filtered () {
            if(!this.search_query){
                return this.data;
            }else{
                let search_query = this.search_query.replace(/^\s+|\s+$/gm,'').toLowerCase();
                let filtered = null;
                let prio = null;
                prio;
                filtered = this.data.filter(
                    ad => (ad.user.name.toLowerCase().includes(search_query))
                    

                );
                return filtered;
            }
        },
    },
    methods: {
        viewAdvisory(advisory) {
            this.$emit('viewAdvisory', advisory)
        },
        openForm(category, type, batch = null, data = {}) {
            this.$emit('openAdvisoryForm', [category, type, batch, data])
        },
        viewClientAdvisories(code) {
            this.$emit('setBusy', true);

            this.$axios
            .get('/api/advisory?client=EDC')
            .then(response => {
                this[code] = response.data.data
                this.$emit('setBusy', false);
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.advisory-left-container {
    background-color: #1A4D57;
    margin: -30px;
}

.advisory-list-container {
    //height: calc(100vh - 244px);
    padding: 10px 30px;
    //overflow: auto;

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