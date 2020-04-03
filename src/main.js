import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import plugin from './plugin'
import {
  BootstrapVue,
  IconsPlugin
} from 'bootstrap-vue'
import VueSweetalert2 from 'vue-sweetalert2';

Vue.prototype.$ajax = axios

Vue.config.productionTip = false

Vue.use(plugin);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueSweetalert2);

new Vue({
  render: h => h(App),
}).$mount('#app')