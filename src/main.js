import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import plugin from './plugin'
import {
  BootstrapVue,
  IconsPlugin
} from 'bootstrap-vue'

Vue.prototype.$ajax = axios

Vue.config.productionTip = false

Vue.use(plugin);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

new Vue({
  render: h => h(App),
}).$mount('#app')