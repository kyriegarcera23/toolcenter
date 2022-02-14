<template>
<section>
    <div v-show="!isShowDigest">
        <div class="columns">
            <div class="column is-7">
                <b-field>
                    <p class="control">
                        <span class="button is-static">Last Fine Tuning Update</span>
                    </p>
                    <b-datepicker
                        placeholder="Select a date..."
                        icon="calendar-today"
                        :date-formatter="dateFormat"
                        v-model="last_fine_tuning"
                        expanded>
                    </b-datepicker>
                </b-field>
                
                <article class="message has-shadow">
                    <div class="message-header has-text-weight-normal is-static">
                        <p>Incident Tickets</p>
                    </div>
                    <div class="message-body is-paddingless">
                        <b-field>
                            <b-input type="textarea"
                                v-model="incident_tickets"
                                minlength="10"
                                maxlength="260"
                                rows="3"
                                placeholder="Type something..."
                                class="only-bottom-border-radius"
                                :has-counter="false"
                                expanded>
                            </b-input>
                        </b-field>
                    </div>
                </article>

                <article class="message has-shadow">
                    <div class="message-header has-text-weight-normal is-static">
                        <p>Malware Domain Match</p>
                    </div>
                    <div class="message-body is-paddingless">
                        <b-field>
                            <b-input type="textarea"
                                v-model="malware_domain_match"
                                minlength="10"
                                maxlength="100"
                                rows="2"
                                placeholder="Type something..."
                                class="only-bottom-border-radius"
                                :has-counter="false"
                                expanded>
                            </b-input>
                        </b-field>
                    </div>
                </article>

                <article class="message has-shadow">
                    <div class="message-header has-text-weight-normal is-static">
                        <p>Data Source Health Check</p>
                    </div>
                    <div class="message-body is-paddingless">
                        <b-field>
                            <b-input type="textarea"
                                v-model="data_source_health_check"
                                minlength="10"
                                maxlength="100"
                                rows="2"
                                placeholder="Type something..."
                                class="only-bottom-border-radius"
                                :has-counter="false"
                                expanded>
                            </b-input>
                        </b-field>
                    </div>
                </article>
            </div>
            <div class="column is-5">
                <b-field>
                    <p class="control">
                        <span style="width: 165px;" class="button is-static">Events Per Second</span>
                    </p>
                    <b-input type="number" min="0" placeholder="Enter a number..." v-model="events_per_second" expanded></b-input>
                </b-field>
                <b-field>
                    <p class="control">
                        <span style="width: 165px;" class="button is-static">Incident Raised</span>
                    </p>
                    <b-input type="number" min="0" placeholder="Enter a number..." v-model="incident_raised" expanded></b-input>
                </b-field>

                <p class="menu-label m-t-30">TICKETS</p>

                <b-field>
                    <p class="control">
                        <span style="width: 100px;" class="button has-background-p1">P1</span>
                    </p>
                    <b-numberinput v-model="p1" type="is-default" min="0" placeholder="0" controls-position="compact" expanded></b-numberinput>
                </b-field>

                <b-field>
                    <p class="control">
                        <span style="width: 100px;" class="button has-background-p2">P2</span>
                    </p>
                    <b-numberinput v-model="p2" type="is-default" min="0" placeholder="0" controls-position="compact" expanded></b-numberinput>
                </b-field>

                <b-field>
                    <p class="control">
                        <span style="width: 100px;" class="button has-background-p3">P3</span>
                    </p>
                    <b-numberinput v-model="p3" type="is-default" min="0" placeholder="0" controls-position="compact" expanded></b-numberinput>
                </b-field>

                <b-field>
                    <p class="control">
                        <span style="width: 100px;" class="button has-background-p4">P4</span>
                    </p>
                    <b-numberinput v-model="p4" type="is-default" min="0" placeholder="0" controls-position="compact" expanded></b-numberinput>
                </b-field>

                <p class="menu-label m-t-30">SLA PERCENTAGE</p>

                <b-field grouped>
                    <b-field expanded>
                        <b-slider v-model="sla" class="is-marginless sla-slider" type="is-success" lazy :custom-formatter="sla => sla + '%'" ></b-slider>
                    </b-field>
                    <b-field>
                        <b-input style="width: 80px" v-model="sla" type="number" step="0.01" min="0" max="100"></b-input>
                        <p class="control">
                            <span class="button is-static">%</span>
                        </p>
                    </b-field>
                </b-field>
            </div>
        </div>

        <p class="menu-label m-t-20">TOP CORRELATION RULES</p>

        <div class="columns">
            <div class="column">
                <article class="message has-shadow">
                    <div class="message-header has-text-weight-normal is-paddingless p-l-15 is-static" style="margin: 0 -1px;">
                        <p>SIEM</p>
                        <b-button type="is-light" @click="siemCount++"><feather type="plus" size="15"></feather></b-button>
                    </div>
                    <div class="message-body has-background-white">
                        <transition-group name="fade" tag="div">
                            <b-field v-for="index in siemCount" :key="index" :id="'siem'+index">
                                <p class="control">
                                    <span style="width: 50px;" class="button is-static">{{ index }}</span>
                                </p>
                                <b-autocomplete
                                    v-model="siem[index]"
                                    :open-on-focus="true"
                                    :data="filteredSIEM"
                                    field="name"
                                    @select="option => siem[index] = option.name"
                                    clearable
                                    @focus="activeIndex = index"
                                    ref="siem"
                                    expanded>
                                    <template slot="empty">No results for {{ siem[index] }} <a @click="showAddRule('siem', index-1)" class="has-text-primary no-underline">Click here to add</a> </template>
                                </b-autocomplete>
                                <p class="control" v-show="index == siemCount && siemCount > 1" @click="removeEl(index, 'siem')">
                                    <b-button style="width: 50px;" class="has-light-border" type="is-light"><feather type="minus" size="15"></feather></b-button>
                                </p>
                            </b-field>
                        </transition-group>
                    </div>
                </article>
            </div>
            <div class="column">
                <article class="message has-shadow">
                    <div class="message-header has-text-weight-normal is-paddingless p-l-15 is-static" style="margin: 0 -1px;">
                        <p>RSA</p>
                        <b-button type="is-light" @click="rsaCount++"><feather type="plus" size="15"></feather></b-button>
                    </div>
                    <div class="message-body has-background-white">
                        <transition-group name="fade" tag="div">
                            <b-field v-for="index in rsaCount" :key="index" :id="'rsa'+index">
                                <p class="control">
                                    <span style="width: 50px;" class="button is-static">{{ index }}</span>
                                </p>
                                <b-autocomplete
                                    v-model="rsa[index]"
                                    :open-on-focus="true"
                                    :data="filteredRSA"
                                    field="name"
                                    @select="option => rsa[index] = option.name"
                                    clearable
                                    @focus="activeIndex = index"
                                    ref="siem"
                                    expanded>
                                    <template slot="empty">No results for {{ rsa[index] }} <a @click="showAddRule('rsa', index-1)" class="has-text-primary no-underline">Click here to add</a> </template>
                                </b-autocomplete>
                                <p class="control" v-show="index == rsaCount && rsaCount > 1" @click="removeEl(index, 'rsa')">
                                    <b-button style="width: 50px;" class="has-light-border" type="is-light"><feather type="minus" size="15"></feather></b-button>
                                </p>
                            </b-field>
                        </transition-group>
                    </div>
                </article>
            </div>
        </div>

        <p class="menu-label m-t-10">KILL CHAIN ATTACK STAGE</p>
        <div class="tile is-ancestor m-t-10">
            <div class="tile " style="padding: 5px;" v-for="kc in killchain" :key="kc.stage">
                <div class="has-shadow circle m-auto killchain-stage" style="height: 100px; width: 100%;">
                    <b-button class="is-size-4" :type="killchain_stage == kc.stage ? 'is-primary' : ''" @click="killchain_stage = kc.stage">{{ kc.stage }}
                        <div style="font-size: 0.65rem; letter-spacing: 1px;">{{ kc.title }}</div>
                    </b-button>
                </div>
            </div>
        </div>

        <div class="column has-text-centered">
            <p style="font-size: 0.65rem; letter-spacing: 1px;">{{ killchain_stage ? killchain[killchain_stage-1].description : "&nbsp;"}}</p>
        </div>
    </div>
    
    
    <transition name="fade">
        <div id="digest-template" v-show="isShowDigest" ref="digest-template">
            <svg-vue icon="ewb"></svg-vue>
        </div>
    </transition>
    
    <div class="column is-centered">
        <div class="m-auto" v-if="!isShowDigest">
            <b-button>Reset</b-button>
            <b-button type="is-dark" @click="toggleTemplate">Preview Digest</b-button>
        </div>
        <div class="m-auto" v-else>
            <b-button @click="toggleTemplate">Back to Form</b-button>
            <b-button type="is-primary" @click="getPng">Send Digest</b-button>
        </div>
    </div>
    
</section>
</template>

<script>
import domtoimage from 'dom-to-image'
import NewDigestEmail from '../../components/modals/NewDigestEmail'

export default {
    props: ['user'],
    data() {
        return {
            client: 'EWB',
            isEmailFormActive: false,
            last_fine_tuning: null,
            incident_tickets: null,
            malware_domain_match: null,
            data_source_health_check: null,
            events_per_second: null,
            incident_raised: null,
            siem: ["", "", ""],
            killchain_stage: null,
            killchain: [
                { stage: 1, title: "Reconnaissance", description: "Harvesting email, addresses, conference information, etc"},
                { stage: 2, title: "Weaponization", description: "Coupling exploit with backdoor into deliverable payload" },
                { stage: 3, title: "Delivery", description: "Delivering weaponized bundle to the victim via Email, Web, USB, Social Media, etc" },
                { stage: 4, title: "Exploitation", description: "Exploiting a vulnerability to execute code on victim's system" },
                { stage: 5, title: "Installation", description: "Installation of malware on the asset" },
                { stage: 6, title: "Command & Control", description: "Command channel for remote manipulation of victim" },
                { stage: 7, title: "Action on Objectives", description: "Having gained access, intruders accomplish their original goals" }
            ],
            data: {
                siem: [
                    {name: "Injection Activity Detected"},
                    {name: "Evasion Technique Detected"},
                    {name: "Malware Detected"}
                ],
                rsa: [
                    {name: "IP Feed"},
                    {name: "Email"}
                ],
            },
            rsa: ["", ""],
            activeIndex: 0,
            siemCount: 3,
            rsaCount: 3,
            sla: 50,
            isShowDigest: false,
            p1: null,
            p2: null,
            p3: null,
            p4: null,
            date: this.$moment().format("YYYYMMDD"),
            digest_date: this.$moment().format("MMM DD YYYY").toUpperCase(),
            image: null
        }
    },
    mounted() {
        this.$nextTick(function () {
            document.getElementById('digest-date').textContent = this.digest_date
        })
    },
    watch: {
        incident_tickets(val) {
            document.getElementById('incident-tickets').innerText = val || "."
        },
        malware_domain_match(val) {
            document.getElementById('malware-domain-match').innerText = val || "."
        },
        data_source_health_check(val) {
            document.getElementById('data-source-health-check').innerText = val || "."
        },
        last_fine_tuning(val) {
            document.getElementById('last-fine-tuning-update').textContent = this.dateFormat(val) || "&nbsp;"
        },
        events_per_second (val) {
            document.getElementById('events-per-second').innerText = Number(val).toLocaleString() || "0"
        },
        incident_raised (val) {
            document.getElementById('incident-raised').innerText = Number(val).toLocaleString() || "0"
        },
        sla(val) {
            document.getElementById('sla-percent').innerText = val || "0"
            document.getElementById('sla-circle').setAttribute('stroke-dashoffset', 408.2 - (408.2 * val / 100 ))
        },
        killchain_stage(val, oldVal) {
            if(oldVal) {
                document.getElementById('C' + oldVal).setAttribute('class', "killchain-inactive C" + oldVal)   
                document.getElementById('C' + oldVal + '_Text').setAttribute('class', "killchain-inactive-text C" + oldVal + "_Text")  
            }

            document.getElementById('C' + val).setAttribute('class', "")   
            document.getElementById('C' + val + '_Text').setAttribute('class', "")   
        },
        p1(val) {
            document.getElementById('p1-value').textContent = val || "0"
        },
        p2(val) {
            document.getElementById('p2-value').textContent = val || "0"
        },
        p3(val) {
            document.getElementById('p3-value').textContent = val || "0"
        },
        p4(val) {
            document.getElementById('p4-value').textContent = val || "0"
        }
    },
    computed: {
        filteredSIEM() {
            let text = this.siem[this.activeIndex] || ""
            return this.data.siem.filter((option) => {
                return option.name
                    .toString()
                    .toLowerCase()
                    .indexOf(text.toLowerCase()) >= 0
            })
        },
        filteredRSA() {
            let text = this.rsa[this.activeIndex] || ""
            return this.data.rsa.filter((option) => {
                return option.name
                    .toString()
                    .toLowerCase()
                    .indexOf(text.toLowerCase()) >= 0
            })
        }
    },
    methods: {
        dateFormat(date) {
            return this.$moment(date).format('MMMM DD, YYYY');
        },
        getPng() {
            var node = document.getElementById('digest-template')
            let that = this
            domtoimage.toPng(node, {
                width: node.clientWidth * 2,
                height: node.clientHeight * 2,
                style: {
                    'transform': 'scale(2)',
                    'transform-origin': 'top left' 
                }
            })
            .then(function (dataUrl) {
                var img = new Image();
                img.src = dataUrl;
                that.image = img
               that.showDigestEmailForm()
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
            });
        },
        showAddRule(type, index) {
            this.$buefy.dialog.prompt({
                message: `Correlation Rule`,
                inputAttrs: {
                    placeholder: 'Enter a New Rule...',
                    maxlength: 60,
                    value: this[type][this.activeIndex]
                },
                confirmText: 'Add',
                onConfirm: (value) => {
                    let hasDuplicates = this.data[type].some(function(currentObject) {
                        return currentObject.name.toLowerCase() == value.toLowerCase();
                    });

                    if(!hasDuplicates) {
                       this.data[type].push({name: value}) 
                    }else {
                        this.$buefy.snackbar.open({
                            message: `<b>${value}</b> already exists on the ${type.toUpperCase()} rules list`,
                            type: 'is-warning',
                            position: 'is-top'
                        })
                    }
                    
                    this.$refs[type][index].setSelected({name: value})
                }
            })
        },
        removeEl(index, type) {
            let el = document.getElementById(type+index);
            this[type][index] = ""
            type == 'siem' ? this.siemCount-- : this.rsaCount--
            el.remove()
        },
        toggleTemplate() {
            this.isShowDigest = !this.isShowDigest
        },
        showDigestEmailForm() {
            
            let data = {
                client: this.client,
                last_fine_tuning: this.last_fine_tuning,
                incident_tickets: this.incident_tickets,
                malware_domain_match: this.malware_domain_match,
                data_source_health_check: this.data_source_health_check,
                events_per_second: this.events_per_second,
                incident_raised: this.incident_raised,
                killchain_stage: this.killchain_stage,
                sla: 50,
                p1: this.p1,
                p2: this.p2,
                p3: this.p3,
                p4: this.p4,
                date: this.date,
                email: this.user.email,
                digest_date: this.digest_date,
                image: this.image
            }

            this.$buefy.modal.open({
                parent: this,
                component: NewDigestEmail,
                hasModalCard: true,
                fullScreen: false,
                props: {
                    "data": data
                },
                canCancel: ['x'],
                onCancel: function () {
                    //console.log('cancel')
                },
                events: {
                    'myEvent': value => {
                        //console.log(value)
                    }
                }
            })
        },
    }
}
</script>

<style lang="scss">

.is-static {
    background-color: whitesmoke;
    border: 1px solid #dbdbdb;
    color: #7a7a7a;
    box-shadow: none;
}

.is-centered {
    align-items: center;
    display: flex;
}

.has-light-border {
    border: 1px solid #dbdbdb !important;
}

.killchain-stage button {
    height: 100px;
    width: 100%;
}

.m-auto {
    margin: auto;
}

.killchain-stage.circle {
    border-radius: 100% 10px;
}

.only-bottom-border-radius {
    .button, textarea {
        border-top-left-radius: 0px;
        border-top-right-radius: 0px;
    }
}

.autocomplete .dropdown-menu div.dropdown-item a  {
    text-decoration: none !important;
}

.has-shadow {
    box-shadow: 0px 3px 6px #00000022;
}

.sla-slider {
    .b-slider-track, .b-slider-thumb {
        height: 40px;
    }
}
</style>