<template>
<div>
  <div :class="{'is-open': isOpen}">
        <input type="checkbox" v-model="isOpen" id="sidebar-toggle"/>
                <aside class="sidebar">
                    <div class="sidebar-bg"></div>
                      <div class="sidebar-header has-text-white" style="text-align: center; padding: 0px;">
                        <div style="background: linear-gradient(-90deg, transparent, rgba(0, 57, 68, 0.78), rgba(144, 195, 76, 0.36)) !important;
                            position: absolute;
                            height: 132px;
                            border-top-right-radius: 40px;
                            z-index: 0;"></div>

                        <div style="position: absolute; height: 132px; border-top-right-radius: 40px;">
                        <a href="#" id="sidebar-toggle-button" @click="toggleSidebar" onclick="document.getElementById('sidebar-toggle').checked = !document.getElementById('sidebar-toggle').checked ;" data-v-step="0">
                            <feather type="menu"></feather>
                        </a>

                            <div class="account-details">
                                <div class="sidebar-header-dropdown" :class="{'is-active': showSideDropdown}" >
                                </div>
                                <img id="trends-logo" src="/images/trends_white.png"/>
                                <div style="display: inline-block; margin-left: 13px;">

                                    <img class="is-rounded" style="max-height: 40px !important; border-radius: 1000px; float: left; margin-left: -20px; margin-top: -5px; background-color: #171f2c"
                                        src="/images/avatar-boy-2.png">
                                    <div class="sidebar-header-details">
                                        <span class="user-name" style="font-size: 12px; display: inline-block">Hi, <span style="font-family: Segoe UI SemiBold">{{account.User.name}}</span>!</span>
                                        <span class="is-block" style="margin-top: -3px; font-size: 7pt; font-family: Segoe UI Light">{{ $moment().format('MMMM DD, YYYY') }}</span>
                                        <div class="role-tag" style="background: rgb(245, 60, 86);
                                            border-radius: 30px 0px;
                                            height: 10px;
                                            text-align: center;
                                            font-size: 5pt;
                                            font-family: Segoe UI;
                                            letter-spacing: 1px;
                                            text-transform: uppercase;
                                            width: max-content;
                                            padding: 0px 7px;
                                            margin-left: -45px;
                                            position: absolute;
                                            float: left;">{{account.Role.name}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                      </div>

                      <ul class="main-menu">
                        <li class="has-sub-menu">
                            <router-link :to="{name: 'dashboard'}" >
                                <grid class="iconProps"></grid>
                                <div class="menu-text">Dashboard</div>
                            </router-link>
                            <!-- <ul class="sub-menu">
                                <li>
                                  <router-link :to="{name: 'dashboard_search'}" >Search Reports</router-link>
                                </li>
                            </ul> -->
                            
                        </li>                              
                        <li v-if="canDo('read-assets')" data-v-step="2">
                            <router-link :to="{name: 'assets'}">
                                <packageVariant class="iconProps"></packageVariant>
                                <div class="menu-text">Assets Inventory</div>
                            </router-link>
                        </li>
                        <li v-if="canDo('read-certificates')" class="has-sub-menu">
                            <router-link :to="{ name: 'certificates.overview' }" data-v-step="3">
                                <fileDocument class="iconProps"></fileDocument>
                                <div class="menu-text">Certificates Monitoring</div>
                            </router-link>
                            <ul class="sub-menu">
                                <li v-if="canDo('approve-certificates')"><router-link :to="{ name: 'certificates.pending' }">Pending
                                    <!-- <b-tag rounded v-if="pending_count.certificates" type="is-danger" class="is-small" style="font-size: 8pt;">
                                        {{ pending_count.certificates }} </b-tag> -->
                                </router-link></li>
                            </ul>
                        </li>

                        <li v-if="canDo('read-storages')">
                             <router-link to="#8">
                                <poll class="iconProps"></poll>
                                <div class="menu-text">Storage Metering</div>
                            </router-link>
                        </li>
                        <!-- <li v-if="canDo('read-knowledgebase')">
                             <router-link :to="{ name: 'knowledgebase' }">
                                <bookOpen class="iconProps"></bookOpen>
                                <div class="menu-text">Knowledge Base</div>
                            </router-link>
                        </li> -->
                        <li v-if="canDo('read-sharepoint-group')">
                             <router-link :to="{ name: 'sharepoint' }">
                                <shareVariant class="iconProps"></shareVariant>
                                <div class="menu-text">SharePoint Group</div>
                            </router-link>
                        </li>

                        <p class="menu-label" v-if="(canDo('read-permissions') || canDo('read-roles') || canDo('read-users')) || canDo('read-logs') || canDo('read-client-management')">
                            MANAGEMENT
                        </p>

                        <li v-if="canDo('read-permissions') || canDo('read-roles') || canDo('read-users')">
                            <router-link :to="{ name: 'users-management' }">
                                <feather type="users"></feather>
                                <div class="menu-text">Users & Permissions</div>
                            </router-link>
                        </li>
                        <li v-if="canDo('read-logs')">
                             <router-link :to="{ name: 'logs'}">
                                <formatBulleted class="iconProps"></formatBulleted>
                                <div class="menu-text">Logs</div>
                            </router-link>
                        </li>
                        <li v-if="canDo('read-client-management')">
                             <router-link :to="{ name: 'client-management'}">
                                <databaseOutline class="iconProps"></databaseOutline>
                                <div class="menu-text">Client Management</div>
                            </router-link>
                        </li>

                        <p class="menu-label" v-if="canDo('read-daily-digest') || canDo('read-advisory-generator')">
                            OPERATION TOOLS
                        </p>

                        <li v-if="canDo('read-daily-digest')" class="has-sub-menu">
                             <router-link to="/digests">
                                <pulse class="iconProps"></pulse>
                                <div class="menu-text">Daily Digests</div>
                            </router-link>
                            <ul class="sub-menu">
                                <li>
                                  <router-link :to="{ name: 'soc' }" v-if="canDo('view-daily-digest-soc')">SOC</router-link>
                                </li>
                                <li>
                                  <router-link :to="{ name: 'noc' }" v-if="canDo('view-daily-digest-noc')">NOC</router-link>
                                </li>
                            </ul>
                        </li>

                        <li v-if="canDo('read-advisory-generator')" class="has-sub-menu">
                            <router-link to="/advisory-generator">
                                <flag class="iconProps"></flag>
                                <div class="menu-text">Advisory Generator</div>
                            </router-link>
                            <ul class="sub-menu">
                                <li>
                                  <router-link :to="{ name: 'advisory.overview' }">Ongoing</router-link>
                                  </li>
                                <li>
                                  <router-link :to="{ name: 'advisory.completed' }">Completed</router-link>
                                  </li>
                                <li v-if="canDo('approve-advisory-generator')"><router-link :to="{ name: 'advisory.pending' }">Pending
                                    <!-- <b-tag rounded v-if="pending_count.advisories" type="is-danger" class="is-small" style="font-size: 8pt;">
                                        {{ pending_count.advisories }} </b-tag> -->
                                </router-link></li>
                            </ul>
                        </li>

                      </ul>


                </aside>

                <Navbar :isOpen="isOpen"></Navbar>

        <main class="py-4 main-body" v-bind:class="{'sidePanel':isOpen}" >
          <router-view :account="account" :currentPath="currentPath"></router-view>

      <!-- <router-view :currentPath="currentPath" @canDo="canDo()" @hasRole="hasRole()" @decreasePendingCount="decreasePendingCount()" :user="user"></router-view> -->
        </main>
</div>

</div>
</template>


<script>
import Navbar from '../components/panel/Navbar'
// import jwt from 'jsonwebtoken';
import http from '../http_common';

export default {
  data (){
    return {
      account: {User:{name:''}, Role:{name:''}},
      isTour: false,
      pending_count: 0,
      isOpen: true,
      showSideDropdown: false,
      steps: [
              {
                  target: '[data-v-step="0"]',
                  content: 'This is the Sidebar. Click this icon to Collapse or expand the menu.',
                  params: {
                      placement: 'right'
                  }
              },
              {
                  target: '[data-v-step="1"]',
                  content: 'Dashboard. You can visually track all assets and certificates summary here.',
                  params: {
                      placement: 'right'
                  }
              },
              {
                  target: '[data-v-step="2"]',
                  content: 'Assets Inventory. Navigate here to view all assets and its warranty status. ',
                  params: {
                      placement: 'right'
                  }
              },
              {
                  target: '[data-v-step="3"]',
                  content: 'Certificate Monitoring. View all certificates and their validity status',
                  params: {
                      placement: 'right'
                  }
              },
              {
                  target: '[data-v-step="4"]',
                  content: 'Settings. Change your password here',
                  params: {
                      placement: 'bottom'
                  }
              },
              {
                  target: '[data-v-step="5"]',
                  content: 'Logout',
                  params: {
                      placement: 'bottom'
                  }
              },
                ]
    }
  },
  components:{
    // Dashboard,
    Navbar
  },
  computed: {
      currentPath() {
          return this.$route.path
      }
  },
  async created() {
    http.get('/users/profile')
    .then(res => {
        this.account = res.data.account;
    })
    .catch(err => { // catch errors
      console.log(err);
    });
  },
  methods:{
    canDo(val) {
      let account_permissions = [];

      //get the permission to user_permissions
      for (let i in this.account.Role.Permissions) {account_permissions.push(this.account.Role.Permissions[i])}
      //get the permission from role_permissions
      for (let i in this.account.User.Permissions) {account_permissions.push(this.account.User.Permissions[i])}

      var can = this.permissionSearch(val, account_permissions) ? true : false;
      return can;  
    },
    permissionSearch(val, myArray){
        for (let i in myArray)
        {
          if(myArray[i])
          {
            if(myArray[i].name == val)
            {
              return myArray[i].name;
            }
          }
        }
    },
    toggleSidebar() {
      this.isOpen = !this.isOpen;
    },
    toggleDropdown() {
      this.showSideDropdown = !this.showSideDropdown;
    }
  }
   
}
</script>

<style scoped>

.sidePanel {
  margin-left: 227px !important;
}

.sidebar .active a,
.sidebar ul.main-menu > li > a.router-link-active {
  background: linear-gradient(45deg, transparent, #003944, #96ca4b75) !important;
  background-position: 0 0;
  -webkit-transition: all 200ms ease-in;
  transition: all 200ms ease-in;
}



#sidebar-toggle:checked ~ .sidebar .has-sub-menu:hover .sub-menu.can-hover,
#sidebar-toggle:checked ~ .sidebar .has-sub-menu .router-link-active ~ .sub-menu,
#sidebar-toggle:checked ~ .sidebar .has-sub-menu .sub-menu.is-collapsed {
  display: block;
  opacity: 1;
  height: auto;
  -webkit-transition: all 200ms ease-in 1s;
  transition: all 200ms ease-in 1s;
}

#sidebar-toggle:checked ~ .sidebar .has-sub-menu .router-link-active ~ ul li a.router-link-exact-active {
  color: aquamarine;
}


#sidebar-toggle:checked ~ .sidebar .has-sub-menu .router-link-active ~ ul li a.router-link-exact-active {
  color: aquamarine;
}

.main-body .container {
  max-width: 100%;
}

.bg-login main.main-body {
  
   margin-top: 70px;
  /* vertical-align: middle; */
  margin-left: 65px;
  display:block;
  /* display: table-cell; */
  /* 
  margin-top: -30px;

  
  padding: 0px; */
    
}

main.main-body {
  margin-left: 65px;
  padding: 30px;
  -webkit-transition: all 200ms ease-in;
  transition: all 200ms ease-in;
}

.sidebar {
  position: fixed;
  z-index: 39;
  top: 0;
  left: 0;
  width: 65px;
  height: 100%;
  margin: 0 0 0 0px;
  -webkit-transition: all 200ms ease-in;
  transition: all 200ms ease-in;
}

.sidebar .account-details {
  display: none;
  opacity: 0;
  -webkit-transition: all 200ms ease-in 1s;
  transition: all 200ms ease-in 1s;
}

.sidebar .account-details #trends-logo {
  display: none;
  margin-top: -55px;
  -webkit-transition: all 200ms ease-in 3s;
  transition: all 200ms ease-in 3s;
}

.sidebar-bg {
  height: inherit;
  width: 65px;
  position: absolute;
  background-color: #19232f;
  z-index: -1;
  -webkit-transition: all 200ms ease-in;
  transition: all 200ms ease-in;
}

.sidebar ul.main-menu {
  position: absolute;
  z-index: -1;
  top: 150px;
  width: 65px;
  height: 100%;
  padding: 30px 5px 0 5px;
  margin: -30px 0 0 0;
  list-style: none;
  background: linear-gradient(45deg, black, #171f2c 70%);
  overflow: hidden;
  -webkit-transition: all 200ms ease-in;
  transition: all 200ms ease-in;
}

.sidebar li {
  margin: 0;
}

.sidebar ul.main-menu li a {
  font-size: 12px;
  text-decoration: none;
  display: block;
  padding: 12px 15px;
  font-weight: 300;
  border-radius: 5px;
  /* letter-spacing: 2px; */
}

.sidebar ul.main-menu li a,
.sidebar .sidebar-header a {
  color: #fff;
}

.sidebar ul.main-menu li a:hover {
  background: linear-gradient(45deg, transparent, #00394475 80%);
  background-position: -65px 0;
  -webkit-transition: all 200ms ease-in;
  transition: all 200ms ease-in;
}


#sidebar-toggle:checked ~ .sidebar .sidebar-bg {
  width: 230px;
}
.sidebar .sidebar-header,
.sidebar .sidebar-header > div {
  border-bottom-left-radius: 30px;
  width: 65px;
  -webkit-transition: width 200ms ease-in;
  transition: width 200ms ease-in;
}

.sidebar .sidebar-header figure,
.sidebar .sidebar-header > div figure {
  background-color: rgba(23, 31, 44, 0.5);
  width: 50px;
  border-radius: 100px;
  border-bottom-right-radius: 0px;
  padding: 5px;
  position: relative;
  height: 65px;
  margin-top: 60px !important;
  margin-right: auto;
  margin-left: auto;
  -webkit-transition: all 200ms ease-in;
  transition: all 200ms ease-in;
}

.sidebar .sidebar-header figure img,
.sidebar .sidebar-header > div figure img {
  margin-left: -20px;
  margin-top: 5px;
  width: 30px;
  height: 30px;
  -webkit-transition: all 200ms ease-in;
  transition: all 200ms ease-in;
}

.sidebar .sidebar-header .user-name,
.sidebar .sidebar-header > div .user-name {
  opacity: 0;
  -webkit-transition: opacity 200ms ease-in;
  transition: opacity 200ms ease-in;
}

.sidebar .sidebar-header a#sidebar-toggle-button,
.sidebar .sidebar-header > div a#sidebar-toggle-button {
  border-radius: 5px 40px 5px 5px;
  margin-top: 5px;
  text-align: center;
  width: 55px;
  right: 0;
  float: right;
  position: relative;
  z-index: 100;
  padding: 12px 15px 12px 10px;
  margin-right: 5px;
  -webkit-transition: margin 200ms ease-in;
  transition: margin 200ms ease-in;
}

.sidebar .sidebar-header .menu-text,
.sidebar .sidebar-header > div .menu-text {
  opacity: 0;
  margin-left: -180px;
  -webkit-transition: margin-left 200ms ease-in;
  transition: margin-left 200ms ease-in;
}

.sidebar .sidebar-header .menu-text img,
.sidebar .sidebar-header > div .menu-text img {
  padding-top: 5px;
}


/* sidbar toogle */

.sidebar .sidebar-header a#sidebar-toggle-button:hover {
  background: linear-gradient(45deg, transparent, #0039448c, #96ca4b75) !important;
}



#sidebar-toggle {
  display: none;
}

#sidebar-toggle:checked ~ .micts-navbar,
#sidebar-toggle:checked ~ .main-body,
#sidebar-toggle:checked ~ .nav-background {
  -webkit-transform: translate3d(0px, 0, 0);
  margin-left: 227px;
  transform: translate3d(0px, 0, 0);
}

#sidebar-toggle:checked ~ .sidebar ul.main-menu {
  width: 230px;
}
.sidebar .sidebar-header a#sidebar-toggle-button,
.sidebar .sidebar-header > div a#sidebar-toggle-button {
  border-radius: 5px 40px 5px 5px;
  margin-top: 5px;
  text-align: center;
  width: 55px;
  right: 0;
  float: right;
  position: relative;
  z-index: 100;
  padding: 12px 15px 12px 10px;
  margin-right: 5px;
  -webkit-transition: margin 200ms ease-in;
  transition: margin 200ms ease-in;
}


#sidebar-toggle:checked ~ .sidebar {
  margin: 0;
  width: 230px;
}

#sidebar-toggle:checked ~ .sidebar .account-details {
  opacity: 1;
  display: block;
  -webkit-transition: all 200ms ease-in 1s;
  transition: all 200ms ease-in 1s;
}

#sidebar-toggle:checked ~ .sidebar .account-details #trends-logo {
  opacity: 0.75;
  height: 80px;
  display: block;
  margin: auto;
  padding-left: 50px;
  -webkit-transition: all 200ms ease-in 3s;
  transition: all 200ms ease-in 3s;
}

#sidebar-toggle:checked ~ .sidebar .menu-label {
  visibility: visible;
}

#sidebar-toggle:checked ~ .sidebar .has-sub-menu {
  -webkit-transition: all 200ms ease-in 1s;
  transition: all 200ms ease-in 1s;
}

#sidebar-toggle:checked ~ .sidebar .has-sub-menu .router-link-active ~ ul li a.router-link-exact-active {
  color: aquamarine;
}

#sidebar-toggle:checked ~ .sidebar .has-sub-menu .sub-menu {
  display: none;
  opacity: 0;
  height: 0px;
  -webkit-transition: all 1s ease-in-out 1s;
  transition: all 1s ease-in-out 1s;
}

#sidebar-toggle:checked ~ .sidebar .has-sub-menu .sub-menu li a {
  padding: 10px 15px;
  font-size: 8pt;
}

#sidebar-toggle:checked ~ .sidebar .has-sub-menu .sub-menu li a:hover {
  background: linear-gradient(45deg, transparent, #00394475 80%);
  background-position: -170px 0;
}


#sidebar-toggle:checked ~ .sidebar .has-sub-menu:hover .sub-menu.can-hover,
#sidebar-toggle:checked ~ .sidebar .has-sub-menu .router-link-active ~ .sub-menu,
#sidebar-toggle:checked ~ .sidebar .has-sub-menu .sub-menu.is-collapsed {
  display: block;
  opacity: 1;
  height: auto;
  -webkit-transition: all 200ms ease-in 1s;
  transition: all 200ms ease-in 1s;
}

#sidebar-toggle:checked ~ .sidebar ul.main-menu {
  margin-top: -30px;
  padding: 30px 10px 0 10px;
}

#sidebar-toggle:checked ~ .sidebar .user-name {
  opacity: 1;
}

#sidebar-toggle:checked ~ .sidebar .sidebar-header,
#sidebar-toggle:checked ~ .sidebar .sidebar-header > div {
  position: absolute;
  width: 230px;
}

#sidebar-toggle:checked ~ .sidebar .sidebar-header figure,
#sidebar-toggle:checked ~ .sidebar .sidebar-header > div figure {
  margin-top: 30px !important;
  margin-right: 0px;
  margin-left: 10px;
  border-bottom-right-radius: 100px;
  height: 50px;
  width: 50px;
}

#sidebar-toggle:checked ~ .sidebar .sidebar-header figure img,
#sidebar-toggle:checked ~ .sidebar .sidebar-header > div figure img {
  width: 40px;
  height: 40px;
}

#sidebar-toggle:checked ~ .sidebar .sidebar-header .menu-text {
  opacity: 1;
  margin-left: 0px;
}

#sidebar-toggle:checked ~ .sidebar .sidebar-bg {
  width: 230px;
}

#sidebar-toggle:checked ~ .sidebar ul.main-menu li a {
  text-align: left;
}

#sidebar-toggle:checked ~ .sidebar .menu-text {
  margin-left: 10px;
}


/* side bar checked */

#sidebar-toggle:checked ~ .sidebar {
  margin: 0;
  width: 230px;
}

#sidebar-toggle:checked ~ .sidebar .account-details {
  opacity: 1;
  display: block;
  -webkit-transition: all 200ms ease-in 1s;
  transition: all 200ms ease-in 1s;
}

#sidebar-toggle:checked ~ .sidebar .account-details #trends-logo {
  opacity: 0.75;
  height: 80px;
  display: block;
  margin: auto;
  padding-left: 50px;
  -webkit-transition: all 200ms ease-in 3s;
  transition: all 200ms ease-in 3s;
}


#sidebar-toggle:checked ~ .sidebar .menu-label {
  visibility: visible;
}

#sidebar-toggle:checked ~ .sidebar .has-sub-menu {
  -webkit-transition: all 200ms ease-in 1s;
  transition: all 200ms ease-in 1s;
}

#sidebar-toggle:checked ~ .sidebar .has-sub-menu .router-link-active ~ ul li a.router-link-exact-active {
  color: aquamarine;
}

#sidebar-toggle:checked ~ .sidebar .has-sub-menu .sub-menu {
  display: none;
  opacity: 0;
  height: 0px;
  -webkit-transition: all 1s ease-in-out 1s;
  transition: all 1s ease-in-out 1s;
}

#sidebar-toggle:checked ~ .sidebar .has-sub-menu .sub-menu li a {
  padding: 10px 15px;
  font-size: 8pt;
}

#sidebar-toggle:checked ~ .sidebar .has-sub-menu .sub-menu li a:hover {
  background: linear-gradient(45deg, transparent, #00394475 80%);
  background-position: -170px 0;
}

#sidebar-toggle:checked ~ .sidebar .has-sub-menu:hover .sub-menu.can-hover,
#sidebar-toggle:checked ~ .sidebar .has-sub-menu .router-link-active ~ .sub-menu,
#sidebar-toggle:checked ~ .sidebar .has-sub-menu .sub-menu.is-collapsed {
  display: block;
  opacity: 1;
  height: auto;
  -webkit-transition: all 200ms ease-in 1s;
  transition: all 200ms ease-in 1s;
}

#sidebar-toggle:checked ~ .sidebar ul.main-menu {
  margin-top: -30px;
  padding: 30px 10px 0 10px;
}

#sidebar-toggle:checked ~ .sidebar .user-name {
  opacity: 1;
}

#sidebar-toggle:checked ~ .sidebar .sidebar-header,
#sidebar-toggle:checked ~ .sidebar .sidebar-header > div {
  position: absolute;
  width: 230px;
}

#sidebar-toggle:checked ~ .sidebar .sidebar-header figure,
#sidebar-toggle:checked ~ .sidebar .sidebar-header > div figure {
  margin-top: 30px !important;
  margin-right: 0px;
  margin-left: 10px;
  border-bottom-right-radius: 100px;
  height: 50px;
  width: 50px;
}

#sidebar-toggle:checked ~ .sidebar .sidebar-header figure img,
#sidebar-toggle:checked ~ .sidebar .sidebar-header > div figure img {
  width: 40px;
  height: 40px;
}

#sidebar-toggle:checked ~ .sidebar .sidebar-header .menu-text {
  opacity: 1;
  margin-left: 0px;
}

#sidebar-toggle:checked ~ .sidebar .sidebar-bg {
  width: 230px;
}

#sidebar-toggle:checked ~ .sidebar ul.main-menu li a {
  text-align: left;
}

#sidebar-toggle:checked ~ .sidebar .menu-text {
  margin-left: 10px;
}

/* sidebar details */
.sidebar-header {
    border-top-right-radius: 40px;
    /*background: #003944;*/
    background-color: #081d21;
    background-image: url(https://www.transparenttextures.com/patterns/gradient-squares.png);
    height: 132px;

}

.sidebar-header-dropdown {
    display: none;
    background-color: #24353d;
    height: 100px;
    width: 200px !important;
    position: relative;
    left: 58px;
    top: -30px;
    border-radius: 0 30px;
    -webkit-transition: all 200ms ease-in-out;
    transition: all 200ms ease-in-out;
}

.sidebar-header-dropdown.is-active {
    display: block;
}

.sidebar-header-details {
    width: 185px;
    height: 40px;
    border-radius: 10px 10px 10px 0px;
    padding: 0px 5px 0px 30px;
    background-color: #171f2ccc;
    text-align: left;
}

/* menu text */

#sidebar-toggle:checked ~ .sidebar .sidebar-header .menu-text {
  opacity: 1;
  margin-left: 0px;
}

#sidebar-toggle:checked ~ .sidebar .menu-text {
  margin-left: 10px;
}

.sidebar .sidebar-header .menu-text,
.sidebar .sidebar-header > div .menu-text {
  opacity: 0;
  margin-left: -180px;
  -webkit-transition: margin-left 200ms ease-in;
  transition: margin-left 200ms ease-in;
}

.sidebar .sidebar-header .menu-text img,
.sidebar .sidebar-header > div .menu-text img {
  padding-top: 5px;
}

.menu-text {
  display: inline;
  font-size: 12px;
  vertical-align: bottom;
  height: 22px;
  position: absolute;
  margin: 3px 10px 1px -175px;
  float: left;
  -webkit-transition: margin 200ms ease-in-out;
  transition: margin 200ms ease-in-out;
  color: white;
}

.menu-label {
  color: #7a7a7a;
  font-size: 0.75em;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.menu-label:not(:first-child) {
  margin-top: 1em;
}

.menu-label:not(:last-child) {
  margin-bottom: 1em;
}

.sidebar .menu-label {
  visibility: hidden;
}

#sidebar-toggle:checked ~ .sidebar .menu-label {
  visibility: visible;
}

.iconProps{
  color:white;
}

</style>