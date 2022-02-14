import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './resources/router';

import VueFeather from 'vue-feather'
import 'buefy/dist/buefy.css'
import Buefy from 'buefy'
import App from './App.vue'
import Multiselect from 'vue-multiselect'
import VueDraggable from 'vuedraggable'
import VueGoogleCharts from 'vue-google-charts'

Vue.component('multiselect', Multiselect)
Vue.use(VueRouter);
Vue.use(Buefy, {
  defaultIconPack: 'fas'
});

Vue.use(VueFeather);
Vue.use(VueDraggable)
Vue.use(VueGoogleCharts)


import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
Vue.use(VueSweetalert2);


//Icons
import emailOutline from 'vue-material-design-icons/EmailOutline.vue';
import lock from 'vue-material-design-icons/LockOutline.vue';
import grid from 'vue-material-design-icons/ViewGridOutline.vue';
import packageVariant from 'vue-material-design-icons/PackageVariantClosed.vue';
import fileDocument from 'vue-material-design-icons/FileDocumentOutline.vue';
import poll from 'vue-material-design-icons/Poll.vue';
import bookOpen from 'vue-material-design-icons/BookOpenPageVariantOutline.vue';
import shareVariant from 'vue-material-design-icons/ShareVariantOutline.vue';
import accountGroup from 'vue-material-design-icons/AccountGroupOutline.vue';
import formatBulleted from 'vue-material-design-icons/FormatListBulleted.vue';
import databaseOutline from 'vue-material-design-icons/DatabaseOutline.vue';
import pulse from 'vue-material-design-icons/Pulse.vue';
import flag from 'vue-material-design-icons/FlagOutline.vue';
import plus from 'vue-material-design-icons/Plus.vue';
import downloadOut from 'vue-material-design-icons/FileDownloadOutline.vue';
import server from 'vue-material-design-icons/ServerSecurity.vue';
import shield from 'vue-material-design-icons/ShieldOutline.vue';
import deleteOutline from 'vue-material-design-icons/DeleteOutline.vue';
import monitor from 'vue-material-design-icons/Monitor.vue';
import wifi from 'vue-material-design-icons/Wifi.vue';
import checkSquare from 'vue-material-design-icons/CheckboxMarkedOutline.vue';
import chevRight from 'vue-material-design-icons/ChevronRight.vue';
import chevLeft from 'vue-material-design-icons/ChevronLeft.vue';
import desktop from 'vue-material-design-icons/DesktopTower.vue';
import checkCircleOutline from 'vue-material-design-icons/CheckCircleOutline.vue';
import closeCircleOutline from 'vue-material-design-icons/CloseCircleOutline.vue';
import stop from 'vue-material-design-icons/MinusCircleOutline.vue';
import edit from 'vue-material-design-icons/PencilOutline.vue';
import account from 'vue-material-design-icons/AccountOutline.vue';

Vue.component('account',account)
Vue.component('stop',stop)
Vue.component('edit',edit)
Vue.component('desktop',desktop)
Vue.component('chevRight',chevRight)
Vue.component('chevLeft',chevLeft)
Vue.component('email-outline',emailOutline)
Vue.component('lock',lock)
Vue.component('grid',grid)
Vue.component('packageVariant',packageVariant)
Vue.component('fileDocument',fileDocument)
Vue.component('poll',poll)
Vue.component('bookOpen',bookOpen)
Vue.component('shareVariant',shareVariant)
Vue.component('accountGroup',accountGroup)
Vue.component('formatBulleted',formatBulleted)
Vue.component('databaseOutline',databaseOutline)
Vue.component('pulse',pulse)
Vue.component('flag',flag)
Vue.component('plus',plus)
Vue.component('downloadOut',downloadOut)
Vue.component('server',server)
Vue.component('shield',shield)
Vue.component('deleteOutline',deleteOutline)
Vue.component('monitor',monitor)
Vue.component('wifi',wifi)
Vue.component('checkSquare',checkSquare)
Vue.component('checkCircleOutline',checkCircleOutline)
Vue.component('closeCircleOutline',closeCircleOutline)

Vue.config.productionTip = false

//routes
const router = new VueRouter({
  routes:routes,
  mode:'history'
});

//cookies
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

//json viewer
import JsonViewer from 'vue-json-viewer'
Vue.use(JsonViewer)

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    let user = Vue.$cookies.get('user');
    if (user == null) {
        // user doesn't have access token, redirect to login
        next({ name: 'login' });
    }
    else {
        // user has access token, user can open the page
        next();
    }
  }
  else if(to.matched.some(record => record.meta.authNotRequired)) {
    let user = Vue.$cookies.get('user');
    if (user == null) {
        next();
    }
    else {
        next({ name: 'main' });
    }
  }
  else {
    next();
  }
});


import moment from 'moment'
Vue.prototype.$moment = moment

import Excel from 'exceljs';
Vue.prototype.$Excel = Excel;

import { saveAs } from 'file-saver';
Vue.prototype.$saveAs = saveAs;

Vue.filter('fromNow', function(value) {
  if (value) {
    return moment(String(value)).startOf('hour').fromNow()
  }
});

Vue.filter('formatDate', function(value, format = 'MMM DD, YYYY HH:mm') {
  if(value) {
    return moment(String(value)).format(format)
  }
})


new Vue({
  render: h => h(App),
  router:router
}).$mount('#app')
