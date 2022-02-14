<template>
<div>
     <nav class="navbar has-shadow is-fixed-top micts-navbar" v-bind:class="{'sidePanel':isOpen}" role="navigation" aria-label="main navigation">   

    <div class="navbar-start">        
        <div class="navbar-item">
            <img src="/images/tc-logo.png" style="max-height: 30px !important; height: 30px; margin-bottom: -10px; filter: brightness(0) invert(1);"/>
        </div>
    </div>

    <div class="navbar-end">
        <!-- <div class="navbar-item is-paddingless">
            <a class="navbar-link is-arrowless">
                <feather type="help-circle" size="22"></feather>
            </a>
        </div>
        <div class="navbar-item is-paddingless" data-v-step="4">
            <router-link class="navbar-link is-arrowless" :to="{ name: 'change-password' }">
                <feather type="settings" size="22"></feather>  
            </router-link>
        </div> -->
        <div class="navbar-item is-paddingless" data-v-step="5">
            <form ref="logoutForm" method="POST" action="/logout" id="logout2" >
                <!-- <input type="hidden" name="_token" :value="csrf"/> -->
                <a class="navbar-link is-arrowless hoverColor" @click="logout">
                    <feather type="power" size="22"></feather>
                </a>
            </form>
        </div>
      </div>
   
</nav>
</div>    
</template>


<script>
import http from '../../http_common';

export default {
  props:['isOpen'],
  methods: {
    logout() {
      let that = this;
      that;
      this.$buefy.dialog.confirm({
          message: 'Are you sure you want to logout?',
          onConfirm: () => {
              http.get(`/users/logout`)
              .then(data => {
                that.$cookies.remove("user")
                data;
                //console.log(data);
                window.location.href = '/';
              });
          }
      })
    }
  }
}
</script>

<style scoped>
a:hover {
  background-color: #a9d32e;
  border-radius: 50px;
}

.sidePanel {
  margin-left: 227px !important;
}

@media screen and (min-width: 0px) {
  .navbar-start {
    -webkit-box-pack: start;
    justify-content: flex-start;
    margin-right: auto;
  }
}

@media screen and (min-width: 0px) {
  .navbar,
  .navbar-menu,
  .navbar-start,
  .navbar-end {
    -webkit-box-align: stretch;
    align-items: stretch;
    display: -webkit-box;
    display: flex;
  }
}

@media screen and (min-width: 1024px) {
  .navbar.is-white .navbar-start > .navbar-item,
  .navbar.is-white .navbar-start .navbar-link,
  .navbar.is-white .navbar-end > .navbar-item,
  .navbar.is-white .navbar-end .navbar-link {
    color: #0a0a0a;
  }
}

.navbar.is-white .navbar-start > a.navbar-item:focus,
.navbar.is-white .navbar-start > a.navbar-item:hover,
.navbar.is-white .navbar-start > a.navbar-item.is-active,
.navbar.is-white .navbar-start .navbar-link:focus,
.navbar.is-white .navbar-start .navbar-link:hover,
.navbar.is-white .navbar-start .navbar-link.is-active,
.navbar.is-white .navbar-end > a.navbar-item:focus,
.navbar.is-white .navbar-end > a.navbar-item:hover,
.navbar.is-white .navbar-end > a.navbar-item.is-active,
.navbar.is-white .navbar-end .navbar-link:focus,
.navbar.is-white .navbar-end .navbar-link:hover,
.navbar.is-white .navbar-end .navbar-link.is-active {
background-color: #f2f2f2;
color: #0a0a0a;
}

.navbar.is-black .navbar-start .navbar-link::after,
  .navbar.is-black .navbar-end .navbar-link::after {
    border-color: white;
  }



.navbar.has-shadow.micts-navbar {
  box-shadow: 5px 3px 6px 0 #00000029;
}

.micts-navbar {
  margin-left: 65px; 
  /* margin-left: 227px; */
  border-radius: 0 0 30px 30px;
  padding: 5px 30px;
  background: linear-gradient(45deg, #171f2c, darkslategray 50%, #96ca4b);
  -webkit-transition: margin-left 200ms ease-in;
  transition: margin-left 200ms ease-in;
  
}

.micts-navbar .navbar-item.has-dropdown:focus .navbar-link,
.micts-navbar .navbar-item.has-dropdown:hover .navbar-link,
.micts-navbar .navbar-item.has-dropdown.is-active .navbar-link {
  background-color: transparent !important;
  box-shadow: 2px 2px 6px 0px #2323239e;
}

#sidebar-toggle:checked ~ .micts-navbar,
#sidebar-toggle:checked ~ .main-body,
#sidebar-toggle:checked ~ .nav-background {
  -webkit-transform: translate3d(0px, 0, 0);
  margin-left: 227px;
  transform: translate3d(0px, 0, 0);
}


.navbar {
  background-color: #96ca4b;
  min-height: 3.25rem;
  position: relative;
  z-index: 30;
}

.navbar.is-white {
  background-color: white;
  color: #0a0a0a;
}

.navbar.is-white .navbar-brand > .navbar-item,
.navbar.is-white .navbar-brand .navbar-link {
  color: #0a0a0a;
}

.navbar.is-white .navbar-brand > a.navbar-item:focus,
.navbar.is-white .navbar-brand > a.navbar-item:hover,
.navbar.is-white .navbar-brand > a.navbar-item.is-active,
.navbar.is-white .navbar-brand .navbar-link:focus,
.navbar.is-white .navbar-brand .navbar-link:hover,
.navbar.is-white .navbar-brand .navbar-link.is-active {
  background-color: #f2f2f2;
  color: #0a0a0a;
}

.navbar.is-white .navbar-brand .navbar-link::after {
  border-color: #0a0a0a;
}

.navbar.is-white .navbar-burger {
  color: #0a0a0a;
}



input {
    outline: none;
    box-shadow: 0 3px 6px 0 rgba(23, 23, 23, 0.18);
}

.navbar-link {
    color: white;
}

.navbar-item.has-dropdown:focus .navbar-link, 
.navbar-item.has-dropdown:hover .navbar-link, 
.navbar-item.has-dropdown.is-active .navbar-link {
    background-color: darken(#badc58, 10%);
    border-radius: 50px;

}

.navbar-item:focus .navbar-link, 
.navbar-item:hover .navbar-link, 
.navbar-item.is-active .navbar-link,
.navbar-link:focus, .navbar-link:focus-within {
    background-color: darken(#badc58, 10%) !important;
    border-radius: 50px;

}

.navbar-dropdown {
    border-radius: 10px;
}

.username {
    font-size: 13px;
}

.navbar.is-fixed-bottom,
.navbar.is-fixed-top {
  left: 0;
  position: fixed;
  right: 0;
  z-index: 30;
}
.navbar.is-fixed-top {
  top: 0;
}

</style>