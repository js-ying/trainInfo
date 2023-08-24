<template>
  <div id="home">
    <search-area></search-area>

    <!-- 免責聲明 -->
    <div id="disclaimer" v-if="currentRoutePath === '/'">
      本站所提供之資訊僅供參考，請依照現場鐵路狀況或臺鐵官方相關管理單位所公佈之資訊為準。
    </div>
  </div>
</template>

<script>
import SearchArea from './search-area.vue';

export default {
  name: 'Home',
  components: {
    SearchArea,
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
  },
  computed: {
    currentRoutePath() {
        return this.$route.path;
    }
}
}
</script>

<style scoped>
#disclaimer {
  font-size: 0.9rem;
  padding: 0 1rem 1.2rem 1rem;
}

@media screen and (max-width: 768px) {
  #disclaimer {
    font-size: 0.8rem;
  }
}
</style>