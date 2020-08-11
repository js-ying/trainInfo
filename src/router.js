import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from './components/home.vue'
import SearchResult from './components/search-result.vue'
import TrainTimeDetail from './components/train-time-detail.vue'
import About from './components/about.vue'

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {
          path: 'search',
          name: 'SearchResult',
          component: SearchResult,
        },
        {
          path: 'train-detail',
          name: 'TrainTimeDetail',
          component: TrainTimeDetail,
        },
      ],
    },
    {
      path: '/about',
      name: 'About',
      component: About,
    }
  ]
});
export default router;