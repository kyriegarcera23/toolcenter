<template>
<div class="main-body">
    <section class="login-container" id="login-container" v-cloak> 
        <img src="/images/login-image.svg" alt="Login Image" class="loginImges" />
        <div class="loginForm" >
            <div class="card login-card loginCard">
                <div class="card-content has-text-centered">
                    <img src="/images/tc-logo-dark.png" class="tcLogo" />
                    <p class="pIntro">Welcome back! Please login to continue.</p>
                    <div class="field">
                        <p class="control has-icons-left has-icons-right">
                            <b-field>
                                <b-input name="email"
                                size="is-medium"
                                class="inputField"
                                v-model="user.email"
                                required
                                placeholder="Email Address or Username"
                                @keyup.native.enter="logIn" 
                                >
                                </b-input>
                            </b-field>
                            <span class="icon is-small is-left">
                                <email-outline class="iconProps"/>
                            </span>
                        </p>
                    </div>
                    <div class="field">
                        <p class="control has-icons-left">
                            <b-field>
                                <b-input name="password" size="is-medium" class="inputField"
                                    v-model="user.password"
                                    required
                                    placeholder="Password"
                                    type="password"
                                    password-reveal
                                    @keyup.native.enter="logIn"
                                  >
                                </b-input>
                            </b-field>
                            <span class="icon is-small is-left">
                                <lock class="iconProps" />
                            </span>
                        </p>
                    </div>
                    <div class="field">
                        <p class="control has-text-centered">
                            <button class="button btn-login" @click="logIn">Sign In</button>
                        </p>
                    </div>
                    <!-- <div class="field" style="margin-top: 20px;">
                        <router-link to="/forgot-password" style="font-size: 13px; color: #5692A3;">Forgot Password?</router-link>
                    </div> -->
                    <div id="custom-target"></div>
                </div>
            </div>
        </div>
    </section>
</div>    
</template>


<script>
import http from '../http_common';


export default {
  data (){
    return{
      user: {
        email:'',
        password:'',
        
      }
    }
  },
  methods:{
    logIn(){
      http.post('/users/login',this.user)
      .then(res => {
          this.$cookies.set('user',res.data.auth_token);
          window.location.href = '/dashboard';
      })
      .catch(err => { //CATCH ERROR HERE for e.g Invalid Crendentials
        
        var obj = err.response.data[0];
        var return_string = Object.values(obj);
        //console.log(return_string)
        if (return_string == 'Invalid Input' || return_string == 'Account does not exist!'){
          this.defualtAlert(return_string)
        }else{
          this.showAlert(return_string,return_string[1])
        }
      });
    },
      showAlert(value,count) {
        var msg = new String(value).substring(0, 19)
        let that = this;
        if (count == 0){
          
          that.$buefy.dialog.alert({
            title: 'Oops',
            message: `${this.user.email} has been locked. kindly email SAP to unlocked.`,
            type: 'is-danger',
            hasIcon: true,
            icon: 'times-circle',
            iconPack: 'fa',
            ariaRole: 'alertdialog',
            ariaModal: true
          })

        }else{
          this.$swal({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 4500,
            icon: 'error',
            title: "  " + msg + "  " + '(Remaining attempts: ' + count +')'
          });

        }
        
      },
      defualtAlert(msg){
        this.$swal({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 4500,
            icon: 'error',
            title: "  " + msg + " "
          });
      }
  }
   
}
</script>

<style scoped>

.bg-login .main-body {
  margin-left: 0px;
  margin-top: -30px;
  display: table-cell;
  vertical-align: middle;
  padding: 0px;
  background: linear-gradient(rgb(241, 241, 241),
   rgb(233, 236, 241), rgb(215, 223, 242));
}


.login-container .icons {
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  list-style: none;
  margin: 0;
  padding: 0;
}

.login-container .icons > li {
  background-color: #f8f8f8;
  padding: 0.5rem 1rem;
  -webkit-transition: color 0.15s;
  transition: color 0.15s;
}

.login-container .icons > li:hover {
  color: #0074d9;
}

.login-container .icons > li > i {
  vertical-align: middle;
}

.login-container .icons > li > span {
  color: gray;
  margin-left: 0.5rem;
  -webkit-transition: color 0.15s;
  transition: color 0.15s;
}

.login-container .icons > li:hover > span {
  color: inherit;
}

.login-container .icon svg {
  stroke: #002830;
}

.login-container .card {
  box-shadow: none;
  background-color: transparent;
}



.login-container .card .card-content .tc-logo {
  margin-left: -30px;
  position: absolute;
  top: -80px;
  width: 230px;
}


.login-container {
  width: 100%;
  box-sizing: inherit;
  color: #4a4a4a;
  font-size: 1em;
  font-weight: 400;
  line-height: 1.5;
}

.login-container .card {
  width: 476px;
  margin: auto;
  margin-top: 80px;
  /* padding: 12px;
  border-radius: 10px; */
}

.card-content {
    background-color: transparent;
    padding: 1.5rem;
}

.has-text-centered {
    text-align: center!important;
}

.inputField {
  box-shadow: 5px 3px 6px 0 #00000029;
  background-color: white !important;
  font-size: 15px;
  color: rgba(23, 43, 77, 0.8);
}

.login-container .card .field input,
.login-container .card .field span.icon {
  height: 60px;
}


.btn-login {
  margin-top: 20px;
  margin-bottom: 5px;
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

.pIntro {
    color: #172b4d;
    margin-top: 0px;
    margin-bottom: 35px;
    font-family: BlinkMacSystemFont,
    -apple-system,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,
    Fira Sans,Droid Sans,Helvetica Neue,Helvetica,Arial,sans-serif;
}

.loginImges {
    height: 99.1vh;
    display: inline-block;
    min-width: 50%;
}

.loginForm {
    display: inline-block;
    position: absolute;
    margin-left: -140px;
}

.loginCard {
    border-radius: 10px;
    padding: 12px;
}

.tcLogo {
    height: 42px;
    cursor: pointer;

}


.iconProps{
  padding-top:0px;
  margin-top:0px;
  color:darkslategray;
}

.has-text-primary {
  color: #00d1b2 !important;
}

i.has-text-primary:hover,
i.has-text-primary:focus {
  color: #009e86 !important;
}

</style>