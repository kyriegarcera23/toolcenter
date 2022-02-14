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
                <form ref="form0" class="formStyle"  @submit.prevent="checkValid('form0')">  
                    <div style="margin: auto; text-align: center; width: fit-content;">
                        <p class="menu-label has-text-centered">TELCO LINK STATUS</p>               
                        <b-field grouped v-for="(telco, name) in telcos" :key="name">
                            <b-field :type="{ 'is-danger': false }">
                                <p class="control">
                                    <span style="width: 90px; text-transform: uppercase; font-size: 0.75rem; height: 40px;" class="button is-static">{{ name }}</span>
                                </p>
                                <b-input type="number" min="0" max="100" onkeydown="return event.keyCode !== 69" required placeholder="Total" v-model="telcos[name]['percentage']"></b-input>
                                <p class="control">
                                    <span style="width: 30px; text-transform: uppercase; font-size: 0.75rem; height: 40px;" class="button is-static">%</span>
                                </p>
                            </b-field>
                            
                            <b-field :type="{ 'is-danger': false }">
                                <p class="control">
                                    <span style="width: 100px; font-size: 0.75rem; height: 40px;" class="button has-background-p4">TOTAL LINKS</span>
                                </p>
                                <b-input type="number" min="0" max="9999" onkeydown="return event.keyCode !== 69" required v-model="telcos[name]['total']"></b-input>
                                <p class="control">
                                    <span style="width: 100px; font-size: 0.75rem; height: 40px;" class="button has-background-p1">DOWN LINKS</span>
                                </p>
                                <b-input type="number" min="0" max="9999" onkeydown="return event.keyCode !== 69" required v-model="telcos[name]['down']"></b-input>
                            </b-field>
                        </b-field>
                    </div>

                        <div class="columns">
                            <div class="column">
                                <p class="menu-label">BRANCH STATUS</p>

                                <b-field :type="{ 'is-danger': false }">
                                    <p class="control">
                                        <span style="width: 75px; font-size: 0.75rem; height: 40px;" class="button has-background-p4">UP</span>
                                    </p>
                                    <b-input type="number" expanded min="0" onkeydown="return event.keyCode !== 69" required placeholder="# of Branch" v-model="status.branch.up"></b-input>
                                </b-field>

                                <b-field :type="{ 'is-danger': false }">
                                    <p class="control">
                                        <span style="width: 75px; font-size: 0.75rem; height: 40px;" class="button has-background-p1">DOWN</span>
                                    </p>
                                    <b-input type="number" expanded min="0" onkeydown="return event.keyCode !== 69" required placeholder="# of Branch" v-model="status.branch.down"></b-input>
                                </b-field>
                            </div>

                            <div class="column">
                                <p class="menu-label">ATM STATUS</p>

                                <b-field :type="{ 'is-danger': false }">
                                    <p class="control">
                                        <span style="width: 75px; font-size: 0.75rem; height: 40px;" class="button has-background-p4">UP</span>
                                    </p>
                                    <b-input type="number" expanded min="0" onkeydown="return event.keyCode !== 69" required placeholder="Up" v-model="status.atm.up"></b-input>
                                </b-field>

                                <b-field :type="{ 'is-danger': false }">
                                    <p class="control">
                                        <span style="width: 75px; font-size: 0.75rem; height: 40px;" class="button has-background-p1">DOWN</span>
                                    </p>
                                    <b-input type="number" expanded min="0" onkeydown="return event.keyCode !== 69" required placeholder="Up" v-model="status.atm.down"></b-input>
                                </b-field>
                            </div>
                        </div>
                        
                        <p class="menu-label m-t-20">SUMMARY</p>

                        <div class="editor ubp-form">
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
                
                </form>
            </b-step-item>

            <b-step-item label="Finish" :clickable="isStepsClickable">
                <p class="has-text-centered is-italic is-size-7" style="margin: 0px auto 20px auto;">Please review and confirm all details below <br> Digest will be sent to your email : <b> {{ email.recipient }}</b></p>
                <div style="height: 0; width: 0;">
                    <ubp-template :data="{date: dateFormat(date).toUpperCase(), html: html, status: status, telcos: telcos}"/>
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
            <b-button type="is-dark" :loading="isBusy" v-show="activeStep == stepsLength" @click="getPng" >Generate</b-button>
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
import ubpTemplate from './../templates/UBP'

export default {
    props: ['data', 'user'],
    components: {
        EditorContent,
        EditorMenuBar,
        ubpTemplate
    },
    data() {
        return {
            digest_data: [],
            editor: new Editor({
                editable: true,
                extensions: [
                new Heading({ levels: [1, 2, 3]}),
                new BulletList(),
                new OrderedList(),
                new ListItem(),
                new Bold(),
                new Italic(),
                new Underline(),
                new History(),
                ],
                content: `
                <h3 style="margin:100px;"  >
                    TELCO LINK AVAILABILITY
                </h3>
                    <ul>
                        <li>As of (date and time), Link Availability of all Telcos exceeded the target SLA.</li>
                    </ul>
                <h3  >
                    BRANCH STATUS
                </h3>
                    <ul>
                        <li></li>
                    </ul>
                <h3  >
                    ATM STATUS
                </h3>
                    <ul>
                        <li>All [number] Branches are monitored UP</li>
                    </ul>
                <h3  >
                    BRANCH LINK UTILIZATION
                </h3>
                    <ul>
                        <li>As of [time], no Telco link was monitored with High Bandwidth Utilization</li>
                    </ul>
                `,
                onUpdate: ({ getHTML }) => {
                    this.html = getHTML();
                },
            }),
            html: `
                <h3  >
                    TELCO LINK AVAILABILITY
                </h3>
                    <ul>
                        <li>As of (date and time), Link Availability of all Telcos exceeded the target SLA.</li>
                    </ul>
                <h3  >
                    BRANCH STATUS
                </h3>
                    <ul>
                        <li></li>
                    </ul>
                <h3  >
                    ATM STATUS
                </h3>
                    <ul>
                        <li>All [number] Branches are monitored UP</li>
                    </ul>
                <h3  >
                    BRANCH LINK UTILIZATION
                </h3>
                    <ul>
                        <li>As of [time], no Telco link was monitored with High Bandwidth Utilization</li>
                    </ul>
                `,
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
            email: {
                recipient: this.user.email,
                subject: `[MICTS][UBP][REPORTS & UPDATES][CONFIDENTIAL][LOW] NOC Daily Digest`
            },
            image: null,
            date: new Date(),
            telcos: {
                pldt: {
                    percentage: 100,
                    total: 74,
                    down: 0
                },
                converge: {
                    percentage: 100,
                    total: 118,
                    down: 0
                },
                globe: {
                    percentage: 100,
                    total: 80,
                    down: 0
                },
                bayan: {
                    percentage: 100,
                    total: 10,
                    down: 0
                },
                etpi: {
                    percentage: 100,
                    total: 20,
                    down: 0
                },
                radius: {
                    percentage: 100,
                    total: 2,
                    down: 0
                }
            },
            status: {
                branch: {
                    up: 207,
                    down: 0
                },
                atm: {
                    up: 396,
                    down: 0
                }
            }
        }
    },
    watch: {
    },
    created() {

    },
    beforeDestroy() {
        this.editor.destroy()
    },
    computed: {
        correlation() {
            let c = {
                siem: {
                    rule: this.siemRule,
                    count: this.siemCount,
                    priority: this.siemPrio
                }, 
                rsa: {
                    rule: this.rsaRule,
                    count: this.rsaCount,
                    priority: this.rsaPrio
                }
            }
            return c
        }
    },
    methods: {
        checkValid() {
            if(this.activeStep == 0){
                 if(!this.$refs.steps.$children[this.activeStep].$el.children[0].checkValidity()){
                     
                         this.$swal({
                                    toast: true,
                                    position: 'bottom-right',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    icon: 'error',
                                    title:'Please fill out all required fields correctly to proceed...'
                                    });
                    }else{
                       
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
                        // }else{
                        //     this.activeStep += 1;
                        // }
                        // this.activeStep += 1;
                    }
            }
            
        },
        dateFormat(date) {
            return this.$moment(date).format('MMMM DD, YYYY');
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
        submit(base64, blob) {
            blob;
            this.isBusy = true;
            let that = this;
            
            const digest_data = {
                "date" : this.date,
                "insight": this.html,
                "telcos" : this.telcos,
                "status" : this.status
            }

            const data = {
                "digest_data" : JSON.stringify(digest_data),
                "file": '', //blob
                "base64_string_image": base64,
                "remarks": `${this.email.subject} ${this.$moment(this.date).format("YYYYMMDD")}`,
                "is_draft": 0,
                "digest_date": this.$moment(this.date).format('YYYY-MM-DD'),
                "digest_time": "4:00PM",
                "digest_type": "technical",
                "digest_client": "UBP",
                "client_id": 3,
                "created_by": this.user.id
            }
            
            http.post('/dailydigests/add',data)
            .then((response) => {
                    that.$emit('create-digest', response.data.digest_client)
                    that.isBusy = false;

                    that.$parent.close();


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
                .catch((error) => {
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
        },
    },
}
</script>

<style lang="scss">


.help {
    color: #f14668
}

.ubp-add-digest .b-steps {
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

.editor.ubp-form {
    

    ul {
        padding-left: 3rem;
        list-style: square !important;
        
        li {
            line-height: 20px;        
            p {
                font-weight: 500;
                font-size: 10pt;
            }
        }
    }

    h3 {
        color: #f7931e !important;
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
</style>

<style scoped>
.has-background-p1 {
    background-color: #bf2828;
    border-color: #bf2828;
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

.modal-card-foot.custom {
  display: block;
}

</style>

