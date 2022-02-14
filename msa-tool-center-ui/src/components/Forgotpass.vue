<template>

<div>
    <div class="container containerTop" v-cloak>
        <div class="column m-auto is-flex containerClass">
            <img src="/images/tc-logo-dark.png" class="tocLogo" />
        </div>
        <div class="column is-three-fifths is-offset-one-fifth">
            <div class="card">
                <header class="card-header">
                    <p class="card-header-title">
                        Reset Password
                    </p>
                </header>
                <div class="card-content">
                    <div class="content">
                        <p class="control has-icons-left ">
                            <b-field label="E-mail Address">
                                <b-input id="email" v-model="user.email" class="is-primary" name="email" type="email" value="" required autofocus>
                                </b-input>
                            </b-field>
                            <span class="icon is-small is-left iconSize ">
                                <email-outline class="iconProps" />
                            </span>
                        </p>    
                        <b-field class="is-flex" style="justify-content: flex-end">
                            <p class="control">
                                <b-button type="is-primary" native-type="submit" @click="resetPassword">
                                    Reset Password
                                </b-button>
                            </p>
                        </b-field>
                    </div>
                </div>
            </div>
        </div>
    </div>     
</div>
   
</template>

<script>
import http from '../http_common';

export default {
    data() {
        return {
            user: {
                email: ''
            }
        }
    },
    methods: {
        resetPassword() {
            http.post('/users/reset-password', this.user)
            .then(res => {
                var msg = res.data.message;
                var icon = "success"
                var timer = 4000
                this.showAlert(msg,icon,timer)
                
            })
            .catch(err => { //CATCH ERROR HERE for e.g Invalid Crendentials
                var obj = err.response.data[0];
                var return_string = Object.values(obj);
                var icon = "error"
                var timer = 2000
                this.showAlert(return_string,icon,timer)
            });
            },

            showAlert(value,icon,timer) {
                this.$swal({
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: timer,
                icon: icon,
                title: "  " + value + "  "
                });
            }
    }
}
</script>

<style scoped>

.input.email{
 color: #00d1b2;
}

.containerClass{
    padding-top:100px;
    justify-content:center;
}

.button.is-primary {
background-color: #00d1b2;
border-color: transparent;
}

.button.is-primary:hover,
.button.is-primary.is-hovered {
  background-color: #00c4a7;
  border-color: transparent;
  color: #fff;
}



.iconSize{
    padding-top:55px;
}

.iconProps{
  padding-top:0px;
  margin-top:0px;
  color:darkslategray;
}

.tocLogo{
    height: 42px;
}

.containerTop{
    padding-top: -80px;
}

.btn-login {

  background-color: #003944;
  color: #fff;
}

.headerColor {

  background-color: #003944;
  color: #fff;
}

.btn-login:hover {
  background-color: #00242b;
}

.btn-login:hover,
.btn-login:active,
.btn-login:focus,
.btn-login:visited,
.btn-login:focus-within {
  color: #fff;
}


.iconProps{
  padding-top:0px;
  margin-top:0px;
  color:darkslategray;
}


</style>