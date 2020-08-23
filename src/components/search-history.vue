<template>
  <div id="search-history">
    <div>
      <h5 v-for="(historySelected, $index) in historySelectedList.slice().reverse()" :key="$index">
        <a href="#" class="badge badge-secondary" @click="setPatentSelected(historySelected)">{{ historySelected[0].stationName }} → {{ historySelected[1].stationName }}</a>
      </h5>
    </div>
    <div v-if="historySelectedList && historySelectedList.length > 0">
      <h5>
        <svg @click="removeAllHistory()" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.146-3.146a.5.5 0 0 0-.708-.708L8 7.293 4.854 4.146a.5.5 0 1 0-.708.708L7.293 8l-3.147 3.146a.5.5 0 0 0 .708.708L8 8.707l3.146 3.147a.5.5 0 0 0 .708-.708L8.707 8l3.147-3.146z"/>
        </svg>
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
    this.myStorage = window.localStorage;

    if (this.myStorage.historySelectedList) {
      this.historySelectedList = JSON.parse(this.myStorage.historySelectedList);
    }
  },
  methods: {
    setPatentSelected(historySelected) {
      this.$parent.setHistoryToSelected(historySelected);
    },
    removeAllHistory() {
      this.historySelectedList = [];
      this.myStorage.removeItem('historySelectedList');
    }
  },
}
</script>

<style scoped>
svg {
  cursor: pointer;
}
</style>