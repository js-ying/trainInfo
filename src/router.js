import Vue from 'vue'
import VueRouter from 'vue-router'

import Search from './components/search.vue'
import TrainTimeDetail from './components/train-time-detail.vue'

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Home',
    },
    {
      path: '/search/',
      name: 'Search',
      component: Search,
    },
    {
      path: '/trainTimeDetail',
      name: 'TrainTimeDetail',
      component: TrainTimeDetail,
    }
  ]
});
export default router;