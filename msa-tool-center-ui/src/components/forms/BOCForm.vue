<template>
<div class="modal-card" style="overflow: visible; width: 800px; height: calc(100vh - 40px);">
    <header class="modal-card-head has-background-dark">
        <p class="modal-card-title has-text-white is-capitalized" style="font-size: 0.75rem;letter-spacing: 2px;">New Digest: {{ email.subject }} {{ $moment(date).format("YYYYMMDD") }}</p>
    </header>
    
    <section class="modal-card-body">
        <b-steps
            ref="steps"
            size="is-small"
            v-model="activeStep"
            :animated="isAnimated"
            :has-navigation="hasNavigation"
            :icon-prev="prevIcon"
            :icon-next="nextIcon">
            <b-step-item label="Insights" :clickable="isStepsClickable">

                <div class="columns">
                    <div class="column">
                        <div class="editor boc-form">
                            <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
                                <div class="menubar m-b-10">

                                    <button class="button is-small menubar__button" :class="{ 'is-active': isActive.bold() }" @click="commands.bold">
                                        <feather type="bold" size="14"/>
                                    </button>

                                    <button class="button is-small menubar__button" :class="{ 'is-active': isActive.italic() }" @click="commands.italic">
                                        <feather type="italic" size="14"/>
                                    </button>

                                    <button class="button is-small menubar__button" :class="{ 'is-active': isActive.underline() }" @click="commands.underline">
                                        <feather type="underline" size="14"/>
                                    </button>

                                    <button class="button is-small menubar__button" :class="{ 'is-active': isActive.bullet_list() }" @click="commands.bullet_list">
                                        <feather type="list" size="14"/>
                                    </button>

                                    <button class="button is-small menubar__button" :class="{ 'is-active': isActive.heading({ level: 3 }) }" @click="commands.heading({ level: 3 })">
                                        Title
                                    </button>

                                    <button class="button is-small menubar__button" @click="commands.undo">
                                        <feather type="corner-up-left" size="14"/>
                                    </button>

                                    <button class="button is-small menubar__button" @click="commands.redo">
                                        <feather type="corner-up-right" size="14"/>
                                    </button>
                                </div>
                            </editor-menu-bar>
                            <editor-content class="editor-content" :editor="editor"/>
                        </div>
                    </div>

                    <div class="column is-half">
                        <p class="menu-label">TICKETS</p>

                        <b-field>
                            <p class="control">
                                <span style="width: 100px;" class="button has-background-p1">P1</span>
                            </p>
                            <b-numberinput v-model="sla.tickets.p1" type="is-default" min="0" placeholder="0" controls-position="compact" expanded></b-numberinput>
                        </b-field>

                        <b-field>
                            <p class="control">
                                <span style="width: 100px;" class="button has-background-p2">P2</span>
                            </p>
                            <b-numberinput v-model="sla.tickets.p2" type="is-default" min="0" placeholder="0" controls-position="compact" expanded></b-numberinput>
                        </b-field>

                        <b-field>
                            <p class="control">
                                <span style="width: 100px;" class="button has-background-p3">P3</span>
                            </p>
                            <b-numberinput v-model="sla.tickets.p3" type="is-default" min="0" placeholder="0" controls-position="compact" expanded></b-numberinput>
                        </b-field>

                        <b-field>
                            <p class="control">
                                <span style="width: 100px;" class="button has-background-p4">P4</span>
                            </p>
                            <b-numberinput v-model="sla.tickets.p4" type="is-default" min="0" placeholder="0" controls-position="compact" expanded></b-numberinput>
                        </b-field>

                        <p class="menu-label m-t-30">SLA PERCENTAGE</p>

                        <b-field grouped>
                            <b-field expanded>
                                <b-slider v-model="sla.percentage" class="is-marginless sla-slider" type="is-success" lazy :custom-formatter="sla => sla + '%'" ></b-slider>
                            </b-field>
                            <b-field>
                                <b-input style="width: 80px" v-model="sla.percentage" type="number" step="0.01" min="0" max="100"></b-input>
                                <p class="control">
                                    <span class="button is-static">%</span>
                                </p>
                            </b-field>
                        </b-field>
                    </div>
                </div>
            <form ref="form0" class="formStyle"  @submit.prevent="checkValid('form0')">   
                <p class="menu-label m-t-20">SIEM</p>           
                <b-field :type="{ 'is-danger': false }">
                    <p class="control">
                        <span style="width: 165px;" class="button is-static">Events Per Second</span>
                    </p>
                    <b-input type="number" min="0" placeholder="Enter a number..." onkeydown="return event.keyCode !== 69" required v-model="siem.events_per_second" expanded></b-input>
                </b-field>
                <b-field :type="{ 'is-danger': false }">
                    <p class="control">
                        <span style="width: 165px;" class="button is-static">Incident Raised</span>
                    </p>
                    <b-input type="number" min="0" placeholder="Enter a number..." onkeydown="return event.keyCode !== 69" required v-model="siem.incident_raised" expanded></b-input>
                </b-field>

                <div class="columns" style="height: 40px;">
                    <div class="column">
                        <p class="menu-label p-t-10">TRIGGERED CORRELATION RULES</p>
                    </div>
                    <div class="column">
                        <div class="buttons is-pulled-right">
                            <b-button type="is-light" @click="siemTotal++"><feather type="plus" size="15"></feather></b-button>
                            <b-button type="is-light" :disabled="siemTotal <= 1" @click="removeEl('siem')"><feather type="minus" size="15"></feather></b-button>
                        </div>
                    </div>
                </div>

                <transition-group class="has-background-white is-paddingless" name="fade" tag="div">
                    <div class="tile" style="padding: 10px 0 10px 0" v-for="index in siemTotal" :key="index" :id="'siem'+index">
                        <div class="tile p-r-10" style="max-width: 88px;">
                            <article class="tile is-child box has-background-dark">
                                <p class="subtitle has-text-centered has-text-white" style="min-width: 38px;height: 36px;vertical-align: middle;display: table-cell;">{{ index }}</p>
                            </article>
                        </div>
                        <div class="tile is-vertical">
                            <div class="tile">
                                <div class="tile p-b-10">
                                    <b-field style="width: 100%">
                                        <b-taginput
                                            height="80px"
                                            v-model="siemTickets[index-1]"
                                            type="is-info"
                                            ellipsis
                                            icon="label"
                                            placeholder="Add tickets..."
                                            expanded
                                            size="is-small">
                                        </b-taginput>
                                    </b-field>
                                </div>
                            </div>
                            <div class="tile">
                                <article class="tile is-child">
                                    <b-field :type="{ 'is-danger': false }">
                                    <b-input placeholder="Enter Rule..." required expanded v-model="siemRule[index-1]"></b-input>
                                    </b-field>
                                </article>
                            </div>
                        </div>
                    </div>
                </transition-group>
            </form>
            </b-step-item>
    
            <b-step-item label="Finish" :clickable="isStepsClickable">
                <p class="has-text-centered is-italic is-size-7" style="margin: 0px auto 20px auto;">Please review and confirm all details below <br> Digest will be sent to your email : <b> {{ email.recipient }}</b></p>
                <div style="height: 0; width: 0;">
                    <boc-template :data="{date: dateFormat(date).toUpperCase(), html: html, siem: siem, correlation: correlation, sla: sla}"/>
                </div>
                <section class="is-paddingless" v-if="image">
                    <!-- <div id="digest-template"> -->
                        <img :src="image.src" style="width: 100%; height: auto;"/>
                    <!-- </div> -->
                </section>
            </b-step-item>
        </b-steps>
    </section>
    <footer class="modal-card-foot custom">
        <div class="is-pulled-right">
            
            <button class="button is-dark" type="button" v-show="activeStep > 0" @click="activeStep -= 1">
                <feather :type="prevIcon"></feather>
            </button>
            <button class="button is-dark" type="button" v-show="activeStep < stepsLength" @click="checkValid()">
                <feather :type="nextIcon"></feather>
            </button>
            <b-button type="is-dark" :loading="isBusy" v-show="activeStep == stepsLength" @click="getPng">Generate</b-button>
        </div>

        <div class="is-pulled-left" style="height: 40px; margin-left: 10px;">
            <b-field>
                <p class="control">
                    <span class="button is-static">Date</span>
                </p>
                <b-datepicker
                    placeholder="Select a date..."
                    position="is-top-left"
                    icon="calendar-today"
                    :max-date="new Date()"
                    :date-formatter="dateFormat"
                    v-model="date">
                </b-datepicker>
            </b-field>
        </div>
    </footer>
</div>
</template>

<script>
import http from '../../http_common';
// Import the editor
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Heading,
  OrderedList,
  BulletList,
  ListItem,
  Bold,
  Italic,
  Underline,
  History
} from 'tiptap-extensions'
import domtoimage from 'dom-to-image'
import bocTemplate from './../templates/BOC'

export default {
    props: ['data', 'user'],
    components: {
        EditorContent,
        EditorMenuBar,
        bocTemplate
    },
    data() {
        return {
            editor: new Editor({
                editable: true,
                extensions: [
                new Heading({ levels: [1, 2, 3] }),
                new BulletList(),
                new OrderedList(),
                new ListItem(),
                new Bold(),
                new Italic(),
                new Underline(),
                new History()
                ],
                content: `<h3>INCIDENT TICKETS:</h3>
                <p>As of 4PM, ...... All tickets are endorsed to BOC for further verification.</p>
                
                <h3>MALWARE DOMAIN WATCH:</h3>
                <p>[domain] was identified as the top CnC host coming from different source IPs.</p>
                
                <h3>DATA SOURCE HEALTH CHECK:</h3>
                <p>[# of data source] ([percent]%) out of [total #] data sources were found inactive and most are Windows Event Log - WMI</p>
                `,
                onUpdate: ({ getHTML }) => {
                    this.html = getHTML();
                },
            }),
            html: `<h3>INCIDENT TICKETS:</h3>
            <p>As of 4PM, ...... All tickets are endorsed to BOC for further verification.</p>
            
            <h3>MALWARE DOMAIN WATCH:</h3>
            <p>[domain] was identified as the top CnC host coming from different source IPs.</p>
            
            <h3>DATA SOURCE HEALTH CHECK:</h3>
            <p>[# of data source] ([percent]%) out of [total #] data sources were found inactive and most are Windows Event Log - WMI</p>`,
            isBusy: false,
            labelPosition: 'on-border',
            activeStep: 0,
            isAnimated: true,
            hasNavigation: false,
            customNavigation: false,
            prevIcon: 'chevron-left',
            nextIcon: 'chevron-right',
            isStepsClickable: true,
            errors: null,
            stepsLength: 1,
            siemRule: [""],
            siemTickets: [[]],
            siemTotal: 1,
            email: {
                recipient: this.user.email,
                subject: `[MICTS][BOC][REPORTS & UPDATES][CONFIDENTIAL][LOW] SOC Daily Digest`
            },
            sla: {
                percentage: 100,
                tickets: {
                    p1: 0,
                    p2: 0,
                    p3: 0,
                    p4: 0
                }
            },
            image: null,
            date: new Date(),
            siem: {
                events_per_second: null,
                incident_raised: null
            }
        }
    },
    watch: {
    },
    created() {

    },
    computed: {
        correlation() {
            let c = {
                rules: this.siemRule,
                tickets: this.siemTickets
            }
            return c
        }
    },
    methods: {
        checkValid() {
            //get form element
            if(this.activeStep == 0){
                 if(!this.$refs.steps.$children[this.activeStep].$el.children[1].checkValidity()){
                     
                         this.$swal({
                                    toast: true,
                                    position: 'bottom-right',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    icon: 'error',
                                    title:'Please fill out all required fields correctly to proceed...'
                                    });
                    }else{
                        if(this.sla.tickets.p1 === 0 || this.sla.tickets.p2 == 0 || this.sla.tickets.p3 == 0 || this.sla.tickets.p4 === 0){
                            this.$swal({
                                                // toast: true,
                                                position: 'center',
                                                showConfirmButton: true,
                                                showCancelButton: true,
                                                confirmButtonColor: "#3085d6",
                                                confirmButtonText: "Yes",
                                                timer: 3000,
                                                icon: 'warning',
                                                title:'Do you want to continue?'
                            }).then((isConfirm) => {
                                    if(isConfirm.value === true) {
                                        this.activeStep += 1;
                                    }
                        });
                        }else{
                            this.activeStep += 1;
                        }
                        // this.activeStep += 1;
                    }
            }
            
        },
        dateFormat(date) {
            return this.$moment(date).format('YYYY MMM DD');
        },
        getPng() {
            this.isBusy = true
            var node = document.getElementById('digest-template')
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
                    that.submit(base64, blob);
                }
            })
            .catch(function (error) {
                console.error('Oops, something went wrong!', error);
            });
        },
        removeEl(type){
        this[type + 'Total'] - 1
        let el = document.getElementById(type + this[type+ 'Total']--);
        this[type+ 'Rule'].splice(this[type+ 'Total'],1)
        el.remove()
        },
        // removeEl(index, type) {
        //     let el = document.getElementById(type+index);
        //     this[type + 'Rule'][index] = ""
        //     type == 'siem' ? this.siemTotal-- : this.wafTotal--
        //     el.remove()
        // },
        submit(base64, blob) {
            blob;
            this.isBusy = true;
            let that = this;
            
            const digest_data = {
                "date" : this.date,
                "insight": this.html,
                "siem" : this.siem,
                "correlation" : this.correlation,
                "sla": this.sla
            }

            const data = {
                "digest_data" : JSON.stringify(digest_data),
                "file": '',//blob
                "base64_string_image": base64,
                "remarks": `${this.email.subject} ${this.$moment(this.date).format("YYYYMMDD")}`,
                "is_draft": 0,
                "digest_date": this.$moment(this.date).format('YYYY-MM-DD'),
                "digest_time": "4:00PM",
                "digest_type": "technical",
                "digest_client": "BOC",
                "client_id": 3,
                "created_by": this.user.id
            }
            
            
            http.post('/dailydigests/add',data)
            .then(function (response) {
                that.isBusy = false;

                that.$parent.close();
                that.$emit('create-digest', response.data.digest_client)
                that.$buefy.dialog.alert({
                    title: 'Hooray',
                    message: `Digest has been successfully sent to email. Please check your email inbox. <br><br>Sent at:  <b>${that.email.recipient}</b><br>Subject:  <i>${data.remarks}</i><br>`,
                    type: 'is-success',
                    hasIcon: true,
                    icon: 'times-check',
                    iconPack: 'fa',
                    ariaRole: 'alertdialog',
                    ariaModal: true
                })
            })
            .catch(function (error) {
                that.isBusy = false;
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

<style lang="scss">

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

.boc-add-digest .b-steps {
    .steps {
        display: none;
    }

    .step-content {
        padding: 0px;
    }
}

.modal-card-foot.custom {
    padding: 15px;
}

.has-light-border {
    border: 1px solid #dbdbdb !important;
}

.message-header.is-static {
    background-color: whitesmoke;
    border: 1px solid #dbdbdb;
    color: #7a7a7a;
    box-shadow: none;
}

.editor.boc-form {
    .ProseMirror {
        min-height: 300px;
    }

    p {
        color: #0D3058 !important;
        font-weight: 500;
        font-size: 9pt;
    }

    ul {
        padding-left: 3rem;
        list-style: square !important;
        
        li {
            line-height: 20px;        
            p {
                font-weight: 500;
                font-size: 10pt;
                text-transform: uppercase;
            }
        }
    }

    h3 {
        color: #0D3058 !important;
        text-transform: uppercase;
        font-size: 10pt;
        font-weight: 700;

        &:not(:first-child) {
            margin-top: 15px;
        }
    }

    .editor-content {
        border: 1px solid #bababa;
        border-radius: 10px;
    }
}

.sla-slider {
    .b-slider-track, .b-slider-thumb {
        height: 40px;
    }
}
</style>

<style scoped>
.has-background-p1 {
    background-color: #bf2828;
    border-color: #bf2828;
    color: #fff;
    box-shadow: none;
    pointer-events: none;
}

.has-background-p2 {
    background-color: #dc5224;
    border-color: #dc5224;
    color: #fff;
    box-shadow: none;
    pointer-events: none;
}

.has-background-p3 {
    background-color: #d8b336;
    border-color: #d8b336;
    color: #fff;
    box-shadow: none;
    pointer-events: none;
}

.has-background-p4 {
    background-color: #71ab31;
    border-color: #71ab31;
    color: #fff;
    box-shadow: none;
    pointer-events: none;
}

.button.is-danger {
    background-color: #e3342f;
    border-color: transparent;
    color: #fff;
}

.modal-card-foot.custom {
  display: block;
}

</style>
