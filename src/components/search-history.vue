<template>
  <div id="search-history">
    <div>
      <h5 v-for="(historySelected, $index) in historySelectedList.slice().reverse()" :key="$index">
        <a href="#" class="badge badge-secondary" @click="setPatentSelected(historySelected)">{{ historySelected[0].stationName }} → {{ historySelected[1].stationName }}</a>
      </h5>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  data() {
    return {
      myStorage: null,
      historySelectedList: [],
    }
  },
  mounted() {
    console.log('mounted searchHistory');
    this.myStorage = window.localStorage;

    if (this.myStorage.historySelectedList) {
      this.historySelectedList = JSON.parse(this.myStorage.historySelectedList);
    }
  },
  methods: {
    setPatentSelected(historySelected) {
      this.$parent.setHistoryToSelected(historySelected);
    }
  },
}
</script>

<style scoped>

</style>