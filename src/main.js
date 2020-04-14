import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import {
  BootstrapVue,
  IconsPlugin
} from 'bootstrap-vue'

import CommonService from './commonService'

Vue.prototype.$ajax = axios;

Vue.prototype.$commonService = CommonService;

Vue.config.productionTip = false

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

new Vue({
  render: h => h(App),
}).$mount('#app')