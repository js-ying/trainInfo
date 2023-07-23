<template>
  <div id="app">
    <router-view></router-view>
    <!-- 關於台鐵時刻表 icon -->
    <b-icon
      icon="info-circle-fill"
      variant="secondary"
      class="rounded-circle"
      id="about-me"
      @click="goAbout()">
    </b-icon>
  </div>
</template>

<script>
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

export default {
  name: 'App',
  components: {
  },
  data() {
    return {

    }
  },
  mounted() {
    
  },
  methods: {
    goAbout() {
      this.$router.push({ name: 'About' }).catch(() => { });
    }
  },
}
</script>

<style>
#app {
  font-family: "Helvetica Neue For Number", "Chinese Quote", -apple-system,
    BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}

.w100 {
  width: 100%;
}

.t100 {
  font-size: 100%;
}

#about-me {
  position: fixed;
  z-index: 10;
  right: 20px;
  bottom: 20px;
  font-size: 2em;
  cursor: pointer;
}

#web-title {
  cursor: pointer;
}
</style>
