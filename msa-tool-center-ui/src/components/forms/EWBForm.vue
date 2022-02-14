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
                <div class="editor ewb-form">
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

            </b-step-item>

            <b-step-item label="Finish" :clickable="isStepsClickable">
                <form ref="form0" class="formStyle"  @submit.prevent="checkValid('form0')">
                        <b-field >
                            
                            <p class="control">
                                <span style="width: 165px;" class="button is-static">Events Per Second</span>
                            </p>
                            <b-field style="width:100%">
                            <b-input type="number" min="0" onkeydown="return event.keyCode !== 69" required  placeholder="Enter a number..." v-model="siem.events_per_second" expanded></b-input>
                            </b-field>
                       </b-field>
                        <b-field >
                            <p class="control">
                                <span style="width: 165px;" onkeydown="return event.keyCode !== 69"   class="button is-static">Incident Raised</span>
                            </p>
                            <b-field style="width:100%">
                            <b-input type="number" min="0" placeholder="Enter a number..." required  v-model="siem.incident_raised" expanded></b-input>
                            </b-field>
                        </b-field>

                        <p class="menu-label has-text-centered m-t-20">TOP CORRELATION RULES {{this.siemTotal.length}}</p>

                        <article class="message has-shadow">
                            <div class="message-header has-text-weight-normal is-paddingless p-l-15 is-static" style="margin: 0 -1px;">
                                <p>SIEM</p>
                                <div class="buttons">
                                    <b-button type="is-light" @click="siemTotal++"><feather type="plus" size="15"></feather></b-button>
                                    
                                    <b-button type="is-light" :disabled="siemTotal <= 1" @click="removeEl('siem')"><feather type="minus" size="15"></feather></b-button>
                                </div>

                            </div>
                            <div class="message-body has-background-white is-paddingless">
                                <transition-group name="fade" tag="div">
                                    <b-field v-for="index in siemTotal" :key="index" :id="'siem'+index"  >
                                        <!-- <p class="control">
                                            <span style="width: 30px;" class="button is-static">{{ index }}</span>
                                        </p>
                                        <b-field style="width:100%">
                                             <b-input placeholder="Enter Rule..."  required expanded v-model="siemRule[index-1]"></b-input>
                                        </b-field>
                                        <b-field style="width:100%">
                                        <b-input type="number" style="width: 100px;" required  placeholder="Count" v-model="siemCount[index-1]"></b-input>
                                        </b-field>
                                        <b-field style="width:100%">
                                        <b-select v-model="siemPrio[index-1]" required >
                                            <option value="4">P4</option>
                                            <option value="3">P3</option>
                                            <option value="2">P2</option>
                                            <option value="1">P1</option>
                                        </b-select>
                                        </b-field> -->
                                        <p class="control">
                                                 <span style="width: 30px;" class="button is-static">{{ index }}</span>
                                        </p>
                                        <b-field style="width:80%">
                                             <b-input placeholder="Enter Rule..."  required expanded v-model="siemRule[index-1]"></b-input>
                                        </b-field>
                                        <b-field style="width:15%">
                                        <b-input type="number" style="width: 100px;" required  placeholder="Count" v-model="siemCount[index-1]"></b-input>
                                        </b-field>
                                         <b-field style="width:10%">
                                        <b-select v-model="siemPrio[index-1]" required >
                                            <option value="4">P4</option>
                                            <option value="3">P3</option>
                                            <option value="2">P2</option>
                                            <option value="1">P1</option>
                                        </b-select>
                                         </b-field>
                                    </b-field>
                                </transition-group>
                            </div>
                        </article>

                        <article class="message has-shadow">
                            <div class="message-header has-text-weight-normal is-paddingless p-l-15 is-static" style="margin: 0 -1px;">
                                <p>RSA</p>
                                <div class="buttons">
                                    <b-button type="is-light" @click="rsaTotal++"><feather type="plus" size="15"></feather></b-button>
                                <b-button type="is-light" :disabled="rsaTotal <= 1" @click="removeEl('rsa')"><feather type="minus" size="15"></feather></b-button>
                                </div>

                            </div>
                            <div class="message-body has-background-white is-paddingless">
                                <transition-group name="fade" tag="div">
                                    <b-field v-for="index in rsaTotal" :key="index" :id="'rsa'+index" >
                                        <p class="control">
                                            <span style="width: 30px;" class="button is-static">{{ index }}</span>
                                        </p>
                                        <b-field style="width:80%">
                                        <b-input placeholder="Enter Rule..." required expanded v-model="rsaRule[index-1]"></b-input>
                                        </b-field>
                                        <b-field style="width:15%">
                                        <b-input type="number" style="width: 100px;" required  placeholder="Count" v-model="rsaCount[index-1]"></b-input>
                                        </b-field>
                                        <b-field style="width:10%">
                                        <b-select v-model="rsaPrio[index-1]" required>
                                            <option value="4">P4</option>
                                            <option value="3">P3</option>
                                            <option value="2">P2</option>
                                            <option value="1">P1</option>
                                        </b-select>
                                        </b-field>
                                    </b-field>
                                </transition-group>
                            </div>
                        </article>
                    </form>
            </b-step-item>

            <b-step-item label="Finish" :clickable="isStepsClickable">
                <p class="has-text-centered is-italic is-size-7" style="margin: 0px auto 20px auto;">Please review and confirm all details below <br> Digest will be sent to your email : <b> {{ email.recipient }}</b></p>
                <div style="height: 0; width: 0;">
                    <ewb-template :data="{date: dateFormat(date).toUpperCase(), insight: html, siem: siem, correlation: correlation}"/>
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
            <button class="button is-dark" type="button" v-show="activeStep < stepsLength" @click="checkValid()"
            >
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
import ewbTemplate from './../templates/EWB'

export default {
    props: ['data', 'user'],
    components: {
        EditorContent,
        EditorMenuBar,
        ewbTemplate
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
                content: `
                <h3>
                    NO. OF PHISHING EMAILS:
                </h3>
                    <ul>
                        <li>No Phishing email raised for the whole day</li>
                    </ul>
                <h3>
                    NO. OF RSA REPORTED SITES:
                </h3>
                    <ul>
                        <li>No site was reported by RSA</li>
                    </ul>
                <h3>
                    NO. OF CRITICAL/HIGH VULNERABILITIES RAISED:
                </h3>
                    <ul>
                        <li>No critical/high vulnerabilities raised for the covered report period</li>
                    </ul>
                <h3>
                    NO. OF VPN ACCOUNTS COMPROMISED:
                </h3>
                    <ul>
                        <li>No VPN accounts compromised</li>
                    </ul>
                <h3>
                    FREQUENCY OF ATTACK PER DAY:
                </h3>
                    <ul>
                        <li>Malware Defense: 0</li>
                        <li>Network Defense: 0</li>
                        <li>Privilege Account Monitoring: 0</li>
                        <li>Data Exfiltration: 0</li>
                    </ul>
                <h3>
                    DATA SOURCE STATUS:
                </h3>
                    <ul>
                        <li>Active: 0</li>
                        <li>Network Defense: 27</li>
                    </ul>
                `,
                onUpdate: ({ getHTML }) => {
                    this.html = getHTML();
                },
            }),
            html: `
                <h3>
                    NO. OF PHISHING EMAILS:
                </h3>
                    <ul>
                        <li>No Phishing email raised for the whole day</li>
                    </ul>
                <h3>
                    NO. OF RSA REPORTED SITES:
                </h3>
                    <ul>
                        <li>No site was reported by RSA</li>
                    </ul>
                <h3>
                    NO. OF CRITICAL/HIGH VULNERABILITIES RAISED:
                </h3>
                    <ul>
                        <li>No critical/high vulnerabilities raised for the covered report period</li>
                    </ul>
                <h3>
                    NO. OF VPN ACCOUNTS COMPROMISED:
                </h3>
                    <ul>
                        <li>No VPN accounts compromised</li>
                    </ul>
                <h3>
                    FREQUENCY OF ATTACK PER DAY:
                </h3>
                    <ul>
                        <li>Malware Defense: 0</li>
                        <li>Network Defense: 0</li>
                        <li>Privilege Account Monitoring: 0</li>
                        <li>Data Exfiltration: 0</li>
                    </ul>
                <h3>
                    DATA SOURCE STATUS:
                </h3>
                    <ul>
                        <li>Active: 0</li>
                        <li>Network Defense: 0</li>
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
            stepsLength: 2,
            siemRule: ["", "", ""],
            siemPrio: ["", "", ""],
            siemCount: ["", "", ""],
            rsaPrio: ["", ""],
            rsaRule: ["", ""],
            rsaCount: ["", ""],
            siemTotal: 3,
            rsaTotal: 2,
            email: {
                recipient: this.user.email,
                subject: `[MICTS][EWB][REPORTS & UPDATES][CONFIDENTIAL][LOW] SOC Daily Digest`
            },
            image: null,
            date: new Date(),
            siem: {
                events_per_second: null,
                incident_raised: null
            }

        }
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
            //get form element
            // console.log(this.$refs.steps.$children[this.activeStep].$el.children[0].children[1].innerText.trim().length)
            // 
            if(this.activeStep == 0){
                if(this.$refs.steps.$children[this.activeStep].$el.children[0].children[1].innerText.trim().length === 0){
                    this.$swal({
                                toast: true,
                                position: 'bottom-right',
                                showConfirmButton: false,
                                timer: 3000,
                                icon: 'error',
                                title:'Please fill out all required fields correctly to proceed...'
                                });
                }else{
                    this.activeStep += 1;
                }
                
                    

            }else{

                if(this.activeStep == 1){   
                    //console.log(this.$refs.steps.$children[this.activeStep].$el.children[0].checkValidity())
                    if(this.siem.events_per_second === null  || this.siem.incident_raised === null || !this.$refs.steps.$children[this.activeStep].$el.children[0].checkValidity()){
                         this.$swal({
                                    toast: true,
                                    position: 'bottom-right',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    icon: 'error',
                                    title:'Please fill out all required fields correctly to proceed...'
                                    });
                    }else{
                        this.activeStep += 1;
                    }
                }else{
                    this.activeStep += 1;
                }
               
          
            }
            
        },
        dateFormat(date) {
            return this.$moment(date).format('MMM DD, YYYY');
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
            // console.log('Submitting Dailydigests');
            let that = this;

            const digest_data = {
                "date" : this.date,
                "insight": this.html,
                "siem" : this.siem,
                "correlation" : this.correlation
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
                "digest_client": "EWB",
                "client_id": 3,
                "created_by": this.user.id
            }

            // const formData = new FormData()
            // for ( const key in data ) {
            //     formData.append(key, data[key]);
            // }

            http.post('/dailydigests/add',data)
            .then(function (response) {
                that.isBusy = false;
                that.$emit('create-digest', response.data.digest_client)

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
            .catch(function (error) {
                that.isBusy = false;
                let e = error.message;

                that.$buefy.dialog.alert({
                    title: 'Oops',
                    message: `${e}<br>`,
                    type: 'is-danger',
                    hasIcon: true,
                    icon: 'times-circle',
                    iconPack: 'fa',
                    ariaRole: 'alertdialog',
                    ariaModal: true
                })

            });
        },
        // removeEl(index, type) {
        //     console.log('index')
        //     console.log(index)
        //     let el = document.getElementById(type+index);
        //     this[type + 'Rule'][index] = ""
        //     type == 'siem' ? this.siemTotal-- : this.rsaTotal--
        //     el.remove()
        // },

        removeEl(type){
            this[type + 'Total'] - 1
            let el = document.getElementById(type + this[type+ 'Total']--);
            this[type+ 'Rule'].splice(this[type+ 'Total'],1)
            el.remove()
        }
    }
}
</script>

<style lang="scss">
.help {
    color: #f14668
}

.ewb-add-digest .b-steps {
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

.editor.ewb-form {


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
        color: #591A7C !important;
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


.modal-card-foot.custom {
  display: block;
}

</style>